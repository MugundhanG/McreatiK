/* ============================================
   Testimonials Section
   Visual treatment adapted from a 3-column
   auto-scrolling marquee reference design, kept on
   this project's existing stack (plain JS + Tailwind
   + framer-motion, no shadcn/TypeScript/lucide swap
   needed beyond the icons below). Content stays
   exactly what it was: honestly-marked placeholders
   with no invented quotes, client names, or photos —
   a generic avatar icon stands in for a real photo.
   Swap the placeholder text for real quotes as they
   come in; no structural changes needed.
   ============================================ */

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Quote, UserCircle2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

/* Two placeholder cards per column; each column's list is rendered
   twice back-to-back and scrolled exactly -50% of its own height,
   which makes the loop seamless. */
const COLUMN_ITEM_COUNTS = [2, 2, 2]
const COLUMN_DURATIONS = [15, 19, 17]

function TestimonialCard() {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(20, 22, 28, 0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="w-full max-w-xs rounded-2xl border border-stone-200 bg-white p-7 shadow-sm"
    >
      <Quote className="h-6 w-6 text-[#1E4FD9]/40" strokeWidth={2.5} />
      <p className="mt-3 text-sm italic leading-relaxed text-stone-500">Testimonial coming soon.</p>
      <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
        <UserCircle2 className="h-10 w-10 shrink-0 text-stone-300" strokeWidth={1.5} />
        <p className="font-mono-label text-xs text-stone-500">Client Name &middot; Business Type</p>
      </div>
    </motion.div>
  )
}

function TestimonialsColumn({ count, duration, className = '' }) {
  const reduceMotion = useReducedMotion()
  const items = Array.from({ length: count })

  return (
    <div className={className}>
      <motion.ul
        animate={reduceMotion ? undefined : { translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="m-0 flex list-none flex-col gap-5 p-0"
      >
        {[0, 1].map((dup) => (
          <React.Fragment key={dup}>
            {items.map((_, i) => (
              <li key={`${dup}-${i}`} aria-hidden={dup === 1}>
                <TestimonialCard />
              </li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  )
}

const Testimonials = memo(function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Testimonials"
          title="What Clients Say"
          subtitle="Real feedback from real clients, added here as it comes in."
        />

        <div
          className="flex max-h-[520px] justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
          role="region"
          aria-label="Scrolling testimonial placeholders"
        >
          <TestimonialsColumn count={COLUMN_ITEM_COUNTS[0]} duration={COLUMN_DURATIONS[0]} />
          <TestimonialsColumn count={COLUMN_ITEM_COUNTS[1]} duration={COLUMN_DURATIONS[1]} className="hidden md:block" />
          <TestimonialsColumn count={COLUMN_ITEM_COUNTS[2]} duration={COLUMN_DURATIONS[2]} className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
})

export default Testimonials
