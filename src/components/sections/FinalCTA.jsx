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
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'm interested in getting a website for my business.")

const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/10 via-transparent to-[#FF6B35]/10 pointer-events-none" />

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
          className="mt-5 text-gray-400 text-lg"
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
          <Button href="#contact">
            Start a Project <FiArrowRight className="w-4 h-4" />
          </Button>
          <Button href={WHATSAPP_HREF} variant="outline">
            <FaWhatsapp className="w-4 h-4" /> Chat on WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  )
})

export default FinalCTA
