/* ============================================
   WhyMcreatik Section
   Genuine differentiators as a ruled two-column
   list — text-forward, no boxes, no superlatives.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { HOME_WHY_MCREATIK } from '../../utils/constants'
import SectionHeading from './SectionHeading'

const LEFT = HOME_WHY_MCREATIK.slice(0, 2)
const RIGHT = HOME_WHY_MCREATIK.slice(2)

const Row = ({ title, description, index }) => (
  <motion.div
    className="py-6 border-b border-white/10 last:border-b-0"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
  >
    <h3 className="text-white font-semibold font-display mb-1.5">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
)

const WhyMcreatik = memo(function WhyMcreatik() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Why McreatiK" title="What Makes This Different" />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-white/10">
          <div className="lg:pr-10">
            {LEFT.map((item, i) => <Row key={item.title} {...item} index={i} />)}
          </div>
          <div className="lg:pl-10">
            {RIGHT.map((item, i) => <Row key={item.title} {...item} index={i + 2} />)}
          </div>
        </div>
      </div>
    </section>
  )
})

export default WhyMcreatik
