import React, { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Logo from './Logo'

const MENU = ['Fabrics', 'Sarees', 'Suit Material', 'Kurtas', 'Mens', 'Combos', 'New Arrivals', 'Sale']

function Header({ user, onUserClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Compute initials for avatar when logged in
  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : null

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

        <Logo size="small" layout="horizontal" variant="header" />

        <label className="search-box" aria-label="Search products">
          <input placeholder="Search sarees, fabrics, kurtas..." />
          <Search size={18} />
        </label>

        <div className="header-actions">
          {/* User / Account button */}
          <button
            className={`icon-button ${initials ? 'user-logged-in' : ''}`}
            aria-label={initials ? `My Account (${user.fullName})` : 'Sign In'}
            onClick={onUserClick}
            title={initials ? `Signed in as ${user.fullName}` : 'Sign In / Register'}
          >
            {initials ? (
              <span className="header-user-avatar">{initials}</span>
            ) : (
              <User size={20} />
            )}
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
            {/* Mobile login/account button */}
            <button
              className="drawer-user-btn"
              onClick={() => { setMenuOpen(false); onUserClick?.() }}
            >
              {initials ? `👤 ${user.fullName}` : '👤 Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
