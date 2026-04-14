/* ============================================
   Hero Section
   Split layout — text left, visual panel right.
   Left: badge, headline, subtext, CTA buttons,
         trust indicators.
   Right: floating glass cards showing services
          and a stat summary panel.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiGlobe, FiPenTool, FiCreditCard, FiFileText, FiLayout, FiImage } from 'react-icons/fi'
import Button from '../ui/Button'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay } },
})

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut', delay } },
})

/* Small floating service pills shown on right panel */
const PREVIEW_SERVICES = [
  { icon: FiGlobe, label: 'Website Design & Development', color: 'text-indigo-400' },
  { icon: FiLayout, label: 'UI & UX Design', color: 'text-indigo-400' },
  { icon: FiPenTool, label: 'Brand Logo Design', color: 'text-cyan-400' },
  { icon: FiCreditCard, label: 'Business Digital Cards', color: 'text-violet-400' },
  { icon: FiFileText, label: 'Resume Design & Makeover', color: 'text-sky-400' },
  { icon: FiImage, label: 'Photo Album Design', color: 'text-sky-400' },
]

const Hero = memo(function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ===== LEFT — Text Content ===== */}
          <div className="flex flex-col items-start">

            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-7"
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Now accepting new projects for 2026
            </motion.span>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight text-left"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
            >
              We Craft{' '}
              <span className="gradient-text">Digital Experiences</span>{' '}
              That Drive Growth
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-6 text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed text-left"
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
            >
              From stunning websites to powerful brand identities, McreatiK delivers
              premium digital solutions that transform businesses and captivate audiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-9 flex flex-wrap gap-4"
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
            >
              <Button href="#contact">
                Get Started <FiArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#portfolio" variant="outline">
                View Our Work
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500"
              variants={fadeUp(0.4)}
              initial="hidden"
              animate="visible"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                50+ Projects
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                40+ Happy Clients
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                99% Satisfaction
              </span>
            </motion.div>
          </div>

          {/* ===== RIGHT — Visual Panel ===== */}
          <motion.div
            className="hidden lg:flex flex-col gap-4"
            variants={fadeLeft(0.3)}
            initial="hidden"
            animate="visible"
          >
            {/* Services preview card */}
            <div className="glass-card rounded-2xl p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                What We Do
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PREVIEW_SERVICES.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 hover:border-indigo-500/20 transition-colors"
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                    <span className="text-xs text-gray-300 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '50+', label: 'Projects' },
                { value: '40+', label: 'Happy Clients' },
                { value: '3+', label: 'Years of experience' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="glass-card rounded-2xl p-5 text-center"
                >
                  <div className="text-2xl font-bold gradient-text font-display">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* CTA teaser card */}
            <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Ready to start?</p>
                <p className="text-xs text-gray-400 mt-0.5">We reply within 24 hours</p>
              </div>
              <Button href="#contact" className="text-xs px-4 py-2 shrink-0">
                Let's Talk <FiArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
})

export default Hero
