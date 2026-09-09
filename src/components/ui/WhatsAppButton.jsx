/* ============================================
   WhatsAppButton
   Fixed floating chat button, bottom-right on
   every route. Opens a wa.me chat with a
   pre-filled inquiry message.
   ============================================ */

import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppHref } from '../../utils/whatsapp'

const PREFILL_MESSAGE = "Hi McreatiK, I'd like to know more about your services."

function handleClick() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', { form_name: 'whatsapp_button' })
  }
}

const WhatsAppButton = () => (
  <a
    href={getWhatsAppHref(PREFILL_MESSAGE)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with McreatiK on WhatsApp"
    onClick={handleClick}
    className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 hover:scale-105 transition-transform"
  >
    <FaWhatsapp className="w-7 h-7" />
  </a>
)

export default WhatsAppButton
