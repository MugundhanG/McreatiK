/* ============================================
   Experience Page — Studios
   What clients can expect: the shoot process as
   a vertical rail, plus honest testimonial
   placeholders (no invented quotes or names —
   swap in real ones as they come in).
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiUser } from 'react-icons/fi'
import { STUDIOS_EXPERIENCE_STEPS } from '../../utils/constants'

function ProcessSteps() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What to expect</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">The Process</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            From your first message to the final delivery — here's how a shoot with us usually goes.
          </p>
        </motion.div>

        <div className="relative pl-6">
          <div className="absolute top-1 bottom-1 left-0 w-px bg-black/10" />
          <div className="space-y-10">
            {STUDIOS_EXPERIENCE_STEPS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                className="relative"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="absolute -left-9 top-0 w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#C9971F]/40 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#C9971F]" />
                </div>
                <span className="font-mono-label text-xs text-[#8B2E2A]">{step}</span>
                <h3 className="font-display text-lg text-[#1C1710] mt-1 mb-1.5">{title}</h3>
                <p className="font-body text-sm text-[#6B6153] leading-relaxed max-w-xl">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard() {
  return (
    <div className="rounded-lg border border-black/10 bg-white/50 p-6">
      <p className="font-body text-sm italic leading-relaxed text-[#6B6153]">Testimonial coming soon.</p>
      <div className="mt-5 flex items-center gap-3 border-t border-black/10 pt-4">
        <FiUser className="w-8 h-8 shrink-0 text-[#A89A88]" />
        <p className="font-mono-label text-[11px] uppercase text-[#6B6153]">Client Name &middot; Shoot Type</p>
      </div>
    </div>
  )
}

function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#F3EEE3]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">In their words</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">What Clients Say</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            Real feedback from real clients, added here as it comes in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <TestimonialCard />
          <TestimonialCard />
          <TestimonialCard />
        </div>
      </div>
    </section>
  )
}

const StudiosExperience = memo(function StudiosExperience() {
  return (
    <>
      <ProcessSteps />
      <Testimonials />
    </>
  )
})

export default StudiosExperience
