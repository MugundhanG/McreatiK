import { useRef, useState } from 'react'
import { createDigitalStoreOrder } from '../utils/digitalStoreApi'
import { loadRazorpayCheckoutScript } from '../utils/razorpayScriptLoader'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'

function sessionStorageKeyFor(orderId) {
  return `digital-store-order-${orderId}`
}

// Deterministic, synchronous string hash (djb2-xor variant). Not cryptographic - it only needs to
// be deterministic and reasonably collision-resistant so identical checkout payloads dedupe to the
// same idempotency key while edited payloads land on a different one. Runs on JSON.stringify(payload).
function djb2Hash(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  // >>> 0 coerces to an unsigned 32-bit int so the result is a stable, non-negative string.
  return (hash >>> 0).toString(16)
}

// Second, independent string hash (sdbm). Combined with djb2-xor below to widen the effective
// hash space to ~64 bits: two different 32-bit mixers are far less likely to collide on the same
// near-identical mutated payload at the same time than either mixer alone. Still not cryptographic
// - just meaningfully more collision-resistant than a single 32-bit hash for this use case.
function sdbmHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
  }
  return (hash >>> 0).toString(16)
}

// Exported (in addition to being used internally) so its determinism can be unit-tested directly,
// without going through the full startCheckout flow.
export function hashString(str) {
  return `${djb2Hash(str)}${sdbmHash(str)}`
}

function computeIdempotencyKey(sessionId, payload) {
  return `${sessionId}:${hashString(JSON.stringify(payload))}`
}

// crypto.randomUUID requires a secure context (HTTPS) and isn't available in older Safari
// (<15.4) or on a plain-HTTP LAN dev URL. Guard it so a missing implementation degrades to a
// lower-entropy-but-still-unique fallback instead of throwing during render (which would crash
// the whole product page rather than surface as a checkout-time error). The fallback doesn't need
// cryptographic randomness - only enough entropy that two concurrent sessions won't collide by chance.
function generateSessionId() {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
}

export function useCheckout(template) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  // A random ID generated once per hook instance (mount). This is NOT the idempotency key by
  // itself - it exists purely so two different buyers can never collide on the same key even if
  // they submit identical form data (e.g. both testing with "Test Buyer" / "test@test.com").
  // useRef(generateSessionId()) evaluates the initializer on every render but React only keeps the
  // value from the first render, so this is safe and simpler than a lazy-init pattern.
  const sessionIdRef = useRef(generateSessionId())

  async function startCheckout({ customerName, customerEmail, fieldValues }, { onSuccess }) {
    setStatus('creating_order')
    setError(null)
    try {
      const payload = { templateId: template.id, customerName, customerEmail, fieldValues }
      // Recomputed fresh from the actual request content on every call: resubmitting the same
      // payload (after a dismiss, a script-load failure, a Razorpay-construction failure, or any
      // other retry) reuses the same key/order, while an edited payload gets a fresh one.
      const idempotencyKey = computeIdempotencyKey(sessionIdRef.current, payload)
      const order = await createDigitalStoreOrder(idempotencyKey, payload)

      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.CHECKOUT_INITIATED, { template_id: template.id })

      await loadRazorpayCheckoutScript()

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        order_id: order.razorpayOrderId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: 'McreatiK Studios',
        description: template.name,
        handler: (response) => {
          const paymentDetails = {
            orderId: order.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }
          try {
            sessionStorage.setItem(sessionStorageKeyFor(order.orderId), JSON.stringify(paymentDetails))
          } catch {
            // A storage failure (private browsing, quota exceeded, disabled storage, etc.) must
            // never strand a buyer who has already paid - fall through to onSuccess regardless.
            // DigitalStoreOrderPage handles the missing-details case gracefully via 'recovery_failed'.
          }
          trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PAYMENT_SUCCESSFUL, {
            template_id: template.id,
            order_id: order.orderId,
          })
          setStatus('idle')
          onSuccess(order.orderId)
        },
        modal: {
          ondismiss: () => {
            setStatus('idle')
            // No key reset needed: the idempotency key is derived fresh from the payload on every
            // startCheckout call, so a same-payload retry naturally reuses this order and an
            // edited-payload retry naturally gets a new one.
          },
        },
      })

      setStatus('awaiting_payment')
      razorpay.open()
    } catch (err) {
      setStatus('error')
      setError(err)
    }
  }

  return { status, error, startCheckout }
}

export function readStoredPaymentDetails(orderId) {
  try {
    const raw = sessionStorage.getItem(sessionStorageKeyFor(orderId))
    return raw ? JSON.parse(raw) : null
  } catch {
    // Corrupted JSON or inaccessible storage - treat exactly like "no stored details",
    // which DigitalStoreOrderPage already handles via its 'recovery_failed' state.
    return null
  }
}
