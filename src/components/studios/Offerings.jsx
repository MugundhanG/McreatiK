/* ============================================
   Offerings Section — Studios
   The department's services, framed as a shoot
   menu rather than a SaaS feature grid.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { STUDIOS_SERVICES } from '../../utils/constants'

const StudiosOfferings = memo(function StudiosOfferings() {
  return (
    <section id="offerings" className="relative py-24 lg:py-32 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What we shoot</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Offerings</h2>
        </motion.div>

        <div className="divide-y divide-black/10">
          {STUDIOS_SERVICES.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex items-start sm:items-center gap-5 sm:gap-8 py-7"
            >
              <span className="font-mono-label text-xs text-[#8B2E2A] shrink-0 w-6 pt-1 sm:pt-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="w-11 h-11 shrink-0 rounded-full border border-[#C9971F]/40 flex items-center justify-center group-hover:border-[#C9971F] transition-colors">
                <Icon className="w-4.5 h-4.5 text-[#C9971F]" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl text-[#1C1710] mb-1">{title}</h3>
                <p className="font-body text-sm text-[#6B6153] leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StudiosOfferings
