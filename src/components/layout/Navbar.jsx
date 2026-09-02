/* ============================================
   Navbar Component — Tech & Creative
   Floating pill-style navbar centered on screen.
   Logo fixed separately in top-left corner and
   links back to the department picker.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { TECH_NAV_LINKS } from '../../utils/constants'
import Button from '../ui/Button'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import mcreatiKLogo from '../../assets/tech-logo-dark-bg.png'

const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
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
      {/* ---------- Fixed Logo — Top Left (tablet/desktop only; mobile shows a compact logo inside the pill instead, see below) ---------- */}
      <motion.div
        className="hidden md:block fixed top-3 left-4 z-50"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Link to="/">
          <img
            src={mcreatiKLogo}
            alt="McreatiK"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          />
        </Link>
      </motion.div>

      {/* ---------- Department Switcher — a separate floating badge, not part of the pill nav ---------- */}
      <motion.div
        className="fixed top-20 right-4 sm:right-6 z-30"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <DepartmentSwitcher className="text-gray-300 bg-gray-950/70 backdrop-blur-md shadow-lg shadow-black/20" />
      </motion.div>

      {/* ---------- Floating Pill Navbar — Centered ---------- */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4 md:pl-32 lg:pl-4">
        <motion.nav
          className={`w-full max-w-2xl rounded-lg transition-all duration-300 ${
            isScrolled
              ? 'bg-gray-950/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20'
              : 'bg-gray-950/50 backdrop-blur-md border border-white/5'
          }`}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {TECH_NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-300 hover:text-[#a5a8ff] rounded-lg hover:bg-[#5B5FEF]/15 transition-all duration-200"
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Desktop: CTA */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <Button href="#contact" className="text-xs px-4 py-2">
                Get Started
              </Button>
            </div>

            {/* Mobile: compact logo + toggle, in-line so nothing overlaps the floating logo (which is hidden below md) */}
            <div className="md:hidden flex items-center justify-between w-full">
              <Link to="/" className="flex items-center">
                <img src={mcreatiKLogo} alt="McreatiK" className="h-8 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </motion.nav>

        {/* ---------- Mobile Drawer ---------- */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
              />
              {/* Drawer */}
              <motion.div
                className="fixed top-20 left-4 right-4 bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl md:hidden"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-5 space-y-1">
                  {TECH_NAV_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={closeMobile}
                      className="block px-4 py-2.5 text-gray-300 hover:text-[#a5a8ff] hover:bg-[#5B5FEF]/15 rounded-md transition-colors text-sm font-medium"
                    >
                      {label}
                    </a>
                  ))}
                  <div className="pt-3">
                    <Button href="#contact" onClick={closeMobile} className="w-full text-center">
                      Get Started
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
})

export default Navbar
