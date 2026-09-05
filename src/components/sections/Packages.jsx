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
import { FiLifeBuoy } from 'react-icons/fi'
import { TECH_PACKAGES } from '../../utils/constants'
import { getWhatsAppHref } from '../../utils/whatsapp'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I'd like a quote for a website package for my business."
)

const CARE_PLAN_WHATSAPP_HREF = getWhatsAppHref(
  "Hi McreatiK, I'd like to know more about your Care Plans for ongoing website support."
)

const Packages = memo(function Packages() {
  return (
    <section className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Packages"
          title="Find the Right Fit"
          subtitle="Simple tiers to start the conversation — pricing depends on your business, so every package starts with a quick quote."
        />

        <motion.div
          className="glass-card rounded-lg grid grid-cols-1 lg:grid-cols-3 lg:divide-x divide-stone-200 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
        >
          {TECH_PACKAGES.map(({ name, tagline, highlight }) => (
            <div
              key={name}
              className={`relative p-8 flex flex-col border-t lg:border-t-0 border-stone-200 first:border-t-0 ${
                highlight ? 'bg-[#1E4FD9]/[0.04]' : ''
              }`}
            >
              {highlight && (
                <span className="absolute top-6 right-6 px-2.5 py-1 text-xs font-mono-label uppercase rounded-full bg-[#1E4FD9] text-white">
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-bold font-display text-stone-900 mb-2">{name}</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">{tagline}</p>
              <p className="text-lg font-semibold text-[#1E4FD9] mb-6">Request a Quote</p>
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

        {/* Care Plan — ongoing support, separate from the one-time build tiers above */}
        <motion.div
          className="mt-6 rounded-lg border border-stone-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border border-[#1E4FD9]/25 bg-[#1E4FD9]/[0.05] text-[#1E4FD9]">
            <FiLifeBuoy className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-stone-900 font-semibold font-display">Need ongoing support after launch?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Ask about our Care Plans — regular updates, backups, and small changes so your site stays fresh.
            </p>
          </div>
          <Button href={CARE_PLAN_WHATSAPP_HREF} variant="outline" className="shrink-0">
            <FaWhatsapp className="w-4 h-4" /> Ask About Care Plans
          </Button>
        </motion.div>
      </div>
    </section>
  )
})

export default Packages
