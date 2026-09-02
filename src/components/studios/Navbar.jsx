/* ============================================
   Navbar Component — Studios
   Full-width static bar (not a floating pill —
   deliberately unlike Tech's navbar), solidifies
   on scroll. Light ground, dark ink.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { STUDIOS_NAV_LINKS } from '../../utils/constants'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
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

        {/* Desktop links + department switcher */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8">
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
          <DepartmentSwitcher compact className="text-[#4A4438]" />
        </div>

        {/* Mobile: switcher + toggle */}
        <div className="md:hidden flex items-center gap-2">
          <DepartmentSwitcher compact className="text-[#4A4438]" />
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center text-[#1C1710] cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
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
  )
})

export default StudiosNavbar
