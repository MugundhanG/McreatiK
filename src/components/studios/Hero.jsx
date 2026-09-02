/* ============================================
   Hero Section — Studios
   Light, paper-toned ground with a warm radial
   glow and the circular badge watermarked large
   in the background — exposure-style caption,
   editorial Fraunces headline.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import Button from '../ui/Button'
import studiosHeroPhoto from '../../assets/studios-hero-photo.webp'
import techHeroPhoto from '../../assets/tech-hero-photo.webp'

const StudiosHero = memo(function StudiosHero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF7F0]">
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, rgba(201,151,31,0.16) 0, transparent 45%),' +
            'radial-gradient(circle at 10% 85%, rgba(27,42,74,0.08) 0, transparent 40%)',
        }}
      />
      <div className="film-grain" />

      {/* Hero photo — hidden on mobile so it never collides with the headline; framed like a strip of film, fades toward the text column */}
      <img
        src={studiosHeroPhoto}
        alt=""
        aria-hidden="true"
        className="film-frame hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[58%] min-w-[400px] max-w-[840px] h-[78%] object-cover pointer-events-none select-none"
        style={{
          objectPosition: '75% center',
          WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 96%)',
          maskImage: 'linear-gradient(to left, black 55%, transparent 96%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-transparent to-[#FAF7F0]/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-32 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-xs uppercase text-[#C9971F] mb-5"
        >
          f/2.8 · 1/200s · ISO 400 — McreatiK Studios
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display italic font-normal text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#1C1710] max-w-3xl text-balance"
        >
          Photographs worth keeping, made worth remembering.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body mt-6 text-base sm:text-lg text-[#6B6153] max-w-xl leading-relaxed"
        >
          Portraits, weddings, and events — shot with an eye for the quiet moments
          in between the posed ones.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Button theme="studios" href="#book">
            Book a Session <FiArrowRight className="w-4 h-4" />
          </Button>
          <Button theme="studios" variant="outline" href="#gallery">
            View Gallery
          </Button>
        </motion.div>

        {/* Tech & Creative cross-promo teaser — a small card, not a banner, so it reads as a feature highlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Link
            to="/tech"
            className="group flex items-center gap-4 p-3 pr-5 rounded-xl bg-black/[0.02] border border-black/10 hover:border-[#5B5FEF]/40 transition-colors max-w-sm"
          >
            <img
              src={techHeroPhoto}
              alt=""
              aria-hidden="true"
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-mono-label text-[11px] uppercase text-[#8B8070]">Also from McreatiK</p>
              <p className="font-body text-sm font-semibold text-[#1C1710] group-hover:text-[#5B5FEF] transition-colors">
                Tech &amp; Creative Solutions
              </p>
            </div>
            <FiArrowUpRight className="w-4 h-4 text-[#8B8070] group-hover:text-[#5B5FEF] transition-colors shrink-0" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
})

export default StudiosHero
