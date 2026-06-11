import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'

function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <div>
          <span>Newsletter</span>
          <h2>New prints, festive drops, and sale alerts.</h2>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <input placeholder="Enter email address" />
          <button>Subscribe</button>
        </form>
      </div>

      <div className="footer-grid">
        <div>
          <Logo size="medium" layout="stacked" variant="footer" />
          <p>Premium fabrics, ethnic wear, and custom print support for modern Indian wardrobes.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="#catalog">Fabrics</a>
          <a href="#catalog">Sarees</a>
          <a href="#catalog">Suit Material</a>
          <a href="#customize">Custom Print</a>
        </div>
        <div>
          <h3>Help</h3>
          <a href="#about">About us</a>
          <a href="#customize">Bulk order</a>
          <a href="#customize">Print enquiry</a>
          <a href="#catalog">Size guide</a>
        </div>
        <div>
          <h3>Contact</h3>
          <span><MapPin size={15} /> Textile Market Road, New Delhi</span>
          <span><Phone size={15} /> +91 99999 99999</span>
          <span><Mail size={15} /> hello@gauravVastralay.com</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright {new Date().getFullYear()} Gaurav Vastralay.</span>
        <span>Built for premium fabric shopping.</span>
      </div>
    </footer>
  )
}

export default Footer
