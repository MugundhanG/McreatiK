/* ============================================
   ImShell — chrome for the Instant Memories
   SaaS site (/instant-memories/*): its own
   navbar and footer in the contact-sheet
   theme (.theme-im), separate from Tech and
   Studios. Instant Memories is McreatiK's
   product for photography studios.
   ============================================ */

import React, { Suspense, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi'
import ScrollToTop from '../ui/ScrollToTop'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { IM_APP_URL, IM_DEMO_MESSAGE, IM_HOME, IM_HOW } from '../../data/instantMemories'

const imDemoHref = getWhatsAppHref(IM_DEMO_MESSAGE)

const NAV = [
  { label: 'Product', to: `${IM_HOME}#product` },
  { label: 'How it works', to: IM_HOW },
  { label: 'Pricing', to: `${IM_HOME}#pricing` },
  { label: 'FAQ', to: `${IM_HOME}#faq` },
]

/* The six aperture blades of a camera shutter (24×24 grid). Also used
   for the browser tab icon (public/favicon-im.svg). */
const BLADES = [
  [14.31, 8, 20.05, 17.94], [9.69, 8, 21.17, 8], [7.38, 12, 13.12, 2.06],
  [9.69, 16, 3.95, 6.06], [14.31, 16, 2.83, 16], [16.62, 12, 10.88, 21.94],
]

/** The Instant Memories mark: a gold camera shutter on McreatiK navy. */
export function ShutterMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className}`}>
      <circle cx="16" cy="16" r="16" fill="#0A1128" />
      <g transform="translate(4 4)" fill="none" stroke="#D8AE55" strokeWidth="1.9" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        {BLADES.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
    </svg>
  )
}

/** The product wordmark: the shutter mark, the name, and the company behind it. */
export function Wordmark({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <ShutterMark className="h-8 w-8" />
      <span className="leading-none">
        <span className={`block font-display text-[17px] font-bold tracking-tight ${light ? 'text-white' : 'text-[#0E1116]'}`}>Instant Memories</span>
        <span className={`mt-0.5 block font-mono-label text-[9px] uppercase ${light ? 'text-white/50' : 'text-[#5B6270]'}`}>by McreatiK</span>
      </span>
    </span>
  )
}

function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'border-b border-black/[0.07] bg-[#F6F7F9]/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to={IM_HOME} onClick={close} aria-label="Instant Memories by McreatiK, home"><Wordmark /></Link>
        <nav aria-label="Instant Memories" className="hidden items-center gap-7 md:flex">
          {NAV.map(({ label, to }) => (
            <Link key={label} to={to}
              className={`font-body text-sm transition-colors hover:text-[#0E1116] ${pathname === to ? 'text-[#0E1116] font-medium' : 'text-[#4A505C]'}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={IM_APP_URL} target="_blank" rel="noreferrer" className="font-body text-sm text-[#4A505C] hover:text-[#0E1116]">Log in</a>
          <a href={imDemoHref} target="_blank" rel="noreferrer"
            className="rounded-lg bg-[#0E1116] px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-[#E5372B]">
            Try it free
          </a>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}
          className="flex h-9 w-9 cursor-pointer items-center justify-center text-[#0E1116] md:hidden">
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav aria-label="Instant Memories" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-black/[0.07] bg-[#F6F7F9] px-5 md:hidden">
            <div className="space-y-1 py-4">
              {NAV.map(({ label, to }) => (
                <Link key={label} to={to} onClick={close} className="block py-2.5 font-body text-[15px] text-[#0E1116]">{label}</Link>
              ))}
              <a href={IM_APP_URL} target="_blank" rel="noreferrer" className="block py-2.5 font-body text-[15px] text-[#0E1116]">Log in</a>
              <a href={imDemoHref} target="_blank" rel="noreferrer" onClick={close}
                className="mt-3 block rounded-lg bg-[#E5372B] py-3 text-center font-body text-sm font-semibold text-white">
                Try your first wedding free
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#16191E] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark light />
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-white/60">
            Live event galleries for photography studios. Built and run by McreatiK in Chennai.
          </p>
        </div>
        <div>
          <p className="font-mono-label text-[10px] uppercase text-white/40">Product</p>
          <ul className="mt-3 space-y-2 font-body text-sm">
            <li><Link to={IM_HOW} className="text-white/80 hover:text-white">How it works</Link></li>
            <li><Link to={`${IM_HOME}#pricing`} className="text-white/80 hover:text-white">Pricing</Link></li>
            <li><a href={IM_APP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-white">Studio log in <FiArrowUpRight className="h-3.5 w-3.5" /></a></li>
            <li><a href={`${IM_APP_URL}/privacy`} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">Privacy</a></li>
            <li><a href={`${IM_APP_URL}/terms`} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">Terms</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono-label text-[10px] uppercase text-white/40">Company</p>
          <ul className="mt-3 space-y-2 font-body text-sm">
            <li><Link to="/" className="text-white/80 hover:text-white">McreatiK</Link></li>
            <li><Link to="/studios" className="text-white/80 hover:text-white">McreatiK Studios</Link></li>
            <li><Link to="/tech" className="text-white/80 hover:text-white">McreatiK Tech</Link></li>
            <li><a href="mailto:connect@mcreatik.com" className="text-white/80 hover:text-white">connect@mcreatik.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 font-mono-label text-[10px] uppercase text-white/40 sm:px-8">
          © {new Date().getFullYear()} McreatiK · Instant Memories
        </p>
      </div>
    </footer>
  )
}

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5372B] border-t-transparent" />
    </div>
  )
}

export default function ImShell({ children }) {
  return (
    <div className="theme-im min-h-screen w-full overflow-x-clip font-body">
      <Navbar />
      <main>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#0E1116] text-white shadow-black/20 hover:bg-[#E5372B]" />
    </div>
  )
}
