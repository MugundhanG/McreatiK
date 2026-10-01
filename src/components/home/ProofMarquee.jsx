/* ============================================
   ProofMarquee — McreatiK (home)
   Real work, moving: one row of website
   concepts drifting left, one row of Studios
   photographs drifting right, with counted-up
   proof numbers between them. Rows pause on
   hover; with reduced motion they become plain
   horizontally scrollable strips.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { DEMO_CONCEPTS, DEMO_INDUSTRIES } from '../../data/demoConcepts'
import { STUDIOS_SERVICES } from '../../utils/constants'
import { CountUp } from '../motion'

const TECH_ROW = [
  'dental-smile-studio', 'interior-aalaya', 'rs-coalstreet', 'photo-kadhai', 'fit-anvil',
  'bq-zari', 're-kalpa', 'edu-vertex', 'skin-lumiere', 'tr-punyam',
]
  .map((slug) => DEMO_CONCEPTS.find((d) => d.slug === slug))
  .filter(Boolean)

/* Local photos only (skips the remote stock placeholder) */
const STUDIO_ROW = STUDIOS_SERVICES.filter((s) => typeof s.image === 'string' && !s.image.startsWith('http'))

function Row({ items, direction, render }) {
  return (
    <div className="marquee-mask group/marquee overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={`flex w-max ${direction === 'left' ? 'marquee-left' : 'marquee-right'} group-hover/marquee:[animation-play-state:paused]`}
      >
        {/* Rendered twice back-to-back; the track moves exactly one copy */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((item) => render(item, copy))}
          </div>
        ))}
      </div>
    </div>
  )
}

const STATS = [
  { value: DEMO_CONCEPTS.length, label: 'website concepts' },
  { value: DEMO_INDUSTRIES.length, label: 'industries' },
]

const ProofMarquee = memo(function ProofMarquee() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <Row
        items={TECH_ROW}
        direction="left"
        render={(d, copy) => (
          <a
            key={`${d.slug}-${copy}`}
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={copy === 1 ? -1 : undefined}
            className="relative block h-44 w-72 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white sm:h-52 sm:w-80"
          >
            <img src={d.desktopShot} alt={copy === 1 ? '' : `${d.name} website concept`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-[2500ms] ease-out hover:-translate-y-[25%]" />
          </a>
        )}
      />

      {/* Proof line */}
      <div className="mx-auto my-10 flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-display text-2xl font-bold text-[#F4F2EA] sm:text-3xl">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <span className="mx-3 text-[#D8AE55]">·</span>}
              <span className="text-[#D8AE55]"><CountUp value={s.value} /></span> {s.label}
            </React.Fragment>
          ))}
          <span className="mx-3 text-[#D8AE55]">·</span>one Chennai photo studio
        </p>
        <div className="flex flex-wrap gap-5 text-sm font-semibold">
          <Link to="/tech/demos" className="inline-flex items-center gap-1.5 text-[#8C9BFF] hover:underline underline-offset-4">
            All website concepts <FiArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/studios/gallery" className="inline-flex items-center gap-1.5 text-[#D8AE55] hover:underline underline-offset-4">
            Studios gallery <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Row
        items={STUDIO_ROW}
        direction="right"
        render={(s, copy) => (
          <Link
            key={`${s.title}-${copy}`}
            to="/studios#offerings"
            tabIndex={copy === 1 ? -1 : undefined}
            className="relative block h-56 w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-64 sm:w-52"
          >
            <img src={s.image} alt={copy === 1 ? '' : s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-xs font-semibold text-white">
              {s.title}
            </span>
          </Link>
        )}
      />
    </section>
  )
})

export default ProofMarquee
