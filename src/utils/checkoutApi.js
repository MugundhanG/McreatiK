/* ============================================
   checkoutApi
   The order/payment half of the Store API, split out
   of digitalStoreApi.js because the three calls here
   don't share one auth model and digitalStoreApi.js
   is deliberately the plain, unauthenticated
   catalog/preview module.

   Backend contract (read from CheckoutController.java,
   OrderPublicController.java and SecurityConfig.java in
   the backend worktree, not assumed):

     POST /api/v1/checkout                -> CheckoutResponse
       hasRole("CUSTOMER")  (SecurityConfig line 96)
       body: { sessionId } and NOTHING ELSE.

       CheckoutRequest.java is a one-field record. There
       is no line-item list, no productId, no price, no
       amount, no fieldValues - the backend reads the
       signed-in customer's cart from the database and
       re-prices it from the product rows, because a
       client-submitted basket is a client-submitted
       price. `sessionId` carries no authority either:
       it is only the prefix of the server-computed
       idempotency key (`sessionId + ":" + sha256(cart
       snapshot)`, see CheckoutIdempotencyKeyFactory
       .keyFor), there so two buyers with byte-identical
       carts can never collide on one key and be handed
       each other's order. Capped at
       MAX_SESSION_ID_LENGTH (63) so the composed key
       fits orders.idempotency_key(128) - see
       useCheckout.js, which owns generating/persisting
       the value.

     POST /api/v1/orders/{orderId}/verify -> OrderVerifyResponse
     GET  /api/v1/orders/{orderId}/items/{orderItemId}/download?token=...
       Both permitAll (SecurityConfig lines 88-89), and
       deliberately so: their access control is
       cryptographic, not session-based (verify needs a
       Razorpay checkout signature bound to this order's
       own razorpayOrderId; download needs the raw token,
       which is only ever handed out by verify and is
       stored server-side as a hash). A buyer whose
       session expires while the payment is in flight
       still has to be able to finish confirming a
       payment their money has already been taken for -
       so these two go through plain fetch, NOT
       customerApiFetch.

   CheckoutResponse   = { orderId, razorpayOrderId, razorpayKeyId,
                          amount, currency, items: CheckoutItemResponse[] }
   CheckoutItemResponse = { orderItemId, productId, productName,
                            unitPrice, quantity, lineAmount }

   OrderVerifyResponse = { orderId, paymentStatus, allFulfilled,
                           items: OrderVerifyItemResponse[] }
   OrderVerifyItemResponse = { orderItemId, productId, productName,
                               fulfillmentStatus, failureReason,
                               downloadToken, downloadTokenExpiresAt }

   paymentStatus:     PENDING | PAID | FAILED | REFUNDED
   fulfillmentStatus: PENDING | PROCESSING | FULFILLED | FAILED

   *** The one contract detail that bites ***
   `downloadToken` is a raw value the server can hand
   over exactly ONCE per line: only its hash is stored,
   and a FULFILLED line that already holds an unexpired
   token is deliberately NOT reissued one (rotating it
   would invalidate a link the buyer may already have
   clicked). Such a line answers with
   downloadTokenExpiresAt set and downloadToken null -
   see OrderVerifyItemResponse.java's class doc and
   OrderService.confirmPaymentAndIssueDownload. A client
   that replaces its item state wholesale on every poll
   therefore loses the download button of any item that
   finished before its siblings. StoreOrderPage.jsx's
   mergeVerifyItems is what stops that.
   ============================================ */

import { customerApiFetch } from './customerApi'
import { DigitalStoreApiError } from './digitalStoreApi'

const API_BASE = import.meta.env.VITE_API_BASE_URL

/**
 * Turns the signed-in customer's server-side cart into an Order + Razorpay order.
 * `sessionId` is the only thing the client contributes; see the header above.
 */
export async function startStoreCheckout(sessionId) {
  return customerApiFetch('/api/v1/checkout', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  })
}

/**
 * Confirms the payment and reports every line's fulfillment state. Polled while
 * `allFulfilled` is false. Plain fetch, not customerApiFetch - see the header.
 */
export async function verifyStoreOrder(orderId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const res = await fetch(`${API_BASE}/api/v1/orders/${orderId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
  })
  if (!res.ok) {
    let body = null
    try {
      body = await res.json()
    } catch {
      // No JSON body - DigitalStoreApiError falls back to a status-based message.
    }
    throw new DigitalStoreApiError(res.status, body)
  }
  return res.json()
}

/**
 * Per ITEM, not per order: the backend issues one deliverable (and one token) per
 * order item, so the route carries both ids.
 */
export function storeItemDownloadUrl(orderId, orderItemId, downloadToken) {
  return `${API_BASE}/api/v1/orders/${orderId}/items/${orderItemId}/download?token=${encodeURIComponent(downloadToken)}`
}
