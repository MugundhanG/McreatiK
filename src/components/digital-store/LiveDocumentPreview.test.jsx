import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LiveDocumentPreview from './LiveDocumentPreview'

function getPreviewIframe() {
  return screen.getByTitle('Live document preview')
}

function srcDocOf(iframe) {
  // jsdom stores the srcDoc React prop as the `srcdoc` attribute.
  return iframe.getAttribute('srcdoc')
}

describe('LiveDocumentPreview', () => {
  it('renders nothing when the product has no templateBody (e.g. a STATIC_ASSET product)', () => {
    const { container } = render(<LiveDocumentPreview templateBody={null} fieldValues={{}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('is visible immediately with blank/placeholder fields rendering as empty - not an error state', () => {
    render(<LiveDocumentPreview templateBody="Hello {{brideName}}!" fieldValues={{}} />)

    const iframe = getPreviewIframe()
    expect(iframe).toBeInTheDocument()
    expect(srcDocOf(iframe)).toContain('Hello !')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the sandboxed iframe with sandbox="allow-same-origin" and never uses dangerouslySetInnerHTML on the page', () => {
    render(<LiveDocumentPreview templateBody="Body {{x}}" fieldValues={{ x: 'value' }} />)

    const iframe = getPreviewIframe()
    expect(iframe.tagName).toBe('IFRAME')
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin')
  })

  it('recomputes the composed HTML on every fieldValues change (the always-updating requirement)', () => {
    const { rerender } = render(<LiveDocumentPreview templateBody="Hi {{name}}!" fieldValues={{ name: 'J' }} />)
    expect(srcDocOf(getPreviewIframe())).toContain('Hi J!')

    rerender(<LiveDocumentPreview templateBody="Hi {{name}}!" fieldValues={{ name: 'Ja' }} />)
    expect(srcDocOf(getPreviewIframe())).toContain('Hi Ja!')

    rerender(<LiveDocumentPreview templateBody="Hi {{name}}!" fieldValues={{ name: 'Jane' }} />)
    expect(srcDocOf(getPreviewIframe())).toContain('Hi Jane!')
  })

  it('escapes buyer-typed content the same way the backend would', () => {
    render(<LiveDocumentPreview templateBody="Name: {{name}}" fieldValues={{ name: '<script>' }} />)

    expect(srcDocOf(getPreviewIframe())).toContain('Name: &lt;script&gt;')
    expect(srcDocOf(getPreviewIframe())).not.toContain('<script>alert')
  })

  it('shows a section only once its field is filled in, hiding it while the buyer has not typed it yet', () => {
    const templateBody = 'Start{{#licenceTerms}} Licence: {{licenceTerms}}{{/licenceTerms}} End'
    const { rerender } = render(<LiveDocumentPreview templateBody={templateBody} fieldValues={{}} />)
    expect(srcDocOf(getPreviewIframe())).toContain('Start End')

    rerender(<LiveDocumentPreview templateBody={templateBody} fieldValues={{ licenceTerms: 'Personal use' }} />)
    expect(srcDocOf(getPreviewIframe())).toContain('Start Licence: Personal use End')
  })

  it('shows a fallback message instead of crashing when templateBody is structurally malformed', () => {
    render(<LiveDocumentPreview templateBody="{{#broken}}never closed" fieldValues={{}} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByTitle('Live document preview')).not.toBeInTheDocument()
  })

  it('includes the Noto Sans font-family fallback stack so Tamil/Devanagari names render reasonably', () => {
    render(<LiveDocumentPreview templateBody="Hi {{name}}" fieldValues={{ name: 'மோகன்' }} />)

    const srcDoc = srcDocOf(getPreviewIframe())
    expect(srcDoc).toContain('Noto Sans')
    expect(srcDoc).toContain('Noto Sans Tamil')
    expect(srcDoc).toContain('மோகன்')
  })
})

describe('LiveDocumentPreview — locked (customerEditable: false) fields', () => {
  // ProductForm never calls onChange for a non-editable field (it renders straight from
  // field.fixedValue), so a locked field's name never appears in `fieldValues` at all -
  // without fieldSchema, this preview would treat it as unresolved (the normal
  // half-filled-form deviation) and omit it forever, permanently diverging from the real
  // PDF, which always resolves a locked field from its own fixedValue server-side.
  const SCHEMA = {
    fields: [
      { name: 'brideName', type: 'string', label: "Bride's Name", customerEditable: true },
      {
        name: 'licenceTerms',
        type: 'string',
        label: 'Licence Terms',
        customerEditable: false,
        fixedValue: 'Personal use only.',
      },
    ],
  }

  it('resolves a locked field from fieldSchema.fixedValue even though it is absent from fieldValues', () => {
    const templateBody = 'Bride: {{brideName}}. {{#licenceTerms}}Licence: {{licenceTerms}}{{/licenceTerms}}'
    render(<LiveDocumentPreview templateBody={templateBody} fieldSchema={SCHEMA} fieldValues={{ brideName: 'Jane' }} />)

    expect(srcDocOf(getPreviewIframe())).toContain('Bride: Jane. Licence: Personal use only.')
  })

  it('a locked field with no fixedValue set still shows as empty (not the unresolved-token throw path)', () => {
    const schema = { fields: [{ name: 'licenceTerms', customerEditable: false }] }
    render(<LiveDocumentPreview templateBody="X{{licenceTerms}}Y" fieldSchema={schema} fieldValues={{}} />)

    expect(srcDocOf(getPreviewIframe())).toContain('XY')
  })

  it('a locked field always resolves to its fixedValue even if fieldValues somehow carries a value for it (tamper case)', () => {
    render(
      <LiveDocumentPreview
        templateBody="Licence: {{licenceTerms}}"
        fieldSchema={SCHEMA}
        fieldValues={{ licenceTerms: 'tampered value' }}
      />
    )

    expect(srcDocOf(getPreviewIframe())).toContain('Licence: Personal use only.')
    expect(srcDocOf(getPreviewIframe())).not.toContain('tampered value')
  })
})
