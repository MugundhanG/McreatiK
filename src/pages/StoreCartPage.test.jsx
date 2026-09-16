import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import * as cartApi from '../utils/cartApi'
import * as checkoutApi from '../utils/checkoutApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'
import { resetCheckoutSessionId } from '../hooks/useCheckout'
import StoreCartPage from './StoreCartPage'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }
const SIGNED_OUT = { ok: false, status: 401, json: async () => ({ message: 'no session' }) }

const CART_WITH_TWO_ITEMS = {
  id: 'cart-1',
  items: [
    {
      id: 'item-1',
      productId: 'p1',
      productName: 'Wedding Photography Agreement',
      productType: 'AGREEMENT_DOCUMENT',
      categoryId: 1,
      unitPrice: 99,
      currency: 'INR',
      quantity: 1,
      lineAmount: 99,
      fieldValues: { brideName: 'Jane' },
    },
    {
      id: 'item-2',
      productId: 'p2',
      productName: 'Social Media Template Pack',
      productType: 'STATIC_ASSET',
      categoryId: 2,
      unitPrice: 49,
      currency: 'INR',
      quantity: 1,
      lineAmount: 49,
      fieldValues: {},
    },
  ],
  totalAmount: 148,
  currency: 'INR',
}

const EMPTY_CART = { id: 'cart-1', items: [], totalAmount: 0, currency: null }

const CHECKOUT_RESPONSE = {
  orderId: 'order-1',
  razorpayOrderId: 'rzp_order_1',
  razorpayKeyId: 'rzp_key',
  amount: 148,
  currency: 'INR',
  items: [
    { orderItemId: 'oi-1', productId: 'p1', productName: 'Wedding Photography Agreement', unitPrice: 99, quantity: 1, lineAmount: 99 },
    { orderItemId: 'oi-2', productId: 'p2', productName: 'Social Media Template Pack', unitPrice: 49, quantity: 1, lineAmount: 49 },
  ],
}

function mockRazorpay() {
  let capturedOptions = null
  class RazorpayMock {
    constructor(options) {
      capturedOptions = options
    }
    open() {}
  }
  window.Razorpay = RazorpayMock
  return { getOptions: () => capturedOptions }
}

function renderPage({ fetchImpl = { ok: true, status: 200, json: async () => AUTH_RESPONSE } } = {}) {
  globalThis.fetch = vi.fn().mockResolvedValue(fetchImpl)
  return render(
    <MemoryRouter initialEntries={['/store/cart']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/store/cart" element={<StoreCartPage />} />
            <Route path="/store/login" element={<div>login page</div>} />
            <Route path="/store/orders/:orderId" element={<div>order page for order-1</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  sessionStorage.clear()
  resetCheckoutSessionId()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('StoreCartPage — auth gating', () => {
  it('redirects a signed-out visitor to /store/login', async () => {
    renderPage({ fetchImpl: SIGNED_OUT })

    await waitFor(() => expect(screen.getByText('login page')).toBeInTheDocument())
  })
})

describe('StoreCartPage — rendering the same useCart() source of truth as the Navbar badge', () => {
  it('renders each line item, the running total, and a remove action', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    renderPage()

    expect(await screen.findByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total').textContent).toBe('₹148')
    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(2)
  })

  it('shows an empty-cart message with a link back to the catalog when there are no items', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(EMPTY_CART)
    renderPage()

    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse the store/i })).toBeInTheDocument()
  })

  it("removing an item updates the page to exactly the server's post-removal cart, not a locally-spliced guess", async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    // Server-authoritative post-removal state: not simply "the same two items minus
    // item-1" - the total here is what proves the page is trusting this response
    // rather than computing its own.
    vi.spyOn(cartApi, 'removeCartItem').mockResolvedValue({
      id: 'cart-1',
      items: [CART_WITH_TWO_ITEMS.items[1]],
      totalAmount: 49,
      currency: 'INR',
    })
    renderPage()

    await screen.findByText('Wedding Photography Agreement')
    const [removeFirst] = screen.getAllByRole('button', { name: /remove/i })
    fireEvent.click(removeFirst)

    await waitFor(() => expect(screen.queryByText('Wedding Photography Agreement')).not.toBeInTheDocument())
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total').textContent).toBe('₹49')
    expect(cartApi.removeCartItem).toHaveBeenCalledWith('item-1')
  })

})

describe('StoreCartPage — "Proceed to Checkout" (Task 14 wiring)', () => {
  it('starts the real checkout flow and routes to the order page once payment succeeds', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockResolvedValue(CHECKOUT_RESPONSE)
    vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
    const { getOptions } = mockRazorpay()
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /proceed to checkout/i }))

    await waitFor(() => expect(checkoutApi.startStoreCheckout).toHaveBeenCalledTimes(1))

    act(() => {
      getOptions().handler({
        razorpay_order_id: 'rzp_order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
      })
    })

    expect(await screen.findByText('order page for order-1')).toBeInTheDocument()
  })

  it('sends no line items - checkout is passed a session id and nothing else', async () => {
    // The cart this prices is read server-side from the database. A cart submitted from
    // here would be a price submitted from here.
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockResolvedValue(CHECKOUT_RESPONSE)
    vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
    mockRazorpay()
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /proceed to checkout/i }))

    await waitFor(() => expect(checkoutApi.startStoreCheckout).toHaveBeenCalledTimes(1))
    expect(checkoutApi.startStoreCheckout.mock.calls[0]).toHaveLength(1)
    expect(typeof checkoutApi.startStoreCheckout.mock.calls[0][0]).toBe('string')
  })

  it('surfaces a checkout failure on the cart page instead of navigating away', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockRejectedValue(
      Object.assign(new Error('Too many requests, please slow down'), { status: 429 })
    )
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /proceed to checkout/i }))

    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument()
    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
  })

  it('disables the button while an attempt is in flight so a double-click cannot fire two checkouts', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    vi.spyOn(checkoutApi, 'startStoreCheckout').mockReturnValue(new Promise(() => {}))
    renderPage()

    const button = await screen.findByRole('button', { name: /proceed to checkout/i })
    fireEvent.click(button)

    await waitFor(() => expect(screen.getByRole('button', { name: /starting checkout/i })).toBeDisabled())
    expect(checkoutApi.startStoreCheckout).toHaveBeenCalledTimes(1)
  })
})
