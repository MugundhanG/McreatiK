/* ============================================
   About Section — "Colophon"
   No card boxes: flowing text in two ruled
   columns, stats set as inline masthead numbers
   rather than boxed tiles.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { TECH_STATS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

const About = memo(function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B5FEF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Us"
          title="About McreatiK Tech"
          subtitle="McreatiK Tech helps businesses establish a modern, professional digital presence through websites, branding and digital solutions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-white/10">
          {/* LEFT — Story + inline stats */}
          <motion.div
            className="lg:pr-12 pb-10 lg:pb-0 border-b lg:border-b-0 border-white/10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-300 leading-relaxed text-lg">
              We're a business-focused creative technology partner — helping entrepreneurs and established brands look professional online, connect with customers, and grow.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-medium text-[#a5a8ff] hover:text-[#FF6B35] transition-colors">
                Work with us <FiArrowRight className="w-4 h-4" />
              </a>
              <Link to="/studios" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#a5a8ff] transition-colors">
                Looking for photography? Visit McreatiK Studios <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats — inline masthead numbers, not boxed tiles */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-8 border-t border-white/10">
              {TECH_STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold gradient-text font-display">{value}</div>
                  <div className="text-gray-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Mission & Vision, flowing text separated by a rule */}
          <motion.div
            className="lg:pl-12 pt-10 lg:pt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pb-8 border-b border-white/10">
              <h3 className="font-mono-label text-xs uppercase text-[#FF6B35] mb-3">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                To empower businesses and individuals with innovative, high-quality digital solutions by delivering modern websites, creative designs, and smart technology services that enhance their brand presence, efficiency, and growth.
              </p>
            </div>
            <div className="pt-8">
              <h3 className="font-mono-label text-xs uppercase text-[#FF6B35] mb-3">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                To be the go-to digital partner for ambitious brands worldwide — recognized for transforming ideas into exceptional digital experiences and helping businesses thrive in the digital era.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default About
