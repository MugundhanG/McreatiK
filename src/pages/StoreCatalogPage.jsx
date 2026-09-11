import { useEffect, useState } from 'react'
import StorePageShell from '../components/layout/StorePageShell'
import ProductCard from '../components/digital-store/ProductCard'
import { fetchDigitalStoreCategories, fetchDigitalStoreProducts } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

const ALL_CATEGORIES_FILTER = 'all'

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
        <h1 className="text-3xl font-bold mb-2">Digital Store</h1>
        <p className="text-gray-600 mb-10">Ready-made and customizable digital products, ready in minutes.</p>

        {error ? <p className="text-red-600">Something went wrong loading the catalog. Please try again shortly.</p> : null}
        {isLoading ? <p className="text-gray-500">Loading...</p> : null}

        {categories?.length ? (
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(ALL_CATEGORIES_FILTER)}
              aria-pressed={selectedCategoryId === ALL_CATEGORIES_FILTER}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategoryId === ALL_CATEGORIES_FILTER
                  ? 'bg-[#8B7FE8] text-white border-[#8B7FE8]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#8B7FE8]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                aria-pressed={selectedCategoryId === category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategoryId === category.id
                    ? 'bg-[#8B7FE8] text-white border-[#8B7FE8]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#8B7FE8]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}

        {products && visibleProducts.length === 0 ? <p className="text-gray-500">No products available right now.</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              requiresCustomization={categoryById.get(product.categoryId)?.requiresCustomization ?? false}
            />
          ))}
        </div>
      </div>
    </StorePageShell>
  )
}
