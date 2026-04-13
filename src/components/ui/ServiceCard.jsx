/* ============================================
   ServiceCard Component
   Displays a single service with icon, title,
   and description inside a glass-morphism card.
   Includes hover glow and lift animation.
   ============================================ */

import React, { memo } from 'react'
import { motion } from 'framer-motion'

const ServiceCard = memo(function ServiceCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      className="group relative glass-card rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      {/* Glow effect behind the card on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon container with gradient background */}
      <div className="relative w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-400/40 transition-colors">
        <Icon className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300" />
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
