/* ============================================
   AuthFormField — Store
   Shared labeled-input for the signup/login/
   forgot-password/reset-password forms, so the
   same field markup + error styling (matching the
   Studios/Tech contact-form convention) isn't
   repeated four times.
   ============================================ */

import React, { memo } from 'react'

const AuthFormField = memo(function AuthFormField({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
}) {
  const inputBase =
    'w-full bg-black/[0.02] border rounded-md px-4 py-3.5 text-[#17151f] placeholder-[#17151f]/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#8B7FE8]/40 text-sm font-body'
  const inputOk = 'border-black/10 hover:border-black/20'
  const inputErr = 'border-[#DC2626] focus:ring-[#DC2626]/40'

  return (
    <div>
      <label htmlFor={id} className="font-body block text-sm text-[#17151f]/80 mb-1.5">
        {label}
        {required && <span className="text-[#DC2626]"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        className={`${inputBase} ${error ? inputErr : inputOk}`}
      />
      {error && <p className="mt-1 text-xs font-semibold text-[#DC2626]">{error}</p>}
    </div>
  )
})

export default AuthFormField
