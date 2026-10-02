import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid,
  FiCheckSquare,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiExternalLink,
  FiShield,
  FiX,
  FiLogOut,
} from 'react-icons/fi'

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  isOpen = false,
  onClose,
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Control Center',
      icon: FiGrid,
    },
    {
      id: 'approvals',
      label: 'Pending Approvals',
      icon: FiCheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      id: 'listings',
      label: 'Manage Spots',
      icon: FiMapPin,
    },
    {
      id: 'users',
      label: 'Users & Merchants',
      icon: FiUsers,
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: FiSettings,
    },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Admin Badge */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                LS
              </div>
              <div>
                <span className="font-extrabold tracking-wide text-sm text-white block">
                  LOCALSPOT
                </span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <FiShield size={10} /> Admin Suite
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Administration
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    if (onClose) onClose()
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Exit to LocalSpot</span>
            <FiExternalLink size={14} />
          </Link>
          <Link
            to="/business"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Business Portal</span>
            <FiExternalLink size={14} />
          </Link>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
