# Digital Store Storefront — Design

*Revision 2 (2026-09-10): reworked the storefront section into a
conversion-focused experience per user feedback on the first draft.
Sections below are marked **[NEW]** or **[MODIFIED]** where they changed;
everything else is unchanged from revision 1. The backend order/payment/
fulfillment architecture is untouched throughout — no changes are made to
it beyond what revision 1 already specified (the preview endpoint).*

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
2. **[MODIFIED]** A new, small, additive piece of backend data — optional
   **marketing content** on each template (description, thumbnail,
   benefits, FAQ, etc.) — needed so the storefront below can be
   data-driven per product rather than hardcoded copy for one product.
3. The **storefront frontend** — a new route in the main `mcreatik` site
   (this repo), designed as a genuine sales experience: **Discover →
   Understand → Trust → Customize → Preview → Pay → Download**, not just
   a functional form-to-payment pipeline.

The catalog is explicitly designed to grow beyond the one current product
(a Wedding Photography Agreement) — the storefront must not assume any
product's specific fields, copy, or imagery.

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
  applies to both. This identity between preview and final output is the
  whole point: what the customer previews is provably what they'll get.
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

## 1b. **[NEW]** Backend addition: template marketing content

The expanded catalog cards and product page below (§2.2, §2.3) need
per-product copy and imagery that nothing in the current `Template` model
carries — today it's only `name`, `price`, `currency`, and the *form*
`fieldSchema`. Rather than overload `fieldSchema` (which is specifically
the form-field contract per the backend's own design notes) with unrelated
marketing copy, this adds one new, separate, **nullable** JSONB column:
`Template.marketingContent`.

**Not part of this repo** — same branch as §1. Purely additive: existing
templates keep working with `marketingContent: null`, and every
storefront section that reads from it must degrade gracefully (omit the
section, or fall back to a sane default) when a field is absent — a
product with no `benefits` array just doesn't show a benefits section,
rather than breaking.

Suggested shape (exact field list is an implementation detail, not a
contract other systems depend on):
```json
{
  "shortDescription": "One or two sentences for the catalog card.",
  "category": "Photography Agreements",
  "keyHighlight": "Ready in minutes",
  "thumbnailUrl": "https://.../thumb.jpg",
  "sampleDocumentImageUrl": "https://.../sample-page.jpg",
  "description": "Longer product-page description.",
  "benefits": ["Legally sound wording", "Editable every field", "Instant delivery"],
  "whatsIncluded": ["1-page signed agreement PDF", "Editable client + venue details"],
  "howItWorks": ["Fill in your details", "Preview the real document", "Pay and download instantly"],
  "faq": [{"question": "Can I edit it after buying?", "answer": "..."}]
}
```

Exposed on:
- `TemplateResponse` (public, `GET /api/v1/templates`) — read-only.
- `TemplateCreateRequest` / `TemplateAdminResponse` (admin catalog
  management, already built in Task 20) — so this content is genuinely
  CMS-managed, not hardcoded per product on either side.

This does not touch `Order`, payment, fulfillment, or any existing
validated business logic — it's new, optional data on `Template` only.

## 2. Frontend: storefront **[MODIFIED — reworked as a conversion funnel]**

**In this repo** (`mcreatik`), following existing conventions: plain
React + `react-router-dom`, `utils/cmsApi.js`-style fetch helpers, no
existing test runner (Vitest would be added fresh if tests are wanted).

### 2.0 **[NEW]** Customer journey

Every part of the storefront below maps to one stage of this funnel:

| Stage | Where |
|---|---|
| **Discover** | Catalog listing (§2.1) |
| **Understand** | Product hero, description, benefits, sample image, what's included, how it works (§2.2) |
| **Trust** | Trust & security section, FAQ (§2.2, §2.6) |
| **Customize** | The dynamic form (§2.3) |
| **Preview** | The live watermarked PDF (§2.4) |
| **Pay** | Checkout (§2.5) |
| **Download** | Post-payment states (§2.5) |

This ordering is deliberate: a buyer should understand and trust the
product *before* being asked to fill in personal details, not be dropped
straight into a form.

### Routes

- `GET /digital_store/` — catalog listing.
- `GET /digital_store/:templateId` — the full product page (§2.2 through
  §2.5, all on one page/scroll — no separate "info" vs "form" pages).
- `GET /digital_store/:templateId/order/:orderId` — reached only after a
  successful Razorpay payment; owns the post-payment states (§2.5).
  Having the order id in the URL means a page refresh at this stage
  doesn't strand the buyer.

### 2.1 Catalog listing & product cards **[MODIFIED — expanded card content]**

Fetches `GET /api/v1/templates`. Each card renders whatever the template
provides, all data-driven from `TemplateResponse` + its new
`marketingContent` (§1b) — nothing hardcoded per product:

- Cover/thumbnail image (`marketingContent.thumbnailUrl`) — falls back to
  a plain placeholder if absent, never breaks the layout.
- Product name (`name`) — always present.
- Short description (`marketingContent.shortDescription`) — omitted if
  absent.
- Category (`marketingContent.category`) — omitted if absent.
- Key highlight (`marketingContent.keyHighlight`) — e.g. a small badge —
  omitted if absent.
- Price/currency (`price`, `currency`) — always present.
- A single clear CTA ("View & Customize" or similar) linking to the
  product page.

A future second product with none of the optional marketing fields filled
in still renders a correct, if plainer, card — the card component never
assumes a field exists.

### 2.2 Product detail page **[NEW — full structure]**

Presented top-to-bottom as a single page, each section reading from
`marketingContent` where noted and gracefully omitted if that content is
absent (a product with no `faq` array simply has no FAQ section):

1. **Product hero** — name, price, primary CTA that scrolls down to the
   form (§2.3). The first thing the buyer sees.
2. **Product description** — `marketingContent.description`.
3. **Key benefits/features** — `marketingContent.benefits`, presented as
   a short scannable list, not paragraphs.
4. **Visual document preview** — a *static* sample image
   (`marketingContent.sampleDocumentImageUrl`) showing what the finished
   document generally looks like, before the buyer has entered anything.
   This is distinct from §2.4's *live* watermarked preview — this one is
   the same for every visitor; §2.4 is generated from the buyer's own
   data.
5. **What's included** — `marketingContent.whatsIncluded`.
6. **How it works** — `marketingContent.howItWorks`, a short numbered
   sequence (e.g. "Fill in your details → Preview the real document → Pay
   and download instantly") — sets expectations before the form.
7. **Dynamic customization form** — §2.3.
8. **Watermarked live PDF preview** — §2.4.
9. **Pricing/CTA** — the actual "Pay ₹{price}" action, repeated here after
   the buyer has seen their own document, which is the natural
   decision point.
10. **FAQ** — `marketingContent.faq`.
11. **Trust/security information** — §2.6.

### 2.3 The data-driven form (Customize)

One generic form-rendering component reads a template's `fieldSchema`
(already returned by `GET /api/v1/templates`: an array of `{name, type,
label, required, maxLength}`) and renders the matching input per field —
`type: "date"` → a date input, `"email"` → an email input with
browser-native validation, `"number"` → a number input, etc. — plus
client-side `required`/`maxLength` enforcement mirroring what the fields
declare. This is the component that makes the catalog's "add a new
product without touching frontend code" promise actually true: a new
template with a different field list needs zero changes here, and none of
the changes in this revision alter that — §1b's `marketingContent` is
entirely separate from `fieldSchema` and never mixes marketing copy into
form-field logic.

### 2.4 Preview **[MODIFIED — elevated to a core selling moment, not just a feature]**

Buyer fills the form and clicks **Preview**. Frontend `POST`s the current
field values to the preview endpoint (§1) and renders the returned PDF
inline, directly below the form, via an `<embed>`/`<iframe>` pointed at a
`blob:` URL built from the response bytes — no new tab, no page
navigation. Preview can be re-run any number of times as the buyer edits
the form; each click is a fresh, independent request.

This is framed to the buyer as the central trust mechanic of the whole
page, not an incidental technical feature: copy near the preview button
and the rendered result should make explicit that **this is their actual
document** — the same file they'll receive, watermarked only until
payment — directly answering "what am I actually buying?" before they're
asked to pay. This is also why the identical-renderer guarantee in §1
matters: the preview is not a mockup or an approximation.

### 2.5 Checkout & post-payment states **[MODIFIED — explicit state machine]**

**Checkout:**
1. Buyer clicks **Pay ₹{price}**. Frontend generates an `Idempotency-Key`
   (a client-side UUID) the *first* time this happens for the current
   form session, and re-sends the *same* key on any retry within that
   session — so an abandoned-then-resumed checkout reuses the same order
   instead of creating a duplicate.
2. `POST /api/v1/orders` with that header, `templateId`, `customerName`,
   `customerEmail`, and `fieldValues`. On success, the response carries
   `orderId`, `razorpayOrderId`, `razorpayKeyId`, `amount`, `currency`.
3. Open Razorpay's Checkout modal (their official `checkout.js`, loaded
   from Razorpay's CDN per their own integration docs — this is their
   standard hosted payment UI, not something to hand-build) with those
   values.
4. **Buyer cancels the modal:** return to the form. The order row exists
   but unpaid — nothing to clean up; clicking Pay again reuses it via the
   same idempotency key.

**Post-payment states** (each its own distinct, polished visual state —
not just text swaps — on `/digital_store/:templateId/order/:orderId`):

| State | Trigger | What the buyer sees |
|---|---|---|
| **Payment successful** | Razorpay callback fires | Brief confirmation ("Payment received") while `/verify` is first called |
| **Preparing document** | `/verify` returns `fulfilled: false` | A clear "preparing your document..." state (e.g. a progress indicator, not a spinner with no context); auto-polls `/verify` every few seconds |
| **Document ready** | `/verify` returns `fulfilled: true` | Confirmation state with the download action presented prominently |
| **Download** | Buyer clicks download | `GET /api/v1/orders/{orderId}/download?token={downloadToken}` — the backend redirects (302) straight to the signed R2 URL |

Confirmed against the backend: `/verify` is safe to call repeatedly once
already paid — `markPaid` and the fulfillment claim are both no-ops on
repeat, and a still-`false` response costs one cheap read. No backend
changes needed for this polling behavior.

**Page refresh mid-flow:** immediately after the Razorpay callback,
persist `{orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature}`
to `sessionStorage` (keyed by `orderId`). A refresh reads the order id
from the URL and the triple from `sessionStorage`, then resumes by
re-calling `/verify` — landing back on whichever state above is currently
accurate. If `sessionStorage` was cleared (different browser, cleared
site data), the page can't recover on its own — show a "contact us with
your order ID" message, since the backend has no public lookup by order
id alone (a deliberate security boundary: nothing lets a stranger query
someone else's order by guessing a UUID from the URL). **This specific
gap is the concrete motivation for prioritizing email delivery next — see
Roadmap.**

### 2.6 **[NEW]** Trust & security

A dedicated section (product page §2.2 item 11) plus supporting copy
elsewhere (e.g. near the pay button), covering only what's actually true
today:

- **Secure payment** — processed via Razorpay (name them; their brand
  recognition itself is trust-building, no need to over-explain).
- **Preview before you pay** — link back to §2.4's live preview as
  evidence, not just a claim.
- **Instant digital delivery** — no shipping, available immediately after
  payment.
- **One-time purchase** — where applicable to the product (some future
  product might not be, so this is conditional per product, not universal
  copy).
- **FAQ** — §2.2 item 10.
- **A real support/contact path** — reuse whatever contact mechanism
  (email/WhatsApp) the rest of the McreatiK site already uses; do not
  invent a new one for this section alone.

**Explicitly forbidden:** fabricated testimonials, star ratings, customer
counts, "as seen in" logos, certifications, or any other claim not
actually true today. If real testimonials/ratings exist someday, they can
be added as more `marketingContent` fields later — nothing here should be
invented to fill space now.

### 2.7 **[NEW]** Analytics readiness

Not a working analytics integration — just an architecture that doesn't
have to be reworked to add one later. A single, trivial utility (e.g.
`trackEvent(name, properties)`) that no-ops in this build, called at each
of these funnel points:

- `product_viewed` — product page mounts
- `form_started` — first field interaction
- `preview_requested` — Preview button clicked
- `preview_generated` — preview PDF successfully rendered
- `checkout_initiated` — Pay button clicked, before the Razorpay modal opens
- `payment_successful` — Razorpay callback fires
- `download_initiated` — download button clicked

Wiring a real provider (GA4, PostHog, whatever's chosen later) later means
implementing that one function's body — no call sites change. No
dashboards, no provider selection, no event schema beyond this list are
part of this build.

### 2.8 **[NEW]** Responsive design

The form, the live PDF preview, all CTAs, the checkout transition, and
the post-payment/download states must each be explicitly designed for
mobile, tablet, and desktop — this is a requirement on the design/build,
not an afterthought pass at the end. The PDF preview in particular needs
real attention on mobile: an embedded PDF viewer that's usable on a small
screen (not just the desktop layout shrunk down) is part of "done" for
§2.4, not a nice-to-have.

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
2. The checkout state machine — the `payment successful → preparing →
   ready → download` transitions (§2.5) and each error branch.

The Razorpay modal integration itself is not meaningfully unit-testable
(it depends on their real hosted script) — verified manually against
Razorpay's test-mode checkout instead.

## Roadmap / future work **[NEW]**

Not part of this build, kept here so the reasoning isn't lost:

- **Email delivery of the download link — high priority next step.** The
  current recovery mechanism for a mid-flow page refresh relies entirely
  on `sessionStorage` (§2.5), which is lost on a different browser/device
  or cleared site data. Emailing the download link the moment fulfillment
  completes removes this single point of fragility and is the natural
  next investment once the storefront itself is live.
- **Real analytics provider** wired into the `trackEvent` hooks (§2.7).
- **Admin UI** for managing the template catalog and browsing orders
  visually (both exist only as raw API endpoints today).

## Explicitly out of scope for this build

- Email delivery (see Roadmap — deliberately deferred, not forgotten).
- Any admin UI (see Roadmap).
- Fabricated trust signals of any kind (§2.6) — this is a hard constraint,
  not a deferred feature.
- A working analytics integration (§2.7 is architecture-readiness only).
- Any change to the already-reviewed backend order/payment/fulfillment
  logic beyond §1's preview endpoint and §1b's additive `marketingContent`
  field.
