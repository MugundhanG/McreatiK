/* ============================================
   Footer Component — Tech & Creative (light theme)
   Site-wide footer with:
     - Brand column (logo + tagline)
     - Quick navigation links
     - Services list
     - Social media icons
     - Copyright bar
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'
import { TECH_NAV_LINKS, TECH_SERVICES, SOCIAL_LINKS } from '../../utils/constants'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import mcreatiKLogo from '../../assets/tech-logo-light-bg.png'

/* Map icon name strings from constants to actual components */
const ICON_MAP = {
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
  youtube: FiYoutube,
}

const Footer = memo(function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* ---------- Brand Column ---------- */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={mcreatiKLogo}
                alt="McreatiK Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Crafting premium digital experiences that elevate brands and drive measurable business growth.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => {
                const Icon = ICON_MAP[icon]
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-[#1E4FD9] hover:border-[#1E4FD9]/30 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* ---------- Quick Links ---------- */}
          <div className="lg:col-span-1">
            <h4 className="text-stone-900 font-semibold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-3">
              {TECH_NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-stone-600 hover:text-[#1E4FD9] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Services Links ---------- */}
          <div className="lg:col-span-2">
            <h4 className="text-stone-900 font-semibold mb-4 font-display">Services</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {TECH_SERVICES.map(({ title }) => (
                <li key={title}>
                  <Link
                    to="/tech/services"
                    className="text-stone-600 hover:text-[#1E4FD9] text-sm transition-colors"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Contact Info ---------- */}
          <div className="lg:col-span-1">
            <h4 className="text-stone-900 font-semibold mb-4 font-display">Contact</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="mailto:connect@mcreatik.com" className="hover:text-[#1E4FD9] transition-colors">
                  connect@mcreatik.com
                </a>
              </li>
              <li>
                <a href="tel:+919600129267" className="hover:text-[#1E4FD9] transition-colors">
                  +91 9600-129-267
                </a>
              </li>
              <li>Based in Chennai, TN, India</li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom Bar ---------- */}
        <div className="border-t border-stone-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-stone-500 text-sm">
            &copy; {year} McreatiK. All rights reserved.
          </p>
          <DepartmentSwitcher className="text-stone-500 bg-white" />
          <div className="flex gap-6 text-sm text-stone-500">
            <a href="#" className="hover:text-stone-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default Footer
