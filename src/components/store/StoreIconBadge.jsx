/* ============================================
   StoreIconBadge — Store
   Icon-in-a-tinted-container, the one recurring "object" this
   department's icon-forward direction has. Replaces every
   emoji stand-in (🔒👀⚡🔁🎉✓) across the trust section, benefits
   list, cart empty-state, and order-page states with a real
   react-icons/fi icon plus a hover micro-animation
   (.store-icon-badge, index.css) — small motion on an
   otherwise-static glyph, not just a like-for-like swap.
   ============================================ */

import React, { memo } from 'react'

const SIZE = {
  sm: { box: 'w-9 h-9', icon: 16 },
  md: { box: 'w-[52px] h-[52px]', icon: 22 },
  lg: { box: 'w-16 h-16', icon: 28 },
}

// Only 'accent' is driven by the CSS class's own tokens (.store-icon-badge
// in index.css) — the others override via Tailwind utilities, which sit in
// a later cascade layer than the component's own background/color, so they
// win without needing !important.
const TONE_OVERRIDE = {
  accent: '',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  neutral: 'bg-gray-100 text-gray-500',
}

const StoreIconBadge = memo(function StoreIconBadge({ icon: Icon, size = 'md', tone = 'accent', className = '' }) {
  const sizeConf = SIZE[size] ?? SIZE.md
  const toneClasses = TONE_OVERRIDE[tone] ?? ''

  return (
    <div className={`store-icon-badge inline-flex items-center justify-center shrink-0 ${sizeConf.box} ${toneClasses} ${className}`.trim()}>
      <Icon size={sizeConf.icon} />
    </div>
  )
})

export default StoreIconBadge
