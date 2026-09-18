/* ============================================
   StoreLoginPage
   Customer sign-in for the Digital Store. On
   success, redirects back to wherever the visitor
   came from (location.state.from) — set either by
   a normal link to /store/login, or by
   useRequireAuthOrRedirect when a future add-to-cart
   action sends a signed-out visitor here.
   ============================================ */

import React, { useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogIn } from 'react-icons/fi'
import StorePageShell from '../components/layout/StorePageShell'
import AuthFormField from '../components/store/AuthFormField'
import Button from '../components/ui/Button'
import { useForm } from '../hooks/useForm'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

const INITIAL_VALUES = { email: '', password: '' }

export default function StoreLoginPage() {
  const { login, customer, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/store'

  useSEO({
    title: 'Log In | McreatiK Digital Store',
    description: 'Log in to your McreatiK Digital Store account.',
    path: '/store/login',
  })

  // Already signed in — send them straight to wherever they were headed instead
  // of showing a login form they don't need.
  useEffect(() => {
    if (customer) {
      navigate(from, { replace: true })
    }
  }, [customer, navigate, from])

  const onSubmit = useCallback(
    async (data) => {
      await login({ email: data.email, password: data.password })
    },
    [login]
  )

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit, 'store_login')

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
            style={{ borderColor: 'var(--store-accent)', color: 'var(--store-accent-text)', backgroundColor: 'var(--store-accent-soft)' }}
          >
            <FiLogIn className="w-5 h-5" />
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-[#17151f]">Log in</h1>
          <p className="text-sm text-[#17151f]/60 mb-6">Welcome back to the McreatiK Digital Store.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthFormField
              id="login-email"
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
            <div>
              <AuthFormField
                id="login-password"
                name="password"
                type="password"
                label="Password"
                placeholder="Your password"
                required
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
              />
              <div className="text-right mt-1.5">
                <Link to="/store/forgot-password" className="text-xs font-semibold text-[var(--store-accent-text)]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button theme="store" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>

            {submitStatus === 'error' && (
              <p className="text-sm font-semibold text-[#DC2626] text-center">
                {authError || 'Something went wrong. Please try again.'}
              </p>
            )}
          </form>

          <p className="mt-6 text-sm text-center text-[#17151f]/70">
            New here?{' '}
            <Link to="/store/signup" state={location.state} className="font-semibold text-[var(--store-accent-text)]">
              Create an account
            </Link>
          </p>
        </motion.div>
      </section>
    </StorePageShell>
  )
}
