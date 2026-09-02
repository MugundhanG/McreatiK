/* ============================================
   Button Component
   Reusable CTA button with two variants
   ("primary" / "outline") across two department
   themes ("tech" / "studios"). Supports click
   handlers, custom classes, and an optional href.
   ============================================ */

import React, { memo } from 'react'

const THEMES = {
  tech: {
    primary:
      'bg-[#5B5FEF] text-white border border-white/10 hover:bg-[#6d70f2] hover:border-[#FF6B35]/40',
    outline:
      'border border-[#5B5FEF]/50 text-[#a5a8ff] hover:bg-[#5B5FEF]/10 hover:border-[#5B5FEF]',
  },
  studios: {
    primary:
      'bg-[#C9971F] text-white border border-black/5 hover:bg-[#b3860f]',
    outline:
      'border border-[#C9971F]/60 text-[#1C1710] hover:bg-[#C9971F]/10 hover:border-[#C9971F]',
  },
}

const Button = memo(function Button({
  children,
  variant = 'primary',
  theme = 'tech',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const classes = `${base} ${THEMES[theme][variant]} ${className}`

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
