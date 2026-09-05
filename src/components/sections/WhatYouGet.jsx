/* ============================================
   WhatYouGet Section — "Inclusions Manifest"
   Each inclusion is a real line item now — what it
   is, and what it's for — not just a name. Still
   framed as a manifest between two rules, still no
   numbering (this is a set, not a sequence): a small
   check badge, a title, and a one-line description,
   flowing down two columns like an itemized list.
   An odd item count leaves one item dangling at the
   bottom of a column — that leftover is pulled out
   and centered as a closing line instead.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { TECH_WHAT_YOU_GET } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

function InclusionItem({ item, index, className = '' }) {
  return (
    <motion.div
      className={`flex items-start gap-3.5 py-5 ${className}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(index, 8) * 0.045 }}
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E4FD9]/10 text-[#1E4FD9]">
        <FiCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
      <div>
        <h3 className="font-display font-semibold text-stone-900 leading-snug">{item.title}</h3>
        <p className="mt-1 text-sm text-stone-600 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  )
}

const isOddCount = TECH_WHAT_YOU_GET.length % 2 !== 0
const columnItems = isOddCount ? TECH_WHAT_YOU_GET.slice(0, -1) : TECH_WHAT_YOU_GET
const closingItem = isOddCount ? TECH_WHAT_YOU_GET[TECH_WHAT_YOU_GET.length - 1] : null

const WhatYouGet = memo(function WhatYouGet() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What You Get"
          title="Your Website Can Include"
          subtitle="Exactly what goes into your site depends on your business, but here's what's typically included."
        />

        <div className="border-y border-stone-200 py-2">
          <div className="sm:columns-2 sm:gap-x-12" style={{ columnRule: '1px solid #e7e5e4' }}>
            {columnItems.map((item, index) => (
              <InclusionItem
                key={item.title}
                item={item}
                index={index}
                className="break-inside-avoid border-b border-stone-200 last:border-b-0"
              />
            ))}
          </div>

          {closingItem && (
            <div className="flex justify-center border-t border-stone-200 pt-1">
              <InclusionItem item={closingItem} index={columnItems.length} className="max-w-xs" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

export default WhatYouGet
