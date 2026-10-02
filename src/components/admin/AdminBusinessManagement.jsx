import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSlash,
  FiStar,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiGrid,
  FiBriefcase
} from 'react-icons/fi'

const AdminBusinessManagement = ({
  businesses = [],
  onOpenAddBusiness,
  onSelectBusinessApproval,
  onUpdateBusinessStatus,
  onDeleteBusiness,
  onBatchAction
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recently_updated')
  const [selectedIds, setSelectedIds] = useState(['LOC-10294', 'LOC-10293', 'LOC-10292']) // preselected matching screenshot
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)

  // Unique categories & locations
  const categories = useMemo(() => {
    const list = Array.from(new Set(businesses.map((b) => b.category).filter(Boolean)))
    return ['All', ...list]
  }, [businesses])

  const locations = useMemo(() => {
    const list = Array.from(new Set(businesses.map((b) => b.location).filter(Boolean)))
    return ['All', ...list]
  }, [businesses])

  // Filter & Sort
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((b) => {
        const matchesSearch =
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (b.owner && b.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
          b.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Active' && b.status === 'Active') ||
          (statusFilter === 'Pending Review' && b.status === 'Pending Review') ||
          (statusFilter === 'Suspended' && b.status === 'Suspended') ||
          (statusFilter === 'Inactive' && b.status === 'Inactive')

        const matchesCategory =
          categoryFilter === 'All' || b.category.toLowerCase().includes(categoryFilter.toLowerCase())

        const matchesLocation =
          locationFilter === 'All' || b.location.toLowerCase().includes(locationFilter.toLowerCase())

        return matchesSearch && matchesStatus && matchesCategory && matchesLocation
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0 // default order preserves curated screenshot list
      })
  }, [businesses, searchTerm, statusFilter, categoryFilter, locationFilter, sortBy])

  // Counts for metric cards
  const totalCount = 1248 // platform metric from screenshot
  const activeCount = 1086
  const pendingCount = 42
  const suspendedCount = 120

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredBusinesses.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBusinesses.map((b) => b.id))
    }
  }

  const handleToggleRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleRunBatch = (actionType) => {
    if (onBatchAction) {
      onBatchAction(actionType, selectedIds)
    }
    if (actionType === 'clear') {
      setSelectedIds([])
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Add Business button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Business Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage businesses, listings, and their publication status across the LocalSpot directory.
          </p>
        </div>

        <button
          onClick={onOpenAddBusiness}
          className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0 self-start sm:self-auto"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Add Business</span>
        </button>
      </div>

      {/* 4 KPI Metric Cards (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Total Businesses
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {totalCount.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>+ 7.1%</span>
              <span className="text-gray-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FiBriefcase size={22} />
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Active
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {activeCount.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>+ 6.4%</span>
              <span className="text-gray-400 font-normal">of total dir. dev</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FiCheckCircle size={22} />
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div
          onClick={() => onSelectBusinessApproval && onSelectBusinessApproval('BID-09381')}
          className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pending Review
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 group-hover:scale-105 transition-transform">
              {pendingCount}
            </div>
            <div className="text-xs font-semibold text-amber-600 mt-1 flex items-center gap-1">
              <span>+ {pendingCount}</span>
              <span className="text-gray-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FiClock size={22} />
          </div>
        </div>

        {/* Card 4: Inactive / Suspended */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Inactive / Suspended
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {suspendedCount}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600">- 1.8%</span>
              <span className="text-gray-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <FiSlash size={22} />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar (Matching Frame 2150) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search businesses by name, category, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Pending Review">Status: Pending Review</option>
              <option value="Suspended">Status: Suspended</option>
              <option value="Inactive">Status: Inactive</option>
            </select>

            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 max-w-[140px] truncate"
            >
              <option value="All">Category: All</option>
              {categories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Location dropdown */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 max-w-[140px] truncate"
            >
              <option value="All">Location: All</option>
              {locations.filter((l) => l !== 'All').map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* More Filters button */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                showMoreFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter size={13} />
              <span>More Filters</span>
            </button>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="recently_updated">Sort: Recently Updated</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="name">Sort: Alphabetical</option>
            </select>
          </div>
        </div>

        {/* More Filters row if toggled */}
        {showMoreFilters && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <span className="font-bold text-gray-500">Quick Filters:</span>
            <button
              onClick={() => {
                setStatusFilter('Pending Review')
                setShowMoreFilters(false)
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold"
            >
              Pending Approvals ({pendingCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('Suspended')
                setShowMoreFilters(false)
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-semibold"
            >
              Flagged / Suspended
            </button>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('All')
                setCategoryFilter('All')
                setLocationFilter('All')
              }}
              className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Batch Action Bar (Appears when items are selected - Frame 2150) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-bold text-blue-900">
              {selectedIds.length} {selectedIds.length === 1 ? 'business' : 'businesses'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunBatch('approve')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <FiCheck size={14} />
              <span>Approve</span>
            </button>

            <button
              onClick={() => handleRunBatch('publish')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Publish</span>
            </button>

            <button
              onClick={() => handleRunBatch('suspend')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Suspend</span>
            </button>

            <button
              onClick={() => handleRunBatch('clear')}
              className="px-2.5 py-1.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Table scroll area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredBusinesses.length > 0 &&
                      selectedIds.length === filteredBusinesses.length
                    }
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Business</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    No businesses match your search filters.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => {
                  const isSelected = selectedIds.includes(biz.id)
                  const isPending = biz.status === 'Pending Review'

                  return (
                    <tr
                      key={biz.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        isSelected ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(biz.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                        />
                      </td>

                      {/* Business info (Thumbnail, Name, ID, Rating) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              biz.thumbnail ||
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={biz.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-gray-900 hover:text-blue-600 cursor-pointer truncate max-w-[200px]">
                              {biz.name}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span className="font-mono bg-gray-100 px-1 rounded text-gray-600">
                                ID: {biz.id}
                              </span>
                              <span className="flex items-center gap-0.5 font-bold text-amber-500">
                                <FiStar className="fill-amber-400" size={11} />
                                {biz.rating || '4.8'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-gray-600 font-medium whitespace-nowrap">
                        {biz.category}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FiMapPin className="text-gray-400 shrink-0" size={13} />
                          <span>{biz.location}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {biz.status === 'Active' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {biz.status === 'Pending Review' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending Review
                          </span>
                        )}
                        {biz.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Suspended
                          </span>
                        )}
                        {biz.status === 'Inactive' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap">
                        {biz.owner || 'Business Merchant'}
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {biz.created || 'Sep 25, 2026'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If pending, prominent Review button */}
                          {isPending ? (
                            <button
                              onClick={() => {
                                if (onSelectBusinessApproval) onSelectBusinessApproval(biz.id)
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-300 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-colors shadow-xs"
                            >
                              Review
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (onSelectBusinessApproval) onSelectBusinessApproval(biz.id)
                              }}
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold"
                            >
                              View
                            </button>
                          )}

                          {/* Quick menu options */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveDropdownId(activeDropdownId === biz.id ? null : biz.id)
                              }
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              aria-label="More options"
                            >
                              <FiMoreVertical size={16} />
                            </button>

                            {activeDropdownId === biz.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in">
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    if (onSelectBusinessApproval) onSelectBusinessApproval(biz.id)
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiEye size={13} className="text-gray-400" />
                                  <span>Full Details</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    if (onUpdateBusinessStatus) {
                                      const next = biz.status === 'Active' ? 'Suspended' : 'Active'
                                      onUpdateBusinessStatus(biz.id, next)
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiCheckCircle size={13} className="text-emerald-500" />
                                  <span>Toggle Status</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    if (onDeleteBusiness) onDeleteBusiness(biz.id)
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <FiTrash2 size={13} />
                                  <span>Delete Listing</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Counter Footer (Frame 2150) */}
        <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-gray-600">
          <div>
            Showing 1 to {Math.min(filteredBusinesses.length, perPage)} of {totalCount.toLocaleString()} businesses
          </div>

          <div className="flex items-center gap-2 self-center sm:self-auto">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50 text-xs"
            >
              &lt; Previous
            </button>

            {/* Page pills */}
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg bg-[#5397F6] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs flex items-center justify-center hidden sm:flex">
                3
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs flex items-center justify-center hidden sm:flex">
                4
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs flex items-center justify-center">
                84
              </button>
            </div>

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs"
            >
              Next &gt;
            </button>

            {/* 10 per page */}
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="ml-2 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold focus:outline-none"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBusinessManagement
