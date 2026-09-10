import { Link } from 'react-router-dom'
import { formatDigitalStorePrice } from '../../utils/digitalStoreApi'

export default function ProductCard({ template }) {
  const marketing = template.marketingContent || {}

  return (
    <Link
      to={`/digital_store/${template.id}`}
      className="block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {marketing.thumbnailUrl ? (
        <img src={marketing.thumbnailUrl} alt={template.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100" aria-hidden="true" />
      )}
      <div className="p-5">
        {marketing.category ? (
          <p data-testid="product-card-category" className="text-xs uppercase tracking-wide text-[#C9971F] mb-1">
            {marketing.category}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold">{template.name}</h3>
        {marketing.shortDescription ? <p className="text-sm text-gray-600 mt-1">{marketing.shortDescription}</p> : null}
        {marketing.keyHighlight ? (
          <span data-testid="product-card-highlight" className="inline-block mt-2 text-xs font-medium bg-[#C9971F]/10 text-[#C9971F] px-2 py-1 rounded">
            {marketing.keyHighlight}
          </span>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">{formatDigitalStorePrice(template.currency, template.price)}</span>
          <span className="text-sm font-medium text-[#C9971F]">View & Customize →</span>
        </div>
      </div>
    </Link>
  )
}
