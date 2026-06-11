import React, { useRef, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'

function getFullImageUrl(url) {
  if (!url) return 'https://loremflickr.com/400/600/fashion'
  if (url.startsWith('http') || url.startsWith('data:')) return url
  if (url.startsWith('/assets/')) return url
  const ASSET_BASE = API_BASE.replace(/\/api$/, '')
  return `${ASSET_BASE}${url}`
}

function NewArrivals({ products, onProductClick, onViewAll }) {
  const scrollRef = useRef(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  // Get the 8 newest products (sorted by createdAt descending)
  const newArrivals = React.useMemo(() => {
    if (!products || products.length === 0) return []
    return [...products]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.CreatedAt || 0)
        const dateB = new Date(b.createdAt || b.CreatedAt || 0)
        return dateB - dateA
      })
      .slice(0, 8)
  }, [products])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (newArrivals.length === 0) return null

  return (
    <section className="new-arrivals-section" aria-label="New Arrivals">
      {/* Decorative top band */}
      <div className="new-arrivals-band" aria-hidden="true">
        <span>NEW COLLECTION</span>
        <span>·</span>
        <span>JUST ARRIVED</span>
        <span>·</span>
        <span>FRESH DESIGNS</span>
        <span>·</span>
        <span>NEW COLLECTION</span>
        <span>·</span>
        <span>JUST ARRIVED</span>
        <span>·</span>
        <span>FRESH DESIGNS</span>
        <span>·</span>
        <span>NEW COLLECTION</span>
        <span>·</span>
        <span>JUST ARRIVED</span>
        <span>·</span>
        <span>FRESH DESIGNS</span>
      </div>

      <div className="new-arrivals-inner">
        <div className="new-arrivals-header">
          <div className="new-arrivals-title-block">
            <span className="new-arrivals-eyebrow">
              <Sparkles size={13} />
              Freshly added
            </span>
            <h2 className="new-arrivals-heading">New Arrivals</h2>
            <p className="new-arrivals-sub">
              Hand-picked pieces added this season — be the first to explore.
            </p>
          </div>

          <div className="new-arrivals-controls">
            <button
              className="na-arrow-btn"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              className="na-arrow-btn"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              →
            </button>
            <button className="na-view-all-btn" onClick={onViewAll}>
              View all <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll rail */}
        <div className="na-scroll-rail" ref={scrollRef}>
          {newArrivals.map((product, idx) => {
            const imgUrl = getFullImageUrl(product.imageUrl || product.ImageUrl)
            const name = product.name || product.Name || 'Product'
            const category = product.category || product.Category || ''
            const price = product.priceRange || product.PriceRange || ''
            const isFirst = idx === 0

            return (
              <article
                key={product.id || product.Id || idx}
                className={`na-card ${isFirst ? 'na-card--hero' : ''}`}
                onClick={() => onProductClick(product)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                aria-label={`New arrival: ${name}`}
              >
                <div className="na-card-media">
                  {/* NEW badge */}
                  <div className="na-badge">
                    <Sparkles size={10} />
                    New
                  </div>

                  <img src={imgUrl} alt={name} loading="lazy" />

                  {/* Hover overlay */}
                  <div className={`na-card-overlay ${hoveredIdx === idx ? 'visible' : ''}`}>
                    <button className="na-quick-view-btn">Quick View</button>
                  </div>
                </div>

                <div className="na-card-info">
                  <span className="na-card-category">{category}</span>
                  <h3 className="na-card-name">{name}</h3>
                  <strong className="na-card-price">{price}</strong>
                </div>
              </article>
            )
          })}
        </div>

        {/* Dots indicator */}
        <div className="na-dots" aria-hidden="true">
          {newArrivals.map((_, i) => (
            <span key={i} className="na-dot" />
          ))}
        </div>
      </div>

      {/* Bottom decorative divider */}
      <div className="new-arrivals-divider" aria-hidden="true" />
    </section>
  )
}

export default NewArrivals
