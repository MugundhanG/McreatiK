/* ============================================
   TargetIndustries Section — Business Carousel
   A row of three industry cards at a time — each
   showing its own minimal icon mark, position
   (e.g. 01/09), title, tagline and the site
   features that industry actually needs — with
   left/right controls to page through the rest.
   ============================================ */

import React, { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { TECH_TARGET_INDUSTRIES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import SectionHeading from '../ui/SectionHeading'
import SectionDivider from '../ui/SectionDivider'
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, my business doesn't fit a category — I'd like to talk about a custom design.")
const PAGE_SIZE = 3
const TOTAL = TECH_TARGET_INDUSTRIES.length
const PAGE_COUNT = Math.ceil(TOTAL / PAGE_SIZE)

const pad = (n) => String(n).padStart(2, '0')

function IndustryCard({ item }) {
  const Icon = item.icon
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 transition-colors duration-300 hover:border-[#1E4FD9]">
      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E4FD9]/10 text-[#1E4FD9] transition-transform duration-300 group-hover:scale-105">
          <Icon className="w-5 h-5" />
        </span>
        <span className="font-mono-label text-xs text-stone-400">
          {pad(item.index + 1)} / {pad(TOTAL)}
        </span>
      </div>

      <h3 className="font-display text-base font-bold uppercase tracking-wide text-stone-900 mb-2">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-stone-600 mb-6 flex-1">{item.tagline}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-stone-100 pt-4">
        {item.features.map((feature) => (
          <span key={feature} className="text-xs font-medium text-stone-500">
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
}

const TargetIndustries = memo(function TargetIndustries() {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  /* setPage uses the functional updater form so rapid clicks each advance
     from the latest page rather than the stale value closed over when the
     button was rendered. */
  const goPrev = () => {
    setDirection(-1)
    setPage((prev) => (prev - 1 + PAGE_COUNT) % PAGE_COUNT)
  }
  const goNext = () => {
    setDirection(1)
    setPage((prev) => (prev + 1) % PAGE_COUNT)
  }

  const visible = TECH_TARGET_INDUSTRIES
    .map((item, index) => ({ ...item, index }))
    .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section id="industries" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ Industries" />
        <SectionHeading
          label="Industries We Serve"
          title="Websites Designed for Businesses Like Yours"
          subtitle="Whatever your business, your website should make a strong first impression and make it easier to get enquiries."
        />

        {/* Carousel — three businesses at a time. No exit animation to
            wait on (mode="wait" can get stuck holding stale content if a
            transition is interrupted by another click) — the old page
            just unmounts immediately while the new one fades/slides in. */}
        <div className="relative overflow-hidden">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {visible.map((item) => (
              <IndustryCard key={item.title} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Controls — page through the rest */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={goPrev}
            aria-label="Previous businesses"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-[#1E4FD9] hover:text-[#1E4FD9] cursor-pointer"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-mono-label text-xs uppercase tracking-wider text-stone-400">
            {pad(page + 1)} / {pad(PAGE_COUNT)}
          </span>
          <button
            onClick={goNext}
            aria-label="Next businesses"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-[#1E4FD9] hover:text-[#1E4FD9] cursor-pointer"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-stone-600 text-sm">
            Your business doesn't fit a category? That's where custom design comes in.
          </p>
          <Button href={WHATSAPP_HREF}>
            <FaWhatsapp className="w-4 h-4" /> Tell Us About Your Business
          </Button>
        </div>
      </div>
    </section>
  )
})

export default TargetIndustries
