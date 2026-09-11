import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import StoreProductPage from './StoreProductPage'
import * as api from '../utils/digitalStoreApi'
import * as cartApi from '../utils/cartApi'
import { CustomerApiError } from '../utils/customerApi'

const SIGNED_OUT_RESPONSE = { ok: false, status: 401, json: async () => ({ message: 'no session' }) }
const SIGNED_IN_RESPONSE = {
  ok: true,
  status: 200,
  json: async () => ({ accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }),
}

const CUSTOMIZABLE_CATEGORY = {
  id: 1,
  name: 'Agreements',
  slug: 'agreements',
  description: null,
  requiresCustomization: true,
  sortOrder: 0,
  status: 'PUBLISHED',
}

const NON_CUSTOM_CATEGORY = {
  id: 2,
  name: 'Templates',
  slug: 'templates',
  description: null,
  requiresCustomization: false,
  sortOrder: 1,
  status: 'PUBLISHED',
}

const CUSTOMIZABLE_PRODUCT = {
  id: 'p1',
  name: 'Wedding Photography Agreement',
  categoryId: 1,
  productType: 'AGREEMENT_DOCUMENT',
  price: 99.0,
  currency: 'INR',
  fieldSchema: {
    fields: [
      { name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 },
      {
        name: 'licenceTerms',
        type: 'string',
        label: 'Licence Terms',
        required: true,
        customerEditable: false,
        fixedValue: 'This document is licensed for personal use only.',
      },
    ],
  },
  marketingContent: null,
}

const NON_CUSTOM_PRODUCT = {
  id: 'p2',
  name: 'Social Media Template Pack',
  categoryId: 2,
  productType: 'STATIC_ASSET',
  price: 49.0,
  currency: 'INR',
  fieldSchema: null,
  marketingContent: null,
}

const EMPTY_CART = { id: 'cart-1', items: [], totalAmount: 0, currency: null }

function renderPage(productId, { fetchImpl = SIGNED_OUT_RESPONSE } = {}) {
  globalThis.fetch = vi.fn().mockResolvedValue(fetchImpl)
  return render(
    <MemoryRouter initialEntries={[`/store/products/${productId}`]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/store/products/:productId" element={<StoreProductPage />} />
            <Route path="/store/login" element={<div>login page</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(api, 'fetchDigitalStoreCategories').mockResolvedValue([CUSTOMIZABLE_CATEGORY, NON_CUSTOM_CATEGORY])
  // CartProvider fetches the cart as soon as a customer is signed in. That
  // fetch goes through cartApi.js (mocked here at the module level, same as
  // digitalStoreApi above), not through the raw fetch mock used for auth -
  // this test file cares about add-to-cart's *auth gating* and error
  // surfacing, not about what the cart already contains.
  vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(EMPTY_CART)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('StoreProductPage — branching on category.requiresCustomization', () => {
  it('renders the customization form and preview panel for a product in a requiresCustomization category', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(CUSTOMIZABLE_PRODUCT)
    renderPage('p1')

    expect(await screen.findByLabelText("Bride's Name *")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /preview my document/i })).toBeInTheDocument()
  })

  it('skips the form and preview panel entirely for a product in a non-customization category', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    renderPage('p2')

    await screen.findByRole('button', { name: /add to cart/i })

    expect(screen.queryByRole('button', { name: /preview my document/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it("still shows the product's marketing hero and price for a non-customization product", async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    renderPage('p2')

    expect(await screen.findByText('Social Media Template Pack')).toBeInTheDocument()
    expect((await screen.findAllByText('₹49')).length).toBeGreaterThan(0)
  })
})

describe('StoreProductPage — non-editable field does not block add-to-cart', () => {
  it('does not block adding to cart when only a non-editable required field is blank, once the editable fields are filled', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(CUSTOMIZABLE_PRODUCT)
    vi.spyOn(cartApi, 'addCartItem').mockResolvedValue({
      id: 'cart-1',
      items: [{ id: 'item-1', productId: 'p1', productName: CUSTOMIZABLE_PRODUCT.name, productType: 'AGREEMENT_DOCUMENT', categoryId: 1, unitPrice: 99, currency: 'INR', quantity: 1, lineAmount: 99, fieldValues: {} }],
      totalAmount: 99,
      currency: 'INR',
    })
    renderPage('p1', { fetchImpl: SIGNED_IN_RESPONSE })

    fireEvent.change(await screen.findByLabelText("Bride's Name *"), { target: { value: 'Jane' } })
    // licenceTerms (customerEditable: false, required: true) is deliberately left as its
    // disabled, pre-filled fixedValue - never touched by the "buyer".

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    await waitFor(() =>
      expect(screen.getByText(/added "wedding photography agreement" to your cart/i)).toBeInTheDocument()
    )
    expect(screen.queryByText(/please fill in all required fields/i)).not.toBeInTheDocument()
    // Task 12's addToCartPlaceholder() only logged to the console; this is the
    // real cart mutation Task 13 replaces it with - a genuine call through
    // useCart().addItem() -> cartApi.addCartItem() -> POST /api/v1/cart/items.
    // licenceTerms is never part of `fieldValues` client-side (ProductForm never
    // fires onChange for a non-editable field - see its own comment); the server
    // resolves it from the schema's fixedValue instead.
    expect(cartApi.addCartItem).toHaveBeenCalledWith({
      productId: 'p1',
      fieldValues: { brideName: 'Jane' },
    })
  })

  it('blocks adding to cart when an actually-editable required field is left blank', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(CUSTOMIZABLE_PRODUCT)
    renderPage('p1', { fetchImpl: SIGNED_IN_RESPONSE })

    await screen.findByLabelText("Bride's Name *")
    // brideName left blank.

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument()
  })
})

describe('StoreProductPage — add-to-cart is auth-gated on both branches', () => {
  it('redirects a signed-out visitor to /store/login instead of adding to cart (customizable branch)', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(CUSTOMIZABLE_PRODUCT)
    renderPage('p1', { fetchImpl: SIGNED_OUT_RESPONSE })

    fireEvent.change(await screen.findByLabelText("Bride's Name *"), { target: { value: 'Jane' } })
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
    expect(screen.queryByText(/added .* to your cart/i)).not.toBeInTheDocument()
  })

  it('redirects a signed-out visitor to /store/login instead of adding to cart (non-customizable branch)', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    renderPage('p2', { fetchImpl: SIGNED_OUT_RESPONSE })

    fireEvent.click(await screen.findByRole('button', { name: /add to cart/i }))

    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
  })

  it('adds to cart for a signed-in customer via a real cart mutation (non-customizable branch)', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    vi.spyOn(cartApi, 'addCartItem').mockResolvedValue({
      id: 'cart-1',
      items: [{ id: 'item-1', productId: 'p2', productName: NON_CUSTOM_PRODUCT.name, productType: 'STATIC_ASSET', categoryId: 2, unitPrice: 49, currency: 'INR', quantity: 1, lineAmount: 49, fieldValues: {} }],
      totalAmount: 49,
      currency: 'INR',
    })
    renderPage('p2', { fetchImpl: SIGNED_IN_RESPONSE })

    fireEvent.click(await screen.findByRole('button', { name: /add to cart/i }))

    await waitFor(() =>
      expect(screen.getByText(/added "social media template pack" to your cart/i)).toBeInTheDocument()
    )
    expect(cartApi.addCartItem).toHaveBeenCalledWith({ productId: 'p2', fieldValues: {} })
  })
})

