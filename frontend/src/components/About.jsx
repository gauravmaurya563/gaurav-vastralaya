import React from 'react'
import { ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react'

function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[rgba(var(--primary-rgb),0.02)] border-t border-[rgba(var(--secondary-rgb),0.1)] reveal">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Brand visual collage mock */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-6 relative">
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <div className="h-64 rounded-3xl overflow-hidden shadow-md bg-stone-300 relative">
              {/* Fallback pattern or picture */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-10"></div>
              <img 
                src="/assets/saree_premium.png" 
                alt="Boutique Details" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <div className="h-48 rounded-3xl overflow-hidden shadow-md bg-stone-300 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-10"></div>
              <img 
                src="/assets/shirting_fabric.png" 
                alt="Fabric selection" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
          
          <div className="w-full sm:w-1/2 flex items-center">
            <div className="h-80 w-full rounded-3xl overflow-hidden shadow-md bg-stone-300 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-10"></div>
              <img 
                src="/assets/suit_designer.png" 
                alt="Designer Suits" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl border hidden sm:block" style={{
            borderColor: 'rgba(var(--secondary-rgb), 0.2)'
          }}>
            <span className="font-serif text-3xl font-bold text-[var(--primary)] block">100%</span>
            <span className="font-sans text-[10px] tracking-widest font-semibold uppercase text-[var(--text-muted)]">Authentic Handloom</span>
          </div>
        </div>

        {/* Story copy */}
        <div className="w-full lg:w-1/2">
          <span className="font-sans text-xs tracking-widest font-semibold uppercase text-[var(--secondary-dark)] mb-2 block">
            OUR HERITAGE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Gaurav Vastralaya — Celebrating Weaves and Textures
          </h2>
          <p className="font-sans text-sm md:text-base font-light leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            For years, <strong>Gaurav Vastralaya</strong> has been the destination of choice for premium fabrics and ethnic wardrobe selections. Founded on the values of authenticity, quality thread count, and luxury textures, we bring you custom collections sourced directly from the finest weavers across India. 
            <br /><br />
            Whether you are searching for a breathtaking silk bridal saree, customized designer suits, executive shirting fabrics for tailored shirts, or standard ready-to-wear kurtas, we curate choices that reflect class and sophistication.
          </p>

          {/* Key pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: 'rgba(var(--secondary-rgb), 0.15)'
              }}>
                <ShieldCheck size={20} className="text-[var(--secondary-dark)]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold mb-1">Uncompromising Quality</h4>
                <p className="font-sans text-xs font-light" style={{ color: 'var(--text-muted)' }}>
                  Every piece of fabric undergoes strict inspection for thread strength and zari purity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: 'rgba(var(--secondary-rgb), 0.15)'
              }}>
                <Heart size={20} className="text-[var(--secondary-dark)]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold mb-1">Bespoke Customization</h4>
                <p className="font-sans text-xs font-light" style={{ color: 'var(--text-muted)' }}>
                  We provide expert styling tips and customization options to match your exact sizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
