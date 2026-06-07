import React from 'react'

const CATEGORY_ITEMS = [
  {
    name: "Saree",
    title: "Fancy Sarees",
    description: "Banarasi, Kanjivaram, Georgette, and designer bridal collections woven with pure zari.",
    imageUrl: "/assets/saree_premium.png",
    accent: "Crimson Red"
  },
  {
    name: "Suit",
    title: "Designer Suits",
    description: "Luxury Anarkalis, Shararas, Palazzo sets, and custom-stitched salwar suits.",
    imageUrl: "/assets/suit_designer.png",
    accent: "Emerald Green"
  },
  {
    name: "Shirting",
    title: "Shirting & Suiting",
    description: "Finest Egyptian Giza cottons and luxury wool fabric blends for bespoke tailoring.",
    imageUrl: "/assets/shirting_fabric.png",
    accent: "Royal Blue"
  },
  {
    name: "Ready-made",
    title: "Ready-made Wear",
    description: "Chikankari Kurtas, Sherwanis, and contemporary designer ethnic wear.",
    imageUrl: "/assets/readymade_kurta.png",
    accent: "Saffron Gold"
  }
];

function Categories({ onSelectCategory }) {
  return (
    <section id="categories" className="py-24 px-6 max-w-7xl mx-auto reveal">
      <div className="flex flex-col items-center text-center mb-20">
        <span className="font-sans text-[10px] tracking-[0.3em] font-semibold uppercase mb-4" style={{ color: 'var(--secondary-dark)' }}>
          Our Curated Selection
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-wide" style={{ color: 'var(--primary)' }}>
          Shop By Category
        </h2>
        <div className="w-16 h-[1px] mx-auto mb-6" style={{ backgroundColor: 'var(--secondary)' }}></div>
        <p className="font-sans text-base font-light max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Explore our diverse range of traditional masterpieces and high-quality fabrics crafted to perfection by master artisans.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {CATEGORY_ITEMS.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectCategory(item.name)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Image container */}
            <div className="relative h-[400px] overflow-hidden bg-[rgba(var(--primary-rgb),0.03)] flex items-center justify-center mb-6">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.backgroundColor = `rgba(var(--primary-rgb), ${0.05 + idx * 0.05})`;
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>

            {/* Description Area */}
            <div className="flex flex-col flex-grow text-center px-4">
              <h3 className="font-serif text-2xl font-semibold mb-3 tracking-wide transition-colors duration-300 group-hover:text-[var(--secondary-dark)]" style={{ color: 'var(--text-dark)' }}>
                {item.title}
              </h3>
              <p className="font-sans text-sm font-light mb-6 flex-grow leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {item.description}
              </p>
              
              <div className="flex items-center justify-center gap-2 font-sans text-xs tracking-[0.2em] font-semibold uppercase transition-colors" style={{
                color: 'var(--primary)'
              }}>
                <span className="border-b border-transparent group-hover:border-[var(--primary)] pb-1 transition-all duration-300">Discover</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
