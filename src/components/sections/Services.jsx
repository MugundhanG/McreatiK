/* ============================================
   Services Section
   Displays the company's service offerings
   in a responsive grid of animated cards.
   Data is pulled from constants.js so content
   updates require no component changes.
   ============================================ */

import React, { memo } from 'react'
import { SERVICES } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import ServiceCard from '../ui/ServiceCard'

const Services = memo(function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      {/* Background accent orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What We Do"
          title="Services We Offer"
          subtitle="We deliver end-to-end digital solutions tailored to elevate your brand, engage your audience, and accelerate your growth."
        />

        {/* Service cards grid — 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default Services
