import { describe, it, expect } from 'vitest'
import { escapeHtml, interpolateTemplatePreview } from './templatePreview'

describe('escapeHtml', () => {
  it('escapes the 5-entry table in the same order the backend does', () => {
    expect(escapeHtml(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &#39;')
  })

  it('returns an empty string for null/undefined', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })

  it('coerces a non-string value (e.g. number) before escaping', () => {
    expect(escapeHtml(42)).toBe('42')
  })
})

describe('interpolateTemplatePreview — plain substitution', () => {
  it('substitutes a resolved value, escaped', () => {
    expect(interpolateTemplatePreview('Hello {{name}}!', { name: 'A & B' })).toBe('Hello A &amp; B!')
  })

  it('leaves ordinary text outside tokens untouched', () => {
    expect(interpolateTemplatePreview('No tokens here.', {})).toBe('No tokens here.')
  })

  it('substitutes an empty string for a resolved-but-blank value', () => {
    expect(interpolateTemplatePreview('X{{name}}Y', { name: '' })).toBe('XY')
  })

  it('a literal triple-brace does not produce a raw/unescaped substitution path', () => {
    // The outer brace is emitted as literal text; the remaining {{name}} is interpolated
    // (and escaped) normally - mirrors TemplateInterpolatorTest's
    // tripleBraceSyntaxDoesNotProduceARawUnescapedSubstitution.
    expect(interpolateTemplatePreview('{{{name}}}', { name: '<b>' })).toBe('{&lt;b&gt;}')
  })
})

describe('interpolateTemplatePreview — the deliberate deviation: unresolved token renders as empty string', () => {
  it('renders an unresolved plain {{name}} token as an empty string instead of throwing', () => {
    expect(() => interpolateTemplatePreview('Hello {{name}}!', {})).not.toThrow()
    expect(interpolateTemplatePreview('Hello {{name}}!', {})).toBe('Hello !')
  })

  it('omits an unresolved {{#name}}...{{/name}} section entirely instead of throwing', () => {
    expect(() => interpolateTemplatePreview('A{{#licence}}B{{/licence}}C', {})).not.toThrow()
    expect(interpolateTemplatePreview('A{{#licence}}B{{/licence}}C', {})).toBe('AC')
  })

  it('mixes resolved and unresolved fields in the same body without throwing', () => {
    const body = 'Hi {{brideName}}, wedding on {{weddingDate}}.'
    expect(interpolateTemplatePreview(body, { brideName: 'Jane' })).toBe('Hi Jane, wedding on .')
  })
})

describe('interpolateTemplatePreview — sections', () => {
  it('shows a section when its value is non-null/non-blank, recursively interpolating the inner fragment', () => {
    const body = '{{#licenceTerms}}Licence: {{licenceTerms}}{{/licenceTerms}}'
    expect(interpolateTemplatePreview(body, { licenceTerms: 'Personal use only' })).toBe(
      'Licence: Personal use only'
    )
  })

  it('hides a section (and its inner markup) when its value is null', () => {
    const body = 'Before{{#licenceTerms}}Licence: {{licenceTerms}}{{/licenceTerms}}After'
    expect(interpolateTemplatePreview(body, { licenceTerms: null })).toBe('BeforeAfter')
  })

  it('hides a section when its value is blank/whitespace-only', () => {
    const body = 'Before{{#licenceTerms}}Licence: {{licenceTerms}}{{/licenceTerms}}After'
    expect(interpolateTemplatePreview(body, { licenceTerms: '   ' })).toBe('BeforeAfter')
  })

  it('supports a nested section of a different name inside a shown section', () => {
    const body = '{{#outer}}Outer {{#inner}}Inner {{inner}}{{/inner}} end{{/outer}}'
    expect(interpolateTemplatePreview(body, { outer: 'yes', inner: 'value' })).toBe(
      'Outer Inner value end'
    )
  })

  it('hides a nested inner section independently of the outer one being shown', () => {
    const body = '{{#outer}}Outer {{#inner}}Inner {{inner}}{{/inner}} end{{/outer}}'
    expect(interpolateTemplatePreview(body, { outer: 'yes', inner: null })).toBe('Outer  end')
  })

  it('handles a section nested inside another section of the SAME name at the correct depth', () => {
    const body = '{{#a}}outer-open {{#a}}inner {{/a}} outer-close{{/a}}'
    expect(interpolateTemplatePreview(body, { a: 'yes' })).toBe('outer-open inner  outer-close')
  })

  it('throws for a stray closing tag with no matching open', () => {
    expect(() => interpolateTemplatePreview('{{/name}}', {})).toThrow(/unmatched closing section tag/)
  })

  it('throws for a section that is never closed', () => {
    expect(() => interpolateTemplatePreview('{{#name}}never closed', {})).toThrow(/is never closed/)
  })
})
