import React, { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'

const MENU = ['Fabrics', 'Sarees', 'Suits', 'Kurtas', 'Mens', 'Combos', 'New Arrivals', 'Sale']

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="promo-strip">
        <span>5 lakh+ happy customers</span>
        <span>Buy 2 Get 1 Free</span>
        <span>Free delivery over Rs. 849</span>
      </div>

      <div className="header-main">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <a className="brand" href="#">
          <span>Gaurav</span>
          <strong>Vastraalay</strong>
        </a>

        <label className="search-box" aria-label="Search products">
          <input placeholder="Search sarees, fabrics, kurtas..." />
          <Search size={18} />
        </label>

        <div className="header-actions">
          <button className="icon-button" aria-label="Account">
            <User size={20} />
          </button>
          <button className="icon-button badge" aria-label="Wishlist">
            <Heart size={20} />
            <span>0</span>
          </button>
          <button className="icon-button badge" aria-label="Cart">
            <ShoppingBag size={20} />
            <span>0</span>
          </button>
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
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
