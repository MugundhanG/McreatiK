/* ============================================
   Instant Memories teaser
   A short band on /studios pointing to the
   Instant Memories product page.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiSmartphone } from 'react-icons/fi'
import { RevealBlock } from '../../motion'

const InstantMemoriesTeaser = memo(function InstantMemoriesTeaser() {
  return (
    <section aria-labelledby="im-teaser-title" className="bg-[#1C1710] text-white">
      <RevealBlock className="max-w-6xl mx-auto px-5 sm:px-8 py-14 lg:py-16 grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9971F]/15 text-[#E3C46F]">
          <FiSmartphone className="w-6 h-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono-label text-xs uppercase text-[#E3C46F] mb-2">New · Instant Memories</p>
          <h2 id="im-teaser-title" className="font-display italic text-2xl sm:text-3xl">Your wedding photos on every guest&apos;s phone — live</h2>
          <p className="mt-2 font-body text-sm text-white/70 max-w-2xl">
            Guests scan a QR code and watch photos arrive seconds after they&apos;re taken. No app, no sign-up.
          </p>
        </div>
        <Link to="/studios/instant-memories"
          className="inline-flex items-center gap-2 justify-self-start rounded-full bg-[#C9971F] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b3860f]">
          See how it works <FiArrowRight className="w-4 h-4" />
        </Link>
      </RevealBlock>
    </section>
  )
})

export default InstantMemoriesTeaser
