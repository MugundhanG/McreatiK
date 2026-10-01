/* ============================================
   SectionHeading Component — Tech & Creative
   Consistent heading block used at the top of
   every section. A single registration mark
   anchors the block — this department's motif,
   used once per section rather than repeated.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RegMark from './RegMark'
import { RevealText } from '../motion'

/* `crumb` turns this into a page header: a "Tech / <crumb>" breadcrumb,
   an <h1> at display size, and it animates on load instead of on scroll.
   Used by the standalone Tech sub-pages (Services, Industries, FAQ, Blog). */
const SectionHeading = memo(function SectionHeading({ label, title, subtitle, crumb }) {
  const isPage = Boolean(crumb)
  const headingClass = isPage
    ? 'text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-stone-900 leading-[1.05] text-balance'
    : 'text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight text-stone-900 leading-tight text-balance'
  return (
    <motion.div
      className="relative text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <RegMark position="top-left" className="left-1/2 -translate-x-1/2 -top-3" />

      {isPage && (
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-500">
          <Link to="/tech" className="hover:text-[#1E4FD9] transition-colors">Tech</Link>
          <span className="mx-2 text-stone-300" aria-hidden="true">/</span>
          <span aria-current="page" className="text-stone-900">{crumb}</span>
        </nav>
      )}

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
      {typeof title === 'string' ? (
        <RevealText as={isPage ? 'h1' : 'h2'} animateOnMount={isPage} text={title} className={headingClass} />
      ) : (
        React.createElement(isPage ? 'h1' : 'h2', { className: headingClass }, title)
      )}

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
