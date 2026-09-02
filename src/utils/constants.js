/* ============================================
   Constants
   Central data store for all static content,
   split by department:
     TECH_*     — McreatiK Tech & Creative Solutions
     STUDIOS_*  — McreatiK Studios (photography)
   ============================================ */

import {
  FiGlobe,
  FiCreditCard,
  FiPenTool,
  FiFileText,
  FiRefreshCw,
  FiCamera,
  FiHeart,
  FiUsers,
  FiBox,
} from 'react-icons/fi'

import photographyThumbnail from '../assets/photography_website_thumbnail.jpg'
import logoDesignThumbnail from '../assets/logo_design.webp'
import adThumbnail from '../assets/ADthumbnail.jpg'

/* =================================================
   MCREATIK TECH & CREATIVE SOLUTIONS
   ================================================= */

export const TECH_NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const TECH_SERVICES = [
  {
    icon: FiGlobe,
    title: 'Website Development',
    description:
      'Custom-built, responsive websites that deliver exceptional user experiences and drive conversions and business growth.',
  },
  {
    icon: FiPenTool,
    title: 'Logo Design',
    description:
      'Distinctive brand identities crafted to communicate your vision and stand out in the market.',
  },
  {
    icon: FiCreditCard,
    title: 'Business Card Design',
    description:
      'Print-ready business card designs that make a sharp first impression and reinforce your brand.',
  },
  {
    icon: FiRefreshCw,
    title: 'Website Enhancement',
    description:
      'Revamp and modernize an existing website — improved design, performance, and user experience.',
  },
  {
    icon: FiFileText,
    title: 'Resume Design & Makeover',
    description:
      'Professional, ATS-friendly resumes that highlight your strengths and open doors.',
  },
]

export const TECH_PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Photography Business Website',
    category: 'Website',
    image: photographyThumbnail,
    link: 'https://mugundhang.github.io/Heeswar-photography/',
    description: 'Fully responsive photography website with modern design and seamless user experience with contact form.',
  },
  {
    id: 2,
    title: 'Luxury Brand Identity',
    category: 'Logo',
    image: logoDesignThumbnail,
    link: '#',
    description: 'Complete brand identity system for a luxury fashion label.',
  },
  {
    id: 3,
    title: 'Engeering Solutions Website',
    category: 'Website',
    image: adThumbnail,
    link: 'https://mugundhang.github.io/ArtificerDynamics/',
    description: 'A modern business website built with clean design and seamless user experience.',
  },
  {
    id: 4,
    title: 'Elegance Resume Suite',
    category: 'Resume',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
    pdf: '/sampleresume.pdf',
    link: '#',
    description: 'Professional resume templates with modern, clean layouts.',
  },
]

export const TECH_STATS = [
  { value: '30+', label: 'Projects Delivered' },
  { value: '2+', label: 'Years of Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

export const TECH_SERVICE_OPTIONS = [
  'Website Development',
  'Logo Design',
  'Business Card Design',
  'Website Enhancement',
  'Resume Design & Makeover',
  'Other',
]

/* =================================================
   MCREATIK STUDIOS (photography)
   PLACEHOLDER CONTENT — swap in real services,
   gallery images, and copy before launch.
   ================================================= */

export const STUDIOS_NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Offerings', href: '#offerings' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Book', href: '#book' },
]

export const STUDIOS_SERVICES = [
  {
    icon: FiCamera,
    title: 'Portrait Sessions',
    description: 'Placeholder — describe your portrait/headshot session packages here.',
  },
  {
    icon: FiHeart,
    title: 'Wedding Photography',
    description: 'Placeholder — describe your wedding coverage packages here.',
  },
  {
    icon: FiUsers,
    title: 'Event Coverage',
    description: 'Placeholder — describe your event/corporate photography packages here.',
  },
  {
    icon: FiBox,
    title: 'Product Photography',
    description: 'Placeholder — describe your product/commercial photography packages here.',
  },
]

/* Gallery entries — no real photos yet, rendered as labeled
   placeholder frames until real images are supplied. */
export const STUDIOS_GALLERY_ITEMS = [
  { id: 1, category: 'Portrait', title: 'Portrait Session — placeholder' },
  { id: 2, category: 'Wedding', title: 'Wedding Coverage — placeholder' },
  { id: 3, category: 'Event', title: 'Event Coverage — placeholder' },
  { id: 4, category: 'Product', title: 'Product Shoot — placeholder' },
]

export const STUDIOS_STATS = [
  { value: '—', label: 'Shoots Delivered' },
  { value: '—', label: 'Years Behind the Lens' },
  { value: '—', label: 'Happy Clients' },
]

export const STUDIOS_SERVICE_OPTIONS = [
  'Portrait Session',
  'Wedding Photography',
  'Event Coverage',
  'Product Photography',
  'Other',
]

/* =================================================
   SHARED
   ================================================= */

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/mcreatik', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mcreatik', icon: 'linkedin' },
]
