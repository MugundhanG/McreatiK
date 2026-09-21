// src/pages/StoreProductPage.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import ProductForm from '../components/digital-store/ProductForm'
import LiveDocumentPreview from '../components/digital-store/LiveDocumentPreview'
import PreviewPanel from '../components/digital-store/PreviewPanel'
import {
  ProductHero,
  ProductStorySections,
  ProductFAQSection,
  ProductTrustSection,
} from '../components/digital-store/ProductMarketingSections'
import StoreSectionHeading from '../components/store/StoreSectionHeading'
import StoreCard from '../components/store/StoreCard'
import Button from '../components/ui/Button'
import { useRequireAuthOrRedirect } from '../hooks/useRequireAuthOrRedirect'
import { fetchDigitalStoreProduct, fetchDigitalStoreCategories, formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { CustomerApiError } from '../utils/customerApi'

const FORM_SECTION_ID = 'store-product-form'
const CTA_SECTION_ID = 'store-product-cta'

export default function StoreProductPage() {
  const { productId } = useParams()
  const requireAuthOrRedirect = useRequireAuthOrRedirect()
  const { customer, loading: authLoading } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [validationMessage, setValidationMessage] = useState(null)
  const [cartMessage, setCartMessage] = useState(null)
  const [cartError, setCartError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  // Incremented on every successful add so the button's success pulse (keyed
  // off this, not off cartMessage's text) replays even for two identical adds
  // in a row.
  const [successPulse, setSuccessPulse] = useState(0)

  // The public Product list carries only categoryId (ProductResponse.categoryId) -
  // requiresCustomization lives on the Category, so both lists have to be fetched
  // and joined client-side; there is no product-with-category endpoint.
  const requiresCustomization = category?.requiresCustomization ?? false

  useSEO({
    title: product ? `${product.name} | McreatiK Digital Store` : 'Digital Store | McreatiK',
    description: product?.marketingContent?.shortDescription || 'Customize, preview, and download instantly.',
    path: `/store/products/${productId}`,
  })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchDigitalStoreProduct(productId), fetchDigitalStoreCategories()])
      .then(([productResult, categories]) => {
        if (cancelled) return
        setProduct(productResult)
        setCategory(categories.find((c) => c.id === productResult.categoryId) ?? null)
        trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { product_id: productId })
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err)
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  // Auto-dismiss the success line after a few seconds, matching this app's
  // other transient-feedback patterns rather than leaving it on screen until
  // some other action happens to clear it.
  useEffect(() => {
    if (!cartMessage) return
    const timer = setTimeout(() => setCartMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [cartMessage])

  function handleFieldChange(name, value) {
    setFieldValues((prev) => ({ ...prev, [name]: value }))
    setValidationMessage(null)
    setCartError(null)
  }

  function handleFirstFormInteraction() {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.FORM_STARTED, { product_id: productId })
  }

  function scrollToAction() {
    document.getElementById(requiresCustomization ? FORM_SECTION_ID : CTA_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Shared by the customization section's own prompt and (indirectly, via
  // handleAddToCartClick below) the bottom Add to Cart button - both need the
  // exact same "come back here after logging in" redirect, matching
  // useRequireAuthOrRedirect's own state shape so StoreLoginPage's existing
  // from-redirect handles either entry point identically.
  function goToLogin() {
    navigate('/store/login', { state: { from: `${location.pathname}${location.search}` } })
  }

  // A lightweight, non-exhaustive check: it only catches an obviously-incomplete form
  // (a blank required, customer-editable field) so we can block the add-to-cart click
  // and say why, rather than duplicating ProductForm's own per-field validation UI
  // here. A non-editable field (customerEditable: false) is never "incomplete" from
  // the buyer's point of view - it's always resolved from its own fixedValue and the
  // backend discards anything submitted for it - so it's excluded here exactly like
  // ProductForm excludes it from its own required check.
  function isFormObviouslyIncomplete() {
    if (!requiresCustomization) return false
    const fields = product?.fieldSchema?.fields ?? []
    return fields.some((field) => {
      if (field.customerEditable === false) return false
      if (!field.required) return false
      const value = fieldValues[field.name]
      return value === undefined || value === null || value === ''
    })
  }

  // --- Add to cart ---------------------------------------------------------
  // Real cart mutation (Task 13): calls useCart().addItem(), which POSTs to
  // /api/v1/cart/items and sets CartContext's state from whatever the server
  // returns. The server re-validates fieldValues against the product's
  // *current* schema (CartService.addItem / GenericFieldSchemaValidator) - a
  // rejection there (e.g. a field that stopped satisfying the schema, or a
  // stale price/schema an admin changed since this page loaded) comes back as
  // a CustomerApiError with a readable `.message`, surfaced below rather than
  // silently swallowed.
  async function addToCart() {
    setAddingToCart(true)
    setCartMessage(null)
    setCartError(null)
    try {
      await addItem({ productId: product.id, fieldValues })
      setCartMessage(`Added "${product.name}" to your cart.`)
      setSuccessPulse((n) => n + 1)
      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.ADD_TO_CART_CLICKED, { product_id: product.id })
    } catch (err) {
      // CartService.addItem's PurchasableProductResolver check answers "may this be
      // sold right now" with a 404 (gone/retired since the page loaded - e.g. an admin
      // edited it after it already had other orders, which retires the old row rather
      // than mutating it) or a 400 (still exists but nothing can fulfil it yet). Both
      // are a "this specific product isn't buyable anymore" case, not a generic
      // failure, so say that plainly rather than surfacing the raw backend string -
      // unlike the cart page, there's exactly one product in view here, so no
      // ambiguity about which item is meant. Excludes anything carrying fieldErrors:
      // that's ProductFieldValidationException's shape (a stale/edited field schema),
      // whose message is already specific and actionable and must not be masked.
      const isAvailabilityError =
        err instanceof CustomerApiError &&
        (err.status === 404 || err.status === 400) &&
        !(err.fieldErrors && Object.keys(err.fieldErrors).length > 0)
      setCartError(
        isAvailabilityError
          ? `"${product.name}" is no longer available to purchase — it may have been updated or removed. Try refreshing the page.`
          : err.message || 'Could not add this item to your cart. Please try again.',
      )
    } finally {
      setAddingToCart(false)
    }
  }

  // The single add-to-cart action both branches (customizable / non-customizable)
  // end at. Auth is required before anything else happens: requireAuthOrRedirect
  // runs addToCart immediately for a signed-in customer, or sends a signed-out
  // visitor to /store/login (carrying this page as `from`) and runs nothing -
  // browsing the product page itself stays public either way.
  function handleAddToCartClick() {
    // A logged-out visitor on a customization-required product never had the
    // form to fill in (it's hidden behind the login gate below) - sending
    // them to "please fill in the fields above" would point at nothing. Only
    // apply the incomplete-form check once they're actually signed in and
    // the form was genuinely there to fill in.
    if (customer && isFormObviouslyIncomplete()) {
      setValidationMessage('Please fill in all required fields above before adding to cart.')
      return
    }
    setValidationMessage(null)
    requireAuthOrRedirect(addToCart)
  }

  if (loadError) {
    return (
      <StorePageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center">
          <p className="text-red-600">This product couldn't be found. It may no longer be available.</p>
        </div>
      </StorePageShell>
    )
  }

  if (!product) {
    return (
      <StorePageShell>
        {/* Matches StoreCatalogPage's CatalogSkeleton language (animate-pulse
            blocks on the same surface tokens) instead of a bare "Loading..."
            string - same department, same loading-state quality. */}
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20" aria-hidden="true">
          <div className="flex flex-col items-center gap-5 py-16 animate-pulse">
            <div className="h-10 w-3/4 max-w-md bg-black/5 rounded" />
            <div className="h-10 w-32 bg-black/5 rounded-full" />
            <div className="h-11 w-40 bg-black/5 rounded-md" />
          </div>
          <div className="py-10 max-w-[65ch] mx-auto space-y-2 animate-pulse">
            <div className="h-4 bg-black/5 rounded w-full" />
            <div className="h-4 bg-black/5 rounded w-full" />
            <div className="h-4 bg-black/5 rounded w-2/3" />
          </div>
        </div>
      </StorePageShell>
    )
  }

  return (
    <StorePageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <ProductHero template={product} onGetStarted={scrollToAction} />
        <ProductStorySections marketingContent={product.marketingContent} />

        {requiresCustomization && authLoading ? (
          <section id={FORM_SECTION_ID} className="py-10 border-t border-black/5">
            <StoreSectionHeading title="Customize your document" align="left" />
            <div className="mt-6 h-40 rounded-lg bg-[var(--store-accent-soft)] animate-pulse" aria-hidden="true" />
          </section>
        ) : null}

        {requiresCustomization && !authLoading && !customer ? (
          <section id={FORM_SECTION_ID} className="py-10 border-t border-black/5">
            <StoreSectionHeading title="Customize your document" align="left" />
            <div className="mt-6">
              <StoreCard hover={false} padding="lg" className="max-w-md mx-auto text-center">
                <p className="text-[#17151f] font-medium mb-1">Log in to customize this document</p>
                <p className="text-sm text-[#4b4a55] mb-5">
                  Create a free account or log in to fill in your details and see a live preview before you buy.
                </p>
                <Button theme="store" onClick={goToLogin}>
                  Log in / Sign up
                </Button>
              </StoreCard>
            </div>
          </section>
        ) : null}

        {requiresCustomization && !authLoading && customer ? (
          <>
            <section id={FORM_SECTION_ID} className="py-10 border-t border-black/5">
              <StoreSectionHeading title="Customize your document" align="left" />
              <div className="mt-6">
                <ProductForm
                  fieldSchema={product.fieldSchema}
                  values={fieldValues}
                  onChange={handleFieldChange}
                  onFirstInteraction={handleFirstFormInteraction}
                />
              </div>
            </section>

            {/* Always visible the moment this branch renders - not a tab, not gated
                behind a button, not pushed below the CTA. Sits directly under the form
                so the buyer sees it update with every keystroke without scrolling past
                it to find it. See LiveDocumentPreview.jsx for why useMemo alone (no
                debounce) is correct here. */}
            <LiveDocumentPreview
              templateBody={product.templateBody}
              fieldSchema={product.fieldSchema}
              fieldValues={fieldValues}
            />

            <PreviewPanel templateId={product.id} fieldValues={fieldValues} />
          </>
        ) : null}

        <section id={CTA_SECTION_ID} className="py-10 border-t border-black/5 text-center">
          <StoreCard hover={false} padding="lg" className="max-w-sm mx-auto flex flex-col items-center gap-4">
            <span className="font-display text-3xl font-bold text-[#17151f]">
              {formatDigitalStorePrice(product.currency, product.price)}
            </span>
            {/* key={successPulse} forces a fresh mount (and therefore a fresh
                `animate` run) on every successful add, including two
                identical adds in a row where cartMessage's text wouldn't
                otherwise change. */}
            <motion.div
              key={successPulse}
              animate={successPulse > 0 ? { scale: [1, 1.05, 1] } : undefined}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Button theme="store" onClick={handleAddToCartClick} disabled={addingToCart} className="w-full">
                <AnimatePresence mode="wait" initial={false}>
                  {addingToCart ? (
                    <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Adding...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      {cartMessage ? (
                        <motion.span
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <FiCheck />
                        </motion.span>
                      ) : null}
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            {validationMessage ? <p className="text-red-600 text-sm">{validationMessage}</p> : null}
            {cartError ? <p className="text-red-600 text-sm">{cartError}</p> : null}
            {cartMessage ? (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-700 text-sm font-medium"
              >
                {cartMessage}
              </motion.p>
            ) : null}
          </StoreCard>
        </section>

        <ProductFAQSection faq={product.marketingContent?.faq} />
        <ProductTrustSection oneTimePurchase={product.marketingContent?.oneTimePurchase ?? true} />
      </div>
    </StorePageShell>
  )
}
