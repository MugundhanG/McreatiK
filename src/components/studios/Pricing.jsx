/* ============================================
   Pricing Section — Studios
   Dark cards (visual style kept from an earlier
   pass), showing the factors that shape a quote
   rather than invented fixed tiers — no real
   prices exist yet. Swap in real fixed packages
   once pricing is final.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { STUDIOS_PRICING_FACTORS } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import Button from '../ui/Button'

const ACCENT = '#C9971F'
const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK Studios, I'd like a quote for a shoot.")

function FactorCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-white/8 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#C9971F] hover:shadow-xl hover:shadow-[#C9971F]/15"
      style={{ backgroundColor: '#14110d' }}
    >
      <div
        className="w-11 h-11 mx-auto rounded-full border flex items-center justify-center mb-5"
        style={{ borderColor: `${ACCENT}66` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: ACCENT }} />
      </div>
      <h3 className="font-display text-lg text-white mb-2">{title}</h3>
      <p className="font-body text-sm text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  )
}

const StudiosPricing = memo(function StudiosPricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-[#F3EEE3] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">What it costs</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Pricing</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg mx-auto">
            Every shoot is different — pricing depends on a few things. Here's what goes into a quote.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {STUDIOS_PRICING_FACTORS.map((factor, index) => (
            <FactorCard key={factor.title} {...factor} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="font-body text-sm text-[#6B6153]">
            Tell us about your shoot and we'll get back with a clear number.
          </p>
          <Button theme="studios" href={WHATSAPP_HREF}>
            <FaWhatsapp className="w-4 h-4" /> Get a Custom Quote
          </Button>
        </motion.div>
      </div>
    </section>
  )
})

export default StudiosPricing
