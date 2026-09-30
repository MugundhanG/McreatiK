/* ============================================
   PrivacyPolicyPage
   Site-wide privacy policy covering all three
   McreatiK departments (Tech, Studios, Digital
   Store). Linked from every department's footer
   and from each contact form's consent line.
   ============================================ */

import React from 'react'
import LegalPage from '../components/legal/LegalPage'
import { useSEO } from '../hooks/useSEO'

const LAST_UPDATED = '30 September 2026'

const SECTIONS = [
  {
    id: 'introduction',
    heading: 'Introduction',
    body: [
      'McreatiK ("we", "us", "our") operates as three departments under one roof: McreatiK Tech (websites, SEO, branding and digital services), McreatiK Studios (photography — weddings, portraits, events and albums) and the McreatiK Digital Store (downloadable digital documents and templates). We are based in Chennai, Tamil Nadu, India.',
      'This policy explains what personal data we collect across mcreatik.com, why we collect it, who we share it with, and the rights you have over it under India’s Digital Personal Data Protection Act, 2023 ("DPDP Act"). It applies to visitors, enquirers, clients and Digital Store customers alike.',
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    navLabel: 'Information we collect',
    body: [
      'We collect only what a given form or feature needs to do its job:',
    ],
    list: [
      'Contact forms (Home, Tech and Studios): your name, email, phone number, message, and how you heard about us. These are sent to us by email through EmailJS.',
      'Studios booking popup: your name, phone number and the service you’re interested in.',
      'Digital Store account: name, email and a password, which is stored hashed — we never store or see your plain-text password.',
      'Digital Store orders: the items you buy, the details you type into a document’s customization form, any images you upload into a document, and the order’s payment status.',
      'Payments: processed by Razorpay. McreatiK never sees or stores your card, UPI or bank account details — Razorpay handles those directly.',
      'Analytics: Google Analytics 4 runs site-wide, collecting cookies and anonymised usage data such as pages visited, device type and approximate location.',
    ],
  },
  {
    id: 'how-we-use-your-information',
    heading: 'How We Use Your Information',
    navLabel: 'How we use your data',
    body: [
      'We use the information above to:',
    ],
    list: [
      'Reply to your enquiry and give you a quote.',
      'Schedule a photography shoot.',
      'Deliver Digital Store orders and downloads.',
      'Process payments and handle refunds.',
      'Send you service messages about an order or booking (e.g. status updates).',
      'Improve the site, using aggregate, anonymised analytics.',
      'Meet our legal and tax obligations.',
    ],
    after: 'We do not sell your data, and we do not send marketing messages without your consent.',
  },
  {
    id: 'payments',
    heading: 'Payments',
    body: [
      'Digital Store payments are processed by Razorpay. When you pay, your card, UPI or bank details go directly to Razorpay — McreatiK never sees or stores them. We only receive confirmation of whether a payment succeeded, along with an order and transaction reference.',
      'Once payment is confirmed, your files are delivered through secure, time-limited download links.',
    ],
  },
  {
    id: 'cookies-analytics',
    heading: 'Cookies & Analytics',
    navLabel: 'Cookies & analytics',
    body: [
      'We use Google Analytics 4 to understand how visitors use the site — pages visited, device type and approximate location, all in anonymised, aggregate form. This uses cookies. We do not run any advertising or tracking pixels.',
    ],
  },
  {
    id: 'browser-storage',
    heading: 'Browser Storage',
    body: [
      'The Digital Store uses your browser’s session storage to keep track of your cart and checkout state as you shop. This data stays in your browser and clears when your session ends — it isn’t used for tracking or advertising.',
    ],
  },
  {
    id: 'third-party-links',
    heading: 'Third-Party Links',
    navLabel: 'Third-party links',
    body: [
      'Clicking our WhatsApp or Instagram buttons takes you to those services, where their own privacy policies apply. We don’t control, and aren’t responsible for, how those platforms handle your data.',
    ],
  },
  {
    id: 'data-sharing',
    heading: 'Who We Share Data With',
    navLabel: 'Who we share data with',
    body: [
      'We share data only with the service providers ("processors") that help us run McreatiK:',
    ],
    list: [
      'EmailJS — delivers contact-form submissions to us by email.',
      'Google Analytics — site usage analytics.',
      'Razorpay — payment processing for the Digital Store.',
      'Supabase — our database. Data may be stored on servers outside India, including in Japan.',
      'Cloudflare R2 — file storage for Digital Store downloads.',
      'Oracle Cloud — application hosting for McreatiK Studios’ backend.',
      'Vercel — website hosting.',
    ],
    after: 'Where personal data is processed outside India, we rely on these providers’ own reasonable security safeguards. We don’t sell your data to anyone, and we don’t share it beyond what’s needed to run the service.',
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    body: [
      'We keep enquiries (contact-form and booking submissions) for up to 24 months.',
      'Orders and invoices are kept for as long as tax law requires — currently up to 8 years.',
      'Digital Store accounts are kept until you ask us to delete them.',
      'Analytics data is retained according to Google’s own retention settings.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your Rights',
    body: [
      'Under the DPDP Act, you have the right to:',
    ],
    list: [
      'Access the personal data we hold about you.',
      'Correct inaccurate or incomplete data.',
      'Request deletion of your data.',
      'Withdraw consent at any time, where processing relies on it.',
      'Nominate a representative to exercise these rights on your behalf in the event of your death or incapacity.',
      'Complain to the Data Protection Board of India if you’re not satisfied with how we’ve handled your request.',
    ],
    after: 'To exercise any of these rights, email connect@mcreatik.com. We aim to respond within 30 days.',
  },
  {
    id: 'childrens-privacy',
    heading: 'Children’s Privacy',
    navLabel: 'Children’s privacy',
    body: [
      'Our services aren’t directed at children under 18. Where a photography session involves a child, a parent or guardian books and manages the enquiry on their behalf.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    body: [
      'We use reasonable technical and organisational measures — including hashed passwords and secure, time-limited download links — to protect the personal data we hold. No method of transmission or storage is completely secure, but we work with reputable processors and keep access limited to what each service needs.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    body: [
      'We may update this policy from time to time. Material changes will be reflected here with an updated "Last updated" date. Continuing to use mcreatik.com after a change means you accept the updated policy.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact & Grievance Officer',
    navLabel: 'Contact us',
    body: [
      'For any privacy question, request or complaint — including under the DPDP Act — contact our Grievance Officer:',
      'Email: connect@mcreatik.com',
      'Phone / WhatsApp: +91 99527 58545',
      'We aim to respond within 30 days.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy | McreatiK',
    description: 'How McreatiK collects, uses, shares and protects your personal data across McreatiK Tech, McreatiK Studios and the McreatiK Digital Store.',
    path: '/privacy',
  })

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={[
        'These are McreatiK’s standard privacy terms, covering all of McreatiK Tech, McreatiK Studios and the McreatiK Digital Store. Questions? Email connect@mcreatik.com.',
      ]}
      sections={SECTIONS}
    />
  )
}
