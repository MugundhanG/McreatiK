/* ============================================
   PortfolioCard Component
   Displays a portfolio project as a clickable
   card. Features lazy-loaded image, overlay
   with project details, and a category badge.

   Behavior:
   - category === "Logo" → opens Lightbox popup
   - all others          → opens external link
   ============================================ */

import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiZoomIn, FiMonitor } from 'react-icons/fi'

const PortfolioCard = memo(function PortfolioCard({
  title,
  category,
  image,
  pdf,
  link,
  description,
  index,
  onImageClick,
}) {
  /* Logo → image lightbox | Resume → PDF lightbox | Website → new tab */
  const isLightbox   = category === 'Logo' || category === 'Resume'
  const lightboxType = category === 'Resume' ? 'pdf' : 'image'
  const lightboxSrc  = category === 'Resume' ? pdf : image

  /* Intercept click and open popup for lightbox cards */
  const handleClick = useCallback(
    (e) => {
      if (isLightbox) {
        e.preventDefault()
        onImageClick?.(lightboxSrc, title, lightboxType)
      }
    },
    [isLightbox, lightboxSrc, title, lightboxType, onImageClick]
  )

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group block relative overflow-hidden rounded-lg glass-card cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      {/* Project thumbnail with lazy loading */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark overlay that reveals on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Action icon — monitor for website, zoom for logo, external for others */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-950 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {category === 'Logo'
            ? <FiZoomIn className="w-4 h-4 text-white" />
            : <FiExternalLink className="w-4 h-4 text-white" />
          }
        </div>

        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-mono-label uppercase rounded-full bg-gray-950 text-[#a5a8ff] border border-[#5B5FEF]/40">
          {category}
        </span>
      </div>

      {/* Text content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white font-display group-hover:text-[#a5a8ff] transition-colors">
            {title}
          </h3>
          <span className="font-mono-label text-xs text-[#FF6B35] shrink-0 ml-3">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.a>
  )
})

export default PortfolioCard
