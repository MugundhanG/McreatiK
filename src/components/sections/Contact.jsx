/* ============================================
   Contact Section
   Fully functional contact form with:
     - Real-time field validation on blur
     - Error messages per field
     - Success / error submission feedback
     - API integration placeholder (see onSubmit)
   Uses the useForm hook for state management.
   ============================================ */

import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { SERVICE_OPTIONS } from '../../utils/constants'
import { useForm } from '../../hooks/useForm'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

/* Initial empty state for the form */
const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

const Contact = memo(function Contact() {
  /**
   * Submit handler — replace the setTimeout with a real
   * API call (e.g., fetch('/api/contact', { method: 'POST', body: ... }))
   */
  const onSubmit = useCallback(async (data) => {
    /* ---------- API Integration Placeholder ----------
       Replace the simulated delay below with your
       actual backend endpoint:

       const res = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       })
       if (!res.ok) throw new Error('Failed to send')
    -------------------------------------------------- */
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Form submitted:', data)
  }, [])

  const {
    values,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(INITIAL_VALUES, onSubmit)

  /* Shared input class names */
  const inputBase =
    'w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 text-sm'
  const inputOk = 'border-white/10 hover:border-white/20'
  const inputErr = 'border-red-500/50 focus:ring-red-500/40'

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Get In Touch"
          title="Let's Work Together"
          subtitle="Have a project in mind? We'd love to hear about it. Fill out the form below and we'll get back to you within 24 hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* ---------- Contact Info Cards ---------- */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: FiMail, label: 'Email', value: 'connect@mcreatik.com', href: 'mailto:connect@mcreatik.com' },
              { icon: FiPhone, label: 'Phone', value: '+91 9600-129-267', href: 'tel:+919600129267' },
              { icon: FiMapPin, label: 'Location', value: 'Remote — Global', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass-card rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-white font-medium hover:text-indigo-300 transition-colors text-sm">
                      {value}
                    </a>
                  ) : (
                    <span className="text-white font-medium text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Response time note */}
            <div className="glass-card rounded-2xl p-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-white font-medium">Quick response guaranteed.</span>{' '}
                We typically reply within a few hours during business days. For urgent requests, feel free to call us directly.
              </p>
            </div>
          </motion.div>

          {/* ---------- Contact Form ---------- */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass-card rounded-2xl p-8 lg:p-10 space-y-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            noValidate
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-300 mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5 font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yourmail@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Service row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-300 mb-1.5 font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9600-129-267"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="service" className="block text-sm text-gray-300 mb-1.5 font-medium">
                  Service Required
                </label>
                <select
                  id="service"
                  name="service"
                  value={values.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${errors.service ? inputErr : inputOk} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}
                  style={{ backgroundColor: '#111827', color: values.service ? '#ffffff' : '#6b7280' }}
                >
                  <option value="" disabled style={{ color: '#6b7280' }}>Select a service</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service}</p>}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm text-gray-300 mb-1.5 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us about your project..."
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputBase} resize-none ${errors.message ? inputErr : inputOk}`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            {/* Submit button + status feedback */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FiSend className="w-4 h-4" />
                  </>
                )}
              </Button>

              {submitStatus === 'success' && (
                <motion.p
                  className="text-green-400 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Message sent successfully! We'll be in touch soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  className="text-red-400 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
})

export default Contact
