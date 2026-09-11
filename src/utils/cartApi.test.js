import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchCart, addCartItem, updateCartItem, removeCartItem, clearCart } from './cartApi'
import { setAccessToken, configureAuth, CustomerApiError } from './customerApi'

const CART_RESPONSE = {
  id: 'cart-1',
  items: [
    {
      id: 'item-1',
      productId: 'p1',
      productName: 'Wedding Photography Agreement',
      productType: 'AGREEMENT_DOCUMENT',
      categoryId: 1,
      unitPrice: 99.0,
      currency: 'INR',
      quantity: 1,
      lineAmount: 99.0,
      fieldValues: { brideName: 'Jane' },
    },
  ],
  totalAmount: 99.0,
  currency: 'INR',
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
  setAccessToken(null)
  configureAuth(null, null)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchCart', () => {
  it('GETs /api/v1/cart with credentials included and returns the parsed cart', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CART_RESPONSE })

    const res = await fetchCart()

    expect(res).toEqual(CART_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/cart')
    expect(options.credentials).toBe('include')
  })

  it('attaches the Authorization header when an access token is set (same auth path as customerApi)', async () => {
    setAccessToken('access-1')
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CART_RESPONSE })

    await fetchCart()

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(options.headers.get('Authorization')).toBe('Bearer access-1')
  })
})

describe('addCartItem', () => {
  it('POSTs productId + fieldValues to /api/v1/cart/items and returns the whole refreshed cart', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CART_RESPONSE })

    const res = await addCartItem({ productId: 'p1', fieldValues: { brideName: 'Jane' } })

    expect(res).toEqual(CART_RESPONSE)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/cart/items')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ productId: 'p1', fieldValues: { brideName: 'Jane' } })
  })

  it('omits quantity from the request body when not given (backend defaults it to 1)', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CART_RESPONSE })

    await addCartItem({ productId: 'p1', fieldValues: {} })

    const [, options] = globalThis.fetch.mock.calls[0]
    expect(JSON.parse(options.body)).not.toHaveProperty('quantity')
  })

  it('surfaces a server-side field validation rejection as a CustomerApiError with a readable message', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Validation failed', fieldErrors: { brideName: 'must not be blank' } }),
    })

    await expect(addCartItem({ productId: 'p1', fieldValues: {} })).rejects.toBeInstanceOf(CustomerApiError)
    await expect(addCartItem({ productId: 'p1', fieldValues: {} })).rejects.toMatchObject({
      status: 400,
      fieldErrors: { brideName: 'must not be blank' },
    })
  })
})

describe('updateCartItem', () => {
  it('PUTs fieldValues to /api/v1/cart/items/:itemId', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => CART_RESPONSE })

    await updateCartItem('item-1', { fieldValues: { brideName: 'Jane Updated' } })

    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/cart/items/item-1')
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body)).toEqual({ fieldValues: { brideName: 'Jane Updated' } })
  })
})

describe('removeCartItem', () => {
  it('DELETEs /api/v1/cart/items/:itemId and returns the refreshed cart', async () => {
    const emptyCart = { ...CART_RESPONSE, items: [], totalAmount: 0, currency: null }
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => emptyCart })

    const res = await removeCartItem('item-1')

    expect(res).toEqual(emptyCart)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/cart/items/item-1')
    expect(options.method).toBe('DELETE')
  })
})

describe('clearCart', () => {
  it('DELETEs /api/v1/cart', async () => {
    const emptyCart = { ...CART_RESPONSE, items: [], totalAmount: 0, currency: null }
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => emptyCart })

    const res = await clearCart()

    expect(res).toEqual(emptyCart)
    const [url, options] = globalThis.fetch.mock.calls[0]
    expect(url).toMatch(/\/api\/v1\/cart$/)
    expect(options.method).toBe('DELETE')
  })
})
