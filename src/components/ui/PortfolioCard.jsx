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
  industry,
  features,
  image,
  pdf,
  link,
  description,
  challenge,
  result,
  index,
  large = false,
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
      className={`group block relative overflow-hidden rounded-lg glass-card cursor-pointer ${large ? 'lg:flex lg:items-stretch' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      {/* Project thumbnail with lazy loading */}
      <div className={`relative overflow-hidden ${large ? 'aspect-[3/2] lg:aspect-auto lg:w-3/5' : 'aspect-[3/2]'}`}>
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
      <div className={`p-6 ${large ? 'lg:w-2/5 lg:p-10 flex flex-col justify-center' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold text-white font-display group-hover:text-[#a5a8ff] transition-colors ${large ? 'text-2xl' : 'text-lg'}`}>
            {title}
          </h3>
          <span className="font-mono-label text-xs text-[#FF6B35] shrink-0 ml-3">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        {industry && (
          <p className="text-xs font-mono-label uppercase text-[#a5a8ff] mb-2">{industry}</p>
        )}
        <p className="text-sm text-gray-400 leading-relaxed mb-4">{description}</p>

        {(challenge || result) && (
          <div className="space-y-3 mb-4 border-l-2 border-[#5B5FEF]/30 pl-4">
            {challenge && (
              <div>
                <p className="font-mono-label text-[11px] uppercase text-[#FF6B35] mb-0.5">The Challenge</p>
                <p className="text-sm text-gray-400 leading-relaxed">{challenge}</p>
              </div>
            )}
            {result && (
              <div>
                <p className="font-mono-label text-[11px] uppercase text-[#FF6B35] mb-0.5">The Result</p>
                <p className="text-sm text-gray-400 leading-relaxed">{result}</p>
              </div>
            )}
          </div>
        )}

        {features?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feature) => (
              <span
                key={feature}
                className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Always-visible CTA — hover reveal alone can't be relied on for touch devices */}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a5a8ff] group-hover:text-[#FF6B35] transition-colors">
          {category === 'Logo' ? 'View Design' : 'View Project'}
          <FiExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  )
})

export default PortfolioCard
