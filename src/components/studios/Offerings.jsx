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
          {STUDIOS_SERVICES.map(({ icon: Icon, title, description, image }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative min-h-[420px] overflow-hidden rounded-xl border border-black/10 transition-colors duration-300 hover:border-[#C9971F]/60"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-colors duration-300 group-hover:from-black/95" />

              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-sm transition-colors duration-300 group-hover:border-[#C9971F]">
                    <Icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="font-mono-label text-xs text-white/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-auto transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="font-display text-xl text-white mb-1.5">{title}</h3>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StudiosOfferings
