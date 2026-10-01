import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PackageFinder, { recommendTier } from './PackageFinder'

describe('recommendTier', () => {
  it('returns null before anything is picked', () => {
    expect(recommendTier({})).toBeNull()
  })

  it('returns the highest tier any answer needs', () => {
    expect(recommendTier({ pages: 0, goal: 2, features: 1 })).toBe(2)
    expect(recommendTier({ pages: 1 })).toBe(1)
  })
})

describe('PackageFinder', () => {
  it('shows the recommended package with its real price and reports it', async () => {
    const onRecommend = vi.fn()
    render(<PackageFinder onRecommend={onRecommend} />)

    await userEvent.click(screen.getByRole('button', { name: 'Up to 5 pages' }))
    expect(screen.getByText(/₹25,000/)).toBeInTheDocument()
    expect(onRecommend).toHaveBeenLastCalledWith('Starter')

    await userEvent.click(screen.getByRole('button', { name: 'Bring in more enquiries' }))
    expect(await screen.findByText(/₹50,000/)).toBeInTheDocument()
    expect(onRecommend).toHaveBeenLastCalledWith('Professional')
  })

  it('pre-fills the WhatsApp message with the answers', async () => {
    render(<PackageFinder />)
    await userEvent.click(screen.getByRole('button', { name: 'Up to 15 pages' }))
    const link = screen.getByRole('link', { name: /Discuss this on WhatsApp/ })
    const text = decodeURIComponent(link.getAttribute('href'))
    expect(text).toContain('Premium package (₹75,000)')
    expect(text).toContain('Up to 15 pages')
  })

  it('start over clears the recommendation', async () => {
    const onRecommend = vi.fn()
    render(<PackageFinder onRecommend={onRecommend} />)
    await userEvent.click(screen.getByRole('button', { name: 'Up to 5 pages' }))
    await userEvent.click(screen.getByRole('button', { name: /Start over/ }))
    expect(onRecommend).toHaveBeenLastCalledWith(null)
  })
})
