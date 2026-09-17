// src/components/digital-store/LiveDocumentPreview.jsx
import { useMemo } from 'react'
import { interpolateTemplatePreview } from '../../utils/templatePreview'

// Same font-family fallback stack TemplateHtmlPdfRenderer.buildHtml() embeds server-side
// for the real PDF render (see TemplateHtmlPdfRenderer.java: "'Noto Sans','Noto Sans
// Tamil','Noto Sans Devanagari',sans-serif") - there it's backed by three registered TTF
// files (fonts/NotoSans*.ttf) so Tamil/Devanagari names render correctly in the actual
// document. This iframe is its own document (srcDoc), so it doesn't inherit index.html's
// <link> fonts; loading the same three Noto families from Google Fonts here (the app's
// existing font-loading convention, see index.html's own Google Fonts <link>) keeps the
// live preview visually consistent with what the real PDF will show instead of falling
// through to tofu boxes for a script the visitor's OS doesn't have installed.
const PREVIEW_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&display=swap'

function buildPreviewDocument(bodyHtml) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${PREVIEW_FONT_HREF}" />
<style>
  body {
    font-family: 'Noto Sans', 'Noto Sans Tamil', 'Noto Sans Devanagari', sans-serif;
    margin: 0;
    padding: 24px;
    color: #1a1a1a;
    line-height: 1.6;
    word-wrap: break-word;
  }
</style>
</head>
<body>${bodyHtml}</body>
</html>`
}

// A field marked `customerEditable: false` (ProductForm.jsx's `isEditable`) never gets an
// onChange call, so it never appears in `fieldValues` at all - ProductForm renders it
// straight from `field.fixedValue`, not from any parent state. Left alone, that means this
// preview would silently omit that field's content (and any {{#name}} section keyed to
// it) forever, which would make the "live" preview quietly diverge from the real PDF -
// the real backend always resolves a non-editable field from its own fixedValue
// (GenericFieldSchemaValidator.resolveNonEditable), regardless of what a buyer submits for
// it. Merging the schema's fixedValues in - with fixedValue always winning, exactly like
// the backend discards any buyer-submitted value for a locked field - keeps this preview
// faithful to what the purchased document will actually contain, including the tamper
// case: even if something upstream ever put a value under a locked field's name into
// `fieldValues`, it cannot flip what this preview shows for that field.
function withFixedValues(fieldSchema, fieldValues) {
  const fixed = {}
  for (const field of fieldSchema?.fields ?? []) {
    if (field.customerEditable === false) {
      fixed[field.name] = field.fixedValue ?? null
    }
  }
  return { ...fieldValues, ...fixed }
}

/**
 * Always-visible, always-current preview of the document the buyer is customizing - the
 * core deliverable this whole rework exists to build. It is composed entirely client-side
 * from `templateBody` (Product.templateBody, already present on the product the page
 * fetched - see ProductResponse.java), `fieldSchema` (the same schema ProductForm renders
 * from, needed to resolve any locked/fixed field - see withFixedValues above), and
 * `fieldValues` (the exact same state object ProductForm already maintains via its own
 * onChange callback - no new state, no new fetch), so there is zero network cost to
 * recomputing it and therefore no reason to debounce: `useMemo` below recomputes the
 * composed HTML synchronously on every `fieldValues` change, which is what makes typing a
 * single character update the preview immediately, with no click and no visible delay.
 *
 * Rendered via a sandboxed iframe (`srcDoc`), never `dangerouslySetInnerHTML` directly in
 * the page DOM - the composed HTML is buyer-influenced (it embeds whatever the buyer has
 * typed, escaped by templatePreview.js) and an iframe with `sandbox="allow-same-origin"`
 * keeps it in its own document/style scope without granting it script execution
 * (`allow-scripts` is deliberately not set).
 *
 * A malformed `templateBody` (an unmatched or never-closed section - a seller-side
 * authoring defect that has nothing to do with what the buyer has typed) is caught here
 * rather than left to throw during render, since this component has to keep rendering
 * through every keystroke of the form, not disappear the first time it hits a
 * structurally broken template.
 */
export default function LiveDocumentPreview({ templateBody, fieldSchema, fieldValues }) {
  const { html, error } = useMemo(() => {
    if (!templateBody) {
      return { html: '', error: null }
    }
    try {
      const effectiveValues = withFixedValues(fieldSchema, fieldValues ?? {})
      return { html: interpolateTemplatePreview(templateBody, effectiveValues), error: null }
    } catch (err) {
      return { html: '', error: err.message || 'This document could not be previewed right now.' }
    }
  }, [templateBody, fieldSchema, fieldValues])

  if (!templateBody) {
    return null
  }

  return (
    <section aria-label="Live document preview" className="py-10 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-1">Your document, updated as you type</h3>
      <p className="text-sm text-gray-600 mb-3">
        This updates instantly as you fill in the form above — nothing to click.
      </p>
      {error ? (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      ) : (
        <iframe
          title="Live document preview"
          sandbox="allow-same-origin"
          srcDoc={buildPreviewDocument(html)}
          className="w-full rounded-lg border border-gray-200 bg-white"
          style={{ height: '70vh' }}
        />
      )}
    </section>
  )
}
