import React, { useState } from 'react'
import { MessageCircle, Ruler, ShieldCheck, X } from 'lucide-react'

function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  const openWhatsApp = () => {
    const message = `Hi Gaurav Vastraalay, I am interested in ${product.name}. Size/length: ${selectedSize}.`
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="modal-shell">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close product details" />
      <article className="product-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-image">
          <img src={product.imageUrl} alt={product.name} />
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
