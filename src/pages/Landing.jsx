/* ============================================
   Landing — Department Picker
   Split-screen gateway: left is Tech's dark
   world, right is Studios' light world. Logo +
   name sit centered; hovering grows a service
   list directly beneath them in normal flow, so
   it can never cover the mark.
   ============================================ */

import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { setFavicon } from '../utils/setFavicon'
import techLogo from '../assets/tech-logo-dark-bg.png'
import studiosLogo from '../assets/studios-logo-light-bg.png'
import { TECH_SERVICES, STUDIOS_SERVICES } from '../utils/constants'

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
          className="theme-tech group relative flex h-full min-h-[50vh] items-center justify-center bg-[#0a0b10] overflow-hidden transition-colors duration-300"
        >
          {/* Hover gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B5FEF] via-[#5B5FEF]/15 to-[#FF6B35] opacity-0 scale-100 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(91,95,239,0.6),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Centered mark + hover-revealed service list, all in normal flow */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 max-w-lg">
            <img src={techLogo} alt="McreatiK Tech & Creative" className="h-16 sm:h-20 w-auto object-contain" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Tech &amp; Creative Solutions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Websites, brand identity, and digital design for businesses that want to look as good as they perform.
            </p>

            <div className="w-full max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-wrap justify-center gap-2 pt-3">
                {TECH_SERVICES.map(({ title }) => (
                  <span
                    key={title}
                    className="text-xs font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm"
                  >
                    {title}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white mt-4">
                Enter <FiArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
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
          className="theme-studios group relative flex h-full min-h-[50vh] items-center justify-center bg-[#FAF7F0] overflow-hidden transition-colors duration-300"
        >
          {/* Hover gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9971F] via-[#C9971F]/15 to-[#8B2E2A] opacity-0 scale-100 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(201,151,31,0.55),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Centered mark + hover-revealed service list, all in normal flow */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 max-w-lg">
            <img src={studiosLogo} alt="McreatiK Studios" className="h-16 sm:h-20 w-auto object-contain" />
            <h2 className="font-display italic font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1C1710]">
              Studios
            </h2>
            <p className="text-[#4A4438] leading-relaxed">
              Photography for the moments worth keeping — portraits, weddings, and events.
            </p>

            <div className="w-full max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-wrap justify-center gap-2 pt-3">
                {STUDIOS_SERVICES.map(({ title }) => (
                  <span
                    key={title}
                    className="text-xs font-medium text-[#1C1710] bg-[#1C1710]/[0.06] border border-[#1C1710]/15 rounded-full px-3 py-1.5"
                  >
                    {title}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1C1710] mt-4">
                Enter <FiArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

    </div>
  )
})

export default Landing
