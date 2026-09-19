import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Hello() {
  return <div>hello digital store</div>
}

describe('test harness', () => {
  it('renders a component and finds it via Testing Library + jest-dom matchers', () => {
    render(<Hello />)
    expect(screen.getByText('hello digital store')).toBeInTheDocument()
  })
})
