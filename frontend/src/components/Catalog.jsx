import React, { useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'

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
    <section id="catalog" className="py-12 px-6 bg-[var(--bg-cream)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Top Title */}
        <div className="text-[13px] text-gray-500 mb-8 font-sans">
          Home / <span className="font-semibold text-gray-800">{CATEGORY_MAP[filterCategory]}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR FILTERS */}
          <div className="w-full lg:w-1/4 hidden lg:block">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#eae6e1]">
              <span className="font-sans text-[13px] tracking-widest font-semibold text-gray-800 uppercase">FILTER BY</span>
              <button 
                onClick={() => setFilterCategory('All')}
                className="flex items-center gap-2 font-sans text-[13px] text-gray-500 hover:text-[var(--primary)] transition-colors"
              >
                Reset <RefreshCw size={14} />
              </button>
            </div>

            {/* Simulated Collapsible Filter Sections */}
            <div className="space-y-6">
              {[
                { title: "PRICE RANGE", open: true },
                { title: "DISCOUNT", open: true },
                { title: "FABRIC", open: true },
                { title: "COLOUR", open: true }
              ].map((filter, idx) => (
                <div key={idx} className="border-b border-[#eae6e1] pb-4 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[12px] tracking-wider font-semibold text-gray-800 uppercase group-hover:text-[var(--primary)] transition-colors">
                      {filter.title}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PRODUCT GRID AREA */}
          <div className="w-full lg:w-3/4">
            
            {/* Top Bar above products */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-[#eae6e1]">
              <h2 className="font-serif text-2xl tracking-wider uppercase text-[#5a2e1d] mb-4 sm:mb-0">
                {CATEGORY_MAP[filterCategory].toUpperCase()}
              </h2>
              
              <div className="flex items-center gap-6">
                <span className="font-sans text-[13px] text-gray-500">
                  {filteredProducts.length} Products Found
                </span>
                
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[12px] tracking-wider font-semibold text-gray-800 uppercase">SORT BY :</span>
                  <div className="border border-gray-300 px-4 py-2 flex items-center justify-between w-48 bg-white cursor-pointer">
                    <span className="font-sans text-[13px] text-gray-700">Recommended</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Buttons (visible only on small screens) */}
            <div className="flex lg:hidden flex-wrap gap-2 mb-6">
              {Object.keys(CATEGORY_MAP).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="px-4 py-1.5 font-sans text-[11px] tracking-wider uppercase border rounded-full transition-colors"
                  style={{
                    backgroundColor: filterCategory === cat ? 'var(--primary)' : 'transparent',
                    color: filterCategory === cat ? 'white' : 'var(--text-dark)',
                    borderColor: filterCategory === cat ? 'var(--primary)' : '#eae6e1'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading Spinner */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#eae6e1] rounded-full animate-spin" style={{
                  borderTopColor: 'var(--primary)'
                }}></div>
                <p className="font-sans text-sm tracking-wider font-light text-[var(--text-muted)]">Curating the collections...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#eae6e1]">
                <p className="font-sans text-md font-light text-[var(--text-muted)] mb-4">No designs found in this category.</p>
                <button 
                  onClick={() => setFilterCategory('All')}
                  className="btn-secondary"
                >
                  View All Collections
                </button>
              </div>
            ) : (
              /* Products Grid (3 columns on large screens to fit sidebar) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className="bg-transparent overflow-hidden cursor-pointer flex flex-col group relative"
                  >
                    {/* Vertical Tag (Online Exclusives) */}
                    <div className="absolute top-4 left-4 z-10 bg-[var(--primary)] text-white font-sans text-[10px] tracking-widest uppercase font-semibold py-1 px-3 origin-top-left -rotate-90 translate-y-16" style={{ transformOrigin: 'left top' }}>
                      Online Exclusives
                    </div>

                    {/* Product Image */}
                    <div className="relative h-[380px] w-full overflow-hidden mb-4 bg-white">
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
                    <div className="flex flex-col flex-grow text-left px-2">
                      <h3 className="font-serif text-base font-normal text-[var(--text-dark)] group-hover:text-[var(--primary)] transition-colors mb-1 truncate">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-sans text-sm font-semibold text-[var(--text-dark)]">{product.priceRange.split(' ')[0]}</span>
                        {product.priceRange.split(' ').length > 1 && (
                          <span className="font-sans text-[11px] text-gray-400 line-through">
                            {product.priceRange.split(' ').pop()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Catalog
