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
  FiActivity,
  FiScissors,
  FiShoppingBag,
  FiPlusCircle,
  FiSmartphone,
  FiTarget,
  FiZap,
  FiLifeBuoy,
  FiCheckCircle,
  FiEdit3,
  FiCode,
  FiEye,
  FiSend,
  FiMessageCircle,
  FiShare2,
  FiMessageSquare,
  FiCompass,
  FiFeather,
  FiPackage,
  FiUser,
  FiLayers,
  FiGrid,
} from 'react-icons/fi'

/* Shared contact number used for WhatsApp CTAs across both departments */
export const WHATSAPP_NUMBER = '919600129267'

import photographyThumbnail from '../assets/photography_website_thumbnail.jpg'
import adThumbnail from '../assets/ADthumbnail.jpg'

/* =================================================
   MCREATIK TECH & CREATIVE SOLUTIONS
   ================================================= */

export const TECH_NAV_LINKS = [
  { label: 'Home', href: '/tech', type: 'page' },
  { label: 'Services', href: '/tech/services', type: 'page' },
  { label: 'Industries', href: '/tech/industries', type: 'page' },
  { label: 'Portfolio', href: '/tech/work', type: 'page' },
  { label: 'Our Process', href: '/tech#process', type: 'anchor' },
  { label: 'About Us', href: '/tech#about', type: 'anchor' },
  { label: 'FAQs', href: '/tech/faq', type: 'page' },
  { label: 'Contact Us', href: '/tech#contact', type: 'anchor' },
]

export const TECH_TARGET_INDUSTRIES = [
  {
    icon: FiActivity,
    title: 'Dental Clinics',
    description: 'Professional websites that showcase treatments, doctors and facilities, and make appointment enquiries easier.',
  },
  {
    icon: FiPlusCircle,
    title: 'Medical Clinics',
    description: 'Clear, trustworthy sites that present your specialities and make it simple for patients to reach you.',
  },
  {
    icon: FiCoffee,
    title: 'Restaurants & Cafés',
    description: 'Menus, ambience and location made easy to find, so hungry customers choose you first.',
  },
  {
    icon: FiScissors,
    title: 'Salons & Spas',
    description: 'Showcase your services and let clients browse and enquire before they even walk in.',
  },
  {
    icon: FiCamera,
    title: 'Photography Studios',
    description: 'A polished portfolio site that does justice to the work you already deliver.',
  },
  {
    icon: FiHeart,
    title: 'Gyms & Fitness Centers',
    description: 'Show off your space, trainers and plans in a way that turns browsers into members.',
  },
  {
    icon: FiShoppingBag,
    title: 'Retail Businesses',
    description: 'Put your products and store details online, where local shoppers are already looking.',
  },
  {
    icon: FiBriefcase,
    title: 'Professional Services',
    description: 'Build the credibility clients expect to see before they pick up the phone.',
  },
  {
    icon: FiHome,
    title: 'Local Businesses',
    description: "Whatever you run, a clear, modern website makes it easier for customers to find and trust you.",
  },
]

export const TECH_SERVICE_CATEGORIES = ['Websites', 'Branding', 'Digital Design']

