import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import StoreOrderPage, { mergeVerifyItems } from './StoreOrderPage'
import * as checkoutApi from '../utils/checkoutApi'
import * as checkoutHook from '../hooks/useCheckout'

const SIGNED_OUT = { ok: false, status: 401, json: async () => ({ message: 'no session' }) }

const STORED_RECORD = {
  orderId: 'order-1',
  razorpayOrderId: 'rzp_order_1',
  razorpayPaymentId: 'pay_1',
  razorpaySignature: 'sig_1',
  amount: 148,
  currency: 'INR',
  items: [
    { orderItemId: 'oi-1', productId: 'p1', productName: 'Wedding Photography Agreement', unitPrice: 99, quantity: 1, lineAmount: 99 },
    { orderItemId: 'oi-2', productId: 'p2', productName: 'Social Media Template Pack', unitPrice: 49, quantity: 1, lineAmount: 49 },
  ],
}

/** One line of a /verify response. */
function verifyItem(orderItemId, productName, overrides = {}) {
  return {
    orderItemId,
    productId: `p-${orderItemId}`,
    productName,
    fulfillmentStatus: 'PROCESSING',
    failureReason: null,
    downloadToken: null,
    downloadTokenExpiresAt: null,
    ...overrides,
  }
}

function renderAt(orderId = 'order-1') {
  return render(
    <MemoryRouter initialEntries={[`/store/orders/${orderId}`]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/store/orders/:orderId" element={<StoreOrderPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

function storedRecord() {
  return JSON.parse(JSON.stringify(STORED_RECORD))
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn().mockResolvedValue(SIGNED_OUT)
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

/* ============================================================
   THE test. /verify hands over a line's raw downloadToken
   exactly once; every later poll of that already-fulfilled line
   answers downloadToken: null. A page that replaces its item
   state wholesale on each poll therefore deletes the download
   button of whichever item finished FIRST - silently, and only
   for multi-item orders, which is every cart this rebuild
   exists to support.
   ============================================================ */
describe('StoreOrderPage — retaining a download token across later polls that no longer carry it', () => {
  it('keeps item A\'s working download link after a second poll returns A fulfilled with downloadToken: null', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder')
      // Poll 1: A finishes first and is handed its one and only raw token. B still rendering.
      .mockResolvedValueOnce({
        orderId: 'order-1',
        paymentStatus: 'PAID',
        allFulfilled: false,
        items: [
          verifyItem('oi-1', 'Wedding Photography Agreement', {
            fulfillmentStatus: 'FULFILLED',
            downloadToken: 'tok-a',
            downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
          }),
          verifyItem('oi-2', 'Social Media Template Pack'),
        ],
      })
      // Poll 2: A is STILL fulfilled but the server cannot repeat the raw token, so it
      // sends the expiry and a null token. B is still processing.
      .mockResolvedValueOnce({
        orderId: 'order-1',
        paymentStatus: 'PAID',
        allFulfilled: false,
        items: [
          verifyItem('oi-1', 'Wedding Photography Agreement', {
            fulfillmentStatus: 'FULFILLED',
            downloadToken: null,
            downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
          }),
          verifyItem('oi-2', 'Social Media Template Pack'),
        ],
      })
      // Poll 3 onwards: unchanged, so the assertions below aren't racing a third response.
      .mockResolvedValue({
        orderId: 'order-1',
        paymentStatus: 'PAID',
        allFulfilled: false,
        items: [
          verifyItem('oi-1', 'Wedding Photography Agreement', {
            fulfillmentStatus: 'FULFILLED',
            downloadToken: null,
            downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
          }),
          verifyItem('oi-2', 'Social Media Template Pack'),
        ],
      })

    renderAt()

    // After poll 1 the button is there, pointing at the token we were just handed.
    const afterFirstPoll = await screen.findByRole('link', { name: /download/i })
    expect(afterFirstPoll).toHaveAttribute(
      'href',
      checkoutApi.storeItemDownloadUrl('order-1', 'oi-1', 'tok-a')
    )

    // Poll 2 lands.
    await vi.advanceTimersByTimeAsync(5000)
    expect(checkoutApi.verifyStoreOrder).toHaveBeenCalledTimes(2)

    // ...and A's button is STILL there, still pointing at the same, still-valid token.
    const itemA = within(screen.getByTestId('order-item-oi-1'))
    const afterSecondPoll = itemA.getByRole('link', { name: /download/i })
    expect(afterSecondPoll).toHaveAttribute(
      'href',
      checkoutApi.storeItemDownloadUrl('order-1', 'oi-1', 'tok-a')
    )
    expect(afterSecondPoll).toHaveAttribute('href', expect.stringContaining('tok-a'))

    // And it survives a third poll too - this isn't an off-by-one that would bite later.
    await vi.advanceTimersByTimeAsync(5000)
    expect(
      within(screen.getByTestId('order-item-oi-1')).getByRole('link', { name: /download/i })
    ).toHaveAttribute('href', expect.stringContaining('tok-a'))
  })

  it("one item's PROCESSING never blocks another item's finished download", async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: false,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', {
          fulfillmentStatus: 'FULFILLED',
          downloadToken: 'tok-a',
          downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
        }),
        verifyItem('oi-2', 'Social Media Template Pack'),
      ],
    })

    renderAt()

    await screen.findByRole('link', { name: /download/i })

    const itemA = within(screen.getByTestId('order-item-oi-1'))
    const itemB = within(screen.getByTestId('order-item-oi-2'))
    expect(itemA.getByRole('link', { name: /download/i })).toBeInTheDocument()
    expect(itemB.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()
    expect(itemB.getByText(/preparing/i)).toBeInTheDocument()
  })

  it('retains a captured token across a page reload (the record it persisted is what the remount reads)', async () => {
    // Direct consequence of the same constraint: the server cannot reissue the token, so
    // in-memory retention alone would lose the buyer's link on any refresh.
    const persistSpy = vi.spyOn(checkoutHook, 'persistStoredOrderItems')
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: true,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', {
          fulfillmentStatus: 'FULFILLED',
          downloadToken: 'tok-a',
          downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
        }),
        verifyItem('oi-2', 'Social Media Template Pack', {
          fulfillmentStatus: 'FULFILLED',
          downloadToken: 'tok-b',
          downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
        }),
      ],
    })

    const { unmount } = renderAt()
    await screen.findAllByRole('link', { name: /download/i })

    const [, persistedItems] = persistSpy.mock.calls.at(-1)
    expect(persistedItems.find((i) => i.orderItemId === 'oi-1').downloadToken).toBe('tok-a')
    unmount()

    // The reload: a record that now carries the merged items, and a /verify that (as it
    // must) no longer repeats either raw token.
    checkoutHook.readStoredOrderRecord.mockImplementation(() => ({
      ...storedRecord(),
      items: JSON.parse(JSON.stringify(persistedItems)),
    }))
    checkoutApi.verifyStoreOrder.mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: true,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', {
          fulfillmentStatus: 'FULFILLED',
          downloadToken: null,
          downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
        }),
        verifyItem('oi-2', 'Social Media Template Pack', {
          fulfillmentStatus: 'FULFILLED',
          downloadToken: null,
          downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
        }),
      ],
    })

    renderAt()

    expect(
      within(await screen.findByTestId('order-item-oi-1')).getByRole('link', { name: /download/i })
    ).toHaveAttribute('href', expect.stringContaining('tok-a'))
    expect(
      within(screen.getByTestId('order-item-oi-2')).getByRole('link', { name: /download/i })
    ).toHaveAttribute('href', expect.stringContaining('tok-b'))
  })
})

