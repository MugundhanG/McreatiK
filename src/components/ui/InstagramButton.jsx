/* ============================================
   InstagramButton
   Fixed floating button that opens McreatiK
   Studios' Instagram. Sits in the same row as
   the WhatsApp button, just to its left, so it
   never collides with the scroll-to-top button
   stacked above WhatsApp.
   ============================================ */

import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { STUDIOS_INSTAGRAM_URL } from '../../utils/constants'

function handleClick() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'select_content', { content_type: 'instagram_button' })
  }
}

const InstagramButton = () => (
  <a
    href={STUDIOS_INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Follow McreatiK Studios on Instagram"
    onClick={handleClick}
    className="fixed bottom-5 right-[84px] sm:right-[92px] z-40 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg shadow-black/30 hover:scale-105 transition-transform bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]"
  >
    <FaInstagram className="w-7 h-7" />
  </a>
)

export default InstagramButton
