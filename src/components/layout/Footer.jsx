/* ============================================
   Footer Component
   Site-wide footer with:
     - Brand column (logo + tagline)
     - Quick navigation links
     - Services list
     - Social media icons
     - Copyright bar
   ============================================ */

import React, { memo } from 'react'
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi'
import { NAV_LINKS, SERVICES, SOCIAL_LINKS } from '../../utils/constants'
import mcreatiKLogo from '../../assets/mcreatik_logo_new.png'

/* Map icon name strings from constants to actual components */
const ICON_MAP = {
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
}

const Footer = memo(function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-gray-950 border-t border-white/5">
      {/* Subtle gradient glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* ---------- Brand Column ---------- */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center mb-4">
              <img
                src={mcreatiKLogo}
                alt="McreatiK Logo"
                className="h-40 sm:h-40 w-auto object-contain drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]"
              />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
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
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* ---------- Quick Links ---------- */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Services Links ---------- */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Services</h4>
            <ul className="space-y-3">
              {SERVICES.map(({ title }) => (
                <li key={title}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Contact Info ---------- */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:connect@mcreatik.com" className="hover:text-indigo-400 transition-colors">
                  connect@mcreatik.com
                </a>
              </li>
              <li>
                <a href="tel:+919600129267" className="hover:text-indigo-400 transition-colors">
                  +91 9600-129-267
                </a>
              </li>
              <li>Available Mon – Sat, 8 AM – 10 PM</li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom Bar ---------- */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {year} McreatiK. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default Footer
