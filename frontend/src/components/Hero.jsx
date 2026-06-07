import React from 'react'
import { Sparkles, Calendar } from 'lucide-react'

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center" style={{
      background: 'radial-gradient(circle at top, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%)'
    }}>
      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 w-24 h-24 opacity-10 pointer-events-none animate-float" style={{
        border: '2px solid var(--secondary)',
        transform: 'rotate(45deg)'
      }}></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 opacity-10 pointer-events-none animate-float" style={{
        border: '1px dashed var(--secondary)',
        borderRadius: '50%',
        animationDelay: '2s'
      }}></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Small Tagline Banner */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 font-sans text-xs tracking-[0.2em] font-semibold uppercase animate-fade-in" style={{
          backgroundColor: 'rgba(var(--secondary-rgb), 0.1)',
          color: 'var(--secondary-dark)'
        }}>
          <Sparkles size={12} className="text-[var(--secondary)]" />
          <span>ESTABLISHED TRADITION & ELEGANCE</span>
        </div>

        {/* Majestic Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-wide leading-tight animate-fade-in" style={{
          animationDelay: '0.1s',
          color: 'var(--text-dark)'
        }}>
          Bespoke Indian Couture & <br />
          <span className="gold-text">Exquisite Fabrics</span>
        </h1>

        {/* Descriptive Tagline */}
        <p className="font-sans text-md sm:text-xl font-light mb-10 max-w-2xl leading-relaxed animate-fade-in" style={{
          animationDelay: '0.2s',
          color: 'var(--text-muted)'
        }}>
          Step into a world of timeless beauty. Discover our handpicked collections of 
          <strong> Fancy Sarees</strong>, <strong>Designer Suits</strong>, <strong>Bespoke Shirting</strong>, 
          and exquisite <strong>Ready-made ethnic wear</strong> curated for your special moments.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
          <a href="#catalog" className="btn-primary justify-center">
            <span>EXPLORE SHOWCASE</span>
          </a>
          <a href="#book-consultation" className="btn-secondary justify-center">
            <Calendar size={16} />
            <span>BOOK STYLING SESSION</span>
          </a>
        </div>
      </div>

      {/* Luxury Border Accent */}
      <div className="w-full max-w-xl h-[1px] mt-16 opacity-30" style={{
        background: 'linear-gradient(to right, transparent, var(--secondary), transparent)'
      }}></div>
    </section>
  )
}

export default Hero
