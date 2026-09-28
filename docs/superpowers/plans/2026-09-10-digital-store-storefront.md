# Digital Store Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the buyer-facing storefront at `/digital_store/` — a conversion-focused catalog and product page (Discover → Understand → Trust → Customize → Preview → Pay → Download) on top of the already-built, already-reviewed digital-store backend.

**Architecture:** Plain React 19 function components + hooks, `react-router-dom` v7 routes lazy-loaded from `App.jsx` exactly like every existing page. One thin `fetch`-based API client module mirrors the existing `utils/cmsApi.js` pattern. One generic, schema-driven form component renders any template's fields with zero product-specific code. A dedicated hook (`useCheckout`) owns the Razorpay Checkout lifecycle and the idempotency-key/session-recovery logic. The riskiest, most logic-heavy pieces (the schema-driven form and the checkout state machine) get real automated tests; this repo has no test runner today, so Task 1 adds one (Vitest + React Testing Library) before anything else.

**Tech Stack:** React 19, react-router-dom 7, Vite 8, Tailwind CSS 4 (existing). New: Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom (all dev-only). Razorpay's hosted `checkout.js`, loaded dynamically at runtime (not bundled, not added to `index.html` globally — only the product page needs it).

**Spec:** `docs/superpowers/specs/2026-09-10-digital-store-storefront-design.md` (this repo) — revision 2, the conversion-focused version. This plan implements §2 in full. §1 and §1b (the backend preview endpoint and `Template.marketingContent`) are implemented separately in the `mcreatik-backend` repo per `docs/superpowers/plans/2026-09-10-digital-store-marketing-and-preview.md` there — **that plan must be complete and merged into the branch you're testing against before Task 8 of this plan (Preview) or Task 9 (Checkout) can be manually verified end-to-end**, though every task's automated tests mock the backend and don't require it running.

## Global Constraints

- Zero product-specific code anywhere in this plan — every component reads from a template's `fieldSchema`/`marketingContent`/`price`/`name`, never a hardcoded field name or hardcoded copy string. A second product must work with zero changes to any file this plan creates.
- Every marketing-content-driven section must render correctly (by omitting itself, not crashing) when its underlying `marketingContent` field is `null`/`undefined` — `marketingContent` itself may be entirely absent on a template.
- No fabricated trust signals anywhere (no testimonials, ratings, customer counts, or certifications) — nothing in this plan's copy should imply any of these exist.
- Number-typed fields (`fieldSchema` entries with `type: "number"`) must be sent to the backend as actual JSON numbers, not strings — the backend's field validator type-checks them.
- The Razorpay checkout script is loaded dynamically, only when a buyer reaches the point of paying — never added to `index.html` globally (this codebase's existing pages are lazy-loaded specifically so a visitor "only ever downloads the one they chose"; the same discipline applies here).
- `VITE_API_BASE_URL` is already configured in `.env`/`.env.production` (used by the existing `utils/cmsApi.js`) — reuse it, do not add a new env var.
- Follow this repo's existing conventions throughout: plain JS/JSX (no TypeScript), the `StudiosPageShell` layout wrapper for every new page (this is a Studios product), `useSEO` for page metadata, `getWhatsAppHref` from `utils/whatsapp.js` for the support/contact path, and the `window.gtag`-based analytics pattern already used in `hooks/useForm.js` (confirmed wired in `index.html`).

---

### Task 1: Test infrastructure

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test-setup.js`
- Test: `src/utils/digitalStoreTestSetup.smoke.test.js`

**Interfaces:** none — this task only makes `npm test` work at all.

- [ ] **Step 1: Install the test dependencies**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Point Vite's config import at `vitest/config`**

`vitest/config` re-exports Vite's own `defineConfig` (a drop-in replacement) while additionally recognizing the `test` key — this is the officially documented way to keep one config file for both Vite and Vitest rather than adding a second config file.

Modify `vite.config.js`'s first line:

```js
import { defineConfig } from 'vitest/config'
```

Add a `test` key alongside the existing `plugins`/`base`/`optimizeDeps`/`build` keys:

```js
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
```

- [ ] **Step 3: Add the setup file**

```js
// src/test-setup.js
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add the `test` script**

In `package.json`'s `"scripts"`, add:

```json
    "test": "vitest run",
```

- [ ] **Step 5: Write a smoke test to prove the harness works**

```js
// src/utils/digitalStoreTestSetup.smoke.test.js
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Hello() {
  return <div>hello digital store</div>
}

describe('test harness', () => {
  it('renders a component and finds it via Testing Library + jest-dom matchers', () => {
    render(<Hello />)
    expect(screen.getByText('hello digital store')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: PASS — 1 test file, 1 test.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test-setup.js \
        src/utils/digitalStoreTestSetup.smoke.test.js
git commit -m "$(cat <<'EOF'
Add Vitest + React Testing Library test infrastructure

No test runner existed in this repo before. vitest/config is a drop-in
replacement for vite's own defineConfig, so this is one config file, not
two. Needed before the digital store's schema-driven form and checkout
state machine can get real automated tests.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

(You may delete `src/utils/digitalStoreTestSetup.smoke.test.js` once Task 4 or later adds real tests, or leave it — it costs nothing to keep as a harness sanity check. Do not delete it before at least one later task's tests are green, so there's always a working baseline to compare against if something breaks.)

---

### Task 2: API client

**Files:**
- Create: `src/utils/digitalStoreApi.js`
- Test: `src/utils/digitalStoreApi.test.js`

**Interfaces:**
- Produces: `fetchDigitalStoreTemplates(): Promise<Template[]>`; `fetchDigitalStoreTemplate(templateId): Promise<Template>`; `requestDigitalStorePreview(templateId, fieldValues): Promise<Blob>`; `createDigitalStoreOrder(idempotencyKey, {templateId, customerName, customerEmail, fieldValues}): Promise<{orderId, razorpayOrderId, razorpayKeyId, amount, currency}>`; `verifyDigitalStoreOrder(orderId, {razorpayOrderId, razorpayPaymentId, razorpaySignature}): Promise<{orderId, fulfilled, downloadToken, downloadTokenExpiresAt}>`; `digitalStoreDownloadUrl(orderId, downloadToken): string`; `class DigitalStoreApiError extends Error` with `.status` (number) and `.fieldErrors` (object or null).
- Consumes: the backend's `GET /api/v1/templates`, `POST /api/v1/templates/{id}/preview`, `POST /api/v1/orders`, `POST /api/v1/orders/{id}/verify`, `GET /api/v1/orders/{id}/download` — all already built (the first two ship via the separate backend plan referenced above; the last three already exist on `master`... actually on branch `digital-store-order-payment`, not yet merged — see that branch's own already-reviewed work).

`Template` shape returned by the backend: `{id, name, shootType, price, currency, fieldSchema, marketingContent}` — `fieldSchema` is `{fields: [{name, type, label, required, maxLength}, ...]}` and `marketingContent` may be `null`.

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/digitalStoreApi.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchDigitalStoreTemplates,
  fetchDigitalStoreTemplate,
  requestDigitalStorePreview,
  createDigitalStoreOrder,
  verifyDigitalStoreOrder,
  digitalStoreDownloadUrl,
  DigitalStoreApiError,
} from './digitalStoreApi'

const SAMPLE_TEMPLATE = {
  id: 'template-1',
  name: 'Wedding Photography Agreement',
  shootType: 'WEDDING',
  price: 99.0,
  currency: 'INR',
  fieldSchema: { fields: [{ name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 }] },
  marketingContent: null,
}

beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchDigitalStoreTemplates', () => {
  it('returns the parsed template list on success', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_TEMPLATE] })

    const templates = await fetchDigitalStoreTemplates()

    expect(templates).toEqual([SAMPLE_TEMPLATE])
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/templates'))
  })

  it('throws DigitalStoreApiError on a non-ok response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({ message: 'boom' }) })

    await expect(fetchDigitalStoreTemplates()).rejects.toThrow(DigitalStoreApiError)
  })
})

describe('fetchDigitalStoreTemplate', () => {
  it('finds the matching template by id from the list', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_TEMPLATE] })

    const template = await fetchDigitalStoreTemplate('template-1')

    expect(template).toEqual(SAMPLE_TEMPLATE)
  })

  it('throws when no template matches the id', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [SAMPLE_TEMPLATE] })

    await expect(fetchDigitalStoreTemplate('missing')).rejects.toThrow()
  })
})

describe('requestDigitalStorePreview', () => {
  it('POSTs fieldValues and returns the response blob on success', async () => {
    const fakeBlob = new Blob(['%PDF-'], { type: 'application/pdf' })
    global.fetch.mockResolvedValue({ ok: true, blob: async () => fakeBlob })

    const blob = await requestDigitalStorePreview('template-1', { brideName: 'Jane' })

    expect(blob).toBe(fakeBlob)
    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toContain('/api/v1/templates/template-1/preview')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ fieldValues: { brideName: 'Jane' } })
  })

  it('throws DigitalStoreApiError with fieldErrors on a 400 validation response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Validation failed', fieldErrors: { brideName: 'is required' } }),
    })

    await expect(requestDigitalStorePreview('template-1', {})).rejects.toMatchObject({
      status: 400,
      fieldErrors: { brideName: 'is required' },
    })
  })
})

describe('createDigitalStoreOrder', () => {
  it('sends the Idempotency-Key header and returns the created order', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR' }),
    })

    const order = await createDigitalStoreOrder('idem-1', {
      templateId: 'template-1', customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {},
    })

    expect(order.orderId).toBe('order-1')
    const [, options] = global.fetch.mock.calls[0]
    expect(options.headers['Idempotency-Key']).toBe('idem-1')
  })

  it('throws DigitalStoreApiError on a 429 rate-limit response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 429, json: async () => ({ message: 'slow down' }) })

    await expect(
      createDigitalStoreOrder('idem-1', { templateId: 't', customerName: 'J', customerEmail: 'j@e.com', fieldValues: {} })
    ).rejects.toMatchObject({ status: 429 })
  })
})

describe('verifyDigitalStoreOrder', () => {
  it('returns the verify response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-1', fulfilled: true, downloadToken: 'tok', downloadTokenExpiresAt: '2026-01-01T00:00:00Z' }),
    })

    const result = await verifyDigitalStoreOrder('order-1', {
      razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })

    expect(result.fulfilled).toBe(true)
  })
})

describe('digitalStoreDownloadUrl', () => {
  it('builds a URL with the order id and url-encoded token', () => {
    const url = digitalStoreDownloadUrl('order-1', 'a token/with-chars')

    expect(url).toContain('/api/v1/orders/order-1/download')
    expect(url).toContain(`token=${encodeURIComponent('a token/with-chars')}`)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- digitalStoreApi`
Expected: FAIL — `src/utils/digitalStoreApi.js` doesn't exist yet.

- [ ] **Step 3: Write `digitalStoreApi.js`**

```js
// src/utils/digitalStoreApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL

export class DigitalStoreApiError extends Error {
  constructor(status, body) {
    super(body?.message || `Request failed with status ${status}`)
    this.status = status
    this.fieldErrors = body?.fieldErrors || null
  }
}

async function parseErrorBody(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new DigitalStoreApiError(res.status, await parseErrorBody(res))
  }
  return res.json()
}

async function postJson(path, body, extraHeaders = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new DigitalStoreApiError(res.status, await parseErrorBody(res))
  }
  return res.json()
}

export async function fetchDigitalStoreTemplates() {
  return getJson('/api/v1/templates')
}

// The backend has no single-template lookup endpoint - only the list. Fetching the
// whole (small, single-digit-count) catalog and finding by id client-side is a
// deliberate, small trade-off rather than adding a new backend endpoint for this.
export async function fetchDigitalStoreTemplate(templateId) {
  const templates = await fetchDigitalStoreTemplates()
  const template = templates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }
  return template
}

export async function requestDigitalStorePreview(templateId, fieldValues) {
  const res = await fetch(`${API_BASE}/api/v1/templates/${templateId}/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fieldValues }),
  })
  if (!res.ok) {
    throw new DigitalStoreApiError(res.status, await parseErrorBody(res))
  }
  return res.blob()
}

