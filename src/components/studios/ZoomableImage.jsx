/* ============================================
   ZoomableImage — pinch / wheel / double-click
   zoom with drag-to-pan, plus small + / − /
   reset buttons. Used by the Gallery post
   viewer and the Album page zoom overlay.
   Reports whether it's zoomed so the parent
   can pause its own swipe-to-change gesture.
   ============================================ */

import React, { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { FiMaximize2, FiZoomIn, FiZoomOut } from 'react-icons/fi'

const MAX_SCALE = 5
// Double-click/tap zooms in to 2.5× (the library multiplies by e^step).
const DOUBLE_CLICK_STEP = Math.log(2.5)

export default function ZoomableImage({ src, alt, onZoomChange, className = '' }) {
  const [zoomed, setZoomed] = useState(false)

  function handleTransformed(_ref, state) {
    const next = state.scale > 1.01
    if (next !== zoomed) {
      setZoomed(next)
      onZoomChange?.(next)
    }
  }

  const control =
    'w-9 h-9 rounded-full flex items-center justify-center bg-black/55 text-white hover:bg-black/75 disabled:opacity-40 transition-colors'

  return (
    <TransformWrapper
      minScale={1}
      maxScale={MAX_SCALE}
      centerOnInit
      limitToBounds
      // Zoomed: a double-click resets. Not zoomed: it zooms in at the pointer.
      doubleClick={{ mode: zoomed ? 'reset' : 'zoomIn', step: DOUBLE_CLICK_STEP, animationTime: 250 }}
      // At 1× leave drags to the parent (swipe to the next photo); pan only when zoomed.
      panning={{ disabled: !zoomed, velocityDisabled: true }}
      wheel={{ step: 0.15 }}
      onTransformed={handleTransformed}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full"
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className={`w-full h-full object-contain select-none ${zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'} ${className}`}
            />
          </TransformComponent>

          <div
            // Top-right, just below the viewer's close button, clear of the
            // centred prev/next arrows and the bottom dots.
            className="absolute top-14 right-3 z-10 flex flex-col gap-1.5"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => zoomIn(0.5)} aria-label="Zoom in" className={control}>
              <FiZoomIn className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => zoomOut(0.5)} disabled={!zoomed} aria-label="Zoom out" className={control}>
              <FiZoomOut className="w-4 h-4" />
            </button>
            {zoomed && (
              <button type="button" onClick={() => resetTransform()} aria-label="Reset zoom" className={control}>
                <FiMaximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}
    </TransformWrapper>
  )
}
