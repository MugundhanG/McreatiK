/* ============================================
   DemoConceptCard — Tech "Website Concepts"
   Browser-chrome preview of a hosted demo site:
   a faux URL bar framing the desktop screenshot
   (which glides top-to-bottom on hover/focus),
   a phone-frame mobile shot overlapping the
   corner, then the concept's name, tagline,
   feature chips, palette + font line, and the
   two conversion buttons.

   `compact` trims the copy for the Tech home
   teaser, where three of these sit side by side
   above a "browse all" link.
   ============================================ */

import React, { memo } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { DEMO_INDUSTRIES } from '../../data/demoConcepts'

const industryLabel = (id) => DEMO_INDUSTRIES.find((ind) => ind.id === id)?.label || id

const DemoConceptCard = memo(function DemoConceptCard({ concept, compact = false }) {
  const {
    slug, name, industry, tagline, features, palette, fonts, url, desktopShot, mobileShot,
  } = concept

  const whatsappHref = getWhatsAppHref(
    `Hi McreatiK, I saw the ${name} concept and want a website like this for my business.`
  )

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl glass-card transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/5 hover:border-[#1E4FD9]/25">
      {/* ===== Browser-chrome preview ===== */}
      <div className="relative">
        <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3.5 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-stone-300" />
            <span className="h-2 w-2 rounded-full bg-stone-300" />
            <span className="h-2 w-2 rounded-full bg-stone-300" />
          </span>
          <span className="font-mono-label truncate text-[10px] text-stone-400">
            mcreatik.com/demos/{slug}
          </span>
        </div>

        <div
          className={`relative overflow-hidden bg-stone-100 ${compact ? 'h-44 sm:h-48' : 'h-56 sm:h-64'}`}
        >
          <img
            src={desktopShot}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 top-0 w-full will-change-transform transition-transform ease-in-out duration-[6000ms] group-hover:-translate-y-[80%] group-focus-within:-translate-y-[80%] motion-reduce:transition-none motion-reduce:!translate-y-0"
          />

          {/* Phone-frame mobile shot, overlapping the bottom-right corner */}
          <div className="absolute -bottom-3 -right-3 w-16 sm:w-20 overflow-hidden rounded-[10px] border-[3px] border-white bg-stone-900 shadow-lg shadow-stone-900/20">
            <img
              src={mobileShot}
              alt=""
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>
        </div>
      </div>

      {/* ===== Copy ===== */}
      <div className={`flex flex-1 flex-col ${compact ? 'p-5' : 'p-6'}`}>
        <span className="font-mono-label mb-2 inline-block w-fit text-[10px] uppercase text-[#1E4FD9]">
          {industryLabel(industry)}
        </span>
        <h3 className="font-display text-lg font-bold text-stone-900">{name}</h3>
        <p className="mt-1 text-sm text-stone-600">{tagline}</p>

        {!compact && (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {palette.map((hex, i) => (
              <span
                key={`${hex}-${i}`}
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <span className="truncate text-xs text-stone-400">{fonts[0]} · {fonts[1]}</span>
        </div>

        <div className="mt-5 flex flex-1 flex-col justify-end gap-2.5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View live demo of ${name} (opens in a new tab)`}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#1E4FD9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#1E4FD9]/25 transition-colors duration-200 hover:bg-[#1840b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4FD9]"
          >
            View live demo <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get a website like ${name} for my business, via WhatsApp (opens in a new tab)`}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:border-[#1E4FD9] hover:text-[#1E4FD9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4FD9]"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Get this for my business
          </a>
        </div>
      </div>
    </div>
  )
})

export default DemoConceptCard
