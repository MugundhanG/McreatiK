import { useEffect, useRef, useState } from 'react'
import { requestDigitalStorePreview } from '../../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../../utils/digitalStoreAnalytics'

export default function PreviewPanel({ templateId, fieldValues }) {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const previousUrlRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    // Set (not just initialize) on every effect run: StrictMode's dev-only
    // double-invoke (mount -> effect -> cleanup -> effect) would otherwise
    // leave this permanently false after the first cleanup, since the ref's
    // initial value only ever applies once.
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current)
      }
    }
  }, [])

  async function handlePreviewClick() {
    setStatus('loading')
    setErrorMessage(null)
    trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PREVIEW_REQUESTED, { template_id: templateId })
    try {
      const blob = await requestDigitalStorePreview(templateId, fieldValues)
      const url = URL.createObjectURL(blob)

      // Guard against state updates after unmount
      if (!isMountedRef.current) {
        // Component unmounted; revoke the URL immediately and bail
        URL.revokeObjectURL(url)
        return
      }

      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current)
      }
      previousUrlRef.current = url
      setPreviewUrl(url)
      setStatus('ready')
      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PREVIEW_GENERATED, { template_id: templateId })
    } catch (err) {
      // Guard against state updates after unmount
      if (!isMountedRef.current) {
        return
      }

      setStatus('error')
      if (err.fieldErrors) {
        setErrorMessage('Please fill in all required fields correctly before previewing.')
      } else {
        setErrorMessage('Something went wrong generating your preview. Please try again in a moment.')
      }
    }
  }

  return (
    <div className="py-10">
      <p className="text-sm text-gray-600 mb-3">
        Want to double-check? Generate the exact, final PDF — the same file you'll receive, watermarked only until
        you complete your purchase.
      </p>
      <button
        type="button"
        onClick={handlePreviewClick}
        disabled={status === 'loading'}
        className="bg-white border border-[#8B7FE8] text-[#8B7FE8] px-5 py-2 rounded-lg font-medium hover:bg-[#8B7FE8]/5 disabled:opacity-50"
      >
        {status === 'loading' ? 'Generating preview...' : "See the exact PDF you'll receive"}
      </button>

      {status === 'error' ? <p className="text-red-600 mt-3">{errorMessage}</p> : null}

      {status === 'ready' && previewUrl ? (
        <>
          <iframe title="Document preview" src={previewUrl} className="w-full mt-4 rounded-lg border" style={{ height: '70vh' }} />
          {/* Fallback for mobile browsers that render blob: PDFs inconsistently inside an iframe. */}
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-[#8B7FE8] underline">
            Open preview in a new tab
          </a>
        </>
      ) : null}
    </div>
  )
}
