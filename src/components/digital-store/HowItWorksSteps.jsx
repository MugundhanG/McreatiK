/* ============================================
   HowItWorksSteps — Store
   Numbered, connected stepper replacing the plain <ol> in
   ProductStorySections' howItWorks block. Each step's number
   sits in a StoreIconBadge-styled circle; a connecting line
   runs between them on desktop (stacked, no line, on mobile).
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const HowItWorksSteps = memo(function HowItWorksSteps({ steps }) {
  if (!steps?.length) return null

  return (
    <ol className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-4">
      {steps.map((step, index) => (
        <motion.li
          key={step}
          className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:flex-1 sm:text-center relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="hidden sm:block absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px bg-[var(--store-accent)]/20"
            />
          ) : null}
          <span className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-[var(--store-accent)] text-white font-display font-bold text-sm flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm text-[#17151f] pt-1.5 sm:pt-0">{step}</span>
        </motion.li>
      ))}
    </ol>
  )
})

export default HowItWorksSteps
