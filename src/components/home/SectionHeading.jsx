/* ============================================
   SectionHeading — McreatiK (home)
   Same block structure as Tech's, recolored to
   the home palette and anchored with the K-mark
   signature instead of Tech's reg-mark.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const SectionHeading = memo(function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      className="relative text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <span className="k-mark absolute left-1/2 -translate-x-1/2 -top-4" aria-hidden="true" />

      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono-label uppercase rounded-full bg-[#D8AE55]/10 text-[#D8AE55] border border-[#D8AE55]/25">
          {label}
        </span>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display gradient-text-home leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-[#8890AE] text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
})

export default SectionHeading
