import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiHeart, FiCheck } from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

const categoryFallbackImages = {
  Hotels: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  Restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'Local Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'Bars & Lounges': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  'Parks & Recs': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
  Cafes: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  Shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  'Beauty & Wellness': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  Services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
}

const PlaceCard = ({ place, isSaved = false, onToggleSave }) => {
  const [imgError, setImgError] = useState(false)

  const imgSrc =
    !imgError && place.images && place.images.length > 0
      ? place.images[0]
      : categoryFallbackImages[place.category] ||
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'

  const isVerified = place.verified !== false
  const isOpen =
    place.openingHoursText?.toLowerCase().includes('open') ||
    place.openingHoursText?.toLowerCase().includes('24/7')

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {/* Verified Badge */}
          {isVerified ? (
            <span className="pointer-events-auto flex items-center gap-1 bg-[#06B6D4]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
              <FiCheck size={12} className="stroke-[3]" />
              Verified
            </span>
          ) : (
            <span />
          )}

          {/* Heart favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onToggleSave) onToggleSave(place.id)
            }}
            aria-label={isSaved ? 'Remove from favorites' : 'Save place'}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm transition-transform active:scale-90 hover:bg-white hover:text-red-500"
          >
            {isSaved ? (
              <FaHeart size={13} className="text-red-500" />
            ) : (
              <FiHeart size={13} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Title */}
        <Link
          to={`/details/${place.id}`}
          className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors"
          title={place.name}
        >
          {place.name}
        </Link>

        {/* Subtitle / Category */}
        <p className="mt-1 text-xs text-gray-500 font-medium line-clamp-1">
          {place.category || 'Spot'} • {place.subCategory || 'Popular'}
          {place.priceLevel ? ` • ${place.priceLevel}` : ''}
        </p>

        {/* Location & Distance */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <FiMapPin size={13} className="text-gray-400 shrink-0" />
          <span className="truncate">
            {place.location?.address || place.location?.city || 'Port Harcourt'}
            {place.distance ? ` (${place.distance})` : ''}
          </span>
        </div>

        {/* Rating & Reviews */}
        <div className="mt-2 flex items-center gap-1 text-xs">
          <FaStar size={12} className="text-amber-400" />
          <span className="font-bold text-gray-900">
            {place.rating?.average?.toFixed(1) || '4.5'}
          </span>
          <span className="text-gray-400">
            ({place.rating?.totalReviews || 120})
          </span>
        </div>

        {/* Hours / Status */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs">
          <span
            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              isOpen ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span
            className={`truncate font-medium ${
              isOpen ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            {place.openingHoursText || (isOpen ? 'Open now' : 'Closed')}
          </span>
        </div>

        {/* Bottom Details Button */}
        <div className="mt-4 pt-1">
          <Link
            to={`/details/${place.id}`}
            className="block w-full rounded-lg border border-gray-200 bg-white py-2 text-center text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PlaceCard
