import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiCheck,
  FiWifiOff,
  FiRefreshCw,
} from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

// ✅ One level up from src/components/ → src/features/
import { useGetFeaturedBusinessesQuery } from '../features/discoveryApiSlice'

const GAP = 16 // px, matches gap-4

// ---------------------------------------------------------------------------
// Demo data — only shown when the user explicitly clicks "Show Demo Data"
// ---------------------------------------------------------------------------
const mockPlaces = [
  {
    id: 1,
    name: 'The Copper Chimney Bistro',
    meta: 'Restaurant • Continental & Fusion',
    location: 'Issac John St, GRA PH (1.2 km)',
    rating: 4.9,
    reviews: 256,
    open: true,
    hours: '07:00 AM - 11:00 PM',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 2,
    name: 'Grand Crestview Hotel & Suites',
    meta: 'Hotel & Lodging • Luxury',
    location: 'Mobolaji bank anthony (2.5 km)',
    rating: 4.6,
    reviews: 188,
    open: true,
    hours: '24/7',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 3,
    name: 'Skyline Lounge & Terrace',
    meta: 'Bar & Lounge • Nightlife • $$$',
    location: 'Allen Avenue, Rumuosi (1.8 km)',
    rating: 4.7,
    reviews: 315,
    open: false,
    hours: 'OPENS BY 07:00 AM',
    img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 4,
    name: 'Serenity Botanical Spa',
    meta: 'Beauty & Wellness • Day Spa • $$',
    location: 'Aromire Avenue, Off Elekshia (3.1 km)',
    rating: 4.8,
    reviews: 388,
    open: true,
    hours: 'CLOSES BY 11:00 PM',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 5,
    name: 'Harbour View Grill',
    meta: 'Restaurant • Seafood & Grill',
    location: 'Trans-Amadi Road (2.2 km)',
    rating: 4.5,
    reviews: 204,
    open: true,
    hours: '10:00 AM - 10:00 PM',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 6,
    name: 'Palmwood Suites',
    meta: 'Hotel & Lodging • Boutique',
    location: 'Peter Odili Road (3.4 km)',
    rating: 4.4,
    reviews: 142,
    open: true,
    hours: '24/7',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 7,
    name: 'Ember & Oak Kitchen',
    meta: 'Restaurant • Local Delicacies',
    location: 'Ada George Road (4.0 km)',
    rating: 4.7,
    reviews: 267,
    open: false,
    hours: 'OPENS BY 08:00 AM',
    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
  {
    id: 8,
    name: 'Glow Studio Salon',
    meta: 'Beauty & Wellness • Salon • $$',
    location: 'Old GRA, Port Harcourt (1.9 km)',
    rating: 4.6,
    reviews: 173,
    open: true,
    hours: 'CLOSES BY 08:00 PM',
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    verified: true,
  },
]

// ---------------------------------------------------------------------------
// Normalizer — makes API payloads and mock data interchangeable
// ---------------------------------------------------------------------------
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'

const normalizePlace = (p) => {
  if (!p) return null

  // Already in our mock shape
  if (p.meta && typeof p.location === 'string') return p

  const categoryLine = [p.category, p.subCategory, p.priceLevel]
    .filter(Boolean)
    .join(' • ')

  const locationLine = (() => {
    const addr = p.location?.address || p.location?.city || 'Port Harcourt'
    return p.distance ? `${addr} (${p.distance})` : addr
  })()

  const hoursText = p.openingHoursText || p.hours || 'See details'
  const isOpen =
    p.open !== undefined ? p.open : /open|24\/7/i.test(hoursText)

  return {
    id: p.id,
    name: p.name,
    meta: categoryLine || 'Local spot',
    location: locationLine,
    rating: p.rating?.average ?? p.rating ?? 4.5,
    reviews: p.rating?.totalReviews ?? p.reviews ?? 0,
    open: isOpen,
    hours: hoursText,
    img: p.img || p.images?.[0] || FALLBACK_IMG,
    verified: p.verified !== false,
  }
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------
const SkeletonCard = () => (
  <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
    <div className="relative aspect-[3/2] w-full bg-gray-100 sm:aspect-[4/3] animate-pulse" />
    <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-4">
      <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
      <div className="hidden sm:block h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
      <div className="h-2.5 w-2/3 rounded bg-gray-100 animate-pulse" />
      <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
      <div className="mt-3 h-7 w-full rounded bg-gray-100 animate-pulse" />
    </div>
  </article>
)

// ---------------------------------------------------------------------------
// PlaceCard
// ---------------------------------------------------------------------------
const PlaceCard = ({ place, saved, onToggleSave }) => (
  <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
    <div className="relative aspect-[3/2] w-full overflow-hidden sm:aspect-[4/3]">
      <img
        src={place.img}
        alt={place.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG
        }}
        className="h-full w-full object-cover"
      />

      {place.verified && (
        <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded bg-teal-700 px-1.5 py-0.5 text-[8px] font-medium text-white sm:left-2 sm:top-2 sm:gap-1 sm:rounded-md sm:px-2 sm:text-xs">
          <FiCheck size={9} className="sm:hidden" />
          <FiCheck size={11} className="hidden sm:block" />
          Verified
        </span>
      )}

      <button
        type="button"
        onClick={() => onToggleSave(place.id)}
        aria-label={saved ? 'Remove from saved places' : 'Save place'}
        aria-pressed={saved}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white sm:right-2 sm:top-2 sm:h-8 sm:w-8"
      >
        {saved ? (
          <FaHeart size={11} className="text-red-500 sm:hidden" />
        ) : (
          <FiHeart size={11} className="sm:hidden" />
        )}
        {saved ? (
          <FaHeart size={14} className="hidden text-red-500 sm:block" />
        ) : (
          <FiHeart size={14} className="hidden sm:block" />
        )}
      </button>
    </div>

    <div className="flex flex-1 flex-col p-2.5 sm:p-4">
      <h3 className="line-clamp-1 text-xs font-bold leading-tight text-gray-900 sm:line-clamp-2 sm:min-h-[2.5rem] sm:truncate sm:text-base">
        {place.name}
      </h3>

      <p className="mt-1 hidden text-xs leading-snug text-gray-500 sm:line-clamp-2 sm:block sm:min-h-[2rem]">
        {place.meta}
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-600 sm:mt-2 sm:gap-1.5 sm:text-xs">
        <FiMapPin className="shrink-0" size={10} />
        <span className="truncate">{place.location}</span>
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] sm:mt-2 sm:gap-1.5 sm:text-xs">
        <FaStar className="shrink-0 text-orange-500" size={10} />
        <span className="font-semibold text-gray-900">{place.rating}</span>
        <span className="text-gray-500">({place.reviews})</span>
      </p>

      <p className="mt-2 hidden items-center gap-1.5 text-[11px] font-semibold uppercase leading-snug text-gray-700 sm:flex">
        <FiClock className="shrink-0" size={12} />
        <span>
          <span className={place.open ? 'text-green-600' : 'text-red-500'}>
            {place.open ? 'Open now' : 'Closed'}
          </span>
          {' • '}
          {place.hours}
        </span>
      </p>

      <Link
        to={`/places/${place.id}`}
        className="mt-2.5 block w-full rounded-md border border-gray-200 py-1.5 text-center text-[11px] font-medium text-gray-900 transition-colors hover:bg-gray-50 sm:mt-4 sm:rounded-lg sm:py-2 sm:text-sm"
      >
        Details
      </Link>
    </div>
  </article>
)

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const Featured = () => {
  const trackRef = useRef(null)
  const [saved, setSaved] = useState([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  // Whether the user has opted into demo data
  const [showDemo, setShowDemo] = useState(false)

  // ---- Fetch real data from backend ----
  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetFeaturedBusinessesQuery({ page: 1, limit: 8 })

  // Extract businesses from various response shapes
  const apiPlaces = (() => {
    if (!apiData) return []
    if (Array.isArray(apiData)) return apiData
    if (Array.isArray(apiData.businesses)) return apiData.businesses
    if (Array.isArray(apiData.data)) return apiData.data
    if (Array.isArray(apiData.items)) return apiData.items
    return []
  })()

  // ---- Decide what to display ----
  const displayPlaces = showDemo
    ? mockPlaces
    : apiPlaces.map(normalizePlace).filter(Boolean)

  // Show empty state when the API returns nothing OR errored, and the user
  // hasn't opted into demo data.
  const showEmptyState =
    !showDemo && !isLoading && (isError || apiPlaces.length === 0)

  // ---- Slider logic ----
  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const step = el.clientWidth + GAP
    const ratio = (el.scrollWidth + GAP) / step
    setPageCount(Math.max(1, Math.ceil(ratio - 0.01)))
    setPage(Math.round(el.scrollLeft / step))
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update, displayPlaces.length])

  // Reset scroll position when the data set changes
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0
    update()
  }, [displayPlaces.length, update])

  const scrollToPage = (index) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * (el.clientWidth + GAP), behavior: 'smooth' })
  }

  const slide = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth + GAP), behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10'

  const showSkeleton = isLoading && !showDemo

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Featured
              </h2>
              {showDemo && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 border border-amber-100">
                  Demo Data
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Handpicked &amp; verified local spots in Port Harcourt &amp;
              surroundings
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              disabled={!canPrev || displayPlaces.length === 0}
              aria-label="Previous places"
              className={arrowClass}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              disabled={!canNext || displayPlaces.length === 0}
              aria-label="Next places"
              className={arrowClass}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ---------- Empty / Error state ---------- */}
        {showEmptyState && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
              <FiWifiOff size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isError
                ? "Couldn't load featured spots"
                : 'No featured spots yet'}
            </h3>
            <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
              {isError
                ? 'Check your connection or try again in a moment.'
                : 'Featured spots will appear here once they are published.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                <FiRefreshCw
                  size={13}
                  className={isFetching ? 'animate-spin' : ''}
                />
                Try again
              </button>
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
              >
                Show Demo Data
              </button>
            </div>
          </div>
        )}

        {/* ---------- Skeleton ---------- */}
        {showSkeleton && (
          <div className="mt-6 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex w-[calc(50%-0.5rem)] flex-none lg:w-[calc(25%-0.75rem)]"
              >
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {/* ---------- Slider ---------- */}
        {!showEmptyState && !showSkeleton && (
          <>
            <div
              ref={trackRef}
              onScroll={update}
              className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {displayPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex w-[calc(50%-0.5rem)] flex-none snap-start lg:w-[calc(25%-0.75rem)]"
                >
                  <PlaceCard
                    place={place}
                    saved={saved.includes(place.id)}
                    onToggleSave={toggleSave}
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            {pageCount > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === page
                        ? 'bg-red-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Exit Demo Mode */}
            {showDemo && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowDemo(false)}
                  className="text-[11px] font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                >
                  Hide demo data
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Featured