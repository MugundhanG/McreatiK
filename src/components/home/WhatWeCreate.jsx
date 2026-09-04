/* ============================================
   WhatWeCreate Section
   Four accent-tinted cards, one per category —
   same photo-card family as Explore McreatiK,
   just flat color instead of a photo since these
   are categories of work, not distinct businesses.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { HOME_WHAT_WE_CREATE } from '../../utils/constants'
import SectionHeading from './SectionHeading'

const WhatWeCreate = memo(function WhatWeCreate() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="What We Create" title="Digital and creative solutions under one roof" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOME_WHAT_WE_CREATE.map(({ category, icon: Icon, accent, items, comingSoon }, index) => (
            <motion.div
              key={category}
              className="relative rounded-lg p-6 overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${accent}26 0%, #121A3D 60%)`,
                border: `1px solid ${accent}40`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span
                className="flex items-center justify-center w-11 h-11 rounded-lg border mb-4"
                style={{ borderColor: accent, color: accent, backgroundColor: `${accent}1a` }}
              >
                <Icon className="w-5 h-5" />
              </span>

              <h3 className="text-white font-semibold font-display mb-3">{category}</h3>

              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    {item}
                  </li>
                ))}
              </ul>

              {comingSoon && (
                <span className="mt-3 inline-block text-xs font-mono-label uppercase" style={{ color: accent }}>
                  Coming Soon
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default WhatWeCreate
