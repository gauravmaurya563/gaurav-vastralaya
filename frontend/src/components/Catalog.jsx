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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
              Top Deals on Traditional Wear
            </h2>
          </div>
          
          {/* Active Filter Title */}
          <div className="flex items-center gap-2 font-sans text-sm font-medium text-gray-500">
            <Filter size={16} />
            <span>{CATEGORY_MAP[filterCategory]}</span>
          </div>
        </div>

        {/* Filter Navigation Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-sm shadow-sm border border-gray-200">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-4 py-2 rounded-sm font-sans text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: filterCategory === cat ? 'var(--primary)' : 'transparent',
                color: filterCategory === cat ? 'white' : 'var(--text-dark)'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-sm overflow-hidden cursor-pointer flex flex-col group border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-60 w-full overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.style.backgroundColor = '#f1f3f6';
                    }}
                  />
                  {/* Category overlay */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-500 rounded-sm">
                    {product.category}
                  </div>
                </div>

                {/* Info body */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-sans text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#2874f0] transition-colors mb-1">
                    {product.name}
                  </h3>
                  
                  <p className="font-sans text-xs text-gray-500 mb-2 truncate">
                    {product.fabric}
                  </p>

                  <div className="mt-auto flex items-baseline gap-2 mb-3">
                    <span className="font-sans text-base font-bold text-gray-900">{product.priceRange.split(' ')[0]}</span>
                    {product.priceRange.split(' ').length > 1 && (
                      <span className="font-sans text-xs text-gray-500 line-through">
                        {product.priceRange.split(' ').pop()}
                      </span>
                    )}
                    <span className="font-sans text-xs font-bold text-green-600 ml-1">
                      Sale
                    </span>
                  </div>

                  <button className="w-full bg-[#fb641b] text-white py-2 font-bold text-sm rounded-sm shadow-sm hover:bg-[#e05411] transition-colors">
                    BOOK NOW
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
