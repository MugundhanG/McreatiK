/* ============================================
   Footer Component — Studios
   ============================================ */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi'
import { STUDIOS_NAV_LINKS, SOCIAL_LINKS } from '../../utils/constants'
import DepartmentSwitcher from '../ui/DepartmentSwitcher'
import studiosLogo from '../../assets/studios-logo-light-bg.png'

const ICON_MAP = {
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
}

const StudiosFooter = memo(function StudiosFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#F3EEE3] border-t border-black/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src={studiosLogo} alt="McreatiK Studios" className="h-11 w-auto object-contain" />
            </Link>
            <p className="font-body text-[#6B6153] text-sm leading-relaxed max-w-sm">
              Photography for portraits, weddings, and events.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <div>
              <h4 className="font-display italic text-[#1C1710] mb-3">Menu</h4>
              <ul className="space-y-2.5">
                {STUDIOS_NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="font-body text-[#6B6153] hover:text-[#C9971F] text-sm transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display italic text-[#1C1710] mb-3">Contact</h4>
              <ul className="space-y-2.5 text-sm font-body text-[#6B6153]">
                <li><a href="mailto:connect@mcreatik.com" className="hover:text-[#C9971F] transition-colors">connect@mcreatik.com</a></li>
                <li><a href="tel:+919600129267" className="hover:text-[#C9971F] transition-colors">+91 9600-129-267</a></li>
              </ul>
              <div className="flex gap-3 mt-4">
                {SOCIAL_LINKS.map(({ label, href, icon }) => {
                  const Icon = ICON_MAP[icon]
                  return (
                    <a
                      key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[#6B6153] hover:text-[#C9971F] hover:border-[#C9971F]/40 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="font-mono-label text-[11px] uppercase text-[#A89A88]">&copy; {year} McreatiK Studios</p>
          <DepartmentSwitcher className="text-[#4A4438]" />
        </div>
      </div>
    </footer>
  )
})

export default StudiosFooter
