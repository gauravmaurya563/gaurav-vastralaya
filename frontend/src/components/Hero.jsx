import React from 'react'
import { ArrowRight } from 'lucide-react'

function Hero() {
  return (
    <section className="hero">
      <img className="hero-bg" src="/assets/hero_bg.png" alt="Premium Indian fabrics and ethnic wear" />
      <div className="hero-content">
        <p className="eyebrow">Custom prints. Festive weaves. Everyday style.</p>
        <h1>Gaurav Vastralay</h1>
        <p>
          Shop fabric by the meter, sarees, suits, kurtas, and ready-to-stitch combinations
          curated for Indian celebrations and modern tailoring.
        </p>
        <div className="hero-actions">
          <a className="primary-link" href="#catalog">
            Shop collection <ArrowRight size={17} />
          </a>
          <a className="text-link" href="#customize">Start custom order</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
