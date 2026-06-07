import React from 'react'

const CATEGORY_ITEMS = [
  {
    name: "Saree",
    title: "Sarees",
    imageUrl: "/assets/cat_saree.png"
  },
  {
    name: "T-Shirt",
    title: "T-Shirts",
    imageUrl: "/assets/cat_tshirt.png"
  },
  {
    name: "Shirt",
    title: "Shirts",
    imageUrl: "/assets/cat_shirt.png"
  },
  {
    name: "Suit",
    title: "Suits",
    imageUrl: "/assets/cat_suit.png"
  },
  {
    name: "Jeans",
    title: "Jeans",
    imageUrl: "/assets/cat_jeans.png"
  },
  {
    name: "Combo",
    title: "Unstitched Combos",
    imageUrl: "/assets/cat_combo.png"
  }
];

function Categories({ onSelectCategory }) {
  return (
    <section id="categories" className="py-12 px-4 bg-[var(--bg-cream)] border-b border-[#eae6e1]">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 scrollbar-hide pb-2">
        {CATEGORY_ITEMS.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectCategory(item.name)}
            className="flex flex-col items-center gap-4 cursor-pointer group min-w-[90px]"
          >
            {/* Circular Image container */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center p-1 border-[1px] border-[#d7cfc5] group-hover:border-[var(--secondary)] transition-colors duration-300 shadow-sm group-hover:shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.backgroundColor = '#f1f3f6';
                  }}
                />
              </div>
            </div>
            {/* Title */}
            <span className="font-serif text-sm sm:text-base font-medium text-[var(--text-dark)] text-center whitespace-nowrap group-hover:text-[var(--primary)] transition-colors duration-300">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
