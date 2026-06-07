import React from 'react'

function Hero() {
  return (
    <section className="bg-white pt-4 pb-4 px-4 w-full">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between rounded-sm overflow-hidden" style={{ backgroundColor: '#2874f0', minHeight: '300px' }}>
        
        {/* Left Content */}
        <div className="p-8 md:p-12 flex-1 text-white z-10">
          <span className="bg-white text-[#2874f0] text-xs font-bold px-2 py-1 rounded-sm mb-4 inline-block">
            NEW COLLECTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Bespoke Indian Couture
          </h1>
          <p className="text-white/90 text-sm sm:text-base mb-8 max-w-lg">
            Discover our handpicked collections of Fancy Sarees, Designer Suits, and Bespoke Shirting. Free styling session available.
          </p>
          <div className="flex gap-4">
            <a href="#catalog" className="bg-white text-[#2874f0] px-6 py-3 font-bold text-sm rounded-sm hover:shadow-lg transition-shadow">
              Shop Now
            </a>
          </div>
        </div>

        {/* Right Image/Graphic area */}
        <div className="flex-1 w-full h-full min-h-[250px] md:min-h-[300px] bg-cover bg-center" style={{ 
          backgroundImage: 'url(/assets/hero_bg.png)',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
        }}>
        </div>
      </div>
    </section>
  )
}

export default Hero
