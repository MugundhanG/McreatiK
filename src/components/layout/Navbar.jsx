/* ============================================
   Navbar Component — Tech & Creative (light theme)
   Full-width bar, flush to the top edge, hairline
   bottom border — matches the home navbar's frame
   language while running Tech's own blue accent.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { TECH_NAV_LINKS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import mcreatiKLogo from '../../assets/tech-logo-light-bg.png'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'm interested in getting a website for my business.")

const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl border-stone-200' : 'bg-white/70 backdrop-blur-md border-stone-200/60'
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo + department tag + desktop nav links, clustered left */}
        <div className="flex items-center gap-8">
          <Link to="/" className="shrink-0 flex items-center">
            <img src={mcreatiKLogo} alt="McreatiK Tech & Creative" className="h-11 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {TECH_NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="group relative py-1.5 text-sm font-semibold tracking-wide text-stone-700 hover:text-[#1E4FD9] transition-colors duration-200"
              >
                {label}
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#1E4FD9] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop: switcher + CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <DepartmentSwitcher className="text-stone-600 bg-stone-50/80" />
          <Button href={WHATSAPP_HREF} className="text-xs px-4 py-2">
            Get Started
          </Button>
        </div>

        {/* Mobile/tablet: toggle */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
        </button>

      </div>

      {/* ---------- Mobile Drawer ---------- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 top-16 bg-stone-900/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              className="absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg shadow-stone-900/5 lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 sm:px-6 py-5 space-y-1">
                {TECH_NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMobile}
                    className="block px-4 py-2.5 text-stone-700 hover:text-[#1E4FD9] hover:bg-stone-100 rounded-md transition-colors text-sm font-semibold tracking-wide"
                  >
                    {label}
                  </a>
                ))}
                <div className="pt-3 flex items-center justify-between gap-4">
                  <DepartmentSwitcher className="text-stone-600 bg-stone-50/80" />
                </div>
                <div className="pt-1">
                  <Button href={WHATSAPP_HREF} onClick={closeMobile} className="w-full text-center">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
})

export default Navbar
