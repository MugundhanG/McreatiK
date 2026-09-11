/* ============================================
   StorePage — McreatiK Digital Store
   Placeholder landing for the Store department —
   the catalog, products, and cart/checkout flow are
   later tasks. This just gives /store a real,
   honest page instead of a dead link.
   ============================================ */

import React from 'react'
import { FiPackage } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import { useSEO } from '../hooks/useSEO'

function StorePage() {
  useSEO({
    title: 'McreatiK Digital Store | Coming Soon',
    description: 'Digital products, templates and creative resources from McreatiK — launching soon.',
    path: '/store',
  })

  return (
    <StorePageShell>
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <span
          className="flex items-center justify-center w-14 h-14 rounded-lg border mb-6"
          style={{ borderColor: '#8B7FE8', color: '#8B7FE8', backgroundColor: '#8B7FE81a' }}
        >
          <FiPackage className="w-6 h-6" />
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: '#8B7FE8' }}>
          Coming Soon
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">McreatiK Digital Store</h1>
        <p className="text-[#17151f]/70 max-w-md leading-relaxed">
          Digital products, templates and creative resources to help you create, launch and grow — we're building
          the catalog now.
        </p>
      </section>
    </StorePageShell>
  )
}

export default StorePage
