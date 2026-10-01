import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StorePageShell from '../components/layout/StorePageShell'
import ProductCard from '../components/digital-store/ProductCard'
import StoreSectionHeading from '../components/store/StoreSectionHeading'
import { fetchDigitalStoreCategories, fetchDigitalStoreProducts } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

const ALL_CATEGORIES_FILTER = 'all'
const EASE = [0.22, 1, 0.36, 1]
const STEPS = ['Pick a product', 'Fill in your details', 'Preview instantly', 'Download']

/* The store's promise as a strip of numbered steps that rise in one by one,
   joined by a rule that draws across behind them. */
function StepsStrip() {
  return (
    <ol className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <motion.span
        aria-hidden="true"
        className="absolute left-4 right-4 top-4 hidden h-px origin-left bg-[var(--store-accent)]/30 sm:block"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
      />
      {STEPS.map((step, i) => (
        <motion.li
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 + i * 0.12, ease: EASE }}
          className="relative flex items-center gap-2.5 sm:flex-col sm:items-start"
        >
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--store-accent)]/40 bg-[#f8f7fb] font-mono-label text-xs text-[var(--store-accent-text)]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-[#17151f]">{step}</span>
        </motion.li>
      ))}
    </ol>
  )
}

function FilterPill({ label, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        isActive ? 'text-white border-transparent' : 'bg-white text-[#4b4a55] border-black/10 hover:border-[var(--store-accent)]'
      }`}
    >
      {isActive ? (
        <motion.span
          layoutId="catalog-filter-pill"
          className="absolute inset-0 bg-[var(--store-accent)] rounded-full"
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
      ) : null}
      <span className="relative z-10">{label}</span>
    </button>
  )
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-store overflow-hidden">
          <div className="w-full h-48 shimmer" />
          <div className="p-5 space-y-3">
            <div className="h-4 shimmer rounded w-2/3" />
            <div className="h-3 shimmer rounded w-1/2" />
            <div className="h-6 shimmer rounded w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StoreCatalogPage() {
  const [categories, setCategories] = useState(null)
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORIES_FILTER)

  useSEO({
    title: 'Digital Store | McreatiK',
    description: 'Ready-to-buy and ready-to-customize digital products — fill in your details, preview instantly, and download.',
    path: '/store',
  })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchDigitalStoreCategories(), fetchDigitalStoreProducts()])
      .then(([categoriesResult, productsResult]) => {
        if (!cancelled) {
          setCategories(categoriesResult)
          setProducts(productsResult)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Every product carries only categoryId (ProductResponse) - requiresCustomization
  // lives on Category, so this lookup is what lets ProductCard show the right CTA
  // copy without each card fetching its own category.
  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]))
  const visibleProducts = (products ?? []).filter(
    (product) => selectedCategoryId === ALL_CATEGORIES_FILTER || product.categoryId === selectedCategoryId
  )
  const isLoading = !products && !categories && !error

  return (
    <StorePageShell>
      <div className="relative isolate max-w-5xl mx-auto px-4 pt-28 pb-20">
        {/* Ambient accent glow — the store's one decorative touch */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-0 -z-10 h-72 w-72 rounded-full bg-[var(--store-accent)]/20 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute top-40 -left-20 -z-10 h-56 w-56 rounded-full bg-[#F0B37E]/15 blur-[90px]" />
        <StoreSectionHeading
          eyebrow="Digital Store"
          title="Ready-made and customizable digital products"
          subtitle="Fill in your details, preview instantly, and download — ready in minutes."
          align="left"
        />
        <StepsStrip />

        {error ? <p className="mt-8 text-red-600">Something went wrong loading the catalog. Please try again shortly.</p> : null}

        {isLoading ? <div className="mt-10"><CatalogSkeleton /></div> : null}

        {categories?.length ? (
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 mt-10 mb-8">
            <FilterPill
              id={ALL_CATEGORIES_FILTER}
              label="All"
              isActive={selectedCategoryId === ALL_CATEGORIES_FILTER}
              onSelect={() => setSelectedCategoryId(ALL_CATEGORIES_FILTER)}
            />
            {categories.map((category) => (
              <FilterPill
                key={category.id}
                id={category.id}
                label={category.name}
                isActive={selectedCategoryId === category.id}
                onSelect={() => setSelectedCategoryId(category.id)}
              />
            ))}
          </div>
        ) : null}

        {products && visibleProducts.length === 0 ? (
          <p className="mt-10 text-[#4b4a55]">No products available right now.</p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              requiresCustomization={categoryById.get(product.categoryId)?.requiresCustomization ?? false}
            />
          ))}
        </div>
      </div>
    </StorePageShell>
  )
}
