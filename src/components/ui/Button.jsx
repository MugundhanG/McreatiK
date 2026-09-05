/* ============================================
   Button Component
   Reusable CTA button with two variants
   ("primary" / "outline") across three themes
   ("tech" / "studios" / "home"). Supports click
   handlers, custom classes, and an optional href.
   ============================================ */

import React, { memo } from 'react'

const THEMES = {
  tech: {
    primary:
      'bg-[#1E4FD9] text-white border border-transparent shadow-sm shadow-[#1E4FD9]/25 hover:bg-[#1840b8]',
    outline:
      'border border-[#14161C]/15 text-[#14161C] hover:border-[#1E4FD9] hover:text-[#1E4FD9]',
  },
  studios: {
    primary:
      'bg-[#C9971F] text-white border border-black/5 hover:bg-[#b3860f]',
    outline:
      'border border-[#C9971F]/60 text-[#1C1710] hover:bg-[#C9971F]/10 hover:border-[#C9971F]',
  },
  home: {
    primary:
      'bg-[#D8AE55] text-[#0A1128] border border-black/5 hover:bg-[#F0CB7E]',
    outline:
      'border border-[#D8AE55]/50 text-[#D8AE55] hover:bg-[#D8AE55]/10 hover:border-[#D8AE55]',
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
