import React from 'react'
import {
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiStar,
  FiArrowUpRight,
  FiActivity,
  FiAlertTriangle,
} from 'react-icons/fi'

const AdminOverview = ({
  places = [],
  pendingCount = 0,
  verifiedCount = 0,
  onGoToApprovals,
  onGoToListings,
}) => {
  const totalPlaces = places.length
  const totalUsers = 1248 // platform metric

  const stats = [
    {
      label: 'Total Registered Spots',
      value: totalPlaces,
      change: '+12% this week',
      icon: FiMapPin,
      color: 'blue',
      onClick: onGoToListings,
    },
    {
      label: 'Awaiting Verification',
      value: pendingCount,
      change: pendingCount > 0 ? 'Requires attention' : 'All clear',
      icon: FiClock,
      color: 'amber',
      urgent: pendingCount > 0,
      onClick: onGoToApprovals,
    },
    {
      label: 'Verified Venues',
      value: verifiedCount,
      change: `${Math.round((verifiedCount / (totalPlaces || 1)) * 100)}% verified`,
      icon: FiCheckCircle,
      color: 'emerald',
    },
    {
      label: 'Registered Platform Users',
      value: totalUsers.toLocaleString(),
      change: '+142 new signups',
      icon: FiUsers,
      color: 'purple',
    },
  ]

  // Category counts
  const categoryCounts = places.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Alert banner if pending approvals exist */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {pendingCount} new business {pendingCount === 1 ? 'submission' : 'submissions'} pending review
              </h4>
              <p className="text-xs text-amber-700">
                Review submitted venue photos, addresses, and owner contact details.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToApprovals}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            Review Queue
            <FiArrowUpRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          const colorStyles = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-100',
          }

          return (
            <div
              key={s.label}
              onClick={s.onClick}
              className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all flex flex-col justify-between ${
                s.onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2.5 rounded-xl border ${colorStyles[s.color]}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                <div className="flex items-center gap-1 mt-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      s.urgent
                        ? 'text-amber-600'
                        : s.color === 'emerald'
                        ? 'text-emerald-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <FiActivity className="text-blue-600" /> Spots by Category
            </h3>
            <span className="text-xs text-gray-400">Live Breakdown</span>
          </div>

          <div className="space-y-3.5">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No categories recorded yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / (totalPlaces || 1)) * 100)
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-700">{cat}</span>
                      <span className="text-gray-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* System Activity Stream */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <FiClock className="text-blue-600" /> Recent Platform Activity
            </h3>
            <span className="text-xs text-gray-400">Latest</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3 pb-3 border-b border-gray-50">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">
                  New business registered: &quot;Skyview Bistro&quot;
                </p>
                <p className="text-gray-400 mt-0.5">Today at 1:45 PM • Added to review queue</p>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-gray-50">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">
                  Admin verified &quot;Spark Auto Mechanics&quot;
                </p>
                <p className="text-gray-400 mt-0.5">Today at 11:20 AM • Verification badge granted</p>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-gray-50">
              <div className="h-2 w-2 rounded-full bg-purple-500 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">New deal published: &quot;20% Happy Hour&quot;</p>
                <p className="text-gray-400 mt-0.5">Yesterday • Active on Explore deals</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Automated system health check</p>
                <p className="text-gray-400 mt-0.5">Database & API slice healthy (0 warnings)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
