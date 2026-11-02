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
import { FiMenu, FiX, FiArrowRight, FiChevronDown } from 'react-icons/fi'
import { STUDIOS_NAV_GROUPS } from '../../utils/constants'
import NavDropdown from '../layout/NavDropdown'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import { BusinessCardNavButton } from './BusinessCardMenu'
import studiosLogoLight from '../../assets/studios-logo-light-bg.webp'
import studiosLogoDark from '../../assets/studios-logo-dark-bg.webp'

// A group is "active" when the current page is one of its (non-anchor) items.
function isGroupActive(group, pathname) {
  return (group.items ?? []).some(({ href, type }) => type === 'page' && href === pathname)
}

const StudiosNavbar = memo(function StudiosNavbar() {
  const { pathname } = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null) // desktop dropdown label
  const [expandedGroup, setExpandedGroup] = useState(null) // mobile accordion label

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

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
    setExpandedGroup(null)
  }, [])
  const closeGroup = useCallback(() => setOpenGroup(null), [])

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
        <DepartmentSwitcher excludeKeys={['store']} className="text-[#4A4438] bg-[#FAF7F0]/80 backdrop-blur-md shadow-lg shadow-black/10" />
      </motion.div>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isTransparent ? 'bg-transparent' : 'bg-[#FAF7F0]/92 backdrop-blur-md border-b border-black/5'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4 xl:gap-6">
        <Link to="/studios" className="flex shrink-0 items-center">
          <img
            src={isTransparent ? studiosLogoDark : studiosLogoLight}
            alt="McreatiK Studios"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-7">
          {STUDIOS_NAV_GROUPS.map((group) =>
            group.items ? (
              <NavDropdown
                key={group.label}
                group={group}
                variant="studios"
                transparent={isTransparent}
                isOpen={openGroup === group.label}
                isActive={isGroupActive(group, pathname)}
                onOpen={() => setOpenGroup(group.label)}
                onClose={closeGroup}
              />
            ) : (
            <Link
              key={group.label}
              to={group.href}
              className={`group relative py-1.5 font-body text-[13px] xl:text-sm whitespace-nowrap transition-colors ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-[#4A4438] hover:text-[#C9971F]'
              }`}
            >
              {group.label}
              <span
                className={`absolute left-0 -bottom-0.5 h-px transition-all duration-200 ${
                  pathname === group.href ? 'w-full' : 'w-0 group-hover:w-full'
                } ${isTransparent ? 'bg-white' : 'bg-[#C9971F]'}`}
              />
            </Link>
            )
          )}
          <div className="flex items-center gap-2 xl:gap-3">
            <BusinessCardNavButton transparent={isTransparent} />
            <Link
              to="/studios#book"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[#C9971F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b3860f]"
            >
              Book a Session <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
            {STUDIOS_NAV_GROUPS.map((group) => {
              if (!group.items) {
                return (
                  <Link
                    key={group.label}
                    to={group.href}
                    onClick={closeMobile}
                    className="block py-2.5 font-body text-[#4A4438] hover:text-[#C9971F] transition-colors text-sm"
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
                    className={`flex w-full items-center justify-between py-2.5 font-body text-sm transition-colors cursor-pointer ${
                      expanded ? 'text-[#C9971F]' : 'text-[#4A4438] hover:text-[#C9971F]'
                    }`}
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
                        className="overflow-hidden pl-2"
                      >
                        {group.items.map(({ label, href, icon: Icon }) => (
                          <li key={label}>
                            <Link
                              to={href}
                              onClick={closeMobile}
                              className="flex items-center gap-3 py-2 font-body text-sm text-[#6B6153] hover:text-[#C9971F] transition-colors"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9971F]/10 text-[#C9971F]">
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
            <div className="pt-3 pb-1 flex items-center justify-between gap-4">
              <DepartmentSwitcher excludeKeys={['store']} className="text-[#4A4438] border-black/10" />
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
