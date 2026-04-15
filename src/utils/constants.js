/* ============================================
   Constants
   Central data store for all static content
   used across the website. Edit these values
   to update text, links, and service listings
   without touching component code.
   ============================================ */

import {
  FiGlobe,
  FiCreditCard,
  FiPenTool,
  FiImage,
  FiFileText,
  FiLayout,
} from 'react-icons/fi'

import photographyThumbnail from '../assets/photography_website_thumbnail.jpg'
import logoDesignThumbnail from '../assets/logo_design.webp'

/* ---------- Navigation Links ---------- */
export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/* ---------- Services Offered ----------
   Each service has an icon component, title,
   and a short description shown on service cards. */
export const SERVICES = [
  {
    icon: FiGlobe,
    title: 'Website Development',
    description:
      'Custom-built, responsive websites that deliver exceptional user experiences and drive conversions and business growth.',
  },
  {
    icon: FiCreditCard,
    title: 'Digital Cards',
    description:
      'Modern digital business cards that make lasting impressions and simplify networking.',
  },
  {
    icon: FiPenTool,
    title: 'Logo Design',
    description:
      'Distinctive brand identities crafted to communicate your vision and stand out in the market.',
  },
  {
    icon: FiImage,
    title: 'Photo Albums',
    description:
      'Beautifully designed digital albums that showcase your memories and creative work.',
  },
  {
    icon: FiFileText,
    title: 'Resume Design',
    description:
      'Professional, ATS-friendly resumes that highlight your strengths and open doors.',
  },
  {
    icon: FiLayout,
    title: 'UI/UX Design',
    description:
      'Intuitive interfaces designed through research, testing, and a deep focus on the user journey.',
  },
]

/* ---------- Portfolio Projects ----------
   Each entry renders as a clickable card.
   `image` uses a placeholder; replace with
   real thumbnails in /public/portfolio/.
   `link` points to the live project URL. */
export const PORTFOLIO_ITEMS = [
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
    title: 'TechVault Digital Card',
    category: 'Digital Card',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
    link: '#',
    description: 'Interactive digital business card with NFC integration.',
  },
  {
    id: 4,
    title: 'Wanderlust Photo Album',
    category: 'Album',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    link: '#',
    description: 'A cinematic travel album with immersive gallery experience.',
  },
  {
    id: 5,
    title: 'FinFlow Dashboard',
    category: 'Website',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    link: '#',
    description: 'Real-time financial dashboard with data visualization.',
  },
  {
    id: 6,
    title: 'Elegance Resume Suite',
    category: 'Resume',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
    link: '#',
    description: 'Professional resume templates with modern, clean layouts.',
  },
]

/* ---------- Company Stats ---------- */
export const STATS = [
  { value: '30+', label: 'Projects Delivered' },  
  { value: '2+', label: 'Years of Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

/* ---------- Social Media Links ---------- */
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/mcreatik', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/mcreatik', icon: 'linkedin' },
  // { label: 'Twitter', href: 'https://twitter.com/mcreatik', icon: 'twitter' },
  // { label: 'Facebook', href: 'https://facebook.com/mcreatik', icon: 'facebook' },
]

/* ---------- Contact Form Fields ---------- */
export const SERVICE_OPTIONS = [
  'Website Development',
  'Digital Cards',
  'Logo Design',
  'Album Design',
  'Resume Creation/Makeover',
  'UI/UX Design',
  'Other',
]
