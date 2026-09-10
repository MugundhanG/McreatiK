# Digital Store Storefront — Design

## Context

The backend for McreatiK's digital-products store (Studios department) is
built, reviewed, and running: buyers can browse a CMS-managed template
catalog, create an order, pay via Razorpay, and download a generated PDF
once payment is confirmed. See
`docs/superpowers/plans/2026-09-08-digital-products-order-payment.md` and
its design spec in the `mcreatik-backend` repo (branch
`digital-store-order-payment`, not yet merged to `master`) for the full
backend picture.

Nothing buyer-facing exists yet. This spec covers:
1. A new backend capability: a **watermarked preview**, generated before
   payment, that the original product vision always called for but the
   first backend build didn't include.
2. The **storefront frontend** — a new route in the main `mcreatik` site
   (this repo) that lets a real buyer browse, fill in, preview, pay for,
   and download a product end to end.

The catalog is explicitly designed to grow beyond the one current product
(a Wedding Photography Agreement) — the storefront must not assume any
product's specific fields.

## 1. Backend addition: watermarked preview endpoint

**Not part of this repo** — implemented in `mcreatik-backend`, continuing
branch `digital-store-order-payment` (it depends on that branch's
`WeddingAgreementFieldValidator`, `WeddingAgreementPdfRenderer`, and
`TemplateRepository`, none of which exist on `master` yet).

- **Produces:** `POST /api/v1/templates/{id}/preview` — public, no
  authentication, request body `{"fieldValues": {...}}` (same shape as
  `OrderCreateRequest.fieldValues`). Response: `Content-Type:
  application/pdf`, the rendered PDF bytes directly, with a watermark
  (e.g. a diagonal repeated "PREVIEW — NOT VALID" stamp) burned into every
  page.
