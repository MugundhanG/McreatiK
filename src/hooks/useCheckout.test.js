import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useCheckout,
  getOrCreateCheckoutSessionId,
  resetCheckoutSessionId,
  readStoredOrderRecord,
  persistStoredOrderItems,
  MAX_SESSION_ID_LENGTH,
} from './useCheckout'
import * as checkoutApi from '../utils/checkoutApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'

const SESSION_ID_STORAGE_KEY = 'store-checkout-session-id'

const ORDER = {
  orderId: 'order-1',
  razorpayOrderId: 'rzp_order_1',
  razorpayKeyId: 'rzp_key',
  amount: 148.0,
  currency: 'INR',
  items: [
    { orderItemId: 'oi-1', productId: 'p1', productName: 'Wedding Photography Agreement', unitPrice: 99, quantity: 1, lineAmount: 99 },
    { orderItemId: 'oi-2', productId: 'p2', productName: 'Social Media Template Pack', unitPrice: 49, quantity: 1, lineAmount: 49 },
  ],
}

const RAZORPAY_SUCCESS = {
  razorpay_order_id: 'rzp_order_1',
  razorpay_payment_id: 'pay_1',
  razorpay_signature: 'sig_1',
}

beforeEach(() => {
  sessionStorage.clear()
  // Also drops the module-level in-memory fallback, so one test's session id can never
  // leak into the next through it.
  resetCheckoutSessionId()
  vi.restoreAllMocks()
  vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function mockRazorpayCapturingOptions() {
  let capturedOptions = null
  const openMock = vi.fn()
  class RazorpayMock {
    constructor(options) {
      capturedOptions = options
    }
    open() {
      return openMock()
    }
  }
  window.Razorpay = RazorpayMock
  return { getOptions: () => capturedOptions, openMock }
}

function mockCheckoutOk() {
  return vi.spyOn(checkoutApi, 'startStoreCheckout').mockResolvedValue(ORDER)
}

describe('useCheckout — the checkout call itself', () => {
  it('goes idle -> awaiting_payment and opens Razorpay on a successful checkout', async () => {
    mockCheckoutOk()
    const { openMock } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(result.current.status).toBe('awaiting_payment')
    expect(openMock).toHaveBeenCalledTimes(1)
  })

  it('sends ONLY a session id - the cart is never submitted from the client', async () => {
    // The backend prices the basket it reads from the database for the authenticated
    // customer. startStoreCheckout takes a single string argument precisely so there is
    // no shape in which this hook could name what the buyer is charged for.
    const checkoutSpy = mockCheckoutOk()
    mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(checkoutSpy).toHaveBeenCalledTimes(1)
    const args = checkoutSpy.mock.calls[0]
    expect(args).toHaveLength(1)
    expect(typeof args[0]).toBe('string')
  })

  it('hands Razorpay the server-issued order id, key and amount in paise', async () => {
    mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    const options = getOptions()
    expect(options.order_id).toBe('rzp_order_1')
    expect(options.key).toBe('rzp_key')
    expect(options.amount).toBe(14800)
    expect(options.currency).toBe('INR')
    // Multi-item orders can't be described by one product name.
    expect(options.description).toBe('2 items')
  })

  it('describes a single-item order by its product name', async () => {
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockResolvedValue({ ...ORDER, items: [ORDER.items[0]] })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(getOptions().description).toBe('Wedding Photography Agreement')
  })

  it('sets status to error and captures the error when checkout fails', async () => {
    const failure = Object.assign(new Error('Too many requests, please slow down'), { status: 429 })
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockRejectedValue(failure)
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe(failure)
  })

  it('sets status to error when the Razorpay script fails to load after the order was created', async () => {
    mockCheckoutOk()
    scriptLoader.loadRazorpayCheckoutScript.mockRejectedValueOnce(new Error('script load failed'))
    const { result } = renderHook(() => useCheckout())
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout({ onSuccess })
    })

    expect(result.current.status).toBe('error')
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

describe('useCheckout — session id (the half of the idempotency key this client owns)', () => {
  it('SURVIVES A RELOAD: a fresh module instance reads the same id back out of sessionStorage', async () => {
    // A reload throws away every module-level variable but keeps the tab's
    // sessionStorage. vi.resetModules() + a fresh import reproduces exactly that, which
    // a useRef-held id (the single-product version's mechanism) would not survive -
    // and a new id means a new idempotency key, hence a SECOND Razorpay order for a
    // cart the buyer never changed.
    vi.resetModules()
    const before = await import('./useCheckout')
    const idBeforeReload = before.getOrCreateCheckoutSessionId()

    vi.resetModules()
    const after = await import('./useCheckout')

    expect(after).not.toBe(before)
    expect(after.getOrCreateCheckoutSessionId()).toBe(idBeforeReload)
  })

  it('control: with sessionStorage cleared in between, the reloaded module does NOT reuse the id', async () => {
    // Proves the test above is actually exercising sessionStorage rather than a module
    // cache that vi.resetModules() failed to drop.
    vi.resetModules()
    const before = await import('./useCheckout')
    const idBeforeReload = before.getOrCreateCheckoutSessionId()

    sessionStorage.clear()

    vi.resetModules()
    const after = await import('./useCheckout')

    expect(after.getOrCreateCheckoutSessionId()).not.toBe(idBeforeReload)
  })

  it('persists the id under a stable key so a reload can find it', () => {
    const id = getOrCreateCheckoutSessionId()

    expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBe(id)
  })

  it('generates an id within the length the backend accepts', () => {
    // Longer than MAX_SESSION_ID_LENGTH is a 400 from @Size, and the ceiling exists
    // because sessionId + ":" + sha256hex has to fit orders.idempotency_key(128).
    expect(getOrCreateCheckoutSessionId().length).toBeLessThanOrEqual(MAX_SESSION_ID_LENGTH)
  })

  it('regenerates rather than sending back an over-long id found in storage', () => {
    sessionStorage.setItem(SESSION_ID_STORAGE_KEY, 'x'.repeat(MAX_SESSION_ID_LENGTH + 1))

    const id = getOrCreateCheckoutSessionId()

    expect(id.length).toBeLessThanOrEqual(MAX_SESSION_ID_LENGTH)
  })

  it('REUSES the id when the buyer dismisses the modal and retries - the same cart must reuse the order, not create a second', async () => {
    const checkoutSpy = mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })
    act(() => {
      getOptions().modal.ondismiss()
    })
    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(checkoutSpy.mock.calls[0][0]).toBe(checkoutSpy.mock.calls[1][0])
  })

  it('REUSES the id on a retry after a failure (no dismiss) - that is the case the stable id exists for', async () => {
    const checkoutSpy = mockCheckoutOk()
    scriptLoader.loadRazorpayCheckoutScript.mockRejectedValueOnce(new Error('script load failed'))
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })
    expect(result.current.status).toBe('error')

    mockRazorpayCapturingOptions()
    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })

    expect(checkoutSpy.mock.calls[0][0]).toBe(checkoutSpy.mock.calls[1][0])
  })

  it('ROTATES the id once a payment succeeds, so a later identical cart cannot replay the paid order', async () => {
    // The backend's replay lookup returns a matching order regardless of whether it has
    // been paid. Checkout empties the cart, so re-adding the same product produces a
    // byte-identical server-side snapshot - with an unrotated session id, an identical
    // key, and the buyer would be handed back their previous, already-paid order.
    mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })
    const idDuringAttempt = sessionStorage.getItem(SESSION_ID_STORAGE_KEY)

    act(() => {
      getOptions().handler(RAZORPAY_SUCCESS)
    })

    expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBeNull()
    expect(getOrCreateCheckoutSessionId()).not.toBe(idDuringAttempt)
  })

  it('does NOT rotate the id on a dismiss', async () => {
    mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())

    await act(async () => {
      await result.current.startCheckout({ onSuccess: vi.fn() })
    })
    const idDuringAttempt = sessionStorage.getItem(SESSION_ID_STORAGE_KEY)

    act(() => {
      getOptions().modal.ondismiss()
    })

    expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBe(idDuringAttempt)
    expect(result.current.status).toBe('idle')
  })

  it('still returns a stable id for an in-page retry when sessionStorage is unwritable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })

    const first = getOrCreateCheckoutSessionId()
    const second = getOrCreateCheckoutSessionId()

    expect(first).toBeTruthy()
    expect(second).toBe(first)
  })
})

