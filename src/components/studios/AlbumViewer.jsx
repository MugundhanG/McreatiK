/* ============================================
   AlbumViewer — full-screen page-flip modal
   Renders an album's cover + ordered photos as a
   flip-through book using react-pageflip, one sheet
   at a time, each filling an 80vw x 80vh frame.
   Closes on backdrop click, the close button, or
   Escape.
   ============================================ */

import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
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
  const containerRef = useRef(null)
  const [pageIndex, setPageIndex] = useState(0)
  // Measured for real against the 80vw/80vh container before the book ever
  // mounts — react-pageflip's underlying PageFlip instance is constructed
  // exactly once and locks in its width/height ratio at that point (later
  // prop changes are silently ignored), so this can't be "seed with a
  // fallback, then correct it" the way a normal React prop would work.
  // Instead: don't render the book until we have a real, non-zero size,
  // and remount it (via `key` below) if that size ever changes.
  const [bookSize, setBookSize] = useState(null)

  const pages = album.cover ? [album.cover, ...album.photos] : album.photos

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)
      // page-flip's own Settings.ts throws "Invalid width or height" for
      // any non-positive size — a transient 0x0 measurement during the
      // modal's very first layout pass (before it's positioned) would
      // otherwise crash the mount. Skipping it here, and skipping no-op
      // repeats (this remounts the book via `key`), keeps that from ever
      // reaching react-pageflip.
      if (width <= 0 || height <= 0) return
      setBookSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

      <div onClick={(e) => e.stopPropagation()} className="relative flex h-[80vh] w-[80vw] items-center justify-center">
        <div ref={containerRef} className="h-full w-full">
          {bookSize && (
            <HTMLFlipBook
              // Pinning min/max to the exact measured size does two things
              // at once: it makes react-pageflip fill the container exactly
              // (no letterboxing), and — since it also makes the library's
              // own "blockWidth < minWidth * 2" spread-vs-single-page
              // threshold trivially always true — it forces single-page
              // mode on every viewport, so each photo is always shown as
              // one full sheet rather than a two-page spread.
              key={`${bookSize.width}x${bookSize.height}`}
              ref={bookRef}
              width={bookSize.width}
              height={bookSize.height}
              size="stretch"
              minWidth={bookSize.width}
              maxWidth={bookSize.width}
              minHeight={bookSize.height}
              maxHeight={bookSize.height}
              showCover={false}
              usePortrait={true}
              onFlip={handleFlip}
              className="shadow-2xl"
            >
              {pages.map((media) => (
                <Page key={media.id} media={media} />
              ))}
            </HTMLFlipBook>
          )}
        </div>

        <button
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          disabled={pageIndex === 0}
          aria-label="Previous page"
          className="absolute left-2 sm:-left-14 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
        >
          <FiChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          disabled={pageIndex >= pages.length - 1}
          aria-label="Next page"
          className="absolute right-2 sm:-right-14 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
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
