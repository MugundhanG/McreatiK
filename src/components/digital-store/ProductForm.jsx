import { useState, useRef } from 'react'

const KNOWN_INPUT_TYPES = new Set(['text', 'tel', 'email', 'date', 'number'])

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
      {(fieldSchema?.fields ?? []).map((field) => {
        const editable = isEditable(field)
        // A non-editable field always shows its fixedValue, never the buyer's own
        // (never-submitted) draft value - there is nothing for them to edit.
        const value = editable ? values[field.name] ?? '' : field.fixedValue ?? ''
        const clientError = editable && touched[field.name] ? clientValidate(field, value) : null
        const error = editable ? serverErrors[field.name] || clientError : null

        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#8B7FE8] disabled:bg-gray-100 disabled:text-gray-500"
            />
            {!editable ? (
              <p className="mt-1 text-xs text-gray-500">This value is fixed by the seller and can't be changed.</p>
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
