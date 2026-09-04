/* ============================================
   Footer Component — McreatiK (home)
   Same structure as the department footers, but
   the middle column points at the ecosystem
   (Tech/Studios/Store) instead of a service list.
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi'
import { HOME_NAV_LINKS, SOCIAL_LINKS } from '../../utils/constants'
import mcreatiKLogo from '../../assets/mcreatik-logo-dark-bg.png'

const ICON_MAP = {
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
}

const ECOSYSTEM_LINKS = [
  { label: 'McreatiK Tech', href: '/tech' },
  { label: 'McreatiK Studios', href: '/studios' },
  { label: 'McreatiK Store — Coming Soon', href: null },
]

const Footer = memo(function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0A1128] border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D8AE55]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* ---------- Brand Column ---------- */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={mcreatiKLogo} alt="McreatiK" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A digital and creative brand — Tech, Studios, and more, under one roof.
            </p>
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
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#D8AE55] hover:bg-[#D8AE55]/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* ---------- Quick Links ---------- */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 font-display">Quick Links</h3>
            <ul className="space-y-3">
              {HOME_NAV_LINKS.filter((l) => l.type !== 'disabled').map(({ label, href, type }) => (
                <li key={label}>
                  {type === 'route' ? (
                    <Link to={href} className="text-gray-400 hover:text-[#D8AE55] text-sm transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className="text-gray-400 hover:text-[#D8AE55] text-sm transition-colors">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Ecosystem Links ---------- */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 font-display">The Ecosystem</h3>
            <ul className="space-y-3">
              {ECOSYSTEM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <Link to={href} className="text-gray-400 hover:text-[#D8AE55] text-sm transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-gray-600 text-sm cursor-not-allowed">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Contact Info ---------- */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 font-display">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:connect@mcreatik.com" className="hover:text-[#D8AE55] transition-colors">
                  connect@mcreatik.com
                </a>
              </li>
              <li>
                <a href="tel:+919600129267" className="hover:text-[#D8AE55] transition-colors">
                  +91 9600-129-267
                </a>
              </li>
              <li>Based in Chennai, TN</li>
              <li>Available Mon – Sat, 8 AM – 10 PM</li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom Bar ---------- */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
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
