/* ============================================
   WhyMcreatik Section
   Genuine differentiators as a 2x2 card grid —
   icon + large ghost index number per card, same
   card language as WhatWeCreate for consistency.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { HOME_WHY_MCREATIK } from '../../utils/constants'
import SectionHeading from './SectionHeading'

const Card = ({ icon: Icon, title, description, index }) => (
  <motion.div
    className="group relative rounded-lg border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[#D8AE55]/40 hover:bg-white/[0.05]"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
  >
    <div className="flex items-start justify-between mb-6">
      <span className="flex items-center justify-center w-11 h-11 rounded-lg border border-[#D8AE55]/30 bg-[#D8AE55]/10 text-[#D8AE55] transition-colors duration-300 group-hover:border-[#D8AE55]/60 group-hover:bg-[#D8AE55]/15">
        <Icon className="w-5 h-5" />
      </span>
      <span className="font-display text-4xl text-white/[0.08] leading-none select-none">
        0{index + 1}
      </span>
    </div>
    <h3 className="text-white font-semibold font-display text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
)

const WhyMcreatik = memo(function WhyMcreatik() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Why McreatiK" title="What Makes This Different" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {HOME_WHY_MCREATIK.map((item, i) => (
            <Card key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default WhyMcreatik