describe('useCheckout — handing the order to StoreOrderPage', () => {
  it('persists the Razorpay triple AND the line snapshot, then calls onSuccess with the order id', async () => {
    mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout({ onSuccess })
    })
    act(() => {
      getOptions().handler(RAZORPAY_SUCCESS)
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
    expect(readStoredOrderRecord('order-1')).toEqual({
      orderId: 'order-1',
      razorpayOrderId: 'rzp_order_1',
      razorpayPaymentId: 'pay_1',
      razorpaySignature: 'sig_1',
      amount: 148.0,
      currency: 'INR',
      // The cart is emptied server-side on payment, so this snapshot is the only way the
      // order page can list what was bought before the first poll returns.
      items: ORDER.items,
    })
    expect(result.current.status).toBe('idle')
  })

  it('still calls onSuccess when persisting throws - a buyer who has already paid must never be stranded', async () => {
    mockCheckoutOk()
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout())
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout({ onSuccess })
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    act(() => {
      getOptions().handler(RAZORPAY_SUCCESS)
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
  })
})

describe('readStoredOrderRecord / persistStoredOrderItems', () => {
  it('returns null (not throwing) when the stored value is corrupted JSON', () => {
    sessionStorage.setItem('store-order-order-1', 'not-valid-json{')

    expect(readStoredOrderRecord('order-1')).toBeNull()
  })

  it('returns null (not throwing) when sessionStorage access fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })

    expect(readStoredOrderRecord('order-1')).toBeNull()
  })

  it('returns null for an order this device never saw', () => {
    expect(readStoredOrderRecord('order-elsewhere')).toBeNull()
  })

  it('writes merged items back over the stored record without disturbing the Razorpay triple', () => {
    sessionStorage.setItem(
      'store-order-order-1',
      JSON.stringify({
        orderId: 'order-1',
        razorpayOrderId: 'rzp_order_1',
        razorpayPaymentId: 'pay_1',
        razorpaySignature: 'sig_1',
        amount: 148,
        currency: 'INR',
        items: [{ orderItemId: 'oi-1', productName: 'A' }],
      })
    )

    persistStoredOrderItems('order-1', [
      { orderItemId: 'oi-1', productName: 'A', fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-1' },
    ])

    const record = readStoredOrderRecord('order-1')
    // The token has to outlive a reload: the server stores only its hash and will never
    // hand the raw value over again.
    expect(record.items[0].downloadToken).toBe('tok-1')
    expect(record.razorpaySignature).toBe('sig_1')
  })

  it('is a no-op (not a throw, not a half-record) when there is no stored record to merge into', () => {
    expect(() => persistStoredOrderItems('order-missing', [{ orderItemId: 'oi-1' }])).not.toThrow()

    expect(sessionStorage.getItem('store-order-order-missing')).toBeNull()
  })
})
