import React from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-16 pb-8 px-6 text-white" style={{
      backgroundColor: 'var(--primary)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(var(--secondary-rgb), 0.1) 0%, transparent 60%)'
    }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b pb-12" style={{
        borderColor: 'rgba(255,255,255,0.08)'
      }}>
        
        {/* Brand Details */}
        <div>
          <h3 className="font-serif text-2xl font-bold tracking-wide text-[var(--secondary)] mb-4">
            GAURAV VASTRALAYA
          </h3>
          <p className="font-sans text-xs sm:text-sm font-light opacity-80 leading-relaxed mb-6">
            Bespoke Indian couture and fabrics. We house the finest selection of Fancy Sarees, Suits, Shirting & Suiting, and Ready-made wear for all your celebrations.
          </p>
          <div className="flex items-center gap-3 text-xs opacity-60">
            <Clock size={16} />
            <span>Open daily: 10:30 AM — 08:30 PM (Sunday Closed)</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-col md:items-center">
          <div className="text-left md:w-32">
            <h4 className="font-serif text-md font-bold mb-4 uppercase tracking-wider text-[var(--secondary-light)]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 font-sans text-xs tracking-wider font-light opacity-80">
              <li><a href="#" className="hover:text-[var(--secondary)]">Home</a></li>
              <li><a href="#categories" className="hover:text-[var(--secondary)]">Collections</a></li>
              <li><a href="#catalog" className="hover:text-[var(--secondary)]">Shop Catalog</a></li>
              <li><a href="#book-consultation" className="hover:text-[var(--secondary)]">Book styling</a></li>
            </ul>
          </div>
        </div>

        {/* Store Location / Address Info */}
        <div>
          <h4 className="font-serif text-md font-bold mb-4 uppercase tracking-wider text-[var(--secondary-light)]">
            Store Contact
          </h4>
          <ul className="flex flex-col gap-4 font-sans text-xs sm:text-sm font-light opacity-80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[var(--secondary)] flex-shrink-0 mt-0.5" />
              <span>
                124, Textile Market Road, <br />
                Near Main Bazar, <br />
                New Delhi - 110006
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[var(--secondary)]" />
              <a href="tel:+919999999999" className="hover:text-[var(--secondary)]">+91 99999 99999</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[var(--secondary)]" />
              <a href="mailto:info@gauravvastralaya.com" className="hover:text-[var(--secondary)]">info@gauravvastralaya.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center gap-4 text-[10px] font-sans tracking-widest uppercase opacity-50">
        <span>&copy; {currentYear} GAURAV VASTRALAYA. ALL RIGHTS RESERVED.</span>
        <span>Designed for Premium Customer Experience</span>
      </div>
    </footer>
  )
}

export default Footer
