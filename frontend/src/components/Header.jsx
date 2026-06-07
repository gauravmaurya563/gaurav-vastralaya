import React, { useState } from 'react'
import { Sun, Moon, Phone, Menu, X } from 'lucide-react'

function Header({ isDarkMode, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 w-full transition-all duration-300" style={{
      borderBottom: '1px solid rgba(var(--secondary-rgb), 0.15)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-wide" style={{
            color: 'var(--primary)'
          }}>
            GAURAV
          </span>
          <span className="font-sans text-xs tracking-[0.25em] font-medium" style={{
            color: 'var(--secondary-dark)',
            marginTop: '-2px'
          }}>
            VASTRALAYA
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-sm tracking-wider">
          <a href="#" className="hover:text-[var(--primary)] py-2">HOME</a>
          <a href="#categories" className="hover:text-[var(--primary)] py-2">COLLECTIONS</a>
          <a href="#catalog" className="hover:text-[var(--primary)] py-2">SHOP CATALOG</a>
          <a href="#book-consultation" className="hover:text-[var(--primary)] py-2">STYLING BOOKING</a>
          <a href="#about" className="hover:text-[var(--primary)] py-2">OUR STORY</a>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-[rgba(var(--secondary-rgb),0.1)] transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ color: 'var(--text-dark)' }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <a 
            href="tel:+919999999999" 
            className="btn-secondary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            <Phone size={14} />
            <span>CALL STORE</span>
          </a>
        </div>

        {/* Mobile menu toggle & Theme toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full"
            style={{ color: 'var(--text-dark)' }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full"
            style={{ color: 'var(--primary)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass w-full px-6 py-6 border-t flex flex-col gap-4 font-sans font-medium text-sm tracking-wider" style={{
          borderColor: 'rgba(var(--secondary-rgb), 0.15)'
        }}>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--primary)] py-2">HOME</a>
          <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--primary)] py-2">COLLECTIONS</a>
          <a href="#catalog" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--primary)] py-2">SHOP CATALOG</a>
          <a href="#book-consultation" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--primary)] py-2">STYLING BOOKING</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--primary)] py-2">OUR STORY</a>
          
          <div className="flex items-center gap-4 mt-2 border-t pt-4" style={{ borderColor: 'rgba(var(--secondary-rgb), 0.1)' }}>
            <a 
              href="tel:+919999999999" 
              className="btn-primary w-full justify-center"
              style={{ padding: '10px 20px' }}
            >
              <Phone size={14} />
              <span>CALL STORE</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
