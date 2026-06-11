import React from 'react'
import { LogOut, User, Mail, Phone, Calendar, ShoppingBag, Heart } from 'lucide-react'
import Logo from './Logo'

export default function UserAccountPage({ user, onLogout, onShopNow }) {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently joined'

  // First letter of name for avatar
  const initials = (user?.fullName || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="uap-shell">
      {/* Top bar */}
      <div className="promo-strip" style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 24px' }}>
        <span>My Account</span>
        <button
          onClick={onShopNow}
          style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ← Back to Store
        </button>
      </div>

      <div className="uap-page">
        {/* Left sidebar */}
        <aside className="uap-sidebar">
          {/* Avatar */}
          <div className="uap-avatar-wrap">
            <div className="uap-avatar">{initials}</div>
            <h2 className="uap-name">{user?.fullName}</h2>
            <p className="uap-member-since">Member since {memberSince}</p>
          </div>

          {/* Nav */}
          <nav className="uap-nav">
            <button className="uap-nav-item active">
              <User size={17} />
              <span>My Profile</span>
            </button>
            <button className="uap-nav-item" onClick={onShopNow}>
              <ShoppingBag size={17} />
              <span>Browse Store</span>
            </button>
            <button className="uap-nav-item" onClick={onShopNow}>
              <Heart size={17} />
              <span>Wishlist</span>
            </button>
            <button className="uap-nav-item uap-logout" onClick={onLogout}>
              <LogOut size={17} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="uap-main">
          <div className="uap-card">
            <div className="uap-card-header">
              <h3>Personal Information</h3>
              <p>Your account details saved with Gaurav Vastralay.</p>
            </div>

            <div className="uap-fields">
              <div className="uap-field-row">
                <div className="uap-field-block">
                  <div className="uap-field-label">
                    <User size={14} />
                    Full Name
                  </div>
                  <div className="uap-field-value">{user?.fullName || '—'}</div>
                </div>
              </div>

              <div className="uap-field-row">
                <div className="uap-field-block">
                  <div className="uap-field-label">
                    <Mail size={14} />
                    Email Address
                  </div>
                  <div className="uap-field-value">{user?.email || '—'}</div>
                </div>
                <div className="uap-field-block">
                  <div className="uap-field-label">
                    <Phone size={14} />
                    Phone Number
                  </div>
                  <div className="uap-field-value">{user?.phone || 'Not provided'}</div>
                </div>
              </div>

              <div className="uap-field-row">
                <div className="uap-field-block">
                  <div className="uap-field-label">
                    <Calendar size={14} />
                    Member Since
                  </div>
                  <div className="uap-field-value">{memberSince}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome banner */}
          <div className="uap-welcome-banner">
            <div className="uap-welcome-text">
              <h4>Welcome to Gaurav Vastralay! 🎉</h4>
              <p>Explore our premium sarees, suit materials, kurtas, and exclusive fabric collections. New arrivals added every week!</p>
            </div>
            <button className="uap-shop-btn" onClick={onShopNow}>
              <ShoppingBag size={16} />
              Shop Now
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
