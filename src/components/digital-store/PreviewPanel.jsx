import { useEffect, useRef, useState } from 'react'
import { requestDigitalStorePreview } from '../../utils/digitalStoreApi'
import { DIGITAL_STORE_EVENTS, trackDigitalStoreEvent } from '../../utils/digitalStoreAnalytics'

export default function PreviewPanel({ templateId, fieldValues }) {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const previousUrlRef = useRef(null);

  useEffect(() => {
    return () => {
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
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current)
      }
      previousUrlRef.current = url
      setPreviewUrl(url)
      setStatus('ready')
      trackDigitalStoreEvent(DIGITAL_STORE_EVENTS.PREVIEW_GENERATED, { template_id: templateId })
    } catch (err) {
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
        This is your actual document — the same file you'll receive, watermarked only until you complete your purchase.
      </p>
      <button
        type="button"
        onClick={handlePreviewClick}
        disabled={status === 'loading'}
        className="bg-white border border-[#C9971F] text-[#C9971F] px-5 py-2 rounded-lg font-medium hover:bg-[#C9971F]/5 disabled:opacity-50"
      >
        {status === 'loading' ? 'Generating preview...' : 'Preview my document'}
      </button>

      {status === 'error' ? <p className="text-red-600 mt-3">{errorMessage}</p> : null}

      {status === 'ready' && previewUrl ? (
        <iframe title="Document preview" src={previewUrl} className="w-full mt-4 rounded-lg border" style={{ height: '70vh' }} />
      ) : null}
    </div>
  )
}
