/* ============================================
   About Section — "Colophon"
   No card boxes: flowing text in two ruled
   columns, stats set as inline masthead numbers
   rather than boxed tiles.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { TECH_STATS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

const About = memo(function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-stone-100 scroll-mt-24">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Us"
          title="About McreatiK Tech"
          subtitle="McreatiK Tech helps businesses establish a modern, professional digital presence through websites, branding and digital solutions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-stone-200">
          {/* LEFT — Story + inline stats */}
          <motion.div
            className="lg:pr-12 pb-10 lg:pb-0 border-b lg:border-b-0 border-stone-200"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-stone-700 leading-relaxed text-lg">
              We're a business-focused creative technology partner — helping entrepreneurs and established brands look professional online, connect with customers, and grow.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-medium text-[#1E4FD9] hover:text-[#A8460A] transition-colors">
                Work with us <FiArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats — inline masthead numbers, not boxed tiles */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-8 border-t border-stone-200">
              {TECH_STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-[#1E4FD9] font-display">{value}</div>
                  <div className="text-stone-500 text-xs mt-1">{label}</div>
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
            <div className="pb-8 border-b border-stone-200">
              <h3 className="font-mono-label text-xs uppercase text-[#A8460A] mb-3">Our Mission</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
                To empower businesses and individuals with innovative, high-quality digital solutions by delivering modern websites, creative designs, and smart technology services that enhance their brand presence, efficiency, and growth.
              </p>
            </div>
            <div className="pt-8">
              <h3 className="font-mono-label text-xs uppercase text-[#A8460A] mb-3">Our Vision</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
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
