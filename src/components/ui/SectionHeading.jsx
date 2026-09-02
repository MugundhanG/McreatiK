/* ============================================
   SectionHeading Component — Tech & Creative
   Consistent heading block used at the top of
   every section. A single registration mark
   anchors the block — this department's motif,
   used once per section rather than repeated.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import RegMark from './RegMark'

const SectionHeading = memo(function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      className="relative text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <RegMark position="top-left" className="left-1/2 -translate-x-1/2 -top-3" />

      {/* Small label chip above the title */}
      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono-label uppercase rounded-full bg-[#5B5FEF]/10 text-[#a5a8ff] border border-[#5B5FEF]/20">
          {label}
        </span>
      )}

      {/* Main gradient title */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display gradient-text leading-tight">
        {title}
      </h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
})

export default SectionHeading
