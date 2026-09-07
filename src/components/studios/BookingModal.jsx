/* ============================================
   BookingModal — Studios
   A quick-enquiry popup shown whenever a visitor
   arrives at the Studios home page from outside
   Studios — a fresh load, a direct link, or
   switching over from Tech — but not when
   navigating back to it from another Studios page
   (Gallery, Albums, Experience, Blog), since that's
   still the same visit (adapted from a reference
   design, recolored to McreatiK's own warm
   paper/gold palette). Just three fields — name,
   phone, and service — kept intentionally short so
   it doesn't feel like the full booking form.
   ============================================ */

import React, { memo, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import { STUDIOS_SERVICE_OPTIONS } from '../../utils/constants'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/Button'
import { getLastPathname } from '../../utils/navigationHistory'

const INITIAL_VALUES = { name: '', phone: '', service: '' }

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/* Suppress the popup only when coming from elsewhere inside Studios
   itself — a fresh load, a direct link, or arriving from Tech (where
   the last pathname is null or non-Studios) should all still show it. */
const cameFromWithinStudios = () => Boolean(getLastPathname()?.startsWith('/studios'))

const StudiosBookingModal = memo(function StudiosBookingModal() {
  const [isOpen, setIsOpen] = useState(() => !cameFromWithinStudios())

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onSubmit = useCallback(async (data) => {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: data.name,
        from_email: '',
        phone: `+91 ${data.phone}`,
        service: data.service,
        message: 'Quick enquiry from the Studios booking popup.',
        department: 'McreatiK Studios (Quick Enquiry)',
      },
      PUBLIC_KEY
    )
    if (result.status !== 200) throw new Error('Failed to send')
  }, [])

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit)

  useEffect(() => {
    if (submitStatus === 'success') {
      const t = setTimeout(close, 2000)
      return () => clearTimeout(t)
    }
  }, [submitStatus, close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const inputBase =
    'w-full bg-black/[0.02] border rounded-md px-4 py-3 text-[#1C1710] placeholder-[#A89A88] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#C9971F]/40 text-sm font-body'
  const inputOk = 'border-black/10 hover:border-black/20'
  const inputErr = 'border-[#DC2626] focus:ring-[#DC2626]/40'

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-[#1C1710]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              className="pointer-events-auto relative w-full max-w-lg rounded-2xl bg-[#FAF7F0] p-6 sm:p-10 my-8 shadow-2xl shadow-black/40"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Quick booking enquiry"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[#6B6153] hover:bg-black/5 hover:text-[#1C1710] transition-colors cursor-pointer"
              >
                <FiX className="w-4.5 h-4.5" />
              </button>

              <div className="text-center mb-8">
                <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#C9971F] mb-3">
                  McreatiK Studios
                </p>
                <h2 className="font-display italic text-2xl sm:text-3xl text-[#1C1710]">
                  Let's Create Beautiful Memories
                </h2>
                <p className="font-body mt-3 text-sm text-[#6B6153] max-w-sm mx-auto">
                  Share your details and we'll get back to you to plan a shoot that captures your moment perfectly.
                </p>
              </div>

              {submitStatus === 'success' ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm font-medium text-[#4d7a3a] py-6"
                >
                  Thank you — we'll be in touch soon.
                </motion.p>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="bm-name" className="font-body block text-sm text-[#4A4438] mb-1.5">
                      Full Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      id="bm-name" name="name" type="text" placeholder="Enter your full name"
                      value={values.name} onChange={handleChange} onBlur={handleBlur}
                      className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                    />
                    {errors.name && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="bm-phone" className="font-body block text-sm text-[#4A4438] mb-1.5">
                      Phone Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className={`flex items-stretch rounded-md border overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#C9971F]/40 ${errors.phone ? inputErr : inputOk}`}>
                      <span className="flex items-center px-3.5 text-sm text-[#6B6153] bg-black/[0.02] border-r border-black/10 shrink-0">
                        +91
                      </span>
                      <input
                        id="bm-phone" name="phone" type="tel" placeholder="81234 56789"
                        value={values.phone} onChange={handleChange} onBlur={handleBlur}
                        className="flex-1 min-w-0 bg-transparent px-4 py-3 text-[#1C1710] placeholder-[#A89A88] outline-none text-sm font-body"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="bm-service" className="font-body block text-sm text-[#4A4438] mb-1.5">
                      Service Required <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      id="bm-service" name="service"
                      value={values.service} onChange={handleChange} onBlur={handleBlur}
                      className={`${inputBase} ${errors.service ? inputErr : inputOk} appearance-none cursor-pointer`}
                      style={{ backgroundColor: '#ffffff', color: values.service ? '#1C1710' : '#A89A88' }}
                    >
                      <option value="" disabled style={{ color: '#A89A88' }}>Select a service</option>
                      {STUDIOS_SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} style={{ backgroundColor: '#ffffff', color: '#1C1710' }}>{opt}</option>
                      ))}
                    </select>
                    {errors.service && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.service}</p>}
                  </div>

                  <Button theme="studios" type="submit" disabled={isSubmitting} className="w-full justify-center">
                    {isSubmitting ? 'Sending...' : 'Book Now'}
                  </Button>
                  {submitStatus === 'error' && (
                    <p className="text-center text-sm font-semibold text-[#DC2626]">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
})

export default StudiosBookingModal
