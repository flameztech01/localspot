import React from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiBell, FiSearch, FiShield, FiUser, FiCheckCircle } from 'react-icons/fi'

const AdminHeader = ({ onMenuClick, pendingCount = 0 }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Toggle mobile sidebar */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin System Active
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notifications badge */}
        <div className="relative">
          <div className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
            <FiBell size={18} />
          </div>
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </div>

        {/* Admin profile pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
              Admin Console
              <FiCheckCircle className="text-blue-500" size={12} />
            </div>
            <div className="text-[10px] text-gray-500">Super Administrator</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
