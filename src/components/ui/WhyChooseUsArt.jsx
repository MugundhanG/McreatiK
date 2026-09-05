/* ============================================
   WhyChooseUsArt
   Six small blueprint-line illustrations for the
   "Why Businesses Choose McreatiK" bento grid — one
   per card. Same two-tone register as the rest of
   Tech (signal-blue #1E4FD9 + rust #A8460A on a
   pale blue construction-paper ground), abstract
   rather than figurative so they read as diagrams,
   not stock-illustration people.
   ============================================ */

import React from 'react'

const BLUE = '#1E4FD9'
const RUST = '#A8460A'

/* Modern & Professional — a browser window with a floating phone,
   the same "deliverables" pairing as the rest of the site. */
export function ModernProfessionalArt() {
  return (
    <svg viewBox="0 0 400 220" fill="none" className="w-full h-full">
      <rect x="20" y="20" width="300" height="180" rx="10" stroke={BLUE} strokeWidth="2" />
      <line x1="20" y1="52" x2="320" y2="52" stroke={BLUE} strokeWidth="2" />
      <circle cx="38" cy="36" r="4" fill={RUST} />
      <circle cx="52" cy="36" r="4" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="66" cy="36" r="4" stroke={BLUE} strokeWidth="1.5" />
      <rect x="40" y="68" width="110" height="66" rx="4" stroke={RUST} strokeWidth="1.5" />
      <line x1="40" y1="150" x2="230" y2="150" stroke={BLUE} strokeWidth="2" opacity="0.5" />
      <line x1="40" y1="166" x2="200" y2="166" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <line x1="40" y1="182" x2="280" y2="182" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <line x1="170" y1="68" x2="300" y2="68" stroke={BLUE} strokeWidth="2" opacity="0.5" />
      <line x1="170" y1="84" x2="280" y2="84" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <g transform="translate(288 96) rotate(8)">
        <rect x="0" y="0" width="76" height="120" rx="12" fill="white" stroke={BLUE} strokeWidth="2" />
        <line x1="14" y1="16" x2="62" y2="16" stroke={BLUE} strokeWidth="2" />
        <rect x="14" y="32" width="48" height="56" rx="3" stroke={RUST} strokeWidth="1.5" />
        <line x1="28" y1="104" x2="48" y2="104" stroke={BLUE} strokeWidth="2" />
      </g>
    </svg>
  )
}

/* Mobile First — a single phone, front and center. */
export function MobileFirstArt() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
      <rect x="70" y="24" width="90" height="172" rx="14" stroke={BLUE} strokeWidth="2.5" />
      <line x1="70" y1="52" x2="160" y2="52" stroke={BLUE} strokeWidth="2" opacity="0.6" />
      <circle cx="115" cy="38" r="4" fill={RUST} />
      <rect x="84" y="66" width="62" height="40" rx="4" stroke={RUST} strokeWidth="1.5" />
      <line x1="84" y1="118" x2="146" y2="118" stroke={BLUE} strokeWidth="2" opacity="0.5" />
      <line x1="84" y1="132" x2="126" y2="132" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <line x1="84" y1="152" x2="146" y2="152" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <line x1="84" y1="166" x2="118" y2="166" stroke={BLUE} strokeWidth="2" opacity="0.35" />
      <line x1="100" y1="182" x2="130" y2="182" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* Built Around Your Business — a compass/target, tailored aim. */
export function BuiltAroundArt() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
      <circle cx="110" cy="110" r="72" stroke={BLUE} strokeWidth="1.5" strokeDasharray="3 8" />
      <circle cx="110" cy="110" r="48" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="110" cy="110" r="24" stroke={RUST} strokeWidth="2" />
      <circle cx="110" cy="110" r="5" fill={RUST} />
      <line x1="110" y1="20" x2="110" y2="38" stroke={BLUE} strokeWidth="2" />
      <line x1="110" y1="182" x2="110" y2="200" stroke={BLUE} strokeWidth="2" />
      <line x1="20" y1="110" x2="38" y2="110" stroke={BLUE} strokeWidth="2" />
      <line x1="182" y1="110" x2="200" y2="110" stroke={BLUE} strokeWidth="2" />
      <line x1="110" y1="110" x2="150" y2="72" stroke={RUST} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* Conversion Focused — an ascending chart with a click. */
