import React from 'react'

const CATEGORY_ITEMS = [
  {
    name: "Saree",
    title: "Fancy Sarees",
    imageUrl: "/assets/saree_premium.png"
  },
  {
    name: "Suit",
    title: "Designer Suits",
    imageUrl: "/assets/suit_designer.png"
  },
  {
    name: "Shirting",
    title: "Shirting & Suiting",
    imageUrl: "/assets/shirting_fabric.png"
  },
  {
    name: "Ready-made",
    title: "Ready-made Wear",
    imageUrl: "/assets/readymade_kurta.png"
  }
];

function Categories({ onSelectCategory }) {
  return (
    <section id="categories" className="py-6 px-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-hide pb-2">
        {CATEGORY_ITEMS.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectCategory(item.name)}
            className="flex flex-col items-center gap-3 cursor-pointer group min-w-[80px]"
          >
            {/* Circular Image container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center p-0.5 border border-transparent group-hover:border-[#2874f0] transition-colors">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.backgroundColor = '#f1f3f6';
                  }}
                />
              </div>
            </div>
            {/* Title */}
            <span className="font-sans text-xs sm:text-sm font-medium text-gray-800 text-center whitespace-nowrap group-hover:text-[#2874f0] transition-colors">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
