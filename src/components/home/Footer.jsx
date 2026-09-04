/* ============================================
   Footer Component — McreatiK (home)
   Header-bar layout: logo + copyright + socials
   on one row, link columns below, a hairline rule,
   then the legal line — same content as before,
   restructured into this format. (No newsletter
   signup — there's no email list behind one yet,
   so it isn't included rather than faked.)
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'
import { HOME_NAV_LINKS, SOCIAL_LINKS } from '../../utils/constants'
import mcreatiKLogo from '../../assets/mcreatik-logo-dark-bg.png'

const ICON_MAP = {
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
  youtube: FiYoutube,
}

const ECOSYSTEM_LINKS = [
  { label: 'McreatiK Tech', href: '/tech' },
  { label: 'McreatiK Studios', href: '/studios' },
  { label: 'McreatiK Digital Store — Coming Soon', href: null },
]

const Footer = memo(function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0A1128] border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D8AE55]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ---------- Top bar — logo, copyright, socials ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={mcreatiKLogo} alt="McreatiK" className="h-9 w-auto object-contain" />
            </Link>
            <span className="text-gray-400 text-sm">&copy; {year}</span>
          </div>
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
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#D8AE55] hover:bg-[#D8AE55]/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mt-5 max-w-sm">
          A digital and creative brand — Tech, Studios, and more, under one roof.
        </p>

        {/* ---------- Link columns ---------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 mt-14">
          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">Quick Links</h3>
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

          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">The Ecosystem</h3>
            <ul className="space-y-3">
              {ECOSYSTEM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <Link to={href} className="text-gray-400 hover:text-[#D8AE55] text-sm transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-gray-400 text-sm cursor-not-allowed">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">Contact</h3>
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
              <li>Based in Chennai, TN, India</li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">McreatiK. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default Footer
