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
