/* ============================================
   TechDemosTeaser Section
   Three featured "Website Concepts" (dental,
   interior, photography) shown on the main Tech
   page, with a link through to the full showcase
   at /tech/demos.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import DemoConceptCard from '../ui/DemoConceptCard'
import SectionHeading from '../ui/SectionHeading'
import SectionDivider from '../ui/SectionDivider'
import { DEMO_CONCEPTS, DEMO_INDUSTRIES } from '../../data/demoConcepts'

const FEATURED_SLUGS = ['dental-smile-studio', 'interior-aalaya', 'photo-kadhai']
const FEATURED_CONCEPTS = FEATURED_SLUGS
  .map((slug) => DEMO_CONCEPTS.find((c) => c.slug === slug))
  .filter(Boolean)

const INDUSTRY_LABELS = DEMO_INDUSTRIES.map((ind) => ind.label)
const INDUSTRY_LIST_COPY =
  INDUSTRY_LABELS.length < 2
    ? INDUSTRY_LABELS.join('')
    : `${INDUSTRY_LABELS.slice(0, -1).join(', ')} and ${INDUSTRY_LABELS[INDUSTRY_LABELS.length - 1]}`

const TechDemosTeaser = memo(function TechDemosTeaser() {
  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionDivider label="§ Concepts" />
        <SectionHeading
          label="Website Concepts"
          title="See it built for your industry"
          subtitle={`${DEMO_CONCEPTS.length} fully-built concepts across ${INDUSTRY_LIST_COPY} — browse one close to your business.`}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURED_CONCEPTS.map((concept) => (
            <DemoConceptCard key={concept.slug} concept={concept} compact />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/tech/demos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E4FD9] hover:text-[#1840b8] transition-colors"
          >
            Browse all {DEMO_CONCEPTS.length} concepts <FiArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
})

export default TechDemosTeaser
