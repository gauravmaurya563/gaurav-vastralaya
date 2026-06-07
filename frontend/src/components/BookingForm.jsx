import React, { useState } from 'react'
import { CheckCircle, ImageUp, Ruler, Send, Sparkles } from 'lucide-react'

const OPTIONS = ['Cotton', 'Silk', 'Georgette', 'Linen', 'Crepe']

function BookingForm() {
  const [selectedFabric, setSelectedFabric] = useState('Cotton')

  return (
    <section id="customize" className="custom-section">
      <div className="custom-copy">
        <p className="eyebrow">Bespoke print studio</p>
        <h2>Design your own fabric</h2>
        <p>
          Pick a base, share your motif or reference, and let us prepare fabric for sarees,
          kurtas, shirts, or matching family outfits.
        </p>
        <div className="custom-points">
          <span><ImageUp size={17} /> Upload pattern reference</span>
          <span><Ruler size={17} /> Choose meters or outfit use</span>
          <span><Sparkles size={17} /> Get styling guidance</span>
        </div>
      </div>

      <form className="custom-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Your name
          <input placeholder="Enter your name" />
        </label>
        <label>
          Mobile number
          <input placeholder="+91 99999 99999" />
        </label>
        <div className="swatch-group" aria-label="Fabric type">
          {OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={selectedFabric === option ? 'selected' : ''}
              onClick={() => setSelectedFabric(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <label>
          Requirement
          <textarea placeholder="Tell us your color, meter, print, or outfit idea..." rows="4" />
        </label>
        <button className="primary-link form-submit" type="submit">
          Send request <Send size={16} />
        </button>
        <small><CheckCircle size={14} /> We will confirm availability and pricing on WhatsApp.</small>
      </form>
    </section>
  )
}

export default BookingForm
