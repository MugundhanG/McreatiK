import { getWhatsAppHref } from '../../utils/whatsapp'
import { formatDigitalStorePrice } from '../../utils/digitalStoreApi'

export function ProductHero({ template, onGetStarted }) {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-3">{template.name}</h1>
      <p className="text-2xl font-semibold text-[#C9971F] mb-6">{formatDigitalStorePrice(template.currency, template.price)}</p>
      <button
        type="button"
        onClick={onGetStarted}
        className="inline-block bg-[#C9971F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b3860f]"
      >
        Get Started
      </button>
    </section>
  )
}

/** Description, benefits, sample image, what's included, how it works - each
 * renders only when its own marketingContent field is present. */
export function ProductStorySections({ marketingContent }) {
  if (!marketingContent) return null
  const { description, benefits, sampleDocumentImageUrl, whatsIncluded, howItWorks } = marketingContent

  return (
    <>
      {description ? (
        <section className="py-10 max-w-2xl mx-auto">
          <p className="text-lg text-gray-700">{description}</p>
        </section>
      ) : null}

      {benefits?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">Why you'll love it</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span aria-hidden="true">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sampleDocumentImageUrl ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">What the document looks like</h2>
          <img src={sampleDocumentImageUrl} alt="Sample document" className="max-w-full rounded-lg border" />
        </section>
      ) : null}

      {whatsIncluded?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">What's included</h2>
          <ul className="list-disc list-inside space-y-1">
            {whatsIncluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {howItWorks?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="space-y-2 list-decimal list-inside">
            {howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  )
}

export function ProductFAQSection({ faq }) {
  if (!faq?.length) return null

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
      <dl className="space-y-4">
        {faq.map((item) => (
          <div key={item.question}>
            <dt className="font-medium">{item.question}</dt>
            <dd className="text-gray-600 mt-1">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// No fabricated testimonials, ratings, or customer counts - only claims that are
// actually true for every product using this section.
export function ProductTrustSection({ oneTimePurchase }) {
  return (
    <section className="py-10 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">You're in good hands</h2>
      <ul className="space-y-2 text-gray-700">
        <li>🔒 Secure payment processing via Razorpay</li>
        <li>👀 Preview your actual document before you pay</li>
        <li>⚡ Instant digital delivery — no shipping, available right after payment</li>
        {oneTimePurchase ? <li>🔁 One-time purchase</li> : null}
      </ul>
      <p className="mt-4">
        Questions?{' '}
        <a href={getWhatsAppHref('Hi, I have a question about the Digital Store')} className="text-[#C9971F] underline">
          Contact support
        </a>
      </p>
    </section>
  )
}
