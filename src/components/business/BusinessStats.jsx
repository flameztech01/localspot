import React from 'react'
import { FiEye, FiNavigation, FiPhone, FiBookmark, FiStar, FiTrendingUp } from 'react-icons/fi'

const BusinessStats = ({ stats }) => {
  const defaultStats = [
    {
      id: 'views',
      label: 'Listing Impressions',
      value: '4,820',
      change: '+18.4%',
      isPositive: true,
      icon: FiEye,
      color: 'blue',
      sub: 'vs last 30 days',
    },
    {
      id: 'directions',
      label: 'Directions Requested',
      value: '642',
      change: '+24.1%',
      isPositive: true,
      icon: FiNavigation,
      color: 'emerald',
      sub: 'Mapped to your venue',
    },
    {
      id: 'calls',
      label: 'Phone Inquiries',
      value: '198',
      change: '+8.7%',
      isPositive: true,
      icon: FiPhone,
      color: 'indigo',
      sub: 'Direct call button clicks',
    },
    {
      id: 'saves',
      label: 'Saved to Wishlists',
      value: '315',
      change: '+32.0%',
      isPositive: true,
      icon: FiBookmark,
      color: 'amber',
      sub: 'High intent local visitors',
    },
    {
      id: 'rating',
      label: 'Average Customer Rating',
      value: '4.85',
      change: 'from 89 reviews',
      isPositive: true,
      icon: FiStar,
      color: 'purple',
      sub: '98% positive sentiment',
    },
  ]

  const items = stats || defaultStats

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {items.map((item) => {
        const Icon = item.icon || FiTrendingUp
        const style = colorStyles[item.color] || colorStyles.blue

        return (
          <div
            key={item.id || item.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2.5 rounded-xl border ${style}`}>
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {item.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-xs font-semibold ${item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.change}
                </span>
                <span className="text-xs text-gray-400">{item.sub}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BusinessStats
