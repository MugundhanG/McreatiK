/* ============================================
   MultiSelect
   Checkbox-list dropdown standing in for a native
   <select multiple>, which renders unusably on
   most browsers/devices. Selected values are kept
   as a single comma-joined string so it drops into
   the existing useForm/validateField plumbing (both
   expect a plain string value) without any changes
   there — onChange/onBlur fire the same {target:
   {name, value}} shape a native input would.
   ============================================ */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

const MultiSelect = ({ id, name, options, value, onChange, onBlur, placeholder, className = '' }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const wasOpen = useRef(false)

  const selected = value ? value.split(', ').filter(Boolean) : []

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* Fire the same blur validation a native select would, once the dropdown closes */
  useEffect(() => {
    if (wasOpen.current && !open) {
      onBlur?.({ target: { name, value } })
    }
    wasOpen.current = open
  }, [open, onBlur, name, value])

  const toggleOption = useCallback(
    (opt) => {
      const current = value ? value.split(', ').filter(Boolean) : []
      const next = current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt]
      onChange({ target: { name, value: next.join(', ') } })
    },
    [value, onChange, name]
  )

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
      ? selected.join(', ')
      : `${selected.length} services selected`

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${className} cursor-pointer flex items-center justify-between gap-2 text-left`}
      >
        <span className={`truncate ${selected.length ? 'text-stone-900' : 'text-stone-400'}`}>{summary}</span>
        <FiChevronDown className={`w-4 h-4 shrink-0 text-stone-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-stone-200 rounded-md shadow-lg shadow-stone-900/10 py-1.5"
        >
          {options.map((opt) => {
            const isChecked = selected.includes(opt)
            return (
              <label
                key={opt}
                role="option"
                aria-selected={isChecked}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggleOption(opt)}
                />
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'bg-[#1E4FD9] border-[#1E4FD9]' : 'border-stone-300'
                  }`}
                >
                  {isChecked && <FiCheck className="w-3 h-3 text-white" />}
                </span>
                {opt}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MultiSelect
