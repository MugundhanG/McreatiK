/* ============================================
   Navbar Component — Store
   Minimal bar for the Store department: wordmark +
   department switcher, in the same frame language as
   Tech/Studios' bars. The "Soon" tag is gone now that
   /store is the real catalog (Task 12) rather than a
   placeholder. Still no extra nav links/sections (no
   cart/checkout yet - Tasks 13/14). Shows sign-in
   state (Task 10): a Log In link when signed out, or
   the customer's name + Log Out when signed in.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import { useAuth } from '../../context/AuthContext'

const StoreNavbar = memo(function StoreNavbar() {
  const { customer, loading, logout } = useAuth()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 border-b border-[#17151f]/10 bg-[#f8f7fb]/90 backdrop-blur-xl"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="shrink-0 inline-flex items-center gap-2">
          <span className="font-display font-bold text-lg" style={{ color: '#8B7FE8' }}>
            McreatiK
          </span>
          <span className="font-display font-semibold text-lg text-[#17151f]">Digital Store</span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && (
            customer ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden sm:inline text-[#17151f]/70">Hi, {customer.name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="font-semibold hover:underline"
                  style={{ color: '#8B7FE8' }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/store/login" className="text-sm font-semibold hover:underline" style={{ color: '#8B7FE8' }}>
                Log In
              </Link>
            )
          )}
          <DepartmentSwitcher className="text-[#17151f]/70 bg-white/70" />
        </div>
      </div>
    </motion.header>
  )
})

export default StoreNavbar
