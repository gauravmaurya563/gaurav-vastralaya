import React from 'react'
import { Filter, ArrowRight } from 'lucide-react'

const CATEGORY_MAP = {
  'All': 'All Products',
  'Saree': 'Fancy Sarees',
  'Suit': 'Designer Suits',
  'Shirting': 'Shirting & Suiting',
  'Ready-made': 'Ready-made'
};

function Catalog({ products, loading, filterCategory, setFilterCategory, onProductClick }) {
  
  const filteredProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <section id="catalog" className="py-20 px-6 bg-[rgba(var(--primary-rgb),0.02)] border-y border-[rgba(var(--secondary-rgb),0.1)] reveal">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Curated Lookbook
            </h2>
            <p className="font-sans text-sm md:text-base font-light max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Browse through our premium selection of designs. Click on any item to view fabric details, available sizes, or to make a direct WhatsApp inquiry.
            </p>
          </div>
          
          {/* Active Filter Title */}
          <div className="flex items-center gap-2 font-sans text-xs tracking-widest font-semibold uppercase text-[var(--secondary-dark)] border-b pb-1" style={{ borderColor: 'var(--secondary)' }}>
            <Filter size={14} />
            <span>FILTER: {CATEGORY_MAP[filterCategory]}</span>
          </div>
        </div>

        {/* Filter Navigation Buttons */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-6 py-2.5 rounded-full font-sans text-xs tracking-wider font-semibold uppercase transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: filterCategory === cat ? 'var(--primary)' : 'transparent',
                color: filterCategory === cat ? 'white' : 'var(--text-dark)',
                border: `1.5px solid ${filterCategory === cat ? 'var(--primary)' : 'rgba(var(--secondary-rgb), 0.3)'}`
              }}
            >
              {cat === 'All' ? 'ALL COLLECTIONS' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[rgba(var(--secondary-rgb),0.2)] rounded-full animate-spin" style={{
              borderTopColor: 'var(--primary)'
            }}></div>
            <p className="font-sans text-sm tracking-wider font-light text-[var(--text-muted)]">Curating the collections...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border" style={{ borderColor: 'rgba(var(--secondary-rgb), 0.15)' }}>
            <p className="font-sans text-md font-light text-[var(--text-muted)] mb-4">No designs found in this category.</p>
            <button 
              onClick={() => setFilterCategory('All')}
              className="btn-secondary"
            >
              View All Collections
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid-responsive">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => onProductClick(product)}
                className="glass group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
                style={{
                  border: '1px solid rgba(var(--secondary-rgb), 0.12)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                {/* Product Image */}
                <div className="relative h-72 w-full overflow-hidden bg-[rgba(var(--primary-rgb),0.02)] flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.style.backgroundColor = 'rgba(var(--primary-rgb), 0.05)';
                    }}
                  />
                  {/* Category overlay */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full font-sans text-[10px] tracking-widest font-semibold uppercase bg-white/95 text-[var(--primary)] shadow-sm">
                    {product.category}
                  </div>
                </div>

                {/* Info body */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="font-sans text-[10px] tracking-widest font-semibold uppercase text-[var(--text-muted)] mb-1">
                    {product.fabric}
                  </span>
                  
                  <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="font-sans text-xs font-light text-[var(--text-muted)] mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <div>
                      <span className="block font-sans text-[9px] tracking-wider text-[var(--text-muted)] uppercase">PRICE RANGE</span>
                      <span className="font-serif text-sm font-semibold text-[var(--primary)]">{product.priceRange}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-sans text-[10px] tracking-widest font-semibold uppercase text-[var(--secondary-dark)] group-hover:text-[var(--primary)] transition-colors">
                      <span>DETAILS</span>
                      <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Catalog
