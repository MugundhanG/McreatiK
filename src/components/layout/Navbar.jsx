/* ============================================
   Navbar Component
   Floating pill-style navbar centered on screen.
   Glassmorphism background with rounded border.
   Logo left | Links center | CTA right.
   Mobile: full-width slide-down drawer.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV_LINKS } from '../../utils/constants'
import Button from '../ui/Button'

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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">

      {/* ---------- Floating Pill Navbar ---------- */}
      <motion.nav
        className={`w-full max-w-5xl rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-950/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20'
            : 'bg-gray-950/50 backdrop-blur-md border border-white/5'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between h-14 px-4 sm:px-5">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm font-display shadow-lg shadow-indigo-500/25">
              MK
            </div>
            <span className="text-base font-bold font-display text-white">
              <span className="text-indigo-400 group-hover:text-cyan-400 transition-colors">M</span>
              creati
              <span className="text-indigo-400 group-hover:text-cyan-400 transition-colors">K</span>
            </span>
          </a>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-300 hover:text-sky-400 rounded-lg hover:bg-[rgba(56,189,248,0.15)] transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block shrink-0">
            <Button href="#contact" className="text-xs px-4 py-2">
              Get Started
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          </button>
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
            {/* Drawer — drops below the pill */}
            <motion.div
              className="fixed top-20 left-4 right-4 bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-5 space-y-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMobile}
                    className="block px-4 py-2.5 text-gray-300 hover:text-sky-400 hover:bg-[rgba(56,189,248,0.15)] rounded-xl transition-colors text-sm font-medium"
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
  )
})

export default Navbar
