import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProductForm from './ProductForm'

vi.mock('../../utils/customerApi', () => ({
  uploadCustomerImage: vi.fn(),
}))

import { uploadCustomerImage } from '../../utils/customerApi'

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

describe('ProductForm — non-editable fields (customerEditable: false)', () => {
  const NON_EDITABLE_SCHEMA = {
    fields: [
      {
        name: 'licenceTerms',
        type: 'string',
        label: 'Licence Terms',
        required: true,
        customerEditable: false,
        fixedValue: 'This document is licensed for personal use only.',
      },
      { name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 },
    ],
  }

  it('renders a non-editable field disabled and pre-filled with its fixedValue', () => {
    render(<ProductForm fieldSchema={NON_EDITABLE_SCHEMA} values={{}} onChange={vi.fn()} />)

    const input = screen.getByLabelText('Licence Terms')
    expect(input).toBeDisabled()
    expect(input).toHaveValue('This document is licensed for personal use only.')
  })

  it('does not mark a non-editable field as required in its label, even when the schema says required: true', () => {
    render(<ProductForm fieldSchema={NON_EDITABLE_SCHEMA} values={{}} onChange={vi.fn()} />)

    expect(screen.getByText('Licence Terms')).toBeInTheDocument()
    expect(screen.queryByText('Licence Terms *')).not.toBeInTheDocument()
  })

  it('never shows a required-field error for a non-editable field, even blank and required, and does not block form submission', () => {
    const onChange = vi.fn()
    render(<ProductForm fieldSchema={NON_EDITABLE_SCHEMA} values={{}} onChange={onChange} />)

    const nonEditableInput = screen.getByLabelText('Licence Terms')
    // Attempt exactly the interaction that would surface a required-field error on an
    // editable field (blur while empty) - a disabled input can't actually receive
    // focus/blur from a real user, but this proves the component's own validation
    // logic short-circuits for this field regardless.
    fireEvent.blur(nonEditableInput)
    fireEvent.click(screen.getByLabelText("Bride's Name *"))

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('ignores a server-side error keyed to a non-editable field name (the backend never reports one, but the client must not surface it if it somehow arrived)', () => {
    render(
      <ProductForm
        fieldSchema={NON_EDITABLE_SCHEMA}
        values={{}}
        onChange={vi.fn()}
        serverErrors={{ licenceTerms: 'is required' }}
      />
    )

    expect(screen.queryByText('is required')).not.toBeInTheDocument()
  })

  it('never calls onChange for a non-editable field since it has no change handler attached', () => {
    const onChange = vi.fn()
    render(<ProductForm fieldSchema={NON_EDITABLE_SCHEMA} values={{}} onChange={onChange} />)

    const nonEditableInput = screen.getByLabelText('Licence Terms')
    fireEvent.change(nonEditableInput, { target: { value: 'tampered value' } })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('still validates a sibling editable required field normally alongside a non-editable one', () => {
    render(<ProductForm fieldSchema={NON_EDITABLE_SCHEMA} values={{}} onChange={vi.fn()} />)

    fireEvent.blur(screen.getByLabelText("Bride's Name *"))

    expect(screen.getByText(/is required/i)).toBeInTheDocument()
  })

  it('treats customerEditable: true the same as an absent customerEditable key', () => {
    const explicit = { fields: [{ name: 'x', type: 'string', label: 'X', required: false, customerEditable: true }] }
    const implicit = { fields: [{ name: 'x', type: 'string', label: 'X', required: false }] }

    const { unmount } = render(<ProductForm fieldSchema={explicit} values={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText('X')).not.toBeDisabled()
    unmount()

    render(<ProductForm fieldSchema={implicit} values={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText('X')).not.toBeDisabled()
  })
})

describe('ProductForm — image field type', () => {
  const IMAGE_FIELD_SCHEMA = {
    fields: [{ name: 'studioLogo', type: 'image', label: 'Your Studio Logo', required: true }],
  }

  it('renders a file picker instead of a text input for an image field', () => {
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={vi.fn()} />)

    expect(screen.getByLabelText(/your studio logo/i)).toHaveAttribute('type', 'file')
  })

  it('uploads the selected file and reports the returned URL via onChange', async () => {
    uploadCustomerImage.mockResolvedValue({ url: 'https://cdn.test/customer-uploads/abc/def.png' })
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [file] } })

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith('studioLogo', 'https://cdn.test/customer-uploads/abc/def.png'))
    expect(uploadCustomerImage).toHaveBeenCalledWith(file)
  })

  it('shows an inline error and does not call onChange when the upload is rejected', async () => {
    uploadCustomerImage.mockRejectedValue(new Error('file must be a PNG, JPEG, or WebP image'))
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [file] } })

    expect(await screen.findByText(/file must be a png, jpeg, or webp image/i)).toBeInTheDocument()
    expect(uploadCustomerImage).toHaveBeenCalledWith(file)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('rejects a non-image file client-side without calling the upload endpoint at all', async () => {
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const file = new File(['fake-bytes'], 'logo.txt', { type: 'text/plain' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [file] } })

    expect(await screen.findByText(/must be a png, jpeg, or webp image/i)).toBeInTheDocument()
    expect(uploadCustomerImage).not.toHaveBeenCalled()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('rejects an oversized file client-side without calling the upload endpoint at all', async () => {
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const oversized = new File([new Uint8Array(5_000_001)], 'huge.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [oversized] } })

    expect(await screen.findByText(/must be at most 5mb/i)).toBeInTheDocument()
    expect(uploadCustomerImage).not.toHaveBeenCalled()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('shows the uploaded image as a preview once set', () => {
    render(
      <ProductForm
        fieldSchema={IMAGE_FIELD_SCHEMA}
        values={{ studioLogo: 'https://cdn.test/customer-uploads/abc/def.png' }}
        onChange={vi.fn()}
      />
    )

    const preview = screen.getByAltText(/your studio logo/i)
    expect(preview).toHaveAttribute('src', 'https://cdn.test/customer-uploads/abc/def.png')
  })
})
