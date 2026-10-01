/* ============================================
   About Section — Studios
   The founding story.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const StudiosAbout = memo(function StudiosAbout() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-xs uppercase text-[#C9971F] mb-5"
        >
          Our Story
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710] leading-snug mb-8"
        >
          It started with one camera and a lot of curiosity.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-body text-[#6B6153] leading-relaxed max-w-2xl mx-auto"
        >
          It began during the COVID quarantine, with one entry-level camera and a lot of
          free time. What started as a way to pass the time quickly became something more —
          the first spark of a genuine love for photography. Thousands of photos and countless
          hours of experimenting later, that curiosity turned into a clear direction. One day,
          that direction became a decision, and McreatiK Studios was born. Since then, we've
          grown into multiple areas of photography, but the reason hasn't changed — we're not
          here to just provide a service. We're here because we love being behind the camera,
          and because there's nothing quite like turning someone's moment into a memory they'll
          keep forever. That's the difference people notice, and it's why they choose us.
        </motion.p>
      </div>
    </section>
  )
})

export default StudiosAbout
