import React, { useState } from 'react'
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const navLinks = [
    "Sarees", "Kurtas", "Dress Materials", "Blouses", 
    "Short Kurtis & Tops", "New Arrivals", "Sale", "Gifting", "Collections", "More"
  ];

  return (
    <header className="bg-white sticky top-0 z-50 w-full border-b border-[#eae6e1]">
      {/* Top Bar: Logo, Search, Icons */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex flex-col items-start w-48">
          <span className="font-serif text-3xl font-bold tracking-wider text-[var(--primary)] uppercase leading-none mb-1">
            Taneira
          </span>
          <span className="font-sans text-[9px] tracking-[0.2em] font-bold text-gray-800 uppercase">
            A TATA PRODUCT
          </span>
        </a>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl px-8 relative">
          <input 
            type="text" 
            placeholder="Search For Diwali Sarees" 
            className="w-full h-11 pl-4 pr-12 rounded-full border border-[#d2c9bd] bg-[#fdfdfb] focus:outline-none focus:border-[var(--primary)] font-sans text-sm"
          />
          <button className="absolute right-12 top-1/2 -translate-y-1/2 text-[#c3b6a4] hover:text-[var(--primary)] transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 justify-end w-48">
          <button className="text-gray-800 hover:text-[var(--primary)] transition-colors">
            <User size={22} strokeWidth={1.5} />
          </button>
          
          <button className="text-gray-800 hover:text-[var(--primary)] transition-colors relative">
            <Heart size={22} strokeWidth={1.5} />
            <span className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          
          <button className="text-gray-800 hover:text-[var(--primary)] transition-colors relative">
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-800 ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom Bar: Nav Links */}
      <nav className="hidden md:flex items-center justify-center gap-8 h-12 bg-white relative">
        {navLinks.map((link) => (
          <div 
            key={link}
            className="h-full flex items-center border-b-2 border-transparent hover:border-black transition-all cursor-pointer group"
            onMouseEnter={() => link === "Sarees" && setActiveMenu("Sarees")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="font-sans text-[13px] text-gray-800">
              {link}
            </span>

            {/* Mega Menu Dropdown */}
            {link === "Sarees" && activeMenu === "Sarees" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[95vw] max-w-[1400px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-b-lg border border-[#eae6e1] z-50 p-8 cursor-default flex justify-between">
                
                {/* Columns */}
                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Shop By Occasion</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">Summer Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Summer Wedding Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Formal Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Casual Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Festive Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Bridal Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Party Wear Sarees</a>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Shop By Fabric</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">Cotton Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Kota Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Khadi Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Linen Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Crepe Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Silk Sarees</a>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Shop By Colour</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">White Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Pastel Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Pink Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Blue Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Yellow Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Black Sarees</a>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Heirloom Pieces</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">Kanchipuram Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Banarasi Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Paithani Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Patola Sarees</a>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Shop By Price Range</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">Sarees Under 2000</a>
                    <a href="#" className="hover:text-[var(--primary)]">Sarees Under 5000</a>
                    <a href="#" className="hover:text-[var(--primary)]">Sarees Under 10000</a>
                    <a href="#" className="hover:text-[var(--primary)]">Sarees Under 15000</a>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[160px]">
                  <h3 className="font-serif text-[15px] font-medium text-[#b55523]">Shop By Region</h3>
                  <div className="flex flex-col gap-2 font-sans text-[12px] text-gray-600">
                    <a href="#" className="hover:text-[var(--primary)]">Rajasthan Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Bengal Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Bhagalpuri Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Murshidabad Sarees</a>
                    <a href="#" className="hover:text-[var(--primary)]">Gujarati Sarees</a>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#eae6e1] p-4 flex flex-col gap-4">
           {navLinks.map((link) => (
             <a key={link} href="#" className="font-sans text-[14px] text-gray-800 py-2 border-b border-gray-100 last:border-0">
               {link}
             </a>
           ))}
        </div>
      )}
    </header>
  )
}

export default Header
