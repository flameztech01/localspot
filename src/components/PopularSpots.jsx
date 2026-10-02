import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiClock,
  FiHeart,
  FiMapPin,
  FiWifiOff,
  FiRefreshCw,
} from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

// ✅ Correct: file is discoveryApiSlice.js
import { useGetPopularBusinessesQuery } from '../features/discoveryApiSlice'

const PAGE_SIZE = 8

const filters = ['All', 'Hotels', 'Dining spots', 'Things to do', 'Shops']

// ---------------------------------------------------------------------------
// Demo data — only shown when the user clicks "Show Demo Data"
// ---------------------------------------------------------------------------
const mockSpots = [
  { id: 1, name: 'Yellow Chilli Restaurant', tag: 'DINING', group: 'Dining spots', open: false, pos: 'object-left', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Artisan Coffee Lab', tag: 'CAFE', group: 'Dining spots', open: false, pos: 'object-center', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Freedom Park Cultural Center', tag: 'PARKS & RECREATION', group: 'Things to do', open: false, pos: 'object-right', img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'The Palms Shopping Galleria', tag: 'SHOPPING', group: 'Shops', open: false, pos: 'object-top', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'Vellvett Lounge & Grill', tag: 'NIGHTLIFE', group: 'Things to do', open: true, pos: 'object-bottom', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Zenith Wellness & Gym', tag: 'FITNESS', group: 'Things to do', open: true, pos: 'object-left', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
  { id: 7, name: 'Yellow Chilli Restaurant', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-center', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
  { id: 8, name: 'Freedom Park Cultural Center', tag: 'PARKS & RECREATION', group: 'Things to do', open: true, pos: 'object-right', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800' },
  { id: 9, name: 'Grand Crestview Hotel & Suites', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-top', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
  { id: 10, name: 'Palmwood Suites', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-bottom', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800' },
  { id: 11, name: 'Harbour View Grill', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-left', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800' },
  { id: 12, name: 'Old GRA Market Square', tag: 'SHOPPING', group: 'Shops', open: false, pos: 'object-center', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { id: 13, name: 'Skyline Lounge & Terrace', tag: 'NIGHTLIFE', group: 'Things to do', open: false, pos: 'object-right', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800' },
  { id: 14, name: 'Ember & Oak Kitchen', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-top', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800' },
  { id: 15, name: 'Riverside Guest House', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-bottom', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800' },
  { id: 16, name: 'City Mall Port Harcourt', tag: 'SHOPPING', group: 'Shops', open: true, pos: 'object-left', img: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17a?auto=format&fit=crop&q=80&w=800' },
]

// ---------------------------------------------------------------------------
// Normalizer — maps API payloads into the shape the card expects
// ---------------------------------------------------------------------------
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'

const OBJECT_POSITIONS = [
  'object-left',
  'object-center',
  'object-right',
  'object-top',
  'object-bottom',
]

const mapCategoryToGroup = (rawCategory) => {
  const c = (rawCategory || '').toLowerCase()
  if (c.includes('hotel') || c.includes('lodging')) return 'Hotels'
  if (
    c.includes('restaurant') ||
    c.includes('dining') ||
    c.includes('food') ||
    c.includes('cafe') ||
    c.includes('coffee')
  )
    return 'Dining spots'
  if (c.includes('shop') || c.includes('mall') || c.includes('retail'))
    return 'Shops'
  return 'Things to do'
}

const normalizeSpot = (p, index = 0) => {
  if (!p) return null

  // Already in mock shape
  if (p.tag && p.group && p.pos) return p

  const categoryLine = [p.category, p.subCategory, p.priceLevel]
    .filter(Boolean)
    .join(' • ')

  const hoursText = p.openingHoursText || p.hours || 'See details'
  const isOpen =
    p.open !== undefined ? p.open : /open|24\/7/i.test(hoursText)

  const tagSource = (p.category || p.subCategory || 'PLACE').toString()

  return {
    id: p.id,
    name: p.name,
    tag: tagSource.toUpperCase().slice(0, 22),
    group: mapCategoryToGroup(p.category),
    open: isOpen,
    pos: OBJECT_POSITIONS[index % OBJECT_POSITIONS.length],
    img: p.img || p.images?.[0] || FALLBACK_IMG,
    meta: categoryLine || 'Local spot',
    location: p.location?.address || p.location?.city || 'Port Harcourt',
    rating: p.rating?.average ?? p.rating ?? 4.5,
    reviews: p.rating?.totalReviews ?? p.reviews ?? 0,
    hours: hoursText,
  }
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
const SkeletonSpot = () => (
  <article className="relative flex aspect-[3/4] w-full animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:aspect-auto">
    <div className="absolute inset-0 sm:relative sm:aspect-[4/3] sm:w-full" />
  </article>
)

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const SpotCard = ({ spot, saved, onToggleSave }) => (
  <article className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:aspect-auto">
    <div className="absolute inset-0 overflow-hidden sm:relative sm:inset-auto sm:aspect-[4/3] sm:w-full">
      <img
        src={spot.img}
        alt={spot.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG
        }}
        className={`h-full w-full object-cover ${spot.pos || 'object-center'}`}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 sm:hidden" />

      <span className="absolute left-2 top-2 rounded bg-white px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-gray-900 sm:text-[9px]">
        {spot.tag}
      </span>

      <button
        type="button"
        onClick={() => onToggleSave(spot.id)}
        aria-label={saved ? 'Remove from saved places' : 'Save place'}
        aria-pressed={saved}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white"
      >
        {saved ? (
          <FaHeart size={13} className="text-red-500" />
        ) : (
          <FiHeart size={13} />
        )}
      </button>
    </div>

    <div className="relative z-10 mt-auto flex flex-col p-2.5 sm:mt-0 sm:flex-1 sm:p-4">
      <Link
        to={`/places/${spot.id}`}
        className="line-clamp-2 text-xs font-bold leading-tight text-white hover:text-[#60A5FA] sm:min-h-0 sm:truncate sm:text-gray-900 sm:hover:text-[#3B82F6]"
      >
        {spot.name}
      </Link>

      <p className="mt-2 hidden text-xs leading-snug text-gray-600 sm:block sm:truncate">
        {spot.meta || 'Local spot'}
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] text-white/75 sm:mt-1.5 sm:gap-1.5 sm:text-xs sm:text-gray-600">
        <FiMapPin className="shrink-0" size={10} />
        <span className="truncate">{spot.location || 'Port Harcourt'}</span>
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] sm:mt-1.5 sm:gap-1.5 sm:text-xs">
        <FaStar
          className="shrink-0 text-orange-400 sm:text-orange-500"
          size={10}
        />
        <span className="font-semibold text-white sm:text-gray-900">
          {spot.rating}
        </span>
        <span className="text-white/70 sm:text-gray-500">
          ({spot.reviews})
        </span>
      </p>

      <p className="mt-1.5 hidden items-center gap-1.5 text-[10px] font-semibold uppercase leading-snug text-gray-700 sm:flex">
        <FiClock className="shrink-0" size={11} />
        <span>
          <span className={spot.open ? 'text-green-600' : 'text-red-500'}>
            {spot.open ? 'Open now' : 'Closed'}
          </span>
          {' • '}
          {spot.hours || (spot.open ? 'Open' : 'Closed')}
        </span>
      </p>
    </div>
  </article>
)

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const PopularSpots = () => {
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [saved, setSaved] = useState([])
  const [showDemo, setShowDemo] = useState(false)

  // ---- Fetch from backend ----
  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPopularBusinessesQuery({ page: 1, limit: 16 })

  const apiPlaces = (() => {
    if (!apiData) return []
    if (Array.isArray(apiData)) return apiData
    if (Array.isArray(apiData.businesses)) return apiData.businesses
    if (Array.isArray(apiData.data)) return apiData.data
    if (Array.isArray(apiData.items)) return apiData.items
    return []
  })()

  const sourceSpots = showDemo
    ? mockSpots
    : apiPlaces.map((p, i) => normalizeSpot(p, i)).filter(Boolean)

  const showEmptyState =
    !showDemo && !isLoading && (isError || apiPlaces.length === 0)

  const showSkeleton = isLoading && !showDemo

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [active])

  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const filtered =
    active === 'All'
      ? sourceSpots
      : sourceSpots.filter((s) => s.group === active)
  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Popular Spots
          </h2>
          {showDemo && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 border border-amber-100">
              Demo Data
            </span>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Filter popular spots"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active === f}
              onClick={() => setActive(f)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:px-5 sm:text-sm ${
                active === f
                  ? 'border-gray-900 bg-white text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {showEmptyState && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
              <FiWifiOff size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isError
                ? "Couldn't load popular spots"
                : 'No popular spots yet'}
            </h3>
            <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
              {isError
                ? 'Check your connection or try again in a moment.'
                : 'Popular spots will appear here once they are published.'}
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

        {showSkeleton && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonSpot key={i} />
            ))}
          </div>
        )}

        {!showEmptyState && !showSkeleton && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {shown.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  saved={saved.includes(spot.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">
                No spots in this category yet.
              </p>
            )}

            {hasMore && (
              <div className="mt-8 flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="w-full rounded-lg border border-[#60A5FA] bg-white px-6 py-2.5 text-sm font-medium text-[#3B82F6] transition-colors hover:bg-blue-50 sm:w-auto"
                >
                  Load more popular places
                </button>
              </div>
            )}

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

export default PopularSpots