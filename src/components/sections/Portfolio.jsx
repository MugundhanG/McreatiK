/* ============================================
   Portfolio Section
   Showcases completed projects in a responsive
   grid. Cards with category "Logo" open a
   Lightbox popup on click instead of navigating
   to an external link.
   ============================================ */

import React, { useState, useCallback, memo } from 'react'
import { TECH_PORTFOLIO_ITEMS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import PortfolioCard from '../ui/PortfolioCard'
import Lightbox from '../ui/Lightbox'

const Portfolio = memo(function Portfolio() {
  /* Track which image is open in the lightbox (null = closed) */
  const [lightbox, setLightbox] = useState(null) // { src, title, type }

  const openLightbox = useCallback((src, title, type = 'image') => {
    setLightbox({ src, title, type })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 bg-stone-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Work"
          title="Featured Projects"
          subtitle="A selection of projects that showcase our commitment to quality, creativity, and results."
        />

        {/* Asymmetric layout — lead case study full-width, the rest side by side */}
        <div className="flex flex-col gap-6">
          {TECH_PORTFOLIO_ITEMS[0] && (
            <PortfolioCard
              {...TECH_PORTFOLIO_ITEMS[0]}
              index={0}
              large
              onImageClick={openLightbox}
            />
          )}
          {TECH_PORTFOLIO_ITEMS.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TECH_PORTFOLIO_ITEMS.slice(1).map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  {...item}
                  index={index + 1}
                  onImageClick={openLightbox}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox popup */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          title={lightbox.title}
          type={lightbox.type}
          onClose={closeLightbox}
        />
      )}
    </section>
  )
})

export default Portfolio
