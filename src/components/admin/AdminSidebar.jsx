import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid,
  FiBriefcase,
  FiFolder,
  FiTag,
  FiTv,
  FiStar,
  FiBarChart2,
  FiDollarSign,
  FiHelpCircle,
  FiSettings,
  FiRepeat,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiX,
  FiShield,
  FiCheckSquare
} from 'react-icons/fi'

const AdminSidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  onOpenAddBusiness,
  onSelectBusinessApproval,
  isOpen = false,
  onClose,
  pendingCount = 42
}) => {
  const [expandedMenus, setExpandedMenus] = useState({
    businesses: true,
    categories: false,
    promotions: false,
    advertisements: false,
    featured: false
  })

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }))
  }

  const handleNav = (tabId) => {
    setActiveTab(tabId)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 lg:top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {/* Brand header on mobile drawer only */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100 lg:hidden">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Localspot Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="font-extrabold text-sm text-gray-900 tracking-tight">Localspot Admin</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation group */}
          <div className="p-3.5 space-y-1">
            {/* Dashboard Button */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FiGrid size={17} className={activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'} />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Businesses Accordion */}
            <div className="pt-1">
              <button
                onClick={() => {
                  toggleSubmenu('businesses')
                  handleNav('businesses')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'businesses'
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiBriefcase size={17} className={activeTab === 'businesses' ? 'text-white' : 'text-gray-400'} />
                  <span>Businesses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        activeTab === 'businesses' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                  {expandedMenus.businesses ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                </div>
              </button>

              {expandedMenus.businesses && (
                <div className="mt-1 pl-3 space-y-1">
                  {/* Business List button matching screenshot Frame 2150 */}
                  <button
                    onClick={() => handleNav('businesses')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all bg-[#5397F6] hover:bg-[#4288ec] text-white shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Business List</span>
                  </button>

                  {/* + Add Business button */}
                  <button
                    onClick={() => {
                      if (onOpenAddBusiness) onOpenAddBusiness()
                      if (onClose) onClose()
                    }}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-bold leading-none text-gray-500">+</span>
                    <span>Add Business</span>
                  </button>

                  {/* Review / Approval */}
                  <button
                    onClick={() => {
                      if (onSelectBusinessApproval) onSelectBusinessApproval('BID-09381')
                      handleNav('approval')
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      activeTab === 'approval' ? 'text-blue-700 font-bold bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span>Review / Approval</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      Needs Review
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Categories Accordion */}
            <div className="pt-1">
              <button
                onClick={() => {
                  toggleSubmenu('categories')
                  handleNav('categories')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'categories'
                    ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiFolder size={17} className={activeTab === 'categories' ? 'text-white' : 'text-gray-400'} />
                  <span>Categories</span>
                </div>
                {expandedMenus.categories ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>

              {expandedMenus.categories && (
                <div className="mt-1 pl-4 space-y-1">
                  <button
                    onClick={() => handleNav('categories')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Category List</span>
                  </button>
                  <button
                    onClick={() => handleNav('categories')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Create Category</span>
                  </button>
                  <button
                    onClick={() => handleNav('categories')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Sub Category</span>
                  </button>
                </div>
              )}
            </div>

            {/* Promotions Accordion */}
            <div className="pt-1">
              <button
                onClick={() => {
                  toggleSubmenu('promotions')
                  handleNav('promotions')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'promotions'
                    ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiTag size={17} className={activeTab === 'promotions' ? 'text-white' : 'text-gray-400'} />
                  <span>Promotions</span>
                </div>
                {expandedMenus.promotions ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>

              {expandedMenus.promotions && (
                <div className="mt-1 pl-4 space-y-1">
                  <button
                    onClick={() => handleNav('promotions')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Promotion List</span>
                  </button>
                  <button
                    onClick={() => handleNav('promotions')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Promotion Forms</span>
                  </button>
                </div>
              )}
            </div>

            {/* Advertisements Accordion */}
            <div className="pt-1">
              <button
                onClick={() => {
                  toggleSubmenu('advertisements')
                  handleNav('advertisements')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'advertisements'
                    ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiTv size={17} className={activeTab === 'advertisements' ? 'text-white' : 'text-gray-400'} />
                  <span>Advertisements</span>
                </div>
                {expandedMenus.advertisements ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>

              {expandedMenus.advertisements && (
                <div className="mt-1 pl-4 space-y-1">
                  <button
                    onClick={() => handleNav('advertisements')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Campaign List</span>
                  </button>
                  <button
                    onClick={() => handleNav('advertisements')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Campaign Forms</span>
                  </button>
                </div>
              )}
            </div>

            {/* Featured Listings */}
            <div className="pt-1">
              <button
                onClick={() => {
                  toggleSubmenu('featured')
                  handleNav('featured')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'featured'
                    ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiStar size={17} className={activeTab === 'featured' ? 'text-white' : 'text-gray-400'} />
                  <span>Featured Listings</span>
                </div>
                {expandedMenus.featured ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>

              {expandedMenus.featured && (
                <div className="mt-1 pl-4 space-y-1">
                  <button
                    onClick={() => handleNav('featured')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>Request / Management</span>
                  </button>
                </div>
              )}
            </div>

            {/* Analytics */}
            <button
              onClick={() => handleNav('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FiBarChart2 size={17} className={activeTab === 'analytics' ? 'text-white' : 'text-gray-400'} />
                <span>Analytics</span>
              </div>
            </button>

            {/* Revenue */}
            <button
              onClick={() => handleNav('revenue')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'revenue'
                  ? 'bg-[#5397F6] text-white shadow-sm shadow-[#5397F6]/30'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FiDollarSign size={17} className={activeTab === 'revenue' ? 'text-white' : 'text-gray-400'} />
                <span>Revenue</span>
              </div>
            </button>

            {/* Divider */}
            <div className="pt-3 pb-1 border-t border-gray-100 my-2">
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Support & System
              </span>
            </div>

            {/* Help & Support */}
            <button
              onClick={() => handleNav('support')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-colors`}
            >
              <FiHelpCircle size={16} className="text-gray-400" />
              <span>Help & Support</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <FiSettings size={16} className={activeTab === 'settings' ? 'text-blue-600' : 'text-gray-400'} />
              <span>Settings</span>
            </button>

            {/* Switch Account */}
            <Link
              to="/business"
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-colors"
            >
              <FiRepeat size={16} className="text-gray-400" />
              <span>Switch to Business</span>
            </Link>

            {/* Logout */}
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <FiLogOut size={16} />
              <span>Logout to Home</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Moderator / Admin Pill (Screenshots 2 & 3) */}
        <div className="p-3.5 border-t border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-amber-500 text-white shadow-xs">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs shrink-0">
              AL
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate">Alex Rivera</div>
              <div className="text-[10px] text-amber-100 font-medium truncate">Account Admin</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white/50 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
