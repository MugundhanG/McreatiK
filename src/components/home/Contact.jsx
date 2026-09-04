/* ============================================
   Contact Section — McreatiK (home)
   A two-step "intake ticket" form, distinct from
   both department forms: step 01 is a department
   picker (two large tiles, not a dropdown), which
   determines which service list step 02's select
   is populated with. Nothing past step 01 renders
   until a department is chosen.
   ============================================ */

import React, { memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiCamera, FiCheck, FiMail, FiPhone } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import { TECH_SERVICE_OPTIONS, STUDIOS_SERVICE_OPTIONS } from '../../utils/constants'
import { useForm } from '../../hooks/useForm'
import SectionHeading from './SectionHeading'
import Button from '../ui/Button'

const DEPARTMENTS = [
  {
    key: 'tech',
    icon: FiGlobe,
    label: 'McreatiK Tech',
    tagline: 'Websites & digital',
    accent: '#5B5FEF',
    options: TECH_SERVICE_OPTIONS,
  },
  {
    key: 'studios',
    icon: FiCamera,
    label: 'McreatiK Studios',
    tagline: 'Photography & editing',
    accent: '#C9971F',
    options: STUDIOS_SERVICE_OPTIONS,
  },
]

const INITIAL_VALUES = { department: 'tech', name: '', email: '', phone: '', service: '', message: '' }

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const HomeContact = memo(function HomeContact() {
  const onSubmit = useCallback(async (data) => {
    const dept = DEPARTMENTS.find((d) => d.key === data.department)
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: data.name,
        from_email: data.email,
        phone: `+91 ${data.phone}`,
        service: data.service,
        message: data.message,
        department: dept ? dept.label : 'McreatiK',
      },
      PUBLIC_KEY
    )
    if (result.status !== 200) throw new Error('Failed to send')
  }, [])

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit)

  const activeDept = DEPARTMENTS.find((d) => d.key === values.department)

  const selectDepartment = useCallback(
    (key) => {
      if (key === values.department) return
      handleChange({ target: { name: 'department', value: key } })
      handleChange({ target: { name: 'service', value: '' } })
    },
    [values.department, handleChange]
  )

  const selectedServices = values.service ? values.service.split(', ').filter(Boolean) : []
  const toggleService = useCallback(
    (opt) => {
      const next = selectedServices.includes(opt)
        ? selectedServices.filter((o) => o !== opt)
        : [...selectedServices, opt]
      handleChange({ target: { name: 'service', value: next.join(', ') } })
    },
    [selectedServices, handleChange]
  )

  const inputBase =
    'w-full bg-white/5 border rounded-md px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D8AE55]/40 text-sm'
  const inputOk = 'border-white/10 hover:border-white/20'
  const inputErr = 'border-red-500/50 focus:ring-red-500/40'

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#D8AE55]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Start Here"
          title="Tell Us What You Need"
          subtitle="Pick a department, then the rest takes under a minute."
        />

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D8AE55]/50 to-transparent" />

          {/* ---------- Step 01 — Department ---------- */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="font-display text-sm text-[#D8AE55]">01</span>
              <h3 className="font-mono-label text-xs uppercase tracking-wide text-gray-400">
                Choose a department
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEPARTMENTS.map(({ key, icon: Icon, label, tagline, accent }) => {
                const isActive = values.department === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectDepartment(key)}
                    className="relative rounded-lg border p-5 text-left transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isActive ? accent : 'rgba(255,255,255,0.1)',
                      backgroundColor: isActive ? `${accent}14` : 'transparent',
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full"
                        style={{ backgroundColor: accent }}
                      >
                        <FiCheck className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-lg border mb-4"
                      style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}1a` }}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <h4 className="text-white font-semibold font-display text-sm">
                      {label.replace('McreatiK ', '')}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">{tagline}</p>
                  </button>
                )
              })}
            </div>
            {errors.department && <p className="mt-2 text-xs text-red-400">{errors.department}</p>}
          </div>

          {/* ---------- Step 02 — Details, revealed once a department is chosen ---------- */}
          <AnimatePresence>
            {activeDept && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-9 pt-9 border-t border-white/10">
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="font-display text-sm" style={{ color: activeDept.accent }}>02</span>
                    <h3 className="font-mono-label text-xs uppercase tracking-wide text-gray-400">
                      Your details
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="h-name" className="block text-sm text-gray-300 mb-1.5 font-medium">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="h-name" name="name" type="text" placeholder="Your name"
                        value={values.name} onChange={handleChange} onBlur={handleBlur}
                        className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="h-email" className="block text-sm text-gray-300 mb-1.5 font-medium">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="h-email" name="email" type="email" placeholder="you@company.com"
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Phone number — fixed +91 prefix, McreatiK operates in India only */}
                    <div>
                      <label htmlFor="h-phone" className="block text-sm text-gray-300 mb-1.5 font-medium">
                        Phone number <span className="text-red-400">*</span>
                      </label>
                      <div className={`flex items-stretch rounded-md border overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#D8AE55]/40 ${errors.phone ? inputErr : inputOk}`}>
                        <span className="flex items-center px-3.5 text-sm text-gray-400 bg-white/5 border-r border-white/10 shrink-0">
                          +91
                        </span>
                        <input
                          id="h-phone" name="phone" type="tel" placeholder="98765 43210"
                          value={values.phone} onChange={handleChange} onBlur={handleBlur}
                          className="flex-1 min-w-0 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none text-sm"
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="h-message" className="block text-sm text-gray-300 mb-1.5 font-medium">
                        How can we help?
                      </label>
                      <textarea
                        id="h-message" name="message" rows={4} placeholder="Tell us a little about the project..."
                        value={values.message} onChange={handleChange} onBlur={handleBlur}
                        className={`${inputBase} resize-none ${errors.message ? inputErr : inputOk}`}
                      />
                    </div>

                    {/* Services — checkbox grid, options depend on the chosen department */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2.5 font-medium">
                        Services <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-h-52 overflow-y-auto pr-1">
                        {activeDept.options.filter((opt) => opt !== 'Other').map((opt) => {
                          const checked = selectedServices.includes(opt)
                          return (
                            <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => toggleService(opt)}
                                onBlur={handleBlur}
                                name="service"
                              />
                              <span
                                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                                style={{
                                  borderColor: checked ? activeDept.accent : 'rgba(255,255,255,0.2)',
                                  backgroundColor: checked ? activeDept.accent : 'transparent',
                                }}
                              >
                                {checked && <FiCheck className="w-3 h-3 text-white" />}
                              </span>
                              <span className="text-sm text-gray-300">{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                      {errors.service && <p className="mt-1.5 text-xs text-red-400">{errors.service}</p>}
                    </div>

                    <div className="pt-1">
                      <Button type="submit" theme="home" disabled={isSubmitting} className="w-full justify-center">
                        {isSubmitting ? 'Sending...' : 'Get Started'}
                      </Button>
                      {submitStatus === 'success' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-green-400">
                          Message sent! We'll get back to you soon.
                        </motion.p>
                      )}
                      {submitStatus === 'error' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-red-400">
                          Something went wrong. Please try again.
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Alternate contact points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <a href="mailto:connect@mcreatik.com" className="inline-flex items-center gap-2 hover:text-[#D8AE55] transition-colors">
            <FiMail className="w-4 h-4" /> connect@mcreatik.com
          </a>
          <a href="tel:+919600129267" className="inline-flex items-center gap-2 hover:text-[#D8AE55] transition-colors">
            <FiPhone className="w-4 h-4" /> +91 9600-129-267
          </a>
        </div>
      </div>
    </section>
  )
})

export default HomeContact
