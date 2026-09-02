/* ============================================
   Landing — Department Picker
   Split-screen gateway: left is Tech's dark
   world, right is Studios' light world — the
   two department palettes shown side by side
   before the visitor picks one.
   ============================================ */

import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { setFavicon } from '../utils/setFavicon'
import techLogo from '../assets/tech-logo-dark-bg.png'
import studiosLogo from '../assets/studios-logo-light-bg.png'

const Landing = memo(function Landing() {
  useEffect(() => {
    document.title = 'McreatiK | Tech & Creative Solutions and Studios'
    setFavicon('/favicon-tech.png')
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ===== LEFT — Tech (dark) ===== */}
      <motion.div
        className="flex-1 min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Link
          to="/tech"
          className="theme-tech group relative flex h-full min-h-[50vh] flex-col items-start justify-end gap-4 bg-[#0a0b10] p-8 sm:p-12 lg:p-16 overflow-hidden transition-colors duration-300"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/25 via-transparent to-[#FF6B35]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img src={techLogo} alt="McreatiK Tech & Creative" className="relative h-14 sm:h-16 w-auto object-contain mb-2" />
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
            Tech &amp; Creative Solutions
          </h2>
          <p className="relative text-gray-400 max-w-md leading-relaxed">
            Websites, brand identity, and digital design for businesses that want to look as good as they perform.
          </p>
          <span className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            Enter <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </motion.div>

      {/* ===== RIGHT — Studios (light) ===== */}
      <motion.div
        className="flex-1 min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
      >
        <Link
          to="/studios"
          className="group relative flex h-full min-h-[50vh] flex-col items-start justify-end gap-4 bg-[#FAF7F0] p-8 sm:p-12 lg:p-16 overflow-hidden transition-colors duration-300"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9971F]/15 via-transparent to-[#8B2E2A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img src={studiosLogo} alt="McreatiK Studios" className="relative h-14 sm:h-16 w-auto object-contain mb-2" />
          <h2 className="relative font-serif italic font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1C1710]">
            Studios
          </h2>
          <p className="relative text-[#6B6153] max-w-md leading-relaxed">
            Photography for the moments worth keeping — portraits, weddings, and events.
          </p>
          <span className="relative inline-flex items-center gap-1.5 text-sm font-medium text-[#4A4438] group-hover:text-[#1C1710] transition-colors">
            Enter <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </motion.div>

    </div>
  )
})

export default Landing
