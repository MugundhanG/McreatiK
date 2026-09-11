/* ============================================
   Navbar Component — Store
   Minimal placeholder bar for the Store department:
   wordmark + department switcher + a "Soon" tag,
   in the same frame language as Tech/Studios' bars.
   No catalog nav links yet — there are no catalog
   sections to point to until the Store's actual
   pages are built. Does show sign-in state (Task 10):
   a Log In link when signed out, or the customer's
   name + Log Out when signed in — the only real,
   working links this bar has right now.
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
          <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wide text-[#17151f]/50 border border-[#17151f]/15 rounded-full px-1.5 py-0.5">
            Soon
          </span>
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
