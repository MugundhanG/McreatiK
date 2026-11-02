/* ============================================
   Instant Memories — FAQ
   Tabbed accordion (Studios / Couples / Guests),
   the same pattern as the Tech FAQ, in the
   Studios colours.
   ============================================ */

import React, { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { IM_FAQ, IM_FAQ_TABS } from '../../../data/instantMemories'

const InstantMemoriesFAQ = memo(function InstantMemoriesFAQ() {
  const [tab, setTab] = useState(IM_FAQ_TABS[0])
  const [openIndex, setOpenIndex] = useState(0)
  const items = IM_FAQ.filter((f) => f.tab === tab)

  const choose = (next) => {
    setTab(next)
    setOpenIndex(0)
  }

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3 text-center">Questions</p>
        <h2 className="font-display italic text-3xl sm:text-4xl text-[#1C1710] text-center mb-10">Asked by studios, couples and guests</h2>

        <div role="tablist" aria-label="Who is asking" className="flex flex-wrap justify-center gap-2 mb-8">
          {IM_FAQ_TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => choose(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                tab === t ? 'bg-[#1C1710] border-[#1C1710] text-white' : 'border-black/15 text-[#4A4438] hover:border-[#C9971F] hover:text-[#C9971F]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="border-t border-black/10" role="tabpanel" aria-label={`${tab} questions`}>
          {items.map(({ question, answer }, index) => {
            const isOpen = openIndex === index
            return (
              <div key={question} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="font-display text-lg text-[#1C1710]">{question}</span>
                  <FiPlus className={`w-4 h-4 text-[#C9971F] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
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
                      <p className="font-body text-[#4A4438] text-sm leading-relaxed pb-5 pr-8">{answer}</p>
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

export default InstantMemoriesFAQ
