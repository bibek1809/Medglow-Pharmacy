'use client'

import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Load FontAwesome
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)
  }, [])

  const brands = [
    'COSRX',
    'Purest',
    'Mamaearth',
    'Plum',
    'The Derma Co',
    'Dot & Key',
    'Minimalist',
    'The Ordinary',
    'Bioderma',
    'CeraVe',
    'Cetaphil',
  ]

  const services = [
    {
      icon: 'sparkles',
      title: 'Skin Care Consultation',
      desc: 'Get personalized regimen building and scientific analysis for acne, hyperpigmentation, hydration, or anti-aging concerns. Walk-ins and bookings are welcome.',
    },
    {
      icon: 'vial',
      title: 'Blood Test Services',
      desc: 'Quick, hygienic blood sample collection right at the pharmacy counter. Get highly reliable laboratory panel diagnostics for general wellness tracking.',
    },
    {
      icon: 'baby',
      title: 'Baby Care Essentials',
      desc: 'A safe, premium inventory explicitly tailored for sensitive baby skin, nutrition, and developmental health. Curating trusted clinical baby global lineups.',
    },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: 'MedGlow Pharmacy',
    description: 'Premium Pharmacy offering skincare, baby care, and wellness services in Dadhikot',
    url: 'https://medglowpharmacy.com',
    telephone: '+977-9846774539',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Harsha Chowk, Dadhikot',
      addressLocality: 'Suryabinayak-4',
      addressRegion: 'Kathmandu Valley',
      postalCode: '44600',
      addressCountry: 'NP',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Top Announcement Bar */}
      <div className="bg-amber-400 text-slate-950 text-xs font-semibold text-center py-2 px-4 shadow-sm">
        ✨ We are Open! Premium Skincare & Baby Care available in-store and for order. Fast delivery via WhatsApp.
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-3">
            <div className="bg-white text-slate-900 p-2.5 rounded-xl shadow-inner border border-amber-400/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight block">
                MedGlow <span className="text-amber-400">Pharmacy</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase block -mt-1">Dadhikot, Suryabinayak</p>
            </div>
          </a>
          <div className="hidden md:flex space-x-8 font-medium text-sm text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition">Our Services</a>
            <a href="#brands" className="hover:text-amber-400 transition">Skincare Brands</a>
            <a href="#order" className="hover:text-amber-400 transition">How To Order</a>
          </div>
          <a
            href="https://wa.me/9779846774539"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-500 transition shadow-lg shadow-amber-400/10 flex items-center space-x-2"
            aria-label="Chat with us on WhatsApp"
          >
            <i className="fab fa-whatsapp text-base" aria-hidden="true"></i>
            <span>Chat Now</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28 border-b border-slate-800">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Visit Us In-Store — Now Fully Open</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
              Where Medical Care Meets <span className="text-amber-400">Radiant Skin</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light">
              Experience modern clinical pharmacy care at Harsha Chowk. Premium dermatologist-recommended global skincare products, trusted baby care essentials, and expert wellness services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#order"
                className="w-full sm:w-auto bg-white text-slate-900 text-center px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition shadow-lg"
              >
                Order Skincare & Baby Care
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-center px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-700 transition"
              >
                Explore Our Services
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-8 rounded-3xl shadow-2xl relative">
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-md uppercase tracking-wider">Now Open</div>
              <h3 className="text-lg font-bold mb-4 flex items-center text-amber-400">
                <i className="fas fa-store mr-2" aria-hidden="true"></i> Visit Our Premium Space
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-light">Precision charcoal-crafted displays hosting authentic local and imported global brands.</p>
              <div className="space-y-3 text-sm border-t border-slate-700/60 pt-4 text-slate-300 font-light">
                <p>
                  <strong className="text-white font-medium">📍 Address:</strong> Suryabinayak-4, Dadhikot, Harsha Chowk
                </p>
                <p>
                  <strong className="text-white font-medium">📞 Contact:</strong> +977 9846774539
                </p>
                <p>
                  <strong className="text-white font-medium">⏰ Policy:</strong> Online order available for non-medicine ranges only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">Comprehensive Pharmacy & Wellness Services</h2>
          <p className="text-slate-600 font-light">
            We do more than just dispense medicine. MedGlow is your community clinic partner for everyday health monitoring and expert specialized care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xl mb-6 shadow-sm group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <i className={`fas fa-${service.icon}`} aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20 bg-slate-900 text-white border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">Our Premium Brand Portfolio</h2>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Strictly committed to authenticity. We hold dynamic direct inventories of top global clinical dermatological brands and natural skincare formulations.
              </p>
              <span className="text-xs inline-block bg-slate-800 text-amber-400 px-3 py-1 rounded-md border border-slate-700 font-medium">
                100% Authentic Products
              </span>
            </div>

            {/* Brands Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {brands.map((brand, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:border-amber-400/40 transition"
                >
                  <div className="h-12 w-full bg-slate-700/30 rounded flex items-center justify-center mb-2 overflow-hidden text-slate-300 font-bold text-sm">
                    {brand}
                  </div>
                  <span className="text-xs font-medium text-slate-300">{brand}</span>
                </div>
              ))}

              <div className="bg-slate-800/30 border border-dashed border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-500 italic">& Many More Regular Medicines & Hair Care Lines In-Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" aria-hidden="true"></div>

          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 text-balance">How to Place an Order</h2>
            <p className="text-slate-600 text-sm font-light">
              We offer super-fast digital ordering over your favorite social platforms. Simply send us a message with your selected skincare or baby care items!
            </p>
          </div>

          {/* Order Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
            <a
              href="https://wa.me/9779846774539"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-2xl transition text-center group"
              aria-label="Order via WhatsApp"
            >
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl mb-3 shadow-md group-hover:scale-105 transition-transform">
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-emerald-950 text-sm">WhatsApp Order</span>
              <span className="text-xs text-emerald-700 mt-1 font-medium">+977 9846774539</span>
            </a>

            <div className="flex flex-col items-center p-6 bg-pink-50 border border-pink-200 rounded-2xl text-center opacity-60 cursor-not-allowed">
              <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl mb-3 shadow-md">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-purple-950 text-sm">Instagram DM</span>
              <span className="text-xs text-purple-700 mt-1 font-medium">Coming Soon</span>
            </div>

            <div className="flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center opacity-60 cursor-not-allowed">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-sm mb-3 shadow-md border border-slate-700">
                <i className="fab fa-tiktok" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-white text-sm">TikTok Message</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 lowercase tracking-wide max-w-lg mx-auto leading-relaxed">
              * order can be placed for skin care and baby care only. regular health medicines and scheduled prescription drugs cannot be purchased or shipped via social media messaging or online delivery channels; please visit our physical counter in dadhikot with a certified physician prescription for medicine fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-2">
            <p className="text-white font-medium text-sm">MedGlow Pharmacy</p>
            <p className="font-light text-slate-500">Suryabinayak-4, Dadhikot, Harsha Chowk, Nepal</p>
            <p className="font-light text-slate-500">Registered Pharmacy Core Space.</p>
          </div>
          <div className="text-center md:text-right text-slate-500 space-y-1">
            <p>&copy; 2026 MedGlow Pharmacy. All Rights Reserved.</p>
            <p className="text-[10px]">Premium SEO-Optimized Local Pharmacy Hub.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
