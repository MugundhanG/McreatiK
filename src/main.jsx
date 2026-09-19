import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Wraps the whole app, not just /store, so signed-in state survives
          navigation across a flat route table (no nested layout routes to
          scope it to just the Store department without remounting on every
          navigation and losing the in-memory access token). CartProvider
          nests inside AuthProvider because it reads `customer` from
          useAuth() to know whose cart (if any) to fetch. */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
