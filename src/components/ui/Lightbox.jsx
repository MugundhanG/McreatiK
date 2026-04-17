/* ============================================
   Lightbox Component
   Full-screen popup that supports two modes:
     - "image" : renders an <img> tag
     - "pdf"   : renders an <iframe> PDF viewer
   Triggered by clicking portfolio cards.
   Closes on: ✕ button, backdrop click, ESC key.
   ============================================ */

import React, { useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const Lightbox = memo(function Lightbox({ src, title, type = 'image', onClose }) {
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
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
          className={`relative z-10 w-full ${type === 'pdf' ? 'max-w-4xl h-[90vh]' : 'max-w-4xl'}`}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-20 w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* ---------- Image mode ---------- */}
          {type === 'image' && (
            <img
              src={src}
              alt={title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          )}

          {/* ---------- PDF mode ---------- */}
          {type === 'pdf' && (
            <iframe
              src={src}
              title={title}
              className="w-full h-full rounded-2xl shadow-2xl border-0"
              style={{ minHeight: '80vh' }}
            />
          )}

          {/* Caption */}
          {title && (
            <p className="text-center text-gray-400 text-sm mt-4">{title}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
})

export default Lightbox
