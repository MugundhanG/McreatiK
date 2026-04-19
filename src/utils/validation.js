/* ============================================
   Form Validation Utilities
   Pure functions for validating contact form
   fields. Returns error messages or empty
   strings when valid.
   ============================================ */

/* Regex pattern for standard email format */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Regex: digits, spaces, dashes, parens, plus — 7-15 chars */
const PHONE_REGEX = /^[+]?[\d\s()-]{7,15}$/

/**
 * Validates a single form field by name.
 * @param {string} name  - field name (matches form state keys)
 * @param {string} value - current field value
 * @returns {string} error message, or '' if valid
 */
export function validateField(name, value) {
  const trimmed = value.trim()

  switch (name) {
    case 'name':
      if (!trimmed) return 'Name is required'
      if (trimmed.length < 2) return 'Name must be at least 2 characters'
      return ''

    case 'email':
      if (!trimmed) return 'Email is required'
      if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email'
      return ''

    case 'phone':
      if (!trimmed) return 'Phone number is required'
      if (!PHONE_REGEX.test(trimmed)) return 'Please enter a valid phone number'
      return ''

    case 'service':
      if (!trimmed) return 'Please select a service'
      return ''

    case 'message':
      return ''

    default:
      return ''
  }
}

/**
 * Validates all fields at once.
 * @param {Object} formData - { name, email, phone, service, message }
 * @returns {{ errors: Object, isValid: boolean }}
 */
export function validateForm(formData) {
  const errors = {}
  let isValid = true

  for (const [key, value] of Object.entries(formData)) {
    const error = validateField(key, value)
    if (error) {
      errors[key] = error
      isValid = false
    }
  }

  return { errors, isValid }
}
