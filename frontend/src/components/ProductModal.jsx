import React, { useState } from 'react'
import { MessageCircle, Ruler, ShieldCheck, X } from 'lucide-react'

function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const imagesList = product.images || product.Images || (product.imageUrl ? [product.imageUrl] : [])
  const [activeImage, setActiveImage] = useState(product.imageUrl)

  const getFullImageUrl = (url) => {
    if (!url) return 'https://loremflickr.com/400/600/fashion'
    if (url.startsWith('http') || url.startsWith('data:')) return url
    return `http://localhost:5121${url}`
  }

  const openWhatsApp = () => {
    const message = `Hi Gaurav Vastralay, I am interested in ${product.name}. Size/length: ${selectedSize}.`
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="modal-shell">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close product details" />
      <article className="product-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-image-container">
          <div className="modal-main-image">
            <img src={getFullImageUrl(activeImage)} alt={product.name} />
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
          <strong className="modal-price">{product.priceRange}</strong>
          <p>{product.description}</p>

          <div className="modal-specs">
            <span><ShieldCheck size={17} /> {product.fabric}</span>
            <span><Ruler size={17} /> {product.occasion}</span>
          </div>

          <div className="size-picker">
            <span>Size / length</span>
            <div>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="primary-link modal-action" onClick={openWhatsApp}>
            Enquire on WhatsApp <MessageCircle size={17} />
          </button>
        </div>
      </article>
    </div>
  )
}

export default ProductModal
