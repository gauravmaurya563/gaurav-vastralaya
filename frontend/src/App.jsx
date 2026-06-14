import React, { useMemo, useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import Hero from './components/Hero'
import NewArrivals from './components/NewArrivals'
import Categories from './components/Categories'
import Catalog from './components/Catalog'
import BookingForm from './components/BookingForm'
import About from './components/About'
import Footer from './components/Footer'
import ProductModal from './components/ProductModal'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import SocialTrending from './components/SocialTrending'

const STATIC_PRODUCTS = [
  {
    id: 1,
    name: 'Ajrakh Printed Cotton Fabric',
    description: 'Soft breathable cotton with hand-block inspired Ajrakh motifs. Ideal for kurtas, co-ords, shirts, and relaxed everyday tailoring.',
    category: 'Fabrics',
    imageUrl: '/assets/shirting_fabric.png',
    priceRange: 'Rs. 349 - Rs. 899 / meter',
    fabric: 'Premium Cotton',
    occasion: 'Daily and festive wear',
    sizes: ['1 meter', '2.5 meters', 'Custom cut']
  },
  {
    id: 2,
    name: 'Banarasi Silk Saree',
    description: 'A graceful occasion saree with rich woven texture, elegant border detailing, and a pallu made for weddings and festive evenings.',
    category: 'Sarees',
    imageUrl: '/assets/saree_premium.png',
    priceRange: 'Rs. 4,999 - Rs. 18,999',
    fabric: 'Banarasi Silk',
    occasion: 'Wedding and celebration',
    sizes: ['Free size', 'Blouse piece included']
  },
  {
    id: 3,
    name: 'Premium Suit Fabric',
    description: 'High-quality unstitched suit material with fine texture. Get it stitched in your preferred style — perfect for formal and festive occasions.',
    category: 'Suit Material',
    imageUrl: '/assets/suit_designer.png',
    priceRange: 'Rs. 1,299 - Rs. 4,999 / meter',
    fabric: 'Georgette / Wool Blend',
    occasion: 'Formal and festive wear',
    sizes: ['1.5 meter cut', '2.25 meter suit piece', 'Custom cut']
  },
  {
    id: 4,
    name: 'Chikankari Kurta Set',
    description: 'A light, elegant kurta set with fine embroidery and clean finishing for work, gatherings, and easy celebration looks.',
    category: 'Kurtas',
    imageUrl: '/assets/readymade_kurta.png',
    priceRange: 'Rs. 1,499 - Rs. 4,499',
    fabric: 'Georgette with lining',
    occasion: 'Semi-formal and casual',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    name: 'Printed Shirt Fabric',
    description: 'Crisp shirt fabric with contemporary print placement, made for custom shirts, short kurtas, and summer separates.',
    category: 'Mens',
    imageUrl: '/assets/cat_shirt.png',
    priceRange: 'Rs. 599 - Rs. 1,899 / cut',
    fabric: 'Giza Cotton Blend',
    occasion: 'Office and smart casual',
    sizes: ['1.6 meter cut', '2 meter cut', 'Custom cut']
  },
  {
    id: 6,
    name: 'Festive Dupatta Combo',
    description: 'A coordinated fabric and dupatta pairing for quick custom outfits with balanced color, motif, and border combinations.',
    category: 'Combos',
    imageUrl: '/assets/cat_combo.png',
    priceRange: 'Rs. 1,299 - Rs. 3,999',
    fabric: 'Cotton silk blend',
    occasion: 'Festive gifting',
    sizes: ['Unstitched set']
  }
]

function App() {
  const [products, setProducts] = useState([])
  const [filterCategory, setFilterCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Simple state-based routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [adminUser, setAdminUser] = useState(localStorage.getItem('adminUser') || null)

  const [settings, setSettings] = useState({
    WhatsAppNumber: import.meta.env.VITE_CONTACT_WHATSAPP || '919999999999',
    InquiryTemplate: 'Hi Gaurav Vastralay, I am interested in this clothing item:\n\n*Product:* {ProductName}\n*Category:* {Category}\n*Fabric:* {Fabric}\n*Price Range:* {Price}\n*Selected Size/Length:* {Size}\n\nIs this available for ordering?',
    RestockTemplate: 'Hi Gaurav Vastralay, I am interested in this design: *{ProductName}* which is currently out of stock. Could you let me know if/when this will be restocked or if I can pre-order it?',
    InstagramUrl: 'https://instagram.com/gaurav_vastralay',
    FacebookUrl: 'https://facebook.com/gaurav_vastralay'
  })

  useEffect(() => {
    fetchProducts()
    fetchSettings()

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const fetchSettings = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
      const response = await fetch(`${API_BASE}/Settings`)
      if (!response.ok) {
        throw new Error('Backend request failed')
      }
      const data = await response.json()
      setSettings(prev => ({
        ...prev,
        ...data
      }))
    } catch (err) {
      console.warn('Using default/env settings because backend is offline or unconfigured:', err.message)
    }
  }

  // Handle auto-opening product detail modal from query parameters
  useEffect(() => {
    if (products.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const queryId = params.get('product')
      if (queryId) {
        const product = products.find(p => String(p.id || p.Id) === String(queryId))
        if (product) {
          setSelectedProduct(product)
        }
      }
    }
  }, [products])

  // Sync URL query parameter when product modal is opened / closed
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedProduct) {
      url.searchParams.set('product', selectedProduct.id || selectedProduct.Id)
    } else {
      url.searchParams.delete('product')
    }
    window.history.replaceState({}, '', url.pathname + url.search)
  }, [selectedProduct])

  const fetchProducts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
      const response = await fetch(`${API_BASE}/Products`)
      if (!response.ok) {
        throw new Error('Backend request failed')
      }
      const data = await response.json()
      // Sort products by CreatedAt descending so new arrivals are at the top
      const sorted = data.sort((a, b) => new Date(b.createdAt || b.CreatedAt) - new Date(a.createdAt || a.CreatedAt))
      setProducts(sorted)
    } catch (err) {
      console.warn('Using local static products fallback because backend is offline:', err.message)
      setProducts(STATIC_PRODUCTS)
    }
  }

  const handleLoginSuccess = (user) => {
    setAdminUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdminUser(null)
  }

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const filteredProducts = useMemo(() => {
    if (filterCategory === 'All') return products
    return products.filter((product) => {
      const cat = (product.category || product.Category || '').toLowerCase()
      const filter = filterCategory.toLowerCase()
      // 'Suit Material' on the UI maps to 'suit' or 'suits' stored in DB
      if (filter === 'suit material') return cat === 'suit' || cat === 'suits' || cat === 'suit material'
      return cat === filter || cat === filter.replace(/s$/, '') // handle plural/singular
    })
  }, [products, filterCategory])

  const handleSelectCategory = (category) => {
    setFilterCategory(category)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Admin View Rendering
  if (currentPath === '/admin') {
    return (
      <div className="site-shell">
        <div className="promo-strip" style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 24px' }}>
          <span>Administrator Portal</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); fetchProducts(); }} style={{ color: '#fff', textDecoration: 'underline', fontWeight: 'bold' }}>
            Go to Online Store
          </a>
        </div>
        {adminUser ? (
          <AdminDashboard username={adminUser} onLogout={handleLogout} settings={settings} onSettingsUpdate={fetchSettings} />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    )
  }

  return (
    <div className="site-shell">
      <Header settings={settings} />
      <main>
        <Hero />
        <NewArrivals
          products={products}
          onProductClick={setSelectedProduct}
          onViewAll={() => {
            setFilterCategory('All')
            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <Categories products={products} onSelectCategory={handleSelectCategory} />
        <Catalog
          products={filteredProducts}
          activeCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          onProductClick={setSelectedProduct}
          settings={settings}
        />
        <SocialTrending settings={settings} />
        <BookingForm />
        <About />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} settings={settings} />
      )}
      <Analytics />
    </div>
  )
}

export default App
