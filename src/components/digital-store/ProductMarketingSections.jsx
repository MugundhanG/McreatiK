import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiLock, FiEye, FiZap, FiRefreshCw, FiCheck } from 'react-icons/fi'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { formatDigitalStorePrice } from '../../utils/digitalStoreApi'
import Button from '../ui/Button'
import StoreSectionHeading from '../store/StoreSectionHeading'
import StoreCard from '../store/StoreCard'
import StoreIconBadge from '../store/StoreIconBadge'
import TrustBadge from './TrustBadge'
import HowItWorksSteps from './HowItWorksSteps'

export function ProductHero({ template, onGetStarted }) {
  return (
    <section className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-5"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#17151f] leading-tight text-balance max-w-2xl">
          {template.name}
        </h1>
        <span className="font-display text-xl font-bold px-4 py-1.5 rounded-full border border-[var(--store-accent)]/40 text-[var(--store-accent-text)]">
          {formatDigitalStorePrice(template.currency, template.price)}
        </span>
        <Button theme="store" onClick={onGetStarted}>
          Get Started
        </Button>
        <p className="text-xs text-[#7a7887]">Preview before you pay &middot; Instant download</p>
      </motion.div>
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
        <section className="py-10 max-w-[65ch] mx-auto">
          <p className="text-lg text-[#17151f]/80 leading-relaxed">{description}</p>
        </section>
      ) : null}

      {benefits?.length ? (
        <section className="py-10">
          <StoreSectionHeading title="Why you'll love it" align="left" />
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <StoreIconBadge icon={FiCheck} size="sm" tone="success" />
                <span className="text-[#17151f]">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      ) : null}

      {sampleDocumentImageUrl ? (
        <section className="py-10">
          <StoreSectionHeading title="What the document looks like" align="left" />
          <StoreCard padding="sm" hover={false} className="mt-6 inline-block">
            <img src={sampleDocumentImageUrl} alt="Sample document" className="max-w-full rounded-md" />
          </StoreCard>
        </section>
      ) : null}

      {whatsIncluded?.length ? (
        <section className="py-10">
          <StoreSectionHeading title="What's included" align="left" />
          <StoreCard hover={false} className="mt-6">
            <ul className="space-y-2.5">
              {whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[#17151f]">
                  <StoreIconBadge icon={FiCheck} size="sm" />
                  <span className="pt-1.5">{item}</span>
                </li>
              ))}
            </ul>
          </StoreCard>
        </section>
      ) : null}

      {howItWorks?.length ? (
        <section className="py-10">
          <StoreSectionHeading title="How it works" align="left" />
          <div className="mt-8">
            <HowItWorksSteps steps={howItWorks} />
          </div>
        </section>
      ) : null}
    </>
  )
}

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <StoreCard hover={false} padding="none">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="font-semibold text-[#17151f]">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[var(--store-accent-text)]"
        >
          <FiChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-[#4b4a55]">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StoreCard>
  )
}

export function ProductFAQSection({ faq }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!faq?.length) return null

  return (
    <section className="py-10">
      <StoreSectionHeading title="Frequently asked questions" align="left" />
      <div className="mt-6 space-y-3">
        {faq.map((item, index) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
          />
        ))}
      </div>
    </section>
  )
}

// No fabricated testimonials, ratings, or customer counts - only claims that are
// actually true for every product using this section.
export function ProductTrustSection({ oneTimePurchase }) {
  const badges = [
    { icon: FiLock, label: 'Secure payment', description: 'Processed via Razorpay' },
    { icon: FiEye, label: 'Preview before you pay', description: 'See your actual document first' },
    { icon: FiZap, label: 'Instant digital delivery', description: 'No shipping, available right after payment' },
  ]
  if (oneTimePurchase) {
    badges.push({ icon: FiRefreshCw, label: 'One-time purchase', description: null })
  }

  return (
    <section className="py-10 border-t border-black/5">
      <StoreSectionHeading title="You're in good hands" align="left" />
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {badges.map((badge, index) => (
          <TrustBadge key={badge.label} {...badge} index={index} />
        ))}
      </div>
      <p className="mt-8 text-sm text-[#4b4a55]">
        Questions?{' '}
        <a
          href={getWhatsAppHref('Hi, I have a question about the Digital Store')}
          className="font-medium text-[var(--store-accent-text)] underline"
        >
          Contact support
        </a>
      </p>
    </section>
  )
}
