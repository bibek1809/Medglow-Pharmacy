'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    product_interest: 'General Inquiry',
  })
  const [submitStatus, setSubmitStatus] = useState('')
  const [submitError, setSubmitError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    // Load FontAwesome
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)

    // Check for admin hash
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        setShowAdmin(window.location.hash === '#admin')
      }
      handleHashChange()
      window.addEventListener('hashchange', handleHashChange)
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const brands = [
    { name: 'COSRX', logo: '/logos/cosrx.png' },
    { name: 'The Purest Solution', logo: '/logos/purest.png' },
    { name: 'Mamaearth', logo: '/logos/mamaearth.png' },
    { name: 'Plum', logo: '/logos/plum.png' },
    { name: 'The Derma Co', logo: '/logos/the-derma-co.png' },
    { name: 'Dot & Key', logo: '/logos/dot-key.png' },
    { name: 'Minimalist', logo: '/logos/minimalist.png' },
    { name: 'The Ordinary', logo: '/logos/the-ordinary.png' },
    { name: 'Bioderma', logo: '/logos/bioderma.png' },
    { name: 'CeraVe', logo: '/logos/cerave.png' },
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

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      })

      if (error) throw error

      setIsLoggedIn(true)
      await fetchInquiries()
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Inquiries for Admin
  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (err: any) {
      setSubmitError('Failed to fetch inquiries')
    }
  }

  // Admin Logout
  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      setAdminEmail('')
      setAdminPassword('')
      setInquiries([])
    } catch (err: any) {
      setSubmitError('Logout failed')
    }
  }

  // Handle Inquiry Form Submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    setSubmitStatus('')

    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          product_interest: formData.product_interest,
          status: 'pending',
        },
      ])

      if (error) throw error

      setSubmitStatus('Your inquiry has been submitted successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        product_interest: 'General Inquiry',
      })

      setTimeout(() => setSubmitStatus(''), 5000)
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit inquiry')
    } finally {
      setLoading(false)
    }
  }

  // Delete Inquiry
  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id)
      if (error) throw error
      await fetchInquiries()
    } catch (err: any) {
      setSubmitError('Failed to delete inquiry')
    }
  }

  // Update Inquiry Status
  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      await fetchInquiries()
    } catch (err: any) {
      setSubmitError('Failed to update status')
    }
  }

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

  // Admin Dashboard
  if (showAdmin && isLoggedIn) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Admin Dashboard */}
        <div className="min-h-screen bg-slate-900 text-white">
          {/* Admin Header */}
          <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-amber-400">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">Manage customer inquiries</p>
              </div>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-700 p-4 border-b border-slate-600">
                <h2 className="text-xl font-bold">Customer Inquiries ({inquiries.length})</h2>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No inquiries yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700 border-b border-slate-600">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Name</th>
                        <th className="px-6 py-3 text-left font-semibold">Email</th>
                        <th className="px-6 py-3 text-left font-semibold">Phone</th>
                        <th className="px-6 py-3 text-left font-semibold">Product Interest</th>
                        <th className="px-6 py-3 text-left font-semibold">Message</th>
                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                        <th className="px-6 py-3 text-left font-semibold">Date</th>
                        <th className="px-6 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                          <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                          <td className="px-6 py-4 text-amber-400">{inquiry.email}</td>
                          <td className="px-6 py-4">{inquiry.phone || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">{inquiry.product_interest}</td>
                          <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{inquiry.message}</td>
                          <td className="px-6 py-4">
                            <select
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                              className="bg-slate-600 text-white px-3 py-1 rounded text-sm border border-slate-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Admin Login Page
  if (showAdmin && !isLoggedIn) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                <p className="text-slate-400">MedGlow Pharmacy</p>
              </div>

              {submitError && (
                <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="pharmacymedglow@gmail.com"
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-400 text-slate-950 font-bold py-2 rounded-lg hover:bg-amber-500 transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center text-slate-400 text-sm mt-6">
                <a href="#" onClick={() => window.history.back()} className="text-amber-400 hover:underline">
                  Back to Website
                </a>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main Website
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
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-06-17%20at%207.39.47%20AM-lYqHqlYkytZWfbVVX41lI2CVnioVpJ.jpeg" alt="MedGlow Pharmacy Logo" className="h-12 w-auto object-contain" />
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
                  className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:border-amber-400/40 transition h-32"
                >
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="h-16 w-auto object-contain mb-2 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="text-xs font-medium text-slate-300 leading-tight">{brand.name}</span>
                </div>
              ))}

              <div className="bg-slate-800/30 border border-dashed border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-500 italic">& Many More Regular Medicines & Hair Care Lines In-Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order & Inquiry Section */}
      <section id="order" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Inquiry Form */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" aria-hidden="true"></div>

            <div className="text-center space-y-2 max-w-2xl mx-auto mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-slate-900 text-balance">Request a Callback</h2>
              <p className="text-slate-600 text-sm font-light">
                Have questions about our products or services? Fill out this form and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {submitError}
              </div>
            )}

            {submitStatus && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {submitStatus}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="max-w-3xl mx-auto space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977 9XXXXXXXXX"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Product Interest</label>
                  <select
                    value={formData.product_interest}
                    onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  >
                    <option>General Inquiry</option>
                    <option>Skincare Consultation</option>
                    <option>Blood Test Services</option>
                    <option>Baby Care Products</option>
                    <option>Specific Brand Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you're looking for..."
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? 'Submitting...' : 'Submit Your Inquiry'}
              </button>
            </form>
          </div>

          {/* Order Channels */}
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl" aria-hidden="true"></div>

            <div className="text-center space-y-2 max-w-2xl mx-auto mb-10 relative z-10">
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

              <a
                href="https://www.instagram.com/medglow.pharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-pink-50 border border-pink-200 hover:border-pink-400 rounded-2xl transition text-center group"
                aria-label="Follow us on Instagram"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <i className="fab fa-instagram" aria-hidden="true"></i>
                </div>
                <span className="font-bold text-purple-950 text-sm">Instagram DM</span>
                <span className="text-xs text-purple-700 mt-1 font-medium">@medglow.pharmacy.skincare</span>
              </a>

              <a
                href="https://www.tiktok.com/@medglowpharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-slate-200 border border-slate-300 hover:border-white rounded-2xl transition text-center group"
                aria-label="Follow us on TikTok"
              >
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-sm mb-3 shadow-md border border-slate-700 group-hover:scale-105 transition-transform">
                  <i className="fab fa-tiktok" aria-hidden="true"></i>
                </div>
                <span className="font-bold text-slate-900 text-sm">TikTok Profile</span>
                <span className="text-xs text-slate-600 mt-1 font-medium">@medglowpharmacy.skincare</span>
              </a>
            </div>

            {/* Disclaimer */}
            <div className="pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600 lowercase tracking-wide max-w-lg mx-auto leading-relaxed">
                * order can be placed for skin care and baby care only. regular health medicines and scheduled prescription drugs cannot be purchased or shipped via social media messaging or online delivery channels; please visit our physical counter in dadhikot with a certified physician prescription for medicine fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left space-y-2">
            <p className="text-white font-medium text-sm">MedGlow Pharmacy</p>
            <p className="font-light text-slate-500">Suryabinayak-4, Dadhikot, Harsha Chowk, Nepal</p>
            <p className="font-light text-slate-500">Registered Pharmacy Core Space.</p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-white font-medium text-sm">Contact Us</p>
            <p className="font-light text-slate-400">
              <a href="https://wa.me/9779846774539" className="hover:text-amber-400 transition">+977 9846774539</a>
            </p>
            <p className="font-light">
              <a href="mailto:pharmacymedglow@gmail.com" className="hover:text-amber-400 transition">pharmacymedglow@gmail.com</a>
            </p>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-white font-medium text-sm">Follow Us</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="https://www.instagram.com/medglow.pharmacy.skincare" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@medglowpharmacy.skincare" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p>&copy; 2026 MedGlow Pharmacy. All Rights Reserved.</p>
          <p className="text-[10px] mt-2 text-slate-600">Premium SEO-Optimized Local Pharmacy Hub. <a href="#admin" className="text-amber-400 hover:underline">Admin</a></p>
        </div>
      </footer>
    </>
  )
}
