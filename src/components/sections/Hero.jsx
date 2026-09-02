/* ============================================
   Hero Section — Tech & Creative
   Split layout — text left, a "build manifest"
   spec panel right, itemizing what ships out of
   this department. Registration marks (this
   department's signature) anchor the panel.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button'
import RegMark from '../ui/RegMark'
import techHeroPhoto from '../../assets/tech-hero-photo.webp'
import { TECH_SERVICES, TECH_STATS } from '../../utils/constants'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay } },
})

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut', delay } },
})

const Hero = memo(function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#5B5FEF]/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#FF6B35]/10 rounded-full blur-[100px] pointer-events-none" />
      {/* Hero photo — hidden on mobile so it never collides with the headline; fades toward the text column so copy stays legible */}
      <img
        src={techHeroPhoto}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[62%] min-w-[420px] max-w-[900px] h-[85%] object-cover rounded-l-2xl pointer-events-none select-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 96%)',
          maskImage: 'linear-gradient(to left, black 55%, transparent 96%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-[#0a0b10]/30 pointer-events-none" />
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

            <motion.span
              className="font-mono-label text-xs uppercase text-[#FF6B35] mb-4"
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
            >
              McreatiK — Tech &amp; Creative Solutions
            </motion.span>

            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-[#5B5FEF]/10 text-[#a5a8ff] border border-[#5B5FEF]/20 mb-7"
              variants={fadeUp(0.05)}
              initial="hidden"
              animate="visible"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono-label">Now accepting new projects for 2026</span>
            </motion.span>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight text-left"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
            >
              We build the digital{' '}
              <span className="gradient-text">deliverables</span>{' '}
              your business ships with
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-6 text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed text-left"
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
            >
              Websites, brand identity, business cards, and resumes — designed and built
              with the same discipline as a production spec, from first draft to final file.
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
              {TECH_STATS.map(({ value, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B5FEF]" />
                  {value} {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ===== RIGHT — Build Manifest Panel ===== */}
          <motion.div
            className="hidden lg:flex flex-col gap-4"
            variants={fadeLeft(0.3)}
            initial="hidden"
            animate="visible"
          >
            {/* Service manifest card */}
            <div className="relative glass-card rounded-lg p-6">
              <RegMark position="top-left" />
              <RegMark position="bottom-right" />
              <p className="font-mono-label text-xs text-gray-500 uppercase mb-4">
                Service Manifest — {String(TECH_SERVICES.length).padStart(2, '0')} items
              </p>
              <div className="grid grid-cols-2 gap-x-5">
                {TECH_SERVICES.map(({ icon: Icon, title }, i) => {
                  const rows = Math.ceil(TECH_SERVICES.length / 2)
                  const isLastRow = Math.floor(i / 2) === rows - 1
                  return (
                    <div
                      key={title}
                      className={`flex items-center gap-2.5 py-2.5 ${isLastRow ? '' : 'border-b border-white/5'}`}
                    >
                      <span className="font-mono-label text-xs text-[#FF6B35] shrink-0 w-5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon className="w-4 h-4 shrink-0 text-[#a5a8ff]" />
                      <span className="text-sm text-gray-300 font-medium leading-tight">{title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {TECH_STATS.map(({ value, label }) => (
                <div key={label} className="glass-card rounded-lg p-5 text-center">
                  <div className="text-2xl font-bold gradient-text font-display">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* CTA teaser card */}
            <div className="glass-card rounded-lg p-5 flex items-center justify-between">
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
