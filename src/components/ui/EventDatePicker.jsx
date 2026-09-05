/* ============================================
   EventDatePicker
   A trigger pill + floating calendar popover, built
   from a reference design (light card, year/month
   selects, prev/next nav, a Clear/Apply footer that
   keeps the pick as a draft until Apply is pressed).
   Supports a single-date mode and a two-date range
   mode — range mode is used only for Wedding
   Photography, since weddings + receptions often
   span more than one day; every other Studios
   service just needs one date.

   The popover is rendered through a portal into
   document.body: its trigger sits inside an
   accordion panel with `overflow-hidden` (for the
   height-collapse animation) nested inside a section
   that also has `overflow-hidden` (for a decorative
   glow), so an in-place absolutely-positioned popover
   gets clipped by either ancestor. Portaling escapes
   both. Position tracks the trigger continuously —
   recomputed (rAF-throttled) on scroll/resize rather
   than closing the popover, and flips to sit above the
   trigger instead of below when there isn't enough
   viewport room underneath. It only actually closes on
   Escape, on Apply, or a click/tap outside it.

   Navigation is capped at "no earlier than the
   current month" — the previous-month arrow disables
   itself there, and the month dropdown only lists
   months from today's month onward whenever the
   current year is selected — since every day before
   today is disabled anyway, letting someone navigate
   into an entirely-unselectable past month was just
   confusing.
   ============================================ */

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiCalendar, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi'
import { MONTHS, toISO, parseISO, formatDisplay, isPastDate } from '../../utils/eventDate'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const ACCENT = '#C9971F' // Studios' own accent (matches WhatIsMcreatik's department chip)
const POPOVER_WIDTH = 300
/* The popover's real height varies slightly by month (5 vs 6 week rows),
   but not enough to matter for an above/below placement decision. */
const ESTIMATED_POPOVER_HEIGHT = 420
const VIEWPORT_MARGIN = 16

