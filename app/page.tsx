'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [adminTab, setAdminTab] = useState('inquiries')
  const [newProduct, setNewProduct] = useState({ name: '', logo_url: '' })
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    product_interest: 'General Inquiry',
  })
  const [submitStatus, setSubmitStatus] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)

    setSupabase(createClient())

    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        setShowAdmin(window.location.hash === '#admin')
      }
      handleHashChange()
      window.addEventListener('hashchange', handleHashChange)
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
    try {
      if (!supabase) return
      if (showAdmin && isLoggedIn) {
        const response = await fetch('/api/admin/products', {
          method: 'GET',
          credentials: 'same-origin',
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result?.error || 'Unable to load products')
        setProducts(result.products || [])
        return
      }

      const { data, error } = await supabase.from('products').select('*').order('created_at')
      if (error) throw error
      setProducts(data || [])
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setSubmitError(err.message || 'Error fetching products')
    }
  }

  useEffect(() => {
    if (supabase) {
      fetchProducts()
    }
  }, [supabase])

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
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Login failed')

      setIsLoggedIn(true)
      await fetchInquiries()
      await fetchProducts()
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Inquiries for Admin
  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'GET',
        credentials: 'same-origin',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Unable to load inquiries')
      setInquiries(result.inquiries || [])
    } catch (err: any) {
      console.error('Error fetching inquiries:', err)
      setSubmitError(err.message || 'Error fetching inquiries')
    }
  }

  // Update Inquiry Status
  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Error updating inquiry')
      await fetchInquiries()
    } catch (err: any) {
      console.error('Error updating inquiry:', err)
      setSubmitError(err.message || 'Error updating inquiry')
    }
  }

  // Delete Inquiry
  const deleteInquiry = async (id: string) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Error deleting inquiry')
      await fetchInquiries()
    } catch (err: any) {
      console.error('Error deleting inquiry:', err)
      setSubmitError(err.message || 'Error deleting inquiry')
    }
  }

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.logo_url) {
      setSubmitError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          logo_url: newProduct.logo_url,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Error adding product')

      setNewProduct({ name: '', logo_url: '' })
      setSubmitStatus('Product added successfully')
      await fetchProducts()
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err: any) {
      setSubmitError(err.message || 'Error adding product')
    }
  }

  // Update Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct.name || !editingProduct.logo_url) {
      setSubmitError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editingProduct.name,
          logo_url: editingProduct.logo_url,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Error updating product')
      setEditingProduct(null)
      setSubmitStatus('Product updated successfully')
      await fetchProducts()
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err: any) {
      setSubmitError(err.message || 'Error updating product')
    }
  }

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Error deleting product')
      setSubmitStatus('Product deleted successfully')
      await fetchProducts()
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err: any) {
      setSubmitError(err.message || 'Error deleting product')
    }
  }

  // Submit Inquiry Form
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    setSubmitStatus('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Failed to submit inquiry')

      setSubmitStatus('Inquiry submitted successfully! We will contact you soon.')
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

  // Logout
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setIsLoggedIn(false)
    setAdminEmail('')
    setAdminPassword('')
    setInquiries([])
    window.location.hash = ''
  }

  if (showAdmin && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">MedGlow Pharmacy Management</p>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-amber-400"
                placeholder="pharmacymedglow@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-amber-400"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg hover:bg-amber-500 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (showAdmin && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>

          {submitStatus && (
            <div className="mb-6 p-4 bg-emerald-900/50 border border-emerald-700 text-emerald-200 rounded-lg">
              {submitStatus}
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-slate-700">
            <button
              onClick={() => setAdminTab('inquiries')}
              className={`px-6 py-3 font-medium transition ${adminTab === 'inquiries'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => setAdminTab('products')}
              className={`px-6 py-3 font-medium transition ${adminTab === 'products'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Products ({products.length})
            </button>
          </div>

          {/* Inquiries Tab */}
          {adminTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Product</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-3">{inquiry.name}</td>
                        <td className="px-6 py-3 text-blue-400">
                          <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                        </td>
                        <td className="px-6 py-3">{inquiry.product_interest}</td>
                        <td className="px-6 py-3">
                          <select
                            value={inquiry.status}
                            onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
                          >
                            <option>pending</option>
                            <option>contacted</option>
                            <option>converted</option>
                            <option>closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-3 text-slate-400 text-sm">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {adminTab === 'products' && (
            <div className="space-y-8">
              {/* Add New Product */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Logo URL (e.g., /logos/brand.png)"
                      value={newProduct.logo_url}
                      onChange={(e) => setNewProduct({ ...newProduct, logo_url: e.target.value })}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-medium transition"
                  >
                    Add Product
                  </button>
                </form>
              </div>

              {/* Products List */}
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Product Name</th>
                      <th className="px-6 py-3 text-left">Logo Preview</th>
                      <th className="px-6 py-3 text-left">Logo URL</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-3 font-medium">{product.name}</td>
                        <td className="px-6 py-3">
                          <img
                            src={product.logo_url}
                            alt={product.name}
                            className="h-12 w-auto object-contain"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-400">{product.logo_url}</td>
                        <td className="px-6 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md border border-slate-700">
                    <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                    <form onSubmit={handleUpdateProduct} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        placeholder="Logo URL"
                        value={editingProduct.logo_url}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, logo_url: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="flex-1 bg-amber-400 text-slate-950 font-semibold py-2 rounded-lg hover:bg-amber-500 transition"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="flex-1 bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Pharmacy',
            name: 'MedGlow Pharmacy',
            url: 'https://medglowpharmacy.com',
            telephone: '+977-9846774539',
            email: 'pharmacymedglow@gmail.com',
          }),
        }}
      />

      {/* Top Announcement Bar */}
      <div className="bg-amber-400 text-slate-950 text-xs font-semibold text-center py-2 px-4 shadow-sm">
        ✨ We are Open! Premium Skincare & Baby Care available in-store and for order. Fast delivery via WhatsApp.
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-06-17%20at%207.39.47%20AM-lYqHqlYkytZWfbVVX41lI2CVnioVpJ.jpeg"
              alt="MedGlow Pharmacy Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight block">
                MedGlow <span className="text-amber-400">Pharmacy</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase block -mt-1">
                Dadhikot, Suryabinayak
              </p>
            </div>
          </a>
          <div className="hidden md:flex space-x-8 font-medium text-sm text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition">
              Our Services
            </a>
            <a href="#brands" className="hover:text-amber-400 transition">
              Skincare Brands
            </a>
            <a href="#order" className="hover:text-amber-400 transition">
              How To Order
            </a>
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
        <div
          className="absolute top-1/4 left-1/10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        ></div>
        <div
          className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        ></div>

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
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-md uppercase tracking-wider">
                Now Open
              </div>
              <h3 className="text-lg font-bold mb-4 flex items-center text-amber-400">
                <i className="fas fa-store mr-2" aria-hidden="true"></i> Visit Our Premium Space
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-light">
                Precision charcoal-crafted displays hosting authentic local and imported global brands.
              </p>
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Comprehensive Pharmacy & Wellness Services
          </h2>
          <p className="text-slate-600 font-light">
            We do more than just dispense medicine. MedGlow is your community clinic partner for everyday health monitoring and expert specialized care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition group"
            >
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                Our Premium Brand Portfolio
              </h2>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Strictly committed to authenticity. We hold dynamic direct inventories of top global clinical dermatological brands and natural skincare formulations.
              </p>
              <span className="text-xs inline-block bg-slate-800 text-amber-400 px-3 py-1 rounded-md border border-slate-700 font-medium">
                100% Authentic Products
              </span>
            </div>

            {/* Brands Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:border-amber-400/40 transition h-32"
                >
                  <img
                    src={product.logo_url}
                    alt={`${product.name} logo`}
                    className="h-16 w-auto object-contain mb-2 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="text-xs font-medium text-slate-300 leading-tight">{product.name}</span>
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
      <section id="order" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-6 md:p-8 relative overflow-hidden max-w-2xl mx-auto">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl" aria-hidden="true"></div>

          <div className="text-center space-y-3 mb-8 relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 text-balance">Request a Callback / Product Inquiry</h2>
            <p className="text-slate-600 text-xs font-light">
              Fill out the form below and we&apos;ll get back to you within 24 hours with personalized recommendations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitInquiry} className="space-y-4 relative z-10">
            {submitStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                {submitStatus}
              </div>
            )}

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Interest</label>
                <select
                  value={formData.product_interest}
                  onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                >
                  <option>General Inquiry</option>
                  <option>Skincare Consultation</option>
                  <option>Blood Test Services</option>
                  <option>Baby Care Products</option>
                  <option>Product Recommendation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message *</label>
              <textarea
                placeholder="Tell us what you need..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>

          {/* Order Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 mt-8 pt-6 border-t border-slate-200">
            <a
              href="https://wa.me/9779846774539"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-lg transition text-center group"
              aria-label="Order via WhatsApp"
            >
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg mb-2 shadow-md group-hover:scale-105 transition-transform">
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-emerald-950 text-xs">WhatsApp</span>
              <span className="text-xs text-emerald-700 mt-0.5 font-medium">+977 9846774539</span>
            </a>

            <a
              href="https://www.instagram.com/medglow.pharmacy.skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-pink-50 border border-pink-200 hover:border-pink-400 rounded-lg transition text-center group"
              aria-label="Follow us on Instagram"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg mb-2 shadow-md group-hover:scale-105 transition-transform">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-purple-950 text-xs">Instagram</span>
              <span className="text-xs text-purple-700 mt-0.5 font-medium">@medglow.pharmacy.skincare</span>
            </a>

            <a
              href="https://www.tiktok.com/@medglowpharmacy.skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-lg transition text-center group"
              aria-label="Follow us on TikTok"
            >
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm mb-2 shadow-md group-hover:scale-105 transition-transform">
                <i className="fab fa-tiktok" aria-hidden="true"></i>
              </div>
              <span className="font-bold text-slate-900 text-xs">TikTok</span>
              <span className="text-xs text-slate-600 mt-0.5 font-medium">@medglowpharmacy.skincare</span>
            </a>
          </div>

          {/* Disclaimer */}
          <div className="pt-6 border-t border-slate-100 text-center relative z-10">
            <p className="text-xs text-slate-500 lowercase tracking-wide max-w-lg mx-auto leading-relaxed">
              * order can be placed for skin care and baby care only. regular health medicines and scheduled prescription drugs cannot be purchased or shipped via social media messaging or online delivery channels; please visit our physical counter in dadhikot with a certified physician prescription for medicine fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          <div className="text-center md:text-left space-y-2">
            <p className="text-white font-medium text-sm">MedGlow Pharmacy</p>
            <p className="font-light text-slate-500">Suryabinayak-4, Dadhikot, Harsha Chowk, Nepal</p>
            <p className="font-light text-slate-500">Registered Pharmacy Core Space.</p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-white font-medium text-sm">Contact Us</p>
            <p className="font-light text-slate-500">
              <a href="tel:+977-9846774539" className="hover:text-amber-400 transition">
                📞 +977 9846774539
              </a>
            </p>
            <p className="font-light text-slate-500">
              <a href="mailto:pharmacymedglow@gmail.com" className="hover:text-amber-400 transition">
                📧 pharmacymedglow@gmail.com
              </a>
            </p>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-white font-medium text-sm">Admin Access</p>
            <p className="font-light">
              <a href="#admin" className="text-amber-400 hover:text-amber-500 transition font-medium">
                Admin Portal
              </a>
            </p>
          </div>
        </div>

        <div className="text-center text-slate-500 border-t border-slate-800 pt-8 space-y-1">
          <p>&copy; 2026 MedGlow Pharmacy. All Rights Reserved.</p>
          <p className="text-[10px]">Premium SEO-Optimized Local Pharmacy Hub.</p>
        </div>
      </footer>
    </>
  )
}
