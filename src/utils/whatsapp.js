/* ============================================
   WhatsApp helper
   Builds a wa.me link with a pre-filled message,
   using the shared contact number from constants.
   ============================================ */

import { WHATSAPP_NUMBER } from './constants'

export function getWhatsAppHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
