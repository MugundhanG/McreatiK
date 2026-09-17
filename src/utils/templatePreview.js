// src/utils/templatePreview.js
//
// Client-side port of the backend's TemplateInterpolator
// (mcreatik-backend: src/main/java/com/mcreatik/cms/product/pdf/TemplateInterpolator.java).
// Same placeholder grammar, same escaping, ported line-for-line:
//
//   - {{name}}              - a plain substitution, always run through escapeHtml().
//                             There is no raw/unescaped substitution path at all - every
//                             value this module ever emits has gone through escapeHtml()
//                             first, exactly like the backend's own guarantee.
//   - {{#name}}...{{/name}} - the enclosed fragment (itself recursively interpolated, so
//                             it may contain further {{}}/{{#}} tokens) is emitted only
//                             when `name` resolves to a non-null, non-blank value;
//                             otherwise the whole section - including its own inner
//                             markup - disappears.
//
// DELIBERATE DEVIATION from the backend, for an unresolved token (a key genuinely absent
// from `values`):
//   - Backend (TemplateInterpolator.interpolate): throws IllegalStateException. There,
//     `values` is the fully pre-seeded map (every field the Template's own body
//     references is guaranteed present, see TemplateFieldValues.preSeedAndMerge) used to
//     render a real, already-submitted document - an absent key there can only mean the
//     template body references a field the field schema doesn't declare, i.e. a
//     template/schema authoring defect worth a loud 500.
//   - Here: `values` is `fieldValues`, whatever the buyer has typed into the form SO FAR,
//     live, on every keystroke, long before submission. A field the buyer hasn't reached
//     yet is simply absent from that object - that is normal, expected, in-progress
//     state, not a defect - so an unresolved plain `{{name}}` or section `{{#name}}`
//     renders as an EMPTY STRING instead of throwing. This is what lets the live preview
//     render smoothly through every keystroke of a half-filled form instead of blanking
//     out (or crashing) the moment it walks a token for a field the buyer hasn't typed
//     into yet.
//   Structural malformation of the template body ITSELF (an unmatched `{{/name}}` with no
//   opening tag, or a `{{#name}}` section that is never closed) is NOT covered by this
//   deviation and still throws, exactly like the backend - that can never be explained by
//   "the buyer hasn't typed that field yet"; it is a defect in the seller's own template
//   content, unrelated to what the buyer has or hasn't filled in. Callers rendering this
//   in a live-typing UI should catch that case and show a fallback rather than crash.

const TOKEN_SOURCE = '\\{\\{(#|/)?([A-Za-z0-9_]+)\\}\\}'

/**
 * Copied character-for-character (translated to JS) from TemplateInterpolator.escape -
 * same 5-entry table, same order: & -> &amp;, < -> &lt;, > -> &gt;, " -> &quot;, ' -> &#39;.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Depth-aware scan for the {{/name}} that closes the {{#name}} whose body starts at
 * `searchFrom` - mirrors TemplateInterpolator.findMatchingClose so a section nested
 * inside another section of the SAME name closes against its own tag, not the outer
 * one's. Tokens for any other name are skipped over without affecting the depth counter.
 */
function findMatchingClose(templateBody, searchFrom, name) {
  const re = new RegExp(TOKEN_SOURCE, 'g')
  re.lastIndex = searchFrom
  let depth = 1
  let match = re.exec(templateBody)
  while (match !== null) {
    const marker = match[1]
    const tokenName = match[2]
    if (tokenName === name) {
      if (marker === '#') {
        depth += 1
      } else if (marker === '/') {
        depth -= 1
        if (depth === 0) {
          return { contentEnd: match.index, afterClose: re.lastIndex }
        }
      }
    }
    match = re.exec(templateBody)
  }
  throw new Error(`Template body section '{{#${name}}}' is never closed`)
}

/**
 * Walks `templateBody` left to right, replacing every {{name}} and {{#name}}...{{/name}}
 * token it finds. Any text that is not part of a recognised token is copied through
 * untouched. See the module-level comment for the one deliberate behavior difference
 * from the backend's TemplateInterpolator.interpolate: an unresolved token renders as
 * an empty string here instead of throwing.
 */
export function interpolateTemplatePreview(templateBody, values) {
  const body = templateBody ?? ''
  const map = values ?? {}
  let output = ''
  const re = new RegExp(TOKEN_SOURCE, 'g')
  let cursor = 0
  let match = re.exec(body)
  while (match !== null) {
    output += body.slice(cursor, match.index)
    const marker = match[1]
    const name = match[2]
    const sectionContentStart = re.lastIndex

    if (marker === '#') {
      const close = findMatchingClose(body, sectionContentStart, name)
      const hasKey = Object.prototype.hasOwnProperty.call(map, name)
      const value = hasKey ? map[name] : undefined
      // Resolved-but-blank (hasKey true, value null/blank) and unresolved (hasKey
      // false - the deviation) both simply omit the section; neither throws here.
      if (hasKey && value !== null && value !== undefined && String(value).trim() !== '') {
        const inner = body.slice(sectionContentStart, close.contentEnd)
        output += interpolateTemplatePreview(inner, map)
      }
      cursor = close.afterClose
      re.lastIndex = cursor
    } else if (marker === '/') {
      // A stray close tag with no open counterpart reached this level of the walk
      // (findMatchingClose consumes a well-formed pair before we ever see its close
      // tag here) - a malformed template body, not something to silently pass
      // through as text. Matches the backend's behavior exactly (not part of the
      // unresolved-token deviation).
      throw new Error(`Template body has an unmatched closing section tag '{{/${name}}}'`)
    } else {
      const hasKey = Object.prototype.hasOwnProperty.call(map, name)
      // The deviation: an absent key renders as '' instead of throwing.
      output += hasKey ? escapeHtml(map[name]) : ''
      cursor = sectionContentStart
    }

    match = re.exec(body)
  }
  output += body.slice(cursor)
  return output
}
