import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiBell, FiChevronRight, FiCheck } from 'react-icons/fi'

const AdminTopNav = ({
  onMenuClick,
  activeTab = 'dashboard',
  selectedBusinessId = 'BIZ-84920',
  pendingCount = 42,
  onGoToApprovals,
  onTabChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentModerator, setCurrentModerator] = useState({
    role: 'Moderator',
    name: 'Favour L.'
  })

  // Format business ID to match BIZ-84920 style or BID-09381
  const displayBizId = selectedBusinessId ? selectedBusinessId.replace('BID', 'BIZ') : 'BIZ-84920'

  // Render breadcrumb matching user screenshot
  const renderBreadcrumb = () => {
    if (activeTab === 'approval') {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            onClick={() => onTabChange && onTabChange('businesses')}
            className="text-gray-500 hover:text-blue-600 transition-colors font-medium cursor-pointer"
          >
            Businesses
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Approval</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold text-[11px] sm:text-xs font-mono border border-gray-200/60 shadow-2xs">
            {displayBizId}
          </span>
        </div>
      )
    }

    if (activeTab === 'businesses') {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-900 font-bold">Businesses</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Management</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] sm:text-xs font-mono border border-blue-200/60">
            DIRECTORY
          </span>
        </div>
      )
    }

    if (activeTab === 'dashboard') {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-900 font-bold">Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Overview</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] sm:text-xs font-mono border border-emerald-200/60">
            REAL-TIME
          </span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-900 font-bold capitalize">{activeTab}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 font-medium">Management</span>
      </div>
    )
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Mobile toggle, Logo & Localspot Admin, plus Breadcrumbs */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open sidebar menu"
          >
            <FiMenu size={20} />
          </button>

          {/* Logo & Localspot Admin */}
          <Link
            to="/admin"
            className="flex items-center gap-2.5 shrink-0 group select-none"
          >
            <img
              src="/logo.png"
              alt="Localspot Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight whitespace-nowrap">
              Localspot Admin
            </span>
          </Link>

          {/* Vertical divider on desktop */}
          <div className="hidden sm:block h-5 w-px bg-gray-200 shrink-0" />

          {/* Breadcrumbs: Businesses / Approval BIZ-84920 */}
          <div className="hidden sm:flex items-center truncate">
            {renderBreadcrumb()}
          </div>
        </div>

        {/* Right Section: Notification bell and Moderator badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile breadcrumb pill if sm screen */}
          <div className="sm:hidden text-xs">
            {activeTab === 'approval' && (
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold font-mono text-[10px]">
                {displayBizId}
              </span>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
              aria-label="View notifications"
            >
              <FiBell size={18} />
              {pendingCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">Notifications</span>
                  <span className="text-[10px] font-semibold text-blue-600 cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div
                    onClick={() => {
                      setShowNotifications(false)
                      if (onGoToApprovals) onGoToApprovals()
                    }}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/70 cursor-pointer transition-colors"
                  >
                    <p className="font-bold text-amber-900">New registration awaiting review</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Artisan Roasters &amp; Bakery submitted {displayBizId}
                    </p>
                    <span className="text-[9px] text-gray-400 mt-1 block">18m ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Moderator Pill matching screenshot: [Moderator] Favour L. */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <span className="px-2.5 py-1 rounded-md bg-[#d97706] text-white text-xs font-bold shadow-2xs tracking-wide">
              {currentModerator.role}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight whitespace-nowrap">
              {currentModerator.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminTopNav
