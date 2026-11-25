import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImAudiences, ImCta, ImFaq, ImHero, ImPricing, ImProblems } from './Landing'
import { IM_FAQ, IM_PRICES, IM_PRICING_URL, IM_PROBLEMS } from '../../data/instantMemories'

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Instant Memories landing', () => {
  it('leads with the promise, a free-trial WhatsApp link and the story page', () => {
    inRouter(<ImHero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/every photo on every guest’s phone/i)
    expect(screen.getByRole('link', { name: /try your first wedding free/i }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/919952758545\?text=.*free/)
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute('href', '/instant-memories/how-it-works')
  })

  it('pairs every problem with its fix', () => {
    render(<ImProblems />)
    for (const row of IM_PROBLEMS) {
      expect(screen.getByText(row.problem)).toBeInTheDocument()
      expect(screen.getByText(row.fix)).toBeInTheDocument()
    }
  })

  it('switches features by audience, and tells guests they can share', () => {
    inRouter(<ImAudiences />)
    expect(screen.getByRole('tab', { name: 'For studios' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('tab', { name: 'For guests' }))
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/share/i)
    expect(panel.querySelector('img').getAttribute('src')).toMatch(/guest-viewer\.jpg$/)
  })

  it('shows every price and links to the full pricing page', () => {
    render(<ImPricing />)
    for (const { name, price } of IM_PRICES) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
      expect(screen.getByText(price)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /full pricing/i })).toHaveAttribute('href', IM_PRICING_URL)
  })

  it('switches FAQ questions by audience and opens answers', () => {
    render(<ImFaq />)
    expect(screen.getByText('Which cameras work?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Guests' }))
    expect(screen.queryByText('Which cameras work?')).not.toBeInTheDocument()
    const guestQs = IM_FAQ.filter((f) => f.tab === 'Guests')
    expect(screen.getByText(guestQs[0].answer)).toBeInTheDocument()
    fireEvent.click(screen.getByText(guestQs[1].question))
    expect(screen.getByText(guestQs[1].answer)).toBeInTheDocument()
  })

  it('closes with a free-trial link, the story page and email', () => {
    inRouter(<ImCta />)
    expect(screen.getByRole('link', { name: /try your first wedding free/i }).getAttribute('href')).toMatch(/wa\.me/)
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute('href', '/instant-memories/how-it-works')
    expect(screen.getByRole('link', { name: /connect@mcreatik\.com/i }).getAttribute('href')).toMatch(/^mailto:connect@mcreatik\.com/)
  })
})
