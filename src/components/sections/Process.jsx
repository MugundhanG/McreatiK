/* ============================================
   Process Section — "Production Line"
   A genuine sequence, so numbering earns its
   place here (unlike elsewhere on the page): a
   connected rail with nodes, horizontal on
   desktop, vertical on mobile — not a card grid.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { TECH_PROCESS_STEPS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

const Process = memo(function Process() {
  return (
    <section id="process" className="relative py-24 lg:py-32">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="How It Works"
          title="From First Message to Launch"
          subtitle="A simple, transparent process — you'll know what's happening at every step."
        />

        {/* Desktop — horizontal rail */}
        <div className="hidden lg:block relative">
          <div className="absolute top-6 left-0 right-0 h-px bg-stone-200" />
          <div className="grid grid-cols-5 gap-6">
            {TECH_PROCESS_STEPS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-stone-50 border border-[#1E4FD9]/35 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#1E4FD9]" />
                </div>
                <span className="font-mono-label text-xs text-stone-400">{step}</span>
                <h3 className="text-stone-900 font-semibold font-display mt-1 mb-1.5">{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet — vertical rail */}
        <div className="lg:hidden relative pl-6">
          <div className="absolute top-1 bottom-1 left-0 w-px bg-stone-200" />
          <div className="space-y-10">
            {TECH_PROCESS_STEPS.map(({ icon: Icon, step, title, description }, index) => (
              <motion.div
                key={step}
                className="relative"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="absolute -left-9 top-0 w-8 h-8 rounded-full bg-stone-50 border border-[#1E4FD9]/35 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#1E4FD9]" />
                </div>
                <span className="font-mono-label text-xs text-stone-400">{step}</span>
                <h3 className="text-stone-900 font-semibold font-display mt-1 mb-1.5">{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default Process
