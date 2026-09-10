import { useRef, useState } from 'react'
import { createDigitalStoreOrder } from '../utils/digitalStoreApi'
import { loadRazorpayCheckoutScript } from '../utils/razorpayScriptLoader'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'

function sessionStorageKeyFor(orderId) {
  return `digital-store-order-${orderId}`
}

export function useCheckout(template) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const idempotencyKeyRef = useRef(null)

  function getIdempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }
    return idempotencyKeyRef.current
  }

  async function startCheckout({ customerName, customerEmail, fieldValues }, { onSuccess }) {
    setStatus('creating_order')
    setError(null)
    try {
      const order = await createDigitalStoreOrder(getIdempotencyKey(), {
        templateId: template.id,
        customerName,
        customerEmail,
        fieldValues,
      })

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
            // Force a fresh idempotency key on the next attempt: the backend caches orders by
            // this key with no payload comparison, so reusing it after the buyer edits the form
            // would return the stale first order instead of one reflecting their edits.
            idempotencyKeyRef.current = null
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
