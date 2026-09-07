/* ============================================
   FAQ Section — Tabbed Accordion
   Questions are grouped by service category
   (Websites / Branding / Digital Design) so
   visitors can jump straight to what they came
   for instead of scanning one long list.
   ============================================ */

import React, { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { TECH_FAQ, TECH_SERVICE_CATEGORIES } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import SectionDivider from '../ui/SectionDivider'

const FAQ = memo(function FAQ() {
  const [category, setCategory] = useState(TECH_SERVICE_CATEGORIES[0])
  const [openIndex, setOpenIndex] = useState(0)

  const selectCategory = (next) => {
    setCategory(next)
    setOpenIndex(0)
  }

  const visibleFaqs = TECH_FAQ.filter((item) => item.category === category)

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ FAQ" />
        <SectionHeading
          label="Frequently Asked Questions"
          title="Questions You Might Have"
          subtitle="Straight answers before you reach out."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TECH_SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#1E4FD9] border-[#1E4FD9] text-white'
                  : 'border-stone-200 text-stone-600 hover:border-[#1E4FD9]/40 hover:text-[#1E4FD9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="border-t border-stone-200">
          {visibleFaqs.map(({ question, answer }, index) => {
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