describe('StoreProductPage — backend re-validation rejection is surfaced, not swallowed', () => {
  it('shows the backend field-validation message when add-to-cart is rejected (e.g. a stale/edited schema)', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    vi.spyOn(cartApi, 'addCartItem').mockRejectedValue(
      new CustomerApiError(400, 'brideName: must not be blank', { brideName: 'must not be blank' })
    )
    renderPage('p2', { fetchImpl: SIGNED_IN_RESPONSE })

    fireEvent.click(await screen.findByRole('button', { name: /add to cart/i }))

    expect(await screen.findByText('brideName: must not be blank')).toBeInTheDocument()
    // The rejection is shown instead of a success message, not alongside it.
    expect(screen.queryByText(/added .* to your cart/i)).not.toBeInTheDocument()
  })

  it('re-enables the button and clears the error once a rejected add-to-cart is retried', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockResolvedValue(NON_CUSTOM_PRODUCT)
    vi.spyOn(cartApi, 'addCartItem')
      // The message here is what customerApiFetch itself would have already formatted
      // from fieldErrors (see customerApi.js) - constructing it directly the same way
      // this test bypasses the real fetch layer, which cartApi.test.js covers separately.
      .mockRejectedValueOnce(new CustomerApiError(400, 'price: stale', { price: 'stale' }))
      .mockResolvedValueOnce({
        id: 'cart-1',
        items: [{ id: 'item-1', productId: 'p2', productName: NON_CUSTOM_PRODUCT.name, productType: 'STATIC_ASSET', categoryId: 2, unitPrice: 49, currency: 'INR', quantity: 1, lineAmount: 49, fieldValues: {} }],
        totalAmount: 49,
        currency: 'INR',
      })
    renderPage('p2', { fetchImpl: SIGNED_IN_RESPONSE })

    const button = await screen.findByRole('button', { name: /add to cart/i })
    fireEvent.click(button)
    expect(await screen.findByText(/price: stale/i)).toBeInTheDocument()

    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByText(/added "social media template pack" to your cart/i)).toBeInTheDocument()
    )
    expect(screen.queryByText(/price: stale/i)).not.toBeInTheDocument()
  })
})

describe('StoreProductPage — error/loading states', () => {
  it('shows a not-found message when the product fails to load', async () => {
    vi.spyOn(api, 'fetchDigitalStoreProduct').mockRejectedValue(new Error('Product missing not found'))
    renderPage('missing')

    expect(await screen.findByText(/couldn't be found/i)).toBeInTheDocument()
  })
})
