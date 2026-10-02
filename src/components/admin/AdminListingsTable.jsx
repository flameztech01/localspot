import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiExternalLink,
  FiStar,
  FiMapPin,
  FiCheck,
  FiX,
} from 'react-icons/fi'

const AdminListingsTable = ({ places = [], onToggleVerify, onDeletePlace }) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(places.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [places])

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())

      const matchCategory =
        selectedCategory === 'All' || p.category === selectedCategory

      const isVerified = p.verified !== false && p.status !== 'Pending Verification'
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Verified' && isVerified) ||
        (statusFilter === 'Pending' && !isVerified)

      return matchSearch && matchCategory && matchStatus
    })
  }, [places, search, selectedCategory, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Local Spots</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Full directory of {places.length} listed places across all categories.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search by name, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-700 font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Place & Category</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No places found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((place) => {
                  const isVerified =
                    place.verified !== false && place.status !== 'Pending Verification'

                  return (
                    <tr
                      key={place.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Name & Photo */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              place.images?.[0] ||
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={place.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">
                              {place.name}
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                              {place.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-5 py-3.5 text-gray-600 max-w-xs">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <FiMapPin className="text-gray-400 shrink-0" size={12} />
                          <span className="truncate">{place.address}</span>
                        </div>
                        {place.phone && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {place.phone}
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <FiStar className="fill-amber-400 text-amber-400" size={13} />
                          {place.rating || '5.0'}
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => onToggleVerify(place.id)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <FiCheckCircle size={12} /> Verified
                            </>
                          ) : (
                            <>
                              <FiClock size={12} /> Pending
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/places/${place.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="View public page"
                          >
                            <FiExternalLink size={15} />
                          </Link>
                          <button
                            onClick={() => onDeletePlace(place.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove listing"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminListingsTable
