import React from 'react'

const DEFAULT_CATEGORIES = [
  { name: 'Fabrics', imageUrl: '/assets/shirting_fabric.png' },
  { name: 'Sarees', imageUrl: '/assets/cat_saree.png' },
  { name: 'Suit Material', imageUrl: '/assets/cat_suit.png' },
  { name: 'Kurtas', imageUrl: '/assets/readymade_kurta.png' },
  { name: 'Mens', imageUrl: '/assets/cat_shirt.png' },
  { name: 'Combos', imageUrl: '/assets/cat_combo.png' }
]

function Categories({ products, onSelectCategory }) {
  const getCategoryImage = (categoryName, defaultImage) => {
    if (!products || products.length === 0) return defaultImage;
    
    // Find the first product matching this category
    const product = products.find(p => {
      const cat = (p.category || p.Category || '').toLowerCase();
      const target = categoryName.toLowerCase();
      
      // Match exact category, plural/singular forms, or common subsets
      return cat === target || 
             (target === 'fabrics' && cat === 'fabric') ||
             (target === 'sarees' && cat === 'saree') ||
             (target === 'suit material' && (cat === 'suit' || cat === 'suits' || cat === 'suit material')) ||
             (target === 'kurtas' && cat === 'kurta') ||
             (target === 'mens' && cat.includes('men')) ||
             (target === 'combos' && cat === 'combo');
    });
    
    if (product && (product.imageUrl || product.ImageUrl)) {
      const url = product.imageUrl || product.ImageUrl;
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      if (url.startsWith('/assets/')) return url;
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api';
      const ASSET_BASE = API_BASE.replace(/\/api$/, '');
      return `${ASSET_BASE}${url}`;
    }
    
    return defaultImage;
  };

  return (
    <section id="categories" className="category-strip" aria-label="Shop by category">
      <div className="section-heading compact">
        <span>Shop by category</span>
        <h2>Fabric-first collections</h2>
      </div>
      <div className="category-row">
        {DEFAULT_CATEGORIES.map((category) => (
          <button key={category.name} className="category-item" onClick={() => onSelectCategory(category.name)}>
            <span className="category-image">
              <img src={getCategoryImage(category.name, category.imageUrl)} alt={category.name} />
            </span>
            <strong>{category.name}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

export default Categories
