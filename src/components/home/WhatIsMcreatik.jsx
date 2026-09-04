/* ============================================
   WhatIsMcreatik Section
   States the brand thesis in words on the left,
   then shows it — two small department panels
   joined by a "+" — on the right, so the
   "one brand, two crafts" idea is seen, not just
   read.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiGlobe, FiCamera } from 'react-icons/fi'

const DEPARTMENTS = [
  { icon: FiGlobe, label: 'McreatiK Tech', tagline: 'Websites & digital', accent: '#5B5FEF' },
  { icon: FiCamera, label: 'McreatiK Studios', tagline: 'Photography & Editing', accent: '#C9971F' },
]

const WhatIsMcreatik = memo(function WhatIsMcreatik() {
  return (
    <section id="about" className="relative py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 lg:gap-16 items-center">

          {/* ---------- Left — the statement ---------- */}
          <div className="text-center lg:text-left">
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
              className="text-2xl sm:text-3xl font-display font-medium leading-snug text-white text-balance"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              One brand behind two crafts — your website one week, your wedding photos the next.
            </motion.p>
            <motion.p
              className="mt-6 text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gray-200 font-medium">McreatiK Tech</span> builds the digital
              presence — websites and branding that make a business look credible online.{' '}
              <span className="text-gray-200 font-medium">McreatiK Studios</span> captures the
              moments a screen can't — portraits, weddings, events. Different crafts, same standard,
              one place to talk to about either.
            </motion.p>
          </div>

          {/* ---------- Right — the two departments, shown ---------- */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-5"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {DEPARTMENTS.map(({ icon: Icon, label, tagline, accent }, i) => (
              <React.Fragment key={label}>
                {i === 1 && (
                  <span className="font-display text-3xl text-[#D8AE55]/70 shrink-0 select-none">+</span>
                )}
                <div
                  className="w-36 sm:w-40 rounded-lg border bg-white/[0.03] backdrop-blur-sm px-4 py-6 flex flex-col items-center text-center gap-3"
                  style={{ borderColor: `${accent}40` }}
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-lg border shrink-0"
                    style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}1a` }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-white font-semibold font-display text-sm leading-tight">
                      {label.replace('McreatiK ', '')}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 leading-snug">{tagline}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

        </div>

        {/* ---------- Mission & Vision ---------- */}
        <div className="mt-20 lg:mt-24 pt-14 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-white/10">
          <motion.div
            className="lg:pr-12 pb-10 lg:pb-0 border-b lg:border-b-0 border-white/10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-mono-label text-xs uppercase text-[#D8AE55] mb-3">Our Mission</h3>
            <p className="text-lg font-display font-medium text-white leading-snug mb-3">
              Turn ideas into meaningful experiences.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              We bring technology and creativity together to create digital solutions and creative
              work that help people and businesses build, express and grow.
            </p>
          </motion.div>

          <motion.div
            className="lg:pl-12 pt-10 lg:pt-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-mono-label text-xs uppercase text-[#D8AE55] mb-3">Our Vision</h3>
            <p className="text-lg font-display font-medium text-white leading-snug mb-3">
              The same bar, no matter what we build next.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              We want McreatiK to be a name people trust. Today, that's Tech and Studios. Tomorrow,
              whatever comes next will have to meet the same standard.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
})

export default WhatIsMcreatik
