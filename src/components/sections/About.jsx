/* ============================================
   About Section
   Tells the McreatiK story with:
     - Mission and vision text
     - Animated stat counters
     - Core values grid
   Clean typography with scroll-triggered
   entrance animations via Framer Motion.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiHeart, FiShield } from 'react-icons/fi'
import { STATS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

/* Company core values displayed as small cards */
const VALUES = [
  { icon: FiTarget, title: 'Precision', text: 'Every pixel, every line of code — crafted with purpose.' },
  { icon: FiZap, title: 'Innovation', text: 'We embrace emerging technologies to stay ahead of the curve.' },
  { icon: FiHeart, title: 'Passion', text: 'We genuinely love what we do, and it shows in our work.' },
  { icon: FiShield, title: 'Reliability', text: 'Deadlines met. Quality assured. Promises kept.' },
]

const About = memo(function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Us"
          title="Who We Are"
          subtitle="We're a team of designers, developers, and strategists passionate about building digital products that make an impact."
        />

        {/* ---------- Mission / Vision ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            className="glass-card rounded-2xl p-8 lg:p-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold font-display text-white mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To empower businesses and individuals with innovative, 
              high-quality digital solutions by delivering modern websites, 
              creative designs, and smart technology services that enhance their brand presence, efficiency, and growth.
            </p>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-8 lg:p-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold font-display text-white mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To be the go-to digital partner for ambitious brands worldwide —
              recognized for transforming ideas into exceptional digital experiences
              and helping businesses thrive in the digital era.
            </p>
          </motion.div>
        </div>

        {/* ---------- Stats Row ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {STATS.map(({ value, label }, index) => (
            <motion.div
              key={label}
              className="text-center p-6 glass-card rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text font-display mb-1">
                {value}
              </div>
              <div className="text-gray-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* ---------- Core Values ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              className="glass-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="text-white font-semibold font-display mb-2">{title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default About
