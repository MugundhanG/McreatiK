/* ============================================
   Hero Section — Tech & Creative (light theme)
   Text left; right is the department's signature
   visual — a blueprint-style line drawing of the
   four deliverable "sheets" a project actually
   ships (website, card, logo, resume) — in place
   of a generic stock photo.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '../ui/Button'
import TechHeroGraphic from '../ui/TechHeroGraphic'
import { getWhatsAppHref } from '../../utils/whatsapp'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'd like a free consultation for my business.")

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay } },
})

const Hero = memo(function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-stone-50 blueprint-grid"
    >
      {/* Paper fades the grid out toward the edges so it reads as texture, not a pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#FAFAF9_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ===== LEFT — Text Content ===== */}
          <div className="flex flex-col items-start">

            <motion.span
              className="font-mono-label text-xs uppercase text-[#A8460A] mb-4"
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
            >
              McreatiK — Tech &amp; Creative Solutions
            </motion.span>

            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-white text-stone-700 border border-stone-200 shadow-sm mb-7"
              variants={fadeUp(0.05)}
              initial="hidden"
              animate="visible"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono-label">Now accepting new projects for 2026</span>
            </motion.span>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight text-left text-stone-900"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
            >
              Build a stronger{' '}
              <span className="text-[#1E4FD9]">digital presence</span>{' '}
              for your business
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-6 text-base sm:text-lg text-stone-600 max-w-lg leading-relaxed text-left"
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
            >
              Modern websites, branding, and digital design that help local businesses
              look professional online — and get more customers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-9 flex flex-wrap gap-4"
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
            >
              <Button href={WHATSAPP_HREF}>
                <FaWhatsapp className="w-4 h-4" /> Get a Free Consultation
              </Button>
              <Button href="#portfolio" variant="outline">
                View Our Work <FiArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* ===== RIGHT — Signature blueprint graphic ===== */}
          <motion.div
            className="hidden lg:flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          >
            <TechHeroGraphic className="w-full max-w-md" />

            {/* CTA teaser card — overlaps the graphic slightly for depth */}
            <div className="relative -mt-10 w-full max-w-sm bg-white border border-stone-200 shadow-md shadow-stone-900/5 rounded-lg p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-900">Ready to start?</p>
                <p className="text-xs text-stone-500 mt-0.5">We reply within 24 hours</p>
              </div>
              <Button href={WHATSAPP_HREF} className="text-xs px-4 py-2 shrink-0">
                <FaWhatsapp className="w-3.5 h-3.5" /> Let's Talk
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
})

export default Hero
