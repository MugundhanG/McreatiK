import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCheckout, readStoredPaymentDetails } from './useCheckout'
import * as api from '../utils/digitalStoreApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'

const TEMPLATE = { id: 'template-1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR' }

beforeEach(() => {
  sessionStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
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

describe('useCheckout', () => {
  it('goes idle -> creating_order -> awaiting_payment and opens Razorpay on a successful order creation', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { openMock } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('awaiting_payment')
    expect(openMock).toHaveBeenCalledTimes(1)
  })

  it('reuses the same idempotency key across two calls to startCheckout with identical payloads (e.g. a network-level retry, no dismiss in between)', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const details = { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} }

    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })
    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(firstKey).toBe(secondKey)
  })

  it('persists payment details to sessionStorage and calls onSuccess when Razorpay reports success', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess }
      )
    })

    act(() => {
      getOptions().handler({
        razorpay_order_id: 'rzp_order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
      })
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
    const stored = JSON.parse(sessionStorage.getItem('digital-store-order-order-1'))
    expect(stored).toEqual({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    expect(result.current.status).toBe('idle')
  })

  it('returns to idle when the buyer dismisses the Razorpay modal', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    act(() => {
      getOptions().modal.ondismiss()
    })

    expect(result.current.status).toBe('idle')
  })

  it('reuses the same idempotency key when the buyer dismisses the modal and retries with the SAME payload (order is reused, no duplicate)', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const details = { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} }

    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })

    act(() => {
      getOptions().modal.ondismiss()
    })

    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(secondKey).toBe(firstKey)
  })

  it('generates a DIFFERENT idempotency key when the buyer retries (after a dismiss, or any other failure) with an EDITED payload', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    act(() => {
      getOptions().modal.ondismiss()
    })

    // Buyer edits a field before retrying - not just a bare retry of the same request.
    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane+updated@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(secondKey).not.toBe(firstKey)
  })

  it('generates a DIFFERENT idempotency key on retry after a non-dismiss failure (e.g. Razorpay script load or construction throwing) when the payload changed', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    // First attempt fails after order creation succeeds - e.g. a network blip loading the
    // Razorpay script. This is exactly the case the old dismiss-only reset missed: nothing
    // resets a cached key here, but the new design doesn't cache one to begin with.
    vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockRejectedValueOnce(new Error('script load failed'))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('error')

    mockRazorpayCapturingOptions()
    // Buyer edits a field before retrying.
    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: { note: 'please gift wrap' } },
        { onSuccess: vi.fn() }
      )
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(secondKey).not.toBe(firstKey)
  })

  it('still calls onSuccess when persisting payment details to sessionStorage throws', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const onSuccess = vi.fn()
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess }
      )
    })

    act(() => {
      getOptions().handler({
        razorpay_order_id: 'rzp_order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
      })
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
    expect(result.current.status).toBe('idle')

    setItemSpy.mockRestore()
  })

  it('sets status to error and captures the error when order creation fails', async () => {
    const failure = Object.assign(new Error('rate limited'), { status: 429 })
    vi.spyOn(api, 'createDigitalStoreOrder').mockRejectedValue(failure)
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe(failure)
  })
})

describe('readStoredPaymentDetails', () => {
  it('returns null (not throwing) when the stored value is corrupted JSON', () => {
    sessionStorage.setItem('digital-store-order-order-1', 'not-valid-json{')

    expect(readStoredPaymentDetails('order-1')).toBeNull()
  })

  it('returns null (not throwing) when sessionStorage access fails', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })

    expect(readStoredPaymentDetails('order-1')).toBeNull()

    getItemSpy.mockRestore()
  })
})
