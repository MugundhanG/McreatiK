import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthContext'
import { CartProvider, useCart } from './CartContext'

const AUTH_RESPONSE = { accessToken: 'access-1', tokenType: 'Bearer', expiresInSeconds: 900, name: 'Jane Doe' }
const SIGNED_OUT = { ok: false, status: 401, json: async () => ({ message: 'no session' }) }

const EMPTY_CART = { id: 'cart-1', items: [], totalAmount: 0, currency: null }

function Probe() {
  const { cart, itemCount, error, addItem, removeItem } = useCart()
  return (
    <div>
      <span data-testid="itemCount">{itemCount}</span>
      <span data-testid="total">{cart ? String(cart.totalAmount) : 'none'}</span>
      <span data-testid="error">{error || 'none'}</span>
      <ul data-testid="items">
        {(cart?.items ?? []).map((item) => (
          <li key={item.id} data-testid="item">
            {item.productName}:{item.unitPrice}:{JSON.stringify(item.fieldValues)}
          </li>
        ))}
      </ul>
      <button
        onClick={() => addItem({ productId: 'p1', fieldValues: { brideName: 'Jane' } }).catch(() => {})}
      >
        add
      </button>
      <button onClick={() => removeItem('item-1').catch(() => {})}>remove</button>
    </div>
  )
}

function renderWithProviders() {
  return render(
    <AuthProvider>
      <CartProvider>
        <Probe />
      </CartProvider>
    </AuthProvider>
  )
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CartProvider — no session', () => {
  it('never fetches a cart when signed out (the endpoint is auth-gated)', async () => {
    globalThis.fetch.mockResolvedValue(SIGNED_OUT) // AuthProvider's mount refresh

    renderWithProviders()

    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('none'))
    // Only the one auth refresh call - no /api/v1/cart GET was ever attempted.
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })
})

describe('CartProvider — fetches on sign-in', () => {
  it('fetches the cart once a customer is signed in', async () => {
    globalThis.fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // mount refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => EMPTY_CART }) // GET /api/v1/cart

    renderWithProviders()

    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('0'))
    const [url] = globalThis.fetch.mock.calls[1]
    expect(url).toContain('/api/v1/cart')
  })
})

describe('CartProvider — refetch-after-mutation, not optimistic', () => {
  it("addItem() sets the cart to exactly the server's response, including values the client never sent", async () => {
    const user = userEvent.setup()

    // The server-authoritative cart returned by the add-item mutation deliberately
    // differs from what a naive optimistic client would have guessed: it carries a
    // resolved licenceTerms field the request never included, a productName the
    // client never sent, and a unitPrice the client had no way to know in advance.
    // If CartContext rendered anything other than this exact object, it would mean
    // it's mutating local state instead of trusting the server's response.
    const cartAfterAdd = {
      id: 'cart-1',
      items: [
        {
          id: 'item-1',
          productId: 'p1',
          productName: 'Wedding Photography Agreement',
          productType: 'AGREEMENT_DOCUMENT',
          categoryId: 1,
          unitPrice: 149.5,
          currency: 'INR',
          quantity: 1,
          lineAmount: 149.5,
          fieldValues: { brideName: 'Jane', licenceTerms: 'Resolved server-side, never sent by the client' },
        },
      ],
      totalAmount: 149.5,
      currency: 'INR',
    }

    globalThis.fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // mount refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => EMPTY_CART }) // initial GET cart
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => cartAfterAdd }) // POST /items

    renderWithProviders()
    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('0'))

    await user.click(screen.getByText('add'))

    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('149.5'))
    expect(screen.getByTestId('itemCount').textContent).toBe('1')
    expect(screen.getByTestId('item').textContent).toBe(
      'Wedding Photography Agreement:149.5:{"brideName":"Jane","licenceTerms":"Resolved server-side, never sent by the client"}'
    )
  })

  it('addItem() surfaces a server-side validation rejection and leaves the previous cart state in place', async () => {
    const user = userEvent.setup()

    globalThis.fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // mount refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => EMPTY_CART }) // initial GET cart
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed', fieldErrors: { brideName: 'must not be blank' } }),
      }) // POST /items rejected

    renderWithProviders()
    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('0'))

    await user.click(screen.getByText('add'))

    await waitFor(() => expect(screen.getByTestId('error').textContent).toMatch(/brideName/))
    // The rejected add never changed the cart - still the empty cart from the GET.
    expect(screen.getByTestId('total').textContent).toBe('0')
    expect(screen.getByTestId('itemCount').textContent).toBe('0')
  })

  it("removeItem() sets the cart to the server's post-removal state", async () => {
    const user = userEvent.setup()
    const cartWithItem = {
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
          fieldValues: {},
        },
      ],
      totalAmount: 99,
      currency: 'INR',
    }

    globalThis.fetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => AUTH_RESPONSE }) // mount refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => cartWithItem }) // initial GET cart
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => EMPTY_CART }) // DELETE /items/item-1

    renderWithProviders()
    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('99'))

    await user.click(screen.getByText('remove'))

    await waitFor(() => expect(screen.getByTestId('total').textContent).toBe('0'))
    expect(screen.getByTestId('itemCount').textContent).toBe('0')
  })
})

describe('useCart', () => {
  it('throws when used outside a CartProvider', () => {
    function Bare() {
      useCart()
      return null
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bare />)).toThrow('useCart must be used within a CartProvider')
    spy.mockRestore()
  })
})
