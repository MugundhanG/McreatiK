/* ============================================
   LegalPage
   Shared layout for the site-wide Privacy Policy
   and Terms of Service pages. Uses the same shell
   (Navbar/Footer) as the Home page so both legal
   pages carry the McreatiK master brand rather than
   any one department's theme. A sticky contents
   column on large screens (collapsed into a <details>
   accordion on mobile) links to each numbered section
   via a plain in-page anchor — the same pattern the
   rest of the site already uses for same-page jumps
   (see Hero's #explore, Studios' #book), which relies
   on the global `scroll-behavior: smooth` and each
   heading's own `scroll-mt` to clear the fixed navbar.
   ============================================ */

import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../home/Navbar'
import Footer from '../home/Footer'
import ScrollToTop from '../ui/ScrollToTop'

export default function LegalPage({ eyebrow, title, lastUpdated, intro, sections, closing }) {
  return (
    <div className="theme-home min-h-screen overflow-x-hidden w-full">
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* ---------- Title block ---------- */}
          <motion.div
            className="max-w-[70ch]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow && (
              <span className="inline-block px-4 py-1.5 mb-5 text-xs font-mono-label uppercase rounded-full bg-[#D8AE55]/10 text-[#D8AE55] border border-[#D8AE55]/25">
                {eyebrow}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display gradient-text-home leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-[#8890AE] text-sm font-mono-label uppercase tracking-wide">
              Last updated: {lastUpdated}
            </p>
            {intro && (
              <div className="mt-6 space-y-4">
                {intro.map((paragraph) => (
                  <p key={paragraph} className="text-[#c7cbdd] text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          {/* ---------- Mobile contents accordion ---------- */}
          <details className="mt-10 lg:hidden rounded-lg border border-white/10 bg-white/[0.03] open:pb-2">
            <summary className="cursor-pointer select-none px-5 py-4 font-mono-label text-xs uppercase tracking-wide text-[#D8AE55]">
              Contents
            </summary>
            <nav aria-label="Table of contents" className="px-5 pb-4">
              <ol className="space-y-2.5">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-[#c7cbdd] hover:text-[#D8AE55] transition-colors"
                    >
                      {index + 1}. {section.navLabel || section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>

          {/* ---------- Body: sticky contents column (lg) + readable column ---------- */}
          <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,70ch)] lg:gap-16">
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-28">
                <p className="font-mono-label text-xs uppercase tracking-wide text-[#8890AE] mb-4">
                  Contents
                </p>
                <ol className="space-y-3 border-l border-white/10">
                  {sections.map((section, index) => (
                    <li key={section.id} className="pl-4 -ml-px border-l-2 border-transparent hover:border-[#D8AE55]/60">
                      <a
                        href={`#${section.id}`}
                        className="block text-sm text-[#8890AE] hover:text-[#D8AE55] transition-colors leading-snug"
                      >
                        {index + 1}. {section.navLabel || section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="min-w-0 space-y-12">
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4f2ea] mb-4">
                    {index + 1}. {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-[#c7cbdd] text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-4 space-y-2 list-disc list-outside pl-5">
                      {section.list.map((item) => (
                        <li key={item} className="text-[#c7cbdd] text-base leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.after && (
                    <p className="mt-4 text-[#c7cbdd] text-base leading-relaxed">{section.after}</p>
                  )}
                </motion.section>
              ))}

              {closing && (
                <p className="pt-6 border-t border-white/10 text-sm text-[#8890AE]">
                  {closing}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop accentClass="bg-[#D8AE55] text-[#0A1128] shadow-[#D8AE55]/30 hover:bg-[#F0CB7E]" />
    </div>
  )
}
