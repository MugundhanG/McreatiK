/* ============================================
   FinalCTA Section
   Last conversion push before the contact form —
   two clear paths: start a project, or chat now.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppHref } from '../../utils/whatsapp'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'm interested in getting a website for my business.")

/* The one deliberate dark moment on an otherwise light page — a punctuation
   mark before the closing Contact form, the same way a pull-quote spread
   breaks a magazine's white pages once, on purpose. */
const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#14161C]">
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30,79,217,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30,79,217,0.15) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to build a better digital presence?
        </motion.h2>
        <motion.p
          className="mt-5 text-stone-400 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Let's create something that represents your business professionally.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 bg-[#1E4FD9] text-white hover:bg-[#1840b8] shadow-sm shadow-[#1E4FD9]/30"
          >
            Start a Project <FiArrowRight className="w-4 h-4" />
          </a>
          <a
            href={WHATSAPP_HREF}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 border border-white/15 text-white hover:bg-white/5 hover:border-white/30"
          >
            <FaWhatsapp className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
})

export default FinalCTA
