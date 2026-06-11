import React from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = ['All', 'Fabrics', 'Sarees', 'Suits', 'Kurtas', 'Mens', 'Combos']
const FILTERS = ['Price', 'Fabric', 'Color', 'Occasion', 'Availability']

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'random', label: 'Random Order' }
]

function Catalog({ products, activeCategory, onCategoryChange, onProductClick }) {
  const [sortBy, setSortBy] = React.useState('featured')

  const shuffledProducts = React.useMemo(() => {
    if (sortBy !== 'random') return null
    const arr = [...products]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [products, sortBy])

  const sortedProducts = React.useMemo(() => {
    if (sortBy === 'random') return shuffledProducts || products
    
    const arr = [...products]
    
    const getMinPrice = (priceStr) => {
      if (!priceStr) return 0
      const match = priceStr.replace(/,/g, '').match(/\d+/)
      return match ? parseInt(match[0]) : 0
    }

    if (sortBy === 'newest') {
      return arr.sort((a, b) => new Date(b.createdAt || b.CreatedAt) - new Date(a.createdAt || a.CreatedAt))
    }
    if (sortBy === 'price_asc') {
      return arr.sort((a, b) => getMinPrice(a.priceRange || a.PriceRange) - getMinPrice(b.priceRange || b.PriceRange))
    }
    if (sortBy === 'price_desc') {
      return arr.sort((a, b) => getMinPrice(b.priceRange || b.PriceRange) - getMinPrice(a.priceRange || a.PriceRange))
    }
    return products
  }, [products, sortBy, shuffledProducts])

  const getFullImageUrl = (url) => {
    if (!url) return 'https://loremflickr.com/400/600/fashion'
    if (url.startsWith('http') || url.startsWith('data:')) return url
    if (url.startsWith('/assets/')) return url
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
    const ASSET_BASE = API_BASE.replace(/\/api$/, '')
    return `${ASSET_BASE}${url}`
  }

  return (
    <section id="catalog" className="catalog-section">
      <div className="catalog-top">
        <div className="section-heading">
          <span>New season edit</span>
          <h2>{activeCategory === 'All' ? 'All products' : activeCategory}</h2>
        </div>
        <div className="sort-control">
          <span>Sort by</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              background: '#fff',
              color: 'var(--brand-dark)',
              fontWeight: 'bold',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="filters">
          <div className="filters-title">
            <SlidersHorizontal size={17} />
            <strong>Filter by</strong>
          </div>
          <div className="category-filter">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {FILTERS.map((filter) => (
            <button className="filter-row" key={filter}>
              {filter}
              <ChevronDown size={15} />
            </button>
          ))}
        </aside>

        <div className="product-area">
          <div className="product-count">{sortedProducts.length} products found</div>
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <article className="product-card" key={product.id} onClick={() => onProductClick(product)}>
                <div className="product-media">
                  <span className="sale-tag">New</span>
                  <img src={getFullImageUrl(product.imageUrl)} alt={product.name} />
                </div>
                <div className="product-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <strong>{product.priceRange}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Catalog
