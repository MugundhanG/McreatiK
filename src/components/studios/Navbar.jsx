/* ============================================
   Navbar Component — Studios
   A slim Tech & Creative cross-promo bar sits
   above everything, always visible regardless of
   breakpoint. Below it, a full-width static bar
   (not a floating pill — deliberately unlike
   Tech's navbar), solidifies on scroll. Light
   ground, dark ink.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiArrowUpRight, FiCode } from 'react-icons/fi'
import { STUDIOS_NAV_LINKS } from '../../utils/constants'
import studiosLogo from '../../assets/studios-logo-light-bg.png'

const StudiosNavbar = memo(function StudiosNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return (
    <>
      {/* ---------- Tech & Creative Announcement Bar — always visible, above the nav, on every screen size ---------- */}
      <Link
        to="/tech"
        className="fixed top-0 inset-x-0 z-50 h-9 flex items-center justify-center gap-1.5 sm:gap-2 px-4 bg-gradient-to-r from-[#5B5FEF] to-[#1B2A4A] text-white hover:brightness-110 transition-all"
      >
        <FiCode className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate text-[11px] sm:text-sm font-medium font-body">
          <span className="sm:hidden">We also build websites — McreatiK Tech</span>
          <span className="hidden sm:inline">McreatiK also builds websites &amp; brands — explore McreatiK Tech &amp; Creative</span>
        </span>
        <FiArrowUpRight className="w-3.5 h-3.5 shrink-0" />
      </Link>

      <motion.header
        className={`fixed top-9 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled ? 'bg-[#FAF7F0]/92 backdrop-blur-md border-b border-black/5' : 'bg-transparent'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={studiosLogo} alt="McreatiK Studios" className="h-11 w-auto object-contain" />
        </Link>

        {/* Desktop links — the Tech & Creative cross-promo now lives in the bar above, always visible */}
        <div className="hidden md:flex items-center gap-8">
          {STUDIOS_NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-body text-sm text-[#4A4438] hover:text-[#C9971F] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-[#1C1710] cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="md:hidden bg-[#FAF7F0] border-t border-black/5 px-5 py-5 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {STUDIOS_NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={closeMobile}
                className="block py-2.5 font-body text-[#4A4438] hover:text-[#C9971F] transition-colors text-sm"
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
    </>
  )
})

export default StudiosNavbar
