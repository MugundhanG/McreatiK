import { useState, useRef } from 'react'
import { uploadCustomerImage } from '../../utils/customerApi'

const KNOWN_INPUT_TYPES = new Set(['text', 'tel', 'email', 'date', 'number'])
const MAX_IMAGE_SIZE_BYTES = 5_000_000
const ACCEPTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function resolveInputType(fieldType) {
  if (fieldType === 'string') return 'text'
  return KNOWN_INPUT_TYPES.has(fieldType) ? fieldType : 'text'
}

function coerceValue(field, rawValue) {
  if (field.type === 'number') {
    return rawValue === '' ? null : Number(rawValue)
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

// Mirrors the backend's own default (GenericFieldSchemaValidator#parseFields reads
// customerEditable with a default of `true`): absent means editable, so existing
// schemas written before this flag existed keep behaving exactly as they did.
function isEditable(field) {
  return field.customerEditable !== false
}

/**
 * One field's image-upload UI: a file picker, an inline error (client-side size/
 * type rejection, or a server-side rejection surfaced the same way), and a small
 * preview once a value exists. Uploads immediately on file selection (there's no
 * separate "save" step for this form), then calls the exact same
 * onChange(name, value) every other field type calls - the resulting URL is the
 * field's whole value, nothing else about this component's contract changes.
 */
function ImageField({ field, value, editable, error: serverError, onUploaded, onError }) {
  const [uploading, setUploading] = useState(false)
  const [clientError, setClientError] = useState(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setClientError(null)
    onError(field.name, null)

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setClientError(`${field.label} must be at most 5MB`)
      return
    }
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setClientError(`${field.label} must be a PNG, JPEG, or WebP image`)
      return
    }

    setUploading(true)
    try {
      const result = await uploadCustomerImage(file)
      onUploaded(field.name, result.url)
    } catch (err) {
      onError(field.name, err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const error = clientError || serverError

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-[#17151f] mb-1.5">
        {field.label}
        {field.required && editable ? ' *' : ''}
      </label>
      {value ? (
        <img
          src={value}
          alt={field.label}
          className="mb-2 h-16 w-16 rounded-md border border-black/15 object-cover"
        />
      ) : null}
      <input
        id={field.name}
        name={field.name}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={!editable || uploading}
        onChange={editable ? handleFileChange : undefined}
        className="block w-full text-sm text-[#17151f] file:mr-3 file:rounded-md file:border file:border-black/15 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium"
      />
      {uploading ? <p className="mt-1.5 text-xs text-[#7a7887]">Uploading…</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Renders one input per fieldSchema entry - the whole point of this component is
 * that it never references a specific field name, so a new product's fieldSchema
 * "just works" with zero changes here.
 *
 * A field marked `customerEditable: false` is the tamper-vector control described
 * in GenericFieldSchemaValidator's javadoc: the backend always resolves it to the
 * schema's own `fixedValue` and silently discards anything a buyer submits for it.
 * If this form ever rendered such a field as an empty, required, editable input, a
 * buyer would see a required field they can't satisfy (blocked by client-side
 * validation) for a submission the server was going to ignore anyway. So a
 * non-editable field is always rendered disabled and pre-filled from `fixedValue`,
 * and is never subject to this component's own required-field check.
 */
export default function ProductForm({ fieldSchema, values, onChange, serverErrors = {}, onFirstInteraction }) {
  const [touched, setTouched] = useState({})
  const [imageErrors, setImageErrors] = useState({})
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

  function handleImageUploaded(name, url) {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      onFirstInteraction?.()
    }
    setImageErrors((prev) => ({ ...prev, [name]: null }))
    onChange(name, url)
  }

  function handleImageError(name, message) {
    setImageErrors((prev) => ({ ...prev, [name]: message }))
  }

  return (
    <form className="space-y-5">
      {(fieldSchema?.fields ?? []).map((field) => {
        const editable = isEditable(field)
        // A non-editable field always shows its fixedValue, never the buyer's own
        // (never-submitted) draft value - there is nothing for them to edit.
        const value = editable ? values[field.name] ?? '' : field.fixedValue ?? ''

        if (field.type === 'image') {
          return (
            <ImageField
              key={field.name}
              field={field}
              value={value}
              editable={editable}
              error={imageErrors[field.name] || serverErrors[field.name]}
              onUploaded={handleImageUploaded}
              onError={handleImageError}
            />
          )
        }

        const clientError = editable && touched[field.name] ? clientValidate(field, value) : null
        const error = editable ? serverErrors[field.name] || clientError : null

        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-[#17151f] mb-1.5">
              {field.label}
              {field.required && editable ? ' *' : ''}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={resolveInputType(field.type)}
              required={editable && field.required}
              maxLength={field.maxLength}
              value={value}
              disabled={!editable}
              onChange={editable ? (e) => handleChange(field, e.target.value) : undefined}
              onBlur={editable ? () => handleBlur(field) : undefined}
              className="w-full rounded-md border border-black/15 px-3.5 py-2.5 text-base text-[#17151f] transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--store-accent)]/50 focus:border-[var(--store-accent)] disabled:bg-black/[0.03] disabled:text-[#7a7887]"
            />
            {!editable ? (
              <p className="mt-1.5 text-xs text-[#7a7887]">This value is fixed by the seller and can't be changed.</p>
            ) : null}
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
