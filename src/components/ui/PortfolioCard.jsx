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
import { FiExternalLink, FiZoomIn } from 'react-icons/fi'

const PortfolioCard = memo(function PortfolioCard({
  title,
  category,
  image,
  link,
  description,
  index,
  onImageClick,
}) {
  const isLightbox = category === 'Logo'

  /* For lightbox cards, intercept click and open popup */
  const handleClick = useCallback(
    (e) => {
      if (isLightbox) {
        e.preventDefault()
        onImageClick?.(image, title)
      }
    },
    [isLightbox, image, title, onImageClick]
  )

  return (
    <motion.a
      href={isLightbox ? '#' : link}
      target={isLightbox ? undefined : '_blank'}
      rel={isLightbox ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      className="group block relative overflow-hidden rounded-2xl glass-card cursor-pointer"
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

        {/* Action icon — zoom for lightbox, external link for others */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {isLightbox
            ? <FiZoomIn className="w-4 h-4 text-white" />
            : <FiExternalLink className="w-4 h-4 text-white" />
          }
        </div>

        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Text content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 font-display group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.a>
  )
})

export default PortfolioCard
