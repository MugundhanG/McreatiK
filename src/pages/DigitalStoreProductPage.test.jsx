import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DigitalStoreProductPage from './DigitalStoreProductPage'
import * as api from '../utils/digitalStoreApi'
import * as scriptLoader from '../utils/razorpayScriptLoader'

const TEMPLATE = {
  id: 't1',
  name: 'Wedding Photography Agreement',
  price: 99.0,
  currency: 'INR',
  fieldSchema: {
    fields: [{ name: 'brideName', type: 'string', label: "Bride's Name", required: true, maxLength: 100 }],
  },
  marketingContent: null,
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/digital_store/t1']}>
      <Routes>
        <Route path="/digital_store/:templateId" element={<DigitalStoreProductPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(api, 'fetchDigitalStoreTemplate').mockResolvedValue(TEMPLATE)
  vi.spyOn(scriptLoader, 'loadRazorpayCheckoutScript').mockResolvedValue(undefined)
  window.Razorpay = class {
    open() {}
  }
})

describe('DigitalStoreProductPage', () => {
  it('blocks checkout and shows an inline message when a required field is left blank', async () => {
    const createOrderSpy = vi.spyOn(api, 'createDigitalStoreOrder')
    renderPage()

    fireEvent.change(await screen.findByLabelText('Your Name *'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Your Email *'), { target: { value: 'jane@example.com' } })
    // brideName (a required custom field) is deliberately left blank.

    fireEvent.click(screen.getByRole('button', { name: /^pay/i }))

    expect(await screen.findByText(/please fill in all required fields above/i)).toBeInTheDocument()
    expect(createOrderSpy).not.toHaveBeenCalled()
  })

  it('threads server-side field errors from a failed checkout into the form', async () => {
    const validationError = Object.assign(new Error('Validation failed'), {
      status: 400,
      fieldErrors: { brideName: "Bride's Name is required" },
    })
    vi.spyOn(api, 'createDigitalStoreOrder').mockRejectedValue(validationError)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Your Name *'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Your Email *'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText("Bride's Name *"), { target: { value: 'Placeholder' } })

    fireEvent.click(screen.getByRole('button', { name: /^pay/i }))

    expect(await screen.findByText("Bride's Name is required")).toBeInTheDocument()
  })

  it('displays the formatted INR price with the rupee symbol', async () => {
    renderPage()

    expect((await screen.findAllByText('₹99')).length).toBeGreaterThan(0)
  })
})
