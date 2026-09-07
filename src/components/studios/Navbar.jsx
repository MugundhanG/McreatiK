/* ============================================
   Navbar Component — Studios
   Transparent over the full-bleed hero photo on
   the home page (so the photo shows straight
   through behind it) until the user scrolls past
   it, or lands on any other Studios page — both
   switch it to a solid, paper-toned bar.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi'
import { STUDIOS_NAV_LINKS } from '../../utils/constants'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import studiosLogoLight from '../../assets/studios-logo-light-bg.png'
import studiosLogoDark from '../../assets/studios-logo-dark-bg.png'

const StudiosNavbar = memo(function StudiosNavbar() {
  const { pathname } = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isHome = pathname === '/studios'
  const isTransparent = isHome && !isScrolled

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return (
    <>
      {/* ---------- Department Switcher — a separate floating badge on
          desktop; on mobile it moves into the menu bar instead (below),
          so it doesn't float disconnected over the page content. ---------- */}
      <motion.div
        className="fixed top-24 right-4 sm:right-6 z-40 hidden lg:block"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <DepartmentSwitcher className="text-[#4A4438] bg-[#FAF7F0]/80 backdrop-blur-md shadow-lg shadow-black/10" />
      </motion.div>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isTransparent ? 'bg-transparent' : 'bg-[#FAF7F0]/92 backdrop-blur-md border-b border-black/5'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/studios" className="flex items-center">
          <img
            src={isTransparent ? studiosLogoDark : studiosLogoLight}
            alt="McreatiK Studios"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {STUDIOS_NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className={`font-body text-sm transition-colors ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-[#4A4438] hover:text-[#C9971F]'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/studios#book"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#C9971F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b3860f]"
          >
            Book a Session <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className={`lg:hidden w-9 h-9 flex items-center justify-center cursor-pointer ${
            isTransparent ? 'text-white' : 'text-[#1C1710]'
          }`}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden bg-[#FAF7F0] border-t border-black/5 px-5 py-5 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {STUDIOS_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                onClick={closeMobile}
                className="block py-2.5 font-body text-[#4A4438] hover:text-[#C9971F] transition-colors text-sm"
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 pb-1 flex items-center justify-between gap-4">
              <DepartmentSwitcher className="text-[#4A4438] border-black/10" />
            </div>
            <Link
              to="/studios#book"
              onClick={closeMobile}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#C9971F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b3860f]"
            >
              Book a Session <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
    </>
  )
})

export default StudiosNavbar
