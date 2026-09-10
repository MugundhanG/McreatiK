import { useRef, useState } from 'react'
import { createDigitalStoreOrder } from '../utils/digitalStoreApi'
import { loadRazorpayCheckoutScript } from '../utils/razorpayScriptLoader'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'

function sessionStorageKeyFor(orderId) {
  return `digital-store-order-${orderId}`
}

// Deterministic, synchronous string hash (djb2). Not cryptographic - it only needs to be
// deterministic and reasonably collision-resistant so identical checkout payloads dedupe to the
// same idempotency key while edited payloads land on a different one. Runs on JSON.stringify(payload).
function hashString(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  // >>> 0 coerces to an unsigned 32-bit int so the result is a stable, non-negative string.
  return (hash >>> 0).toString(16)
}

function computeIdempotencyKey(sessionId, payload) {
  return `${sessionId}:${hashString(JSON.stringify(payload))}`
}

export function useCheckout(template) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  // A random UUID generated once per hook instance (mount). This is NOT the idempotency key by
  // itself - it exists purely so two different buyers can never collide on the same key even if
  // they submit identical form data (e.g. both testing with "Test Buyer" / "test@test.com").
  // useRef(crypto.randomUUID()) evaluates the initializer on every render but React only keeps the
  // value from the first render, so this is safe and simpler than a lazy-init pattern.
  const sessionIdRef = useRef(crypto.randomUUID())

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
