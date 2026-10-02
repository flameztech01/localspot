import React, { useState, useEffect } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import {
  AdminSidebar,
  AdminTopNav,
  AdminDashboardView,
  AdminBusinessManagement,
  AdminBusinessApproval,
  AdminAddBusinessModal,
  AdminSettings,
  AdminCategoriesView,
  AdminPromotionsView,
  AdminAdvertisementsView,
  initialAdminBusinesses,
  initialNeedsAttentionItems
} from '../../components/admin'
import Footer from '../../components/Footer'
import { FiCheckCircle } from 'react-icons/fi'

const AdminPage = ({ initialTab = 'dashboard' }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { id: routeBusinessId } = useParams()
  const navigate = useNavigate()

  // Tab state: default to 'dashboard', or 'businesses', or from URL query/prop
  const tabFromQuery = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromQuery || initialTab || 'dashboard')
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    routeBusinessId || 'BID-09381'
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Persisted Businesses
  const [businesses, setBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem('localspot_admin_businesses_v2')
      if (saved) return JSON.parse(saved)
      return initialAdminBusinesses
    } catch {
      return initialAdminBusinesses
    }
  })

  // Persisted Needs Attention items
  const [needsAttentionList, setNeedsAttentionList] = useState(() => {
    try {
      const saved = localStorage.getItem('localspot_admin_needs_attention')
      if (saved) return JSON.parse(saved)
      return initialNeedsAttentionItems
    } catch {
      return initialNeedsAttentionItems
    }
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('localspot_admin_businesses_v2', JSON.stringify(businesses))
  }, [businesses])

  useEffect(() => {
    localStorage.setItem('localspot_admin_needs_attention', JSON.stringify(needsAttentionList))
  }, [needsAttentionList])

  // Sync tab with query params
  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery)
    }
  }, [tabFromQuery])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams({ tab: newTab })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Selected business object for approval screen
  const currentBusinessForApproval =
    businesses.find((b) => b.id === selectedBusinessId) ||
    initialAdminBusinesses.find((b) => b.id === 'BID-09381')

  const handleSelectBusinessApproval = (bizId) => {
    setSelectedBusinessId(bizId)
    handleTabChange('approval')
  }

  // Approve Business
  const handleApproveBusiness = (id) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'Active', verified: true } : b
      )
    )
    setNeedsAttentionList((prev) =>
      prev.filter((item) => item.targetId !== id)
    )
    showToast('Listing approved and verified successfully!')
  }

  // Reject Business / Request Changes
  const handleRejectBusiness = (id, reason) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'Suspended', rejectionReason: reason } : b
      )
    )
    showToast('Change request sent to business merchant.')
  }

  // Update Status
  const handleUpdateBusinessStatus = (id, newStatus) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    showToast(`Status updated to "${newStatus}".`)
  }

  // Delete Business
  const handleDeleteBusiness = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this listing?')) {
      setBusinesses((prev) => prev.filter((b) => b.id !== id))
      showToast('Business listing deleted.')
    }
  }

  // Add Business
  const handleAddBusiness = (newBusiness) => {
    setBusinesses((prev) => [newBusiness, ...prev])
    showToast(`Business "${newBusiness.name}" added to directory!`)
  }

  // Batch actions
  const handleBatchAction = (actionType, ids) => {
    if (actionType === 'approve') {
      setBusinesses((prev) =>
        prev.map((b) => (ids.includes(b.id) ? { ...b, status: 'Active', verified: true } : b))
      )
      showToast(`${ids.length} businesses approved!`)
    } else if (actionType === 'publish') {
      setBusinesses((prev) =>
        prev.map((b) => (ids.includes(b.id) ? { ...b, status: 'Active' } : b))
      )
      showToast(`${ids.length} businesses published to public maps!`)
    } else if (actionType === 'suspend') {
      setBusinesses((prev) =>
        prev.map((b) => (ids.includes(b.id) ? { ...b, status: 'Suspended' } : b))
      )
      showToast(`${ids.length} businesses suspended.`)
    }
  }

  // Pending count calculation
  const pendingCount = businesses.filter(
    (b) => b.status === 'Pending Review' || !b.verified
  ).length

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col justify-between text-slate-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <FiCheckCircle className="text-emerald-400" size={17} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Navbar (with breadcrumbs and user status) */}
      <AdminTopNav
        onMenuClick={() => setSidebarOpen(true)}
        activeTab={activeTab}
        selectedBusinessId={selectedBusinessId}
        pendingCount={pendingCount}
        onGoToApprovals={() => handleTabChange('approval')}
        onTabChange={handleTabChange}
      />

      <div className="flex-1 flex w-full relative">
        {/* Admin Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenAddBusiness={() => setIsAddModalOpen(true)}
          onSelectBusinessApproval={handleSelectBusinessApproval}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingCount={pendingCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Screen 3: Admin Dashboard */}
            {activeTab === 'dashboard' && (
              <AdminDashboardView
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNavigateToBusinesses={() => handleTabChange('businesses')}
                needsAttentionList={needsAttentionList}
                businesses={businesses}
              />
            )}

            {/* Screen 1: Business Management (Frame 2150) */}
            {activeTab === 'businesses' && (
              <AdminBusinessManagement
                businesses={businesses}
                onOpenAddBusiness={() => setIsAddModalOpen(true)}
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onUpdateBusinessStatus={handleUpdateBusinessStatus}
                onDeleteBusiness={handleDeleteBusiness}
                onBatchAction={handleBatchAction}
              />
            )}

            {/* Screen 2: Business Approval / Review */}
            {activeTab === 'approval' && (
              <AdminBusinessApproval
                business={currentBusinessForApproval}
                onBack={() => handleTabChange('businesses')}
                onApprove={handleApproveBusiness}
                onReject={handleRejectBusiness}
                onToast={showToast}
              />
            )}

            {/* Sub-view: Categories */}
            {activeTab === 'categories' && <AdminCategoriesView />}

            {/* Sub-view: Promotions */}
            {activeTab === 'promotions' && <AdminPromotionsView />}

            {/* Sub-view: Advertisements */}
            {activeTab === 'advertisements' && <AdminAdvertisementsView />}

            {/* Sub-view: Featured Listings */}
            {activeTab === 'featured' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Featured Listings Queue</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Manage commercial spots requesting featured placement on home hero carousel and explore maps.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleTabChange('businesses')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    View Directory Listings
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view: Analytics */}
            {activeTab === 'analytics' && (
              <AdminDashboardView
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNavigateToBusinesses={() => handleTabChange('businesses')}
                needsAttentionList={needsAttentionList}
                businesses={businesses}
              />
            )}

            {/* Sub-view: Revenue */}
            {activeTab === 'revenue' && (
              <AdminDashboardView
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNavigateToBusinesses={() => handleTabChange('businesses')}
                needsAttentionList={needsAttentionList}
                businesses={businesses}
              />
            )}

            {/* Sub-view: Settings */}
            {activeTab === 'settings' && <AdminSettings />}

            {/* Sub-view: Support */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Admin Help &amp; Support</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  For administrative inquiries, platform moderation disputes, or API integration assistance, contact the platform operations engineering team.
                </p>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
                  <p className="font-bold">System Status: All Services Operational</p>
                  <p className="text-blue-700">Cluster: Primary Africa / US-East Multi-Region Sync</p>
                </div>
              </div>
            )}
          </main>

          {/* LocalSpot Global Footer (matching screenshot specifications) */}
          <Footer />
        </div>
      </div>

      {/* Add Business Modal */}
      <AdminAddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBusiness={handleAddBusiness}
      />
    </div>
  )
}

export default AdminPage
