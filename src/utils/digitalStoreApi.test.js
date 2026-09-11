import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchDigitalStoreCategories,
  fetchDigitalStoreProducts,
  fetchDigitalStoreProduct,
  requestDigitalStorePreview,
  createDigitalStoreOrder,
  verifyDigitalStoreOrder,
  digitalStoreDownloadUrl,
  formatDigitalStorePrice,
  DigitalStoreApiError,
} from './digitalStoreApi'

const SAMPLE_CATEGORY = {
  id: 1,
  name: 'Agreements',
  slug: 'agreements',
  description: 'Photography agreements',
  requiresCustomization: true,
  sortOrder: 0,
  status: 'PUBLISHED',
}

const SAMPLE_PRODUCT = {
  id: 'product-1',
  name: 'Wedding Photography Agreement',
  categoryId: 1,
  productType: 'AGREEMENT_DOCUMENT',
  price: 99.0,
  currency: 'INR',
  fieldSchema: { fields: [{ name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 }] },
  marketingContent: null,
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchDigitalStoreCategories', () => {
  it('returns the parsed category list on success', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_CATEGORY] })

    const categories = await fetchDigitalStoreCategories()

    expect(categories).toEqual([SAMPLE_CATEGORY])
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/categories'))
  })

  it('throws DigitalStoreApiError on a non-ok response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({ message: 'boom' }) })

    await expect(fetchDigitalStoreCategories()).rejects.toThrow(DigitalStoreApiError)
  })
})

describe('fetchDigitalStoreProducts', () => {
  it('returns the parsed product list on success', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_PRODUCT] })

    const products = await fetchDigitalStoreProducts()

    expect(products).toEqual([SAMPLE_PRODUCT])
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/products'))
  })

  it('throws DigitalStoreApiError on a non-ok response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({ message: 'boom' }) })

    await expect(fetchDigitalStoreProducts()).rejects.toThrow(DigitalStoreApiError)
  })
})

describe('fetchDigitalStoreProduct', () => {
  it('finds the matching product by id from the list', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_PRODUCT] })

    const product = await fetchDigitalStoreProduct('product-1')

    expect(product).toEqual(SAMPLE_PRODUCT)
  })

  it('throws when no product matches the id', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_PRODUCT] })

    await expect(fetchDigitalStoreProduct('missing')).rejects.toThrow()
  })
})

describe('requestDigitalStorePreview', () => {
  it('POSTs fieldValues and returns the response blob on success', async () => {
    const fakeBlob = new Blob(['%PDF-'], { type: 'application/pdf' })
    globalThis.fetch.mockResolvedValue({ ok: true, blob: async () => fakeBlob })

    const blob = await requestDigitalStorePreview('product-1', { brideName: 'Jane' })

    expect(blob).toBe(fakeBlob)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/products/product-1/preview')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ fieldValues: { brideName: 'Jane' } })
  })

  it('throws DigitalStoreApiError with fieldErrors on a 400 validation response', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Validation failed', fieldErrors: { brideName: 'is required' } }),
    })

    await expect(requestDigitalStorePreview('product-1', {})).rejects.toMatchObject({
      status: 400,
      fieldErrors: { brideName: 'is required' },
    })
  })
})

describe('createDigitalStoreOrder', () => {
  it('sends the Idempotency-Key header and returns the created order', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR' }),
    })

    const order = await createDigitalStoreOrder('idem-1', {
      templateId: 'template-1', customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {},
    })

    expect(order.orderId).toBe('order-1')
    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.headers['Idempotency-Key']).toBe('idem-1')
  })

  it('throws DigitalStoreApiError on a 429 rate-limit response', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 429, json: async () => ({ message: 'slow down' }) })

    await expect(
      createDigitalStoreOrder('idem-1', { templateId: 't', customerName: 'J', customerEmail: 'j@e.com', fieldValues: {} })
    ).rejects.toMatchObject({ status: 429 })
  })
})

describe('verifyDigitalStoreOrder', () => {
  it('returns the verify response', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-1', fulfilled: true, downloadToken: 'tok', downloadTokenExpiresAt: '2026-01-01T00:00:00Z' }),
    })

    const result = await verifyDigitalStoreOrder('order-1', {
      razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })

    expect(result.fulfilled).toBe(true)
  })
})

describe('digitalStoreDownloadUrl', () => {
  it('builds a URL with the order id and url-encoded token', () => {
    const url = digitalStoreDownloadUrl('order-1', 'a token/with-chars')

    expect(url).toContain('/api/v1/orders/order-1/download')
    expect(url).toContain(`token=${encodeURIComponent('a token/with-chars')}`)
  })
})

describe('formatDigitalStorePrice', () => {
  it('formats a whole-number INR price with the rupee symbol and no decimals', () => {
    expect(formatDigitalStorePrice('INR', 99.0)).toBe('₹99')
  })

  it('formats a fractional INR price with 2 decimals', () => {
    expect(formatDigitalStorePrice('INR', 99.5)).toBe('₹99.50')
  })

  it('falls back to showing the currency code as-is for a non-INR currency', () => {
    expect(formatDigitalStorePrice('USD', 49)).toBe('USD 49')
  })
})
