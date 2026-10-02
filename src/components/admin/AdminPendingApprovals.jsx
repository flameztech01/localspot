import React from 'react'
import {
  FiCheck,
  FiX,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
} from 'react-icons/fi'

const AdminPendingApprovals = ({ pendingPlaces = [], onApprove, onReject }) => {
  if (pendingPlaces.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Verification Queue is Empty</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
          All submitted local businesses and spots have been reviewed. New submissions from merchants will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pending Business Submissions</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review merchant venue submissions before approving them to appear on public maps.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          {pendingPlaces.length} Waiting
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingPlaces.map((place) => {
          const imgSrc =
            place.images?.[0] ||
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'

          return (
            <div
              key={place.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo & quick info header */}
                <div className="relative h-44 w-full bg-gray-100">
                  <img
                    src={imgSrc}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 shadow-xs">
                      {place.category}
                    </span>
                    {place.priceLevel && (
                      <span className="px-2 py-1 rounded-md bg-black/60 text-white text-xs font-bold">
                        {place.priceLevel}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                    Pending Verification
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {place.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-gray-400 shrink-0" size={14} />
                      <span className="font-medium text-gray-800">{place.address}</span>
                    </p>
                    {place.phone && (
                      <p className="flex items-center gap-2">
                        <FiPhone className="text-gray-400 shrink-0" size={14} />
                        <span>{place.phone}</span>
                      </p>
                    )}
                    {place.openingHoursText && (
                      <p className="flex items-center gap-2">
                        <FiClock className="text-gray-400 shrink-0" size={14} />
                        <span>{place.openingHoursText}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    {place.description || 'No description provided.'}
                  </p>

                  {/* Amenities */}
                  {place.amenities && place.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {place.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onReject(place.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:text-rose-600 hover:border-rose-300 hover:bg-white text-xs font-semibold transition-all"
                >
                  <FiX size={15} />
                  Reject
                </button>

                <button
                  onClick={() => onApprove(place.id)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-emerald-600/30 transition-all"
                >
                  <FiCheck size={16} />
                  Approve & Verify Place
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPendingApprovals
