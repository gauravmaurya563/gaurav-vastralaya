import React from 'react'

function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[var(--bg-cream)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero_bg.png" 
          alt="Premium Fabric Background" 
          className="w-full h-full object-cover opacity-85"
        />
        {/* Subtle elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(251,250,248,0.95)] via-[rgba(251,250,248,0.7)] to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-start h-full">
        <div className="max-w-xl text-left animate-fade-in">
          <span className="font-sans text-[11px] tracking-[0.25em] font-semibold uppercase text-[var(--secondary-dark)] mb-6 block">
            The Heritage Collection
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[var(--text-dark)] leading-tight">
            Elegance Woven<br/>in Tradition
          </h1>
          <p className="font-sans text-base md:text-lg text-[var(--text-muted)] mb-10 max-w-md font-light leading-relaxed">
            Discover our handpicked collections of pure silk sarees, designer suits, and bespoke fabrics. Crafted for the modern connoisseur.
          </p>
          <div className="flex items-center gap-6">
            <a href="#catalog" className="btn-primary" style={{ backgroundColor: 'var(--primary)' }}>
              Explore Collection
            </a>
            <a href="#catalog" className="font-sans text-sm tracking-widest uppercase font-semibold text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors border-b border-transparent hover:border-[var(--primary)] pb-1">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