export async function createDigitalStoreOrder(idempotencyKey, { templateId, customerName, customerEmail, fieldValues }) {
  return postJson('/api/v1/orders', { templateId, customerName, customerEmail, fieldValues }, {
    'Idempotency-Key': idempotencyKey,
  })
}

export async function verifyDigitalStoreOrder(orderId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  return postJson(`/api/v1/orders/${orderId}/verify`, { razorpayOrderId, razorpayPaymentId, razorpaySignature })
}

export function digitalStoreDownloadUrl(orderId, downloadToken) {
  return `${API_BASE}/api/v1/orders/${orderId}/download?token=${encodeURIComponent(downloadToken)}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- digitalStoreApi`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/digitalStoreApi.js src/utils/digitalStoreApi.test.js
git commit -m "$(cat <<'EOF'
Add digital store API client

Thin fetch wrapper for the templates/orders/preview/verify/download
endpoints, mirroring the existing cmsApi.js pattern. DigitalStoreApiError
carries status + fieldErrors so callers can distinguish validation (400)
from rate-limiting (429) from gateway failures (502) per the spec's
error-handling section.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Analytics + Razorpay script loader utilities

**Files:**
- Create: `src/utils/digitalStoreAnalytics.js`
- Create: `src/utils/razorpayScriptLoader.js`
- Test: `src/utils/digitalStoreAnalytics.test.js`
- Test: `src/utils/razorpayScriptLoader.test.js`

**Interfaces:**
- Produces: `DIGITAL_STORE_EVENTS` (object of event-name constants: `PRODUCT_VIEWED`, `FORM_STARTED`, `PREVIEW_REQUESTED`, `PREVIEW_GENERATED`, `CHECKOUT_INITIATED`, `PAYMENT_SUCCESSFUL`, `DOWNLOAD_INITIATED`); `trackDigitalStoreEvent(eventName, params = {}): void`; `loadRazorpayCheckoutScript(): Promise<void>`.
- Consumes: `window.gtag` (already wired globally in `index.html`, confirmed by the existing pattern in `hooks/useForm.js`) if present; `window.Razorpay` (set by the script this module loads).

This task is genuinely small — the spec calls for analytics *readiness*, not a new system, and this codebase already has a working `gtag` pattern to reuse directly (see `hooks/useForm.js`'s own private `trackEvent` helper) rather than build a no-op stub.

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/digitalStoreAnalytics.test.js
import { describe, it, expect, vi, afterEach } from 'vitest'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from './digitalStoreAnalytics'

afterEach(() => {
  delete window.gtag
})

describe('trackDigitalStoreEvent', () => {
  it('calls window.gtag with the event name and params when gtag is available', () => {
    window.gtag = vi.fn()

    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: 't1' })

    expect(window.gtag).toHaveBeenCalledWith('event', DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: 't1' })
  })

  it('does not throw when window.gtag is unavailable', () => {
    expect(() => trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED)).not.toThrow()
  })
})
```

```js
// src/utils/razorpayScriptLoader.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadRazorpayCheckoutScript } from './razorpayScriptLoader'

