/* ============================================
   StoreOrderPage
   Task 14: replaces the single-product
   DigitalStoreOrderPage. Same four post-payment states
   it had - "preparing", "ready", "this is taking longer
   than expected", "we can't find this order on this
   device" - generalized from one document to a list,
   plus the two the multi-item backend made reachable
   ("some items couldn't be prepared", and a partial
   failure that no longer fails the whole purchase).

   Per item, because the backend is per item
   ------------------------------------------
   Payment is confirmed once for the whole order
   (Razorpay knows nothing about line items) but
   fulfillment fans out and completes independently -
   see OrderService.confirmPaymentAndIssueDownload. So a
   two-item order shows item A's download button the
   moment A finishes, while B is still rendering, rather
   than making the whole page wait on the slowest line.

   *** Why the poll MERGES instead of replacing ***
   /verify hands over a line's raw downloadToken exactly
   ONCE - the first poll at which that line is FULFILLED
   with no live token. Every later poll of an
   already-fulfilled line (which is every poll while a
   sibling is still rendering) comes back with
   downloadTokenExpiresAt set and downloadToken NULL,
   because the server stores only the token's hash and
   deliberately does not rotate it: rotating would
   invalidate a link the buyer may already have clicked.
   `setItems(response.items)` therefore silently deletes
   the download button of every item that finished
   before its siblings. mergeVerifyItems below keys on
   orderItemId and retains the token from whichever
   response first carried it; persistStoredOrderItems
   extends that retention across a page reload, since
   the server cannot hand the token over a second time
   at all.
   ============================================ */

