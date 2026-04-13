/* ============================================
   Navbar Component
   Fixed top navigation bar with:
     - Logo on the left
     - Navigation links centered (desktop)
     - CTA button on the right
     - Mobile hamburger menu with slide-in drawer
   Background becomes opaque on scroll.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV_LINKS } from '../../utils/constants'
import Button from '../ui/Button'

const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  /* Track scroll position to toggle navbar background */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ---------- Logo ---------- */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg font-display shadow-lg shadow-indigo-500/25">
              MK
            </div>                       
            <span className="text-xl font-bold font-display text-white">
              Mcreati
              <span className="text-indigo-400 group-hover:text-cyan-400 transition-colors">
                K
              </span>
            </span>
          </a>

          {/* ---------- Desktop Links ---------- */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-sky-400 rounded-lg hover:bg-[rgba(56,189,248,0.15)] transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* ---------- Desktop CTA ---------- */}
          <div className="hidden md:block">
            <Button href="#contact" className="text-sm px-5 py-2.5">
              Get Started
            </Button>
          </div>

          {/* ---------- Mobile Toggle ---------- */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

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
            {/* Drawer panel */}
            <motion.div
              className="fixed top-20 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMobile}
                    className="block px-4 py-3 text-gray-300 hover:text-sky-400 hover:bg-sky-400/15 rounded-xl transition-colors text-base font-medium"
                  >
                    {label}
                  </a>
                ))}
                <div className="pt-4">
                  <Button href="#contact" onClick={closeMobile} className="w-full text-center">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
})

export default Navbar
