import React from 'react'
import { FiTrendingUp, FiCheckCircle, FiEye, FiUsers, FiPlus, FiArrowRight } from 'react-icons/fi'

const BusinessHero = ({ onAddListingClick, activeTab, setActiveTab }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-blue-900/40">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <FiTrendingUp className="text-blue-400" />
            LocalSpot Business Hub
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Grow Your Local Footfall & Customer Reach
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
            Put your venue, cafe, hotel, or local service in front of thousands of neighborhood explorers and ready-to-spend customers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onAddListingClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/30"
            >
              <FiPlus size={18} />
              Add Your Business
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-sm transition-all"
            >
              Manage Listings
              <FiArrowRight size={16} />
            </button>
          </div>

          {/* Value props bullets */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-blue-400 shrink-0" />
              <span>Verified Spot Badge</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-blue-400 shrink-0" />
              <span>Direct Customer Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-blue-400 shrink-0" />
              <span>Promote Deals & Offers</span>
            </div>
          </div>
        </div>

        {/* Quick highlight cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-300 mb-3">
              <FiEye size={20} />
            </div>
            <div className="text-2xl font-bold text-white">14.8k+</div>
            <div className="text-xs text-gray-300 mt-1">Monthly Discovery Views</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 mb-3">
              <FiUsers size={20} />
            </div>
            <div className="text-2xl font-bold text-white">82%</div>
            <div className="text-xs text-gray-300 mt-1">Conversion to Visit</div>
          </div>

          <div className="col-span-2 bg-gradient-to-r from-blue-600/40 to-indigo-600/30 border border-blue-400/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Fast Verification</p>
              <p className="text-sm font-bold text-white mt-0.5">Average approval in under 24 hours</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessHero
