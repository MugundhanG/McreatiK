/* ============================================
   StoreForgotPasswordPage
   Requests a password-reset link. Doesn't touch
   AuthContext — the backend's response is identical
   whether or not the email is registered (see
   CustomerAuthController#requestPasswordReset), so
   there's no auth state to update here, just a
   generic "check your email" confirmation.
   ============================================ */

import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import AuthFormField from '../components/store/AuthFormField'
import Button from '../components/ui/Button'
import { useForm } from '../hooks/useForm'
import { requestPasswordReset } from '../utils/customerApi'
import { useSEO } from '../hooks/useSEO'

const INITIAL_VALUES = { email: '' }

export default function StoreForgotPasswordPage() {
  useSEO({
    title: 'Forgot Password | McreatiK Digital Store',
    description: 'Reset the password for your McreatiK Digital Store account.',
    path: '/store/forgot-password',
  })

  const onSubmit = useCallback(async (data) => {
    await requestPasswordReset(data.email)
  }, [])

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit, 'store_forgot_password')

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
            <FiMail className="w-5 h-5" />
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-[#17151f]">Forgot your password?</h1>
          <p className="text-sm text-[#17151f]/60 mb-6">
            Enter your account email and we'll send you a link to reset your password.
          </p>

          {submitStatus === 'success' ? (
            <p className="text-sm text-[#17151f]/80 bg-[#8B7FE8]/10 border border-[#8B7FE8]/30 rounded-md p-4">
              If an account exists for that email, we've sent instructions to reset your password.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <AuthFormField
                id="forgot-email"
                name="email"
                type="email"
                label="Email"
                placeholder="yourmail@example.com"
                required
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
              />

              <Button theme="store" type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>

              {submitStatus === 'error' && (
                <p className="text-sm font-semibold text-[#DC2626] text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
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
