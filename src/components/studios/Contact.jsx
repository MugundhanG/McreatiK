/* ============================================
   Contact / Book Section — Studios
   Booking form, same validation + EmailJS
   plumbing as Tech's contact form, tagged with
   department so inquiries can be told apart.
   ============================================ */

import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import { STUDIOS_SERVICE_OPTIONS, LEAD_SOURCE_OPTIONS } from '../../utils/constants'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/Button'
import EventDatePicker from '../ui/EventDatePicker'
import { formatDisplay } from '../../utils/eventDate'

const WEDDING_SERVICE = 'Wedding Photography'

/* `department: 'studios'` isn't shown anywhere — it's just what tells
   the shared validateForm util this form needs an event date. */
const INITIAL_VALUES = {
  department: 'studios',
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  eventDate: '',
  eventDateEnd: '',
  leadSource: '',
}

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const StudiosContact = memo(function StudiosContact() {
  const onSubmit = useCallback(async (data) => {
    const eventDate = data.eventDateEnd
      ? `${formatDisplay(data.eventDate)} – ${formatDisplay(data.eventDateEnd)}`
      : formatDisplay(data.eventDate)
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        department: 'McreatiK Studios',
        event_date: eventDate,
        lead_source: data.leadSource,
      },
      PUBLIC_KEY
    )
    if (result.status !== 200) throw new Error('Failed to send')
  }, [])

  const { values, errors, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useForm(INITIAL_VALUES, onSubmit, 'studios_contact')

  const isWeddingRangeMode = values.service === WEDDING_SERVICE

  const handleDateApply = useCallback(
    (start, end) => {
      handleChange({ target: { name: 'eventDate', value: start } })
      handleChange({ target: { name: 'eventDateEnd', value: end } })
    },
    [handleChange]
  )

  const inputBase =
    'w-full bg-black/[0.02] border rounded-md px-4 py-3.5 text-[#1C1710] placeholder-[#A89A88] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#C9971F]/40 text-sm font-body'
  const inputOk = 'border-black/10 hover:border-black/20'
  const inputErr = 'border-[#DC2626] focus:ring-[#DC2626]/40'
  const required = <span className="text-[#DC2626]"> *</span>

  return (
    <section id="book" className="relative py-24 lg:py-32 bg-[#FAF7F0] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Let's shoot</p>
          <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Book a Session</h2>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            Tell us what you're planning and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: FiMail, label: 'Email', value: 'connect@mcreatik.com', href: 'mailto:connect@mcreatik.com' },
              { icon: FiPhone, label: 'Phone', value: '+91 9600-129-267', href: 'tel:+919600129267' },
              { icon: FiMapPin, label: 'Location', value: 'Based in Chennai, TN, India', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 border border-black/10 rounded-md p-5">
                <Icon className="w-4 h-4 text-[#C9971F] mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono-label text-[11px] uppercase text-[#6B6153] mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="font-body text-[#1C1710] text-sm hover:text-[#C9971F] transition-colors">{value}</a>
                  ) : (
                    <span className="font-body text-[#1C1710] text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 border border-black/10 rounded-md p-6 sm:p-8 space-y-5 bg-white"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="s-name" className="font-body block text-sm text-[#4A4438] mb-1.5">Full Name{required}</label>
                <input
                  id="s-name" name="name" type="text" placeholder="Your Name"
                  value={values.name} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                />
                {errors.name && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="s-email" className="font-body block text-sm text-[#4A4438] mb-1.5">Email{required}</label>
                <input
                  id="s-email" name="email" type="email" placeholder="yourmail@example.com"
                  value={values.email} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                />
                {errors.email && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="s-phone" className="font-body block text-sm text-[#4A4438] mb-1.5">Phone{required}</label>
              <input
                id="s-phone" name="phone" type="tel" placeholder="+91 9600-129-267"
                value={values.phone} onChange={handleChange} onBlur={handleBlur}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
              />
              {errors.phone && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors.phone}</p>}
            </div>

            <div>
              <label className="font-body block text-sm text-[#4A4438] mb-2.5">Session Type{required}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-h-52 overflow-y-auto pr-1">
                {STUDIOS_SERVICE_OPTIONS.filter((opt) => opt !== 'Other').map((opt) => {
                  const checked = values.service === opt
                  return (
                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="service-radio"
                        className="sr-only"
                        checked={checked}
                        onChange={() => {
                          handleChange({ target: { name: 'service', value: opt } })
                          if (opt !== WEDDING_SERVICE) {
                            handleChange({ target: { name: 'eventDateEnd', value: '' } })
                          }
                        }}
                        onBlur={handleBlur}
                      />
                      <span
                        className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                        style={{ borderColor: checked ? '#C9971F' : 'rgba(28,23,16,0.2)' }}
                      >
                        {checked && <span className="w-2 h-2 rounded-full bg-[#C9971F]" />}
                      </span>
                      <span className="font-body text-sm text-[#4A4438]">{opt}</span>
                    </label>
                  )
                })}
              </div>
              {errors.service && <p className="mt-1.5 text-xs font-semibold text-[#DC2626]">{errors.service}</p>}
            </div>

            <div>
              <label htmlFor="s-event-date" className="font-body block text-sm text-[#4A4438] mb-1.5">
                {isWeddingRangeMode ? 'Event dates' : 'Event date'}{required}
              </label>
              <EventDatePicker
                id="s-event-date"
                variant="light"
                rangeMode={isWeddingRangeMode}
                startDate={values.eventDate}
                endDate={values.eventDateEnd}
                onApply={handleDateApply}
                error={errors.eventDate || errors.eventDateEnd}
              />
              {isWeddingRangeMode && (
                <p className="mt-1.5 text-xs text-[#A89A88]">
                  Pick a date range to cover both the wedding and reception.
                </p>
              )}
              {(errors.eventDate || errors.eventDateEnd) && (
                <p className="mt-1.5 text-xs font-semibold text-[#DC2626]">{errors.eventDate || errors.eventDateEnd}</p>
              )}
            </div>

            <div>
              <label htmlFor="s-message" className="font-body block text-sm text-[#4A4438] mb-1.5">Message</label>
              <textarea
                id="s-message" name="message" rows={4} placeholder="Location, what you have in mind..."
                value={values.message} onChange={handleChange} onBlur={handleBlur}
                className={`${inputBase} resize-none ${errors.message ? inputErr : inputOk}`}
              />
            </div>

            <div>
              <label htmlFor="s-lead-source" className="font-body block text-sm text-[#4A4438] mb-1.5">How did you hear about us?</label>
              <select
                id="s-lead-source" name="leadSource"
                value={values.leadSource} onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
              >
                <option value="">Select an option</option>
                {LEAD_SOURCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
              <Button theme="studios" type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Sending...' : <>Send Inquiry <FiSend className="w-4 h-4" /></>}
              </Button>
              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#4d7a3a]">
                  Inquiry sent — we'll be in touch soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-[#DC2626]">
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

export default StudiosContact
