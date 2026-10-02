import React, { useState, useEffect } from 'react'
import {
  AdminSidebar,
  AdminHeader,
  AdminOverview,
  AdminPendingApprovals,
  AdminListingsTable,
  AdminUsersTable,
  AdminSettings,
} from '../../components/admin'
import { FiCheckCircle } from 'react-icons/fi'

const defaultAdminPlaces = [
  {
    id: 'adm-1',
    name: 'The Copper Chimney Bistro',
    category: 'Restaurants',
    address: 'Issac John St, GRA Phase 2, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 803 234 5678',
    priceLevel: '$$$',
    rating: 4.9,
    verified: true,
    status: 'Verified',
    description: 'Contemporary Continental and fusion restaurant in GRA.',
    amenities: ['Free Wi-Fi', 'Parking Space', 'Outdoor Seating', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'adm-2',
    name: 'Grand Crestview Hotel & Suites',
    category: 'Hotels',
    address: 'Mobolaji Bank Anthony, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 802 111 2233',
    priceLevel: '$$$$',
    rating: 4.6,
    verified: true,
    status: 'Verified',
    description: 'Luxury boutique lodging with premium suites and executive lounge.',
    amenities: ['Free Wi-Fi', 'Swimming Pool', 'Fitness Center', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'adm-3',
    name: 'Skyline Terrace & Craft Lounge',
    category: 'Bars & Lounges',
    address: 'Allen Avenue, Rumuosi, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 812 999 8888',
    priceLevel: '$$',
    rating: 4.7,
    verified: false,
    status: 'Pending Verification',
    description: 'Rooftop cocktail lounge and nightlife terrace overlooking the city.',
    amenities: ['Outdoor Seating', 'Live Music / Events', 'Accepts Cards / POS'],
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'adm-4',
    name: 'Serenity Botanical Spa & Wellness',
    category: 'Beauty & Wellness',
    address: 'Aromire Avenue, Off Elekahia, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 809 333 4455',
    priceLevel: '$$$',
    rating: 4.8,
    verified: false,
    status: 'Pending Verification',
    description: 'Holistic massage, sauna, hydrotherapy, and organic skin care treatments.',
    amenities: ['Parking Space', 'Air Conditioning', 'Accepts Cards / POS'],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'adm-5',
    name: 'Spark Auto Mechanics & Diagnostics',
    category: 'Services',
    address: '5 Trans-Amadi Road, Port Harcourt',
    city: 'Port Harcourt',
    phone: '+234 803 555 7788',
    priceLevel: '$$',
    rating: 4.9,
    verified: true,
    status: 'Verified',
    description: 'Certified computerized automobile diagnosis, engine servicing, and bodywork.',
    amenities: ['Parking Space', 'Accepts Cards / POS'],
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    ],
  },
]

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [places, setPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem('localspot_admin_places')
      if (saved) return JSON.parse(saved)

      // Also merge any business places if available
      const bizPlaces = localStorage.getItem('localspot_business_places')
      if (bizPlaces) {
        const parsed = JSON.parse(bizPlaces)
        const combined = [...parsed]
        defaultAdminPlaces.forEach((dp) => {
          if (!combined.find((p) => p.name === dp.name)) {
            combined.push(dp)
          }
        })
        return combined
      }
      return defaultAdminPlaces
    } catch {
      return defaultAdminPlaces
    }
  })

  useEffect(() => {
    localStorage.setItem('localspot_admin_places', JSON.stringify(places))
  }, [places])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Pending queue
  const pendingPlaces = places.filter(
    (p) => !p.verified || p.status === 'Pending Verification'
  )

  const verifiedPlaces = places.filter(
    (p) => p.verified && p.status !== 'Pending Verification'
  )

  const handleApprove = (id) => {
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, verified: true, status: 'Verified' } : p
      )
    )
    showToast('Spot approved and marked as Verified!')
  }

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this submission?')) {
      setPlaces((prev) => prev.filter((p) => p.id !== id))
      showToast('Submission rejected and removed.')
    }
  }

  const handleToggleVerify = (id) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const willBeVerified = !p.verified
          return {
            ...p,
            verified: willBeVerified,
            status: willBeVerified ? 'Verified' : 'Pending Verification',
          }
        }
        return p
      })
    )
    showToast('Listing verification status toggled.')
  }

  const handleDeletePlace = (id) => {
    if (window.confirm('Delete this place permanently from LocalSpot directory?')) {
      setPlaces((prev) => prev.filter((p) => p.id !== id))
      showToast('Place deleted.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingPlaces.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          pendingCount={pendingPlaces.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <AdminOverview
              places={places}
              pendingCount={pendingPlaces.length}
              verifiedCount={verifiedPlaces.length}
              onGoToApprovals={() => setActiveTab('approvals')}
              onGoToListings={() => setActiveTab('listings')}
            />
          )}

          {activeTab === 'approvals' && (
            <AdminPendingApprovals
              pendingPlaces={pendingPlaces}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === 'listings' && (
            <AdminListingsTable
              places={places}
              onToggleVerify={handleToggleVerify}
              onDeletePlace={handleDeletePlace}
            />
          )}

          {activeTab === 'users' && <AdminUsersTable />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  )
}

export default AdminPage
