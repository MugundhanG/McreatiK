/* ============================================
   Navbar Component — McreatiK (home)
   Full-width bar, flush to the top edge, with a
   hairline bottom border — logo and nav links
   clustered on the left, the CTA on the right.
   Tech and Studios open a hover dropdown listing
   that department's real sections, each linking
   straight to it — a real page (e.g. /tech/services) or an
   anchor on the main page (e.g. /tech#process) as needed.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { HOME_NAV_LINKS, TECH_NAV_LINKS, STUDIOS_NAV_LINKS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'
import mcreatiKLogo from '../../assets/mcreatik-logo-dark-bg.png'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")

/* Department nav items get a hover dropdown of their real sections;
   keyed by label so it's easy to look up while mapping HOME_NAV_LINKS. */
const DEPT_MENUS = {
  Tech: { basePath: '/tech', sections: TECH_NAV_LINKS, accent: '#5B5FEF' },
  Studios: { basePath: '/studios', sections: STUDIOS_NAV_LINKS, accent: '#C9971F' },
}

function NavLink({ label, href, type, className, onClick }) {
  if (type === 'disabled') {
    return (
      <span className={`${className} text-gray-400 cursor-not-allowed`}>
        <span className="inline-flex items-center gap-1.5">
          {label}
          <span className="text-[10px] font-mono-label uppercase text-gray-400 border border-white/10 rounded-full px-1.5 py-0.5">Soon</span>
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

/* Desktop-only hover dropdown for Tech / Studios — pure CSS hover via
   the `group` wrapper, so the panel stays open across the visual gap
   between the label and the menu (no JS/mouseleave handling needed).
   `focus-within` mirrors every `hover` state so keyboard users tabbing
   to the trigger (or into the panel itself) get the same reveal. */
function DeptNavItem({ label, href, className, menu }) {
  return (
    <div className="relative group">
      <Link to={href} className={`${className} inline-flex items-center gap-1`}>
        {label}
        <FiChevronDown aria-hidden="true" className="w-3 h-3 text-gray-500 group-hover:rotate-180 group-focus-within:rotate-180 transition-transform duration-200" />
      </Link>

      <div className="absolute left-0 top-full pt-2 opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-150 z-50">
        <div className="w-max max-w-[90vw] rounded-lg border border-white/10 bg-[#0A1128] shadow-xl shadow-black/40 px-5 py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5">
            {menu.sections.map((section, i) => (
              <React.Fragment key={section.label}>
                {i > 0 && <span className="text-white/15 text-xs px-1">/</span>}
                <Link
                  to={section.href.startsWith('/') ? section.href : `${menu.basePath}${section.href}`}
                  className="px-2 py-1 text-sm text-gray-300 whitespace-nowrap transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = menu.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {section.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
        isScrolled ? 'bg-[#0A1128]/95 backdrop-blur-xl border-white/10' : 'bg-[#0A1128]/80 backdrop-blur-md border-white/5'
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo + desktop nav links, clustered together on the left */}
        <div className="flex items-center gap-8">
          <Link to="/" className="shrink-0 flex items-center">
            <img src={mcreatiKLogo} alt="McreatiK" className="h-9 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {HOME_NAV_LINKS.map((link) => {
              const menu = DEPT_MENUS[link.label]
              const className = "px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-[#D8AE55] rounded-md hover:bg-white/5 transition-all duration-200"
              return menu ? (
                <DeptNavItem key={link.label} {...link} className={className} menu={menu} />
              ) : (
                <NavLink key={link.label} {...link} className={className} />
              )
            })}
          </div>
        </div>

        {/* Desktop: CTA */}
        <div className="hidden lg:flex items-center shrink-0">
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

      {/* ---------- Mobile Drawer ---------- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              className="absolute top-full left-0 right-0 bg-[#0A1128]/95 backdrop-blur-xl border-b border-white/10 shadow-xl lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 sm:px-6 py-5 space-y-1">
                {HOME_NAV_LINKS.map((link) => {
                  const menu = DEPT_MENUS[link.label]
                  return (
                    <div key={link.label}>
                      <NavLink
                        {...link}
                        onClick={closeMobile}
                        className="block px-4 py-2.5 text-gray-300 hover:text-[#D8AE55] hover:bg-[#D8AE55]/10 rounded-md transition-colors text-sm font-medium"
                      />
                      {menu && (
                        <div className="ml-4 pl-3 border-l border-white/10 space-y-1 mt-1 mb-2">
                          {menu.sections.map((section) => (
                            <Link
                              key={section.label}
                              to={`${menu.basePath}${section.href}`}
                              onClick={closeMobile}
                              className="block px-4 py-2 text-gray-400 hover:text-[#D8AE55] rounded-md transition-colors text-sm"
                            >
                              {section.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
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
    </motion.header>
  )
})

export default Navbar
