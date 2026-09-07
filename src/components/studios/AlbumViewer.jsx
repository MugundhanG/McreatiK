/* ============================================
   AlbumViewer — full-screen page-flip modal
   Renders an album's cover + ordered photos as a
   flip-through book using react-pageflip. Closes
   on backdrop click, the close button, or Escape.
   ============================================ */

import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Page = forwardRef(({ media }, ref) => (
  <div ref={ref} className="bg-[#0F0D0A] flex items-center justify-center">
    <img src={media.url} alt={media.altText || ''} className="w-full h-full object-contain" />
  </div>
))
Page.displayName = 'AlbumViewerPage'

export default function AlbumViewer({ album, onClose }) {
  const bookRef = useRef(null)
  const [pageIndex, setPageIndex] = useState(0)

  const pages = album.cover ? [album.cover, ...album.photos] : album.photos

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext()
      if (e.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleFlip = useCallback((e) => setPageIndex(e.data), [])

  if (pages.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close album"
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
      >
        <FiX className="w-7 h-7" />
      </button>

      <p className="absolute top-6 left-6 font-mono-label text-xs uppercase text-white/60">{album.title}</p>

      <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-4">
        <button
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          disabled={pageIndex === 0}
          aria-label="Previous page"
          className="text-white/60 hover:text-white disabled:opacity-20 transition-colors"
        >
          <FiChevronLeft className="w-8 h-8" />
        </button>

        <HTMLFlipBook
          ref={bookRef}
          width={360}
          height={480}
          size="stretch"
          minWidth={260}
          maxWidth={520}
          minHeight={340}
          maxHeight={680}
          showCover={false}
          usePortrait={true}
          onFlip={handleFlip}
          className="shadow-2xl"
        >
          {pages.map((media) => (
            <Page key={media.id} media={media} />
          ))}
        </HTMLFlipBook>

        <button
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          disabled={pageIndex >= pages.length - 1}
          aria-label="Next page"
          className="text-white/60 hover:text-white disabled:opacity-20 transition-colors"
        >
          <FiChevronRight className="w-8 h-8" />
        </button>
      </div>

      <p className="mt-6 font-mono-label text-xs uppercase text-white/50">
        Page {pageIndex + 1} / {pages.length}
      </p>
    </div>
  )
}
