import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductHero, ProductStorySections, ProductFAQSection, ProductTrustSection } from './ProductMarketingSections'

describe('ProductHero', () => {
  it('renders the template name and price', () => {
    render(<ProductHero template={{ name: 'Wedding Photography Agreement', price: 99, currency: 'INR' }} onGetStarted={() => {}} />)

    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText(/99/)).toBeInTheDocument()
  })
})

describe('ProductStorySections', () => {
  it('renders nothing extra when marketingContent is null', () => {
    const { container } = render(<ProductStorySections marketingContent={null} />)

    expect(container.querySelectorAll('section')).toHaveLength(0)
  })

  it('renders only the sections whose content is present', () => {
    render(
      <ProductStorySections
        marketingContent={{
          description: 'A full description.',
          benefits: ['Fast', 'Editable'],
        }}
      />
    )

    expect(screen.getByText('A full description.')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Editable')).toBeInTheDocument()
    expect(screen.queryByText(/what's included/i)).not.toBeInTheDocument()
  })

  it('renders whatsIncluded and howItWorks when present', () => {
    render(
      <ProductStorySections
        marketingContent={{
          whatsIncluded: ['1-page PDF'],
          howItWorks: ['Fill in your details', 'Preview', 'Pay and download'],
        }}
      />
    )

    expect(screen.getByText(/what's included/i)).toBeInTheDocument()
    expect(screen.getByText('1-page PDF')).toBeInTheDocument()
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
    expect(screen.getByText('Fill in your details')).toBeInTheDocument()
  })
})

describe('ProductFAQSection', () => {
  it('renders nothing when faq is absent', () => {
    const { container } = render(<ProductFAQSection faq={undefined} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders each question and answer when present', () => {
    render(<ProductFAQSection faq={[{ question: 'Can I edit it later?', answer: 'Yes, anytime.' }]} />)

    expect(screen.getByText('Can I edit it later?')).toBeInTheDocument()
    expect(screen.getByText('Yes, anytime.')).toBeInTheDocument()
  })
})

describe('ProductTrustSection', () => {
  it('always mentions secure payment, preview before purchase, and digital delivery', () => {
    render(<ProductTrustSection oneTimePurchase={true} />)

    expect(screen.getByText(/secure/i)).toBeInTheDocument()
    expect(screen.getByText(/preview/i)).toBeInTheDocument()
    expect(screen.getByText(/digital delivery|instant/i)).toBeInTheDocument()
  })

  it('renders a support link', () => {
    render(<ProductTrustSection oneTimePurchase={true} />)

    const link = screen.getByRole('link', { name: /contact|support|help/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me'))
  })
})
