import { motion } from 'framer-motion'
import { formatDigitalStorePrice } from '../../utils/digitalStoreApi'
import StoreCard from '../store/StoreCard'

/**
 * `requiresCustomization` comes from the product's own Category
 * (CategoryResponse.requiresCustomization), looked up by the caller (the catalog
 * page knows every category; a single card does not fetch its own) - it decides
 * the CTA copy so a buyer knows before they click whether they're about to fill in
 * a form or just add a ready-made item to their cart.
 *
 * `index` drives the catalog grid's stagger-reveal delay (see StoreCatalogPage.jsx)
 * - optional and defaulted so this component still renders correctly wherever it's
 * used standalone (or in tests) without a grid position to stagger against.
 */
export default function ProductCard({ product, requiresCustomization = false, index = 0 }) {
  const marketing = product.marketingContent || {}
  const ctaLabel = requiresCustomization ? 'Customize & Buy' : 'Add to Cart'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015 }}
    >
      <StoreCard to={`/store/products/${product.id}`} padding="none" className="block overflow-hidden">
        {marketing.thumbnailUrl ? (
          <img src={marketing.thumbnailUrl} alt={product.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-[var(--store-accent-soft)]" aria-hidden="true" />
        )}
        <div className="p-5">
          {marketing.category ? (
            <p data-testid="product-card-category" className="text-xs uppercase tracking-wide text-[var(--store-accent-text)] mb-1">
              {marketing.category}
            </p>
          ) : null}
          <h3 className="font-display text-lg font-semibold text-[#17151f]">{product.name}</h3>
          {marketing.shortDescription ? <p className="text-sm text-[#4b4a55] mt-1">{marketing.shortDescription}</p> : null}
          {marketing.keyHighlight ? (
            <span
              data-testid="product-card-highlight"
              className="inline-block mt-2 text-xs font-medium bg-[var(--store-accent-soft)] text-[var(--store-accent-text)] px-2 py-1 rounded"
            >
              {marketing.keyHighlight}
            </span>
          ) : null}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-[#17151f]">{formatDigitalStorePrice(product.currency, product.price)}</span>
            <span data-testid="product-card-cta" className="text-sm font-medium text-[var(--store-accent-text)]">
              {ctaLabel} →
            </span>
          </div>
        </div>
      </StoreCard>
    </motion.div>
  )
}
