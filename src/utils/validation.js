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

/* Only this Studios service spans more than one day (wedding + reception),
   so it's the one that switches the date picker into range mode. */
const WEDDING_SERVICE = 'Wedding Photography'

/**
 * Validates a single form field by name.
 * @param {string} name  - field name (matches form state keys)
 * @param {string} value - current field value
 * @returns {string} error message, or '' if valid
 */
export function validateField(name, value) {
  const trimmed = value.trim()

  switch (name) {
    case 'department':
      if (!trimmed) return 'Please choose a department'
      return ''

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

    // 'password' (signup/login) and 'newPassword' (reset-password confirm) share the
    // same rule - both are checked against the backend's own @Size(min = 8, max = 100).
    case 'password':
    case 'newPassword':
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (value.length > 100) return 'Password must be 100 characters or fewer'
      return ''

    case 'service':
      if (!trimmed) return 'Please select at least one service'
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

  // 'confirmPassword' (signup, reset-password) needs to compare against whichever
  // sibling password field the form actually has - validateField can't see that,
  // so, like the eventDate cross-field check below, it's handled here instead.
  // Harmless no-op for forms that don't carry a confirmPassword field at all.
  if (formData.confirmPassword !== undefined) {
    const password = formData.password !== undefined ? formData.password : formData.newPassword
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (formData.confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
  }

  /* Event date is Studios-only and its required-ness depends on which
     service was picked — validateField can't see cross-field context,
     so it's handled here instead. Harmless no-op for forms that don't
     carry a department/eventDate field at all. */
  if (formData.department === 'studios') {
    const isRangeMode = (formData.service || '').includes(WEDDING_SERVICE)
    if (!(formData.eventDate || '').trim()) {
      errors.eventDate = isRangeMode ? 'Please select a start date' : 'Please select your event date'
      isValid = false
    }
    if (isRangeMode && !(formData.eventDateEnd || '').trim()) {
      errors.eventDateEnd = 'Please select an end date'
      isValid = false
    }
  }

  return { errors, isValid }
}
