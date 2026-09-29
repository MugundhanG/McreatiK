/* ============================================
   NavDropdown — Tech navbar group menu
   A top-level nav item that opens a rich panel
   (icon, name, one-line description per link).
   Opens on hover (with a short close delay so a
   diagonal move into the panel doesn't close it)
   and on click/Enter for touch and keyboard.
   Escape closes and returns focus to the trigger;
   tabbing out of the group closes it too.
   ============================================ */

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

const CLOSE_DELAY_MS = 150

export default function NavDropdown({ group, isOpen, isActive, onOpen, onClose }) {
  const triggerRef = useRef(null)
  const wrapperRef = useRef(null)
  const closeTimer = useRef(null)
  const panelId = `nav-panel-${group.label.toLowerCase().replace(/\s+/g, '-')}`

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY_MS)
  }

  useEffect(() => cancelClose, [])

  useEffect(() => {
    if (!isOpen) return undefined
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
      }
    }
    function onPointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isOpen, onClose])

  function handleBlur(e) {
    // Focus moved somewhere outside this group (e.g. tabbed past the last link).
    if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget)) onClose()
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        onOpen()
      }}
      onMouseLeave={scheduleClose}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={`group relative flex items-center gap-1 py-1.5 text-sm font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer ${
          isOpen || isActive ? 'text-[#1E4FD9]' : 'text-stone-700 hover:text-[#1E4FD9]'
        }`}
      >
        {group.label}
        <FiChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <span
          className={`absolute left-0 -bottom-0.5 h-px bg-[#1E4FD9] transition-all duration-200 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            // pt-3 is an invisible hover bridge between the trigger and the card.
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          >
            <div className="relative w-80 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-stone-900/10">
              <span
                aria-hidden="true"
                className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-stone-200 bg-white"
              />
              <ul className="relative">
                {group.items.map(({ label, href, description, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={onClose}
                      className="group/item flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#1E4FD9]/[0.05] focus-visible:bg-[#1E4FD9]/[0.05] focus-visible:outline-none"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E4FD9]/10 text-[#1E4FD9] transition-colors group-hover/item:bg-[#1E4FD9] group-hover/item:text-white group-focus-visible/item:bg-[#1E4FD9] group-focus-visible/item:text-white">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-stone-800 transition-colors group-hover/item:text-[#1E4FD9]">
                          {label}
                        </span>
                        <span className="block text-xs leading-snug text-stone-500">{description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