beforeEach(() => {
  delete window.Razorpay
  document.querySelectorAll('script[data-razorpay-checkout]').forEach((el) => el.remove())
})

describe('loadRazorpayCheckoutScript', () => {
  it('resolves immediately if window.Razorpay already exists', async () => {
    window.Razorpay = vi.fn()

    await expect(loadRazorpayCheckoutScript()).resolves.toBeUndefined()
    expect(document.querySelectorAll('script[data-razorpay-checkout]')).toHaveLength(0)
  })

  it('injects the script tag once and resolves when it loads', async () => {
    const promise = loadRazorpayCheckoutScript()
    const script = document.querySelector('script[data-razorpay-checkout]')
    expect(script).not.toBeNull()
    expect(script.src).toBe('https://checkout.razorpay.com/v1/checkout.js')

    script.onload()

    await expect(promise).resolves.toBeUndefined()
  })

  it('reuses the same in-flight promise on a second call before the script loads', async () => {
    const first = loadRazorpayCheckoutScript()
    const second = loadRazorpayCheckoutScript()

    expect(document.querySelectorAll('script[data-razorpay-checkout]')).toHaveLength(1)

    document.querySelector('script[data-razorpay-checkout]').onload()
    await Promise.all([first, second])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- digitalStoreAnalytics razorpayScriptLoader`
Expected: FAIL — neither module exists yet.

- [ ] **Step 3: Write `digitalStoreAnalytics.js`**

```js
// src/utils/digitalStoreAnalytics.js
export const DIGITAL_STORE_EVENTS = {
  PRODUCT_VIEWED: 'digital_store_product_viewed',
  FORM_STARTED: 'digital_store_form_started',
  PREVIEW_REQUESTED: 'digital_store_preview_requested',
  PREVIEW_GENERATED: 'digital_store_preview_generated',
  CHECKOUT_INITIATED: 'digital_store_checkout_initiated',
  PAYMENT_SUCCESSFUL: 'digital_store_payment_successful',
  DOWNLOAD_INITIATED: 'digital_store_download_initiated',
}

// Reuses the same window.gtag mechanism already wired in index.html and already
// used by hooks/useForm.js - this is real analytics from day one, not a deferred
// stub, since the mechanism already exists and costs nothing extra to call.
export function trackDigitalStoreEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}
```

- [ ] **Step 4: Write `razorpayScriptLoader.js`**

```js
// src/utils/razorpayScriptLoader.js
let inFlightPromise = null

// Deliberately NOT added to index.html globally - this codebase lazy-loads every
// page specifically so a visitor only downloads what they chose (see App.jsx's own
// header comment). Razorpay's checkout.js only loads when a buyer actually reaches
// the point of paying.
export function loadRazorpayCheckoutScript() {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve()
  }
  if (inFlightPromise) {
    return inFlightPromise
  }
  inFlightPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve()
    script.onerror = () => {
      inFlightPromise = null
      reject(new Error('Failed to load the Razorpay checkout script'))
    }
    document.body.appendChild(script)
  })
  return inFlightPromise
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- digitalStoreAnalytics razorpayScriptLoader`
Expected: PASS (all tests in both files).

- [ ] **Step 6: Commit**

```bash
git add src/utils/digitalStoreAnalytics.js src/utils/digitalStoreAnalytics.test.js \
        src/utils/razorpayScriptLoader.js src/utils/razorpayScriptLoader.test.js
git commit -m "$(cat <<'EOF'
Add digital store analytics events and Razorpay script loader

trackDigitalStoreEvent reuses the gtag mechanism already wired in
index.html (same pattern hooks/useForm.js already uses) - real analytics
from day one, not a deferred no-op. The Razorpay script loads lazily,
only on the product page, never bundled globally.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Data-driven form component

**Files:**
- Create: `src/components/digital-store/ProductForm.jsx`
- Test: `src/components/digital-store/ProductForm.test.jsx`

**Interfaces:**
- Produces: `<ProductForm fieldSchema={template.fieldSchema} values={values} onChange={(name, value) => void} serverErrors={{}} onFirstInteraction={() => void} />` — a controlled component; the parent owns `values` state.
- Consumes: nothing beyond its props — this is the component that makes "add a product without touching frontend code" true, so it must never import or reference any specific field name.

`fieldSchema` shape: `{fields: [{name, type, label, required, maxLength}, ...]}`. Known `type` values seen from the backend: `"string"`, `"tel"`, `"email"`, `"date"`, `"number"`. Any unrecognized type falls back to a plain text input rather than crashing — a future field type this component doesn't specifically know about should still render *something* usable.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/digital-store/ProductForm.test.jsx
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
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- ProductForm`
Expected: FAIL — `ProductForm.jsx` doesn't exist yet.

- [ ] **Step 3: Write `ProductForm.jsx`**

```jsx
// src/components/digital-store/ProductForm.jsx
import { useState, useRef } from 'react'

const KNOWN_INPUT_TYPES = new Set(['text', 'tel', 'email', 'date', 'number'])

function resolveInputType(fieldType) {
  if (fieldType === 'string') return 'text'
  return KNOWN_INPUT_TYPES.has(fieldType) ? fieldType : 'text'
}

function coerceValue(field, rawValue) {
  if (field.type === 'number') {
    return rawValue === '' ? '' : Number(rawValue)
  }
  return rawValue
}

function clientValidate(field, value) {
  const isEmpty = value === undefined || value === null || value === ''
  if (field.required && isEmpty) {
    return `${field.label} is required`
  }
  return null
}

/**
 * Renders one input per fieldSchema entry - the whole point of this component is
 * that it never references a specific field name, so a new product's fieldSchema
 * "just works" with zero changes here.
 */
export default function ProductForm({ fieldSchema, values, onChange, serverErrors = {}, onFirstInteraction }) {
  const [touched, setTouched] = useState({})
  const hasInteracted = useRef(false)

  function handleChange(field, rawValue) {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      onFirstInteraction?.()
    }
    onChange(field.name, coerceValue(field, rawValue))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field.name]: true }))
  }

  return (
    <form className="space-y-5">
      {fieldSchema.fields.map((field) => {
        const value = values[field.name] ?? ''
        const clientError = touched[field.name] ? clientValidate(field, value) : null
        const error = serverErrors[field.name] || clientError

        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">
              {field.label}
              {field.required ? ' *' : ''}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={resolveInputType(field.type)}
              required={field.required}
              maxLength={field.maxLength}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C9971F]"
            />
            {error ? (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>
        )
      })}
    </form>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- ProductForm`
Expected: PASS (all 9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/digital-store/ProductForm.jsx src/components/digital-store/ProductForm.test.jsx
git commit -m "$(cat <<'EOF'
Add schema-driven ProductForm component

Renders one input per fieldSchema entry with no product-specific field
names anywhere - a second product's different field list needs zero
changes here. Number-typed fields coerce to real JS numbers on change,
since the backend's field validator type-checks them.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Checkout hook

**Files:**
- Create: `src/hooks/useCheckout.js`
- Test: `src/hooks/useCheckout.test.js`

**Interfaces:**
- Produces: `useCheckout(template)` returning `{status, error, startCheckout(customerDetails, {onSuccess})}`. `status` is one of `'idle' | 'creating_order' | 'awaiting_payment' | 'error'`. `startCheckout` is async; on a successful payment it writes `{orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature}` to `sessionStorage` under key `` `digital-store-order-${orderId}` `` and calls `onSuccess(orderId)`.
- Consumes: `createDigitalStoreOrder` (Task 2), `loadRazorpayCheckoutScript` (Task 3), `trackDigitalStoreEvent`/`DIGITAL_STORE_EVENTS` (Task 3), the global `window.Razorpay` constructor the loaded script provides.

- [ ] **Step 1: Write the failing tests**

```js
// src/hooks/useCheckout.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCheckout } from './useCheckout'
import * as api from '../utils/digitalStoreApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'

const TEMPLATE = { id: 'template-1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR' }

beforeEach(() => {
  sessionStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
})

function mockRazorpayCapturingOptions() {
  let capturedOptions = null
  const openMock = vi.fn()
  window.Razorpay = vi.fn((options) => {
    capturedOptions = options
    return { open: openMock }
  })
  return { getOptions: () => capturedOptions, openMock }
}

describe('useCheckout', () => {
  it('goes idle -> creating_order -> awaiting_payment and opens Razorpay on a successful order creation', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { openMock } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    expect(result.current.status).toBe('idle')

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('awaiting_payment')
    expect(openMock).toHaveBeenCalledTimes(1)
  })

  it('reuses the same idempotency key across two calls to startCheckout', async () => {
    const createOrderSpy = vi
      .spyOn(api, 'createDigitalStoreOrder')
      .mockResolvedValue({ orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR' })
    mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const details = { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} }

    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })
    await act(async () => {
      await result.current.startCheckout(details, { onSuccess: vi.fn() })
    })

    const [firstKey] = createOrderSpy.mock.calls[0]
    const [secondKey] = createOrderSpy.mock.calls[1]
    expect(firstKey).toBe(secondKey)
  })

  it('persists payment details to sessionStorage and calls onSuccess when Razorpay reports success', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayKeyId: 'rzp_key', amount: 99.0, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess }
      )
    })

    act(() => {
      getOptions().handler({
        razorpay_order_id: 'rzp_order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'sig_1',
      })
    })

    expect(onSuccess).toHaveBeenCalledWith('order-1')
    const stored = JSON.parse(sessionStorage.getItem('digital-store-order-order-1'))
    expect(stored).toEqual({
      orderId: 'order-1', razorpayOrderId: 'rzp_order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    expect(result.current.status).toBe('idle')
  })

  it('returns to idle when the buyer dismisses the Razorpay modal', async () => {
    vi.spyOn(api, 'createDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayKeyId: 'k', amount: 99, currency: 'INR',
    })
    const { getOptions } = mockRazorpayCapturingOptions()
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    act(() => {
      getOptions().modal.ondismiss()
    })

    expect(result.current.status).toBe('idle')
  })

  it('sets status to error and captures the error when order creation fails', async () => {
    const failure = Object.assign(new Error('rate limited'), { status: 429 })
    vi.spyOn(api, 'createDigitalStoreOrder').mockRejectedValue(failure)
    const { result } = renderHook(() => useCheckout(TEMPLATE))

    await act(async () => {
      await result.current.startCheckout(
        { customerName: 'Jane', customerEmail: 'jane@example.com', fieldValues: {} },
        { onSuccess: vi.fn() }
      )
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe(failure)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- useCheckout`
Expected: FAIL — `useCheckout.js` doesn't exist yet.

- [ ] **Step 3: Write `useCheckout.js`**

```js
// src/hooks/useCheckout.js
import { useRef, useState } from 'react'
import { createDigitalStoreOrder } from '../utils/digitalStoreApi'
import { loadRazorpayCheckoutScript } from '../utils/razorpayScriptLoader'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'

function sessionStorageKeyFor(orderId) {
  return `digital-store-order-${orderId}`
}

export function useCheckout(template) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const idempotencyKeyRef = useRef(null)

  function getIdempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }
    return idempotencyKeyRef.current
  }

  async function startCheckout({ customerName, customerEmail, fieldValues }, { onSuccess }) {
    setStatus('creating_order')
    setError(null)
    try {
      const order = await createDigitalStoreOrder(getIdempotencyKey(), {
        templateId: template.id,
        customerName,
        customerEmail,
        fieldValues,
      })

      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.CHECKOUT_INITIATED, { template_id: template.id })

      await loadRazorpayCheckoutScript()

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        order_id: order.razorpayOrderId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: 'McreatiK Studios',
        description: template.name,
        handler: (response) => {
          const paymentDetails = {
            orderId: order.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }
          sessionStorage.setItem(sessionStorageKeyFor(order.orderId), JSON.stringify(paymentDetails))
          trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PAYMENT_SUCCESSFUL, {
            template_id: template.id,
            order_id: order.orderId,
          })
          setStatus('idle')
          onSuccess(order.orderId)
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      })

      setStatus('awaiting_payment')
      razorpay.open()
    } catch (err) {
      setStatus('error')
      setError(err)
    }
  }

  return { status, error, startCheckout }
}