describe('mergeVerifyItems', () => {
  it('retains a previously-captured token when the incoming line carries null', () => {
    const previous = [{ orderItemId: 'oi-1', fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a', downloadTokenExpiresAt: '2099-01-01T00:00:00Z' }]
    const incoming = [{ orderItemId: 'oi-1', fulfillmentStatus: 'FULFILLED', downloadToken: null, downloadTokenExpiresAt: '2099-01-01T00:00:00Z' }]

    expect(mergeVerifyItems(previous, incoming)[0].downloadToken).toBe('tok-a')
  })

  it('lets the response win on status - retention is about the token, not about staleness', () => {
    const previous = [{ orderItemId: 'oi-1', fulfillmentStatus: 'PROCESSING', downloadToken: null }]
    const incoming = [{ orderItemId: 'oi-1', fulfillmentStatus: 'FAILED', failureReason: 'render blew up', downloadToken: null }]

    const merged = mergeVerifyItems(previous, incoming)
    expect(merged[0].fulfillmentStatus).toBe('FAILED')
    expect(merged[0].failureReason).toBe('render blew up')
  })

  it('takes a NEW token when one arrives, rather than clinging to an older value', () => {
    const previous = [{ orderItemId: 'oi-1', downloadToken: 'tok-old' }]
    const incoming = [{ orderItemId: 'oi-1', downloadToken: 'tok-new' }]

    expect(mergeVerifyItems(previous, incoming)[0].downloadToken).toBe('tok-new')
  })

  it('follows the response for membership and order, not the previous list', () => {
    const previous = [{ orderItemId: 'oi-1' }, { orderItemId: 'gone' }]
    const incoming = [{ orderItemId: 'oi-2' }, { orderItemId: 'oi-1' }]

    expect(mergeVerifyItems(previous, incoming).map((i) => i.orderItemId)).toEqual(['oi-2', 'oi-1'])
  })

  it('keeps snapshot-only fields the verify response does not carry (lineAmount, quantity)', () => {
    const previous = [{ orderItemId: 'oi-1', productName: 'A', lineAmount: 99, quantity: 1 }]
    const incoming = [{ orderItemId: 'oi-1', productName: 'A', fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a' }]

    const merged = mergeVerifyItems(previous, incoming)[0]
    expect(merged.lineAmount).toBe(99)
    expect(merged.quantity).toBe(1)
  })

  it('handles a first poll against an empty previous list', () => {
    expect(mergeVerifyItems([], [{ orderItemId: 'oi-1', downloadToken: 'tok-a' }])[0].downloadToken).toBe('tok-a')
  })
})

describe('StoreOrderPage — per-item states', () => {
  it('lists what was bought from the stored snapshot before the first poll returns', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockReturnValue(new Promise(() => {}))

    renderAt()

    expect(await screen.findByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()
    expect(screen.getByText(/preparing your files/i)).toBeInTheDocument()
  })

  it('shows the whole order ready once every line is fulfilled', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: true,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a' }),
        verifyItem('oi-2', 'Social Media Template Pack', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-b' }),
      ],
    })

    renderAt()

    expect(await screen.findByText(/your order is ready/i)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /download/i })).toHaveLength(2)
    // Every line settled - nothing left to poll for.
    await vi.advanceTimersByTimeAsync(5000 * 5)
    expect(checkoutApi.verifyStoreOrder).toHaveBeenCalledTimes(1)
  })

  it('reports a failed line without failing the rest of the purchase, and stops polling', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: false,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a' }),
        verifyItem('oi-2', 'Social Media Template Pack', { fulfillmentStatus: 'FAILED', failureReason: 'NullPointerException at RenderService' }),
      ],
    })

    renderAt()

    expect(await screen.findByText(/some of your items are ready/i)).toBeInTheDocument()
    expect(within(screen.getByTestId('order-item-oi-1')).getByRole('link', { name: /download/i })).toBeInTheDocument()
    expect(within(screen.getByTestId('order-item-oi-2')).getByText(/couldn't be prepared/i)).toBeInTheDocument()
    // The raw server-side exception is for the admin, not the buyer.
    expect(screen.queryByText(/NullPointerException/)).not.toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(5000 * 5)
    expect(checkoutApi.verifyStoreOrder).toHaveBeenCalledTimes(1)
  })

  it('says a fulfilled line is ready but un-downloadable here when this browser never saw its token', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: true,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', { fulfillmentStatus: 'FULFILLED', downloadToken: null, downloadTokenExpiresAt: '2099-01-01T00:00:00Z' }),
        verifyItem('oi-2', 'Social Media Template Pack', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-b' }),
      ],
    })

    renderAt()

    await screen.findByRole('link', { name: /download/i })
    const itemA = within(screen.getByTestId('order-item-oi-1'))
    expect(itemA.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()
    expect(itemA.getByText(/contact us to resend/i)).toBeInTheDocument()
  })

  it('stops after the poll cap and keeps whatever already finished downloadable', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: false,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a' }),
        verifyItem('oi-2', 'Social Media Template Pack'),
      ],
    })

    renderAt()
    await screen.findByRole('link', { name: /download/i })

    // 24 attempts at 5s = 2 minutes; advance well past the cap.
    await vi.advanceTimersByTimeAsync(5000 * 30)

    expect(await screen.findByText(/taking longer than expected/i)).toBeInTheDocument()
    expect(checkoutApi.verifyStoreOrder).toHaveBeenCalledTimes(24)
    // The stuck sibling must not take the finished item's button down with it.
    expect(within(screen.getByTestId('order-item-oi-1')).getByRole('link', { name: /download/i })).toBeInTheDocument()
  })

  it("tells a buyer on a different device we can't find the order, rather than polling with nothing", async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockReturnValue(null)
    const verifySpy = vi.spyOn(checkoutApi, 'verifyStoreOrder')

    renderAt('order-elsewhere')

    expect(await screen.findByText(/can't find this order on this device/i)).toBeInTheDocument()
    expect(screen.getByText('order-elsewhere')).toBeInTheDocument()
    expect(verifySpy).not.toHaveBeenCalled()
  })

  it('shows an error state when /verify itself fails', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockRejectedValue(new Error('network down'))

    renderAt()

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('refreshes the cart exactly once on the first PAID poll (checkout empties it server-side)', async () => {
    vi.spyOn(checkoutHook, 'readStoredOrderRecord').mockImplementation(storedRecord)
    vi.spyOn(checkoutApi, 'verifyStoreOrder').mockResolvedValue({
      orderId: 'order-1',
      paymentStatus: 'PAID',
      allFulfilled: false,
      items: [
        verifyItem('oi-1', 'Wedding Photography Agreement', { fulfillmentStatus: 'FULFILLED', downloadToken: 'tok-a' }),
        verifyItem('oi-2', 'Social Media Template Pack'),
      ],
    })

    renderAt()
    await screen.findByRole('link', { name: /download/i })
    const callsAfterFirstPoll = globalThis.fetch.mock.calls.filter(([url]) => String(url).includes('/api/v1/cart')).length

    await vi.advanceTimersByTimeAsync(5000 * 3)

    const callsLater = globalThis.fetch.mock.calls.filter(([url]) => String(url).includes('/api/v1/cart')).length
    expect(callsAfterFirstPoll).toBe(1)
    expect(callsLater).toBe(1)
  })
})
