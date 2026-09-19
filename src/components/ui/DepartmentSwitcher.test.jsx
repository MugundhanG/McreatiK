import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DepartmentSwitcher from './DepartmentSwitcher'
import { DEPARTMENTS } from '../../utils/departments'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DepartmentSwitcher />
    </MemoryRouter>
  )
}

describe('DepartmentSwitcher', () => {
  it('renders a segment for every department in the shared DEPARTMENTS array', () => {
    renderAt('/tech')

    DEPARTMENTS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('marks the segment matching the current path as active, and no others', () => {
    renderAt('/studios/gallery')

    expect(screen.getByRole('link', { name: /studios/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /^tech$/i })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: /^store$/i })).not.toHaveAttribute('aria-current')
  })

  it('links each segment at its department path, including the newly-added Store', () => {
    renderAt('/tech')

    expect(screen.getByRole('link', { name: /^store$/i })).toHaveAttribute('href', '/store')
    expect(screen.getByRole('link', { name: /^studios$/i })).toHaveAttribute('href', '/studios')
  })

  it('omits the text label in compact mode but keeps the links', () => {
    render(
      <MemoryRouter initialEntries={['/tech']}>
        <DepartmentSwitcher compact />
      </MemoryRouter>
    )

    expect(screen.queryByText('Store')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(DEPARTMENTS.length)
  })
})
