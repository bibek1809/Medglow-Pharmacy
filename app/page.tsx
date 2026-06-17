'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  name: string
  logo_url: string
  type?: 'brand' | 'listing'
  created_at?: string
}

const INQUIRY_STATUSES = ['Inquiry received', 'Contacted', 'Ordered', 'Call back', 'Closed'] as const

export default function Page() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [listingIndex, setListingIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [adminTab, setAdminTab] = useState('inquiries')
  const [productTab, setProductTab] = useState<'brands' | 'listing'>('brands')
  const [newProduct, setNewProduct] = useState({ name: '', logo_url: '' })
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    product_interest: 'General Inquiry',
  })
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null)
  const [draggingInquiryId, setDraggingInquiryId] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [showInquiryModal, setShowInquiryModal] = useState(false)
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

  const checkAdminSession = async () => {
    try {
      const response = await fetch('/api/admin/session', {
        method: 'GET',
        credentials: 'same-origin',
      })

      if (!response.ok) {
        setIsLoggedIn(false)
        return false
      }

      setIsLoggedIn(true)
      await fetchInquiries()
      await fetchProducts()
      return true
    } catch (err) {
      console.error('Unable to verify admin session:', err)
      setIsLoggedIn(false)
      return false
    }
  }

  useEffect(() => {
    if (showAdmin) {
      checkAdminSession()
    }
  }, [showAdmin])

  const parseAdminResponse = async (response: Response, fallbackMessage: string) => {
    const result = await response.json().catch(() => null)
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setIsLoggedIn(false)
        throw new Error(result?.error || 'Admin session expired. Please sign in again.')
      }
      throw new Error(result?.error || fallbackMessage)
    }
    return result
  }

  // Fetch Products
  const fetchProducts = async () => {
    try {
      if (!supabase) return
      if (showAdmin && isLoggedIn) {
        const response = await fetch('/api/admin/products', {
          method: 'GET',
          credentials: 'same-origin',
        })
        const result = await parseAdminResponse(response, 'Unable to load products')
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

  const brandProducts = products.filter((product) => (product.type ?? 'brand') === 'brand')
  const listingProducts = products.filter((product) => product.type === 'listing')

  useEffect(() => {
    if (carouselIndex >= brandProducts.length) {
      setCarouselIndex(Math.max(0, brandProducts.length - 3))
    }
  }, [brandProducts.length, carouselIndex])

  useEffect(() => {
    if (listingIndex >= listingProducts.length) {
      setListingIndex(Math.max(0, listingProducts.length - 3))
    }
  }, [listingProducts.length, listingIndex])

  const hasPrevBrand = carouselIndex > 0
  const hasNextBrand = carouselIndex + 3 < brandProducts.length
  const hasPrevListing = listingIndex > 0
  const hasNextListing = listingIndex + 3 < listingProducts.length

  const visibleBrandProducts = brandProducts.slice(carouselIndex, carouselIndex + 3)
  const visibleListingProducts = listingProducts.slice(listingIndex, listingIndex + 3)

  const prevBrand = () => {
    if (hasPrevBrand) {
      setCarouselIndex(Math.max(0, carouselIndex - 1))
    }
  }

  const nextBrand = () => {
    if (hasNextBrand) {
      setCarouselIndex(carouselIndex + 1)
    }
  }

  const prevListing = () => {
    if (hasPrevListing) {
      setListingIndex(Math.max(0, listingIndex - 1))
    }
  }

  const nextListing = () => {
    if (hasNextListing) {
      setListingIndex(listingIndex + 1)
    }
  }

  const services = [
    {
      icon: 'sparkles',
      title: 'Skin care guidance',
      desc: 'Personalized skincare recommendations for hydration, glow, and sensitive skin. We help you choose effective, trusted products.',
    },
    {
      icon: 'vial',
      title: 'On-site blood testing',
      desc: 'Fast and hygienic sample collection with clear guidance on results and follow-up care. Designed for routine wellness checks.',
    },
    {
      icon: 'baby',
      title: 'Baby care essentials',
      desc: 'Curated baby-safe products for skin, hygiene, and nutrition. Reliable choices for new parents and growing families.',
    },
  ]

  // Admin Login Handler
  const handleAdminLogin = async (e: FormEvent) => {
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

      const sessionValid = await checkAdminSession()
      if (!sessionValid) {
        throw new Error('Authentication succeeded but admin session could not be verified.')
      }
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
      const result = await parseAdminResponse(response, 'Unable to load inquiries')
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
      await parseAdminResponse(response, 'Error updating inquiry')
      await fetchInquiries()
    } catch (err: any) {
      console.error('Error updating inquiry:', err)
      setSubmitError(err.message || 'Error updating inquiry')
    }
  }

  const handleInquiryDragStart = (id: string) => {
    setDraggingInquiryId(id)
  }

  const normalizeInquiryStatus = (status: string | undefined) => {
    const normalized = (status || '').toLowerCase()
    if (normalized === 'pending' || normalized === '') return 'Inquiry received'
    if (normalized === 'contacted') return 'Contacted'
    if (normalized === 'converted' || normalized === 'ordered' || normalized === 'complete' || normalized === 'completed') return 'Ordered'
    if (normalized === 'callback' || normalized === 'call back' || normalized.includes('call')) return 'Call back'
    if (normalized === 'closed') return 'Closed'
    return status || 'Inquiry received'
  }

  const handleInquiryDrop = async (id: string, status: string) => {
    if (!draggingInquiryId) return
    await updateInquiryStatus(draggingInquiryId, status)
    setDraggingInquiryId(null)
  }

  const inquiryAnalytics = INQUIRY_STATUSES.reduce((acc, status) => {
    acc[status] = inquiries.filter((item) => normalizeInquiryStatus(item.status).trim() === status).length
    return acc
  }, {} as Record<string, number>)

  const topInquiryTypes = Object.entries(
    inquiries.reduce((acc, item) => {
      const type = item.product_interest || 'General Inquiry'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const totalInquiries = inquiries.length
  const contactRate = totalInquiries ? Math.round((inquiryAnalytics['Contacted'] / totalInquiries) * 100) : 0
  const orderRate = totalInquiries ? Math.round((inquiryAnalytics['Ordered'] / totalInquiries) * 100) : 0
  const callbackCount = inquiryAnalytics['Call back'] || 0

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
      await parseAdminResponse(response, 'Error deleting inquiry')
      await fetchInquiries()
    } catch (err: any) {
      console.error('Error deleting inquiry:', err)
      setSubmitError(err.message || 'Error deleting inquiry')
    }
  }

  // Add Product
  const handleAddProduct = async (e: FormEvent) => {
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
          type: productTab === 'listing' ? 'listing' : 'brand',
        }),
      })
      await parseAdminResponse(response, 'Error adding product')

      setNewProduct({ name: '', logo_url: '' })
      setSubmitStatus('Product added successfully')
      await fetchProducts()
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err: any) {
      setSubmitError(err.message || 'Error adding product')
    }
  }

  // Update Product
  const handleUpdateProduct = async (e: FormEvent) => {
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
          type: editingProduct.type || (productTab === 'listing' ? 'listing' : 'brand'),
        }),
      })
      await parseAdminResponse(response, 'Error updating product')
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
      await parseAdminResponse(response, 'Error deleting product')
      setSubmitStatus('Product deleted successfully')
      await fetchProducts()
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err: any) {
      setSubmitError(err.message || 'Error deleting product')
    }
  }

  // Submit Inquiry Form
  const handleSubmitInquiry = async (e: FormEvent) => {
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
      setShowInquiryModal(false)
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
              <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">Inquiry analytics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {INQUIRY_STATUSES.map((status) => (
                      <div key={status} className="rounded-3xl border border-slate-700 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{status}</p>
                        <p className="mt-3 text-3xl font-semibold text-amber-400">{inquiryAnalytics[status] || 0}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300 space-y-3">
                    <p>Total inquiries: <strong className="text-white">{totalInquiries}</strong></p>
                    <p>Contact rate: <strong className="text-white">{contactRate}%</strong></p>
                    <p>Order rate: <strong className="text-white">{orderRate}%</strong></p>
                    <p>Follow-up queue: <strong className="text-white">{callbackCount}</strong> customers need callback.</p>
                  </div>
                  <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-slate-100">Top inquiry types</p>
                    <ul className="mt-3 space-y-2">
                      {topInquiryTypes.map(([type, value]) => (
                        <li key={type} className="flex items-center justify-between gap-2 text-slate-300">
                          <span>{type}</span>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-amber-400">{value}</span>
                        </li>
                      ))}
                      {topInquiryTypes.length === 0 && <li className="text-slate-500">No inquiries yet.</li>}
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">Status board</h2>
                  <div className="grid gap-4">
                    {INQUIRY_STATUSES.map((status) => (
                      <div
                        key={status}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleInquiryDrop(draggingInquiryId || '', status)}
                        className="rounded-3xl border border-slate-700 bg-slate-900 p-4 min-h-[120px]"
                      >
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{status}</p>
                        <p className="mt-2 text-2xl font-semibold text-amber-400">{inquiryAnalytics[status] || 0}</p>
                        <p className="mt-3 text-sm text-slate-500">Drop inquiries here to update their stage.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Inquiry Type</th>
                      <th className="px-6 py-3 text-left">Notes</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => {
                      const isExpanded = expandedInquiryId === inquiry.id
                      const shortMessage = inquiry.message?.length > 100 ? inquiry.message.slice(0, 100) + '...' : inquiry.message
                      return (
                        <>
                          <tr
                            key={inquiry.id}
                            draggable
                            onDragStart={() => handleInquiryDragStart(inquiry.id)}
                            className="border-t border-slate-700 hover:bg-slate-700/50 cursor-grab"
                          >
                            <td className="px-6 py-3 align-top">{inquiry.name}</td>
                            <td className="px-6 py-3 align-top text-blue-400">
                              <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                            </td>
                            <td className="px-6 py-3 align-top">{inquiry.product_interest}</td>
                            <td className="px-6 py-3 align-top max-w-xs text-sm text-slate-300 leading-relaxed">
                              <div className="space-y-2">
                                <p>{shortMessage || '—'}</p>
                                {inquiry.message && inquiry.message.length > 100 && (
                                  <button
                                    type="button"
                                    onClick={() => setExpandedInquiryId(isExpanded ? null : inquiry.id)}
                                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold"
                                  >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3 align-top">
                              <select
                                value={normalizeInquiryStatus(inquiry.status)}
                                onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
                              >
                                {INQUIRY_STATUSES.map((statusOption) => (
                                  <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-3 text-slate-400 text-sm">
                              {new Date(inquiry.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-3 align-top">
                              <button
                                onClick={() => deleteInquiry(inquiry.id)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-900 border-t border-slate-700">
                              <td colSpan={7} className="px-6 py-4 text-slate-300 text-sm leading-relaxed">
                                <strong className="text-slate-100">Full message:</strong>
                                <p className="mt-2 whitespace-pre-line">{inquiry.message}</p>
                              </td>
                            </tr>
                          )}
                    </>
                  )})}
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold">Add New Product</h2>
                  <div className="inline-flex rounded-full bg-slate-900/80 p-1 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setProductTab('brands')}
                      className={`px-4 py-2 rounded-full transition ${productTab === 'brands' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    >
                      Brand
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductTab('listing')}
                      className={`px-4 py-2 rounded-full transition ${productTab === 'listing' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    >
                      Listing
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Adding a {productTab === 'brands' ? 'brand product' : 'available listing product'} entry.
                </p>
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
                      placeholder="Image URL (e.g., /logos/dermaco.png)"
                      value={newProduct.logo_url}
                      onChange={(e) => setNewProduct({ ...newProduct, logo_url: e.target.value })}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-medium transition"
                  >
                    Add {productTab === 'brands' ? 'Brand' : 'Listing'} Product
                  </button>
                </form>
              </div>

              {/* Products List */}
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Product Name</th>
                      <th className="px-6 py-3 text-left">Image Preview</th>
                      <th className="px-6 py-3 text-left">Image URL</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product) => (product.type ?? 'brand') === (productTab === 'brands' ? 'brand' : 'listing'))
                      .map((product) => (
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
                          <td className="px-6 py-3 text-slate-300 text-sm capitalize">{(product.type ?? 'brand') === 'listing' ? 'Listing' : 'Brand'}</td>
                          <td className="px-6 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setProductTab(product.type === 'listing' ? 'listing' : 'brands')
                                  setEditingProduct(product)
                                }}
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
                        placeholder="Image URL"
                        value={editingProduct.logo_url}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, logo_url: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setProductTab('brands')
                            setEditingProduct((prev: any) => prev ? { ...prev, type: 'brand' } : prev)
                          }}
                          className={`px-4 py-2 rounded-lg transition ${productTab === 'brands' ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
                        >
                          Brand
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductTab('listing')
                            setEditingProduct((prev: any) => prev ? { ...prev, type: 'listing' } : prev)
                          }}
                          className={`px-4 py-2 rounded-lg transition ${productTab === 'listing' ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
                        >
                          Listing
                        </button>
                      </div>
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
            logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-06-17%20at%207.39.47%20AM-lYqHqlYkytZWfbVVX41lI2CVnioVpJ.jpeg',
            hasMap: 'https://maps.app.goo.gl/PgU5XyrT5geDbR3p9',
            telephone: '+977-9846774539',
            email: 'pharmacymedglow@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Suryabinayak-4, Dadhikot, Harsha Chowk',
              addressLocality: 'Dadhikot',
              addressRegion: 'Bagmati Province',
              postalCode: '44800',
              addressCountry: 'NP',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '27.6833',
              longitude: '85.3600',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '08:00',
                closes: '20:00',
              },
            ],
            sameAs: [
              'https://www.instagram.com/medglow.pharmacy.skincare',
              'https://www.tiktok.com/@medglowpharmacy.skincare',
              'https://wa.me/9779846774539',
            ],
            image: [
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-06-17%20at%207.39.47%20AM-lYqHqlYkytZWfbVVX41lI2CVnioVpJ.jpeg',
            ],
          }),
        }}
      />

      {/* Top Announcement Bar */}
      <div className="bg-amber-400 text-slate-950 text-xs font-semibold text-center py-2 px-4 shadow-sm">
        ✨ We are Open! Premium skincare & baby care in-store and online. Chat with us on WhatsApp, Instagram, or TikTok.
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
            <a href="#listing" className="hover:text-amber-400 transition">
              Available Listing
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
              <span>Open Today — Walk-ins Welcome</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
              Friendly pharmacy care for <span className="text-amber-400">skin, baby,</span> and wellbeing
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light">
              Simple guidance, trusted products, and fast support at Harsha Chowk. We help you find the right care, every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowInquiryModal(true)}
                className="w-full sm:w-auto bg-white text-slate-900 text-center px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition shadow-lg"
              >
                Start a request
              </button>
              <a
                href="#services"
                className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-center px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-700 transition"
              >
                Browse services
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-8 rounded-3xl shadow-2xl relative">
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-md uppercase tracking-wider">
                Now Open
              </div>
              <h3 className="text-lg font-bold mb-4 flex items-center text-amber-400">
                <i className="fas fa-store mr-2" aria-hidden="true"></i> Visit Our Friendly Store
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-light">
                A welcoming pharmacy space with carefully chosen authentic brands and reliable care support.
              </p>
              <div className="space-y-3 text-sm border-t border-slate-700/60 pt-4 text-slate-300 font-light">
                <p>
                  <strong className="text-white font-medium">📍 Address:</strong> Suryabinayak-4, Dadhikot, Harsha Chowk
                </p>
                <p>
                  <a
                    href="https://maps.app.goo.gl/PgU5XyrT5geDbR3p9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-white transition"
                  >
                    View on Google Maps
                  </a>
                </p>
                <p>
                  <strong className="text-white font-medium">📞 Contact:</strong> +977 9846774539
                </p>
                <p>
                  <strong className="text-white font-medium">⏰ Policy:</strong> Online ordering is available for non-prescription skincare and baby care items.
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
            Simple, trusted care for your daily health
          </h2>
          <p className="text-slate-600 font-light">
            From skincare advice to wellness checks, our team helps you pick the right products and services with confidence.
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
                Trusted brands you can rely on
              </h2>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Authentic products from trusted names, selected for safety and real results.
              </p>
              <span className="text-xs inline-block bg-slate-800 text-amber-400 px-3 py-1 rounded-md border border-slate-700 font-medium">
                Curated for you
              </span>
            </div>

            {/* Product Carousel */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6 gap-4">
                <button
                  type="button"
                  onClick={prevBrand}
                  disabled={!hasPrevBrand}
                  className="h-12 w-12 rounded-full border border-slate-700 bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400 transition"
                >
                  &lt;
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  {visibleBrandProducts.length > 0 ? (
                    visibleBrandProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:border-amber-400/40 transition h-48"
                      >
                        <img
                          src={product.logo_url}
                          alt={`${product.name} image`}
                          className="h-24 w-auto object-contain mb-3 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <span className="text-sm font-medium text-slate-200 leading-tight">{product.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-3 bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl text-slate-400 text-center">
                      No brand products available yet.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={nextBrand}
                  disabled={!hasNextBrand}
                  className="h-12 w-12 rounded-full border border-slate-700 bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400 transition"
                >
                  &gt;
                </button>
              </div>

              <div className="text-xs text-slate-400 text-right">Showing {Math.min(3, visibleBrandProducts.length)} of {brandProducts.length} brands</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Available Listing Section */}
      <section id="listing" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
                Products available right now
              </h2>
              <p className="text-slate-600 font-light text-sm leading-relaxed">
                See what’s currently in stock and ready for quick pickup or delivery. We keep this list fresh so you can order with confidence.
              </p>
              <span className="text-xs inline-block bg-slate-200 text-slate-900 px-3 py-1 rounded-md border border-slate-300 font-medium">
                Updated daily
              </span>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6 gap-4">
                <button
                  type="button"
                  onClick={prevListing}
                  disabled={!hasPrevListing}
                  className="h-12 w-12 rounded-full border border-slate-300 bg-white text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400 transition"
                >
                  &lt;
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  {visibleListingProducts.length > 0 ? (
                    visibleListingProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center justify-center text-center shadow-sm hover:shadow-md transition h-52"
                      >
                        <img
                          src={product.logo_url}
                          alt={product.name || 'product image'}
                          className="h-28 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-3 bg-white border border-slate-200 p-6 rounded-3xl text-slate-500 text-center">
                      No available listings yet.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={nextListing}
                  disabled={!hasNextListing}
                  className="h-12 w-12 rounded-full border border-slate-300 bg-white text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400 transition"
                >
                  &gt;
                </button>
              </div>

              <div className="text-xs text-slate-500 text-right">Showing {Math.min(3, visibleListingProducts.length)} of {listingProducts.length} available products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 relative overflow-hidden max-w-3xl mx-auto">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl" aria-hidden="true"></div>

          <div className="text-center space-y-4 mb-10 relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold">Consultation request</p>
            <h2 className="text-3xl font-bold text-slate-900 text-balance sm:text-4xl">
              Request professional product guidance
            </h2>
            <p className="text-slate-600 text-sm font-light max-w-2xl mx-auto">
              Share your needs with our pharmacy experts and get clear, reliable recommendations along with stock availability.
            </p>
          </div>

          <div className="grid gap-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Fast response</p>
                <p className="text-xs text-slate-500 mt-2">We reply within 24 hours with tailored recommendations.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Secure handling</p>
                <p className="text-xs text-slate-500 mt-2">Your inquiry details are treated confidentially.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Expert support</p>
                <p className="text-xs text-slate-500 mt-2">We guide you to suitable skincare, baby care, and wellness products.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInquiryModal(true)}
              className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-lg"
            >
              Open professional inquiry form
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 pt-6 border-t border-slate-200">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">Call or message</p>
              <a
                href="https://wa.me/9779846774539"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-900 text-sm font-semibold hover:text-slate-700 transition"
                aria-label="Order via WhatsApp"
              >
                <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-lg">
                  <i className="fab fa-whatsapp"></i>
                </span>
                WhatsApp
              </a>
              <p className="text-slate-500 text-xs mt-2">+977 9846774539</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">Stay connected</p>
              <a
                href="https://www.instagram.com/medglow.pharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-900 text-sm font-semibold hover:text-slate-700 transition"
                aria-label="Instagram"
              >
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-amber-400 text-white flex items-center justify-center text-lg">
                  <i className="fab fa-instagram"></i>
                </span>
                Instagram
              </a>
              <p className="text-slate-500 text-xs mt-2">@medglow.pharmacy.skincare</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">Latest updates</p>
              <a
                href="https://www.tiktok.com/@medglowpharmacy.skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-900 text-sm font-semibold hover:text-slate-700 transition"
                aria-label="TikTok"
              >
                <span className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-lg">
                  <i className="fab fa-tiktok"></i>
                </span>
                TikTok
              </a>
              <p className="text-slate-500 text-xs mt-2">@medglowpharmacy.skincare</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center relative z-10">
            <p className="text-xs text-slate-500 tracking-wide max-w-lg mx-auto leading-relaxed">
              * Orders are accepted for non-prescription skincare and baby care products only. Prescription medicines require an in-person purchase with a valid physician prescription at our Dadhikot counter. Customer data is stored securely and used solely to fulfil your request.
            </p>
          </div>
        </div>
      </section>

      {showInquiryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setShowInquiryModal(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowInquiryModal(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-100"
              aria-label="Close inquiry form"
            >
              &times;
            </button>
            <div className="p-8 md:p-10">
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold">Secure inquiry</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Professional assistance request</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 font-light">
                  Share your needs with our pharmacy experts and receive tailored product guidance, availability updates, and order support.
                </p>
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-5">
                {submitStatus && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {submitStatus}
                  </div>
                )}

                {submitError && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-900">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Full name *
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Email address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number *
                    <input
                      type="tel"
                      placeholder="+977 9846 774539"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Inquiry type
                    <select
                      value={formData.product_interest}
                      onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option>General Inquiry</option>
                      <option>Skincare Consultation</option>
                      <option>Blood Test Services</option>
                      <option>Baby Care Products</option>
                      <option>Product Recommendation</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Message *
                  <textarea
                    placeholder="Please tell us your product needs, service request, or any special details."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Your information is private and used only for this inquiry.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting inquiry...' : 'Submit inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          <div className="text-center md:text-left space-y-2">
            <p className="text-white font-medium text-sm">MedGlow Pharmacy</p>
            <p className="font-light text-slate-500">Suryabinayak-4, Dadhikot, Harsha Chowk, Nepal</p>
            <p className="font-light text-slate-500">
              <a
                href="https://maps.app.goo.gl/PgU5XyrT5geDbR3p9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                Open in Google Maps
              </a>
            </p>
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

        <div className="mt-8 border-t border-slate-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-400 text-sm">
          <div className="space-y-2">
            <p>&copy; 2026 MedGlow Pharmacy. All Rights Reserved.</p>
            <p className="text-[10px]">Trusted pharmacy services with secure customer support and professional care.</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-4">
            <a
              href="https://wa.me/9779846774539"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white text-xs font-semibold hover:bg-emerald-600 transition"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/medglow.pharmacy.skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-4 py-2 text-white text-xs font-semibold hover:opacity-90 transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" aria-hidden="true"></i>
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@medglowpharmacy.skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-white text-xs font-semibold hover:bg-slate-800 transition"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok" aria-hidden="true"></i>
              TikTok
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
