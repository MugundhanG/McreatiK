import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StoreCatalogPage from './StoreCatalogPage'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import * as api from '../utils/digitalStoreApi'

const CATEGORY_AGREEMENTS = {
  id: 1,
  name: 'Agreements',
  slug: 'agreements',
  description: null,
  requiresCustomization: true,
  sortOrder: 0,
  status: 'PUBLISHED',
}

const CATEGORY_TEMPLATES = {
  id: 2,
  name: 'Templates',
  slug: 'templates',
  description: null,
  requiresCustomization: false,
  sortOrder: 1,
  status: 'PUBLISHED',
}

const PRODUCT_AGREEMENT = {
  id: 'p1',
  name: 'Wedding Photography Agreement',
  categoryId: 1,
  productType: 'AGREEMENT_DOCUMENT',
  price: 99.0,
  currency: 'INR',
  fieldSchema: { fields: [] },
  marketingContent: null,
}

const PRODUCT_TEMPLATE = {
  id: 'p2',
  name: 'Social Media Template Pack',
  categoryId: 2,
  productType: 'STATIC_ASSET',
  price: 49.0,
  currency: 'INR',
  fieldSchema: null,
  marketingContent: null,
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <StoreCatalogPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  // StorePageShell renders StoreNavbar, which reads useAuth() and useCart() -
  // AuthProvider's mount-time refresh() call needs a fetch mock (this page's
  // own auth state isn't under test here, only that the shell renders without
  // crashing). Signed-out means CartProvider never calls the cart endpoint, so
  // the same 401 stub covers both.
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'no session' }) })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('StoreCatalogPage', () => {
  it('renders every product with the CTA copy matching its own category', async () => {
    vi.spyOn(api, 'fetchDigitalStoreCategories').mockResolvedValue([CATEGORY_AGREEMENTS, CATEGORY_TEMPLATES])
    vi.spyOn(api, 'fetchDigitalStoreProducts').mockResolvedValue([PRODUCT_AGREEMENT, PRODUCT_TEMPLATE])
    renderPage()

    expect(await screen.findByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()

    const ctas = screen.getAllByTestId('product-card-cta')
    expect(ctas.some((el) => el.textContent.includes('Customize & Buy'))).toBe(true)
    expect(ctas.some((el) => el.textContent.includes('Add to Cart'))).toBe(true)
  })

  it('filters the product grid by the selected category', async () => {
    vi.spyOn(api, 'fetchDigitalStoreCategories').mockResolvedValue([CATEGORY_AGREEMENTS, CATEGORY_TEMPLATES])
    vi.spyOn(api, 'fetchDigitalStoreProducts').mockResolvedValue([PRODUCT_AGREEMENT, PRODUCT_TEMPLATE])
    renderPage()

    await screen.findByText('Wedding Photography Agreement')

    fireEvent.click(screen.getByRole('button', { name: 'Templates' }))

    expect(screen.queryByText('Wedding Photography Agreement')).not.toBeInTheDocument()
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()
  })

  it('shows every product again after switching back to "All"', async () => {
    vi.spyOn(api, 'fetchDigitalStoreCategories').mockResolvedValue([CATEGORY_AGREEMENTS, CATEGORY_TEMPLATES])
    vi.spyOn(api, 'fetchDigitalStoreProducts').mockResolvedValue([PRODUCT_AGREEMENT, PRODUCT_TEMPLATE])
    renderPage()

    await screen.findByText('Wedding Photography Agreement')
    fireEvent.click(screen.getByRole('button', { name: 'Templates' }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    await waitFor(() => expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument())
    expect(screen.getByText('Social Media Template Pack')).toBeInTheDocument()
  })

  it('shows an empty-state message when the catalog has no products', async () => {
    vi.spyOn(api, 'fetchDigitalStoreCategories').mockResolvedValue([])
    vi.spyOn(api, 'fetchDigitalStoreProducts').mockResolvedValue([])
    renderPage()

    expect(await screen.findByText(/no products available/i)).toBeInTheDocument()
  })

  it('shows an error message when the catalog fails to load', async () => {
    vi.spyOn(api, 'fetchDigitalStoreCategories').mockRejectedValue(new Error('boom'))
    vi.spyOn(api, 'fetchDigitalStoreProducts').mockResolvedValue([])
    renderPage()

    expect(await screen.findByText(/something went wrong loading the catalog/i)).toBeInTheDocument()
  })
})
