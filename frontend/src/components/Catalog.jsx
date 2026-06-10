import React from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = ['All', 'Fabrics', 'Sarees', 'Suits', 'Kurtas', 'Mens', 'Combos']
const FILTERS = ['Price', 'Fabric', 'Color', 'Occasion', 'Availability']

function Catalog({ products, activeCategory, onCategoryChange, onProductClick }) {
  const getFullImageUrl = (url) => {
    if (!url) return 'https://loremflickr.com/400/600/fashion'
    if (url.startsWith('http') || url.startsWith('data:')) return url
    return `http://localhost:5121${url}`
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
          <button>
            Featured <ChevronDown size={15} />
          </button>
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
          <div className="product-count">{products.length} products found</div>
          <div className="product-grid">
            {products.map((product) => (
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
