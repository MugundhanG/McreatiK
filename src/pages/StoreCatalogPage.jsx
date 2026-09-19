import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StorePageShell from '../components/layout/StorePageShell'
import ProductCard from '../components/digital-store/ProductCard'
import StoreSectionHeading from '../components/store/StoreSectionHeading'
import { fetchDigitalStoreCategories, fetchDigitalStoreProducts } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

const ALL_CATEGORIES_FILTER = 'all'

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
        <div key={i} className="card-store overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-black/5" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-black/5 rounded w-2/3" />
            <div className="h-3 bg-black/5 rounded w-1/2" />
            <div className="h-6 bg-black/5 rounded w-1/3 mt-4" />
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
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        <StoreSectionHeading
          eyebrow="Digital Store"
          title="Ready-made and customizable digital products"
          subtitle="Fill in your details, preview instantly, and download — ready in minutes."
          align="left"
        />

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
