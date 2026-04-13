/* ============================================
   Button Component
   Reusable CTA button with two variants:
     - "primary" : solid gradient background
     - "outline" : transparent with border
   Supports click handlers, custom classes,
   and an optional href for anchor behavior.
   ============================================ */

import React, { memo } from 'react'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
  outline:
    'border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400',
}

const Button = memo(function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const classes = `${base} ${VARIANTS[variant]} ${className}`

  /* Render as <a> when href is provided, otherwise <button> */
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
})

export default Button
