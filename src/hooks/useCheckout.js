/* ============================================
   useCheckout
   Task 14: redesigned around the CART rather than a
   single template.

   What moved to the server, and what didn't
   -----------------------------------------
   The single-product version of this hook computed the
   WHOLE idempotency key here - `sessionId + ":" +
   combinedHash(JSON.stringify(payload))` - and sent it
   as an Idempotency-Key header. That header is gone
   (SecurityConfig's CORS list says so explicitly), and
   so is POST /api/v1/orders. The backend now computes
   the key itself, from its own resolved cart snapshot:
   `sessionId + ":" + sha256(snapshot)`, see
   CheckoutIdempotencyKeyFactory.keyFor.

   The scheme is unchanged - session-scoped prefix plus
   a hash over the full snapshot - but the halves are
   split. The hash half is the server's, and has to be
   (it hashes product VERSION and the server-resolved
   field values, neither of which this client can see).
   The session half is still ours, and is the whole of
   what this hook owns:

     * stable across retries of the SAME checkout
       attempt, so a buyer who dismisses the Razorpay
       modal, hits a script-load failure, or reloads the
       page mid-payment and retries with an unchanged
       cart is handed back the SAME order rather than
       being charged for a second one;
     * distinct per buyer, so two carts that happen to
       be byte-identical (the same single product, the
       same test data) never collide on one key;
     * rotated once a payment SUCCEEDS - see
       resetCheckoutSessionId below for why that one is
       not optional.

   Persistence: sessionStorage, not a useRef
   -----------------------------------------
   The old hook held the session id in a useRef, which
   dies on reload. That was survivable when the key was
   recomputed from an on-screen form the buyer could
   simply resubmit; it isn't now. Razorpay Checkout
   navigates the page away and back on mobile/UPI
   flows, and a reload between "order created" and
   "payment done" would hand the retry a brand-new
   session id, hence a brand-new key, hence a second
   Razorpay order for a cart the buyer never changed.
   sessionStorage is the same mechanism the old hook
   already used to carry payment details across exactly
   that redirect, and it is tab-scoped and cleared on
   tab close, which is the right lifetime for "one
   buyer's current checkout attempt".
   ============================================ */

import { useState } from 'react'
import { startStoreCheckout } from '../utils/checkoutApi'
import { loadRazorpayCheckoutScript } from '../utils/razorpayScriptLoader'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { CustomerApiError } from '../utils/customerApi'

/**
 * PurchasableProductResolver (checked by OrderService.checkout for every cart line,
 * server-side, against the product's CURRENT status - a cart line is never frozen)
 * answers "may this be sold right now" with exactly two failure shapes: 404 when a
 * line's product is gone or was retired since it was added (e.g. an admin edited it
 * after it already had other orders - ProductService's append-only versioning retires
 * the old row rather than mutating it), and 400 when it still exists but nothing can
 * fulfil it yet (a STATIC_ASSET with no file uploaded). Neither response names WHICH
 * cart line failed - checkout takes no line-item payload at all, by design (see
 * checkoutApi.js's header) - so the honest thing this hook can do is recognize "this
 * is a such-and-such-item-in-your-cart problem, not a general failure" and say so,
 * rather than surfacing the raw backend string verbatim.
 */
function isCartItemAvailabilityError(err) {
  // Excludes anything carrying fieldErrors: that shape belongs to
  // ProductFieldValidationException (a stale/edited field schema on a cart line),
  // whose message is already specific and actionable and must not be masked by the
  // generic availability copy below.
  return (
    err instanceof CustomerApiError &&
    (err.status === 404 || err.status === 400) &&
    !(err.fieldErrors && Object.keys(err.fieldErrors).length > 0)
  )
}

const CART_ITEM_UNAVAILABLE_MESSAGE =
  "One or more items in your cart are no longer available — an item may have been updated or removed since you added it. Please review your cart below (remove anything that looks out of date) and try again."

const SESSION_ID_STORAGE_KEY = 'store-checkout-session-id'

/**
 * Mirrors CheckoutIdempotencyKeyFactory.MAX_SESSION_ID_LENGTH, which is itself derived
 * (128-column width minus 64 hex chars of SHA-256 minus the ":" separator), not
 * hand-picked. A longer value is a 400 from @Size validation, so anything over-long in
 * storage is regenerated rather than sent. Real ids are UUIDs at 36 characters.
 */
export const MAX_SESSION_ID_LENGTH = 63

function orderStorageKeyFor(orderId) {
  return `store-order-${orderId}`
}

/**
 * Last-resort hold for the session id when sessionStorage is unavailable (private
 * browsing, storage disabled, quota). Keeps the id stable for the life of the page so
 * an in-page retry still dedupes, even though a reload then can't.
 */
let inMemorySessionId = null

// crypto.randomUUID requires a secure context (HTTPS) and isn't available in older Safari
// (<15.4) or on a plain-HTTP LAN dev URL. Guard it so a missing implementation degrades to
// a lower-entropy-but-still-unique fallback instead of throwing. This doesn't need
// cryptographic randomness - only enough entropy that two concurrent buyers won't collide.
function generateSessionId() {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
}

/**
 * The session id for the current checkout attempt: read back from sessionStorage if one
 * is already in flight (including across a reload or a Razorpay redirect), generated and
 * persisted otherwise. Exported for direct testing of exactly that survival property.
 */
export function getOrCreateCheckoutSessionId() {
  try {
    const stored = sessionStorage.getItem(SESSION_ID_STORAGE_KEY)
    if (stored && stored.length <= MAX_SESSION_ID_LENGTH) {
      inMemorySessionId = stored
      return stored
    }
  } catch {
    // Storage unreadable - fall through to the in-memory value below.
  }

  const sessionId = inMemorySessionId ?? generateSessionId()
  inMemorySessionId = sessionId
  try {
    sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId)
  } catch {
    // Storage unwritable. The in-memory value above still makes an in-page retry dedupe.
  }
  return sessionId
}

