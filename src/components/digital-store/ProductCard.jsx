import { Link } from 'react-router-dom'
import { formatDigitalStorePrice } from '../../utils/digitalStoreApi'

/**
 * `requiresCustomization` comes from the product's own Category
 * (CategoryResponse.requiresCustomization), looked up by the caller (the catalog
 * page knows every category; a single card does not fetch its own) - it decides
 * the CTA copy so a buyer knows before they click whether they're about to fill in
 * a form or just add a ready-made item to their cart.
 */
export default function ProductCard({ product, requiresCustomization = false }) {
  const marketing = product.marketingContent || {}
  const ctaLabel = requiresCustomization ? 'Customize & Buy' : 'Add to Cart'

  return (
    <Link
      to={`/store/products/${product.id}`}
      className="block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {marketing.thumbnailUrl ? (
        <img src={marketing.thumbnailUrl} alt={product.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100" aria-hidden="true" />
      )}
      <div className="p-5">
        {marketing.category ? (
          <p data-testid="product-card-category" className="text-xs uppercase tracking-wide text-[#8B7FE8] mb-1">
            {marketing.category}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {marketing.shortDescription ? <p className="text-sm text-gray-600 mt-1">{marketing.shortDescription}</p> : null}
        {marketing.keyHighlight ? (
          <span data-testid="product-card-highlight" className="inline-block mt-2 text-xs font-medium bg-[#8B7FE8]/10 text-[#8B7FE8] px-2 py-1 rounded">
            {marketing.keyHighlight}
          </span>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">{formatDigitalStorePrice(product.currency, product.price)}</span>
          <span data-testid="product-card-cta" className="text-sm font-medium text-[#8B7FE8]">
            {ctaLabel} →
          </span>
        </div>
      </div>
    </Link>
  )
}
