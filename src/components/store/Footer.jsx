/* ============================================
   Footer Component — Store
   Minimal footer for the Store department, matching
   Tech/Studios' bottom-bar layout: wordmark + copyright +
   department switcher. Deliberately still minimal even
   with the catalog live - this department sells a small,
   flat product list, not enough distinct sections yet to
   warrant a Tech/Studios-style multi-column footer.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'

const StoreFooter = memo(function StoreFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#f3f1f9] border-t border-[#17151f]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display font-bold text-base text-[var(--store-accent-text)]">
                McreatiK
              </span>
              <span className="font-display font-semibold text-base text-[#17151f]">Digital Store</span>
            </Link>
            <span className="text-[#17151f]/50 text-sm">&copy; {year}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/store/refund-policy" className="text-sm text-[#17151f]/70 hover:text-[var(--store-accent-text)] transition-colors">
              Refund & Cancellation Policy
            </Link>
            <DepartmentSwitcher className="text-[#17151f]/70 bg-white/70" />
          </div>
        </div>
      </div>
    </footer>
  )
})

export default StoreFooter
