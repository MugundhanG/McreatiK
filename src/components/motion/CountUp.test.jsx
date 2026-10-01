import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountUp from './CountUp'

describe('CountUp', () => {
  it('exposes the real value to assistive tech from the first render', () => {
    render(<CountUp value={37} />)
    expect(screen.getByLabelText('37')).toBeInTheDocument()
  })

  it('always lands on the real value, even when started on mount', async () => {
    render(<CountUp value={37} onMount duration={0.2} />)
    expect(await screen.findByText('37', {}, { timeout: 2000 })).toBeInTheDocument()
  })
})
