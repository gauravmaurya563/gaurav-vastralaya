import React from 'react'

const CATEGORIES = [
  { name: 'Fabrics', imageUrl: '/assets/shirting_fabric.png' },
  { name: 'Sarees', imageUrl: '/assets/cat_saree.png' },
  { name: 'Suits', imageUrl: '/assets/cat_suit.png' },
  { name: 'Kurtas', imageUrl: '/assets/readymade_kurta.png' },
  { name: 'Mens', imageUrl: '/assets/cat_shirt.png' },
  { name: 'Combos', imageUrl: '/assets/cat_combo.png' }
]

function Categories({ onSelectCategory }) {
  return (
    <section id="categories" className="category-strip" aria-label="Shop by category">
      <div className="section-heading compact">
        <span>Shop by category</span>
        <h2>Fabric-first collections</h2>
      </div>
      <div className="category-row">
        {CATEGORIES.map((category) => (
          <button key={category.name} className="category-item" onClick={() => onSelectCategory(category.name)}>
            <span className="category-image">
              <img src={category.imageUrl} alt={category.name} />
            </span>
            <strong>{category.name}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

export default Categories
