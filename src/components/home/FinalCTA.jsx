/* ============================================
   FinalCTA Section — McreatiK (home)
   Last invitation before the footer, open enough
   to cover both a digital and a creative need.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")

const FinalCTA = memo(function FinalCTA() {
  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D8AE55]/10 via-transparent to-[#4C5FA8]/15 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Have something in mind? Let's create it.
        </motion.h2>
        <motion.p
          className="mt-5 text-gray-400 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Whether it's a website, a brand, or a shoot — tell us what you need and we'll take it from there.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button href={WHATSAPP_HREF} theme="home">
            Start a Project <FiArrowRight className="w-4 h-4" />
          </Button>
          <Link
            to="/tech"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 border border-[#D8AE55]/50 text-[#D8AE55] hover:bg-[#D8AE55]/10 hover:border-[#D8AE55]"
          >
            See Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  )
})

export default FinalCTA
