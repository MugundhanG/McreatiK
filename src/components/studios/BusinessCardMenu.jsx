/* ============================================
   BusinessCardMenu — McreatiK Studios
   Lets visitors grab the studio's business card:
   the card as a PDF or image, or a vCard that
   saves the contact straight into their phone.
   Two entry points share one menu:
   - BusinessCardNavButton: in the desktop navbar
   - BusinessCardFab: a floating bottom-left button
     on phones/tablets (the right edge already holds
     WhatsApp, scroll-to-top and Instagram).
   Files live in public/studios/.
   ============================================ */

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCreditCard, FiDownload, FiImage, FiUserPlus, FiX } from 'react-icons/fi'

const MENU_TITLE = 'Download our digital business card'

const CARD_OPTIONS = [
  {
    label: 'Business card (PDF)',
    hint: 'Front & back, print-ready',
    href: '/studios/mcreatik-studios-business-card.pdf',
    download: 'McreatiK-Studios-Business-Card.pdf',
    icon: FiDownload,
  },
  {
    label: 'Business card (image)',
    hint: 'Easy to share on WhatsApp',
    href: '/studios/mcreatik-studios-business-card.jpg',
    download: 'McreatiK-Studios-Business-Card.jpg',
    icon: FiImage,
  },
  {
    label: 'Save contact',
    hint: 'Add us to your phone contacts',
    href: '/studios/mcreatik-studios.vcf',
    download: 'McreatiK-Studios.vcf',
    icon: FiUserPlus,
  },
]

function trackDownload(label) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'file_download', { file_name: label, link_text: 'Studios business card' })
  }
}

function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, setOpen, ref])
}

function CardOptions({ onPick }) {
  return (
    <ul className="space-y-0.5">
      {CARD_OPTIONS.map(({ label, hint, href, download, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            download={download}
            onClick={() => {
              trackDownload(label)
              onPick()
            }}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#C9971F]/10 focus-visible:bg-[#C9971F]/10 focus-visible:outline-none"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9971F]/12 text-[#9C7414] transition-colors group-hover:bg-[#C9971F] group-hover:text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block font-body text-sm font-semibold text-[#1C1710]">{label}</span>
              <span className="block font-body text-xs text-[#6B6153]">{hint}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

const panelMotion = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

/* Desktop navbar button (lg+). `transparent` matches the navbar's
   over-the-hero state so the button reads on the photo. */
export function BusinessCardNavButton({ transparent }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(open, setOpen, ref)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Download our digital business card"
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 xl:px-3.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
          transparent
            ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
            : 'border-[#C9971F]/40 text-[#9C7414] hover:border-[#C9971F] hover:bg-[#C9971F]/10'
        }`}
      >
        <FiDownload className="h-4 w-4" aria-hidden="true" />
        {/* Full label where the navbar has room; shorter on compact laptops. */}
        <span className="xl:hidden">Business Card</span>
        <span className="hidden xl:inline 2xl:hidden">Digital Business Card</span>
        <span className="hidden 2xl:inline">Download Digital Business Card</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            {...panelMotion}
            className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-black/10 bg-[#FAF7F0] p-2 shadow-xl shadow-black/15"
          >
            <p className="px-3 pt-1.5 pb-1 font-mono-label text-[10px] uppercase tracking-wide text-[#9C7414]">
              {MENU_TITLE}
            </p>
            <CardOptions onPick={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Phones & tablets (< lg): floating button, bottom-left. */
export function BusinessCardFab() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(open, setOpen, ref)

  return (
    <div ref={ref} className="fixed bottom-5 left-4 sm:left-6 z-40 lg:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute bottom-full left-0 mb-3 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-black/10 bg-[#FAF7F0] p-2 shadow-xl shadow-black/20"
          >
            <p className="px-3 pt-1.5 pb-1 font-mono-label text-[10px] uppercase tracking-wide text-[#9C7414]">
              {MENU_TITLE}
            </p>
            <CardOptions onPick={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={open ? 'Close business card options' : 'Download our digital business card'}
        className="flex h-14 items-center gap-2 rounded-full bg-[#C9971F] pl-4 pr-5 text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 cursor-pointer"
      >
        {open ? <FiX className="h-5 w-5" aria-hidden="true" /> : <FiCreditCard className="h-5 w-5" aria-hidden="true" />}
        <span className="text-sm font-semibold whitespace-nowrap">{open ? 'Close' : 'Digital Business Card'}</span>
      </button>
    </div>
  )
}
