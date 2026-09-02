/* ============================================
   Landing — Department Picker
   Split-screen gateway. Each panel carries a
   soft gradient and a badge watermark (sized in
   % of the panel so the full circle stays inside
   the frame on any device) even at rest,
   intensifying on hover. Below lg the service
   icon grid is always shown in normal flow (hover
   isn't reliable on touch); at lg+ it becomes a
   hover-only overlay that slides up below the
   description without disturbing it. The panel
   itself is inert — only the CTA link navigates.
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

  // Grid columns track the service count, capped at 5 per row — anything beyond that wraps onto its own line
  const techCols = Math.min(TECH_SERVICES.length, 5)
  const studiosCols = Math.min(STUDIOS_SERVICES.length, 5)

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
          {/* Hero photo — blurred so the baked-in on-screen text never fights the real headline overlaid on top */}
          <img
            src={techHeroPhoto}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-[1.16] transition-transform duration-700 ease-out blur-[6px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/35 via-transparent to-[#FF6B35]/30 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(91,95,239,0.55),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b10]/85 via-transparent to-[#0a0b10]/25" />

          {/* Centered mark — fixed in place, never shifts when services reveal on hover */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 max-w-lg">
            <img src={techLogo} alt="McreatiK Tech & Creative" className="h-28 sm:h-36 lg:h-72 w-auto object-contain" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Tech &amp; Creative Solutions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Websites, brand identity, and digital design for businesses that want to look as good as they perform.
            </p>

            {/* Service list — always visible on touch/smaller screens (hover can't be relied on there); on lg+ it becomes a hover-only overlay anchored right below the description */}
            <div className="static mt-6 pointer-events-none lg:absolute lg:top-full lg:inset-x-0 lg:mt-0 lg:pt-6">
              <div className="opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-6 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out">
                <div
                  className="grid justify-items-center gap-x-4 gap-y-4"
                  style={{ gridTemplateColumns: `repeat(${techCols}, minmax(0, 1fr))` }}
                >
                  {TECH_SERVICES.map(({ icon: Icon, title }, i) => (
                    <div
                      key={title}
                      style={{ transitionDelay: `${i * 60}ms` }}
                      className="opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-400 ease-out flex flex-col items-center gap-2.5"
                    >
                      <span className="flex items-center justify-center w-16 h-16 rounded-xl border border-[#A5A8FF]/40 text-[#A5A8FF]">
                        <Icon className="w-7 h-7" />
                      </span>
                      <span className="text-xs font-medium text-white leading-tight text-center">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA — always available, pinned to the bottom, tinted with the department's indigo */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-[#5B5FEF]/20 backdrop-blur-md border-t border-[#5B5FEF]/40">
            <Link
              to="/tech"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-white hover:bg-[#5B5FEF]/25 transition-colors"
            >
              Discover <FiArrowUpRight className="w-4 h-4 text-[#FF6B35]" />
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
          {/* Hero photo — vivid, warm-dark scrim keeps text legible without hiding it; positioned so the camera and lenses stay fully in frame */}
          <img
            src={studiosHeroPhoto}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ objectPosition: '90% center' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[#1C1710]/20" />
          {/* Gradient wash — present at rest, intensifies on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9971F]/30 via-transparent to-[#8B2E2A]/35 scale-100 group-hover:scale-110 transition-transform duration-500 ease-out" />
          <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_50%,rgba(201,151,31,0.45),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1710]/85 via-transparent to-[#1C1710]/30" />

          {/* Centered mark — fixed in place, never shifts when services reveal on hover */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-8 max-w-lg">
            <img src={studiosLogoDark} alt="McreatiK Studios" className="h-28 sm:h-36 lg:h-72 w-auto object-contain" />
            <h2 className="font-display italic font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
              Studios
            </h2>
            <p className="text-[#D8D0C2] leading-relaxed">
              Photography for the moments worth keeping — portraits, weddings, and events.
            </p>

            {/* Service list — always visible on touch/smaller screens (hover can't be relied on there); on lg+ it becomes a hover-only overlay anchored right below the description */}
            <div className="static mt-6 pointer-events-none lg:absolute lg:top-full lg:inset-x-0 lg:mt-0 lg:pt-6">
              <div className="opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-6 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out">
                <div
                  className="grid justify-items-center gap-x-4 gap-y-4"
                  style={{ gridTemplateColumns: `repeat(${studiosCols}, minmax(0, 1fr))` }}
                >
                  {STUDIOS_SERVICES.map(({ icon: Icon, title }, i) => (
                    <div
                      key={title}
                      style={{ transitionDelay: `${i * 60}ms` }}
                      className="opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-400 ease-out flex flex-col items-center gap-2.5"
                    >
                      <span className="flex items-center justify-center w-16 h-16 rounded-xl border border-[#C9971F]/50 text-[#C9971F]">
                        <Icon className="w-7 h-7" />
                      </span>
                      <span className="text-xs font-medium text-white leading-tight text-center">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA — always available, pinned to the bottom, tinted with the department's gold */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-[#C9971F]/20 backdrop-blur-md border-t border-[#C9971F]/40">
            <Link
              to="/studios"
              className="flex items-center justify-center gap-1.5 py-4 text-sm font-semibold text-white hover:bg-[#C9971F]/25 transition-colors"
            >
              Explore <FiArrowUpRight className="w-4 h-4 text-[#C9971F]" />
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  )
})

export default Landing
