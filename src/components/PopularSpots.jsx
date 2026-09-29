import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiHeart, FiMapPin } from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

const IMG =
  'https://i.pinimg.com/736x/22/c2/c5/22c2c520f3dfead37f645e9d9974fb3c.jpg'

const PAGE_SIZE = 8

const filters = ['All', 'Hotels', 'Dining spots', 'Things to do', 'Shops']

// group = which filter chip the spot belongs to, tag = label shown on the image
const spots = [
  { id: 1, name: 'Yellow Chilli Restaurant', tag: 'DINING', group: 'Dining spots', open: false, pos: 'object-left' },
  { id: 2, name: 'Artisan Coffee Lab', tag: 'CAFE', group: 'Dining spots', open: false, pos: 'object-center' },
  { id: 3, name: 'Freedom Park Cultural Center', tag: 'PARKS & RECREATION', group: 'Things to do', open: false, pos: 'object-right' },
  { id: 4, name: 'The Palms Shopping Galleria', tag: 'SHOPPING', group: 'Shops', open: false, pos: 'object-top' },
  { id: 5, name: 'Vellvett Lounge & Grill', tag: 'NIGHTLIFE', group: 'Things to do', open: true, pos: 'object-bottom' },
  { id: 6, name: 'Zenith Wellness & Gym', tag: 'FITNESS', group: 'Things to do', open: true, pos: 'object-left' },
  { id: 7, name: 'Yellow Chilli Restaurant', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-center' },
  { id: 8, name: 'Freedom Park Cultural Center', tag: 'PARKS & RECREATION', group: 'Things to do', open: true, pos: 'object-right' },
  { id: 9, name: 'Grand Crestview Hotel & Suites', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-top' },
  { id: 10, name: 'Palmwood Suites', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-bottom' },
  { id: 11, name: 'Harbour View Grill', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-left' },
  { id: 12, name: 'Old GRA Market Square', tag: 'SHOPPING', group: 'Shops', open: false, pos: 'object-center' },
  { id: 13, name: 'Skyline Lounge & Terrace', tag: 'NIGHTLIFE', group: 'Things to do', open: false, pos: 'object-right' },
  { id: 14, name: 'Ember & Oak Kitchen', tag: 'DINING', group: 'Dining spots', open: true, pos: 'object-top' },
  { id: 15, name: 'Riverside Guest House', tag: 'HOTEL', group: 'Hotels', open: true, pos: 'object-bottom' },
  { id: 16, name: 'City Mall Port Harcourt', tag: 'SHOPPING', group: 'Shops', open: true, pos: 'object-left' },
]

const SpotCard = ({ spot, saved, onToggleSave }) => (
  <article className="relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:aspect-auto">
    {/* Image — fills the whole card on mobile, normal block on desktop */}
    <div className="absolute inset-0 overflow-hidden sm:relative sm:inset-auto sm:aspect-[4/3] sm:w-full">
      <img
        src={IMG}
        alt={spot.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`h-full w-full object-cover ${spot.pos}`}
      />

      {/* Mobile only: dark faded overlay so the text reads on the image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 sm:hidden" />

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

    {/* Content — sits on top of the image on mobile, below it on desktop */}
    <div className="relative z-10 mt-auto flex flex-col p-3 sm:mt-0 sm:flex-1 sm:p-4">
      <Link
        to={`/places/${spot.id}`}
        className="line-clamp-2 text-sm font-bold leading-tight text-white hover:text-[#60A5FA] sm:min-h-0 sm:truncate sm:text-gray-900 sm:hover:text-[#3B82F6]"
      >
        {spot.name}
      </Link>

      <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-white/75 sm:truncate sm:text-xs sm:text-gray-600">
        Restaurant • Continental &amp; Fusion • $$
      </p>

      <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-white/75 sm:items-center sm:text-xs sm:text-gray-600">
        <FiMapPin className="mt-0.5 shrink-0 sm:mt-0" size={11} />
        <span className="line-clamp-2 sm:truncate">
          Isaac John St, GRA PH (1.2 km)
        </span>
      </p>

      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs">
        <FaStar className="shrink-0 text-orange-400 sm:text-orange-500" size={11} />
        <span className="font-semibold text-white sm:text-gray-900">4.9</span>
        <span className="text-white/70 sm:text-gray-500">(256)</span>
      </p>

      <p className="mt-1.5 flex items-start gap-1.5 text-[9px] font-semibold uppercase leading-snug text-white/80 sm:items-center sm:text-[10px] sm:text-gray-700">
        <FiClock className="mt-0.5 shrink-0 sm:mt-0" size={11} />
        <span>
          <span className={spot.open ? 'text-green-400 sm:text-green-600' : 'text-red-400 sm:text-red-500'}>
            {spot.open ? 'Open now' : 'Closed'}
          </span>
          {' • '}
          {spot.open ? '07:00 AM - 11:00 PM' : 'Opens by 07:00 AM'}
        </span>
      </p>
    </div>
  </article>
)

const PopularSpots = () => {
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [saved, setSaved] = useState([])

  // Start from the first page again whenever the filter changes
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [active])

  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const filtered =
    active === 'All' ? spots : spots.filter((s) => s.group === active)
  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Popular Spots
        </h2>

        {/* Filter chips */}
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

        {/* Grid: 2 per row on mobile, 4 on desktop */}
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

        {/* Load more */}
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
      </div>
    </section>
  )
}

export default PopularSpots