import React, { useState } from 'react'
import { X, Send, Award, Shirt, Scissors } from 'lucide-react'

function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Unstitched');
  
  // WhatsApp Configuration (Default contact number)
  const WHATSAPP_NUMBER = '919999999999'; 

  // Create WhatsApp message link
  const handleWhatsAppInquiry = () => {
    const baseMsg = `Hi Gaurav Vastralaya, I'm interested in the following item from your website catalog:\n\n` +
      `*Product:* ${product.name}\n` +
      `*Category:* ${product.category}\n` +
      `*Fabric:* ${product.fabric}\n` +
      `*Price Range:* ${product.priceRange}\n` +
      `*Selected Size:* ${selectedSize}\n\n` +
      `Can you please confirm the availability and sharing option for purchase?`;
    
    const encodedText = encodeURIComponent(baseMsg);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* Modal Dialog */}
      <div 
        className="glass relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-lg border animate-fade-in flex flex-col md:flex-row"
        style={{
          borderColor: 'rgba(var(--secondary-rgb), 0.2)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-dark)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
        >
          <X size={18} />
        </button>

        {/* Modal Image Section */}
        <div className="w-full md:w-1/2 h-72 md:h-auto min-h-[350px] bg-[rgba(var(--primary-rgb),0.03)] flex items-center justify-center relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.backgroundColor = 'rgba(var(--primary-rgb), 0.05)';
            }}
          />
          {/* Subtle logo mark on picture */}
          <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded font-serif text-[10px] tracking-[0.2em] uppercase text-[var(--secondary-dark)]">
            Gaurav Vastralaya
          </div>
        </div>

        {/* Modal Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Tagline */}
            <span className="font-sans text-xs tracking-widest font-semibold uppercase text-[var(--secondary-dark)] block mb-1">
              {product.category}
            </span>
            
            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              {product.name}
            </h2>

            {/* Price Banner */}
            <div className="mb-6 p-4 rounded-xl flex items-center justify-between" style={{
              backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
              borderLeft: '4px solid var(--secondary)'
            }}>
              <span className="font-sans text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">ESTIMATED PRICE</span>
              <span className="font-serif text-lg font-bold text-[var(--primary)]">{product.priceRange}</span>
            </div>

            {/* Description */}
            <p className="font-sans text-sm font-light leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {product.description}
            </p>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-2.5">
                <Shirt size={16} className="text-[var(--secondary)]" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Fabric</span>
                  <span className="text-xs font-semibold">{product.fabric}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Award size={16} className="text-[var(--secondary)]" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Occasion</span>
                  <span className="text-xs font-semibold">{product.occasion}</span>
                </div>
              </div>
            </div>

            {/* Sizes Select list */}
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest font-semibold text-[var(--text-dark)] mb-3 flex items-center gap-1.5">
                <Scissors size={14} className="text-[var(--secondary)]" />
                <span>SELECT SIZE / LENGTH</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-3.5 py-1.5 rounded-lg font-sans text-xs font-medium transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedSize === size ? 'var(--primary)' : 'rgba(0,0,0,0.03)',
                      color: selectedSize === size ? 'white' : 'var(--text-dark)',
                      border: `1px solid ${selectedSize === size ? 'var(--primary)' : 'rgba(var(--secondary-rgb), 0.15)'}`
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action WhatsApp Button */}
          <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <button 
              onClick={handleWhatsAppInquiry}
              className="btn-primary w-full justify-center py-3.5"
            >
              <Send size={16} />
              <span>ENQUIRE ON WHATSAPP</span>
            </button>
            <span className="text-center text-[10px] font-sans tracking-wide text-[var(--text-muted)]">
              🔒 Direct secure connection to store representative.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
