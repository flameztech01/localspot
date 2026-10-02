import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiMapPin,
  FiStar,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiTag,
  FiPlus,
  FiAlertCircle,
} from 'react-icons/fi'

const BusinessListings = ({ listings, onEdit, onDelete, onAddNew, onPromote }) => {
  return (
    <div className="space-y-6">
      {/* Header with quick count and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Listed Spots</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your registered locations, check verification status, and update operating info.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <FiPlus size={16} />
          Add Another Location
        </button>
      </div>

      {/* Listing Cards */}
      {listings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FiMapPin size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Business Listed Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
            Get your business in front of local patrons. List your spot to appear on maps, search results, and explore feeds.
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <FiPlus size={16} />
            List Your First Business
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((place) => {
            const isVerified = place.verified !== false && place.status !== 'Pending Verification'
            const imgSrc =
              place.images?.[0] ||
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'

            return (
              <div
                key={place.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image cover + badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={imgSrc}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-800 shadow-xs">
                      {place.category}
                    </span>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold backdrop-blur-sm shadow-xs">
                          <FiCheckCircle size={12} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-semibold backdrop-blur-sm shadow-xs">
                          <FiClock size={12} />
                          In Review
                        </span>
                      )}
                    </div>

                    {/* Price tier */}
                    {place.priceLevel && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                        {place.priceLevel}
                      </span>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                        <FiStar size={12} className="fill-amber-400 text-amber-400" />
                        {place.rating || '5.0'}
                      </div>
                    </div>

                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 line-clamp-1">
                      <FiMapPin size={13} className="text-gray-400 shrink-0" />
                      {place.address}
                    </p>

                    {place.phone && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                        <FiPhone size={13} className="text-gray-400 shrink-0" />
                        {place.phone}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {place.description || 'Welcome to our venue. Check out our menu, facilities, and visit us today!'}
                    </p>

                    {/* Amenities pills */}
                    {place.amenities && place.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {place.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                        {place.amenities.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                            +{place.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/places/${place.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                      title="View public page"
                    >
                      <FiExternalLink size={15} />
                    </Link>
                    <button
                      onClick={() => onEdit(place)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                      title="Edit listing details"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(place.id)}
                      className="p-2 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove listing"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => onPromote && onPromote(place)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                  >
                    <FiTag size={13} />
                    Promote Deal
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BusinessListings