- **Stateless by design:** no `Order` row, no database write of any kind.
  Runs the same validation (`WeddingAgreementFieldValidator`, or whichever
  validator the target template's shoot type maps to) and the same PDF
  render pipeline (`WeddingAgreementPdfRenderer`) the real post-payment
  fulfillment path already uses, plus one extra watermark-overlay step —
  so a preview and the final purchased document are visually identical
  except for the watermark, and any future renderer change automatically
  applies to both.
- **Validation:** identical rules to order creation (400 with per-field
  errors on invalid/missing values) — a buyer previewing with an
  incomplete form sees the same errors they'd see trying to check out,
  which is the intended behavior (preview only ever shows a document
  that's actually orderable).
- **Rate limiting:** reuse (or mirror) `OrderRateLimiter` per client IP —
  this endpoint is unauthenticated and does real PDF-rendering work, so it
  needs the same abuse protection order creation already has.
- **Template lookup:** must confirm the template exists and is `ACTIVE`
  (same `TemplateRepository.findByIdAndStatus` check `OrderService.createOrder`
  already does) — 404 otherwise.

## 2. Frontend: storefront

**In this repo** (`mcreatik`), following existing conventions: plain
React + `react-router-dom`, `utils/cmsApi.js`-style fetch helpers, no
existing test runner (Vitest would be added fresh if tests are wanted).

### Routes

- `GET /digital_store/` — catalog listing. Fetches `GET
  /api/v1/templates` (already live), renders each returned template as a
  card: name, price, currency. Links to the product page.
- `GET /digital_store/:templateId` — the product page: data-driven form,
  preview, and checkout entry point.
- `GET /digital_store/:templateId/order/:orderId` — reached only after a
  successful Razorpay payment; owns the "preparing your document" /
  download-ready state. Having the order id in the URL means a page
  refresh at this stage doesn't strand the buyer.

### The data-driven form

One generic form-rendering component reads a template's `fieldSchema`
(already returned by `GET /api/v1/templates`: an array of `{name, type,
label, required, maxLength}`) and renders the matching input per field —
`type: "date"` → a date input, `"email"` → an email input with
browser-native validation, `"number"` → a number input, etc. — plus
client-side `required`/`maxLength` enforcement mirroring what the fields
declare. This is the component that makes the catalog's "add a new
product without touching frontend code" promise actually true: a new
template with a different field list needs zero changes here.

### Preview

Buyer fills the form and clicks **Preview**. Frontend `POST`s the current
field values to the new preview endpoint (§1) and renders the returned
PDF inline, directly below the form, via a `<embed>`/`<iframe>` pointed
at a `blob:` URL built from the response bytes — no new tab, no page
navigation. Preview can be re-run any number of times as the buyer edits
the form; each click is a fresh, independent request (no caching needed
at this scale).

### Checkout

1. Buyer clicks **Pay ₹{price}**. Frontend generates an `Idempotency-Key`
   (a client-side UUID) the *first* time this happens for the current
   form session, and re-sends the *same* key on any retry within that
   session — so an abandoned-then-resumed checkout reuses the same order
   instead of creating a duplicate.
2. `POST /api/v1/orders` with that header, `templateId`, `customerName`,
   `customerEmail`, and `fieldValues`. On success, the response carries
   `orderId`, `razorpayOrderId`, `razorpayKeyId`, `amount`, `currency`.
3. Open Razorpay's Checkout modal (their official `checkout.js`,
   loaded from Razorpay's CDN per their own integration docs — this is
   their standard hosted payment UI, not something to hand-build) with
   those values.
4. **Buyer cancels the modal:** return to the form. The order row exists
   but unpaid — nothing to clean up; clicking Pay again reuses it via the
   same idempotency key.
5. **Payment succeeds:** Razorpay's callback hands back
   `razorpay_order_id`/`razorpay_payment_id`/`razorpay_signature`.
   Immediately persist `{orderId, razorpayOrderId, razorpayPaymentId,
   razorpaySignature}` to `sessionStorage` (keyed by `orderId`) — this is
   what makes a mid-flow refresh recoverable, see below — then navigate to
   `/digital_store/:templateId/order/:orderId`.
6. That page calls `POST /api/v1/orders/{orderId}/verify` with the stored
   triple.
   - `fulfilled: true` → show the download button/link immediately.
   - `fulfilled: false` → show "preparing your document..." and poll the
     same `/verify` call again every few seconds until it flips to
     `true`. (Confirmed against the backend: `/verify` is safe to call
     repeatedly once already paid — `markPaid` and the fulfillment claim
     are both no-ops on repeat, and a still-`false` response costs one
     cheap read. No backend changes needed for this.)
7. **Page refresh at this stage:** the order id comes back from the URL;
   the Razorpay triple comes back from `sessionStorage`. The page
   resumes exactly where it left off by re-calling `/verify`. If
   `sessionStorage` was cleared (different browser, cleared site data),
   the page can't recover on its own — show a "contact us with your order
   ID" message, since the backend has no other public lookup by order id
   alone (a deliberate security boundary: nothing lets a stranger query
   someone else's order by guessing a UUID from the URL).
8. **Download:** the link/button points at `GET
   /api/v1/orders/{orderId}/download?token={downloadToken}` — the backend
   redirects (302) straight to the signed R2 URL.

### Error handling

- Preview/order validation errors (400, field-level) → shown inline next
  to the relevant form field.
- Rate-limited (429) or gateway unreachable (502) on order creation →
  plain "please try again in a moment" message with a retry button — both
  are already-built, already-tested backend behaviors.
- Invalid/expired/exhausted download link (403) → "this link is no longer
  valid, contact us" message, not a raw error.
- Signature verification failure on `/verify` (400) — shouldn't happen in
  the normal flow; shown as a generic error with a support contact.

## Testing

No test runner exists in this repo yet. If tests are added for this
feature, scope them to the two riskiest, most logic-heavy pieces:
1. The data-driven form renderer — correct input type per `fieldSchema`
   entry, `required`/`maxLength` enforcement.
2. The checkout state machine — the `form → preview → paying → polling →
   done` transitions and each error branch.

The Razorpay modal integration itself is not meaningfully unit-testable
(it depends on their real hosted script) — verified manually against
Razorpay's test-mode checkout instead.

## Explicitly out of scope

- Email delivery of the download link (already noted as a nice-to-have,
  not required, in the original backend spec).
- Any admin UI for managing the template catalog or browsing orders visually
  (both exist only as raw API endpoints today — a separate, smaller effort
  if wanted later).
- Any change to the already-reviewed backend order/payment/fulfillment
  logic beyond the one new preview endpoint in §1.
