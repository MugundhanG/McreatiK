/* ============================================
   StoreSectionHeading — Store
   Consistent heading block for the catalog page and every
   marketing section (benefits, what's included, how it works,
   FAQ, trust). Store's direction is deliberately motif-free
   (see index.css's .theme-store comment) — no ruled line, no
   icon anchor like Tech's RegMark — just a letter-spaced
   uppercase eyebrow label and confident Archivo type doing the
   work.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const StoreSectionHeading = memo(function StoreSectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignClasses = align === 'left' ? 'text-left' : 'text-center mx-auto'

  return (
    <motion.div
      className={`max-w-2xl ${alignClasses}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {eyebrow && (
        <div className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[var(--store-accent-text)] mb-2">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17151f] leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[#4b4a55] text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
})

export default StoreSectionHeading
