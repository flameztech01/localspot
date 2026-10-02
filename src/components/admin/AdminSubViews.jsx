import React from 'react'
import {
  FiFolder,
  FiTag,
  FiTv,
  FiStar,
  FiBarChart2,
  FiDollarSign,
  FiPlus,
  FiExternalLink,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi'

export const AdminCategoriesView = () => {
  const categories = [
    { name: 'Restaurants & Dining', spots: 842, status: 'Active', icon: '🍽️' },
    { name: 'Cafes & Bakeries', spots: 312, status: 'Active', icon: '☕' },
    { name: 'Hotels & Lodging', spots: 198, status: 'Active', icon: '🏨' },
    { name: 'Bars & Nightlife', spots: 245, status: 'Active', icon: '🍸' },
    { name: 'Health & Wellness', spots: 164, status: 'Active', icon: '🌿' },
    { name: 'Shopping & Retail', spots: 520, status: 'Active', icon: '🛍️' }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Categories Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure primary, sub-categories and directory classification trees.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors">
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.name}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{c.name}</h4>
                <span className="text-xs text-gray-500">{c.spots} registered places</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AdminPromotionsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Promotions &amp; Deals</h2>
          <p className="text-xs text-gray-500 mt-1">
            Review active discounts, merchant coupons, and flash deals.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors">
          <FiPlus size={14} /> Create Promotion
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-900">Active Deals</span>
          <span className="text-[11px] font-bold text-gray-400">18 LIVE CAMPAIGNS</span>
        </div>
        <div className="divide-y divide-gray-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">20% Weekend Brunch Special</p>
              <p className="text-gray-500 text-[11px]">The Copper Chimney Bistro • Valid until Oct 31</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              Active
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Complimentary Welcome Drink</p>
              <p className="text-gray-500 text-[11px]">Skyline Terrace &amp; Craft Lounge • 120 claimed</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AdminAdvertisementsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Campaigns &amp; Advertisements</h2>
          <p className="text-xs text-gray-500 mt-1">
            Display banners, sponsored map markers, and top search placements.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors">
          <FiPlus size={14} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Active Banners</span>
          <div className="text-3xl font-black text-blue-600 mt-1">142</div>
          <span className="text-xs text-emerald-600 mt-1 block">+18% this month</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Impressions</span>
          <div className="text-3xl font-black text-gray-900 mt-1">431.5k</div>
          <span className="text-xs text-gray-500 mt-1 block">Live across 12 zones</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Avg CTR</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">4.1%</div>
          <span className="text-xs text-gray-500 mt-1 block">17.7k verified clicks</span>
        </div>
      </div>
    </div>
  )
}
