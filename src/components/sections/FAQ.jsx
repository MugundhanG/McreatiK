/* ============================================
   FAQ Section — Accordion
   Objection-handling before the final CTA: one
   question open at a time, plain ruled dividers
   rather than another card grid.
   ============================================ */

import React, { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { TECH_FAQ } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import SectionDivider from '../ui/SectionDivider'

const FAQ = memo(function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ FAQ" />
        <SectionHeading
          label="FAQ"
          title="Questions You Might Have"
          subtitle="Straight answers before you reach out."
        />

        <div className="border-t border-stone-200">
          {TECH_FAQ.map(({ question, answer }, index) => {
            const isOpen = openIndex === index
            return (
              <div key={question} className="border-b border-stone-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="text-stone-900 font-medium font-display">{question}</span>
                  <FiPlus
                    className={`w-4 h-4 text-[#1E4FD9] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-stone-600 text-sm leading-relaxed pb-5 pr-8">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default FAQ
