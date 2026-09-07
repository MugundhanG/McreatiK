/* ============================================
   Offerings Section — Studios
   The department's services, framed as a shoot
   menu rather than a SaaS feature grid — three
   cards per row instead of one long list.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiImage, FiBook } from 'react-icons/fi'
import { STUDIOS_SERVICES } from '../../utils/constants'

const StudiosOfferings = memo(function StudiosOfferings() {
  return (
    <section id="offerings" className="relative py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What we shoot</p>
            <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Offerings</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/studios/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-[#1C1710] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15"
            >
              <FiImage className="w-4 h-4" /> View Gallery
            </Link>
            <Link
              to="/studios/albums"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#C9971F] px-6 py-3 text-sm font-semibold text-[#C9971F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C9971F] hover:text-white hover:shadow-lg hover:shadow-[#C9971F]/25"
            >
              <FiBook className="w-4 h-4" /> Albums
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDIOS_SERVICES.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group rounded-lg border border-black/10 bg-white/40 p-6 transition-colors hover:border-[#C9971F]/50"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 shrink-0 rounded-full border border-[#C9971F]/40 flex items-center justify-center group-hover:border-[#C9971F] transition-colors">
                  <Icon className="w-4.5 h-4.5 text-[#C9971F]" />
                </div>
                <span className="font-mono-label text-xs text-[#8B2E2A]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-xl text-[#1C1710] mb-1.5">{title}</h3>
              <p className="font-body text-sm text-[#6B6153] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StudiosOfferings
