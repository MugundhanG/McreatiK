// src/pages/DigitalStoreProductPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import ProductForm from '../components/digital-store/ProductForm'
import PreviewPanel from '../components/digital-store/PreviewPanel'
import {
  ProductHero,
  ProductStorySections,
  ProductFAQSection,
  ProductTrustSection,
} from '../components/digital-store/ProductMarketingSections'
import { useCheckout } from '../hooks/useCheckout'
import { fetchDigitalStoreTemplate, formatDigitalStorePrice } from '../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'

export default function DigitalStoreProductPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [validationMessage, setValidationMessage] = useState(null)

  const { status: checkoutStatus, error: checkoutError, startCheckout } = useCheckout(template || { id: templateId })
  // Derived directly from checkoutError rather than mirrored into its own state - it's
  // fully determined by the hook's error on every render, so there's nothing to synchronize.
  const checkoutFieldErrors = checkoutError?.fieldErrors || {}

  useSEO({
    title: template ? `${template.name} | McreatiK Studios Digital Store` : 'Digital Store | McreatiK Studios',
    description: template?.marketingContent?.shortDescription || 'Customize, preview, and download instantly.',
    path: `/digital_store/${templateId}`,
  })

  useEffect(() => {
    let cancelled = false
    fetchDigitalStoreTemplate(templateId)
      .then((result) => {
        if (!cancelled) {
          setTemplate(result)
          trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: templateId })
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err)
      })
    return () => {
      cancelled = true
    }
  }, [templateId])

  function handleFieldChange(name, value) {
    setFieldValues((prev) => ({ ...prev, [name]: value }))
    setValidationMessage(null)
  }

  function handleFirstFormInteraction() {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.FORM_STARTED, { template_id: templateId })
  }

  function scrollToForm() {
    document.getElementById('digital-store-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  // A lightweight, non-exhaustive check: it only catches an obviously-incomplete form
  // (a blank required field) so we can block submission and say why, rather than
  // duplicating ProductForm's own per-field validation UI here.
  function isFormObviouslyIncomplete() {
    if (!customerName.trim() || !customerEmail.trim()) return true
    const fields = template?.fieldSchema?.fields ?? []
    return fields.some((field) => {
      if (!field.required) return false
      const value = fieldValues[field.name]
      return value === undefined || value === null || value === ''
    })
  }

  async function handlePayClick() {
    if (isFormObviouslyIncomplete()) {
      setValidationMessage('Please fill in all required fields above before continuing.')
      return
    }
    setValidationMessage(null)
    await startCheckout(
      { customerName, customerEmail, fieldValues },
      { onSuccess: (orderId) => navigate(`/digital_store/${templateId}/order/${orderId}`) }
    )
  }

  if (loadError) {
    return (
      <StudiosPageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center">
          <p className="text-red-600">This product couldn't be found. It may no longer be available.</p>
        </div>
      </StudiosPageShell>
    )
  }

  if (!template) {
    return (
      <StudiosPageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center text-gray-500">Loading...</div>
      </StudiosPageShell>
    )
  }

  return (
    <StudiosPageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <ProductHero template={template} onGetStarted={scrollToForm} />
        <ProductStorySections marketingContent={template.marketingContent} />

        <section id="digital-store-form" className="py-10 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Customize your document</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Your Name *
              </label>
              <input
                id="customerName"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  setValidationMessage(null)
                }}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                Your Email *
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value)
                  setValidationMessage(null)
                }}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <ProductForm
            fieldSchema={template.fieldSchema}
            values={fieldValues}
            onChange={handleFieldChange}
            onFirstInteraction={handleFirstFormInteraction}
            serverErrors={checkoutFieldErrors}
          />
        </section>

        <PreviewPanel templateId={template.id} fieldValues={fieldValues} />

        <section className="py-10 border-t border-gray-200 text-center">
          <p className="text-2xl font-bold mb-4">{formatDigitalStorePrice(template.currency, template.price)}</p>
          <button
            type="button"
            onClick={handlePayClick}
            disabled={checkoutStatus === 'creating_order' || checkoutStatus === 'awaiting_payment'}
            className="bg-[#C9971F] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#b3860f] disabled:opacity-50"
          >
            {checkoutStatus === 'creating_order'
              ? 'Preparing checkout...'
              : `Pay ${formatDigitalStorePrice(template.currency, template.price)}`}
          </button>
          {validationMessage ? <p className="text-red-600 mt-3">{validationMessage}</p> : null}
          {checkoutStatus === 'error' ? (
            <p className="text-red-600 mt-3">
              {checkoutError?.status === 429
                ? 'Too many attempts — please wait a moment and try again.'
                : 'Something went wrong starting checkout. Please try again in a moment.'}
            </p>
          ) : null}
        </section>

        <ProductFAQSection faq={template.marketingContent?.faq} />
        <ProductTrustSection oneTimePurchase={template.marketingContent?.oneTimePurchase ?? true} />
      </div>
    </StudiosPageShell>
  )
}
