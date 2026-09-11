// src/pages/StoreProductPage.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StorePageShell from '../components/layout/StorePageShell'
import ProductForm from '../components/digital-store/ProductForm'
import PreviewPanel from '../components/digital-store/PreviewPanel'
import {
  ProductHero,
  ProductStorySections,
  ProductFAQSection,
  ProductTrustSection,
} from '../components/digital-store/ProductMarketingSections'
import { useRequireAuthOrRedirect } from '../hooks/useRequireAuthOrRedirect'
import { fetchDigitalStoreProduct, fetchDigitalStoreCategories, formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'
import { useCart } from '../context/CartContext'

const FORM_SECTION_ID = 'store-product-form'
const CTA_SECTION_ID = 'store-product-cta'

export default function StoreProductPage() {
  const { productId } = useParams()
  const requireAuthOrRedirect = useRequireAuthOrRedirect()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [validationMessage, setValidationMessage] = useState(null)
  const [cartMessage, setCartMessage] = useState(null)
  const [cartError, setCartError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

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
      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.ADD_TO_CART_CLICKED, { product_id: product.id })
    } catch (err) {
      setCartError(err.message || 'Could not add this item to your cart. Please try again.')
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
    if (isFormObviouslyIncomplete()) {
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
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center text-gray-500">Loading...</div>
      </StorePageShell>
    )
  }

  return (
    <StorePageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <ProductHero template={product} onGetStarted={scrollToAction} />
        <ProductStorySections marketingContent={product.marketingContent} />

        {requiresCustomization ? (
          <>
            <section id={FORM_SECTION_ID} className="py-10 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Customize your document</h2>
              <ProductForm
                fieldSchema={product.fieldSchema}
                values={fieldValues}
                onChange={handleFieldChange}
                onFirstInteraction={handleFirstFormInteraction}
              />
            </section>

            <PreviewPanel templateId={product.id} fieldValues={fieldValues} />
          </>
        ) : null}

        <section id={CTA_SECTION_ID} className="py-10 border-t border-gray-200 text-center">
          <p className="text-2xl font-bold mb-4">{formatDigitalStorePrice(product.currency, product.price)}</p>
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={addingToCart}
            className="bg-[#8B7FE8] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#7A6DE0] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          {validationMessage ? <p className="text-red-600 mt-3">{validationMessage}</p> : null}
          {cartError ? <p className="text-red-600 mt-3">{cartError}</p> : null}
          {cartMessage ? <p className="text-green-700 mt-3">{cartMessage}</p> : null}
        </section>

        <ProductFAQSection faq={product.marketingContent?.faq} />
        <ProductTrustSection oneTimePurchase={product.marketingContent?.oneTimePurchase ?? true} />
      </div>
    </StorePageShell>
  )
}