export function ConversionFocusedArt() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
      <line x1="36" y1="176" x2="184" y2="176" stroke={BLUE} strokeWidth="2" opacity="0.5" />
      <rect x="48" y="132" width="24" height="44" rx="3" stroke={BLUE} strokeWidth="2" />
      <rect x="88" y="104" width="24" height="72" rx="3" stroke={BLUE} strokeWidth="2" />
      <rect x="128" y="68" width="24" height="108" rx="3" fill={BLUE} fillOpacity="0.08" stroke={BLUE} strokeWidth="2" />
      <path d="M48 100 L92 78 L140 52" stroke={RUST} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M124 52 L140 52 L140 68" stroke={RUST} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform="translate(150 34)">
        <circle cx="0" cy="0" r="10" stroke={BLUE} strokeWidth="1.5" />
        <line x1="7" y1="7" x2="16" y2="16" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/* Fast & Reliable — a speedometer, needle pinned high. */
export function FastReliableArt() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
      <path d="M40 140 A70 70 0 0 1 180 140" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="40" y1="140" x2="52" y2="140" stroke={BLUE} strokeWidth="2" />
      <line x1="180" y1="140" x2="168" y2="140" stroke={BLUE} strokeWidth="2" />
      <line x1="66" y1="86" x2="72" y2="96" stroke={BLUE} strokeWidth="2" />
      <line x1="110" y1="70" x2="110" y2="82" stroke={BLUE} strokeWidth="2" />
      <line x1="154" y1="86" x2="148" y2="96" stroke={BLUE} strokeWidth="2" />
      <line x1="110" y1="140" x2="140" y2="98" stroke={RUST} strokeWidth="3" strokeLinecap="round" />
      <circle cx="110" cy="140" r="7" fill={RUST} />
      <path d="M30 176 L46 176 M22 188 L52 188" stroke={BLUE} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M168 176 L184 176 M158 188 L188 188" stroke={BLUE} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/* Ongoing Support — two people in a shared chat thread, wide format. */
export function OngoingSupportArt() {
  return (
    <svg viewBox="0 0 640 200" fill="none" className="w-full h-full">
      <g transform="translate(70 60)">
        <circle cx="0" cy="0" r="22" stroke={BLUE} strokeWidth="2.5" />
        <path d="M-32 74 C-32 40 -18 24 0 24 C18 24 32 40 32 74" stroke={BLUE} strokeWidth="2.5" />
      </g>
      <g transform="translate(570 60)">
        <circle cx="0" cy="0" r="22" stroke={RUST} strokeWidth="2.5" />
        <path d="M-32 74 C-32 40 -18 24 0 24 C18 24 32 40 32 74" stroke={RUST} strokeWidth="2.5" />
      </g>
      <line x1="112" y1="70" x2="248" y2="70" stroke={BLUE} strokeWidth="1.5" strokeDasharray="3 7" />
      <line x1="392" y1="70" x2="528" y2="70" stroke={BLUE} strokeWidth="1.5" strokeDasharray="3 7" />
      <g transform="translate(258 24)">
        <rect x="0" y="0" width="124" height="88" rx="14" fill="white" stroke={BLUE} strokeWidth="2" />
        <path d="M18 88 L18 104 L38 88 Z" fill="white" stroke={BLUE} strokeWidth="2" />
        <line x1="20" y1="26" x2="104" y2="26" stroke={BLUE} strokeWidth="2" opacity="0.5" />
        <line x1="20" y1="42" x2="84" y2="42" stroke={BLUE} strokeWidth="2" opacity="0.35" />
        <circle cx="62" cy="64" r="16" stroke={RUST} strokeWidth="2" />
        <path d="M54 64 L60 70 L72 56" stroke={RUST} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}
