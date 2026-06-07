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
    <section id="categories" className="py-20 px-6 max-w-7xl mx-auto reveal">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
          Shop By Category
        </h2>
        <p className="font-sans text-sm md:text-base font-light max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Explore our diverse range of traditional masterpieces and high-quality fabrics crafted to perfection.
        </p>
        <div className="w-12 h-1 mx-auto mt-4" style={{ backgroundColor: 'var(--secondary)' }}></div>
      </div>

      <div className="grid-responsive">
        {CATEGORY_ITEMS.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectCategory(item.name)}
            className="glass group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-gold transition-all duration-500 hover:-translate-y-2 flex flex-col"
            style={{
              border: '1px solid rgba(var(--secondary-rgb), 0.12)',
            }}
          >
            {/* Image container */}
            <div className="relative h-64 overflow-hidden bg-[rgba(var(--primary-rgb),0.03)] flex items-center justify-center">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  // fallback colored background if image generation hasn't run yet
                  e.target.style.display = 'none';
                  e.target.parentNode.style.backgroundColor = `rgba(var(--primary-rgb), ${0.05 + idx * 0.05})`;
                }}
              />
              {/* Category tag Overlay */}
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full font-sans text-xs tracking-wider font-semibold uppercase bg-white/95 text-[var(--primary)] shadow-sm">
                {item.title}
              </div>
            </div>

            {/* Description Area */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-serif text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-[var(--primary)]">
                {item.title}
              </h3>
              <p className="font-sans text-sm font-light mb-6 flex-grow" style={{ color: 'var(--text-muted)' }}>
                {item.description}
              </p>
              
              <div className="flex items-center gap-1 font-sans text-xs tracking-widest font-semibold uppercase transition-colors" style={{
                color: 'var(--secondary-dark)'
              }}>
                <span>DISCOVER COLLECTION</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
