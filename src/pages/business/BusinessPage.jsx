import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  BusinessHero,
  BusinessStats,
  BusinessListings,
  BusinessListingForm,
  BusinessDeals,
  BusinessReviews,
} from '../../components/business'
import {
  FiGrid,
  FiMapPin,
  FiTag,
  FiMessageSquare,
  FiPlus,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi'

const defaultListings = [
  {
    id: 'biz-1',
    name: 'The Copper Chimney Bistro',
    category: 'Restaurants',
    address: 'Issac John St, GRA Phase 2, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 803 234 5678',
    website: 'https://copperchimney.com',
    priceLevel: '$$$',
    openingHoursText: '07:00 AM - 11:00 PM',
    rating: 4.9,
    reviewsCount: 256,
    verified: true,
    status: 'Verified',
    description:
      'Contemporary Continental and authentic fusion restaurant in the heart of GRA. Ideal for intimate dinners, celebrations, and corporate dining.',
    amenities: ['Free Wi-Fi', 'Parking Space', 'Outdoor Seating', 'Air Conditioning', 'Accepts Cards / POS'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'biz-2',
    name: 'Skyline Terrace & Craft Lounge',
    category: 'Bars & Lounges',
    address: 'Allen Avenue, Rumuosi, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 812 999 8888',
    website: 'https://skylineterrace.ng',
    priceLevel: '$$',
    openingHoursText: '04:00 PM - 02:00 AM',
    rating: 4.7,
    reviewsCount: 315,
    verified: false,
    status: 'Pending Verification',
    description:
      'Elevated rooftop experience featuring handcrafted cocktails, ambient sunset views, and live DJ sets every weekend.',
    amenities: ['Outdoor Seating', 'Live Music / Events', 'Accepts Cards / POS'],
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    ],
  },
]

const BusinessPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('localspot_business_places')
      return saved ? JSON.parse(saved) : defaultListings
    } catch {
      return defaultListings
    }
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    localStorage.setItem('localspot_business_places', JSON.stringify(listings))
  }, [listings])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingPlace(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (place) => {
    setEditingPlace(place)
    setIsFormOpen(true)
  }

  const handleSavePlace = (savedPlace) => {
    if (editingPlace) {
      setListings((prev) =>
        prev.map((item) => (item.id === savedPlace.id ? savedPlace : item))
      )
      showToast('Business listing updated successfully!')
    } else {
      setListings((prev) => [savedPlace, ...prev])
      showToast('Business submitted! It will appear after quick verification.')
    }
  }

  const handleDeletePlace = (id) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      setListings((prev) => prev.filter((p) => p.id !== id))
      showToast('Listing removed.')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    {
      id: 'listings',
      label: 'My Listings',
      icon: FiMapPin,
      badge: listings.length,
    },
    { id: 'deals', label: 'Deals & Offers', icon: FiTag },
    { id: 'reviews', label: 'Reviews', icon: FiMessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <BusinessHero
          onAddListingClick={handleOpenAdd}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold transition-all shrink-0 self-start sm:self-auto"
          >
            <FiPlus size={16} />
            Add New Location
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Performance Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Performance Snapshot</h2>
                  <p className="text-xs text-gray-500">Live audience metrics for your venues</p>
                </div>
              </div>
              <BusinessStats />
            </div>

            {/* Quick Listings View */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your Locations</h3>
                  <p className="text-xs text-gray-500">Manage spots and verification</p>
                </div>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  View All ({listings.length}) <FiArrowRight size={14} />
                </button>
              </div>

              <BusinessListings
                listings={listings.slice(0, 3)}
                onEdit={handleOpenEdit}
                onDelete={handleDeletePlace}
                onAddNew={handleOpenAdd}
                onPromote={() => setActiveTab('deals')}
              />
            </div>

            {/* Deals & Reviews row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
              <BusinessDeals places={listings} />
              <BusinessReviews />
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <BusinessListings
            listings={listings}
            onEdit={handleOpenEdit}
            onDelete={handleDeletePlace}
            onAddNew={handleOpenAdd}
            onPromote={() => setActiveTab('deals')}
          />
        )}

        {activeTab === 'deals' && <BusinessDeals places={listings} />}

        {activeTab === 'reviews' && <BusinessReviews />}
      </main>

      {/* Listing Form Modal */}
      <BusinessListingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePlace}
        initialData={editingPlace}
      />

      <Footer />
    </div>
  )
}

export default BusinessPage
