import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import * as cartApi from '../utils/cartApi'
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

function renderPage({ fetchImpl = { ok: true, status: 200, json: async () => AUTH_RESPONSE } } = {}) {
  globalThis.fetch = vi.fn().mockResolvedValue(fetchImpl)
  return render(
    <MemoryRouter initialEntries={['/store/cart']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/store/cart" element={<StoreCartPage />} />
            <Route path="/store/login" element={<div>login page</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
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

  it('shows a clearly-marked placeholder message on "Proceed to Checkout" rather than navigating to an unbuilt route', async () => {
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue(CART_WITH_TWO_ITEMS)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /proceed to checkout/i }))

    expect(await screen.findByText(/checkout is coming soon/i)).toBeInTheDocument()
    // Still on the cart page - no navigation to a not-yet-built checkout route.
    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
  })
})
