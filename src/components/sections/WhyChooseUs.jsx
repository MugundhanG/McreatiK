/* ============================================
   WhyChooseUs Section — Bento Grid
   An asymmetric card grid (wide + narrow, then a
   row of three, then a full-width card) — each card
   tops a blueprint-line illustration on a pale blue
   construction ground, echoing the department's
   signal-blue/rust register instead of a stock
   illustration pack. Content unchanged from the
   original spec-sheet layout.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { TECH_WHY_CHOOSE_US, TECH_TRUST_STATEMENTS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import {
  ModernProfessionalArt,
  MobileFirstArt,
  BuiltAroundArt,
  ConversionFocusedArt,
  FastReliableArt,
  OngoingSupportArt,
} from '../ui/WhyChooseUsArt'

const ART = [ModernProfessionalArt, MobileFirstArt, BuiltAroundArt, ConversionFocusedArt, FastReliableArt, OngoingSupportArt]

/* Row1: wide + narrow. Row2: three equal. Row3: one full-width. */
const SPAN = ['sm:col-span-2', 'sm:col-span-1', 'sm:col-span-1', 'sm:col-span-1', 'sm:col-span-1', 'sm:col-span-3']
const ART_HEIGHT = ['h-48', 'h-48', 'h-40', 'h-40', 'h-40', 'h-36']

const Card = ({ title, description, index }) => {
  const Art = ART[index]
  return (
    <motion.div
      className={`group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-colors duration-300 hover:border-[#1E4FD9]/30 ${SPAN[index]}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(20, 22, 28, 0.14)' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    >
      <div
        className={`blueprint-dots flex items-center justify-center overflow-hidden bg-[#1E4FD9]/[0.05] transition-colors duration-300 group-hover:bg-[#1E4FD9]/[0.09] ${ART_HEIGHT[index]}`}
      >
        <div className="w-full max-w-xs px-8 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <Art />
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{description}</p>
      </div>
    </motion.div>
  )
}

const WhyChooseUs = memo(function WhyChooseUs() {
  return (
    <section className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Choose Us"
          title="Why Businesses Choose McreatiK"
          subtitle="We're not just building websites — we're helping your business look the part online."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TECH_WHY_CHOOSE_US.map((item, i) => (
            <Card key={item.title} {...item} index={i} />
          ))}
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
