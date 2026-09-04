/* ============================================
   Hero Section — McreatiK (home)
   Left: the wordmark itself as the thesis, plus a
   three-word promise and the ecosystem preview.
   Right (lg+): an orbit graphic — the real MK mark
   ringed by the three department areas — this
   page's signature visual, echoing the real logo's
   navy+gold without copying it outright.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button'
import { getWhatsAppHref } from '../../utils/whatsapp'
import { HOME_EXPLORE_AREAS } from '../../utils/constants'
import mkMark from '../../assets/mcreatik-mk-mark.png'
import homeHeroPhoto from '../../assets/home-hero-photo.png'

const WHATSAPP_HREF = getWhatsAppHref("Hi McreatiK, I have a project in mind — I'd like to talk.")

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } },
})

const MiniCard = memo(function MiniCard({ icon: Icon, name, tagline, accent, comingSoon, index }) {
  const isStudios = accent === '#C9971F'
  return (
    <motion.div
      className="w-60 sm:w-64 rounded-lg border border-white/10 bg-[#121A3D]/90 backdrop-blur-sm px-4 py-3.5 flex items-start gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.15, ease: 'easeOut' }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-md shrink-0 border"
        style={{ borderColor: `${accent}55`, color: accent }}
      >
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <h4
          className="font-semibold font-display text-sm"
          style={{ color: isStudios ? accent : '#F4F2EA' }}
        >
          {name.replace('McreatiK ', '')}
        </h4>
        <p className="text-xs text-[#8890AE] mt-0.5 leading-snug">{tagline}</p>
        {comingSoon && (
          <span className="text-[10px] font-mono-label uppercase text-[#D8AE55] mt-1 inline-block">Coming Soon</span>
        )}
      </div>
    </motion.div>
  )
})

const Hero = memo(function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background photo — heavily blurred and dimmed to a faint texture so the copy stays fully legible */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={homeHeroPhoto}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110 blur-lg opacity-90"
        />
        <div className="absolute inset-0 bg-[#0A1128]/40" />
      </div>

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#D8AE55]/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#4C5FA8]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ===== LEFT — Text ===== */}
          <div className="flex flex-col items-start text-left">
            <motion.h1
              className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight"
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
            >
              <span className="text-[#F4F2EA]">Mcreati</span>
              <span className="text-[#D8AE55]">K</span>
            </motion.h1>

            <motion.div
              className="mt-6 w-full max-w-lg border-t border-white/10"
              variants={fadeUp(0.15)}
              initial="hidden"
              animate="visible"
            >
              {HOME_EXPLORE_AREAS.map(({ key, kicker, name, tagline, accent, comingSoon, cta, href }) => (
                <div key={key} className="py-5 border-b border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span
                      className="text-xs font-mono-label uppercase tracking-wide"
                      style={{ color: accent }}
                    >
                      {kicker}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-1">
                      {name}
                    </h3>
                    <p className="text-sm text-[#8890AE] mt-1 leading-relaxed">{tagline}</p>
                  </div>
                  {comingSoon ? (
                    <span className="shrink-0 text-xs font-mono-label uppercase text-[#D8AE55]">
                      {cta}
                    </span>
                  ) : (
                    <Link
                      to={href}
                      className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
                      style={{ color: accent }}
                    >
                      <span className="underline underline-offset-4">{cta}</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              variants={fadeUp(0.4)}
              initial="hidden"
              animate="visible"
            >
              <Button href="#explore" theme="home">
                Explore McreatiK <FiArrowRight className="w-4 h-4" />
              </Button>
              <Button href={WHATSAPP_HREF} theme="home" variant="outline">
                Start a Project
              </Button>
            </motion.div>
          </div>

          {/* ===== RIGHT — Orbit graphic ===== */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="flex items-center">
              {/* Ring + M emblem */}
              <div className="relative w-72 h-72 xl:w-80 xl:h-80 shrink-0 -mr-10">
                <div className="absolute inset-0 rounded-full border border-[#D8AE55]/25" />
                <div className="absolute inset-10 rounded-full bg-[#D8AE55]/5 blur-2xl" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <img src={mkMark} alt="" aria-hidden="true" className="w-full h-full object-contain select-none" />
                </div>
                <span className="absolute top-[10%] left-[14%] w-2 h-2 rounded-full bg-[#D8AE55]" />
                <span className="absolute bottom-[14%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#D8AE55]/70" />
              </div>

              {/* Mini ecosystem cards */}
              <div className="flex flex-col gap-4 z-10">
                {HOME_EXPLORE_AREAS.map(({ key, ...area }, index) => (
                  <MiniCard key={key} {...area} index={index} />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
})

export default Hero
