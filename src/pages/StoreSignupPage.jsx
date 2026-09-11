/* ============================================
   StoreSignupPage
   Customer account creation for the Digital Store.
   Uses the shared useForm hook (same pattern as
   every contact form in this codebase) and
   AuthContext.signup() — no new form-handling or
   validation pattern.
   ============================================ */

import React, { useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUserPlus } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import AuthFormField from '../components/store/AuthFormField'
import Button from '../components/ui/Button'
import { useForm } from '../hooks/useForm'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

const INITIAL_VALUES = { name: '', email: '', password: '', confirmPassword: '' }

export default function StoreSignupPage() {
  const { signup, customer, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useSEO({
    title: 'Create Your Account | McreatiK Digital Store',
    description: 'Create a McreatiK Digital Store account to buy and download digital products.',
    path: '/store/signup',
  })

  // Already signed in (e.g. session cookie still valid) — nothing to do here.
  // Carries `from` forward the same way login does, in case this page was
  // reached from the sign-up link on the login redirect flow.
  useEffect(() => {
    if (customer) {
      navigate(location.state?.from || '/store', { replace: true })
    }
  }, [customer, navigate, location.state])

  const onSubmit = useCallback(
    async (data) => {
      await signup({ email: data.email, password: data.password, name: data.name })
    },
    [signup]
  )

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit, 'store_signup')

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
            <FiUserPlus className="w-5 h-5" />
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-[#17151f]">Create your account</h1>
          <p className="text-sm text-[#17151f]/60 mb-6">
            Sign up to buy and download digital products from the McreatiK Store.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthFormField
              id="signup-name"
              name="name"
              label="Full Name"
              placeholder="Your Name"
              required
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
            />
            <AuthFormField
              id="signup-email"
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
            <AuthFormField
              id="signup-password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            <AuthFormField
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
            />

            <Button theme="store" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>

            {submitStatus === 'error' && (
              <p className="text-sm font-semibold text-[#DC2626] text-center">
                {authError || 'Something went wrong. Please try again.'}
              </p>
            )}
          </form>

          <p className="mt-6 text-sm text-center text-[#17151f]/70">
            Already have an account?{' '}
            <Link to="/store/login" state={location.state} className="font-semibold" style={{ color: '#8B7FE8' }}>
              Log in
            </Link>
          </p>
        </motion.div>
      </section>
    </StorePageShell>
  )
}
