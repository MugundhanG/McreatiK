/* ============================================
   Packages Section
   Starter and Professional differ a lot in content
   volume (11 vs 21 line items), which made three
   equal-width columns look mismatched in height.
   Fix: widen them into a two-column row, and split
   Professional's own categories into two internal
   sub-columns so its extra content compresses instead
   of just running longer — the two cards land much
   closer in height without forcing empty space into
   the shorter one. Premium (27 items across four
   categories) moves to its own full-width row below,
   laid out as an info sidebar + a four-column feature
   grid, using the extra width instead of one long
   column. All three cards stay styled identically at
   rest — no permanent border or shadow marks the
   "Popular" tier apart, only its badge text does.
   Hovering any card reveals a signal-blue border and
   a lift, uniformly across all three.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiLifeBuoy } from 'react-icons/fi'
import { TECH_PACKAGES, TECH_PACKAGES_FOOTNOTE } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const CARE_PLAN_WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I'd like to know more about your Care Plans for ongoing website support."
)

function CategoryList({ category }) {
  return (
    <div className="break-inside-avoid">
      <p className="text-sm font-semibold text-stone-900">{category.title}</p>
      {category.note && <p className="mt-0.5 text-xs italic text-stone-500">{category.note}</p>}
      <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
        {category.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1E4FD9]/10 text-[#1E4FD9]">
              <FiCheck className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PackageHeader({ pkg, index }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono-label text-xs text-stone-400">{String(index + 1).padStart(2, '0')}</span>
        {pkg.highlight && (
          <span className="shrink-0 rounded-full bg-[#1E4FD9] px-3 py-1 text-xs font-mono-label uppercase text-white">
            Popular
          </span>
        )}
      </div>

      <h3 className="mt-3 text-2xl font-bold font-display text-stone-900">{pkg.name}</h3>
      <p className="mt-0.5 text-sm font-medium text-[#1E4FD9]">{pkg.displayName}</p>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{pkg.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-stone-900">{pkg.price}</span>
        <span className="text-sm text-stone-500">one-time</span>
      </div>

      <Button
        href={getWhatsAppHref(`Hi McreatiK, I'd like to know more about the ${pkg.name} package (${pkg.price}).`)}
        className={`mt-6 w-full justify-center !rounded-full ${
          pkg.highlight ? '' : '!bg-neutral-950 !text-white !shadow-none hover:!bg-neutral-800'
        }`}
      >
        <FaWhatsapp className="w-4 h-4" /> Request a Quote
      </Button>
    </>
  )
}

const cardMotionProps = (index) => ({
  className: 'group relative rounded-2xl border border-stone-200 bg-white p-8 transition-colors duration-300 hover:border-[#1E4FD9]',
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  whileHover: { y: -6, boxShadow: '0 20px 40px -12px rgba(20, 22, 28, 0.16)' },
  transition: { duration: 0.5, delay: index * 0.08 },
})

const Packages = memo(function Packages() {
  const [starter, professional, premium] = TECH_PACKAGES

  return (
    <section className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Packages"
          title="Website Development Packages"
          subtitle="Three tiers, clearly scoped — pick the one that matches your business, or use it as a starting point for the conversation."
        />
        <p className="-mt-12 mb-16 text-center text-sm text-stone-500">
          Need to know pricing for remaining services?{' '}
          <a
            href={getWhatsAppHref('Hi')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#1E4FD9] hover:underline"
          >
            Just send a Hi! on WhatsApp
          </a>
          .
        </p>

        {/* Starter + Professional — a wider two-column row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <motion.div {...cardMotionProps(0)} className={`${cardMotionProps(0).className} flex flex-col`}>
            <PackageHeader pkg={starter} index={0} />
            <div className="mt-8 space-y-6 border-t border-stone-200 pt-6">
              {starter.categories.map((category) => (
                <CategoryList key={category.title} category={category} />
              ))}
            </div>
          </motion.div>

          <motion.div {...cardMotionProps(1)} className={`${cardMotionProps(1).className} flex flex-col`}>
            <PackageHeader pkg={professional} index={1} />
            <div className="mt-8 border-t border-stone-200 pt-6">
              <p className="mb-5 font-mono-label text-xs uppercase text-stone-500">
                Everything in {professional.extraFrom}, plus:
              </p>
              <div className="sm:columns-2 sm:gap-x-8 [&>*]:mb-6">
                {professional.categories.map((category) => (
                  <CategoryList key={category.title} category={category} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium — its own full-width row: info sidebar + a wide feature grid */}
        <motion.div
          {...cardMotionProps(2)}
          className={`${cardMotionProps(2).className} mt-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10`}
        >
          <div className="flex flex-col lg:border-r lg:border-stone-200 lg:pr-10">
            <PackageHeader pkg={premium} index={2} />
          </div>
          <div className="mt-8 border-t border-stone-200 pt-6 lg:mt-0 lg:border-t-0 lg:pt-0">
            <div className="space-y-6">
              {premium.categories.map((category) => (
                <CategoryList key={category.title} category={category} />
              ))}
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-stone-500">{TECH_PACKAGES_FOOTNOTE}</p>

        {/* Care Plan — ongoing support, separate from the one-time build tiers above */}
        <motion.div
          className="mt-6 rounded-lg border border-stone-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border border-[#1E4FD9]/25 bg-[#1E4FD9]/[0.05] text-[#1E4FD9]">
            <FiLifeBuoy className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-stone-900 font-semibold font-display">Need ongoing support after launch?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Ask about our Care Plans — regular updates, backups, and small changes so your site stays fresh.
            </p>
          </div>
          <Button href={CARE_PLAN_WHATSAPP_HREF} variant="outline" className="shrink-0">
            <FaWhatsapp className="w-4 h-4" /> Ask About Care Plans
          </Button>
        </motion.div>
      </div>
    </section>
  )
})

export default Packages
