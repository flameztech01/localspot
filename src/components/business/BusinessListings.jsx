import React, { useState, useEffect } from 'react'
import {
  FiMapPin,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiChevronRight,
  FiX,
} from 'react-icons/fi'

const defaultListings = [
  {
    id: 'biz-1',
    name: 'The Copper Chimney Bistro',
    category: 'Restaurants',
    address: 'Issac John St, GRA Phase 2, Port Harcourt',
    rating: 4.9,
    reviewsCount: 256,
    verified: true,
    status: 'Verified',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400',
    description: 'Contemporary Continental and authentic fusion restaurant in the heart of GRA.',
    phone: '+234 803 234 5678',
    hours: '07:00 AM - 11:00 PM',
  },
  {
    id: 'biz-2',
    name: 'Skyline Terrace & Craft Lounge',
    category: 'Bars & Lounges',
    address: 'Allen Avenue, Rumuosi, Port Harcourt',
    rating: 4.7,
    reviewsCount: 315,
    verified: false,
    status: 'Pending Verification',
    img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400',
    description: 'Elevated rooftop experience with handcrafted cocktails and live DJ sets.',
    phone: '+234 812 999 8888',
    hours: '04:00 PM - 02:00 AM',
  },
  {
    id: 'biz-3',
    name: 'Palmwood Suites',
    category: 'Hotels',
    address: 'Peter Odili Road, Port Harcourt',
    rating: 4.5,
    reviewsCount: 142,
    verified: true,
    status: 'Verified',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400',
    description: 'Boutique hotel offering premium suites and exceptional hospitality.',
    phone: '+234 805 111 2222',
    hours: '24/7',
  },
]

const BusinessListings = ({
  listings = defaultListings,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null)

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    document.body.style.overflow = selectedPlace ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedPlace])

  return (
    <section className="w-full bg-[#FAFAFA] py-12">
      {/* Section Header (Padded) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Your Locations
          </h2>
          <p className="text-sm text-neutral-500 mt-2 font-light">
            Manage your business spots, update details, and track verification status.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider text-black bg-transparent border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300 self-start sm:self-auto shrink-0 uppercase"
        >
          <FiPlus size={14} />
          Add New Location
        </button>
      </div>

      {/* Listings Container (Full Screen Width) */}
      <div className="w-full border-t border-neutral-200">
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white border-b border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mx-auto mb-4 border border-neutral-200">
              <FiMapPin size={20} />
            </div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
              No locations yet
            </h3>
            <p className="text-xs text-neutral-500 mt-2 mb-6 font-light">
              Start by adding your first business location.
            </p>
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Add a location
            </button>
          </div>
        ) : (
          listings.map((place) => (
            <React.Fragment key={place.id}>
              {/* ============ MOBILE: Slim List Row ============ */}
              <button
                onClick={() => setSelectedPlace(place)}
                className="md:hidden w-full flex items-center gap-3 p-3 bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
              >
                {/* Small Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Category */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-black truncate">
                      {place.name}
                    </h3>
                    {place.verified && (
                      <FiCheckCircle
                        size={12}
                        className="text-emerald-500 shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5">
                    {place.category}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500">
                    <FiStar
                      size={10}
                      className="text-amber-400 fill-amber-400"
                    />
                    <span className="font-semibold text-black">
                      {place.rating}
                    </span>
                    <span className="text-neutral-400">
                      ({place.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <FiChevronRight
                  size={18}
                  className="text-neutral-300 shrink-0"
                />
              </button>

              {/* ============ DESKTOP: Full Row ============ */}
              <div className="hidden md:flex group md:items-center gap-6 p-6 bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-300">
                {/* Image */}
                <div className="w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-black truncate">
                      {place.name}
                    </h3>
                    {place.verified ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        <FiCheckCircle size={12} className="stroke-[3]" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                        <FiClock size={12} className="stroke-[3]" />
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                    {place.category}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2 font-light">
                    <FiMapPin size={12} className="text-neutral-400 shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1.5 font-light">
                    <FiStar size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-black">
                      {place.rating}
                    </span>
                    <span className="text-neutral-400">
                      ({place.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Actions (Right Side) */}
                <div className="flex items-center gap-3 shrink-0 md:ml-auto">
                  <button
                    onClick={() => onEdit && onEdit(place)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(place.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-300"
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                  <button
                    className="flex h-9 w-9 items-center justify-center text-neutral-400 hover:text-black transition-colors"
                    title="View Public Profile"
                  >
                    <FiExternalLink size={16} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {/* ================= BOTTOM SHEET MODAL (Mobile Only) ================= */}
      {selectedPlace && (
        <div className="md:hidden fixed inset-0 z-[70] flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedPlace(null)}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 bg-white pt-3 pb-2 flex justify-center rounded-t-3xl">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-3 right-4 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors z-20"
            >
              <FiX size={18} />
            </button>

            {/* Image */}
            <div className="px-5">
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={selectedPlace.img}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pt-5 pb-8">
              {/* Name + Verified */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-black truncate">
                  {selectedPlace.name}
                </h3>
                {selectedPlace.verified ? (
                  <FiCheckCircle size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <FiClock size={14} className="text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                {selectedPlace.category}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-3">
                <FiStar size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-black">
                  {selectedPlace.rating}
                </span>
                <span className="text-neutral-400 text-xs">
                  ({selectedPlace.reviewsCount} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-500 mt-4 font-light leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Info Rows */}
              <div className="mt-5 space-y-3 pt-5 border-t border-neutral-100">
                <div className="flex items-start gap-3">
                  <FiMapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Address
                    </p>
                    <p className="text-sm text-black mt-0.5">{selectedPlace.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Hours
                    </p>
                    <p className="text-sm text-black mt-0.5">{selectedPlace.hours}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onEdit && onEdit(selectedPlace)
                    setSelectedPlace(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FiEdit2 size={14} /> Edit Listing
                </button>
                <button
                  onClick={() => {
                    onDelete && onDelete(selectedPlace.id)
                    setSelectedPlace(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  <FiTrash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BusinessListings