const EventDatePicker = memo(function EventDatePicker({
  rangeMode = false,
  startDate = '',
  endDate = '',
  onApply,
  error,
  id = 'event-date',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const triggerRef = useRef(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const initial = parseISO(startDate) || { year: today.getFullYear(), month: today.getMonth() }
  const [viewYear, setViewYear] = useState(initial.year)
  const [viewMonth, setViewMonth] = useState(initial.month)
  const [pendingStart, setPendingStart] = useState(startDate)
  const [pendingEnd, setPendingEnd] = useState(endDate)

  const isAtEarliestMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  /* Recomputed on open, and again on every scroll/resize while open, so
     the popover tracks its trigger instead of drifting or having to
     close. Flips above the trigger when there isn't enough room below. */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const left = Math.min(Math.max(rect.left, VIEWPORT_MARGIN), window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN)
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const placeAbove = spaceBelow < ESTIMATED_POPOVER_HEIGHT && spaceAbove > spaceBelow
    const top = placeAbove
      ? Math.max(rect.top - ESTIMATED_POPOVER_HEIGHT - 8, VIEWPORT_MARGIN)
      : rect.bottom + 8
    setPosition({ top, left })
  }, [])

  const openPicker = () => {
    updatePosition()
    setPendingStart(startDate)
    setPendingEnd(endDate)
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen) return

    function handleOutside(e) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        !e.target.closest('[data-event-date-popover]')
      ) {
        setIsOpen(false)
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    let frame = null
    function handleReposition() {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        updatePosition()
        frame = null
      })
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [isOpen, updatePosition])

  const years = useMemo(() => {
    const y = today.getFullYear()
    return [y, y + 1, y + 2]
  }, [today])

  const monthOptions = useMemo(() => {
    const startAt = viewYear === today.getFullYear() ? today.getMonth() : 0
    return MONTHS.map((label, value) => ({ label, value })).filter((opt) => opt.value >= startAt)
  }, [viewYear, today])

  const weeks = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1)
    const startWeekday = firstOfMonth.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const cells = []
    for (let i = startWeekday - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        inMonth: false,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        month: viewMonth === 0 ? 11 : viewMonth - 1,
      })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, inMonth: true, year: viewYear, month: viewMonth })
    }
    let nextDay = 1
    while (cells.length % 7 !== 0) {
      cells.push({
        day: nextDay++,
        inMonth: false,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        month: viewMonth === 11 ? 0 : viewMonth + 1,
      })
    }

    const rows = []
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
    return rows
  }, [viewYear, viewMonth])

  const goToMonth = (delta) => {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    if (y < today.getFullYear() || (y === today.getFullYear() && m < today.getMonth())) return
    setViewMonth(m)
    setViewYear(y)
  }

  const handleYearChange = (y) => {
    setViewYear(y)
    if (y === today.getFullYear() && viewMonth < today.getMonth()) setViewMonth(today.getMonth())
  }

  const handleDayClick = (cell) => {
    if (isPastDate(cell.year, cell.month, cell.day, today)) return
    const iso = toISO(cell.year, cell.month, cell.day)

    if (!rangeMode) {
      setPendingStart(iso)
      setPendingEnd('')
      return
    }

    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(iso)
      setPendingEnd('')
    } else if (iso < pendingStart) {
      setPendingStart(iso)
    } else {
      setPendingEnd(iso)
    }
  }

  const isSelected = (cell) => {
    const iso = toISO(cell.year, cell.month, cell.day)
    return iso === pendingStart || iso === pendingEnd
  }

  const isInRange = (cell) => {
    if (!rangeMode || !pendingStart || !pendingEnd) return false
    const iso = toISO(cell.year, cell.month, cell.day)
    return iso > pendingStart && iso < pendingEnd
  }

  const handleApply = () => {
    onApply(pendingStart, rangeMode ? pendingEnd : '')
    setIsOpen(false)
  }

  const handleClear = () => {
    setPendingStart('')
    setPendingEnd('')
  }

  const label = rangeMode
    ? startDate && endDate
      ? `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`
      : 'Pick a date range'
    : startDate
      ? formatDisplay(startDate)
      : 'Pick your event date'

  const canApply = rangeMode ? Boolean(pendingStart && pendingEnd) : Boolean(pendingStart)

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        ref={triggerRef}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center gap-2.5 rounded-full bg-white/5 border px-4 py-3.5 text-sm text-left transition-all duration-200 ${
          error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
        } ${startDate ? 'text-white' : 'text-gray-500'}`}
      >
        <FiCalendar className="w-4 h-4 text-[#D8AE55] shrink-0" />
        {label}
      </button>

      {isOpen && position &&
        createPortal(
          <div
            role="dialog"
            aria-label={rangeMode ? 'Pick a date range' : 'Pick your event date'}
            data-event-date-popover
            className="fixed z-50 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl shadow-black/20"
            style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <select
                  value={viewYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full appearance-none rounded-full border border-stone-200 bg-white px-3.5 py-2 pr-7 text-sm text-stone-700 cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              </div>
              <div className="relative flex-1">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="w-full appearance-none rounded-full border border-stone-200 bg-white px-3.5 py-2 pr-7 text-sm text-stone-700 cursor-pointer"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                disabled={isAtEarliestMonth}
                className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-stone-400"
                aria-label="Previous month"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <p className="text-sm font-semibold text-stone-900">
                {MONTHS[viewMonth]} {viewYear}
              </p>
              <button type="button" onClick={() => goToMonth(1)} className="p-1 text-stone-400 hover:text-stone-700" aria-label="Next month">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((w) => (
                <span key={w} className="text-center text-[11px] font-medium text-stone-400 py-1">
                  {w}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-0.5">
              {weeks.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7">
                  {row.map((cell, ci) => {
                    const disabled = !cell.inMonth || isPastDate(cell.year, cell.month, cell.day, today)
                    const isToday =
                      cell.inMonth &&
                      cell.year === today.getFullYear() &&
                      cell.month === today.getMonth() &&
                      cell.day === today.getDate()
                    const selected = cell.inMonth && isSelected(cell)
                    const inRange = cell.inMonth && isInRange(cell)

                    return (
                      <button
                        key={ci}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleDayClick(cell)}
                        className={`relative h-9 text-sm rounded-full transition-colors ${
                          !cell.inMonth
                            ? 'text-stone-300 cursor-default'
                            : disabled
                            ? 'text-stone-300 cursor-not-allowed'
                            : selected
                            ? 'text-white font-semibold'
                            : inRange
                            ? 'text-stone-900'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                        style={{
                          backgroundColor: selected ? ACCENT : inRange ? `${ACCENT}1f` : undefined,
                        }}
                      >
                        {cell.day}
                        {isToday && !selected && (
                          <span
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ backgroundColor: ACCENT }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <button type="button" onClick={handleClear} className="text-sm text-stone-500 hover:text-stone-800">
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!canApply}
                className="rounded-full bg-stone-700 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
})

export default EventDatePicker
