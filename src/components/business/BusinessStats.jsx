import React from 'react'
import {
  FiEye,
  FiSearch,
  FiMessageSquare,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
} from 'react-icons/fi'

const statsData = [
  { id: 1, label: 'Profile Views', value: '12,480', change: '+14.2%', trend: 'up', icon: FiEye },
  { id: 2, label: 'Search Appearances', value: '8,215', change: '+8.5%', trend: 'up', icon: FiSearch },
  { id: 3, label: 'New Reviews', value: '48', change: '+2.1%', trend: 'up', icon: FiMessageSquare },
  { id: 4, label: 'Bookings / Leads', value: '324', change: '-1.4%', trend: 'down', icon: FiCalendar },
]

const BusinessStats = () => {
  return (
    <section className="w-full bg-[#FAFAFA] py-12">
      {/* Section Header (Padded) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Performance Snapshot
          </h2>
          <p className="text-sm text-neutral-500 mt-2 font-light">
            Live metrics across all your listed venues over the last 30 days.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider text-black bg-transparent border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300 self-start sm:self-auto shrink-0 uppercase">
          Download Report
          <FiArrowUpRight size={14} />
        </button>
      </div>

      {/* ========== MOBILE: Single Summarized Card ========== */}
      <div className="block md:hidden w-full">
        <div className="bg-white border-y border-neutral-200 p-6">
          <div className="grid grid-cols-2 gap-6">
            {statsData.map((stat) => {
              const Icon = stat.icon
              const TrendIcon = stat.trend === 'up' ? FiTrendingUp : FiTrendingDown
              return (
                <div key={stat.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={16} className="text-neutral-400" />
                    <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendIcon size={10} />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-semibold tracking-tighter text-black">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ========== DESKTOP: 4‑Column Grid (unchanged) ========== */}
      <div className="hidden md:grid w-full grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-200">
        {statsData.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? FiTrendingUp : FiTrendingDown

          return (
            <div
              key={stat.id}
              className="bg-white p-8 border-b border-r border-neutral-200 hover:bg-neutral-50 transition-colors duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-16">
                <Icon size={20} className="text-neutral-400 group-hover:text-black transition-colors duration-300" />
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  <TrendIcon size={14} />
                  {stat.change}
                </div>
              </div>

              <div>
                <p className="text-4xl font-semibold tracking-tighter text-black mb-2">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BusinessStats