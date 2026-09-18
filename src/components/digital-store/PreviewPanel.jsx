import { useEffect, useRef, useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { requestDigitalStorePreview } from '../../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../../utils/digitalStoreAnalytics'
import Button from '../ui/Button'

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
      <p className="text-sm text-[#4b4a55] mb-3">
        Want to double-check? Generate the exact, final PDF — the same file you'll receive, watermarked only until
        you complete your purchase.
      </p>
      <Button theme="store" variant="outline" onClick={handlePreviewClick} disabled={status === 'loading'}>
        {status === 'loading' ? 'Generating preview...' : "See the exact PDF you'll receive"}
      </Button>

      {status === 'error' ? <p className="text-red-600 mt-3">{errorMessage}</p> : null}

      {status === 'ready' && previewUrl ? (
        <>
          <iframe
            title="Document preview"
            src={previewUrl}
            className="w-full mt-4 rounded-lg border border-black/10 shadow-sm"
            style={{ height: '70vh' }}
          />
          {/* Fallback for mobile browsers that render blob: PDFs inconsistently inside an
              iframe - styled as a full button (Button.jsx's own store/outline classes,
              copied rather than nesting a <button> inside this <a>, which would be
              invalid HTML), not a small link, so it's not easy to miss on a small
              screen where it matters most. */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide border border-[var(--store-accent)]/60 text-[#17151f] transition-all duration-300 hover:bg-[var(--store-accent)]/10 hover:border-[var(--store-accent)]"
          >
            <FiExternalLink /> Open preview in a new tab
          </a>
        </>
      ) : null}
    </div>
  )
}
