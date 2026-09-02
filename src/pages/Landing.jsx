/* ============================================
   Landing — Department Picker
   Split-screen gateway. Each panel carries a
   soft gradient and a badge watermark (sized in
   % of the panel so the full circle stays inside
   the frame on any device) even at rest,
   intensifying on hover. Hovering reveals the
   service list, centered beneath the description.
   The panel itself is inert — only the Enter link
   navigates.
   ============================================ */

import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { setFavicon } from '../utils/setFavicon'
import techLogo from '../assets/tech-logo-dark-bg.png'
import studiosLogo from '../assets/studios-logo-light-bg.png'
import techBadge from '../assets/tech-badge.webp'
import studiosBadge from '../assets/studios-badge.webp'
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
        <div className="theme-tech group relative flex h-full min-h-[50vh] items-center justify-center bg-[#0a0b10] overflow-hidden cursor-default">
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/35 via-[#5B5FEF]/5 to-[#FF6B35]/30 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(91,95,239,0.55),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge watermark — sized to the panel so the full circle always fits */}
          <img
            src={techBadge}
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] max-w-[360px] min-w-[220px] opacity-[0.16] pointer-events-none select-none"
          />

          {/* Centered mark + hover-revealed services, all centered as one block */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 pb-16 max-w-lg">
            <img src={techLogo} alt="McreatiK Tech & Creative" className="h-16 sm:h-20 w-auto object-contain" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Tech &amp; Creative Solutions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Websites, brand identity, and digital design for businesses that want to look as good as they perform.
            </p>

            <div className="w-full max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-col items-center gap-2.5 pt-5">
                {TECH_SERVICES.map(({ title }) => (
                  <span
                    key={title}
                    className="text-sm sm:text-base font-medium text-white bg-white/10 border border-white/20 rounded-full px-5 py-2.5"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enter — always available, pinned to the bottom */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/50 backdrop-blur-md border-t border-white/10">
            <Link
              to="/tech"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              Enter <FiArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===== RIGHT — Studios (light) ===== */}
      <motion.div
        className="flex-1 min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
      >
        <div className="theme-studios group relative flex h-full min-h-[50vh] items-center justify-center bg-[#FAF7F0] overflow-hidden cursor-default">
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9971F]/22 via-[#C9971F]/5 to-[#8B2E2A]/16 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(201,151,31,0.45),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge watermark — sized to the panel so the full circle always fits */}
          <img
            src={studiosBadge}
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] max-w-[360px] min-w-[220px] opacity-[0.14] pointer-events-none select-none"
          />

          {/* Centered mark + hover-revealed services, all centered as one block */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 pb-16 max-w-lg">
            <img src={studiosLogo} alt="McreatiK Studios" className="h-16 sm:h-20 w-auto object-contain" />
            <h2 className="font-display italic font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1C1710]">
              Studios
            </h2>
            <p className="text-[#4A4438] leading-relaxed">
              Photography for the moments worth keeping — portraits, weddings, and events.
            </p>

            <div className="w-full max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-col items-center gap-2.5 pt-5">
                {STUDIOS_SERVICES.map(({ title }) => (
                  <span
                    key={title}
                    className="text-sm sm:text-base font-medium text-[#1C1710] bg-[#1C1710]/[0.06] border border-[#1C1710]/20 rounded-full px-5 py-2.5"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enter — always available, pinned to the bottom */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-white/60 backdrop-blur-md border-t border-black/10">
            <Link
              to="/studios"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-[#1C1710] hover:bg-black/5 transition-colors"
            >
              Enter <FiArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  )
})

export default Landing
