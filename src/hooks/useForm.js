/* ============================================
   useForm Hook
   Manages form state, field-level validation,
   submission handling, and reset. Designed to
   work with any form by accepting initial
   values and a validate function.
   ============================================ */

import { useState, useCallback } from 'react'
import { validateField, validateForm } from '../utils/validation'

/** Fires a GA4 event, if gtag is available — see index.html's inline snippet. */
function trackEvent(name, params) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

/**
 * @param {Object} initialValues - default field values
 * @param {Function} onSubmit    - async callback receiving validated data
 * @param {string} [formName]    - identifies this form in GA4 events (e.g. 'tech_contact')
 * @returns form state + handlers
 */
export function useForm(initialValues, onSubmit, formName) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  /* Update a single field and clear its error on change */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitStatus(null)
  }, [])

  /* Validate one field on blur so users get instant feedback */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  /* Full-form validation + submission */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const { errors: formErrors, isValid } = validateForm(values)
      setErrors(formErrors)

      if (!isValid) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
        setSubmitStatus('success')
        trackEvent('generate_lead', { form_name: formName || 'unknown', lead_source: values.leadSource || '' })
        setValues(initialValues) // reset after success
      } catch {
        setSubmitStatus('error')
        trackEvent('form_submit_error', { form_name: formName || 'unknown' })
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, initialValues, onSubmit, formName]
  )

  /* Manual reset */
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setSubmitStatus(null)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  }
}
