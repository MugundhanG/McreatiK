/* ============================================
   About Section — Studios
   Short editorial statement + stats strip.
   Placeholder copy — replace with the real
   studio story before launch.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { STUDIOS_STATS } from '../../utils/constants'

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
          Behind the lens
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710] leading-snug mb-8"
        >
          Placeholder — this is where the studio's real story goes: how it started,
          what it shoots, and why clients come back.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-body text-[#6B6153] leading-relaxed max-w-2xl mx-auto"
        >
          Swap this paragraph for a short, specific bio — the kind of detail that makes
          a couple or a family pick this studio over another one.
        </motion.p>

        <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 border-t border-black/10 pt-10">
          {STUDIOS_STATS.map(({ value, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="font-display italic text-2xl sm:text-3xl text-[#C9971F]">{value}</div>
              <div className="font-mono-label text-[11px] uppercase text-[#6B6153] mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StudiosAbout
