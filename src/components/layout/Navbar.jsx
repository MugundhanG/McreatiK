/* ============================================
   Navbar Component
   Floating pill-style navbar centered on screen.
   Logo fixed separately in top-left corner.
   Mobile: full-width slide-down drawer.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV_LINKS } from '../../utils/constants'
import Button from '../ui/Button'
import mcreatiKLogo from '../../assets/mcreatik_logo_new.png'

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
      {/* ---------- Fixed Logo — Top Left ---------- */}
      <motion.a
        href="#home"
        className="fixed top-3 left-4 z-50"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <img
          src={mcreatiKLogo}
          alt="McreatiK Logo"
          className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_12px_rgba(45,212,191,0.7)]"
        />
      </motion.a>

      {/* ---------- Floating Pill Navbar — Centered ---------- */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4 md:pl-32 lg:pl-4">
        <motion.nav
          className={`w-full max-w-2xl rounded-2xl transition-all duration-300 ${
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

            {/* Mobile: toggle only */}
            <div className="md:hidden flex items-center justify-end w-full">
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
    </>
  )
})

export default Navbar
