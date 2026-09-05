/* ============================================
   TargetIndustries Section — "Directory Index"
   Not a card grid: an index of business types,
   like tabs on a client directory. Names first,
   scan the whole list at a glance; pick one to
   read the detail. Distinct from every other
   section's static layout.
   ============================================ */

import React, { memo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { TECH_TARGET_INDUSTRIES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import SectionHeading from '../ui/SectionHeading'
import SectionDivider from '../ui/SectionDivider'
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

const TargetIndustries = memo(function TargetIndustries() {
  const [active, setActive] = useState(0)
  const current = TECH_TARGET_INDUSTRIES[active]
  const Icon = current.icon

  return (
    <section id="industries" className="relative py-24 lg:py-32">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ Industries" />
        <SectionHeading
          label="Who We Work With"
          title="Websites Designed for Businesses Like Yours"
          subtitle="Whatever you run, your customers are already looking for you online. We make sure what they find looks the part."
        />

        {/* Index — names only, scan the whole list */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Business types">
          {TECH_TARGET_INDUSTRIES.map((item, i) => (
            <button
              key={item.title}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                active === i
                  ? 'bg-[#1E4FD9] border-[#1E4FD9] text-white'
                  : 'border-stone-200 text-stone-600 hover:border-[#1E4FD9]/40 hover:text-[#1E4FD9]'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Detail — the selected entry, read in full */}
        <div className="relative min-h-[180px] glass-card rounded-lg p-8 sm:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-start gap-6"
            >
              <span className="flex items-center justify-center w-14 h-14 shrink-0 rounded-lg border border-[#1E4FD9]/25 bg-[#1E4FD9]/[0.05] text-[#1E4FD9]">
                <Icon className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-semibold font-display text-stone-900 mb-2">{current.title}</h3>
                <p className="text-stone-600 leading-relaxed max-w-xl">{current.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-stone-600 text-sm">
            Don't see your kind of business here? We work with all kinds.
          </p>
          <Button href={WHATSAPP_HREF}>
            <FaWhatsapp className="w-4 h-4" /> Chat on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
})

export default TargetIndustries
