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
      {(fieldSchema?.fields ?? []).map((field) => {
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
