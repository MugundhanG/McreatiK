/* ============================================
   FinalCTA Section — McreatiK (home)
   Card-mockup + headline layout: a floating brand
   card (dot-textured, drop-shadowed) on the left,
   the invitation and a minimal text+circle CTA on
   the right — same copy as before, new frame.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { getWhatsAppHref } from '../../utils/whatsapp'
import mkMark from '../../assets/mcreatik-mk-mark.png'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")

const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D8AE55]/10 via-transparent to-[#4C5FA8]/15 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20 justify-center lg:justify-start">

          {/* ---------- Floating brand card ---------- */}
          <motion.div
            className="hidden sm:block shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#D8AE55]/25 blur-2xl rounded-full" />
              <div className="relative w-52 h-64 -rotate-3 rounded-xl border border-white/10 bg-gradient-to-b from-[#16204a] to-[#0A1128] shadow-2xl shadow-black/40 p-5 flex flex-col justify-between overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.15] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(216,174,85,0.9) 1px, transparent 1px)',
                    backgroundSize: '9px 9px',
                  }}
                />
                <div className="relative flex items-center gap-2">
                  <img src={mkMark} alt="" aria-hidden="true" className="w-6 h-6 object-contain" />
                  <span className="text-white font-display font-semibold text-sm">McreatiK</span>
                </div>
                <p className="relative text-white font-display font-semibold text-lg leading-snug">
                  Digital &amp; Creative Solutions
                </p>
              </div>
            </div>
          </motion.div>

          {/* ---------- Headline + CTA ---------- */}
          <div className="text-center lg:text-left">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Have something in mind? Let's create it.
            </motion.h2>
            <motion.p
              className="mt-5 text-gray-400 text-lg max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Whether it's a website, a brand, or a shoot — tell us what you need and we'll take it from there.
            </motion.p>
            <motion.a
              href={WHATSAPP_HREF}
              className="group mt-8 inline-flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white font-semibold text-base group-hover:text-[#D8AE55] transition-colors">
                Start a Project
              </span>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#D8AE55] text-[#0A1128] transition-all duration-200 group-hover:bg-[#F0CB7E] group-hover:translate-x-0.5">
                <FiArrowRight className="w-4 h-4" />
              </span>
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  )
})

export default FinalCTA
