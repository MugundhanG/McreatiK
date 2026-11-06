import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudiosInstantMemoriesHowItWorksPage from '../../../../pages/StudiosInstantMemoriesHowItWorksPage'
import { STORY_ACTS, STORY_MOMENTS, STORY_ROLES } from '../../../../data/instantMemoriesStory'

const chapters = STORY_ACTS.flatMap((act) => act.chapters)

describe('Instant Memories story page', () => {
  it('gives every chapter a role and an illustration, with no personal names', () => {
    for (const c of chapters) {
      expect(STORY_ROLES[c.who]).toBeTruthy()
      expect(`${c.title.join(' ')} ${c.body}`).not.toMatch(/Karthik|Divya|\bshe\b|\bher\b/i)
      expect(c.mock).toBeTruthy()
    }
  })

  it('renders the hero, every act and every chapter, numbered in order', () => {
    render(<MemoryRouter><StudiosInstantMemoriesHowItWorksPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/from initial setup to album selection/i)
    for (const act of STORY_ACTS) {
      expect(screen.getByRole('heading', { level: 2, name: act.title })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(chapters.length)
    expect(screen.getByText(`01 / ${chapters.length}`)).toBeInTheDocument()
    expect(screen.getByText(`${chapters.length} / ${chapters.length}`)).toBeInTheDocument()
    expect(STORY_MOMENTS).toHaveLength(5)
    for (const m of STORY_MOMENTS) expect(screen.getByRole('heading', { level: 3, name: m.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to instant memories/i })).toHaveAttribute('href', '/studios/instant-memories')
  })
})
