/* ============================================
   DepartmentSwitcher
   Two-segment pill showing which McreatiK
   department the current page belongs to, with
   the other one as a one-tap way to flip over.
   Reads as navigation, not a promotion. Uses
   currentColor so it self-adapts to whichever
   page (dark Tech / light Studios) it's dropped
   into, without a theme prop.
   ============================================ */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiCode, FiCamera } from 'react-icons/fi'

const DepartmentSwitcher = ({ compact = false, className = '' }) => {
  const { pathname } = useLocation()
  const isTech = pathname.startsWith('/tech')

  const itemBase = `flex items-center justify-center gap-1.5 rounded-full transition-colors ${
    compact ? 'w-7 h-7' : 'px-3.5 py-1.5 text-sm font-medium'
  }`

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border border-current/10 p-0.5 ${className}`}>
      <Link
        to="/tech"
        title="McreatiK Tech & Creative"
        aria-current={isTech ? 'page' : undefined}
        className={`${itemBase} ${isTech ? 'bg-[#1E4FD9] text-white' : 'text-current/50 hover:text-[#1E4FD9]'}`}
      >
        <FiCode className="w-3.5 h-3.5 shrink-0" />
        {!compact && <span>Tech</span>}
      </Link>
      <Link
        to="/studios"
        title="McreatiK Studios"
        aria-current={!isTech ? 'page' : undefined}
        className={`${itemBase} ${!isTech ? 'bg-[#C9971F] text-white' : 'text-current/50 hover:text-[#C9971F]'}`}
      >
        <FiCamera className="w-3.5 h-3.5 shrink-0" />
        {!compact && <span>Studios</span>}
      </Link>
    </div>
  )
}

export default DepartmentSwitcher
