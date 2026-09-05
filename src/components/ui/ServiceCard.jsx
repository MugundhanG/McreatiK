/* ============================================
   ServiceCard Component — Tech & Creative (light)
   Displays a single service as a numbered
   manifest line item inside a flat white card.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const ServiceCard = memo(function ServiceCard({ icon: Icon, title, description, index, featured = false }) {
  return (
    <motion.div
      className={`group relative glass-card rounded-lg hover:border-[#1E4FD9]/35 hover:shadow-md hover:shadow-stone-900/5 transition-all duration-300 ${
        featured ? 'p-8 lg:p-10 border-[#1E4FD9]/30' : 'p-8'
      }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <div className="relative flex items-start justify-between mb-6">
        {/* Icon container */}
        <div className={`rounded-md bg-[#1E4FD9]/[0.06] flex items-center justify-center border border-[#1E4FD9]/15 group-hover:border-[#1E4FD9]/35 transition-colors ${featured ? 'w-16 h-16' : 'w-14 h-14'}`}>
          <Icon className={`text-[#1E4FD9] group-hover:text-[#A8460A] transition-colors duration-300 ${featured ? 'w-7 h-7' : 'w-6 h-6'}`} />
        </div>
        {featured ? (
          <span className="px-3 py-1 text-xs font-mono-label uppercase rounded-full bg-[#1E4FD9]/[0.06] text-[#1E4FD9] border border-[#1E4FD9]/20">
            Our Core Service
          </span>
        ) : (
          <span className="font-mono-label text-xs text-stone-400">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <h3 className={`relative font-semibold text-stone-900 mb-3 font-display ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
        {title}
      </h3>
      <p className={`relative text-stone-600 leading-relaxed ${featured ? 'text-base max-w-2xl' : 'text-sm'}`}>
        {description}
      </p>
    </motion.div>
  )
})

export default ServiceCard
