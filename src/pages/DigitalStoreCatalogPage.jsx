import { useEffect, useState } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import ProductCard from '../components/digital-store/ProductCard'
import { fetchDigitalStoreTemplates } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

export default function DigitalStoreCatalogPage() {
  const [templates, setTemplates] = useState(null)
  const [error, setError] = useState(null)

  useSEO({
    title: 'Digital Store | McreatiK Studios',
    description: 'Ready-to-customize photography documents — fill in your details, preview instantly, and download.',
    path: '/digital_store',
  })

  useEffect(() => {
    let cancelled = false
    fetchDigitalStoreTemplates()
      .then((result) => {
        if (!cancelled) setTemplates(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <StudiosPageShell>
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-2">Digital Store</h1>
        <p className="text-gray-600 mb-10">Customizable documents, ready in minutes.</p>

        {error ? <p className="text-red-600">Something went wrong loading the catalog. Please try again shortly.</p> : null}
        {!templates && !error ? <p className="text-gray-500">Loading...</p> : null}
        {templates && templates.length === 0 ? <p className="text-gray-500">No products available right now.</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <ProductCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </StudiosPageShell>
  )
}