export const TECH_SERVICES = [
  {
    icon: FiGlobe,
    title: 'Website Development',
    description:
      'A professional website that gives your business credibility and makes it easy for customers to find and contact you.',
    category: 'Websites',
    featured: true,
  },
  {
    icon: FiRefreshCw,
    title: 'Website Redesign',
    description:
      'Turn an outdated site into a modern one — refreshed design, better performance, and a clearer user experience.',
    category: 'Websites',
  },
  {
    icon: FiLayout,
    title: 'Landing Page Design',
    description:
      'A focused, conversion-ready page for a campaign, launch, or offer that needs its own spotlight.',
    category: 'Websites',
  },
  {
    icon: FiBriefcase,
    title: 'Portfolio Websites',
    description:
      'A clean, personal site that puts your best work front and center for clients and employers.',
    category: 'Websites',
  },
  {
    icon: FiSearch,
    title: 'SEO Optimization',
    description:
      'On-page and technical SEO that helps the right customers actually find your site on Google.',
    category: 'Websites',
  },
  {
    icon: FiTool,
    title: 'Website Care & Maintenance',
    description:
      'Ongoing updates, backups, and fixes so your site stays fast, secure, and reliably online.',
    category: 'Websites',
  },
  {
    icon: FiServer,
    title: 'Domain & Hosting Setup',
    description:
      'Domain registration, DNS, and hosting configured correctly the first time — no guesswork.',
    category: 'Websites',
  },
  {
    icon: FiMapPin,
    title: 'Google Business Profile',
    description:
      'A fully set up, optimized Google Business listing so local customers can find and trust you.',
    category: 'Websites',
  },
  {
    icon: FiMessageCircle,
    title: 'WhatsApp Business Setup',
    description:
      'Your WhatsApp Business profile, catalog, and quick replies set up so enquiries turn into conversations fast.',
    category: 'Websites',
  },
  {
    icon: FiPenTool,
    title: 'Logo Design',
    description:
      'A distinctive identity that communicates your business and stands out in the market.',
    category: 'Branding',
  },
  {
    icon: FiCreditCard,
    title: 'Business Card Design',
    description:
      'A print-ready card that makes a sharp first impression and reinforces your brand.',
    category: 'Branding',
  },
  {
    icon: FiFileText,
    title: 'Resume Design & Makeover',
    description:
      'A professional, ATS-friendly resume that highlights your strengths and opens doors.',
    category: 'Digital Design',
  },
  {
    icon: FiCoffee,
    title: 'Menu Card Design',
    description:
      'An appetizing, easy-to-read menu for cafes, restaurants, and food businesses.',
    category: 'Digital Design',
  },
  {
    icon: FiClipboard,
    title: 'Invoice & Quotation Design',
    description:
      'A branded invoice and quotation template that looks professional and gets you paid faster.',
    category: 'Digital Design',
  },
  {
    icon: FiUserCheck,
    title: 'LinkedIn Profile Makeover',
    description:
      "A sharper LinkedIn presence — photo, headline, and summary that reflect where you're headed.",
    category: 'Digital Design',
  },
  {
    icon: FiShare2,
    title: 'Social Media Creatives',
    description:
      'Branded post templates and graphics so your social pages look as professional as your website.',
    category: 'Digital Design',
  },
]

export const TECH_PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Photography Business Website',
    category: 'Website',
    industry: 'Photography Studio',
    image: photographyThumbnail,
    link: 'https://mugundhang.github.io/Heeswar-photography/',
    description: 'Fully responsive photography website with modern design and seamless user experience with contact form.',
    challenge: 'Needed a professional home online to showcase their work and give potential clients an easy way to get in touch.',
    result: 'A fully responsive site with a built-in enquiry form, live and ready to take visitor contact.',
    features: ['Responsive Design', 'Contact Form', 'Portfolio Gallery'],
  },
  {
    id: 3,
    title: 'Engeering Solutions Website',
    category: 'Website',
    industry: 'Professional Services',
    image: adThumbnail,
    link: 'https://mugundhang.github.io/ArtificerDynamics/',
    description: 'A modern business website built with clean design and seamless user experience.',
    challenge: 'Needed a credible online presence that matched the quality of their engineering work.',
    result: 'A clean, modern site that presents their services clearly to prospective clients.',
    features: ['Responsive Design', 'Service Pages', 'Modern UI'],
  },
  {
    id: 4,
    title: 'Elegance Resume Suite',
    category: 'Resume',
    industry: 'Digital Design',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
    pdf: '/sampleresume.pdf',
    link: '#',
    description: 'Professional resume templates with modern, clean layouts.',
    challenge: 'Job seekers needed resumes that stood out without looking gimmicky or hard to scan.',
    result: 'ATS-friendly templates with a modern, professional layout, ready to customize.',
    features: ['ATS-Friendly', 'Print-Ready', 'Modern Layout'],
  },
]

/* =================================================
   Sales-focused sections — Why Us, What You Get,
   Packages, Process
   ================================================= */

export const TECH_WHY_CHOOSE_US = [
  {
    icon: FiLayout,
    title: 'Modern & Professional',
    description: 'Websites designed to make your business look credible from the first click.',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile First',
    description: 'Optimized for the customers browsing you from their phones — most of them.',
  },
  {
    icon: FiTarget,
    title: 'Built Around Your Business',
    description: 'Every website is tailored to your business instead of a generic template.',
  },
  {
    icon: FiZap,
    title: 'Conversion Focused',
    description: 'Clear calls-to-action designed to turn visitors into enquiries.',
  },
  {
    icon: FiCheckCircle,
    title: 'Fast & Reliable',
    description: 'Optimized for a smooth experience so visitors don\'t bounce before they see what you offer.',
  },
  {
    icon: FiLifeBuoy,
    title: 'Ongoing Support',
    description: 'Assistance after launch whenever your business needs updates.',
  },
]

