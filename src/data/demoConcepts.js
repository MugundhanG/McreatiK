// Data for the Tech "Website Concepts" showcase (/tech/demos).
// Each entry mirrors one hosted demo under mcreatik/public/demos/<slug>/.
// Source of truth for name/tagline/fonts/palette is each demo's own
// src/config/business.js and src/index.css (D:/Websites/demos/<slug>/).

import dentalSmileStudioDesktop from '../assets/demo-shots/dental-smile-studio-desktop.webp';
import dentalSmileStudioMobile from '../assets/demo-shots/dental-smile-studio-mobile.webp';
import dentalDentiqueDesktop from '../assets/demo-shots/dental-dentique-desktop.webp';
import dentalDentiqueMobile from '../assets/demo-shots/dental-dentique-mobile.webp';
import dentalPearlCareDesktop from '../assets/demo-shots/dental-pearl-care-desktop.webp';
import dentalPearlCareMobile from '../assets/demo-shots/dental-pearl-care-mobile.webp';

import skinLumiereDesktop from '../assets/demo-shots/skin-lumiere-desktop.webp';
import skinLumiereMobile from '../assets/demo-shots/skin-lumiere-mobile.webp';
import skinDermalabDesktop from '../assets/demo-shots/skin-dermalab-desktop.webp';
import skinDermalabMobile from '../assets/demo-shots/skin-dermalab-mobile.webp';
import skinAarogyaDesktop from '../assets/demo-shots/skin-aarogya-desktop.webp';
import skinAarogyaMobile from '../assets/demo-shots/skin-aarogya-mobile.webp';

import interiorAalayaDesktop from '../assets/demo-shots/interior-aalaya-desktop.webp';
import interiorAalayaMobile from '../assets/demo-shots/interior-aalaya-mobile.webp';
import interiorModuloDesktop from '../assets/demo-shots/interior-modulo-desktop.webp';
import interiorModuloMobile from '../assets/demo-shots/interior-modulo-mobile.webp';
import interiorArcformDesktop from '../assets/demo-shots/interior-arcform-desktop.webp';
import interiorArcformMobile from '../assets/demo-shots/interior-arcform-mobile.webp';

import eduVertexDesktop from '../assets/demo-shots/edu-vertex-desktop.webp';
import eduVertexMobile from '../assets/demo-shots/edu-vertex-mobile.webp';
import eduBrightpathDesktop from '../assets/demo-shots/edu-brightpath-desktop.webp';
import eduBrightpathMobile from '../assets/demo-shots/edu-brightpath-mobile.webp';
import eduMilestoneDesktop from '../assets/demo-shots/edu-milestone-desktop.webp';
import eduMilestoneMobile from '../assets/demo-shots/edu-milestone-mobile.webp';

import photoKadhaiDesktop from '../assets/demo-shots/photo-kadhai-desktop.webp';
import photoKadhaiMobile from '../assets/demo-shots/photo-kadhai-mobile.webp';
import photoLittlepebbleDesktop from '../assets/demo-shots/photo-littlepebble-desktop.webp';
import photoLittlepebbleMobile from '../assets/demo-shots/photo-littlepebble-mobile.webp';
import photoObjektDesktop from '../assets/demo-shots/photo-objekt-desktop.webp';
import photoObjektMobile from '../assets/demo-shots/photo-objekt-mobile.webp';

export const DEMO_INDUSTRIES = [
  { id: 'dental', label: 'Dental', description: 'Clinic sites built to book appointments — doctor bios, treatment plans and patient trust, front and centre.' },
  { id: 'skin', label: 'Skin & Hair', description: 'Cosmetic and dermatology sites that sell results — before/after proof, concern-led booking flows.' },
  { id: 'interior', label: 'Interior Design', description: 'Studio and modular-furniture sites that sell taste — portfolios, process and finish galleries.' },
  { id: 'coaching', label: 'Coaching & Tuition', description: 'Academy sites built around results and trust — batches, faculty, results walls and parent-facing proof.' },
  { id: 'photography', label: 'Photography', description: 'Studio sites that sell a feeling — galleries, films and real client stories that book the date.' },
];

