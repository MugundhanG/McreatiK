/* ============================================
   TechHeroGraphic
   Abstract line-art replacement for the circular
   badge watermark — a fanned stack of four
   "deliverable sheets" (website / logo / card /
   resume) with registration-mark corners, in the
   department's indigo/orange spec-sheet register.
   Used as a large, low-opacity background element.
   ============================================ */

import React, { memo } from 'react'

const TechHeroGraphic = memo(function TechHeroGraphic({ className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="none"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {/* Faint construction grid */}
      <g stroke="#5B5FEF" strokeOpacity="0.35" strokeWidth="1">
        <line x1="80" y1="0" x2="80" y2="640" />
        <line x1="320" y1="0" x2="320" y2="640" />
        <line x1="560" y1="0" x2="560" y2="640" />
        <line x1="0" y1="80" x2="640" y2="80" />
        <line x1="0" y1="320" x2="640" y2="320" />
        <line x1="0" y1="560" x2="640" y2="560" />
      </g>
      <circle cx="320" cy="320" r="260" stroke="#5B5FEF" strokeOpacity="0.3" strokeDasharray="2 10" strokeWidth="1.5" />

      {/* Resume sheet — back layer */}
      <g transform="rotate(11 420 300)">
        <rect x="300" y="120" width="200" height="260" rx="10" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.55" />
        <line x1="326" y1="168" x2="474" y2="168" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="326" y1="196" x2="450" y2="196" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="326" y1="224" x2="460" y2="224" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="326" y1="270" x2="474" y2="270" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="326" y1="298" x2="440" y2="298" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="326" y1="326" x2="460" y2="326" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.3" />
      </g>

      {/* Business card sheet */}
      <g transform="rotate(-7 220 420)">
        <rect x="120" y="380" width="230" height="140" rx="10" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.6" />
        <circle cx="160" cy="420" r="16" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="192" y1="412" x2="300" y2="412" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="192" y1="432" x2="270" y2="432" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.3" />
      </g>

      {/* Website / browser sheet — front layer */}
      <g transform="rotate(-4 300 260)">
        <rect x="150" y="140" width="300" height="220" rx="12" stroke="#5B5FEF" strokeWidth="2.5" strokeOpacity="0.85" />
        <line x1="150" y1="176" x2="450" y2="176" stroke="#5B5FEF" strokeWidth="2.5" strokeOpacity="0.85" />
        <circle cx="172" cy="158" r="5" fill="#FF6B35" fillOpacity="0.7" />
        <circle cx="192" cy="158" r="5" stroke="#5B5FEF" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="212" cy="158" r="5" stroke="#5B5FEF" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="176" y="200" width="120" height="70" rx="4" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="176" y1="290" x2="424" y2="290" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="176" y1="312" x2="380" y2="312" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="176" y1="334" x2="400" y2="334" stroke="#5B5FEF" strokeWidth="2" strokeOpacity="0.3" />
      </g>

      {/* Logo mark sheet */}
      <g transform="rotate(9 430 460)">
        <rect x="370" y="380" width="150" height="150" rx="10" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.7" />
        <polygon points="445,410 480,470 410,470" stroke="#FF6B35" strokeWidth="2" strokeOpacity="0.6" />
      </g>

      {/* Registration-mark corners */}
      {[[110, 110], [530, 110], [110, 530], [530, 530]].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} stroke="#FF6B35" strokeOpacity="0.5" strokeWidth="1.5">
          <line x1={cx - 12} y1={cy} x2={cx + 12} y2={cy} />
          <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} />
          <circle cx={cx} cy={cy} r="7" />
        </g>
      ))}
    </svg>
  )
})

export default TechHeroGraphic
