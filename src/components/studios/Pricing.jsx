/* ============================================
   Pricing Section — Studios
   Editorial layout on the page's own warm paper
   (the old dark cards clashed with it): a
   sticky intro + quote card on the left, and the
   factors that shape a quote on the right as
   numbered rows along a gold rail that draws
   itself as you scroll. No invented prices —
   swap in real packages once they're final.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { STUDIOS_PRICING_FACTORS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'
import { Magnetic, RevealText, ScrollLine } from '../motion'

const EASE = [0.22, 1, 0.36, 1]
const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK Studios, I'd like a quote for a shoot.")

const StudiosPricing = memo(function StudiosPricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-[#F3EEE3] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* ===== Left — intro + quote card (sticks while the rows scroll) ===== */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What it costs</p>
          <RevealText as="h2" text="Pricing" className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-[#1C1710]" />
          <p className="font-body mt-5 text-[#6B6153] max-w-md leading-relaxed">
            Every shoot is different, so there's no one-size price list. These three things shape your quote —
            tell us about yours and we'll come back with a clear number.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="mt-9 rounded-2xl border border-[#1C1710]/10 bg-[#FAF7F0] p-6 sm:p-7 shadow-[0_20px_50px_-30px_rgba(28,23,16,0.35)]"
          >
            <p className="font-display italic text-2xl text-[#1C1710]">Get a custom quote</p>
            <p className="font-body mt-2 text-sm text-[#6B6153]">No obligation — just a clear number for your shoot.</p>
            <div className="mt-5">
              <Magnetic>
                <Button theme="studios" href={WHATSAPP_HREF}>
                  <FaWhatsapp className="w-4 h-4" /> Ask on WhatsApp
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        {/* ===== Right — the factors, along a self-drawing rail ===== */}
        <ol className="relative pl-8 sm:pl-12">
          <ScrollLine
            className="absolute left-0 top-2 bottom-2 w-px"
            trackClassName="bg-[#1C1710]/10"
            fillClassName="bg-[#C9971F]"
          />
          {STUDIOS_PRICING_FACTORS.map(({ icon: Icon, title, description }, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
              className="group relative border-b border-[#1C1710]/10 py-10 first:pt-0 last:border-b-0"
            >
              {/* Rail node */}
              <span className="absolute -left-8 top-[0.6rem] flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border border-[#C9971F] bg-[#F3EEE3] transition-colors duration-300 group-hover:bg-[#C9971F] sm:-left-12 group-first:top-[0.6rem]" />

              <div className="flex items-start gap-6">
                <span className="font-display italic text-5xl sm:text-6xl leading-none text-[#C9971F]/30 transition-colors duration-500 group-hover:text-[#C9971F]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="pt-1">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#C9971F]" aria-hidden="true" />
                    <h3 className="font-display text-2xl text-[#1C1710] transition-transform duration-300 group-hover:translate-x-1">
                      {title}
                    </h3>
                  </div>
                  <p className="font-body mt-3 max-w-md text-[#6B6153] leading-relaxed">{description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
})

export default StudiosPricing
