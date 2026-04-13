/* ============================================
   Hero Section
   Full-viewport landing area with:
     - Animated headline and subtext
     - Two CTA buttons (primary + outline)
     - Floating decorative gradient orbs
     - Subtle grid overlay for depth
   Uses Framer Motion for staggered entrance.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiPlay } from 'react-icons/fi'
import Button from '../ui/Button'

/* Stagger children animations */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const Hero = memo(function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ---------- Background Decorations ---------- */}
      {/* Large gradient orb — top right */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      {/* Small accent orb — bottom left */}
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ---------- Content ---------- */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Announcement badge */}
        <motion.div variants={fadeUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Now accepting new projects for 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight"
        >
          We Craft{' '}
          <span className="gradient-text">Digital Experiences</span>{' '}
          That Drive Growth
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          From stunning websites to powerful brand identities, McreatiK delivers
          premium digital solutions that transform businesses and captivate audiences.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="#contact">
            Get Started <FiArrowRight className="w-4 h-4" />
          </Button>
          <Button href="#portfolio" variant="outline">
            <FiPlay className="w-4 h-4" /> View Our Work
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            150+ Projects
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            50+ Happy Clients
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            99% Satisfaction
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-gray-400"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
})

export default Hero
