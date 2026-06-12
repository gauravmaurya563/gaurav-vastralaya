import React, { useState } from 'react'
import { Menu, MessageCircle, Search, X } from 'lucide-react'
import Logo from './Logo'

const MENU = ['Fabrics', 'Sarees', 'Suit Material', 'Kurtas', 'Mens', 'Combos', 'New Arrivals', 'Sale']

function Header({ user, onUserClick, settings }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const whatsappNumber = settings?.WhatsAppNumber || import.meta.env.VITE_CONTACT_WHATSAPP || '919999999999'

  return (
    <header className="site-header">
      <div className="promo-strip">
        <span>5 lakh+ happy customers</span>
        <span>Custom Designs & Collections</span>
        <span>WhatsApp support active</span>
      </div>

      <div className="header-main">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Logo size="small" layout="horizontal" variant="header" />

        <label className="search-box" aria-label="Search products">
          <input placeholder="Search sarees, fabrics, kurtas..." />
          <Search size={18} />
        </label>

        <div className="header-actions">
          {/* WhatsApp Support CTA */}
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-link"
            style={{
              minHeight: '38px',
              padding: '0 16px',
              fontSize: '11px',
              fontWeight: '800',
              borderRadius: '20px',
              gap: '6px',
              background: '#25D366',
              border: 'none',
              boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} /> WhatsApp Inquiry
          </a>
        </div>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        {MENU.map((item) => (
          <a key={item} href={item === 'Sale' ? '#catalog' : '#categories'}>
            {item}
          </a>
        ))}
      </nav>

      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <div className="drawer-panel">
            <div className="drawer-head">
              <span>Menu</span>
              <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <label className="search-box drawer-search" aria-label="Search products">
              <input placeholder="Search collection..." />
              <Search size={18} />
            </label>
            {MENU.map((item) => (
              <a key={item} href="#categories" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            {/* WhatsApp CTA in mobile drawer */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-user-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#fff',
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '16px',
                textAlign: 'center'
              }}
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
