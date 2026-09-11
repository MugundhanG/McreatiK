/* ============================================
   StoreResetPasswordPage
   Confirms a password reset using the `token`
   query param from the reset link (logged, not yet
   emailed, per the backend's current state — see
   CustomerAuthController#requestPasswordReset).
   Successful confirm revokes every existing session
   server-side, so this doesn't sign the customer in —
   it sends them to log in again with the new password.
   ============================================ */

import React, { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import AuthFormField from '../components/store/AuthFormField'
import Button from '../components/ui/Button'
import { useForm } from '../hooks/useForm'
import { confirmPasswordReset } from '../utils/customerApi'
import { useSEO } from '../hooks/useSEO'

const INITIAL_VALUES = { newPassword: '', confirmPassword: '' }

export default function StoreResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useSEO({
    title: 'Reset Password | McreatiK Digital Store',
    description: 'Set a new password for your McreatiK Digital Store account.',
    path: '/store/reset-password',
  })

  const onSubmit = useCallback(
    async (data) => {
      await confirmPasswordReset({ token, newPassword: data.newPassword })
    },
    [token]
  )

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit, 'store_reset_password')

  return (
    <StorePageShell>
      <section className="min-h-[80vh] flex items-center justify-center px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md border border-black/10 rounded-lg p-6 sm:p-8 bg-white"
        >
          <span
            className="flex items-center justify-center w-12 h-12 rounded-lg border mb-5"
            style={{ borderColor: '#8B7FE8', color: '#8B7FE8', backgroundColor: '#8B7FE81a' }}
          >
            <FiLock className="w-5 h-5" />
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-[#17151f]">Set a new password</h1>

          {!token ? (
            <p className="text-sm text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-md p-4">
              This reset link is missing or invalid. Please request a new one.
            </p>
          ) : submitStatus === 'success' ? (
            <p className="text-sm text-[#17151f]/80 bg-[#8B7FE8]/10 border border-[#8B7FE8]/30 rounded-md p-4">
              Your password has been reset. You've been signed out of all sessions — please log in again with your
              new password.
            </p>
          ) : (
            <>
              <p className="text-sm text-[#17151f]/60 mb-6">Choose a new password for your account.</p>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <AuthFormField
                  id="reset-new-password"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                />
                <AuthFormField
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  required
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                />

                <Button theme="store" type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>

                {submitStatus === 'error' && (
                  <p className="text-sm font-semibold text-[#DC2626] text-center">
                    This reset link is invalid or has expired. Please request a new one.
                  </p>
                )}
              </form>
            </>
          )}

          <p className="mt-6 text-sm text-center text-[#17151f]/70">
            <Link to="/store/login" className="font-semibold" style={{ color: '#8B7FE8' }}>
              Back to log in
            </Link>
          </p>
        </motion.div>
      </section>
    </StorePageShell>
  )
}
