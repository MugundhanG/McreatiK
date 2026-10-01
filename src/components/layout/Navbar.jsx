/* ============================================
   Navbar Component — Tech & Creative (light theme)
   Full-width bar, flush to the top edge, hairline
   bottom border — matches the home navbar's frame
   language while running Tech's own blue accent.
   ============================================ */

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { TECH_NAV_GROUPS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import mcreatiKLogo from '../../assets/tech-logo-light-bg.webp'
import NavDropdown from './NavDropdown'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I'm interested in getting a website for my business.")

// A group is "active" when the current page is one of its (non-anchor) items.
function isGroupActive(group, pathname) {
  return (group.items ?? []).some(({ href, type }) => type === 'page' && href === pathname)
}

const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null) // desktop dropdown label
  const [expandedGroup, setExpandedGroup] = useState(null) // mobile accordion label
  const { pathname, hash } = useLocation()

  // Any navigation closes whatever dropdown is open (adjusted during render,
  // React's recommended pattern for resetting state when a value changes).
  const locationKey = `${pathname}${hash}`
  const [lastLocationKey, setLastLocationKey] = useState(locationKey)
  if (locationKey !== lastLocationKey) {
    setLastLocationKey(locationKey)
    setOpenGroup(null)
  }

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
  const closeGroup = useCallback(() => setOpenGroup(null), [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl border-stone-200' : 'bg-white/70 backdrop-blur-md border-stone-200/60'
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* One row at every width: grouping the links into dropdowns keeps
            everything on a single line even on compact laptops. */}
        <div className="flex items-center justify-between h-16">

          {/* Logo + department tag + desktop nav links, clustered left */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link to="/" className="shrink-0 flex items-center">
              <img src={mcreatiKLogo} alt="McreatiK Tech & Creative" className="h-11 w-auto object-contain" />
            </Link>

            <nav aria-label="Main" className="hidden lg:flex items-center gap-5 xl:gap-6">
              {TECH_NAV_GROUPS.map((group) =>
                group.items ? (
                  <NavDropdown
                    key={group.label}
                    group={group}
                    isOpen={openGroup === group.label}
                    isActive={isGroupActive(group, pathname)}
                    onOpen={() => setOpenGroup(group.label)}
                    onClose={closeGroup}
                  />
                ) : (
                  <Link
                    key={group.label}
                    to={group.href}
                    className={`group relative py-1.5 text-sm font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap ${
                      pathname === group.href && !hash ? 'text-[#1E4FD9]' : 'text-stone-700 hover:text-[#1E4FD9]'
                    }`}
                  >
                    {group.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#1E4FD9] transition-all duration-200 group-hover:w-full" />
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Desktop: switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            <DepartmentSwitcher excludeKeys={['store']} className="text-stone-600 bg-stone-50/80" />
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
                {TECH_NAV_GROUPS.map((group) => {
                  if (!group.items) {
                    return (
                      <Link
                        key={group.label}
                        to={group.href}
                        onClick={closeMobile}
                        className="block px-4 py-2.5 text-stone-700 hover:text-[#1E4FD9] hover:bg-stone-100 rounded-md transition-colors text-sm font-semibold tracking-wide"
                      >
                        {group.label}
                      </Link>
                    )
                  }
                  const expanded = expandedGroup === group.label
                  return (
                    <div key={group.label}>
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(expanded ? null : group.label)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-stone-700 hover:text-[#1E4FD9] hover:bg-stone-100 rounded-md transition-colors text-sm font-semibold tracking-wide cursor-pointer"
                      >
                        {group.label}
                        <FiChevronDown
                          aria-hidden="true"
                          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden pl-3"
                          >
                            {group.items.map(({ label, href, icon: Icon }) => (
                              <li key={label}>
                                <Link
                                  to={href}
                                  onClick={closeMobile}
                                  className="flex items-center gap-3 px-4 py-2 text-stone-600 hover:text-[#1E4FD9] hover:bg-stone-100 rounded-md transition-colors text-sm font-medium"
                                >
                                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1E4FD9]/10 text-[#1E4FD9]">
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                  </span>
                                  {label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
                <div className="pt-3 flex items-center justify-between gap-4">
                  <DepartmentSwitcher excludeKeys={['store']} className="text-stone-600 bg-stone-50/80" />
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
