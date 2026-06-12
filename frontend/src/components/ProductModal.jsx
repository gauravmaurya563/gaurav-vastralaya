import React, { useState } from 'react'
import { Check, MessageCircle, Ruler, Share2, ShieldCheck, X } from 'lucide-react'

function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const imagesList = product.images || product.Images || (product.imageUrl ? [product.imageUrl] : [])
  const [activeImage, setActiveImage] = useState(product.imageUrl)
  const [copied, setCopied] = useState(false)

  const soldOut = product.isSoldOut || product.IsSoldOut || false

  const getFullImageUrl = (url) => {
    if (!url) return 'https://loremflickr.com/400/600/fashion'
    if (url.startsWith('http') || url.startsWith('data:')) return url
    if (url.startsWith('/assets/')) return url
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
    const ASSET_BASE = API_BASE.replace(/\/api$/, '')
    return `${ASSET_BASE}${url}`
  }

  const openWhatsApp = () => {
    const whatsappNumber = import.meta.env.VITE_CONTACT_WHATSAPP || '919999999999'
    const name = product.name || product.Name
    const category = product.category || product.Category || 'Clothing'
    const fabric = product.fabric || product.Fabric || 'N/A'
    const priceRange = product.priceRange || product.PriceRange || 'N/A'
    
    const message = soldOut
      ? `Hi Gaurav Vastralay, I am interested in this design: *${name}* which is currently out of stock. Could you let me know if/when this will be restocked or if I can pre-order it?`
      : `Hi Gaurav Vastralay, I am interested in this clothing item:\n\n*Product:* ${name}\n*Category:* ${category}\n*Fabric:* ${fabric}\n*Price Range:* ${priceRange}\n*Selected Size/Length:* ${selectedSize || 'N/A'}\n\nIs this available for ordering?`
      
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?product=${product.id || product.Id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="modal-shell">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close product details" />
      <article className="product-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-image-container">
          <div className="modal-main-image" style={{ position: 'relative' }}>
            {soldOut && (
              <span className="sale-tag" style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--muted)', zIndex: 5 }}>Sold Out</span>
            )}
            <img src={getFullImageUrl(activeImage)} alt={product.name} style={{ filter: soldOut ? 'grayscale(30%)' : 'none' }} />
          </div>
          {imagesList.length > 1 && (
            <div className="modal-thumbnails-row">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`modal-thumbnail-btn ${activeImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img src={getFullImageUrl(imgUrl)} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="modal-content">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <strong className="modal-price" style={{ opacity: soldOut ? 0.6 : 1 }}>{product.priceRange}</strong>
          <p>{product.description}</p>

          <div className="modal-specs">
            <span><ShieldCheck size={17} /> {product.fabric}</span>
            <span><Ruler size={17} /> {product.occasion}</span>
          </div>

          <div className="size-picker" style={{ opacity: soldOut ? 0.5 : 1, pointerEvents: soldOut ? 'none' : 'auto' }}>
            <span>Size / length {soldOut && ' (Unavailable)'}</span>
            <div>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                  disabled={soldOut}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button 
              className="primary-link modal-action" 
              style={{ flex: 1, background: soldOut ? 'var(--muted)' : 'var(--brand)' }} 
              onClick={openWhatsApp}
            >
              {soldOut ? 'Restock Inquiry' : 'Enquire on WhatsApp'} <MessageCircle size={17} />
            </button>
            <button
              className="primary-link"
              style={{
                background: copied ? 'var(--sage)' : 'var(--soft)',
                color: copied ? '#fff' : 'var(--ink)',
                border: '1px solid var(--line)',
                minHeight: '46px',
                padding: '0 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={handleShare}
              title="Copy direct product link to clipboard"
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default ProductModal
