/* ============================================
   TermsPage
   Site-wide terms of service covering all three
   McreatiK departments (Tech, Studios, Digital
   Store). Linked from every department's footer
   and from each contact form's consent line.
   ============================================ */

import React from 'react'
import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'
import { useSEO } from '../hooks/useSEO'

const LAST_UPDATED = '30 September 2026'

const SECTIONS = [
  {
    id: 'agreement',
    heading: 'Agreement to These Terms',
    navLabel: 'Agreement to these terms',
    body: [
      'These Terms of Service govern your use of mcreatik.com and any service you book or buy from McreatiK — across McreatiK Tech (websites, SEO, branding and digital services), McreatiK Studios (photography) and the McreatiK Digital Store (downloadable digital documents and templates). We are based in Chennai, Tamil Nadu, India.',
      'By using this site or engaging any of our services, you agree to these terms. If you don’t agree, please don’t use the site or our services.',
    ],
  },
  {
    id: 'using-the-site',
    heading: 'Using This Website',
    navLabel: 'Using this website',
    body: [
      'You agree to provide accurate information when contacting us, booking a service, or creating a Digital Store account — quotes, deliverables and orders are only as reliable as the details you give us.',
    ],
  },
  {
    id: 'tech-services',
    heading: 'McreatiK Tech — Web Services',
    body: [
      'Quotes are valid for 30 days from the date they’re issued.',
      'Work begins once an advance payment is received.',
      'The scope of work and number of revisions are as agreed in the quote for your project.',
      'You provide the content for your project and confirm you hold the rights to use it.',
      'Ownership of the final deliverables passes to you once payment is made in full.',
      'McreatiK may showcase completed work in its portfolio.',
      'Third-party costs — domain registration, hosting, paid plugins or licences — are paid by you.',
      'Delivery timelines depend on your timely feedback and approvals at each stage.',
    ],
  },
  {
    id: 'studios-services',
    heading: 'McreatiK Studios',
    body: [
      'A booking is confirmed once an advance payment is received.',
      'Cancellation and rescheduling terms are whatever was agreed at the time of booking.',
      'Delivery timelines for edited photos and albums are as agreed at booking.',
      'McreatiK retains copyright in the photographs it takes and grants you a licence for personal use.',
    ],
    after: 'Portfolio: McreatiK may feature your photographs in its portfolio, gallery and social media, unless you ask us in writing to keep them private or to remove them.',
  },
  {
    id: 'digital-store',
    heading: 'McreatiK Digital Store',
    navLabel: 'Digital Store',
    body: [
      'Products you buy from the Digital Store are licensed for your personal or business use only — you may not resell or redistribute them.',
    ],
    after: (
      <>
        Refunds and cancellations are handled under our{' '}
        <Link to="/store/refund-policy" className="font-semibold text-[#D8AE55] hover:underline">
          Refund &amp; Cancellation Policy
        </Link>
        .
      </>
    ),
  },
  {
    id: 'demo-concepts',
    heading: 'Website Concepts & Demo Pages',
    navLabel: 'Website Concepts & demos',
    body: [
      'Pages under /tech/demos and /demos/* showcase website concepts built around fictional businesses, purely to demonstrate our design and development work. Nothing on those pages is a real offer, business or listing.',
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    body: [
      'Everything on mcreatik.com — including its design, code, text, graphics and logos — belongs to McreatiK or its licensors, except for content you’ve provided (such as your own project content) or final deliverables once ownership has passed to you under the relevant service terms above. You may not copy, reproduce or reuse our site content without permission.',
    ],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable Use',
    body: [
      'You agree not to misuse this site — including attempting to disrupt it, access it using unauthorised means, or use it for any unlawful purpose.',
    ],
  },
  {
    id: 'third-party-links',
    heading: 'Third-Party Links',
    navLabel: 'Third-party links',
    body: [
      'Our site links to third-party services such as WhatsApp, Instagram and Razorpay. We’re not responsible for the content, policies or practices of those third parties.',
    ],
  },
  {
    id: 'liability',
    heading: 'Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, McreatiK’s liability for any claim arising from a service is limited to the amount you paid for that specific service.',
    ],
  },
  {
    id: 'indemnity',
    heading: 'Indemnity',
    body: [
      'You agree to indemnify McreatiK against any claims, losses or damages arising from your breach of these terms, misuse of the site, or content you provide us that infringes someone else’s rights.',
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law & Jurisdiction',
    navLabel: 'Governing law & jurisdiction',
    body: [
      'These terms are governed by the laws of India. Courts in Chennai, Tamil Nadu have exclusive jurisdiction over any dispute arising from these terms or your use of our services.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to These Terms',
    body: [
      'We may update these terms from time to time. Material changes will be reflected here with an updated "Last updated" date. Continuing to use mcreatik.com or our services after a change means you accept the updated terms.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    body: [
      'These are McreatiK’s standard terms, and questions can be sent to connect@mcreatik.com or +91 99527 58545.',
    ],
  },
]

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service | McreatiK',
    description: 'The terms governing your use of mcreatik.com and any service booked or bought from McreatiK Tech, McreatiK Studios or the McreatiK Digital Store.',
    path: '/terms',
  })

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={[
        'These are McreatiK’s standard terms, covering all of McreatiK Tech, McreatiK Studios and the McreatiK Digital Store. Questions? Email connect@mcreatik.com.',
      ]}
      sections={SECTIONS}
    />
  )
}
