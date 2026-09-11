import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import * as cartApi from '../../utils/cartApi'
import StoreNavbar from './Navbar'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }
const SIGNED_OUT = { ok: false, status: 401, json: async () => ({ message: 'no session' }) }

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <StoreNavbar />
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

describe('StoreNavbar — cart badge', () => {
  it('shows no cart badge and no cart link when signed out', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(SIGNED_OUT)
    renderNavbar()

    await waitFor(() => expect(screen.getByText('Log In')).toBeInTheDocument())
    expect(screen.queryByLabelText(/cart, \d+ item/i)).not.toBeInTheDocument()
  })

  it('shows a cart link with no numeric badge when signed in with an empty cart', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue({ id: 'cart-1', items: [], totalAmount: 0, currency: null })
    renderNavbar()

    const cartLink = await screen.findByLabelText('Cart, 0 items')
    expect(cartLink).toBeInTheDocument()
  })

  it("reflects useCart()'s item count once the cart has items", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => AUTH_RESPONSE })
    vi.spyOn(cartApi, 'fetchCart').mockResolvedValue({
      id: 'cart-1',
      items: [
        { id: 'i1', productId: 'p1', productName: 'A', productType: 'STATIC_ASSET', categoryId: 1, unitPrice: 10, currency: 'INR', quantity: 1, lineAmount: 10, fieldValues: {} },
        { id: 'i2', productId: 'p2', productName: 'B', productType: 'STATIC_ASSET', categoryId: 1, unitPrice: 20, currency: 'INR', quantity: 1, lineAmount: 20, fieldValues: {} },
      ],
      totalAmount: 30,
      currency: 'INR',
    })
    renderNavbar()

    const cartLink = await screen.findByLabelText('Cart, 2 items')
    expect(cartLink.textContent).toContain('2')
  })
})