import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiCheckCircle, FiClock, FiCopy, FiDownload, FiLoader, FiSearch } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import StoreCard from '../components/store/StoreCard'
import OrderStateIllustration from '../components/digital-store/OrderStateIllustration'
import { useCart } from '../context/CartContext'
import { readStoredOrderRecord, persistStoredOrderItems } from '../hooks/useCheckout'
import { storeItemDownloadUrl, verifyStoreOrder } from '../utils/checkoutApi'
import { formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'

// The header content per state - kept as one lookup so StoreOrderPage's render
// body doesn't repeat 7 near-identical conditionals. Copy is unchanged from
// before this restyle; only the presentation (OrderStateIllustration) is new.
function stateContent(state, readyCount) {
  switch (state) {
    case 'verifying':
    case 'preparing':
      return {
        icon: FiLoader,
        spin: true,
        title: 'Preparing your files...',
        description: "This usually takes just a few seconds. Each item appears below as soon as it's ready.",
      }
    case 'ready':
      return {
        icon: FiCheckCircle,
        tone: 'success',
        celebrate: true,
        title: 'Your order is ready',
        description: 'Download each item below.',
      }
    case 'partial':
      return {
        icon: FiAlertTriangle,
        tone: 'warning',
        title: readyCount > 0 ? 'Some of your items are ready' : "We couldn't prepare your items",
        description:
          'Anything marked below as "Couldn\'t be prepared" hasn\'t gone through — contact us with your order ID and we\'ll sort just that item out. Your payment covered the whole order.',
      }
    case 'taking_longer':
      return {
        icon: FiClock,
        tone: 'warning',
        title: 'This is taking longer than expected',
        description:
          readyCount > 0
            ? "Anything already finished is downloadable below. For the rest, please contact us with your order ID and we'll help sort it out."
            : "Please contact us with your order ID and we'll help sort it out.",
      }
    case 'error':
      return {
        icon: FiAlertTriangle,
        tone: 'warning',
        title: 'Something went wrong',
        description: `Please contact us with your order ID and we'll sort it out.${
          readyCount > 0 ? ' Anything already finished is still downloadable below.' : ''
        }`,
      }
    default:
      return null
  }
}

// A tiny 3-step progress line for the verifying/preparing state - "genuinely
// animated," per the redesign brief, rather than just a spinner with no
// context for how far along the buyer actually is.
function FulfillmentProgress({ active }) {
  const steps = ['Payment confirmed', 'Preparing', 'Ready']
  return (
    <div className="flex items-center justify-center gap-2 mb-8" aria-hidden="true">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`h-1.5 w-16 rounded-full ${index <= 1 ? 'bg-[var(--store-accent)]' : 'bg-black/10'} overflow-hidden`}>
            {index === 1 && active ? (
              <motion.div
                className="h-full bg-[var(--store-accent)]"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

const POLL_INTERVAL_MS = 5000
// 24 attempts at 5s = 2 minutes before we stop and tell the buyer to contact us, rather
// than polling /verify forever if a line is stuck.
const MAX_POLL_ATTEMPTS = 24

// A line in either of these is done changing: attemptFulfillment only claims a PENDING
// row, so a FAILED line stays FAILED until an admin retries it server-side. Polling past
// that point learns nothing.
const TERMINAL_STATUSES = new Set(['FULFILLED', 'FAILED'])

/**
 * Folds one /verify response into the item state already held, keyed by orderItemId.
 *
 * The response is authoritative on WHICH lines exist and on every status, so the merged
 * list follows its order and membership. It is NOT authoritative on downloadToken: a null
 * there means "you were already given this one", not "there isn't one". Same for
 * downloadTokenExpiresAt, which a fulfilled line does echo but which is equally worth
 * keeping if a later response ever omitted it.
 *
 * Exported for direct unit testing - this is the payment-critical part of the page.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function mergeVerifyItems(previousItems, incomingItems) {
  const previousById = new Map(previousItems.map((item) => [item.orderItemId, item]))
  return incomingItems.map((incoming) => {
    const previous = previousById.get(incoming.orderItemId)
    return {
      // Spread `previous` first so snapshot-only fields the verify response doesn't carry
      // (lineAmount, quantity) survive, then let the response win on everything it does.
      ...previous,
      ...incoming,
      downloadToken: incoming.downloadToken ?? previous?.downloadToken ?? null,
      downloadTokenExpiresAt: incoming.downloadTokenExpiresAt ?? previous?.downloadTokenExpiresAt ?? null,
    }
  })
}

/**
 * The stored line snapshot, shaped like a verify item so the merge is uniform. On a first
 * visit this is the checkout-time snapshot (no statuses yet, hence PENDING). On a RELOAD
 * it is whatever the last poll merged and persisted - statuses and captured download
 * tokens included - so the page comes back showing the buttons it already had, rather
 * than losing them to a server that cannot reissue those tokens.
 */
function initialItemsFrom(record) {
  return (record?.items ?? []).map((item) => ({
    ...item,
    fulfillmentStatus: item.fulfillmentStatus ?? 'PENDING',
    failureReason: item.failureReason ?? null,
    downloadToken: item.downloadToken ?? null,
    downloadTokenExpiresAt: item.downloadTokenExpiresAt ?? null,
  }))
}

function ItemRow({ orderId, item, currency, onDownloadClick }) {
  const isReady = item.fulfillmentStatus === 'FULFILLED'
  const hasToken = isReady && Boolean(item.downloadToken)

  return (
    <motion.li
      data-testid={`order-item-${item.orderItemId}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StoreCard hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-semibold text-[#17151f] truncate">{item.productName}</p>
        {/* currency lives on the order header, not the line (CheckoutItemResponse has no
            currency field) - one Razorpay order carries exactly one currency, and
            checkout refuses a mixed-currency cart outright. */}
        {item.lineAmount != null && currency ? (
          <p className="text-sm text-[#7a7887]">{formatDigitalStorePrice(currency, item.lineAmount)}</p>
        ) : null}
      </div>

      <div className="shrink-0">
        {hasToken ? (
          /* target="_blank": if this link has expired or been exhausted by the time it's
             clicked, the error opens in its own tab rather than replacing this page - the
             buyer keeps their other items' buttons and the contact line below. */
          <a
            href={storeItemDownloadUrl(orderId, item.orderItemId, item.downloadToken)}
            onClick={() => onDownloadClick(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--store-accent)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[var(--store-accent-hover)] transition-colors"
          >
            <FiDownload size={16} /> Download
          </a>
        ) : null}

        {isReady && !hasToken ? (
          /* Fulfilled, but this browser never saw the raw token (it was handed to a
             different device or a closed tab) and the server can only ever issue it once.
             Say so plainly rather than rendering a button that can't work. */
          <span className="text-sm text-[#7a7887]">Ready — contact us to resend your link</span>
        ) : null}

        {item.fulfillmentStatus === 'FAILED' ? (
          /* failureReason is a raw server-side exception message - useful in the admin,
             not something to show a buyer. The order id below is what support needs. */
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
            <FiAlertTriangle size={15} /> Couldn't be prepared
          </span>
        ) : null}

        {!TERMINAL_STATUSES.has(item.fulfillmentStatus) ? (
          <span className="inline-flex items-center gap-2 text-sm text-[#7a7887]">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="inline-flex"
            >
              <FiLoader size={15} />
            </motion.span>
            Preparing...
          </span>
        ) : null}
      </div>
      </StoreCard>
    </motion.li>
  )
}

export default function StoreOrderPage() {
  const { orderId } = useParams()
  const { refresh: refreshCart } = useCart()

  // 'recovery_failed' | 'verifying' | 'preparing' | 'ready' | 'partial' | 'taking_longer' | 'error'
  const [state, setState] = useState(() => (readStoredOrderRecord(orderId) ? 'verifying' : 'recovery_failed'))
  const [items, setItems] = useState(() => initialItemsFrom(readStoredOrderRecord(orderId)))
  const [currency] = useState(() => readStoredOrderRecord(orderId)?.currency ?? null)
  const pollTimeoutRef = useRef(null)
  const cartRefreshedRef = useRef(false)
  // Mirrors `items` so the poll can merge against the current list WITHOUT doing the
  // merge (and the sessionStorage write that goes with it) inside a setState updater.
  // Updaters have to be pure - StrictMode invokes them twice in dev - and the token
  // retention this page exists for is not something to run through a function React is
  // free to call however many times it likes. Only the poll below writes either one.
  const itemsRef = useRef(items)

  useSEO({
    title: 'Your Order | McreatiK Digital Store',
    description: 'Order status and downloads.',
    path: `/store/orders/${orderId}`,
  })

  useEffect(() => {
    const record = readStoredOrderRecord(orderId)
    if (!record) {
      // Nothing to poll with - the lazy initializers above already reflect this.
      return
    }

    let cancelled = false
    let attempts = 0

    async function poll() {
      attempts += 1
      try {
        const result = await verifyStoreOrder(orderId, record)
        if (cancelled) return

        const merged = mergeVerifyItems(itemsRef.current, result.items ?? [])
        itemsRef.current = merged
        setItems(merged)
        // Carries the captured tokens across a reload too: the server cannot hand any of
        // them over a second time, so in-memory state is not a safe place to keep them.
        persistStoredOrderItems(orderId, merged)

        // Checkout empties the cart server-side the moment payment is confirmed
        // (OrderService.confirmPaymentAndIssueDownload -> emptyThePurchasedCart), so the
        // Navbar badge is stale until we re-read it. Once, not per poll.
        if (result.paymentStatus === 'PAID' && !cartRefreshedRef.current) {
          cartRefreshedRef.current = true
          refreshCart().catch(() => {
            // An expired session here must not disturb a page about an already-paid
            // order; CartContext already recorded the error in its own state.
          })
        }

        const everyLineSettled = (result.items ?? []).every((item) =>
          TERMINAL_STATUSES.has(item.fulfillmentStatus)
        )

        if (result.allFulfilled) {
          setState('ready')
        } else if (everyLineSettled) {
          // Settled but not all fulfilled = at least one FAILED line, which no amount of
          // further polling will change. Stop, and say which items are affected.
          setState('partial')
        } else if (attempts >= MAX_POLL_ATTEMPTS) {
          setState('taking_longer')
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
  }, [orderId, refreshCart])

  function handleDownloadClick(item) {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.DOWNLOAD_INITIATED, {
      order_id: orderId,
      order_item_id: item.orderItemId,
    })
  }

  if (state === 'recovery_failed') {
    return (
      <StorePageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
          <OrderStateIllustration
            icon={FiSearch}
            tone="neutral"
            title="We can't find this order on this device"
            description={
              <>
                If you already paid, your order is safe — please contact us with your order ID (
                <code className="bg-black/5 px-1 rounded">{orderId}</code>) and we'll help you get your files.
              </>
            }
          />
        </div>
      </StorePageShell>
    )
  }

  const readyCount = items.filter((item) => item.fulfillmentStatus === 'FULFILLED').length
  const header = stateContent(state, readyCount)

  return (
    <StorePageShell>
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        {header ? (
          <>
            {state === 'verifying' || state === 'preparing' ? <FulfillmentProgress active /> : null}
            <OrderStateIllustration {...header} />
          </>
        ) : null}

        {items.length > 0 ? (
          <ul className="space-y-3 mb-8">
            {items.map((item) => (
              <ItemRow
                key={item.orderItemId}
                orderId={orderId}
                item={item}
                currency={currency}
                onDownloadClick={handleDownloadClick}
              />
            ))}
          </ul>
        ) : null}

        <p className="text-sm text-[#7a7887] text-center flex items-center justify-center gap-2">
          Order ID: <code className="bg-black/5 px-1 rounded">{orderId}</code>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(orderId)}
            aria-label="Copy order ID"
            title="Copy order ID"
            className="text-[#7a7887] hover:text-[var(--store-accent-text)] transition-colors"
          >
            <FiCopy size={14} />
          </button>
        </p>
        <p className="text-center mt-6">
          {/* Real client-side Link, not Button's own href path - see StoreCartPage.jsx's
              identical note on why Button.jsx's href (a plain <a>) is reserved for
              anchors/external links elsewhere in this app. */}
          <Link
            to="/store"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide border border-[var(--store-accent)]/60 text-[#17151f] transition-all duration-300 hover:bg-[var(--store-accent)]/10 hover:border-[var(--store-accent)]"
          >
            Back to the Store
          </Link>
        </p>
      </div>
    </StorePageShell>
  )
}
