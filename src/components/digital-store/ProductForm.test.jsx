import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductForm from './ProductForm'

const FIELD_SCHEMA = {
  fields: [
    { name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 },
    { name: 'clientEmail', type: 'email', label: 'Email', required: true, maxLength: 254 },
    { name: 'weddingDate', type: 'date', label: 'Wedding Date', required: true },
    { name: 'hoursCovered', type: 'number', label: 'Hours Covered', required: true },
    { name: 'notes', type: 'string', label: 'Notes', required: false, maxLength: 500 },
  ],
}

function renderForm(overrides = {}) {
  const onChange = vi.fn()
  render(
    <ProductForm
      fieldSchema={FIELD_SCHEMA}
      values={{}}
      onChange={onChange}
      serverErrors={{}}
      {...overrides}
    />
  )
  return { onChange }
}

describe('ProductForm', () => {
  it('renders the correct input type for each field', () => {
    renderForm()

    expect(screen.getByLabelText("Bride's Name *")).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Email *')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Wedding Date *')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Hours Covered *')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText('Notes')).toHaveAttribute('type', 'text')
  })

  it('applies maxLength from the schema', () => {
    renderForm()

    expect(screen.getByLabelText("Bride's Name *")).toHaveAttribute('maxLength', '100')
  })

  it('calls onChange with the raw string value for a text field', () => {
    const { onChange } = renderForm()

    fireEvent.change(screen.getByLabelText("Bride's Name *"), { target: { value: 'Jane' } })

    expect(onChange).toHaveBeenCalledWith('brideName', 'Jane')
  })

  it('calls onChange with a coerced number for a number field', () => {
    const { onChange } = renderForm()

    fireEvent.change(screen.getByLabelText('Hours Covered *'), { target: { value: '8' } })

    expect(onChange).toHaveBeenCalledWith('hoursCovered', 8)
  })

  it('calls onChange with null when a number field is cleared', () => {
    // Render with an initial value so the input has a value to clear
    const { onChange } = renderForm({ values: { hoursCovered: 8 } })
    const input = screen.getByLabelText('Hours Covered *')

    // Clear the number field by changing to empty string
    fireEvent.change(input, { target: { value: '' } })

    expect(onChange).toHaveBeenCalledWith('hoursCovered', null)
  })

  it('shows a required-field error only after the field is blurred empty', () => {
    renderForm()
    const input = screen.getByLabelText("Bride's Name *")

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()

    fireEvent.blur(input)

    expect(screen.getByText(/is required/i)).toBeInTheDocument()
  })

  it('does not show a required error for an optional field left blank', () => {
    renderForm()

    fireEvent.blur(screen.getByLabelText('Notes'))

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
  })

  it('displays a server-side field error immediately, without needing blur', () => {
    renderForm({ serverErrors: { brideName: 'is required' } })

    expect(screen.getByText('is required')).toBeInTheDocument()
  })

  it('falls back to a text input for an unrecognized field type', () => {
    renderForm({
      fieldSchema: { fields: [{ name: 'mystery', type: 'something-new', label: 'Mystery Field', required: false }] },
    })

    expect(screen.getByLabelText('Mystery Field')).toHaveAttribute('type', 'text')
  })

  it('calls onFirstInteraction exactly once, on the first change', () => {
    const onFirstInteraction = vi.fn()
    renderForm({ onFirstInteraction })

    fireEvent.change(screen.getByLabelText("Bride's Name *"), { target: { value: 'J' } })
    fireEvent.change(screen.getByLabelText("Bride's Name *"), { target: { value: 'Ja' } })

    expect(onFirstInteraction).toHaveBeenCalledTimes(1)
  })

  it('renders an empty form instead of throwing when fieldSchema has no fields key', () => {
    expect(() => renderForm({ fieldSchema: {} })).not.toThrow()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('renders an empty form instead of throwing when fieldSchema is null', () => {
    expect(() => renderForm({ fieldSchema: null })).not.toThrow()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
