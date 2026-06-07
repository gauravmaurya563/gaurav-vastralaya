import React from 'react'
import { Filter, ArrowRight } from 'lucide-react'

const CATEGORY_MAP = {
  'All': 'All Products',
  'Saree': 'Sarees',
  'T-Shirt': 'T-Shirts',
  'Shirt': 'Shirts',
  'Suit': 'Suits',
  'Jeans': 'Jeans',
  'Combo': 'Unstitched Combos'
};

function Catalog({ products, loading, filterCategory, setFilterCategory, onProductClick }) {
  
  const filteredProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <section id="catalog" className="py-20 px-6 bg-[rgba(var(--primary-rgb),0.02)] border-y border-[rgba(var(--secondary-rgb),0.1)] reveal">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-[#eae6e1] pb-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal" style={{ color: 'var(--text-dark)' }}>
              Curated Masterpieces
            </h2>
          </div>
          
          {/* Active Filter Title */}
          <div className="flex items-center gap-2 font-sans text-sm font-medium text-gray-500">
            <Filter size={16} />
            <span>{CATEGORY_MAP[filterCategory]}</span>
          </div>
        </div>

        {/* Filter Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-5 py-2 font-sans text-xs tracking-widest font-medium uppercase transition-colors cursor-pointer border-b-2"
              style={{
                borderColor: filterCategory === cat ? 'var(--primary)' : 'transparent',
                color: filterCategory === cat ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {cat === 'All' ? 'All' : cat}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-transparent overflow-hidden cursor-pointer flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-80 w-full overflow-hidden mb-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.style.backgroundColor = '#fbfaf8';
                    }}
                  />
                </div>

                {/* Info body */}
                <div className="flex flex-col flex-grow text-center px-2">
                  <h3 className="font-serif text-lg font-normal text-[var(--text-dark)] group-hover:text-[var(--primary)] transition-colors mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="font-sans text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
                    {product.fabric}
                  </p>

                  <div className="mt-auto mb-4">
                    <span className="font-serif text-base font-medium text-[var(--text-dark)]">{product.priceRange.split(' ')[0]}</span>
                  </div>

                  <button className="w-full bg-transparent border border-[var(--text-dark)] text-[var(--text-dark)] py-2.5 font-sans text-xs tracking-widest uppercase font-medium hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300">
                    View Details
                  </button>
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
