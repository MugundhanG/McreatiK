import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

function renderCard(template) {
  render(
    <MemoryRouter>
      <ProductCard template={template} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders name, price, and currency, which are always present', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText(/99/)).toBeInTheDocument()
    expect(screen.getByText(/INR/)).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/digital_store/t1')
  })

  it('renders no optional marketing content when marketingContent is null', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.queryByTestId('product-card-category')).not.toBeInTheDocument()
    expect(screen.queryByTestId('product-card-highlight')).not.toBeInTheDocument()
  })

  it('renders optional marketing content when present', () => {
    renderCard({
      id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR',
      marketingContent: { shortDescription: 'A lovely agreement.', category: 'Agreements', keyHighlight: 'Ready in minutes' },
    })

    expect(screen.getByText('A lovely agreement.')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-category')).toHaveTextContent('Agreements')
    expect(screen.getByTestId('product-card-highlight')).toHaveTextContent('Ready in minutes')
  })
})
