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
  FiLayout,
  FiSearch,
  FiTool,
  FiServer,
  FiMapPin,
  FiBriefcase,
  FiClipboard,
  FiCoffee,
  FiUserCheck,
  FiCamera,
  FiHeart,
  FiUsers,
  FiCalendar,
  FiSun,
  FiAperture,
  FiGift,
  FiStar,
  FiCircle,
  FiHome,
  FiBook,
} from 'react-icons/fi'

import photographyThumbnail from '../assets/photography_website_thumbnail.jpg'
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
  {
    icon: FiLayout,
    title: 'Landing Page Design',
    description:
      'Focused, conversion-ready single pages for a campaign, launch, or offer that needs its own spotlight.',
  },
  {
    icon: FiSearch,
    title: 'SEO Optimization',
    description:
      'On-page and technical SEO that helps the right customers actually find your site on Google.',
  },
  {
    icon: FiTool,
    title: 'Website Maintenance',
    description:
      'Ongoing updates, backups, and fixes so your site stays fast, secure, and reliably online.',
  },
  {
    icon: FiServer,
    title: 'Domain & Hosting Setup',
    description:
      'Domain registration, DNS, and hosting configured correctly the first time — no guesswork.',
  },
  {
    icon: FiMapPin,
    title: 'Google Business Profile',
    description:
      'A fully set up, optimized Google Business listing so local customers can find and trust you.',
  },
  {
    icon: FiBriefcase,
    title: 'Portfolio Websites',
    description:
      'Clean, personal portfolio sites that put your best work front and center.',
  },
  {
    icon: FiClipboard,
    title: 'Invoice & Quotation Design',
    description:
      'Branded invoice and quotation templates that look professional and get you paid faster.',
  },
  {
    icon: FiCoffee,
    title: 'Menu Card Design',
    description:
      'Appetizing, easy-to-read menu designs for cafes, restaurants, and food businesses.',
  },
  {
    icon: FiUserCheck,
    title: 'LinkedIn Profile Makeover',
    description:
      'A sharper LinkedIn presence — photo, headline, and summary that reflect where you\'re headed.',
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
  'Landing Page Design',
  'SEO Optimization',
  'Website Maintenance',
  'Domain & Hosting Setup',
  'Google Business Profile',
  'Portfolio Websites',
  'Invoice & Quotation Design',
  'Menu Card Design',
  'LinkedIn Profile Makeover',
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
    icon: FiCalendar,
    title: 'Pre and Post Wedding',
    description: 'Placeholder — describe your pre-wedding and post-wedding shoot packages here.',
  },
  {
    icon: FiSun,
    title: 'Baby & Kids Outdoor Shoots',
    description: 'Placeholder — describe your baby and kids outdoor photography packages here.',
  },
  {
    icon: FiAperture,
    title: 'Model Outdoor Shoots',
    description: 'Placeholder — describe your model and portfolio outdoor shoot packages here.',
  },
  {
    icon: FiGift,
    title: 'Maternity and Baby Shower',
    description: 'Placeholder — describe your maternity and baby shower shoot packages here.',
  },
  {
    icon: FiStar,
    title: 'Birthday Parties',
    description: 'Placeholder — describe your birthday party photography packages here.',
  },
  {
    icon: FiUsers,
    title: 'All Traditional Events',
    description: 'Placeholder — describe your traditional and cultural event coverage here.',
  },
  {
    icon: FiCircle,
    title: 'Ring Ceremony',
    description: 'Placeholder — describe your ring ceremony/engagement shoot packages here.',
  },
  {
    icon: FiHome,
    title: 'House Warming',
    description: 'Placeholder — describe your house warming event coverage packages here.',
  },
  {
    icon: FiBook,
    title: 'Photo Album Design',
    description: 'Placeholder — describe your photo album design and printing packages here.',
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
  'Pre and Post Wedding',
  'Baby & Kids Outdoor Shoots',
  'Model Outdoor Shoots',
  'Maternity and Baby Shower',
  'Birthday Parties',
  'All Traditional Events',
  'Ring Ceremony',
  'House Warming',
  'Photo Album Design',
  'Other',
]

/* =================================================
   SHARED
   ================================================= */

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/mcreatik', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mcreatik', icon: 'linkedin' },
]
