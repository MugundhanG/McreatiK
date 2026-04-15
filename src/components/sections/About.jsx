/* ============================================
   About Section — Redesigned Layout
   Structure:
     - Top: Split layout (story + stats LEFT,
             mission & vision RIGHT)
     - Bottom: Core values as horizontal
               left-aligned cards
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiHeart, FiShield, FiArrowRight } from 'react-icons/fi'
import { STATS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

const VALUES = [
  { icon: FiTarget, title: 'Precision',   text: 'Every pixel, every line of code — crafted with purpose.' },
  { icon: FiZap,    title: 'Innovation',  text: 'We embrace emerging technologies to stay ahead of the curve.' },
  { icon: FiHeart,  title: 'Passion',     text: 'We genuinely love what we do, and it shows in our work.' },
  { icon: FiShield, title: 'Reliability', text: 'Deadlines met. Quality assured. Promises kept.' },
]

const About = memo(function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Us"
          title="Who We Are"
          subtitle="We're a team of designers, developers, and strategists passionate about building digital products that make an impact."
        />

        {/* ===== TOP — Split Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* LEFT — Story + Stats */}
          <motion.div
            className="flex flex-col justify-between gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Story text */}
            <div className="glass-card rounded-2xl p-8">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Our Story
              </span>
              <p className="text-gray-300 leading-relaxed mb-4">
                McreatiK was born from a simple belief — every business deserves a powerful digital presence, regardless of size. We started with simple laptop at home with a dream and belief in the power of design and technology, and grew into a full-service digital solutions provider.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Today we help entrepreneurs, startups, and established brands craft digital experiences that are not just beautiful, but built to perform and convert.
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-indigo-400 hover:text-cyan-400 transition-colors">
                Work with us <FiArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map(({ value, label }, index) => (
                <motion.div
                  key={label}
                  className="glass-card rounded-2xl p-5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text font-display mb-1">
                    {value}
                  </div>
                  <div className="text-gray-400 text-xs leading-snug">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Mission & Vision stacked */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Mission */}
            <div className="glass-card rounded-2xl p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20">
                  <FiTarget className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">Our Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                To empower businesses and individuals with innovative, high-quality digital solutions by delivering modern websites, creative designs, and smart technology services that enhance their brand presence, efficiency, and growth.
              </p>
            </div>

            {/* Vision */}
            <div className="glass-card rounded-2xl p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 flex items-center justify-center border border-violet-500/20">
                  <FiZap className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">Our Vision</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                To be the go-to digital partner for ambitious brands worldwide — recognized for transforming ideas into exceptional digital experiences and helping businesses thrive in the digital era.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ===== BOTTOM — Core Values ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              className="glass-card rounded-2xl p-6 flex items-start gap-4 hover:border-indigo-500/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20 mt-0.5">
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold font-display mb-1">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default About
