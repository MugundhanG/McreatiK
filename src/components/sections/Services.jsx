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
import SectionDivider from '../ui/SectionDivider'
import ServiceCard from '../ui/ServiceCard'

const Services = memo(function Services() {
  const featured = TECH_SERVICES.find((s) => s.featured)
  const byCategory = TECH_SERVICE_CATEGORIES.map((category) => ({
    category,
    services: TECH_SERVICES.filter((s) => s.category === category && !s.featured),
  }))

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ Services" />
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
                <h3 className="font-mono-label text-xs uppercase text-[#A8460A]">{category}</h3>
              </div>
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-6 sm:px-8 py-4 border-t border-stone-200 hover:bg-stone-50 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <div className="flex items-center gap-3 shrink-0 sm:w-48">
                    <service.icon className="w-4 h-4 text-[#1E4FD9] shrink-0 group-hover:text-[#A8460A] transition-colors" />
                    <h4 className="text-stone-900 text-sm font-semibold font-display">{service.title}</h4>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed pl-7 sm:pl-0">
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
