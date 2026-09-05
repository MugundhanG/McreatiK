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

      {/* Eyebrow — a ruled tag, not a chip; matches the blueprint/spec-sheet register */}
      {label && (
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="w-8 h-px bg-[#1E4FD9]/50" />
          <span className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#1E4FD9]">
            {label}
          </span>
          <span className="w-8 h-px bg-[#1E4FD9]/50" />
        </div>
      )}

      {/* Main title — solid ink, no gradient */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight text-stone-900 leading-tight text-balance">
        {title}
      </h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-4 text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
})

export default SectionHeading
