/* ============================================
   Landing — Department Picker
   Split-screen gateway. Each panel carries a
   soft gradient and a badge watermark (sized in
   % of the panel so the full circle stays inside
   the frame on any device) even at rest,
   intensifying on hover. Hovering slides the
   service list up from below the description as
   solid chips that stay legible over any
   background. The panel itself is inert — only
   the CTA link navigates.
   ============================================ */

import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { setFavicon } from '../utils/setFavicon'
import techLogo from '../assets/tech-logo-dark-bg.png'
import studiosLogoDark from '../assets/studios-logo-dark-bg.png'
import techHeroPhoto from '../assets/tech-hero-photo.webp'
import studiosHeroPhoto from '../assets/studios-hero-photo.webp'
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
          {/* Hero photo */}
          <img
            src={techHeroPhoto}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/15" />
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/35 via-transparent to-[#FF6B35]/30 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(91,95,239,0.55),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b10]/85 via-transparent to-[#0a0b10]/25" />

          {/* Centered mark + hover-revealed services, all centered as one block */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 pb-16 max-w-lg">
            <img src={techLogo} alt="McreatiK Tech & Creative" className="h-28 sm:h-36 lg:h-72 w-auto object-contain" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Tech &amp; Creative Solutions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Websites, brand identity, and digital design for businesses that want to look as good as they perform.
            </p>

            {/* Service list — slides up from below on hover, solid chips stay legible on any bg */}
            <div className="w-full max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-col items-center gap-2.5 pt-5">
                {TECH_SERVICES.map(({ title }, i) => (
                  <span
                    key={title}
                    style={{ transitionDelay: `${i * 60}ms` }}
                    className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out text-sm sm:text-base font-medium text-white bg-[#14121f] border border-white/25 rounded-full px-5 py-2.5 shadow-lg shadow-black/40"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA — always available, pinned to the bottom */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/50 backdrop-blur-md border-t border-white/10">
            <Link
              to="/tech"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              Discover <FiArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===== RIGHT — Studios ===== */}
      <motion.div
        className="flex-1 min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
      >
        <div className="theme-studios group relative flex h-full min-h-[50vh] items-center justify-center bg-[#1C1710] overflow-hidden cursor-default">
          {/* Hero photo — vivid, warm-dark scrim keeps text legible without hiding it */}
          <img
            src={studiosHeroPhoto}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#1C1710]/20" />
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9971F]/30 via-transparent to-[#8B2E2A]/35 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(201,151,31,0.45),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1710]/85 via-transparent to-[#1C1710]/30" />

          {/* Centered mark + hover-revealed services, all centered as one block */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 pb-16 max-w-lg">
            <img src={studiosLogoDark} alt="McreatiK Studios" className="h-28 sm:h-36 lg:h-72 w-auto object-contain" />
            <h2 className="font-display italic font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Studios
            </h2>
            <p className="text-[#D8D0C2] leading-relaxed">
              Photography for the moments worth keeping — portraits, weddings, and events.
            </p>

            {/* Service list — slides up from below on hover, solid chips stay legible on any bg */}
            <div className="w-full max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
              <div className="flex flex-col items-center gap-2.5 pt-5">
                {STUDIOS_SERVICES.map(({ title }, i) => (
                  <span
                    key={title}
                    style={{ transitionDelay: `${i * 60}ms` }}
                    className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out text-sm sm:text-base font-medium text-white bg-[#1C1710] border border-[#C9971F]/40 rounded-full px-5 py-2.5 shadow-lg shadow-black/40"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA — always available, pinned to the bottom */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/50 backdrop-blur-md border-t border-white/10">
            <Link
              to="/studios"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              Explore <FiArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  )
})

export default Landing