/**
 * Ends the current checkout attempt. Called once a payment SUCCEEDS, and that call is
 * load-bearing rather than tidy-up:
 *
 * the backend's replay lookup (OrderService.checkout step 4) returns any existing order
 * matching (idempotency key, customer) REGARDLESS of whether it has already been paid.
 * Checkout empties the cart on payment, so a buyer who later re-adds the very same
 * product and checks out again produces a byte-identical server-side snapshot - and with
 * an unrotated session id, a byte-identical key. They would be handed their previous,
 * already-paid order instead of a new one. Rotating here makes every completed purchase
 * start a fresh session, which is what "the current checkout attempt" means.
 *
 * Deliberately NOT called on a dismiss or an error: those are exactly the retries the
 * stable id exists to dedupe.
 */
export function resetCheckoutSessionId() {
  inMemorySessionId = null
  try {
    sessionStorage.removeItem(SESSION_ID_STORAGE_KEY)
  } catch {
    // Nothing to do - the in-memory reset above already rotated it for this page.
  }
}

function describeOrder(order) {
  const items = order.items ?? []
  if (items.length === 1) return items[0].productName
  return `${items.length} items`
}

/**
 * Everything StoreOrderPage needs to pick up an order it didn't create in this render:
 * the Razorpay triple it must post to /verify, plus the line snapshot so the page can
 * list what was bought before the first poll comes back (the cart is emptied server-side
 * the moment payment is confirmed, so useCart() is no longer a source for this).
 */
function persistOrderRecord(order, razorpayResponse) {
  try {
    sessionStorage.setItem(
      orderStorageKeyFor(order.orderId),
      JSON.stringify({
        orderId: order.orderId,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        amount: order.amount,
        currency: order.currency,
        items: order.items ?? [],
      })
    )
  } catch {
    // A storage failure (private browsing, quota, disabled storage) must never strand a
    // buyer who has already paid - fall through to onSuccess regardless. StoreOrderPage
    // handles the missing-record case via its 'recovery_failed' state.
  }
}

export function useCheckout() {
  // 'idle' | 'creating_order' | 'awaiting_payment' | 'error'
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  async function startCheckout({ onSuccess, onCartItemUnavailable } = {}) {
    setStatus('creating_order')
    setError(null)
    try {
      // Read (not regenerated) on every call: a retry after a dismiss, a script-load
      // failure, or a reload reuses this attempt's id, so the backend recomputes the same
      // key over the same cart and returns the same order instead of creating a second.
      const sessionId = getOrCreateCheckoutSessionId()
      const order = await startStoreCheckout(sessionId)

      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.CHECKOUT_INITIATED, {
        order_id: order.orderId,
        item_count: order.items?.length ?? 0,
      })

      await loadRazorpayCheckoutScript()

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        // Razorpay wants the smallest currency unit; `amount` arrives as a JSON number
        // decoded from the order header's snapshotted BigDecimal total, so this and what
        // the gateway was asked to charge are the same figure by construction.
        order_id: order.razorpayOrderId,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency,
        name: 'McreatiK Digital Store',
        description: describeOrder(order),
        handler: (response) => {
          persistOrderRecord(order, response)
          // This attempt is over - see resetCheckoutSessionId for why leaving it in place
          // would let a later, identical cart replay this now-paid order.
          resetCheckoutSessionId()
          trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PAYMENT_SUCCESSFUL, {
            order_id: order.orderId,
            item_count: order.items?.length ?? 0,
          })
          setStatus('idle')
          onSuccess?.(order.orderId)
        },
        modal: {
          ondismiss: () => {
            // No session-id reset: a dismiss is the canonical "retry with the same cart"
            // case, and reusing the id is what makes that retry reuse the order.
            setStatus('idle')
          },
        },
      })

      setStatus('awaiting_payment')
      razorpay.open()
    } catch (err) {
      setStatus('error')
      if (isCartItemAvailabilityError(err)) {
        setError(new CustomerApiError(err.status, CART_ITEM_UNAVAILABLE_MESSAGE))
        // The cart itself was never re-synced by this failure (checkout only reads it,
        // never writes it) - the stale line is still sitting there with whatever it
        // looked like before. Re-fetching at least surfaces any price/status change
        // the caller's cart view can react to, even though the response still can't
        // say which line was the problem.
        onCartItemUnavailable?.()
      } else {
        setError(err)
      }
    }
  }

  return { status, error, startCheckout }
}

/**
 * Reads back what persistOrderRecord wrote. Returns null rather than throwing for a
 * missing, corrupted or inaccessible record - StoreOrderPage renders that as
 * 'recovery_failed' ("we can't find this order on this device").
 */
export function readStoredOrderRecord(orderId) {
  try {
    const raw = sessionStorage.getItem(orderStorageKeyFor(orderId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Writes the merged item list (download tokens included) back over the stored record, so
 * the tokens captured from the poll that first carried them survive a page reload too -
 * the server cannot reissue them, so losing them in memory would lose the buyer's
 * download link entirely. Same tab-scoped, same-origin storage that already holds this
 * order's Razorpay signature.
 */
export function persistStoredOrderItems(orderId, items) {
  try {
    const raw = sessionStorage.getItem(orderStorageKeyFor(orderId))
    if (!raw) return
    const record = JSON.parse(raw)
    sessionStorage.setItem(orderStorageKeyFor(orderId), JSON.stringify({ ...record, items }))
  } catch {
    // Storage unavailable or corrupted - in-memory state still carries the tokens for
    // this page view, which is the case that matters most.
  }
}
