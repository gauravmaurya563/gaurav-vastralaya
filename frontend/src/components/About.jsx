import React from 'react'
import { Headphones, PackageCheck, ShieldCheck, Truck } from 'lucide-react'

const TRUST = [
  { icon: Truck, title: 'Pan India Shipping', text: 'Fast dispatch for fabric cuts and ready styles.' },
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Every product is checked before packing.' },
  { icon: PackageCheck, title: 'Easy Ordering', text: 'Order online or enquire before purchase.' },
  { icon: Headphones, title: 'Styling Help', text: 'Personal guidance for fabric and outfit use.' }
]

function About() {
  return (
    <section id="about" className="about-section">
      <div className="story-media">
        <img src="/assets/saree_premium.png" alt="Traditional saree collection" />
        <img src="/assets/suit_designer.png" alt="Designer ethnic suit" />
      </div>
      <div className="story-copy">
        <p className="eyebrow">Why shop with us</p>
        <h2>Made for people who love fabric before fashion.</h2>
        <p>
          Gaurav Vastraalay brings together curated prints, Indian occasion wear, and custom
          fabric support in one clean shopping experience. Browse like an online fabric store,
          then ask for the exact cut, size, or styling help you need.
        </p>
        <div className="trust-grid">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div className="trust-card" key={title}>
              <Icon size={22} />
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