export const TECH_TRUST_STATEMENTS = [
  'Custom-designed websites',
  'Mobile-first experiences',
  'Business-focused design',
  'Direct client communication',
  'Post-launch support',
]

export const TECH_WHAT_YOU_GET = [
  {
    title: 'Responsive design',
    description: 'Your site resizes and rearranges itself for phones, tablets, and desktops — no pinching or zooming to read it.',
  },
  {
    title: 'Mobile optimization',
    description: 'Tap targets, load speed, and layout tuned for the phone screens most of your visitors will actually use.',
  },
  {
    title: 'WhatsApp integration',
    description: 'A tap-to-chat button that opens a conversation with you directly — no typing a number to save first.',
  },
  {
    title: 'Contact forms',
    description: 'A simple form so visitors can reach you without leaving the page or opening their email app.',
  },
  {
    title: 'Google Maps integration',
    description: 'An embedded map showing exactly where you are, so customers can get directions in one tap.',
  },
  {
    title: 'Social media integration',
    description: 'Links to your Instagram, Facebook, and other profiles, so visitors can follow you where they already spend time.',
  },
  {
    title: 'Service pages',
    description: 'A dedicated page for each service you offer, so customers find details on exactly what they need.',
  },
  {
    title: 'Gallery',
    description: 'A visual showcase of your work, products, or space that lets people see the quality before they contact you.',
  },
  {
    title: 'FAQ section',
    description: 'Answers to the questions you get asked most, so visitors get clarity without messaging you first.',
  },
  {
    title: 'SEO-friendly structure',
    description: 'Pages built the way Google expects, so your business shows up when people search for what you do.',
  },
  {
    title: 'Performance optimization',
    description: 'A site that loads fast on any connection — slow pages lose visitors before they see anything.',
  },
  {
    title: 'Domain & hosting guidance',
    description: 'Help picking and setting up where your site lives online, so you\'re not stuck figuring it out alone.',
  },
  {
    title: 'Post-launch support',
    description: 'Assistance after your site goes live, whenever something needs updating or fixing.',
  },
]

export const TECH_PACKAGES = [
  {
    name: 'Starter',
    displayName: 'Professional Presence',
    price: '₹25,000',
    tagline: 'For small businesses that need a polished and credible online presence.',
    highlight: false,
    categories: [
      {
        title: 'Website',
        items: [
          'Up to 4–5 pages',
          'Custom responsive design',
          'Mobile, tablet & desktop optimization',
          'Professional homepage',
          'WhatsApp integration',
        ],
      },
      {
        title: 'Business Setup',
        items: ['Google Business Profile setup', 'Social media links', 'Click-to-chat integration'],
      },
      {
        title: 'SEO',
        items: ['Basic on-page SEO', 'Meta titles & descriptions', 'Image optimization'],
      },
    ],
  },
  {
    name: 'Professional',
    displayName: 'Business Growth Website',
    price: '₹50,000',
    tagline: 'For businesses that want a stronger digital presence and a website designed to generate more enquiries.',
    highlight: true,
    extraFrom: 'Starter',
    categories: [
      {
        title: 'Website',
        items: [
          'Up to 8–10 pages',
          'Custom UI/UX design',
          'Brand-aligned website design',
          'Dedicated service pages',
          'Gallery / portfolio section',
          'FAQ section',
          'Testimonials section',
          'Contact forms',
          'WhatsApp integration',          
        ],
      },
      {
        title: 'SEO',
        items: [
          'Advanced on-page SEO',
          'Keyword-focused page structure',          
          'Image optimization',
          'SEO-friendly URLs',          
        ],
      },
      {
        title: 'Conversion Features',
        items: [          
          'Enquiry buttons throughout the website',          
        ],
      },
    ],
  },
  {
    name: 'Premium',
    displayName: 'Custom Digital Experience',
    price: '₹75,000',
    tagline: 'For established businesses and brands that need a highly customized website with advanced functionality.',
    highlight: false,
    extraFrom: 'Professional',
    categories: [
      {
        title: 'Advanced Design',
        items: [
          'Up to 15 pages',
          'Customized UI/UX design',
          'Premium visual design',
          'Advanced animations & interactions',
          'Brand-focused visual system',
          'Custom sections and layouts',
          'WhatsApp integration',
          'Social media integration',
          'Google Maps integration',
        ],
      },
      {
        title: 'Advanced Functionality',
        note: 'Selected features based on business requirements:',
        items: [
          'Product / service catalogue',
          'Advanced contact & enquiry forms',
          'Pricing & Packages display',         
        ],
      },
      {
        title: 'SEO & Performance',
        items: [
          'Advanced on-page SEO',          
          'Sitemap & indexing setup',          
          'Meta titles & descriptions',
          'Image optimization',          
        ],
      },
      {
        title: 'Launch & Support',
        items: [
          'Domain & hosting setup for 1 year',
          'SSL certificate setup',
          'Website deployment',
          'Basic training / documentation',
          '30 days post-launch support',
        ],
      },
    ],
  },
]

