import React from 'react'
import { Sparkles, Calendar } from 'lucide-react'

function Hero() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{ backgroundImage: 'url(/assets/hero_bg.png)' }}
      ></div>
      
      {/* Dark Luxury Overlay */}
      <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        {/* Small Tagline Banner */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-full mb-8 font-sans text-[10px] sm:text-xs tracking-[0.25em] font-semibold uppercase animate-fade-in" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'var(--bg-cream)'
        }}>
          <Sparkles size={14} className="text-[var(--secondary)]" />
          <span>ESTABLISHED TRADITION & ELEGANCE</span>
        </div>

        {/* Majestic Title */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-wide leading-[1.1] animate-fade-in drop-shadow-2xl text-white" style={{
          animationDelay: '0.2s',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          Bespoke Indian Couture <br />
          <span className="gold-text">& Exquisite Fabrics</span>
        </h1>

        {/* Descriptive Tagline */}
        <p className="font-sans text-base sm:text-xl font-light mb-12 max-w-3xl leading-relaxed animate-fade-in opacity-90 text-white" style={{
          animationDelay: '0.4s',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          Step into a world of timeless beauty. Discover our handpicked collections of 
          <strong> Fancy Sarees</strong>, <strong>Designer Suits</strong>, <strong>Bespoke Shirting</strong>, 
          and exquisite <strong>Ready-made ethnic wear</strong> curated for your special moments.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
          <a href="#catalog" className="px-10 py-4 bg-[var(--secondary)] text-white rounded-none border border-[var(--secondary)] font-sans text-xs tracking-widest uppercase font-bold hover:bg-transparent hover:text-[var(--secondary)] transition-all duration-300">
            EXPLORE SHOWCASE
          </a>
          <a href="#book-consultation" className="px-10 py-4 bg-transparent text-white rounded-none border border-white/40 font-sans text-xs tracking-widest uppercase font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
            <Calendar size={14} />
            BOOK STYLING SESSION
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
