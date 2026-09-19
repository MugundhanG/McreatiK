/* ============================================
   App Component — Route Table
   McreatiK is three departments under one domain:
     /         Landing — pick a department
     /tech     McreatiK Tech & Creative Solutions
     /studios  McreatiK Studios (photography)
     /store    McreatiK Digital Store — category picker + product grid
               (Task 12). /store/products/:productId — conditional product
               page (customization form + preview, or straight to
               marketing + Add to Cart, depending on the product's
               category). /store/signup, /login, /forgot-password,
               /reset-password — customer auth pages (Task 10); browsing
               itself stays public, add-to-cart is what's auth-gated.
               /store/cart (Task 13) — line items, remove, running total,
               proceed-to-checkout. /store/orders/:orderId (Task 14) —
               post-payment page, polls /verify and shows per-item
               status so each download appears as that item finishes.
   Each department page is lazy-loaded so a visitor
   only ever downloads the one they chose.
   ============================================ */

import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import WhatsAppButton from './components/ui/WhatsAppButton'
import DepartmentTransitionOverlay from './components/ui/DepartmentTransitionOverlay'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import { syncPathname } from './utils/navigationHistory'

const Landing = lazy(() => import('./pages/Landing'))
const TechPage = lazy(() => import('./pages/TechPage'))
const TechServicesPage = lazy(() => import('./pages/TechServicesPage'))
const TechIndustriesPage = lazy(() => import('./pages/TechIndustriesPage'))
const TechWorkPage = lazy(() => import('./pages/TechWorkPage'))
const TechFAQPage = lazy(() => import('./pages/TechFAQPage'))
const TechBlogPage = lazy(() => import('./pages/TechBlogPage'))
const TechBlogPostPage = lazy(() => import('./pages/TechBlogPostPage'))
const StudiosPage = lazy(() => import('./pages/StudiosPage'))
const StudiosGalleryPage = lazy(() => import('./pages/StudiosGalleryPage'))
const StudiosAlbumsPage = lazy(() => import('./pages/StudiosAlbumsPage'))
const StudiosExperiencePage = lazy(() => import('./pages/StudiosExperiencePage'))
const StudiosBlogPage = lazy(() => import('./pages/StudiosBlogPage'))
const StudiosBlogPostPage = lazy(() => import('./pages/StudiosBlogPostPage'))
const StoreCatalogPage = lazy(() => import('./pages/StoreCatalogPage'))
const StoreProductPage = lazy(() => import('./pages/StoreProductPage'))
const StoreCartPage = lazy(() => import('./pages/StoreCartPage'))
const StoreSignupPage = lazy(() => import('./pages/StoreSignupPage'))
const StoreLoginPage = lazy(() => import('./pages/StoreLoginPage'))
const StoreForgotPasswordPage = lazy(() => import('./pages/StoreForgotPasswordPage'))
const StoreResetPasswordPage = lazy(() => import('./pages/StoreResetPasswordPage'))
const StoreOrderPage = lazy(() => import('./pages/StoreOrderPage'))
const StoreRefundPolicyPage = lazy(() => import('./pages/StoreRefundPolicyPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* Full-screen loading placeholder shown while a page chunk loads */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0b10]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  useScrollRestoration()

  /* Must run synchronously during render (not in an effect) so the
     value is already correct before the newly-routed page's own
     components render in this same pass — see navigationHistory.js. */
  const { pathname } = useLocation()
  syncPathname(pathname)

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tech" element={<TechPage />} />
          <Route path="/tech/services" element={<TechServicesPage />} />
          <Route path="/tech/industries" element={<TechIndustriesPage />} />
          <Route path="/tech/work" element={<TechWorkPage />} />
          <Route path="/tech/faq" element={<TechFAQPage />} />
          <Route path="/tech/blog" element={<TechBlogPage />} />
          <Route path="/tech/blog/:slug" element={<TechBlogPostPage />} />
          <Route path="/studios" element={<StudiosPage />} />
          <Route path="/studios/gallery" element={<StudiosGalleryPage />} />
          <Route path="/studios/albums" element={<StudiosAlbumsPage />} />
          <Route path="/studios/experience" element={<StudiosExperiencePage />} />
          <Route path="/studios/blog" element={<StudiosBlogPage />} />
          <Route path="/studios/blog/:slug" element={<StudiosBlogPostPage />} />
          <Route path="/store" element={<StoreCatalogPage />} />
          <Route path="/store/products/:productId" element={<StoreProductPage />} />
          <Route path="/store/cart" element={<StoreCartPage />} />
          <Route path="/store/signup" element={<StoreSignupPage />} />
          <Route path="/store/login" element={<StoreLoginPage />} />
          <Route path="/store/forgot-password" element={<StoreForgotPasswordPage />} />
          <Route path="/store/reset-password" element={<StoreResetPasswordPage />} />
          <Route path="/store/orders/:orderId" element={<StoreOrderPage />} />
          <Route path="/store/refund-policy" element={<StoreRefundPolicyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <WhatsAppButton />
      <DepartmentTransitionOverlay />
    </>
  )
}

export default App
