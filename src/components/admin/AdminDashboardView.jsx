import React, { useState } from 'react'
import {
  FiArrowUpRight,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiDollarSign,
  FiEye,
  FiSearch,
  FiTag,
  FiTv,
  FiActivity,
  FiChevronRight
} from 'react-icons/fi'

const AdminDashboardView = ({
  onSelectBusinessApproval,
  onNavigateToBusinesses,
  needsAttentionList = [],
  businesses = []
}) => {
  const [timeRange, setTimeRange] = useState('7d')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Chart data for Mon - Sun
  const platformActivityData = [
    { day: 'Mon', views: 7200, searches: 9800 },
    { day: 'Tue', views: 8900, searches: 11200 },
    { day: 'Wed', views: 8200, searches: 10400 },
    { day: 'Thu', views: 12400, searches: 14800 },
    { day: 'Fri', views: 16800, searches: 21500 },
    { day: 'Sat', views: 15400, searches: 24200 },
    { day: 'Sun', views: 18200, searches: 22800 }
  ]

  // Revenue Bar data Mon - Sun
  const revenueBars = [
    { day: 'Mon', value: 3400, isWeekend: false },
    { day: 'Tue', value: 4100, isWeekend: false },
    { day: 'Wed', value: 3800, isWeekend: false },
    { day: 'Thu', value: 4900, isWeekend: false },
    { day: 'Fri', value: 7800, isWeekend: true },
    { day: 'Sat', value: 8400, isWeekend: true },
    { day: 'Sun', value: 4850, isWeekend: false }
  ]

  // Count businesses
  const totalBiz = businesses.length > 0 ? businesses.length : 3842
  const pendingBiz = businesses.filter((b) => b.status === 'Pending Review' || !b.verified).length

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Date Range Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Overview of LocalSpot platform activity and performance
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="inline-flex items-center bg-gray-100/90 p-1 rounded-2xl border border-gray-200/80 self-start sm:self-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 days' },
            { id: '30d', label: 'Last 30 days' },
            { id: '90d', label: 'Last 90 days' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setTimeRange(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === pill.id
                  ? 'bg-[#5397F6] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Business Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Business Overview</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
              METRICS / REAL-TIME
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">System directory data feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: TOTAL BUSINESSES */}
          <div
            onClick={onNavigateToBusinesses}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              TOTAL BUSINESSES
            </div>
            <div className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
              3,842
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-600">
              <FiTrendingUp size={14} />
              <span>+ 4.2% vs last period</span>
            </div>
          </div>

          {/* Card 2: ACTIVE BUSINESSES */}
          <div
            onClick={onNavigateToBusinesses}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              ACTIVE BUSINESSES
            </div>
            <div className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
              3,418
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>89% of total directory</span>
            </div>
          </div>

          {/* Card 3: PENDING BUSINESSES */}
          <div
            onClick={() => onSelectBusinessApproval && onSelectBusinessApproval('BID-09381')}
            className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                PENDING BUSINESSES
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white uppercase tracking-wider">
                NEEDS REVIEW
              </span>
            </div>
            <div className="text-3xl font-black text-amber-600">
              184
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-amber-700">
              <FiClock size={14} />
              <span>Requires moderator check</span>
            </div>
          </div>

          {/* Card 4: NEW BUSINESSES */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              NEW BUSINESSES
            </div>
            <div className="text-3xl font-black text-gray-900">
              68
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-blue-600">
              <FiArrowUpRight size={14} />
              <span>+ 12 this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Platform Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Platform Activity</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
              Weekly aggregate traffic pattern
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">Profile Views &amp; Searches</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart Box (7 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Profile Views &amp; Searches</h3>
                  <p className="text-xs text-gray-400">Direct directory views compared to keyword searches</p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-gray-600">Profile Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-gray-600">Searches</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative w-full h-56 pt-4">
                <svg
                  viewBox="0 0 600 200"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Grid horizontal lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="170" x2="600" y2="170" stroke="#f1f5f9" />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5397F6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#5397F6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill for Views */}
                  <path
                    d="M 20 150 C 90 140, 160 145, 200 135 C 260 100, 320 85, 390 70 C 440 60, 500 70, 580 45 L 580 180 L 20 180 Z"
                    fill="url(#viewsGrad)"
                  />

                  {/* Area fill for Searches */}
                  <path
                    d="M 20 130 C 90 115, 170 120, 220 100 C 280 85, 340 70, 420 50 C 480 35, 520 40, 580 28 L 580 180 L 20 180 Z"
                    fill="url(#searchGrad)"
                  />

                  {/* Line 1: Searches (Amber) */}
                  <path
                    d="M 20 130 C 90 115, 170 120, 220 100 C 280 85, 340 70, 420 50 C 480 35, 520 40, 580 28"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Line 2: Views (Blue) */}
                  <path
                    d="M 20 150 C 90 140, 160 145, 200 135 C 260 100, 320 85, 390 70 C 440 60, 500 70, 580 45"
                    fill="none"
                    stroke="#5397F6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive points */}
                  {[
                    { cx: 20, cy: 150, day: 'Mon', v: '7,200', s: '9,800' },
                    { cx: 110, cy: 140, day: 'Tue', v: '8,900', s: '11,200' },
                    { cx: 200, cy: 135, day: 'Wed', v: '8,200', s: '10,400' },
                    { cx: 290, cy: 90, day: 'Thu', v: '12,400', s: '14,800' },
                    { cx: 390, cy: 70, day: 'Fri', v: '16,800', s: '21,500' },
                    { cx: 480, cy: 65, day: 'Sat', v: '15,400', s: '24,200' },
                    { cx: 580, cy: 45, day: 'Sun', v: '18,200', s: '22,800' }
                  ].map((pt) => (
                    <g key={pt.day} className="cursor-pointer">
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r="5"
                        fill="#ffffff"
                        stroke="#5397F6"
                        strokeWidth="2.5"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Hover tooltip */}
                {hoveredPoint && (
                  <div
                    className="absolute bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-lg border border-slate-700 pointer-events-none"
                    style={{ left: `${(hoveredPoint.cx / 600) * 100}%`, top: '10px' }}
                  >
                    <span className="font-bold text-blue-300">{hoveredPoint.day}: </span>
                    <span>Views: {hoveredPoint.v} | Searches: {hoveredPoint.s}</span>
                  </div>
                )}
              </div>

              {/* Day Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-2 px-1">
                {platformActivityData.map((d) => (
                  <span key={d.day}>{d.day}</span>
                ))}
              </div>
            </div>

            {/* Bottom aggregate stat pill summary */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium">TOTAL VIEWS: </span>
                <span className="font-extrabold text-blue-600 text-sm">84,210</span>
                <span className="text-[10px] text-gray-400 ml-1.5 hidden sm:inline">
                  (Aggregated from 7 distinct geo-zones)
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">TOTAL SEARCHES: </span>
                <span className="font-extrabold text-amber-600 text-sm">124,580</span>
              </div>
            </div>
          </div>

          {/* Right Side Widgets: Popular Categories & Locations (4 cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Widget 1: Popular Categories */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Popular Categories
                </h4>
                <span className="text-[10px] font-bold text-gray-400">284 CATEGORIES</span>
              </div>

              <div className="space-y-3">
                {/* 1. Restaurants & Dining */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-800">1. Restaurants &amp; Dining</span>
                    <span className="text-blue-600">78%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                {/* 2. Health & Medical */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-800">2. Health &amp; Medical</span>
                    <span className="text-blue-500">52%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>

                {/* 3. Home Services */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-gray-800">3. Home Services</span>
                    <span className="text-blue-400">39%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '39%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Popular Locations */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Popular Locations
                </h4>
                <span className="text-[10px] font-bold text-gray-400">12 DISTRICTS</span>
              </div>

              <div className="space-y-3">
                {/* Location 1 */}
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-blue-600 shrink-0" size={14} />
                    <span className="font-bold text-gray-800">1. The Square (Downtown)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">+14%</span>
                </div>

                {/* Location 2 */}
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-blue-600 shrink-0" size={14} />
                    <span className="font-bold text-gray-800">2. Grand Orchards Market</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">+9%</span>
                </div>

                {/* Location 3 */}
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-blue-600 shrink-0" size={14} />
                    <span className="font-bold text-gray-800">3. Skyline Business Terrace</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">+6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Advertising & Revenue Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advertising Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiTv className="text-blue-600" size={18} />
                <h3 className="font-bold text-gray-900 text-base">Advertising</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase tracking-wider">
                CAMPAIGN STATUS
              </span>
            </div>

            {/* Sub metrics */}
            <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-100">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Active Campaigns</div>
                <div className="text-lg font-black text-blue-600 mt-1">142</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Impressions</div>
                <div className="text-lg font-black text-gray-900 mt-1">431.5k</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Clicks</div>
                <div className="text-lg font-black text-emerald-600 mt-1">17.7k</div>
              </div>
            </div>

            {/* Mini Trend Chart */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Advertising Performance (Impressions vs Clicks)</span>
                <span className="font-bold text-blue-600">7 Day Trend</span>
              </div>
              <div className="h-32 w-full pt-2">
                <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Smooth wave 1 */}
                  <path
                    d="M 10 70 C 80 40, 150 90, 200 45 C 260 15, 320 60, 390 30"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Smooth wave 2 */}
                  <path
                    d="M 10 85 C 90 70, 160 80, 210 65 C 270 40, 330 50, 390 40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-emerald-600" size={18} />
                <h3 className="font-bold text-gray-900 text-base">Revenue</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                FINANCIAL AUDIT
              </span>
            </div>

            {/* Sub metrics */}
            <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-100">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Ad Revenue</div>
                <div className="text-lg font-black text-gray-900 mt-1">$24,850</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Featured Listings</div>
                <div className="text-lg font-black text-gray-900 mt-1">$12,400</div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Total Revenue</div>
                <div className="text-lg font-black text-emerald-700 mt-1">$37,250</div>
              </div>
            </div>

            {/* Bar Chart Grid */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Revenue by Period</span>
                <span className="font-bold text-gray-900">Daily Monetization Grid</span>
              </div>

              <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                {revenueBars.map((bar) => {
                  const heightPct = Math.round((bar.value / 9000) * 100)
                  return (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-t-lg h-24 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            bar.isWeekend
                              ? 'bg-slate-900 shadow-sm'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{bar.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Needs Attention (Pending Queue Table) */}
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Needs Attention</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white uppercase tracking-wider">
                12 ITEMS PENDING
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Items requiring immediate administrative intervention or verification
            </p>
          </div>

          <button
            onClick={() => onSelectBusinessApproval && onSelectBusinessApproval('BID-09381')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Open Approvals Queue <FiChevronRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-100 text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">TYPE</th>
                  <th className="py-3 px-4">BUSINESS / REQUEST NAME</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">SUBMITTED DATE</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {needsAttentionList.map((item) => {
                  const isPending = item.status.includes('Pending') || item.status.includes('Review')
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* TYPE badge */}
                      <td className="py-3.5 px-4 font-semibold whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] border border-gray-200">
                          {item.type}
                        </span>
                      </td>

                      {/* BUSINESS / REQUEST NAME */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {item.name}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          {item.status}
                        </span>
                      </td>

                      {/* SUBMITTED DATE */}
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {item.submittedDate}
                      </td>

                      {/* ACTION BUTTON */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (onSelectBusinessApproval) {
                              onSelectBusinessApproval(item.targetId || 'BID-09381')
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#5397F6] text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardView
