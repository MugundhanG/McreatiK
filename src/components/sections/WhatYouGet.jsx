/* ============================================
   WhatYouGet Section — "Inclusions Manifest"
   Not a checklist boxed in one big card: stamped
   tag chips flowing freely between two rules,
   like items listed on a manifest strip.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { TECH_WHAT_YOU_GET } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

const WhatYouGet = memo(function WhatYouGet() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What You Get"
          title="Your Website Can Include"
          subtitle="Exactly what goes into your site depends on your business, but here's what's typically included."
        />

        <div className="border-y border-white/10 py-10">
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_WHAT_YOU_GET.map((item, index) => (
              <motion.span
                key={item}
                className="px-4 py-2 rounded-full border border-[#5B5FEF]/25 text-sm text-gray-300 hover:border-[#5B5FEF]/60 hover:text-white transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default WhatYouGet
