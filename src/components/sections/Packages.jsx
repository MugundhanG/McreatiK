/* ============================================
   Packages Section — "Comparison Sheet"
   Not three floating cards: one unified spec
   sheet with three ruled columns, like a
   printed rate comparison. Professional gets a
   tinted column instead of a separate card.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { TECH_PACKAGES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I'd like a quote for a website package for my business."
)

const Packages = memo(function Packages() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Packages"
          title="Find the Right Fit"
          subtitle="Simple tiers to start the conversation — pricing depends on your business, so every package starts with a quick quote."
        />

        <motion.div
          className="glass-card rounded-lg grid grid-cols-1 lg:grid-cols-3 lg:divide-x divide-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
        >
          {TECH_PACKAGES.map(({ name, tagline, highlight }) => (
            <div
              key={name}
              className={`relative p-8 flex flex-col border-t lg:border-t-0 border-white/10 first:border-t-0 ${
                highlight ? 'bg-[#5B5FEF]/[0.06]' : ''
              }`}
            >
              {highlight && (
                <span className="absolute top-6 right-6 px-2.5 py-1 text-xs font-mono-label uppercase rounded-full bg-[#5B5FEF] text-white">
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-bold font-display text-white mb-2">{name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tagline}</p>
              <p className="text-lg font-semibold gradient-text mb-6">Request a Quote</p>
              <Button
                href={WHATSAPP_HREF}
                variant={highlight ? 'primary' : 'outline'}
                className="mt-auto w-full"
              >
                <FaWhatsapp className="w-4 h-4" /> Request a Quote
              </Button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
})

export default Packages
