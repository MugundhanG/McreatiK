# Buyer image upload field ("Image" field type)

**Date:** 2026-09-20
**Status:** Approved design, not yet implemented
**Repos touched:** mcreatik-backend, mcreatik-admin, mcreatik (storefront)

## Context

The Digital Store's document templates (e.g. the new Wedding Service Agreement)
let a buyer customize a purchased document via a schema-driven form
(`fieldSchema.fields[]` on the Product, `fieldStructure.fields[]` on the
Template it renders from). Every field type today — String, Email, Date,
Number — is plain text. There is no way for a buyer to supply an image (e.g.
their own studio's logo) that ends up embedded in the generated document.

This was requested while building the Wedding Service Agreement template,
which uses McreatiK's own logo in its sample PDF but needs each purchasing
photography studio's *own* logo and name in the document they actually
receive.

This spec is the third of three related pieces, done in sequence:
- **C** (admin marketing-content editor) — shipped 2026-09-19/20.
- **B** (gate the customization form behind login) — shipped 2026-09-20,
  and is a hard prerequisite for this spec: the upload endpoint below relies
  on the buyer already being an authenticated Customer by the time they can
  reach any field, image or otherwise.
- **A** (this spec) — the buyer-facing "Image" field type itself.

## Decisions already made (do not re-litigate)

1. **General field type, not a one-off.** "Image" becomes a real option in
   the same field-type dropdown as String/Email/Date/Number, usable on *any*
   future template or product-level field schema — not special-cased to the
   Wedding Service Agreement template.
2. **Requires login**, which is already true for the entire customization
   form as of item B — no additional gating needed here beyond reusing the
   existing `hasRole("CUSTOMER")` pattern for the new endpoint itself.
3. **Real file upload**, not a "paste a URL to your already-hosted logo"
   text field — the buyer picks a file from their device.
4. **Limits:** max 5MB, PNG/JPEG/WebP only.
5. **Upload mechanism: direct server-side multipart upload** (not
   presign+PUT+confirm). Rejected alternative: presign+PUT+confirm mirrors
   the existing admin media-upload pattern exactly, but the backend never
   sees the actual bytes at upload time — it can only validate what the
   client *declares* at presign time, which is a materially weaker
   guarantee for a customer-facing (not admin-facing) endpoint. Direct
   upload lets the backend inspect real file bytes (magic-byte sniffing,
   real size) before anything is written to storage.

## Key technical finding: the renderer needs no changes

`TemplateInterpolator.interpolate()` (backend) does a naive, position-based
text substitution of `{{fieldName}}` tokens anywhere in the template body
string, always HTML-escaped, with no awareness of HTML structure or field
type. This means an admin can already write:

```html
<img src="{{studioLogo}}" style="max-height:80px;" />
```

in a template's Body HTML today, and once `studioLogo`'s resolved value is a
real image URL, it renders correctly — both in the real PDF
(`TemplateHtmlPdfRenderer`, via openhtmltopdf, which supports `<img>` with a
normal URL `src`) and in the storefront's client-side `LiveDocumentPreview`
(same naive-substitution approach, browser-native `<img>` rendering). No
changes are needed to either renderer. The only gap is: (a) nothing lets a
buyer supply that URL by uploading a file, and (b) nothing validates that a
submitted "image" field's value is actually a URL we generated ourselves
rather than arbitrary buyer-supplied text.

## Design

### Backend (`mcreatik-backend`)

**1. New field-type validator.** `GenericFieldSchemaValidator`'s
`TYPE_REGISTRY` gets a new `"image"` entry. Its `FieldTypeValidator`:
- Requires the submitted value to be a `String`.
- Enforces a max length of 300 characters (a generated
  `{R2_PUBLIC_BASE_URL}/customer-uploads/{uuid}.{ext}` URL is well under
  150 in practice; 300 leaves headroom without accepting an implausibly
  long string). If the schema sets its own `maxLength`, that value is used
  instead, the same way `validateString` already honors a schema-supplied
  `maxLength` — 300 is only the built-in default when none is set.
- **Requires the value to start with `{R2_PUBLIC_BASE_URL}/customer-uploads/`**
  (the exact prefix the new upload endpoint below always uses). This is the
  security-critical check: without it, a buyer could skip the upload
  endpoint entirely and submit an arbitrary external URL (or any string)
  directly to `POST /api/v1/cart/items`, which would then get embedded in
  their generated document and rendered by our own PDF pipeline. Rejecting
  anything that isn't demonstrably one of our own uploaded objects closes
  that hole. (openhtmltopdf's `PdfRendererBuilder` DOES fetch external image URLs over the
  network by default at render time — verified against the library's own
  `NaiveUserAgent`/`DefaultAccessController` behavior, not assumed. This makes
  this field-value check the *actual, load-bearing* control against a
  malicious external URL reaching this renderer, not defense-in-depth. A
  companion fix wires `PdfRendererBuilder.useExternalResourceAccessControl`
  in `TemplateHtmlPdfRenderer` to restrict every resource fetch, from any
  field type, to our own R2 public host — closing the same class of risk for
  a plain `"string"`-typed field misused as an `<img src="{{field}}">`
  source, which this validator alone cannot cover since it only applies to
  fields explicitly typed `"image"`.)

**2. New upload endpoint.** `POST /api/v1/customer/uploads/image`,
`multipart/form-data`, single file field. Added to the existing
`hasRole("CUSTOMER")` matcher in `SecurityConfig` alongside
`/api/v1/cart/**` and `/api/v1/checkout`. Resolves the customer id from the
`Authentication` the same way `CartController` does
(`currentCustomerService.require(authentication).getId()`), though the id is
only used to namespace the storage key, not stored anywhere new (see below).

Server-side validation, in order:
- Reject if `file.getSize() > 5_000_000` (5MB).
- Read the file's actual leading bytes and check them against known PNG /
  JPEG / WebP magic-byte signatures — reject anything that doesn't match,
  regardless of what `Content-Type` the client's request declared.
- On success, generate a fresh key `customer-uploads/{customerId}/{uuid}.{ext}`
  (extension derived from the sniffed type, mirroring
  `R2StorageService.generateObjectKey`'s existing pattern but with a
  distinct prefix so buyer-submitted content is trivially distinguishable
  from admin-curated `media/` objects — e.g. for any future moderation or
  bulk-cleanup pass) and upload the validated bytes directly via the R2
  `S3Client` already wired up for `R2StorageService` (reusing that bean/
  bucket/credentials — the same public bucket admin media already lives in,
  since the buyer's browser needs to load this URL directly via `<img
  src>`).
- Return `{ "url": "<public URL>" }`.

**No new database table or entity.** Unlike admin `Media` (which exists so
admins can browse/reuse a library of past uploads), a buyer's logo is a
one-off value for their one order — it just becomes this field's value,
carried through `cart_items.field_values` / `order_items.field_values`
(both already-existing JSONB columns that store arbitrary field values
today) exactly like a typed string. If orphaned-upload storage cost ever
becomes a real concern (buyer uploads, then abandons the cart), that's a
follow-up cleanup job, not part of this spec — YAGNI for now given expected
volume (small images, low frequency).

### Admin app (`mcreatik-admin`)

One-line change: add `{ value: 'image', label: 'Image' }` to `FIELD_TYPES`
in `FieldStructureEditor.tsx` (shared by both `TemplateFormPage` and
`ProductFormPage`, per today's earlier marketing-content work — this is the
same component). Also add `'image'` to the `FieldStructureType` /
`ProductFieldType` / `TemplateFieldType` TypeScript union types.

No other admin change. An admin authoring a template's Body HTML just
writes `<img src="{{fieldName}}">` wherever they want the buyer's uploaded
image to appear — identical authoring experience to referencing a text
field, per the "renderer needs no changes" finding above.

### Storefront (`mcreatik`)

`ProductForm.jsx`: for a field whose `type === 'image'`, render a file-input
control (visually consistent with the rest of the form) instead of a text
input. On file selection:
1. Client-side pre-check (size ≤5MB, type is one of the three) for fast
   feedback — never the only check, since the server re-validates
   independently.
2. `POST` the file to `/api/v1/customer/uploads/image` with the customer's
   access token (the form is already only reachable by a signed-in customer
   per item B, so a token always exists at this point).
3. On success, call the same `onChange(name, url)` every other field type
   already calls — no changes needed to `StoreProductPage.jsx`,
   `CartContext`, or checkout, since a field's value is already treated as
   an opaque value by everything downstream of `ProductForm`.
4. On failure (size/type rejected, network error, server rejection), show a
   field-level error inline, matching this form's existing per-field error
   pattern.

`LiveDocumentPreview.jsx` and `PreviewPanel.jsx` need **no changes** — both
already interpolate/pass through field values as opaque strings; once an
image field's value is a real URL, `<img src="{{fieldName}}">` in the
template body renders correctly through the exact same paths that already
handle every other field type.

## Testing

- **Backend:** unit tests for the new `"image"` validator (accepts a
  well-formed `customer-uploads/` URL, rejects an external URL, rejects a
  bare string that isn't a URL at all); a slice test for the new controller
  confirming `hasRole("CUSTOMER")` gating (401/403 without a valid customer
  token) and confirming a valid PNG upload round-trips to a URL matching the
  expected prefix; a rejection test for an oversized payload and for a
  payload whose declared Content-Type doesn't match its actual magic bytes
  (e.g. a `.txt` file relabeled `image/png`).
- **Storefront:** `ProductForm.test.jsx` gets coverage for the new
  `type: 'image'` branch — renders a file input, calls the upload endpoint
  on file selection (mocked the same way other network calls are already
  mocked in this suite), and calls `onChange` with the mocked response's
  URL on success; a rejection-path test for an oversized/wrong-type file
  showing the inline error without calling the upload endpoint at all.
- **Admin:** no test needed for the one-line dropdown addition — matches
  this repo's existing lack of test infrastructure, noted and deliberately
  left open in an earlier review (not something this spec should take on).

## Out of scope (explicitly deferred)

- Orphaned-upload cleanup for abandoned carts.
- Reusing a previously-uploaded logo across multiple orders from the same
  returning customer (would need persisting it against the Customer, not
  just the one order) — every order's image field starts blank today.
- Any admin-side browsing/management UI for buyer-uploaded images (there is
  no admin `Media`-library equivalent for these, by design — see "No new
  database table or entity" above).
