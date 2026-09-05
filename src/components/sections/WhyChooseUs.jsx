/* ============================================
   WhyChooseUs Section — "Spec Sheet"
   Not a card grid: a flat, ruled line-item list,
   like a spec sheet in the same production-doc
   language as the Hero's build manifest. Two
   ruled columns on desktop, one on mobile.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { TECH_WHY_CHOOSE_US, TECH_TRUST_STATEMENTS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import RegMark from '../ui/RegMark'

const LEFT = TECH_WHY_CHOOSE_US.slice(0, 3)
const RIGHT = TECH_WHY_CHOOSE_US.slice(3)

const Row = ({ icon: Icon, title, description, index }) => (
  <motion.div
    className="group flex items-start gap-5 py-6 border-b border-stone-200 last:border-b-0"
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
  >
    <span className="font-mono-label text-xs text-stone-400 pt-1 w-10 shrink-0">
      {String(index + 1).padStart(2, '0')}
    </span>
    <Icon className="w-5 h-5 text-[#1E4FD9] shrink-0 mt-0.5 group-hover:text-[#A8460A] transition-colors" />
    <div>
      <h3 className="text-stone-900 font-semibold font-display mb-1">{title}</h3>
      <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
)

const WhyChooseUs = memo(function WhyChooseUs() {
  return (
    <section className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Choose Us"
          title="Why Businesses Choose McreatiK"
          subtitle="We're not just building websites — we're helping your business look the part online."
        />

        <div className="relative glass-card rounded-lg px-6 sm:px-10 py-4">
          <RegMark position="top-left" />
          <RegMark position="bottom-right" />
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-stone-200">
            <div className="lg:pr-10">
              {LEFT.map((item, i) => <Row key={item.title} {...item} index={i} />)}
            </div>
            <div className="lg:pl-10">
              {RIGHT.map((item, i) => <Row key={item.title} {...item} index={i + 3} />)}
            </div>
          </div>
        </div>

        {/* Factual trust strip — no fake testimonials, just what's actually true */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {TECH_TRUST_STATEMENTS.map((statement) => (
            <span key={statement} className="inline-flex items-center gap-2 text-sm text-stone-600">
              <FiCheck className="w-4 h-4 text-[#1E4FD9] shrink-0" />
              {statement}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
})

export default WhyChooseUs
