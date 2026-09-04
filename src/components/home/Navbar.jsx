/* ============================================
   Navbar Component — McreatiK (home)
   Floating pill navbar for the umbrella-brand
   homepage, using the master McreatiK logo (the
   dark-background watermark variant). Nav items
   mix in-page anchors, routes to the two live
   departments, and a disabled "Store" entry for
   the not-yet-built third department.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { HOME_NAV_LINKS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'
import mcreatiKLogo from '../../assets/mcreatik-logo-dark-bg.png'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")

function NavLink({ label, href, type, className, onClick }) {
  if (type === 'disabled') {
    return (
      <span className={`${className} text-gray-600 cursor-not-allowed`}>
        <span className="inline-flex items-center gap-1.5">
          {label}
          <span className="text-[10px] font-mono-label uppercase text-gray-600 border border-white/10 rounded-full px-1.5 py-0.5">Soon</span>
        </span>
      </span>
    )
  }
  if (type === 'route') {
    return (
      <Link to={href} onClick={onClick} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} onClick={onClick} className={className}>
      {label}
    </a>
  )
}

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
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4">
      <motion.nav
        className={`w-full max-w-4xl rounded-lg transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-950/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20'
            : 'bg-gray-950/50 backdrop-blur-md border border-white/5'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img src={mcreatiKLogo} alt="McreatiK" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {HOME_NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                {...link}
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-[#D8AE55] rounded-lg hover:bg-[#D8AE55]/10 transition-all duration-200"
              />
            ))}
          </div>

          {/* Desktop: CTA */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Button href={WHATSAPP_HREF} theme="home" className="text-xs px-4 py-2">
              Start a Project
            </Button>
          </div>

          {/* Mobile/tablet: toggle */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              className="fixed top-20 left-4 right-4 bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-5 space-y-1">
                {HOME_NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.label}
                    {...link}
                    onClick={closeMobile}
                    className="block px-4 py-2.5 text-gray-300 hover:text-[#D8AE55] hover:bg-[#D8AE55]/10 rounded-md transition-colors text-sm font-medium"
                  />
                ))}
                <div className="pt-3">
                  <Button href={WHATSAPP_HREF} theme="home" onClick={closeMobile} className="w-full text-center">
                    Start a Project
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
