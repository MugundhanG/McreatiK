/* ============================================
   StoreCartPage
   Task 13: the buyer's own cart - line items, a
   remove action per line, a running total, and a
   proceed-to-checkout button. Reads everything from
   useCart() (CartContext), the same source of truth
   the Navbar badge reads from, so this page and the
   badge can never show different counts.

   No quantity stepper: CartItem.quantity is documented
   (CartItem.java) as forward-compatibility only - every
   category is single-licence today, so every line's
   quantity is always 1 - and CartItemUpdateRequest
   requires re-submitting fieldValues alongside any
   quantity change, which this page has no schema-aware
   form to do safely. Exposing a stepper that can't
   actually change anything meaningful yet would be
   worse than not having one.

   "Proceed to checkout" was a placeholder through Task
   13 and is now wired to the real flow: useCheckout()
   posts the session id to /api/v1/checkout (the cart
   itself is read server-side - this page sends no line
   items), opens Razorpay, and on payment routes to
   /store/orders/:orderId. Everything else on this page
   is Task 13's and untouched.
   ============================================ */

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StorePageShell from '../components/layout/StorePageShell'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRequireAuthOrRedirect } from '../hooks/useRequireAuthOrRedirect'
import { useCheckout } from '../hooks/useCheckout'
import { formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

export default function StoreCartPage() {
  const { loading: authLoading } = useAuth()
  const requireAuthOrRedirect = useRequireAuthOrRedirect()
  const { cart, loading: cartLoading, error, removeItem } = useCart()
  const { status: checkoutStatus, error: checkoutError, startCheckout } = useCheckout()
  const navigate = useNavigate()
  const [removingItemId, setRemovingItemId] = useState(null)

  useSEO({
    title: 'Your Cart | McreatiK Digital Store',
    description: 'Review your items before checkout.',
    path: '/store/cart',
  })

  // The cart page has nothing to show a signed-out visitor - there's no cart
  // without a signed-in customer (the endpoint is auth-gated). Unlike
  // add-to-cart, which is one action on an otherwise-public page,
  // this whole page's purpose requires being signed in, so redirecting on
  // mount (rather than only at a specific click) is the right call here.
  useEffect(() => {
    requireAuthOrRedirect(() => {})
  }, [requireAuthOrRedirect])

  async function handleRemove(itemId) {
    setRemovingItemId(itemId)
    try {
      await removeItem(itemId)
    } catch {
      // CartContext already recorded the error in its own `error` state.
    } finally {
      setRemovingItemId(null)
    }
  }

  // No payload: /api/v1/checkout takes a session id and nothing else, and reads the
  // basket from the database for the authenticated customer. Deliberately so - a
  // client-submitted basket is a client-submitted price (CheckoutRequest.java). The
  // CHECKOUT_INITIATED analytics event moved into useCheckout for the same reason: only
  // there is the server-resolved order (and its real item count) actually known.
  function handleProceedToCheckout() {
    startCheckout({ onSuccess: (orderId) => navigate(`/store/orders/${orderId}`) })
  }

  if (authLoading || cartLoading) {
    return (
      <StorePageShell>
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20 text-center text-gray-500">Loading your cart...</div>
      </StorePageShell>
    )
  }

  const items = cart?.items ?? []
  const checkoutBusy = checkoutStatus === 'creating_order' || checkoutStatus === 'awaiting_payment'

  return (
    <StorePageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {error ? <p className="text-red-600 mb-6">{error}</p> : null}

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link
              to="/store"
              className="inline-block bg-[#8B7FE8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7A6DE0]"
            >
              Browse the Store
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 border-y border-gray-200 mb-8">
              {items.map((item) => (
                <li key={item.id} className="py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {formatDigitalStorePrice(item.currency, item.unitPrice)}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatDigitalStorePrice(item.currency, item.lineAmount)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingItemId === item.id}
                      className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {removingItemId === item.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-semibold">Total</span>
              <span data-testid="cart-total" className="text-2xl font-bold">
                {formatDigitalStorePrice(cart.currency, cart.totalAmount)}
              </span>
            </div>

            {/* Disabled while an attempt is in flight so a double-click can't fire two
                checkouts. That's belt-and-braces rather than the actual safeguard: the
                session id is stable across retries, so the backend recomputes the same
                idempotency key and hands back the SAME order either way. */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={checkoutBusy}
              className="w-full bg-[#8B7FE8] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7A6DE0] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutBusy ? 'Starting checkout...' : 'Proceed to Checkout'}
            </button>
            {checkoutError ? (
              <p className="text-red-600 mt-3 text-center">
                {checkoutError.message || "We couldn't start checkout. Please try again."}
              </p>
            ) : null}
          </>
        )}
      </div>
    </StorePageShell>
  )
}
