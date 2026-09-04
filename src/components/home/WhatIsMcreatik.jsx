/* ============================================
   WhatIsMcreatik Section
   Plain text, centered, no cards — establishes
   McreatiK as the umbrella brand before the
   ecosystem cards below explain the parts.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const WhatIsMcreatik = memo(function WhatIsMcreatik() {
  return (
    <section id="about" className="relative py-24 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          className="inline-block font-mono-label text-xs text-[#D8AE55] mb-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What is McreatiK?
        </motion.span>
        <motion.p
          className="text-2xl sm:text-3xl font-display font-medium leading-snug text-white"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          McreatiK is a digital and creative brand — the people behind your website one day, your photographer the next.
        </motion.p>
        <motion.p
          className="mt-6 text-gray-400 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tech and Studios grew out of the same belief: that a business, a professional, or a creator deserves both a strong digital presence and work that actually looks the part. McreatiK is what holds those together as they grow.
        </motion.p>
      </div>
    </section>
  )
})

export default WhatIsMcreatik
