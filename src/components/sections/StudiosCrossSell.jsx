/* ============================================
   StudiosCrossSell
   Compact promo strip pointing Tech visitors to
   McreatiK Studios — a client building a website
   often also needs product/team photography.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiCamera, FiArrowRight } from 'react-icons/fi'

const StudiosCrossSell = memo(function StudiosCrossSell() {
  return (
    <section className="relative py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
          <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border border-[#1E4FD9]/25 bg-[#1E4FD9]/[0.05] text-[#1E4FD9]">
            <FiCamera className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-stone-900 font-semibold font-display">Need photos for your new site?</h3>
            <p className="text-stone-600 text-sm mt-1">
              McreatiK Studios shoots product, team, and business photography to go with it.
            </p>
          </div>
          <Link
            to="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#1E4FD9] border border-[#1E4FD9]/40 hover:bg-[#1E4FD9]/5 hover:border-[#1E4FD9] transition-colors shrink-0"
          >
            Explore Studios <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
})

export default StudiosCrossSell
