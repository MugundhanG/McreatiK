import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InstantMemoriesHero, InstantMemoriesCTA, InstantMemoriesForCouples, InstantMemoriesForGuests } from './Sections'
import InstantMemoriesFAQ from './FAQ'
import { IM_FAQ } from '../../../data/instantMemories'

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Instant Memories page', () => {
  it('leads with the product name and a WhatsApp demo link', () => {
    inRouter(<InstantMemoriesHero />)
    expect(screen.getByRole('heading', { level: 1, name: 'Instant Memories' })).toBeInTheDocument()
    const demo = screen.getByRole('link', { name: /book a demo/i })
    expect(demo.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/919952758545\?text=.*demo/)
    expect(screen.getByRole('link', { name: /getting married/i }).getAttribute('href')).toMatch(/wa\.me/)
  })

  it('offers WhatsApp and email in the closing call to action', () => {
    inRouter(<InstantMemoriesCTA />)
    expect(screen.getByRole('link', { name: /whatsapp for a demo/i }).getAttribute('href')).toMatch(/wa\.me/)
    expect(screen.getByRole('link', { name: /connect@mcreatik\.com/i }).getAttribute('href')).toMatch(/^mailto:connect@mcreatik\.com/)
  })

  it('switches FAQ questions by audience and opens answers', () => {
    render(<InstantMemoriesFAQ />)
    expect(screen.getByText('Which cameras work?')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Guests' }))
    expect(screen.queryByText('Which cameras work?')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Guests' })).toHaveAttribute('aria-selected', 'true')
    const guestQs = IM_FAQ.filter((f) => f.tab === 'Guests')
    expect(screen.getAllByRole('button', { expanded: false }).length + 1).toBeGreaterThanOrEqual(guestQs.length)
    // first answer open by default
    expect(screen.getByText(guestQs[0].answer)).toBeInTheDocument()

    fireEvent.click(screen.getByText(guestQs[1].question))
    expect(screen.getByText(guestQs[1].answer)).toBeInTheDocument()
  })

  it('gives couples and guests their own sections, and tells guests they can share', () => {
    render(<><InstantMemoriesForCouples /><InstantMemoriesForGuests /></>)
    expect(screen.getByRole('heading', { level: 2, name: 'Your photos, your way' })).toBeInTheDocument()
    const guests = document.getElementById('for-guests')
    expect(guests).toHaveTextContent('Scan, watch, keep')
    expect(guests.querySelector('img').getAttribute('src')).toMatch(/guest-viewer\.jpg$/)
    // Guests can share photos again; the page says the gallery link itself is never shared.
    expect(guests.textContent).toMatch(/share them straight to WhatsApp/i)
  })
})
