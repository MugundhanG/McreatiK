/* ============================================
   Lightbox Component
   Full-screen popup supporting three modes:
     - "image"   : renders an <img> tag
     - "pdf"     : renders a PDF in <iframe>
     - "website" : renders a live website in
                   <iframe> with a browser bar
   Closes on: ✕ button, backdrop click, ESC.
   ============================================ */

import React, { useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiExternalLink, FiRefreshCw } from 'react-icons/fi'

const Lightbox = memo(function Lightbox({ src, title, type = 'image', onClose }) {
  const [loading, setLoading] = useState(type !== 'image')

  /* Close on ESC key + lock body scroll */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  /* Full height for iframe-based types */
  const isFullHeight = type === 'pdf' || type === 'website'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Content container */}
        <motion.div
          className={`relative z-10 w-full max-w-5xl flex flex-col ${isFullHeight ? 'h-[92vh]' : ''}`}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >

          {/* ---- Browser-style top bar (website + pdf) ---- */}
          {isFullHeight && (
            <div className="flex items-center gap-3 bg-gray-900 border border-white/10 rounded-t-2xl px-4 py-2.5">
              {/* Traffic lights */}
              <div className="flex gap-1.5 shrink-0">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              {/* URL bar */}
              <div className="flex-1 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400 truncate border border-white/5">
                {type === 'website' ? src : title}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {type === 'website' && (
                  <>
                    <button
                      onClick={() => setLoading(true)}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Reload"
                    >
                      <FiRefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Open in new tab"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---- Image mode ---- */}
          {type === 'image' && (
            <>
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 z-20 w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
              <img
                src={src}
                alt={title}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              {title && (
                <p className="text-center text-gray-400 text-sm mt-4">{title}</p>
              )}
            </>
          )}

          {/* ---- PDF / Website iframe ---- */}
          {isFullHeight && (
            <div className="relative flex-1 bg-white rounded-b-2xl overflow-hidden">
              {/* Loading spinner */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <iframe
                key={src}
                src={src}
                title={title}
                className="w-full h-full border-0"
                onLoad={() => setLoading(false)}
              />
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
})

export default Lightbox
