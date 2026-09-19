import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startStoreCheckout, verifyStoreOrder, storeItemDownloadUrl } from './checkoutApi'
import { setAccessToken, configureAuth } from './customerApi'
import { DigitalStoreApiError } from './digitalStoreApi'

const CHECKOUT_RESPONSE = {
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

const VERIFY_RESPONSE = {
  orderId: 'order-1',
  paymentStatus: 'PAID',
  allFulfilled: false,
  items: [
    { orderItemId: 'oi-1', productId: 'p1', productName: 'A', fulfillmentStatus: 'FULFILLED', failureReason: null, downloadToken: 'tok-1', downloadTokenExpiresAt: '2099-01-01T00:00:00Z' },
    { orderItemId: 'oi-2', productId: 'p2', productName: 'B', fulfillmentStatus: 'PROCESSING', failureReason: null, downloadToken: null, downloadTokenExpiresAt: null },
  ],
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
  setAccessToken(null)
  configureAuth(null, null)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('startStoreCheckout', () => {
  it('POSTs to /api/v1/checkout and returns the order + line breakdown', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CHECKOUT_RESPONSE })

    const res = await startStoreCheckout('session-abc')

    expect(res).toEqual(CHECKOUT_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/checkout')
    expect(options.method).toBe('POST')
  })

  it('sends the session id and NOTHING else - no line items, no prices, no product ids', async () => {
    // The whole point of CheckoutRequest being a one-field record: a client-submitted
    // basket is a client-submitted price. If this body ever grows a line-item list,
    // that protection is gone, so assert on the exact body rather than on one field.
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CHECKOUT_RESPONSE })

    await startStoreCheckout('session-abc')

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ sessionId: 'session-abc' })
  })

  it('goes through the authenticated customer path (Authorization header + refresh cookie)', async () => {
    // /api/v1/checkout is hasRole("CUSTOMER") - the basket it prices is the signed-in
    // customer's, resolved from the principal, so this call must carry the session.
    setAccessToken('access-1')
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CHECKOUT_RESPONSE })

    await startStoreCheckout('session-abc')

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.headers.get('Authorization')).toBe('Bearer access-1')
    expect(options.credentials).toBe('include')
  })

  it('surfaces a rate-limit rejection rather than swallowing it', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 429, json: async () => ({ message: 'Too many requests, please slow down' }) })

    await expect(startStoreCheckout('session-abc')).rejects.toMatchObject({ status: 429 })
  })
})

describe('verifyStoreOrder', () => {
  it('POSTs the Razorpay triple and returns the per-item verify response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => VERIFY_RESPONSE })

    const res = await verifyStoreOrder('order-1', {
      razorpayOrderId: 'rzp_order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })

    expect(res).toEqual(VERIFY_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/orders/order-1/verify')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({
      razorpayOrderId: 'rzp_order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
  })

  it('does NOT go through the authenticated path - a buyer whose session expired mid-payment must still be able to confirm', async () => {
    // /verify is permitAll on purpose: its access control is the Razorpay signature,
    // which is bound to this order's own razorpayOrderId. Routing it through
    // customerApiFetch would make a confirmation the buyer has already paid for fail on
    // an expired access token, and could trigger a refresh-and-retry mid-payment.
    setAccessToken('access-1')
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => VERIFY_RESPONSE })

    await verifyStoreOrder('order-1', { razorpayOrderId: 'r', razorpayPaymentId: 'p', razorpaySignature: 's' })

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' })
  })

  it('throws DigitalStoreApiError on a rejected signature', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: 'Invalid payment signature' }) })

    await expect(
      verifyStoreOrder('order-1', { razorpayOrderId: 'r', razorpayPaymentId: 'p', razorpaySignature: 'bad' })
    ).rejects.toBeInstanceOf(DigitalStoreApiError)
  })

  it('throws (rather than hanging on res.json()) when the error response carries no JSON body', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('not json')
      },
    })

    await expect(
      verifyStoreOrder('order-1', { razorpayOrderId: 'r', razorpayPaymentId: 'p', razorpaySignature: 's' })
    ).rejects.toMatchObject({ status: 502 })
  })
})

describe('storeItemDownloadUrl', () => {
  it('addresses the item, not just the order, and url-encodes the token', () => {
    const url = storeItemDownloadUrl('order-1', 'item-9', 'a token/with+chars')

    expect(url).toContain('/api/v1/orders/order-1/items/item-9/download')
    expect(url).toContain(`token=${encodeURIComponent('a token/with+chars')}`)
  })
})
