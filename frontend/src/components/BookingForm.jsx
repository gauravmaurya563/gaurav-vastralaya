import React, { useState } from 'react'
import { 
  Calendar, Phone, User, MessageSquare, Clock, Check, 
  ChevronRight, ChevronLeft, UploadCloud, Trash2, 
  Scissors, Ruler, Sparkles, Image, CheckCircle, HelpCircle
} from 'lucide-react'

const TIME_SLOTS = [
  "11:00 AM - 12:30 PM",
  "12:30 PM - 02:00 PM",
  "03:00 PM - 04:30 PM",
  "04:30 PM - 06:00 PM",
  "06:00 PM - 07:30 PM"
];

const SERVICES = [
  {
    id: "bridal",
    title: "Bridal & Event Saree Consultation",
    description: "Dedicated styling session for bridal sarees, tailored blouses, matching jewelry, and drape selections.",
    icon: Sparkles,
    categoryName: "Bridal Saree Consultation"
  },
  {
    id: "suit",
    title: "Bespoke Ladies Suit Designing",
    description: "Work with our designers on custom necklines, silhouettes, hand-embroidery layout, and fitting slots.",
    icon: Scissors,
    categoryName: "Designer Ladies Suit Styling"
  },
  {
    id: "custom_print",
    title: "Custom Fabric Printing (Fabcurate Style)",
    description: "Upload your digital artwork pattern and select a base fabric (Silk, Cotton, Georgette) to print.",
    icon: Image,
    categoryName: "Bespoke Shirting & Suiting Fabric selection"
  },
  {
    id: "menswear",
    title: "Premium Shirting & Suiting Selection",
    description: "Choose high-quality Giza cottons and worsted wools, and take measurements for executive fits.",
    icon: Ruler,
    categoryName: "Ready-made Outfits consultation"
  }
];

const FABRIC_BASES = [
  { name: "Pure Banarasi Silk", price: "₹2,200 / meter", desc: "Luxurious texture, gold zari friendly. Best for sarees & festive suits." },
  { name: "Giza Cotton", price: "₹450 / meter", desc: "Fine Egyptian weave, extremely breathable. Perfect for formal shirts." },
  { name: "Poly Georgette", price: "₹320 / meter", desc: "Fluid drape, vibrant print colors. Best for flowy outfits & dupattas." },
  { name: "Organic Linen", price: "₹650 / meter", desc: "Breathable natural fabric. Great for summer suits and casual shirts." }
];

const REPEAT_TYPES = [
  { name: "Seamless Repeat", desc: "Continuously tiled pattern across the width and length." },
  { name: "Center Motif", desc: "One large centered graphic or placement print." },
  { name: "Border Print", desc: "Aligned along the fabric selvage edges." }
];

