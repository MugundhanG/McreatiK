/* ============================================
   Services Section — "Rate Card"
   Website Development leads as a cover banner;
   everything else reads as a categorized rate
   card — ruled rows, not another card grid.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { TECH_SERVICES, TECH_SERVICE_CATEGORIES } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import ServiceCard from '../ui/ServiceCard'

const Services = memo(function Services() {
  const featured = TECH_SERVICES.find((s) => s.featured)
  const byCategory = TECH_SERVICE_CATEGORIES.map((category) => ({
    category,
    services: TECH_SERVICES.filter((s) => s.category === category && !s.featured),
  }))

  return (
    <section id="services" className="relative py-24 lg:py-32">
      {/* Background accent orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B5FEF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What We Do"
          title="Services That Grow With Your Business"
          subtitle="Website development is our core focus — branding and digital design round out a complete online presence."
        />

        {/* Featured core service — cover banner */}
        {featured && (
          <div className="mb-14">
            <ServiceCard {...featured} index={0} featured />
          </div>
        )}

        {/* Rate card — ruled rows grouped by category */}
        <div className="glass-card rounded-lg overflow-hidden">
          {byCategory.map(({ category, services }) => (
            <div key={category}>
              <div className="px-6 sm:px-8 pt-6 pb-2">
                <h3 className="font-mono-label text-xs uppercase text-[#FF6B35]">{category}</h3>
              </div>
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-6 sm:px-8 py-4 border-t border-white/10 hover:bg-white/[0.03] transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <div className="flex items-center gap-3 shrink-0 sm:w-48">
                    <service.icon className="w-4 h-4 text-[#a5a8ff] shrink-0 group-hover:text-[#FF6B35] transition-colors" />
                    <h4 className="text-white text-sm font-semibold font-display">{service.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pl-7 sm:pl-0">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default Services
