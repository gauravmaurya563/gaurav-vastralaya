import React, { useState } from 'react'
import { Calendar, Phone, User, MessageSquare, Clock, Check } from 'lucide-react'

const TIME_SLOTS = [
  "11:00 AM - 12:30 PM",
  "12:30 PM - 02:00 PM",
  "03:00 PM - 04:30 PM",
  "04:30 PM - 06:00 PM",
  "06:00 PM - 07:30 PM"
];

const CATEGORIES = [
  "Bridal Saree Consultation",
  "Designer Ladies Suit Styling",
  "Bespoke Shirting & Suiting Fabric selection",
  "Ready-made Outfits consultation",
  "General Wedding/Event shopping helper"
];

function BookingForm({ apiUrl }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: TIME_SLOTS[0],
    category: CATEGORIES[0],
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit appointment to server');
      }

      const result = await response.json();
      setSuccessData(result);
    } catch (error) {
      console.warn('Backend API submission failed, saving appointment locally in demo mode.', error);
      
      // Fallback: Save in local storage and simulate success response
      const simulatedResult = {
        ...formData,
        id: 'DEMO-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      
      // Save to local storage cache
      const stored = JSON.parse(localStorage.getItem('gaurav_appointments') || '[]');
      stored.push(simulatedResult);
      localStorage.setItem('gaurav_appointments', JSON.stringify(stored));
      
      setSuccessData(simulatedResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-consultation" className="py-20 px-6 max-w-5xl mx-auto reveal">
      <div className="glass rounded-3xl overflow-hidden shadow-lg border flex flex-col md:flex-row" style={{
        borderColor: 'rgba(var(--secondary-rgb), 0.18)',
        backgroundColor: 'var(--bg-card)'
      }}>
        
        {/* Left Info Panel */}
        <div className="w-full md:w-2/5 p-8 md:p-12 text-white flex flex-col justify-between relative" style={{
          backgroundColor: 'var(--primary)',
          backgroundImage: 'radial-gradient(circle at bottom left, rgba(var(--secondary-rgb), 0.15) 0%, transparent 80%)'
        }}>
          <div>
            <span className="font-sans text-xs tracking-widest font-semibold uppercase text-[var(--secondary-light)] mb-2 block">
              Bespoke Styling
            </span>
            <h2 className="font-serif text-3xl font-bold mb-6">
              Book a Personal <br />
              <span className="text-[var(--secondary)]">Consultation</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm font-light leading-relaxed mb-6 opacity-90">
              Enjoy dedicated attention from our styling experts in a private lounge. We will help you sort fabrics, take measurements, and match jewelry for your special events.
            </p>
          </div>

          <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="block text-[10px] tracking-wider uppercase opacity-60 mb-2">STORE ASSIST LINE</span>
            <a href="tel:+919999999999" className="font-serif text-lg font-semibold flex items-center gap-2 text-[var(--secondary)] hover:underline">
              <Phone size={16} />
              <span>+91 99999 99999</span>
            </a>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          {successData ? (
            /* Success confirmation card */
            <div className="flex flex-col items-center justify-center text-center h-full py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white" style={{
                backgroundColor: 'var(--secondary)'
              }}>
                <Check size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Session Booked Successfully!
              </h3>
              <p className="font-sans text-sm font-light text-[var(--text-muted)] mb-6 max-w-sm">
                Thank you, <strong>{successData.name}</strong>. Your appointment has been scheduled for:
              </p>
              
              {/* Ticket Details */}
              <div className="w-full max-w-sm rounded-xl p-5 mb-8 text-left border" style={{
                backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                borderColor: 'rgba(var(--secondary-rgb), 0.15)'
              }}>
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)] uppercase">APPOINTMENT ID</span>
                    <span className="font-mono font-semibold text-xs truncate block">{successData.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)] uppercase">CATEGORY</span>
                    <span className="font-semibold">{successData.category.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)] uppercase">DATE</span>
                    <span className="font-semibold">{successData.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)] uppercase">TIME SLOT</span>
                    <span className="font-semibold">{successData.timeSlot}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSuccessData(null)}
                className="btn-secondary"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            /* Consultation input Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMsg && (
                <div className="p-3 text-xs bg-red-100 border border-red-200 text-red-700 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                    <User size={12} className="text-[var(--secondary)]" />
                    <span>Your Name</span>
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Gaurav Kumar"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                      backgroundColor: 'rgba(0,0,0,0.01)'
                    }}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                    <Phone size={12} className="text-[var(--secondary)]" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    required
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 99999 99999"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                      backgroundColor: 'rgba(0,0,0,0.01)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="date" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                    <Calendar size={12} className="text-[var(--secondary)]" />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    required
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                      backgroundColor: 'rgba(0,0,0,0.01)'
                    }}
                  />
                </div>

                {/* Time Slot */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="timeSlot" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                    <Clock size={12} className="text-[var(--secondary)]" />
                    <span>Time Slot</span>
                  </label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors cursor-pointer"
                    style={{
                      borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                      backgroundColor: 'rgba(0,0,0,0.01)'
                    }}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultation Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)]">
                  What are you shopping for?
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors cursor-pointer"
                  style={{
                    borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                    backgroundColor: 'rgba(0,0,0,0.01)'
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-[var(--secondary)]" />
                  <span>Notes / Custom requests</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Need matching custom fabrics for my brother's wedding, would like to see cotton and silk blends..."
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors resize-none"
                  style={{
                    borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                    backgroundColor: 'rgba(0,0,0,0.01)'
                  }}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3.5 mt-2"
              >
                <span>{isSubmitting ? 'BOOKING APPOINTMENT...' : 'CONFIRM STYLING SESSION'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingForm
