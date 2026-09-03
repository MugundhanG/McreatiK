/* ============================================
   Testimonials Section
   Honestly-marked placeholders — no invented
   quotes or client names (see Studios' gallery/
   services for the same pattern). Swap each card
   for real content as testimonials come in; no
   component changes needed, just the copy below.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'

const PLACEHOLDER_SLOTS = Array.from({ length: 6 }, (_, i) => i)

const Testimonials = memo(function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Testimonials"
          title="What Clients Say"
          subtitle="Real feedback from real clients, added here as it comes in."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLACEHOLDER_SLOTS.map((i) => (
            <motion.div
              key={i}
              className="rounded-lg border border-dashed border-white/15 p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="text-3xl font-display text-white/15 leading-none">&ldquo;</span>
              <p className="text-gray-500 text-sm italic leading-relaxed -mt-2">
                Testimonial coming soon.
              </p>
              <p className="text-gray-600 text-xs font-mono-label mt-auto pt-2 border-t border-white/10">
                Client Name · Business Type
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default Testimonials
