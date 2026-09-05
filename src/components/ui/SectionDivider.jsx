/* ============================================
   SectionDivider — Tech & Creative
   A hairline rule with a small sheet-index tag,
   marking the start of a major, nav-linked section
   (Services, Industries, Work, FAQ) so it reads as
   its own clearly-bounded chapter while scrolling,
   not a blend into whatever came before it.
   ============================================ */

import React, { memo } from 'react'

const SectionDivider = memo(function SectionDivider({ label }) {
  return (
    <div className="border-t border-stone-300 pt-5 mb-12">
      <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-stone-400">
        {label}
      </span>
    </div>
  )
})

export default SectionDivider
