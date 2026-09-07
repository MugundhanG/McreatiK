/* ============================================
   Hero Section — Studios
   Full-bleed hero photo (100vw x 100vh) doubling
   as the backdrop for the transparent navbar above
   it — a dark gradient keeps both the nav and the
   headline legible over whatever the photo holds.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button'
import studiosHeroPhoto from '../../assets/studios-hero-photo.webp'

const StudiosHero = memo(function StudiosHero() {
  return (
    <section id="home" className="relative h-screen w-screen min-h-screen flex items-end overflow-hidden bg-[#1C1710] scroll-mt-28">
      <img
        src={studiosHeroPhoto}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="film-grain" />

      {/* Gradient — dark enough at the very top for the transparent navbar's
          logo/links, and dark enough at the bottom for the headline. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pb-20 sm:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display italic font-normal text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white max-w-3xl text-balance"
        >
          Photographs worth keeping, made worth remembering.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body mt-6 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed"
        >
          We capture the emotions, connections, and little moments that make every story uniquely yours.
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
          <Link
            to="/studios/gallery"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            View Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  )
})

export default StudiosHero
