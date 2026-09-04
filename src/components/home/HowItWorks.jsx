/* ============================================
   HowItWorks Section
   A genuine sequence, so numbering earns its
   place: a connected rail, horizontal on desktop,
   vertical on mobile.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { HOME_HOW_IT_WORKS } from '../../utils/constants'
import SectionHeading from './SectionHeading'
import howItWorksBg from '../../assets/how-it-works-bg.png'

const HowItWorks = memo(function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-28 overflow-hidden">
      {/* Background photo — blurred and dimmed to a faint texture so the steps stay fully legible */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={howItWorksBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110 blur-lg opacity-90"
        />
        <div className="absolute inset-0 bg-[#0A1128]/40" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="How It Works" title="From First Message to Delivery" />

        {/* Desktop — horizontal rail */}
        <div className="hidden md:block relative">
          <div className="absolute top-6 left-0 right-0 h-px bg-white/10" />
          <div className="grid grid-cols-4 gap-6">
            {HOME_HOW_IT_WORKS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#0A1128] border border-[#D8AE55]/40 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#D8AE55]" />
                </div>
                <span className="font-mono-label text-xs text-gray-400">{step}</span>
                <h3 className="text-white font-semibold font-display mt-1 mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile — vertical rail */}
        <div className="md:hidden relative pl-6">
          <div className="absolute top-1 bottom-1 left-0 w-px bg-white/10" />
          <div className="space-y-10">
            {HOME_HOW_IT_WORKS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                className="relative"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="absolute -left-9 top-0 w-8 h-8 rounded-full bg-[#0A1128] border border-[#D8AE55]/40 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#D8AE55]" />
                </div>
                <span className="font-mono-label text-xs text-gray-400">{step}</span>
                <h3 className="text-white font-semibold font-display mt-1 mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default HowItWorks