export function readStoredPaymentDetails(orderId) {
  const raw = sessionStorage.getItem(sessionStorageKeyFor(orderId))
  return raw ? JSON.parse(raw) : null
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- useCheckout`
Expected: PASS (all 5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCheckout.js src/hooks/useCheckout.test.js
git commit -m "$(cat <<'EOF'
Add useCheckout hook: idempotency key, order creation, Razorpay modal

Reuses one idempotency key across retries within a checkout session so
an abandoned-then-resumed payment reuses the same order instead of
creating a duplicate. Persists the Razorpay callback's payment details to
sessionStorage on success, which is what makes the post-payment order
page's mid-flow refresh recovery possible.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Catalog page

**Files:**
- Create: `src/components/digital-store/ProductCard.jsx`
- Create: `src/pages/DigitalStoreCatalogPage.jsx`
- Test: `src/components/digital-store/ProductCard.test.jsx`

**Interfaces:**
- Produces: `<ProductCard template={template} />` (a `<Link>` to `/digital_store/{template.id}`); `DigitalStoreCatalogPage` (default export, a route-level page component, no props — fetches its own data).
- Consumes: `fetchDigitalStoreTemplates` (Task 2), `StudiosPageShell`, `useSEO` (both pre-existing).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/digital-store/ProductCard.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

function renderCard(template) {
  render(
    <MemoryRouter>
      <ProductCard template={template} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders name, price, and currency, which are always present', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText(/99/)).toBeInTheDocument()
    expect(screen.getByText(/INR/)).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/digital_store/t1')
  })

  it('renders no optional marketing content when marketingContent is null', () => {
    renderCard({ id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR', marketingContent: null })

    expect(screen.queryByTestId('product-card-category')).not.toBeInTheDocument()
    expect(screen.queryByTestId('product-card-highlight')).not.toBeInTheDocument()
  })

  it('renders optional marketing content when present', () => {
    renderCard({
      id: 't1', name: 'Wedding Photography Agreement', price: 99.0, currency: 'INR',
      marketingContent: { shortDescription: 'A lovely agreement.', category: 'Agreements', keyHighlight: 'Ready in minutes' },
    })

    expect(screen.getByText('A lovely agreement.')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-category')).toHaveTextContent('Agreements')
    expect(screen.getByTestId('product-card-highlight')).toHaveTextContent('Ready in minutes')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProductCard`
Expected: FAIL — `ProductCard.jsx` doesn't exist yet.

- [ ] **Step 3: Write `ProductCard.jsx`**

```jsx
// src/components/digital-store/ProductCard.jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ template }) {
  const marketing = template.marketingContent || {}

  return (
    <Link
      to={`/digital_store/${template.id}`}
      className="block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {marketing.thumbnailUrl ? (
        <img src={marketing.thumbnailUrl} alt={template.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100" aria-hidden="true" />
      )}
      <div className="p-5">
        {marketing.category ? (
          <p data-testid="product-card-category" className="text-xs uppercase tracking-wide text-[#C9971F] mb-1">
            {marketing.category}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold">{template.name}</h3>
        {marketing.shortDescription ? <p className="text-sm text-gray-600 mt-1">{marketing.shortDescription}</p> : null}
        {marketing.keyHighlight ? (
          <span data-testid="product-card-highlight" className="inline-block mt-2 text-xs font-medium bg-[#C9971F]/10 text-[#C9971F] px-2 py-1 rounded">
            {marketing.keyHighlight}
          </span>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">
            {template.currency} {template.price}
          </span>
          <span className="text-sm font-medium text-[#C9971F]">View & Customize →</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProductCard`
Expected: PASS (all 4 tests).

- [ ] **Step 5: Write `DigitalStoreCatalogPage.jsx`** (no test — this is a thin data-fetching wrapper; its only real logic, the card, is already tested)

```jsx
// src/pages/DigitalStoreCatalogPage.jsx
import { useEffect, useState } from 'react'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import ProductCard from '../components/digital-store/ProductCard'
import { fetchDigitalStoreTemplates } from '../utils/digitalStoreApi'
import { useSEO } from '../hooks/useSEO'

export default function DigitalStoreCatalogPage() {
  const [templates, setTemplates] = useState(null)
  const [error, setError] = useState(null)

  useSEO({
    title: 'Digital Store | McreatiK Studios',
    description: 'Ready-to-customize photography documents — fill in your details, preview instantly, and download.',
    path: '/digital_store',
  })

  useEffect(() => {
    let cancelled = false
    fetchDigitalStoreTemplates()
      .then((result) => {
        if (!cancelled) setTemplates(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <StudiosPageShell>
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-2">Digital Store</h1>
        <p className="text-gray-600 mb-10">Customizable documents, ready in minutes.</p>

        {error ? <p className="text-red-600">Something went wrong loading the catalog. Please try again shortly.</p> : null}
        {!templates && !error ? <p className="text-gray-500">Loading...</p> : null}
        {templates && templates.length === 0 ? <p className="text-gray-500">No products available right now.</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <ProductCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </StudiosPageShell>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/digital-store/ProductCard.jsx src/components/digital-store/ProductCard.test.jsx \
        src/pages/DigitalStoreCatalogPage.jsx
git commit -m "$(cat <<'EOF'
Add digital store catalog page and product card

Card renders thumbnail/category/description/highlight only when present
on marketingContent - a product with none of the optional fields filled
in still renders a correct, plainer card.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Product marketing sections

**Files:**
- Create: `src/components/digital-store/ProductMarketingSections.jsx`
- Test: `src/components/digital-store/ProductMarketingSections.test.jsx`

**Interfaces:**
- Produces: `<ProductHero template={template} onGetStarted={() => void} />`, `<ProductStorySections marketingContent={marketingContent} />` (description, benefits, sample image, what's included, how it works — all conditional), `<ProductFAQSection faq={marketingContent?.faq} />`, `<ProductTrustSection oneTimePurchase={boolean} />`. All exported from this one file (they're small and always used together on the product page, per Task 9).
- Consumes: `getWhatsAppHref` (pre-existing, for the trust section's support link).

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/digital-store/ProductMarketingSections.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductHero, ProductStorySections, ProductFAQSection, ProductTrustSection } from './ProductMarketingSections'

describe('ProductHero', () => {
  it('renders the template name and price', () => {
    render(<ProductHero template={{ name: 'Wedding Photography Agreement', price: 99, currency: 'INR' }} onGetStarted={() => {}} />)

    expect(screen.getByText('Wedding Photography Agreement')).toBeInTheDocument()
    expect(screen.getByText(/99/)).toBeInTheDocument()
  })
})

describe('ProductStorySections', () => {
  it('renders nothing extra when marketingContent is null', () => {
    const { container } = render(<ProductStorySections marketingContent={null} />)

    expect(container.querySelectorAll('section')).toHaveLength(0)
  })

  it('renders only the sections whose content is present', () => {
    render(
      <ProductStorySections
        marketingContent={{
          description: 'A full description.',
          benefits: ['Fast', 'Editable'],
        }}
      />
    )

    expect(screen.getByText('A full description.')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Editable')).toBeInTheDocument()
    expect(screen.queryByText(/what's included/i)).not.toBeInTheDocument()
  })

  it('renders whatsIncluded and howItWorks when present', () => {
    render(
      <ProductStorySections
        marketingContent={{
          whatsIncluded: ['1-page PDF'],
          howItWorks: ['Fill in your details', 'Preview', 'Pay and download'],
        }}
      />
    )

    expect(screen.getByText(/what's included/i)).toBeInTheDocument()
    expect(screen.getByText('1-page PDF')).toBeInTheDocument()
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
    expect(screen.getByText('Fill in your details')).toBeInTheDocument()
  })
})

describe('ProductFAQSection', () => {
  it('renders nothing when faq is absent', () => {
    const { container } = render(<ProductFAQSection faq={undefined} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders each question and answer when present', () => {
    render(<ProductFAQSection faq={[{ question: 'Can I edit it later?', answer: 'Yes, anytime.' }]} />)

    expect(screen.getByText('Can I edit it later?')).toBeInTheDocument()
    expect(screen.getByText('Yes, anytime.')).toBeInTheDocument()
  })
})

describe('ProductTrustSection', () => {
  it('always mentions secure payment, preview before purchase, and digital delivery', () => {
    render(<ProductTrustSection oneTimePurchase={true} />)

    expect(screen.getByText(/secure/i)).toBeInTheDocument()
    expect(screen.getByText(/preview/i)).toBeInTheDocument()
    expect(screen.getByText(/digital delivery|instant/i)).toBeInTheDocument()
  })

  it('renders a support link', () => {
    render(<ProductTrustSection oneTimePurchase={true} />)

    const link = screen.getByRole('link', { name: /contact|support|help/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- ProductMarketingSections`
Expected: FAIL — the module doesn't exist yet.

- [ ] **Step 3: Write `ProductMarketingSections.jsx`**

```jsx
// src/components/digital-store/ProductMarketingSections.jsx
import { getWhatsAppHref } from '../../utils/whatsapp'

export function ProductHero({ template, onGetStarted }) {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-3">{template.name}</h1>
      <p className="text-2xl font-semibold text-[#C9971F] mb-6">
        {template.currency} {template.price}
      </p>
      <button
        type="button"
        onClick={onGetStarted}
        className="inline-block bg-[#C9971F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b3860f]"
      >
        Get Started
      </button>
    </section>
  )
}

/** Description, benefits, sample image, what's included, how it works - each
 * renders only when its own marketingContent field is present. */
export function ProductStorySections({ marketingContent }) {
  if (!marketingContent) return null
  const { description, benefits, sampleDocumentImageUrl, whatsIncluded, howItWorks } = marketingContent

  return (
    <>
      {description ? (
        <section className="py-10 max-w-2xl mx-auto">
          <p className="text-lg text-gray-700">{description}</p>
        </section>
      ) : null}

      {benefits?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">Why you'll love it</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span aria-hidden="true">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sampleDocumentImageUrl ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">What the document looks like</h2>
          <img src={sampleDocumentImageUrl} alt="Sample document" className="max-w-full rounded-lg border" />
        </section>
      ) : null}

      {whatsIncluded?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">What's included</h2>
          <ul className="list-disc list-inside space-y-1">
            {whatsIncluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {howItWorks?.length ? (
        <section className="py-10">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="space-y-2 list-decimal list-inside">
            {howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  )
}

export function ProductFAQSection({ faq }) {
  if (!faq?.length) return null

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
      <dl className="space-y-4">
        {faq.map((item) => (
          <div key={item.question}>
            <dt className="font-medium">{item.question}</dt>
            <dd className="text-gray-600 mt-1">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// No fabricated testimonials, ratings, or customer counts - only claims that are
// actually true for every product using this section.
export function ProductTrustSection({ oneTimePurchase }) {
  return (
    <section className="py-10 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">You're in good hands</h2>
      <ul className="space-y-2 text-gray-700">
        <li>🔒 Secure payment processing via Razorpay</li>
        <li>👀 Preview your actual document before you pay</li>
        <li>⚡ Instant digital delivery — no shipping, available right after payment</li>
        {oneTimePurchase ? <li>🔁 One-time purchase</li> : null}
      </ul>
      <p className="mt-4">
        Questions?{' '}
        <a href={getWhatsAppHref('Hi, I have a question about the Digital Store')} className="text-[#C9971F] underline">
          Contact support
        </a>
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- ProductMarketingSections`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/digital-store/ProductMarketingSections.jsx \
        src/components/digital-store/ProductMarketingSections.test.jsx
git commit -m "$(cat <<'EOF'
Add product page marketing sections (hero, story, FAQ, trust)

Each story section (description/benefits/sample image/what's included/
how it works) renders only when its own marketingContent field is
present - a product with none of them still renders a correct, if
plainer, page. Trust section makes only claims true for every product;
no fabricated testimonials/ratings/counts anywhere.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Preview panel

**Files:**
- Create: `src/components/digital-store/PreviewPanel.jsx`
- Test: `src/components/digital-store/PreviewPanel.test.jsx`

**Interfaces:**
- Produces: `<PreviewPanel templateId={id} fieldValues={values} />` — owns its own preview-request state (idle/loading/ready/error), exposes no props beyond these two.
- Consumes: `requestDigitalStorePreview`, `DigitalStoreApiError` (Task 2), `trackDigitalStoreEvent`/`DIGITAL_STORE_EVENTS` (Task 3).

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/digital-store/PreviewPanel.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PreviewPanel from './PreviewPanel'
import * as api from '../../utils/digitalStoreApi'

beforeEach(() => {
  vi.restoreAllMocks()
  global.URL.createObjectURL = vi.fn(() => 'blob:fake-url')
  global.URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  delete global.URL.createObjectURL
  delete global.URL.revokeObjectURL
})

describe('PreviewPanel', () => {
  it('requests a preview and renders an embed pointed at the resulting blob URL', async () => {
    vi.spyOn(api, 'requestDigitalStorePreview').mockResolvedValue(new Blob(['%PDF-'], { type: 'application/pdf' }))
    render(<PreviewPanel templateId="t1" fieldValues={{ brideName: 'Jane' }} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByTitle(/preview/i)).toHaveAttribute('src', 'blob:fake-url'))
    expect(api.requestDigitalStorePreview).toHaveBeenCalledWith('t1', { brideName: 'Jane' })
  })

  it('shows field validation errors returned by the backend', async () => {
    const error = Object.assign(new Error('Validation failed'), { status: 400, fieldErrors: { brideName: 'is required' } })
    vi.spyOn(api, 'requestDigitalStorePreview').mockRejectedValue(error)
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument())
  })

  it('shows a generic retry message on a non-validation error', async () => {
    const error = Object.assign(new Error('rate limited'), { status: 429, fieldErrors: null })
    vi.spyOn(api, 'requestDigitalStorePreview').mockRejectedValue(error)
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => expect(screen.getByText(/try again/i)).toBeInTheDocument())
  })

  it('revokes the previous blob URL when a new preview is generated', async () => {
    vi.spyOn(api, 'requestDigitalStorePreview').mockResolvedValue(new Blob(['%PDF-'], { type: 'application/pdf' }))
    render(<PreviewPanel templateId="t1" fieldValues={{}} />)

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))
    await waitFor(() => expect(screen.getByTitle(/preview/i)).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))
    await waitFor(() => expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- PreviewPanel`
Expected: FAIL — `PreviewPanel.jsx` doesn't exist yet.

- [ ] **Step 3: Write `PreviewPanel.jsx`**

```jsx
// src/components/digital-store/PreviewPanel.jsx
import { useEffect, useRef, useState } from 'react'
import { requestDigitalStorePreview } from '../../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../../utils/digitalStoreAnalytics'

export default function PreviewPanel({ templateId, fieldValues }) {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const previousUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current)
      }
    }
  }, [])

  async function handlePreviewClick() {
    setStatus('loading')
    setErrorMessage(null)
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PREVIEW_REQUESTED, { template_id: templateId })
    try {
      const blob = await requestDigitalStorePreview(templateId, fieldValues)
      const url = URL.createObjectURL(blob)
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current)
      }
      previousUrlRef.current = url
      setPreviewUrl(url)
      setStatus('ready')
      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PREVIEW_GENERATED, { template_id: templateId })
    } catch (err) {
      setStatus('error')
      if (err.fieldErrors) {
        setErrorMessage('Please fill in all required fields correctly before previewing.')
      } else {
        setErrorMessage('Something went wrong generating your preview. Please try again in a moment.')
      }
    }
  }

  return (
    <div className="py-10">
      <p className="text-sm text-gray-600 mb-3">
        This is your actual document — the same file you'll receive, watermarked only until you complete your purchase.
      </p>
      <button
        type="button"
        onClick={handlePreviewClick}
        disabled={status === 'loading'}
        className="bg-white border border-[#C9971F] text-[#C9971F] px-5 py-2 rounded-lg font-medium hover:bg-[#C9971F]/5 disabled:opacity-50"
      >
        {status === 'loading' ? 'Generating preview...' : 'Preview my document'}
      </button>

      {status === 'error' ? <p className="text-red-600 mt-3">{errorMessage}</p> : null}

      {status === 'ready' && previewUrl ? (
        <iframe title="Document preview" src={previewUrl} className="w-full mt-4 rounded-lg border" style={{ height: '70vh' }} />
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- PreviewPanel`
Expected: PASS (all 4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/digital-store/PreviewPanel.jsx src/components/digital-store/PreviewPanel.test.jsx
git commit -m "$(cat <<'EOF'
Add PreviewPanel: the live watermarked-PDF centerpiece of the product page

Framed to the buyer as their actual document, not a mockup. Revokes the
previous blob URL whenever a new preview replaces it (and on unmount) to
avoid leaking memory across repeated preview clicks.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Product detail page (assembly)

**Files:**
- Create: `src/pages/DigitalStoreProductPage.jsx`

**Interfaces:**
- Produces: `DigitalStoreProductPage` (default export, route-level, reads `templateId` from the URL via `useParams`).
- Consumes: `fetchDigitalStoreTemplate` (Task 2), `ProductForm` (Task 4), `useCheckout` (Task 5), `ProductCard`'s sibling components `ProductHero`/`ProductStorySections`/`ProductFAQSection`/`ProductTrustSection` (Task 7), `PreviewPanel` (Task 8), `StudiosPageShell`/`useSEO` (pre-existing), `trackDigitalStoreEvent`/`DIGITAL_STORE_EVENTS` (Task 3).

This task is the composition point for everything above — it has no complex logic of its own beyond wiring, so no dedicated unit test is added here (each piece it assembles is already tested in isolation). Manual verification against a running backend is the appropriate check for this task specifically (see the note at the top of this plan about the backend plan needing to be complete first).

- [ ] **Step 1: Write `DigitalStoreProductPage.jsx`**

```jsx
// src/pages/DigitalStoreProductPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import ProductForm from '../components/digital-store/ProductForm'
import PreviewPanel from '../components/digital-store/PreviewPanel'
import {
  ProductHero,
  ProductStorySections,
  ProductFAQSection,
  ProductTrustSection,
} from '../components/digital-store/ProductMarketingSections'
import { useCheckout } from '../hooks/useCheckout'
import { fetchDigitalStoreTemplate } from '../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'

export default function DigitalStoreProductPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const { status: checkoutStatus, error: checkoutError, startCheckout } = useCheckout(template || { id: templateId })

  useSEO({
    title: template ? `${template.name} | McreatiK Studios Digital Store` : 'Digital Store | McreatiK Studios',
    description: template?.marketingContent?.shortDescription || 'Customize, preview, and download instantly.',
    path: `/digital_store/${templateId}`,
  })

  useEffect(() => {
    let cancelled = false
    fetchDigitalStoreTemplate(templateId)
      .then((result) => {
        if (!cancelled) {
          setTemplate(result)
          trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PRODUCT_VIEWED, { template_id: templateId })
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err)
      })
    return () => {
      cancelled = true
    }
  }, [templateId])

  function handleFieldChange(name, value) {
    setFieldValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleFirstFormInteraction() {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.FORM_STARTED, { template_id: templateId })
  }

  function scrollToForm() {
    document.getElementById('digital-store-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handlePayClick() {
    await startCheckout(
      { customerName, customerEmail, fieldValues },
      { onSuccess: (orderId) => navigate(`/digital_store/${templateId}/order/${orderId}`) }
    )
  }

  if (loadError) {
    return (
      <StudiosPageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center">
          <p className="text-red-600">This product couldn't be found. It may no longer be available.</p>
        </div>
      </StudiosPageShell>
    )
  }

  if (!template) {
    return (
      <StudiosPageShell>
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center text-gray-500">Loading...</div>
      </StudiosPageShell>
    )
  }

  return (
    <StudiosPageShell>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <ProductHero template={template} onGetStarted={scrollToForm} />
        <ProductStorySections marketingContent={template.marketingContent} />

        <section id="digital-store-form" className="py-10 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Customize your document</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Your Name *
              </label>
              <input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                Your Email *
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <ProductForm
            fieldSchema={template.fieldSchema}
            values={fieldValues}
            onChange={handleFieldChange}
            onFirstInteraction={handleFirstFormInteraction}
          />
        </section>

        <PreviewPanel templateId={template.id} fieldValues={fieldValues} />

        <section className="py-10 border-t border-gray-200 text-center">
          <p className="text-2xl font-bold mb-4">
            {template.currency} {template.price}
          </p>
          <button
            type="button"
            onClick={handlePayClick}
            disabled={checkoutStatus === 'creating_order' || checkoutStatus === 'awaiting_payment'}
            className="bg-[#C9971F] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#b3860f] disabled:opacity-50"
          >
            {checkoutStatus === 'creating_order' ? 'Preparing checkout...' : `Pay ${template.currency} ${template.price}`}
          </button>
          {checkoutStatus === 'error' ? (
            <p className="text-red-600 mt-3">
              {checkoutError?.status === 429
                ? 'Too many attempts — please wait a moment and try again.'
                : 'Something went wrong starting checkout. Please try again in a moment.'}
            </p>
          ) : null}
        </section>

        <ProductFAQSection faq={template.marketingContent?.faq} />
        <ProductTrustSection oneTimePurchase={template.marketingContent?.oneTimePurchase ?? true} />
      </div>
    </StudiosPageShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/DigitalStoreProductPage.jsx
git commit -m "$(cat <<'EOF'
Add digital store product detail page

Composes the hero, story sections, form, live preview, pricing/CTA, FAQ,
and trust section into the full Discover -> Understand -> Trust ->
Customize -> Preview -> Pay flow. Each piece it assembles is already unit
tested in isolation (Tasks 4, 5, 7, 8); this task is pure composition.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Post-payment order page

**Files:**
- Create: `src/pages/DigitalStoreOrderPage.jsx`
- Test: `src/pages/DigitalStoreOrderPage.test.jsx`

**Interfaces:**
- Produces: `DigitalStoreOrderPage` (default export, route-level, reads `orderId` from the URL via `useParams`).
- Consumes: `verifyDigitalStoreOrder`, `digitalStoreDownloadUrl` (Task 2), `readStoredPaymentDetails` (Task 5), `trackDigitalStoreEvent`/`DIGITAL_STORE_EVENTS` (Task 3).

This is the one other piece (besides Tasks 4 and 5) with real logic worth testing directly: the four-state machine (`payment_successful` → `preparing` → `ready` → download) and the "no stored payment details" recovery-failure branch.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/pages/DigitalStoreOrderPage.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DigitalStoreOrderPage from './DigitalStoreOrderPage'
import * as api from '../utils/digitalStoreApi'
import * as checkoutHook from '../hooks/useCheckout'

function renderAt(orderId) {
  return render(
    <MemoryRouter initialEntries={[`/digital_store/t1/order/${orderId}`]}>
      <Routes>
        <Route path="/digital_store/:templateId/order/:orderId" element={<DigitalStoreOrderPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('DigitalStoreOrderPage', () => {
  it('shows a recovery message when no payment details are stored for this order', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue(null)

    renderAt('order-missing')

    expect(await screen.findByText(/contact us/i)).toBeInTheDocument()
  })

  it('shows "preparing" then transitions to the download-ready state once /verify reports fulfilled', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    const verifySpy = vi
      .spyOn(api, 'verifyDigitalStoreOrder')
      .mockResolvedValueOnce({ orderId: 'order-1', fulfilled: false })
      .mockResolvedValueOnce({ orderId: 'order-1', fulfilled: true, downloadToken: 'tok', downloadTokenExpiresAt: '2099-01-01T00:00:00Z' })

    renderAt('order-1')

    expect(await screen.findByText(/preparing your document/i)).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(5000)

    expect(await screen.findByRole('link', { name: /download/i })).toBeInTheDocument()
    expect(verifySpy).toHaveBeenCalledTimes(2)
  })

  it('the download link points at the correct download URL', async () => {
    vi.spyOn(checkoutHook, 'readStoredPaymentDetails').mockReturnValue({
      orderId: 'order-1', razorpayOrderId: 'rzp_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1',
    })
    vi.spyOn(api, 'verifyDigitalStoreOrder').mockResolvedValue({
      orderId: 'order-1', fulfilled: true, downloadToken: 'tok-abc', downloadTokenExpiresAt: '2099-01-01T00:00:00Z',
    })

    renderAt('order-1')

    const link = await screen.findByRole('link', { name: /download/i })
    expect(link).toHaveAttribute('href', api.digitalStoreDownloadUrl('order-1', 'tok-abc'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- DigitalStoreOrderPage`
Expected: FAIL — `DigitalStoreOrderPage.jsx` doesn't exist yet.

- [ ] **Step 3: Write `DigitalStoreOrderPage.jsx`**

```jsx
// src/pages/DigitalStoreOrderPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import StudiosPageShell from '../components/layout/StudiosPageShell'
import { verifyDigitalStoreOrder, digitalStoreDownloadUrl } from '../utils/digitalStoreApi'
import { readStoredPaymentDetails } from '../hooks/useCheckout'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../utils/digitalStoreAnalytics'
import { useSEO } from '../hooks/useSEO'

const POLL_INTERVAL_MS = 5000

export default function DigitalStoreOrderPage() {
  const { orderId } = useParams()
  // 'recovery_failed' | 'verifying' | 'preparing' | 'ready' | 'error'
  const [state, setState] = useState('verifying')
  const [downloadToken, setDownloadToken] = useState(null)
  const pollTimeoutRef = useRef(null)

  useSEO({ title: 'Your Order | McreatiK Studios Digital Store', description: 'Order status and download.', path: `/digital_store/order/${orderId}` })

  useEffect(() => {
    const paymentDetails = readStoredPaymentDetails(orderId)
    if (!paymentDetails) {
      setState('recovery_failed')
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const result = await verifyDigitalStoreOrder(orderId, paymentDetails)
        if (cancelled) return
        if (result.fulfilled) {
          setDownloadToken(result.downloadToken)
          setState('ready')
        } else {
          setState('preparing')
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        }
      } catch {
        if (!cancelled) setState('error')
      }
    }

    poll()

    return () => {
      cancelled = true
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
    }
  }, [orderId])

  function handleDownloadClick() {
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.DOWNLOAD_INITIATED, { order_id: orderId })
  }

  return (
    <StudiosPageShell>
      <div className="max-w-xl mx-auto px-4 pt-28 pb-20 text-center">
        {state === 'recovery_failed' ? (
          <>
            <h1 className="text-2xl font-semibold mb-3">We can't find this order on this device</h1>
            <p className="text-gray-600">
              If you already paid, your order is safe — please contact us with your order ID (
              <code className="bg-gray-100 px-1 rounded">{orderId}</code>) and we'll help you get your document.
            </p>
          </>
        ) : null}

        {state === 'verifying' || state === 'preparing' ? (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-semibold mb-2">Preparing your document...</h1>
            <p className="text-gray-600">This usually takes just a few seconds.</p>
          </>
        ) : null}

        {state === 'ready' ? (
          <>
            <h1 className="text-2xl font-semibold mb-4">Your document is ready 🎉</h1>
            {/* target="_blank": if the download link has somehow already expired/been
                exhausted by the time this is clicked, the resulting error opens in its
                own tab rather than replacing this page - the buyer keeps their "ready"
                state and the contact line right below, instead of losing everything to
                a raw error page. */}
            <a
              href={digitalStoreDownloadUrl(orderId, downloadToken)}
              onClick={handleDownloadClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C9971F] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#b3860f]"
            >
              Download your document
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Link not working? Contact us with your order ID (<code className="bg-gray-100 px-1 rounded">{orderId}</code>).
            </p>
          </>
        ) : null}

        {state === 'error' ? (
          <>
            <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
            <p className="text-gray-600">
              Please contact us with your order ID (<code className="bg-gray-100 px-1 rounded">{orderId}</code>) and we'll sort it out.
            </p>
          </>
        ) : null}
      </div>
    </StudiosPageShell>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- DigitalStoreOrderPage`
Expected: PASS (all 3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/pages/DigitalStoreOrderPage.jsx src/pages/DigitalStoreOrderPage.test.jsx
git commit -m "$(cat <<'EOF'
Add post-payment order page with the four-state machine

Verifying -> preparing -> ready -> download, polling /verify every 5s
while not yet fulfilled (confirmed safe to call repeatedly against the
already-reviewed backend). Falls back to a clear "contact us with your
order ID" message when sessionStorage has no record of this order -
the one recovery gap the spec explicitly calls out as motivation for
prioritizing email delivery next.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Wire the routes

**Files:**
- Modify: `src/App.jsx`

**Interfaces:** none new — this task only makes the previous 10 tasks reachable.

- [ ] **Step 1: Add the three lazy imports**

In `App.jsx`, add alongside the existing `const StudiosBlogPostPage = lazy(...)` line:

```js
const DigitalStoreCatalogPage = lazy(() => import('./pages/DigitalStoreCatalogPage'))
const DigitalStoreProductPage = lazy(() => import('./pages/DigitalStoreProductPage'))
const DigitalStoreOrderPage = lazy(() => import('./pages/DigitalStoreOrderPage'))
```

- [ ] **Step 2: Add the three routes**

In the `<Routes>` block, add these three lines right after the existing `<Route path="/studios/blog/:slug" ... />` line and before `<Route path="*" ... />`:

```jsx
          <Route path="/digital_store" element={<DigitalStoreCatalogPage />} />
          <Route path="/digital_store/:templateId" element={<DigitalStoreProductPage />} />
          <Route path="/digital_store/:templateId/order/:orderId" element={<DigitalStoreOrderPage />} />
```

- [ ] **Step 3: Manually verify routing**

Run: `npm run dev`, then visit `http://localhost:5199/digital_store` (or whatever port the dev server actually starts on) and confirm the catalog page loads without a console error (it will show "Loading..." or an error message if the backend isn't running/reachable at `VITE_API_BASE_URL` — that's expected if the backend isn't up; the point of this check is that the ROUTE resolves and the page component mounts, not that the API call itself succeeds). If the backend from `docs/superpowers/plans/2026-09-10-digital-store-marketing-and-preview.md` (in `mcreatik-backend`) is also running locally, confirm the real Wedding Photography Agreement template appears and clicking it navigates to `/digital_store/{id}` correctly.

- [ ] **Step 4: Manually verify responsive behavior at three breakpoints**

The spec requires the form, the live PDF preview, all CTAs, the checkout transition, and the download experience to each work properly on mobile, tablet, and desktop — not just be technically present. With the dev server still running, use the browser's device toolbar (or resize the window) to check all three of these widths against `/digital_store` and `/digital_store/{a real template's id}`:

- **~375px (mobile):** the catalog grid stacks to one column; the product page's form fields stack to one column (the `sm:grid-cols-2` on the name/email fields collapses correctly below the `sm` breakpoint); every button (Preview, Pay) is comfortably tappable and never overflows the viewport width; the `PreviewPanel`'s `<iframe>` is full-width and its embedded PDF is at least legibly zoomable (PDF viewers embedded via `<iframe>` in mobile Safari/Chrome provide their own pinch-zoom — confirm this actually works, since it's the one piece of UI here that isn't plain HTML you control the internals of).
- **~768px (tablet):** the catalog grid shows 2 columns (`sm:grid-cols-2`); the product page's single-column `max-w-3xl` layout still reads comfortably without excessive whitespace or overly long line lengths.
- **~1280px+ (desktop):** the catalog grid shows 3 columns (`lg:grid-cols-3`); nothing on the product page stretches uncomfortably wide (the existing `max-w-3xl mx-auto` constrains this already).

If any of these looks wrong, fix the specific Tailwind classes on the affected component before moving on — this is a required check for this task, not an optional nice-to-have, per the spec's explicit mobile-first requirement.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS — every test from every task in this plan, together.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "$(cat <<'EOF'
Wire the digital store catalog, product, and order routes into App.jsx

/digital_store, /digital_store/:templateId, and
/digital_store/:templateId/order/:orderId, lazy-loaded like every other
route in this app.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## After all 11 tasks

Run `npm test` once more to confirm everything is green together, then `npm run lint` to confirm the new files pass this repo's existing ESLint config (no new rules were introduced by this plan). Manual end-to-end verification (real form fill → real preview → real Razorpay test-mode payment → real download) requires the backend plan referenced at the top of this document to be deployed/running with real or Razorpay test-mode keys — that's a manual QA pass, not a task in this plan.
