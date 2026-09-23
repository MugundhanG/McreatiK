/* ============================================
   DepartmentSwitcher
   Multi-segment pill showing which McreatiK
   department the current page belongs to, with
   the others as one-tap ways to flip over. Reads
   as navigation, not a promotion. Uses currentColor
   so it self-adapts to whichever page it's dropped
   into, without a theme prop. Data-driven off
   DEPARTMENTS so a future department only needs an
   entry there, not a new block here.
   ============================================ */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { triggerDepartmentTransition } from '../../utils/departmentTransition'
import { DEPARTMENTS } from '../../utils/departments'

/* Plain clicks switch departments through the wipe transition; a
   modifier click (open in new tab, middle-click, etc.) is left alone
   so the real href still works as expected. */
const switchDepartment = (department, isActive) => (e) => {
  if (isActive || e.defaultPrevented) return
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  triggerDepartmentTransition(department)
}

const DepartmentSwitcher = ({ compact = false, className = '', excludeKeys = [] }) => {
  const { pathname } = useLocation()

  const itemBase = `flex items-center justify-center gap-1.5 rounded-full transition-colors ${
    compact ? 'w-7 h-7' : 'px-3.5 py-1.5 text-sm font-medium'
  }`

  const visibleDepartments = excludeKeys.length
    ? DEPARTMENTS.filter((department) => !excludeKeys.includes(department.key))
    : DEPARTMENTS

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border border-current/10 p-0.5 ${className}`}>
      {visibleDepartments.map(({ key, label, fullName, path, icon: Icon, accent }) => {
        const isActive = pathname.startsWith(path)
        return (
          <Link
            key={key}
            to={path}
            title={fullName}
            aria-current={isActive ? 'page' : undefined}
            onClick={switchDepartment(key, isActive)}
            className={`${itemBase} ${isActive ? 'text-white' : 'text-current/50'}`}
            style={isActive ? { backgroundColor: accent } : undefined}
            onMouseEnter={!isActive ? (e) => (e.currentTarget.style.color = accent) : undefined}
            onMouseLeave={!isActive ? (e) => (e.currentTarget.style.color = '') : undefined}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {!compact && <span>{label}</span>}
          </Link>
        )
      })}
    </div>
  )
}

export default DepartmentSwitcher
