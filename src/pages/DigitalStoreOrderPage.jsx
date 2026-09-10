import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { verifyDigitalStoreOrder, digitalStoreDownloadUrl } from '../utils/digitalStoreApi'
import { readStoredPaymentDetails } from '../hooks/useCheckout'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'

const POLL_INTERVAL_MS = 5000

export default function DigitalStoreOrderPage() {
  const { orderId } = useParams()
  // 'recovery_failed' | 'verifying' | 'preparing' | 'ready' | 'error'
  const [state, setState] = useState('verifying')
  const [downloadToken, setDownloadToken] = useState(null)
  const pollTimeoutRef = useRef(null)

  useSEO({ title: 'Your Order | McreatiK Studios Digital Store', description: 'Order status and download.', path: `/digital_store/order/${orderId}` })

  useEffect(() => {
    const paymentDetails = readStoredPaymentDetails(orderId)
    if (!paymentDetails) {
      setState('recovery_failed')
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const result = await verifyDigitalStoreOrder(orderId, paymentDetails)
        if (cancelled) return
        if (result.fulfilled) {
          setDownloadToken(result.downloadToken)
          setState('ready')
        } else {
          setState('preparing')
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        }
      } catch {
        if (!cancelled) setState('error')
      }
    }

    poll()

    return () => {
      cancelled = true
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
    }
  }, [orderId])

  function handleDownloadClick() {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.DOWNLOAD_INITIATED, { order_id: orderId })
  }

  return (
    <StudiosPageShell>
      <div className="max-w-xl mx-auto px-4 pt-28 pb-20 text-center">
        {state === 'recovery_failed' ? (
          <>
            <h1 className="text-2xl font-semibold mb-3">We can't find this order on this device</h1>
            <p className="text-gray-600">
              If you already paid, your order is safe — please contact us with your order ID (
              <code className="bg-gray-100 px-1 rounded">{orderId}</code>) and we'll help you get your document.
            </p>
          </>
        ) : null}

        {state === 'verifying' || state === 'preparing' ? (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-semibold mb-2">Preparing your document...</h1>
            <p className="text-gray-600">This usually takes just a few seconds.</p>
          </>
        ) : null}

        {state === 'ready' ? (
          <>
            <h1 className="text-2xl font-semibold mb-4">Your document is ready 🎉</h1>
            {/* target="_blank": if the download link has somehow already expired/been
                exhausted by the time this is clicked, the resulting error opens in its
                own tab rather than replacing this page - the buyer keeps their "ready"
                state and the contact line right below, instead of losing everything to
                a raw error page. */}
            <a
              href={digitalStoreDownloadUrl(orderId, downloadToken)}
              onClick={handleDownloadClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C9971F] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#b3860f]"
            >
              Download your document
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Link not working? Contact us with your order ID (<code className="bg-gray-100 px-1 rounded">{orderId}</code>).
            </p>
          </>
        ) : null}

        {state === 'error' ? (
          <>
            <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
            <p className="text-gray-600">
              Please contact us with your order ID (<code className="bg-gray-100 px-1 rounded">{orderId}</code>) and we'll sort it out.
            </p>
          </>
        ) : null}
      </div>
    </StudiosPageShell>
  )
}
