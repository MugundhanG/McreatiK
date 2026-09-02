/* ============================================
   ServiceCard Component — Tech & Creative
   Displays a single service as a numbered
   manifest line item inside a flat card.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const ServiceCard = memo(function ServiceCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      className="group relative glass-card rounded-lg p-8 hover:border-[#5B5FEF]/40 transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      {/* Glow effect behind the card on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#5B5FEF]/10 via-transparent to-[#FF6B35]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between mb-6">
        {/* Icon container with gradient background */}
        <div className="w-14 h-14 rounded-md bg-gradient-to-br from-[#5B5FEF]/20 to-[#FF6B35]/10 flex items-center justify-center border border-[#5B5FEF]/20 group-hover:border-[#5B5FEF]/40 transition-colors">
          <Icon className="w-6 h-6 text-[#a5a8ff] group-hover:text-[#FF6B35] transition-colors duration-300" />
        </div>
        <span className="font-mono-label text-xs text-gray-600">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 className="relative text-xl font-semibold text-white mb-3 font-display">
        {title}
      </h3>
      <p className="relative text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  )
})

export default ServiceCard