export const TECH_PACKAGES_FOOTNOTE =
  'Complex functionality, paid third-party services, and additional development are quoted separately where applicable.'

export const TECH_PROCESS_STEPS = [
  {
    icon: FiEye,
    step: '01',
    title: 'Discovery',
    description: 'We understand your business, customers and goals.',
  },
  {
    icon: FiEdit3,
    step: '02',
    title: 'Design',
    description: 'We create a modern design tailored to your brand.',
  },
  {
    icon: FiCode,
    step: '03',
    title: 'Development',
    description: 'We build a responsive, fast and functional website.',
  },
  {
    icon: FiCheckCircle,
    step: '04',
    title: 'Review',
    description: 'You review the website and request changes.',
  },
  {
    icon: FiSend,
    step: '05',
    title: 'Launch',
    description: 'Your website goes live and is ready for customers.',
  },
]

export const TECH_FAQ = [
  {
    question: 'How long does it take to build my website?',
    answer: 'It depends on your requirements and how quickly you can share content like text and images. We\'ll give you a clear timeline during our first conversation, before any work begins.',
  },
  {
    question: 'Do I own my website and domain?',
    answer: 'Yes. Once the project is complete, the domain and website are yours — you\'re not locked into us to keep using them.',
  },
  {
    question: 'Can I request changes during the design process?',
    answer: 'Yes — that\'s exactly what the Review step in our process is for. You review the site and request changes before it goes live.',
  },
  {
    question: 'I don\'t have content or photos ready — can you still help?',
    answer: 'Yes. We can guide you on what\'s needed, or connect you with McreatiK Studios for professional product and team photography.',
  },
  {
    question: 'What happens after my website goes live?',
    answer: 'We offer Website Care & Maintenance plans for ongoing updates, backups, and small changes, so your site keeps working for you after launch.',
  },
  {
    question: 'How much will my website cost?',
    answer: 'Pricing depends on scope — request a quote on WhatsApp and we\'ll give you a clear number before any work begins.',
  },
  {
    question: 'How do I get started?',
    answer: 'Message us on WhatsApp with a bit about your business, and we\'ll set up a free consultation to understand what you need.',
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
  'Website Redesign',
  'Resume Design & Makeover',
  'Landing Page Design',
  'SEO Optimization',
  'Website Care & Maintenance',
  'Domain & Hosting Setup',
  'Google Business Profile',
  'WhatsApp Business Setup',
  'Portfolio Websites',
  'Invoice & Quotation Design',
  'Menu Card Design',
  'Social Media Creatives',
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
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'Twitter', href: '#', icon: 'twitter' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
]

/* =================================================
   MCREATIK — HOME (umbrella-brand homepage)
   ================================================= */

export const HOME_NAV_LINKS = [
  { label: 'Home', href: '#home', type: 'anchor' },
  { label: 'Tech', href: '/tech', type: 'route' },
  { label: 'Studios', href: '/studios', type: 'route' },
  { label: 'Digital Store', type: 'disabled' },
  { label: 'About', href: '#about', type: 'anchor' },
  { label: 'Contact', href: '#contact', type: 'anchor' },
]

export const HOME_EXPLORE_AREAS = [
  {
    key: 'tech',
    icon: FiGlobe,
    kicker: 'Build Your Online Presence',
    name: 'McreatiK Tech',
    tagline: 'Digital solutions for businesses and professionals.',
    longDescription: 'Websites, branding and digital solutions designed to build your online presence and grow your business.',
    bullets: ['Websites', 'Branding', 'Digital services'],
    cta: 'Explore Tech',
    href: '/tech',
    accent: '#5B5FEF',
  },
  {
    key: 'studios',
    icon: FiCamera,
    kicker: 'Capture What Matters',
    name: 'McreatiK Studios',
    tagline: 'Photography, album design and visual experiences.',
    longDescription: 'Photography and creative services that tell your story and create lasting impact.',
    bullets: ['Photography', 'Albums', 'Event coverage'],
    cta: 'Explore Studios',
    href: '/studios',
    accent: '#C9971F',
  },
  {
    key: 'store',
    icon: FiPackage,
    kicker: 'Start With Something Ready',
    name: 'McreatiK Digital Store',
    tagline: 'Digital products and creative resources to help you get moving faster.',
    longDescription: 'Digital products, templates and creative resources to help you create, launch and grow.',
    bullets: ['Templates', 'Digital downloads', 'Creative resources'],
    cta: 'Coming Soon',
    href: null,
    accent: '#8B7FE8',
    comingSoon: true,
  },
]

export const HOME_WHO_WE_HELP = [
  {
    icon: FiBriefcase,
    title: 'Businesses',
    description: 'Build a professional digital presence and grow with confidence.',
  },
  {
    icon: FiUser,
    title: 'Professionals',
    description: 'Present yourself better and unlock new opportunities.',
  },
  {
    icon: FiCamera,
    title: 'Creators',
    description: 'Bring your ideas to life with powerful visual storytelling.',
  },
  {
    icon: FiCalendar,
    title: 'Event & Wedding',
    description: 'Make your special moments beautiful, memorable and shareable.',
  },
  {
    icon: FiShoppingBag,
    title: 'Small & Local Brands',
    description: 'Stand out in your local market with a modern digital identity.',
  },
]

export const HOME_WHAT_WE_CREATE = [
  {
    category: 'Digital',
    icon: FiCode,
    accent: '#5B5FEF',
    items: ['Website Development', 'Website Redesign', 'Landing Pages', 'Digital Solutions'],
  },
  {
    category: 'Brand',
    icon: FiPenTool,
    accent: '#D8AE55',
    items: ['Logo & Identity', 'Business Cards', 'Identity Cards'],
  },
  {
    category: 'Creative',
    icon: FiCamera,
    accent: '#9B7FE8',
    items: ['Photography', 'Portraits', 'Event Coverage', 'Albums & More'],
  },
  {
    category: 'Products',
    icon: FiShoppingBag,
    accent: '#4FBFA0',
    items: ['Templates', 'Digital Downloads', 'Creative Resources'],
    comingSoon: true,
  },
]

export const HOME_WHY_MCREATIK = [
  {
    icon: FiLayers,
    title: 'Digital and creative, under one brand',
    description: 'Your website and your photography can come from the same place, speaking the same language.',
  },
  {
    icon: FiPenTool,
    title: 'Modern, purposeful design',
    description: "Nothing added just to look busy — every choice is there because it earns its place.",
  },
  {
    icon: FiTarget,
    title: 'Built around what you actually need',
    description: 'No generic templates forced onto your business — the work is shaped around your goals.',
  },
  {
    icon: FiGrid,
    title: 'Comfortable across different kinds of work',
    description: 'From a business website to a wedding shoot, the same care and standards apply.',
  },
]

export const HOME_HOW_IT_WORKS = [
  {
    icon: FiMessageSquare,
    step: '01',
    title: 'Tell us what you need',
    description: 'Reach out on WhatsApp with what you have in mind.',
  },
  {
    icon: FiCompass,
    step: '02',
    title: 'We understand and plan',
    description: "We ask the right questions and map out what needs to happen.",
  },
  {
    icon: FiFeather,
    step: '03',
    title: 'We create',
    description: 'Design, development, or a shoot — whatever the work calls for.',
  },
  {
    icon: FiSend,
    step: '04',
    title: 'You launch or use it',
    description: 'Your website goes live, or your photos and files are delivered.',
  },
]