export const DEMO_CONCEPTS = [
  {
    slug: 'dental-smile-studio',
    name: 'Smile Studio',
    industry: 'dental',
    tagline: 'Family & Kids Dentistry',
    features: ['Meet the doctors', 'Transparent treatment plans', 'Free virtual smile check'],
    palette: ['#2F5BFF', '#FF6B5A', '#FFC940'],
    fonts: ['Sora', 'Plus Jakarta Sans'],
    url: '/demos/dental-smile-studio/',
    desktopShot: dentalSmileStudioDesktop,
    mobileShot: dentalSmileStudioMobile,
  },
  {
    slug: 'dental-dentique',
    name: 'Dentique',
    industry: 'dental',
    tagline: 'Implant & Aesthetic Centre',
    features: ['Smile makeover gallery', 'Surgeon-led implants', 'Modern imaging technology'],
    palette: ['#0E0D0C', '#CDB38A', '#F3EEE6'],
    fonts: ['Fraunces', 'Inter'],
    url: '/demos/dental-dentique/',
    desktopShot: dentalDentiqueDesktop,
    mobileShot: dentalDentiqueMobile,
  },
  {
    slug: 'dental-pearl-care',
    name: 'Pearl Dental Care',
    industry: 'dental',
    tagline: 'Multispeciality Dental Clinic',
    features: ['Interactive tooth chart', 'Meet the full team', 'Real patient reviews'],
    palette: ['#0B2545', '#22B08C', '#E5484D'],
    fonts: ['DM Sans', 'DM Sans'],
    url: '/demos/dental-pearl-care/',
    desktopShot: dentalPearlCareDesktop,
    mobileShot: dentalPearlCareMobile,
  },
  {
    slug: 'skin-lumiere',
    name: 'Lumière',
    industry: 'skin',
    tagline: 'Skin & Laser Clinic',
    features: ['Before/after results', 'First-visit guide', 'Concern-based booking'],
    palette: ['#5E2B4A', '#E4A9AE', '#FBF5F3'],
    fonts: ['DM Serif Display', 'Outfit'],
    url: '/demos/skin-lumiere/',
    desktopShot: skinLumiereDesktop,
    mobileShot: skinLumiereMobile,
  },
  {
    slug: 'skin-dermalab',
    name: 'DermaLab',
    industry: 'skin',
    tagline: 'Dermatology & Skin Clinic',
    features: ['Skin analysis tool', 'Clear treatment approach', 'Doctor-led concerns guide'],
    palette: ['#2B3A42', '#8BA597', '#F6F7F5'],
    fonts: ['Newsreader', 'Figtree'],
    url: '/demos/skin-dermalab/',
    desktopShot: skinDermalabDesktop,
    mobileShot: skinDermalabMobile,
  },
  {
    slug: 'skin-aarogya',
    name: 'Aarogya',
    industry: 'skin',
    tagline: 'Skin & Hair Clinic',
    features: ['Bilingual Tamil/English', 'Bridal packages', 'Hair loss programs'],
    palette: ['#24382D', '#C4623A', '#E3A92B'],
    fonts: ['Young Serif', 'Nunito'],
    url: '/demos/skin-aarogya/',
    desktopShot: skinAarogyaDesktop,
    mobileShot: skinAarogyaMobile,
  },
  {
    slug: 'interior-aalaya',
    name: 'Aalaya',
    industry: 'interior',
    tagline: 'Luxury Residential Interiors',
    features: ['Style quiz for leads', 'Curated project gallery', 'Studio & process story'],
    palette: ['#6E1F24', '#B08D57', '#F7F6F3'],
    fonts: ['Bodoni Moda', 'Karla'],
    url: '/demos/interior-aalaya/',
    desktopShot: interiorAalayaDesktop,
    mobileShot: interiorAalayaMobile,
  },
  {
    slug: 'interior-modulo',
    name: 'Modulo',
    industry: 'interior',
    tagline: 'Modular Kitchens & Wardrobes',
    features: ['Kitchen planner tool', 'Factory & finish options', 'Book a showroom visit'],
    palette: ['#1B1D1F', '#F5B400', '#EEF0F2'],
    fonts: ['Archivo', 'Public Sans'],
    url: '/demos/interior-modulo/',
    desktopShot: interiorModuloDesktop,
    mobileShot: interiorModuloMobile,
  },
  {
    slug: 'interior-arcform',
    name: 'Arcform',
    industry: 'interior',
    tagline: 'Architecture · Interiors · Landscape',
    features: ['Full studio portfolio', 'Transparent process', 'Client voices'],
    palette: ['#1E1F22', '#1D3FA8', '#F3F1EC'],
    fonts: ['Syne', 'IBM Plex Sans'],
    url: '/demos/interior-arcform/',
    desktopShot: interiorArcformDesktop,
    mobileShot: interiorArcformMobile,
  },
  {
    slug: 'edu-vertex',
    name: 'Vertex',
    industry: 'coaching',
    tagline: 'NEET · JEE Main · JEE Advanced coaching',
    features: ['Batch finder tool', 'Result highlights', 'Faculty profiles'],
    palette: ['#0A0E1C', '#FF5A1F', '#F2F0EB'],
    fonts: ['Bricolage Grotesque', 'Inter Tight'],
    url: '/demos/edu-vertex/',
    desktopShot: eduVertexDesktop,
    mobileShot: eduVertexMobile,
  },
  {
    slug: 'edu-brightpath',
    name: 'BrightPath',
    industry: 'coaching',
    tagline: 'Class 6 – 12 · CBSE & State Board · English & Tamil medium',
    features: ['Class timetable view', 'Meet the teachers', 'Parent testimonials'],
    palette: ['#1F2A44', '#FFB400', '#2FA56A'],
    fonts: ['Baloo Thambi 2', 'Lexend'],
    url: '/demos/edu-brightpath/',
    desktopShot: eduBrightpathDesktop,
    mobileShot: eduBrightpathMobile,
  },
  {
    slug: 'edu-milestone',
    name: 'Milestone',
    industry: 'coaching',
    tagline: 'TNPSC · Bank · SSC · Railways',
    features: ['Exam calendar & planner', 'Student selections wall', 'Daily quiz practice'],
    palette: ['#0F4D3A', '#C4302B', '#F4EFE3'],
    fonts: ['Playfair Display', 'Source Serif 4'],
    url: '/demos/edu-milestone/',
    desktopShot: eduMilestoneDesktop,
    mobileShot: eduMilestoneMobile,
  },
  {
    slug: 'photo-kadhai',
    name: 'Kadhai',
    industry: 'photography',
    tagline: 'Candid wedding photography & cinematic films',
    features: ['Wedding film reels', 'Date availability check', 'Real couple stories'],
    palette: ['#0E1A1C', '#F2A541', '#B8322A'],
    fonts: ['Instrument Serif', 'Instrument Sans'],
    url: '/demos/photo-kadhai/',
    desktopShot: photoKadhaiDesktop,
    mobileShot: photoKadhaiMobile,
  },
  {
    slug: 'photo-littlepebble',
    name: 'Little Pebble',
    industry: 'photography',
    tagline: 'Maternity · Newborn · First-year photography',
    features: ['Session planner', 'Safety-first approach', 'Parent testimonials'],
    palette: ['#3D3346', '#D9738A', '#F6E9BD'],
    fonts: ['Gilda Display', 'Mulish'],
    url: '/demos/photo-littlepebble/',
    desktopShot: photoLittlepebbleDesktop,
    mobileShot: photoLittlepebbleMobile,
  },
  {
    slug: 'photo-objekt',
    name: 'Objekt',
    industry: 'photography',
    tagline: 'Product · Jewellery · Food · Beauty · Fashion',
    features: ['Before/after comparisons', 'Instant quote estimator', 'Full commercial portfolio'],
    palette: ['#1A1A1A', '#2563EB', '#F5F5F3'],
    fonts: ['Hanken Grotesk', 'Hanken Grotesk'],
    url: '/demos/photo-objekt/',
    desktopShot: photoObjektDesktop,
    mobileShot: photoObjektMobile,
  },
];
