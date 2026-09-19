/* ============================================
   StoreRefundPolicyPage
   Refund & cancellation policy for the Digital Store's
   instant-download document products. Linked from the
   footer and from the cart's checkout button, and written
   to double as the visible policy Razorpay's live-mode
   KYC review looks for.
   ============================================ */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StorePageShell from '../components/layout/StorePageShell'
import StoreSectionHeading from '../components/store/StoreSectionHeading'
import { useSEO } from '../hooks/useSEO'

const SECTIONS = [
  {
    heading: 'What you’re buying',
    body: [
      'Every product in the Digital Store is a digital document, generated from the information you enter and delivered as a downloadable file. Nothing is shipped — there is no physical good, and there is no waiting period between payment and delivery.',
      'Before you pay, the product page shows a live preview of your document as you fill in the form, so you can check names, dates and other details are correct before checkout.',
    ],
  },
  {
    heading: 'Cancellations',
    body: [
      'You can leave checkout at any point before payment completes with no charge and nothing to cancel.',
      'Once a payment is successfully completed, the order cannot be cancelled. Because delivery is instant and digital, there is no gap between "ordered" and "delivered" in which a cancellation would apply.',
    ],
  },
  {
    heading: 'Refunds',
    body: [
      'Because these are instantly-delivered digital goods, we’re not able to offer refunds for a change of mind, or for incorrect details you entered and confirmed in the live preview before paying — please review the preview carefully before completing checkout.',
      'You are entitled to a full refund if any of the following happen:',
    ],
    list: [
      'Your payment was deducted but the order failed to complete or no download was issued.',
      'You were charged more than once for the same order.',
      'The delivered file is corrupted, unopenable, or is not the product you ordered.',
    ],
    after: 'In any of these cases, contact us within 7 days of purchase with your order ID and we’ll issue a refund — no back-and-forth required.',
  },
  {
    heading: 'How to request a refund',
    body: [
      'Email connect@mcreatik.com with your order ID and what went wrong. We aim to respond within 2 business days.',
      'Approved refunds are issued to your original payment method via Razorpay and typically appear within 5–7 business days, depending on your bank.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'We may update this policy from time to time. The version in effect at the time of your purchase is the one that applies to that order.',
    ],
  },
]

export default function StoreRefundPolicyPage() {
  useSEO({
    title: 'Refund & Cancellation Policy | McreatiK Digital Store',
    description: 'Refund and cancellation policy for McreatiK Digital Store’s instant-download document products.',
    path: '/store/refund-policy',
  })

  return (
    <StorePageShell>
      <section className="px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <StoreSectionHeading
            align="left"
            eyebrow="Policy"
            title="Refund & Cancellation Policy"
            subtitle="Last updated 19 September 2026. Applies to all Digital Store orders."
          />

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section, index) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#17151f] mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[#4b4a55] text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
                    {section.list.map((item) => (
                      <li key={item} className="text-[#4b4a55] text-base leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.after && (
                  <p className="mt-3 text-[#4b4a55] text-base leading-relaxed">{section.after}</p>
                )}
              </motion.div>
            ))}
          </div>

          <p className="mt-14 text-sm text-[#17151f]/60">
            Questions? <Link to="/" className="font-semibold text-[var(--store-accent-text)]">Back to home</Link> or email{' '}
            <a href="mailto:connect@mcreatik.com" className="font-semibold text-[var(--store-accent-text)]">
              connect@mcreatik.com
            </a>
            .
          </p>
        </div>
      </section>
    </StorePageShell>
  )
}
