import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Catalog from './components/Catalog'
import BookingForm from './components/BookingForm'
import About from './components/About'
import Footer from './components/Footer'
import ProductModal from './components/ProductModal'
import { Analytics } from '@vercel/analytics/react'

// Fallback catalog data in case the backend is not running
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Royal Banarasi Silk Saree",
    description: "A magnificent crimson red Banarasi silk saree woven with genuine gold-plated zari threads. Featuring a classic paisley border and a rich pallu, perfect for bridal wear and grand celebrations.",
    category: "Saree",
    imageUrl: "/assets/saree_premium.png",
    priceRange: "₹8,500 - ₹25,000",
    fabric: "Pure Banarasi Silk",
    occasion: "Bridal / Wedding",
    sizes: ["Unstitched (Free Size)"]
  },
  {
    id: 4,
    name: "Embellished Georgette Anarkali Suit",
    description: "Stunning floor-length Anarkali suit set in deep emerald green, adorned with intricate Zardozi hand-embroidery. Accompanied by a heavy net dupatta and comfortable pants.",
    category: "Suit",
    imageUrl: "/assets/suit_designer.png",
    priceRange: "₹4,800 - ₹12,500",
    fabric: "Faux Georgette & Shantoon",
    occasion: "Festive / Evening Wear",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "Premium Giza Cotton Shirting",
    description: "Ultra-premium Giza cotton fabric from the finest mills. Offers unmatched breathability, a silky smooth texture, and long-lasting lustre for custom executive shirts.",
    category: "Shirting",
    imageUrl: "/assets/shirting_fabric.png",
    priceRange: "₹800 - ₹2,500 per meter",
    fabric: "100% Giza Cotton",
    occasion: "Formal / Custom Tailoring",
    sizes: ["Cut Length (1.6m)", "Cut Length (2.0m)", "Custom Length"]
  },
  {
    id: 9,
    name: "Georgette Chikankari Kurta Set",
    description: "Handcrafted Lucknowi Chikankari long kurta in pastel blue, featuring exquisite shadow work and border details, paired with white cotton trousers.",
    category: "Ready-made",
    imageUrl: "/assets/readymade_kurta.png",
    priceRange: "₹1,800 - ₹4,500",
    fabric: "Georgette with Cotton Lining",
    occasion: "Festive / Semi-Formal",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Backend API URL - reads from .env.local (dev) or .env.production (Vercel)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api';

  useEffect(() => {
    // Fetch products from ASP.NET Core backend
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch from backend');
        }
        const data = await response.json();
        setProducts(data);
        setBackendOffline(false);
      } catch (error) {
        console.warn('Backend server offline. Loading local showcase data...', error);
        setProducts(FALLBACK_PRODUCTS);
        setBackendOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Theme Management
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Scroll Reveal Animation Hook
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load to show initial elements
    setTimeout(revealOnScroll, 200);

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [products]);

  return (
    <div className="royal-bg min-h-screen">
      {backendOffline && (
        <div style={{
          backgroundColor: 'var(--secondary)',
          color: 'var(--text-dark)',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✨ DEMO MODE — Connecting to local showcase data (Backend offline at port 5000)</span>
        </div>
      )}

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main>
        <Hero />
        
        <Categories onSelectCategory={(cat) => {
          setFilterCategory(cat);
          const catalogSection = document.getElementById('catalog');
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
          }
        }} />
        
        <Catalog 
          products={products} 
          loading={loading}
          filterCategory={filterCategory} 
          setFilterCategory={setFilterCategory} 
          onProductClick={(product) => setSelectedProduct(product)} 
        />
        
        <BookingForm apiUrl={API_BASE_URL} />
        
        <About />
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      <Analytics />
    </div>
  )
}

export default App
