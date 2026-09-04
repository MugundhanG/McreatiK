/* ============================================
   ExploreMcreatik Section
   The three areas of the ecosystem, each as a
   photo-backed card tinted with its own accent —
   Tech and Studios use their real hero photos;
   Store (not built yet) gets an abstract gradient
   instead of a fabricated product screenshot.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { HOME_EXPLORE_AREAS } from '../../utils/constants'
import SectionHeading from './SectionHeading'
import techPhoto from '../../assets/tech-hero-photo.webp'
import studiosPhoto from '../../assets/studios-hero-photo.webp'

const CARD_PHOTOS = {
  tech: techPhoto,
  studios: studiosPhoto,
}

const ExploreMcreatik = memo(function ExploreMcreatik() {
  return (
    <section id="explore" className="relative py-24 lg:py-32">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Explore Our Businesses"
          title="Three ways we help you grow"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {HOME_EXPLORE_AREAS.map(({ key, icon: Icon, name, longDescription, cta, href, accent, comingSoon }, index) => {
            const photo = CARD_PHOTOS[key]
            return (
              <motion.div
                key={key}
                className="relative rounded-lg overflow-hidden h-80 flex flex-col justify-end p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {photo && (
                  <img src={photo} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background: photo
                      ? `linear-gradient(160deg, ${accent}b3 0%, ${accent}4d 35%, #0A1128f2 85%)`
                      : `linear-gradient(160deg, ${accent}66 0%, #0A1128 75%)`,
                  }}
                />

                <span
                  className="relative z-10 flex items-center justify-center w-12 h-12 rounded-lg border mb-auto"
                  style={{ borderColor: accent, color: '#fff', backgroundColor: `${accent}40` }}
                >
                  <Icon className="w-5 h-5" />
                </span>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold font-display text-white mb-2">{name}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed mb-4 max-w-xs">{longDescription}</p>

                  {comingSoon ? (
                    <span className="text-sm font-semibold" style={{ color: accent }}>
                      {cta}
                    </span>
                  ) : (
                    <Link
                      to={href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: accent }}
                    >
                      <span className="underline underline-offset-4">{cta}</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default ExploreMcreatik