function BookingForm({ apiUrl }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  
  // Custom design / upload states
  const [referenceFile, setReferenceFile] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_BASES[0]);
  const [selectedRepeat, setSelectedRepeat] = useState(REPEAT_TYPES[0]);
  
  // Schedule states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  
  // Contact details
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceFile({
          name: file.name,
          base64: reader.result,
          size: (file.size / 1024).toFixed(1) + " KB"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 3 && !selectedDate) {
      setErrorMsg("Please select a preferred date to proceed.");
      return;
    }
    setErrorMsg("");
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone) {
      setErrorMsg("Name and Phone Number are required fields.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    // Build rich message details to send to the backend
    let enrichedMessage = contactData.message || "";
    if (selectedService.id === "custom_print") {
      enrichedMessage += `\n\n--- Bespoke Print Details ---`;
      enrichedMessage += `\nFabric Base: ${selectedFabric.name}`;
      enrichedMessage += `\nRepeat Layout: ${selectedRepeat.name}`;
      if (referenceFile) {
        enrichedMessage += `\nUploaded Pattern: ${referenceFile.name} (${referenceFile.size})`;
      }
    } else if (referenceFile) {
      enrichedMessage += `\n\n[Reference Image Attached: ${referenceFile.name}]`;
    }

    const payload = {
      name: contactData.name,
      phone: contactData.phone,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      category: selectedService.categoryName,
      message: enrichedMessage
    };

    try {
      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit appointment to server');
      }

      const result = await response.json();
      // Keep referenceFile local preview on success card
      setSuccessData({
        ...result,
        referenceFile: referenceFile
      });
    } catch (error) {
      console.warn('Backend API submission failed, saving appointment locally in demo mode.', error);
      
      // Fallback: Save in local storage and simulate success response
      const simulatedResult = {
        ...payload,
        id: 'DEMO-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        referenceFile: referenceFile
      };
      
      const stored = JSON.parse(localStorage.getItem('gaurav_appointments') || '[]');
      stored.push(simulatedResult);
      localStorage.setItem('gaurav_appointments', JSON.stringify(stored));
      
      setSuccessData(simulatedResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService(SERVICES[0]);
    setReferenceFile(null);
    setSelectedFabric(FABRIC_BASES[0]);
    setSelectedRepeat(REPEAT_TYPES[0]);
    setSelectedDate("");
    setSelectedTimeSlot(TIME_SLOTS[0]);
    setContactData({ name: "", phone: "", message: "" });
    setSuccessData(null);
  };

  return (
    <section id="book-consultation" className="py-20 px-6 max-w-5xl mx-auto reveal">
      <div className="text-center mb-12">
        <span className="font-sans text-xs tracking-[0.2em] font-semibold uppercase text-[var(--primary)] mb-2 block">
          Gaurav Vastralaya Bespoke
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
          Bespoke Customization & Styling
        </h2>
        <p className="font-sans text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
          Create custom fabric prints, style personalized ensembles, or reserve an exclusive session with our master stylists.
        </p>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-lg border flex flex-col md:flex-row" style={{
        borderColor: 'rgba(var(--secondary-rgb), 0.18)',
        backgroundColor: 'var(--bg-card)'
      }}>
        
        {/* Left Informative Panel */}
        <div className="w-full md:w-2/5 p-8 md:p-12 text-white flex flex-col justify-between relative" style={{
          backgroundColor: 'var(--primary)',
          backgroundImage: 'radial-gradient(circle at bottom left, rgba(var(--secondary-rgb), 0.15) 0%, transparent 80%)'
        }}>
          <div>
            <span className="font-sans text-xs tracking-widest font-semibold uppercase text-[var(--secondary-light)] mb-2 block">
              Fabcurate & Taneira Style
            </span>
            <h3 className="font-serif text-2xl font-bold mb-6">
              Tailored Just <br />
              <span className="text-[var(--secondary)]">For You</span>
            </h3>
            
            <ul className="space-y-4 font-sans text-xs sm:text-sm font-light opacity-95">
              <li className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-[var(--secondary)] shrink-0 mt-0.5" />
                <span><strong>No MOQ:</strong> Order customized prints starting from 1 meter.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-[var(--secondary)] shrink-0 mt-0.5" />
                <span><strong>Premium Fabrics:</strong> Banarasi Silk, Giza Cotton, and Linen bases.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-[var(--secondary)] shrink-0 mt-0.5" />
                <span><strong>Expert Design Assistance:</strong> Complete guidance on repeat configurations.</span>
              </li>
            </ul>
          </div>

          <div className="border-t pt-6 mt-8 md:mt-0" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="block text-[10px] tracking-wider uppercase opacity-60 mb-2">DESIGN ASSIST LINE</span>
            <a href="tel:+919999999999" className="font-serif text-lg font-semibold flex items-center gap-2 text-[var(--secondary)] hover:underline">
              <Phone size={16} />
              <span>+91 99999 99999</span>
            </a>
          </div>
        </div>

        {/* Right Active Form Area */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
          
          {successData ? (
            /* SUCCESS TICKET SCREEN */
            <div className="flex flex-col items-center justify-center text-center py-6 animate-fade-in w-full">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white shadow-lg" style={{
                backgroundColor: 'var(--secondary)'
              }}>
                <Check size={32} />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Bespoke Design Booked!
              </h3>
              <p className="font-sans text-sm text-[var(--text-muted)] mb-6 max-w-sm">
                Your styling slot has been successfully registered. Here is your digital booking pass:
              </p>
              
              {/* Receipt Ticket */}
              <div className="w-full max-w-md rounded-2xl p-6 mb-8 text-left relative overflow-hidden" style={{
                backgroundColor: 'rgba(var(--secondary-rgb), 0.04)',
                border: '1px solid rgba(var(--secondary-rgb), 0.25)',
              }}>
                {/* Visual side notches representing a physical ticket */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[var(--bg-cream)] -translate-y-1/2 border-r border-[rgba(var(--secondary-rgb),0.25)]"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[var(--bg-cream)] -translate-y-1/2 border-l border-[rgba(var(--secondary-rgb),0.25)]"></div>
                
                <div className="border-b pb-4 mb-4 border-dashed border-[rgba(var(--secondary-rgb),0.3)]">
                  <span className="block text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-0.5">Booking ID</span>
                  <span className="font-mono font-bold text-sm text-[var(--primary)]">{successData.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="block text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">Customer Name</span>
                    <span className="font-semibold text-[var(--text-dark)]">{successData.name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">Service Category</span>
                    <span className="font-semibold text-[var(--text-dark)] truncate block">{successData.category}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">Date</span>
                    <span className="font-semibold text-[var(--text-dark)]">{successData.date}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">Time Window</span>
                    <span className="font-semibold text-[var(--text-dark)]">{successData.timeSlot}</span>
                  </div>
                </div>

                {successData.referenceFile && (
                  <div className="mt-4 pt-3 border-t border-[rgba(var(--secondary-rgb),0.1)] flex items-center gap-3">
                    <img 
                      src={successData.referenceFile.base64} 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded object-cover border border-[rgba(var(--secondary-rgb),0.2)]"
                    />
                    <div className="text-[11px]">
                      <span className="block font-medium text-[var(--text-dark)]">Attached Design Pattern</span>
                      <span className="text-[var(--text-muted)] font-mono">{successData.referenceFile.name}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={resetForm}
                className="btn-primary"
              >
                Configure New Custom Design
              </button>
            </div>
          ) : (
            /* WIZARD FLOW */
            <div>
              {/* Stepper Progress Indicator */}
              <div className="flex justify-between items-center mb-8 border-b pb-6" style={{ borderColor: 'rgba(var(--secondary-rgb), 0.1)' }}>
                {[
                  { num: 1, label: "Service" },
                  { num: 2, label: "Customizer" },
                  { num: 3, label: "Schedule" },
                  { num: 4, label: "Details" }
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{
                        backgroundColor: step >= s.num ? 'var(--primary)' : 'rgba(0,0,0,0.06)',
                        color: step >= s.num ? 'white' : 'var(--text-muted)'
                      }}
                    >
                      {s.num}
                    </div>
                    <span 
                      className="hidden sm:inline text-xs font-medium"
                      style={{ color: step >= s.num ? 'var(--text-dark)' : 'var(--text-muted)' }}
                    >
                      {s.label}
                    </span>
                    {s.num < 4 && <ChevronRight size={12} className="text-gray-300 mx-1 hidden sm:block" />}
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 mb-4 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: SERVICE CARDS */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h4 className="font-serif text-lg font-bold mb-4 text-[var(--text-dark)]">
                    Step 1: Choose Your Custom Service
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SERVICES.map((serv) => {
                      const IconComp = serv.icon;
                      const isSelected = selectedService.id === serv.id;
                      return (
                        <div 
                          key={serv.id}
                          onClick={() => setSelectedService(serv)}
                          className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-3 text-left relative overflow-hidden"
                          style={{
                            borderColor: isSelected ? 'var(--secondary)' : 'rgba(0,0,0,0.08)',
                            backgroundColor: isSelected ? 'rgba(var(--secondary-rgb), 0.03)' : 'transparent',
                            boxShadow: isSelected ? 'var(--shadow-gold)' : 'none'
                          }}
                        >
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.04)',
                              color: isSelected ? 'white' : 'var(--primary)'
                            }}
                          >
                            <IconComp size={18} />
                          </div>
                          <div>
                            <h5 className="font-serif font-bold text-sm text-[var(--text-dark)] mb-1">
                              {serv.title}
                            </h5>
                            <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                              {serv.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center">
                              <Check size={8} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CUSTOMIZER (FABRIC & PATTERN UPLOAD) */}
              {step === 2 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold mb-1 text-[var(--text-dark)]">
                      Step 2: Customize Design & Base Fabric
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] font-sans">
                      Configure your bespoke selections or upload an image.
                    </span>
                  </div>

                  {/* Drag-and-drop Image Upload Box */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-dark)]">
                      Upload Reference Design or Pattern
                    </span>
                    <input 
                      type="file" 
                      id="pattern-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    
                    {referenceFile ? (
                      <div className="p-4 rounded-xl border flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                          <img 
                            src={referenceFile.base64} 
                            alt="Preview" 
                            className="w-12 h-12 rounded object-cover border"
                          />
                          <div className="text-left font-sans">
                            <span className="block text-xs font-semibold text-[var(--text-dark)] max-w-[180px] truncate">
                              {referenceFile.name}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                              {referenceFile.size}
                            </span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setReferenceFile(null)}
                          className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-xs font-semibold"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => document.getElementById('pattern-upload').click()}
                        className="border-2 border-dashed border-gray-300 hover:border-[var(--secondary)] rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        <UploadCloud size={32} className="text-gray-400" />
                        <div>
                          <span className="text-xs font-bold block text-[var(--text-dark)]">
                            Drag & drop or Click to upload
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                            Supports PNG, JPG (Max 5MB)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fabric Base Selection */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-dark)]">
                      Choose Base Fabric Material
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {FABRIC_BASES.map((fab) => {
                        const isSelected = selectedFabric.name === fab.name;
                        return (
                          <div 
                            key={fab.name}
                            onClick={() => setSelectedFabric(fab)}
                            className="p-3 rounded-xl border text-left cursor-pointer transition-all relative"
                            style={{
                              borderColor: isSelected ? 'var(--secondary)' : 'rgba(0,0,0,0.08)',
                              backgroundColor: isSelected ? 'rgba(var(--secondary-rgb), 0.03)' : 'transparent',
                            }}
                          >
                            <span className="block text-xs font-bold text-[var(--text-dark)]">
                              {fab.name}
                            </span>
                            <span className="text-[10px] text-[var(--primary)] font-semibold font-mono block mt-0.5">
                              {fab.price}
                            </span>
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center">
                                <Check size={8} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Print repeat config */}
                  {selectedService.id === "custom_print" && (
                    <div className="flex flex-col gap-2 animate-fade-in">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-dark)]">
                        Select Printing Layout / Repeat type
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {REPEAT_TYPES.map((rep) => {
                          const isSelected = selectedRepeat.name === rep.name;
                          return (
                            <div 
                              key={rep.name}
                              onClick={() => setSelectedRepeat(rep)}
                              className="p-2.5 rounded-lg border text-center cursor-pointer transition-all"
                              style={{
                                borderColor: isSelected ? 'var(--secondary)' : 'rgba(0,0,0,0.08)',
                                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                                color: isSelected ? 'white' : 'var(--text-dark)'
                              }}
                            >
                              <span className="text-[11px] font-semibold block">
                                {rep.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: SCHEDULE */}
              {step === 3 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold mb-1 text-[var(--text-dark)]">
                      Step 3: Choose Consultation Date & Time
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] font-sans">
                      Select when you would like to consult or review designs.
                    </span>
                  </div>

                  {/* Date Picker Input */}
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
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors"
                      style={{
                        borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                        backgroundColor: 'rgba(0,0,0,0.01)'
                      }}
                    />
                  </div>

                  {/* Time slots grid */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                      <Clock size={12} className="text-[var(--secondary)]" />
                      <span>Available Time Slots</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <div 
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className="p-3.5 rounded-xl border text-center cursor-pointer transition-all font-sans text-xs font-semibold"
                            style={{
                              borderColor: isSelected ? 'var(--secondary)' : 'rgba(0,0,0,0.06)',
                              backgroundColor: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.02)',
                              color: isSelected ? 'white' : 'var(--text-dark)',
                              boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                            }}
                          >
                            {slot}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT DETAILS & SUMMARY REVIEW */}
              {step === 4 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold mb-1 text-[var(--text-dark)]">
                      Step 4: Contact Details & Design Summary
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] font-sans">
                      Provide details to register your booking pass.
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          value={contactData.name}
                          onChange={handleContactChange}
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
                          value={contactData.phone}
                          onChange={handleContactChange}
                          placeholder="+91 99999 99999"
                          className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                          style={{
                            borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                            backgroundColor: 'rgba(0,0,0,0.01)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs tracking-wider uppercase font-semibold text-[var(--text-dark)] flex items-center gap-1.5">
                        <MessageSquare size={12} className="text-[var(--secondary)]" />
                        <span>Notes / Special requests</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="2"
                        value={contactData.message}
                        onChange={handleContactChange}
                        placeholder="Please include details about color preferences, custom motifs or specific event measurements..."
                        className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors resize-none"
                        style={{
                          borderColor: 'rgba(var(--secondary-rgb), 0.25)',
                          backgroundColor: 'rgba(0,0,0,0.01)'
                        }}
                      ></textarea>
                    </div>

                    {/* Selection Summary Box */}
                    <div className="p-4 rounded-xl border text-xs text-left" style={{
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderColor: 'rgba(0,0,0,0.08)'
                    }}>
                      <h5 className="font-bold text-[var(--text-dark)] mb-2 uppercase tracking-widest text-[10px]">
                        Configuration Summary
                      </h5>
                      <div className="space-y-1.5 text-[var(--text-muted)] font-sans">
                        <div>
                          <strong>Service:</strong> {selectedService.title}
                        </div>
                        {selectedService.id === "custom_print" && (
                          <>
                            <div>
                              <strong>Fabric Base:</strong> {selectedFabric.name} ({selectedFabric.price})
                            </div>
                            <div>
                              <strong>Layout:</strong> {selectedRepeat.name}
                            </div>
                          </>
                        )}
                        {referenceFile && (
                          <div>
                            <strong>Reference File:</strong> {referenceFile.name}
                          </div>
                        )}
                        <div>
                          <strong>Scheduled:</strong> {selectedDate} @ {selectedTimeSlot}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: 'rgba(var(--secondary-rgb), 0.1)' }}>
                {step > 1 ? (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary py-2.5 px-5 flex items-center gap-1.5 text-xs"
                  >
                    <ChevronLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div> /* Spacer */
                )}

                {step < 4 ? (
                  <button 
                    type="button"
                    onClick={nextStep}
                    className="btn-primary py-2.5 px-6 flex items-center gap-1.5 text-xs text-white"
                  >
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="btn-primary py-3 px-8 flex items-center gap-1.5 text-sm font-bold text-white shadow-md"
                    style={{
                      backgroundColor: 'var(--primary)',
                      backgroundImage: 'linear-gradient(to right, var(--primary), var(--primary-light))'
                    }}
                  >
                    {isSubmitting ? (
                      <span>BOOKING...</span>
                    ) : (
                      <>
                        <span>CONFIRM BESPOKE BOOKING</span>
                        <Check size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookingForm;
