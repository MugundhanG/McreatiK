/* ============================================
   Portfolio Section
   Showcases completed projects in a responsive
   grid. Cards with category "Logo" open a
   Lightbox popup on click instead of navigating
   to an external link.
   ============================================ */

import React, { useState, useCallback, memo } from 'react'
import { PORTFOLIO_ITEMS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'
import PortfolioCard from '../ui/PortfolioCard'
import Lightbox from '../ui/Lightbox'

const Portfolio = memo(function Portfolio() {
  /* Track which image is open in the lightbox (null = closed) */
  const [lightbox, setLightbox] = useState(null) // { image, title }

  const openLightbox = useCallback((image, title) => {
    setLightbox({ image, title })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Work"
          title="Featured Projects"
          subtitle="A selection of projects that showcase our commitment to quality, creativity, and results."
        />

        {/* Portfolio grid — 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <PortfolioCard
              key={item.id}
              {...item}
              index={index}
              /* Pass lightbox opener — PortfolioCard uses it when category is Logo */
              onImageClick={openLightbox}
            />
          ))}
        </div>
      </div>

      {/* Lightbox popup */}
      {lightbox && (
        <Lightbox
          image={lightbox.image}
          title={lightbox.title}
          onClose={closeLightbox}
        />
      )}
    </section>
  )
})

export default Portfolio
