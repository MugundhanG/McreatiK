/* ============================================
   SectionHeading Component
   Consistent heading block used at the top
   of every major section. Includes a small
   label chip, gradient title, and subtitle.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const SectionHeading = memo(function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Small label chip above the title */}
      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
