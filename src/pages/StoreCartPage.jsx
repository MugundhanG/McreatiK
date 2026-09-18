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
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import StoreCard from '../components/store/StoreCard'
import StoreIconBadge from '../components/store/StoreIconBadge'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRequireAuthOrRedirect } from '../hooks/useRequireAuthOrRedirect'
import { useCheckout } from '../hooks/useCheckout'
import { formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

function CartSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="card-store p-5 flex items-center justify-between animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-black/5 rounded w-40" />
            <div className="h-3 bg-black/5 rounded w-24" />
          </div>
          <div className="h-4 bg-black/5 rounded w-16" />
        </div>
      ))}
    </div>
  )
}

export default function StoreCartPage() {
  const { loading: authLoading } = useAuth()
  const requireAuthOrRedirect = useRequireAuthOrRedirect()
  const { cart, loading: cartLoading, error, removeItem, refresh: refreshCart } = useCart()
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
    startCheckout({
      onSuccess: (orderId) => navigate(`/store/orders/${orderId}`),
      onCartItemUnavailable: () => {
        refreshCart().catch(() => {
          // Already recorded on CartContext's own `error` state; nothing else to do.
        })
      },
    })
  }

  if (authLoading || cartLoading) {
    return (
      <StorePageShell>
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          <h1 className="font-display text-3xl font-bold mb-8 text-[#17151f]">Your Cart</h1>
          <CartSkeleton />
        </div>
      </StorePageShell>
    )
  }

  const items = cart?.items ?? []
  const checkoutBusy = checkoutStatus === 'creating_order' || checkoutStatus === 'awaiting_payment'

  return (
    <StorePageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <h1 className="font-display text-3xl font-bold mb-8 text-[#17151f]">Your Cart</h1>

        {error ? <p className="text-red-600 mb-6">{error}</p> : null}

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 flex flex-col items-center gap-4"
          >
            <StoreIconBadge icon={FiShoppingBag} size="lg" />
            <p className="text-[#4b4a55]">Your cart is empty.</p>
            {/* Client-side nav, not Button's own href path - Button.jsx's href renders a
                plain <a>, which is only ever used for anchors/external links elsewhere in
                this app (see Hero.jsx, Navbar.jsx); a real Link keeps this in-SPA. */}
            <Link
              to="/store"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide bg-[var(--store-accent)] text-white shadow-sm shadow-[var(--store-accent)]/25 hover:bg-[var(--store-accent-hover)] transition-all duration-300"
            >
              Browse the Store
            </Link>
          </motion.div>
        ) : (
          <>
            <ul className="space-y-3 mb-8">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                  >
                    <StoreCard hover={false} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#17151f]">{item.productName}</p>
                        <p className="text-sm text-[#7a7887]">
                          {formatDigitalStorePrice(item.currency, item.unitPrice)}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-[#17151f]">{formatDigitalStorePrice(item.currency, item.lineAmount)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingItemId === item.id}
                          aria-label={removingItemId === item.id ? 'Removing…' : 'Remove'}
                          title="Remove"
                          className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </StoreCard>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-semibold text-[#17151f]">Total</span>
              <span data-testid="cart-total" className="font-display text-2xl font-bold text-[#17151f]">
                {formatDigitalStorePrice(cart.currency, cart.totalAmount)}
              </span>
            </div>

            {/* Disabled while an attempt is in flight so a double-click can't fire two
                checkouts. That's belt-and-braces rather than the actual safeguard: the
                session id is stable across retries, so the backend recomputes the same
                idempotency key and hands back the SAME order either way. */}
            <Button theme="store" onClick={handleProceedToCheckout} disabled={checkoutBusy} className="w-full">
              {checkoutBusy ? 'Starting checkout...' : 'Proceed to Checkout'}
            </Button>
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
