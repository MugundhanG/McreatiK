/* ============================================
   useForm Hook
   Manages form state, field-level validation,
   submission handling, and reset. Designed to
   work with any form by accepting initial
   values and a validate function.
   ============================================ */

import { useState, useCallback } from 'react'
import { validateField, validateForm } from '../utils/validation'

/**
 * @param {Object} initialValues - default field values
 * @param {Function} onSubmit    - async callback receiving validated data
 * @returns form state + handlers
 */
export function useForm(initialValues, onSubmit) {
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
        setValues(initialValues) // reset after success
      } catch {
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, initialValues, onSubmit]
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
