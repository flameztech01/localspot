import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiHeart, FiMapPin } from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

const PAGE_SIZE = 8

const filters = ['All', 'Hotels', 'Dining spots', 'Things to do', 'Shops']

// group = which filter chip the spot belongs to, tag = label shown on the image
const spots = [
  {
    id: 1,
    name: 'Yellow Chilli Restaurant',
    tag: 'DINING',
    group: 'Dining spots',
    open: false,
    pos: 'object-left',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    name: 'Artisan Coffee Lab',
    tag: 'CAFE',
    group: 'Dining spots',
    open: false,
    pos: 'object-center',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    name: 'Freedom Park Cultural Center',
    tag: 'PARKS & RECREATION',
    group: 'Things to do',
    open: false,
    pos: 'object-right',
    img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    name: 'The Palms Shopping Galleria',
    tag: 'SHOPPING',
    group: 'Shops',
    open: false,
    pos: 'object-top',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 5,
    name: 'Vellvett Lounge & Grill',
    tag: 'NIGHTLIFE',
    group: 'Things to do',
    open: true,
    pos: 'object-bottom',
    img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 6,
    name: 'Zenith Wellness & Gym',
    tag: 'FITNESS',
    group: 'Things to do',
    open: true,
    pos: 'object-left',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 7,
    name: 'Yellow Chilli Restaurant',
    tag: 'DINING',
    group: 'Dining spots',
    open: true,
    pos: 'object-center',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 8,
    name: 'Freedom Park Cultural Center',
    tag: 'PARKS & RECREATION',
    group: 'Things to do',
    open: true,
    pos: 'object-right',
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 9,
    name: 'Grand Crestview Hotel & Suites',
    tag: 'HOTEL',
    group: 'Hotels',
    open: true,
    pos: 'object-top',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 10,
    name: 'Palmwood Suites',
    tag: 'HOTEL',
    group: 'Hotels',
    open: true,
    pos: 'object-bottom',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 11,
    name: 'Harbour View Grill',
    tag: 'DINING',
    group: 'Dining spots',
    open: true,
    pos: 'object-left',
    img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 12,
    name: 'Old GRA Market Square',
    tag: 'SHOPPING',
    group: 'Shops',
    open: false,
    pos: 'object-center',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 13,
    name: 'Skyline Lounge & Terrace',
    tag: 'NIGHTLIFE',
    group: 'Things to do',
    open: false,
    pos: 'object-right',
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 14,
    name: 'Ember & Oak Kitchen',
    tag: 'DINING',
    group: 'Dining spots',
    open: true,
    pos: 'object-top',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 15,
    name: 'Riverside Guest House',
    tag: 'HOTEL',
    group: 'Hotels',
    open: true,
    pos: 'object-bottom',
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 16,
    name: 'City Mall Port Harcourt',
    tag: 'SHOPPING',
    group: 'Shops',
    open: true,
    pos: 'object-left',
    img: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17a?auto=format&fit=crop&q=80&w=800',
  },
]

const SpotCard = ({ spot, saved, onToggleSave }) => (
  <article className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:aspect-auto">
    {/* Image — fills the whole card on mobile, normal block on desktop */}
    <div className="absolute inset-0 overflow-hidden sm:relative sm:inset-auto sm:aspect-[4/3] sm:w-full">
      <img
        src={spot.img}
        alt={spot.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`h-full w-full object-cover ${spot.pos}`}
      />

      {/* Mobile only: dark faded overlay so the text reads on the image */}
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

    {/* Content — sits on top of the image on mobile, below it on desktop */}
    <div className="relative z-10 mt-auto flex flex-col p-2.5 sm:mt-0 sm:flex-1 sm:p-4">
      <Link
        to={`/places/${spot.id}`}
        className="line-clamp-2 text-xs font-bold leading-tight text-white hover:text-[#60A5FA] sm:min-h-0 sm:truncate sm:text-gray-900 sm:hover:text-[#3B82F6]"
      >
        {spot.name}
      </Link>

      {/* Meta — desktop only */}
      <p className="mt-2 hidden text-xs leading-snug text-gray-600 sm:block sm:truncate">
        Restaurant • Continental &amp; Fusion • $$
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] text-white/75 sm:mt-1.5 sm:gap-1.5 sm:text-xs sm:text-gray-600">
        <FiMapPin className="shrink-0" size={10} />
        <span className="truncate">Isaac John St, GRA PH (1.2 km)</span>
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] sm:mt-1.5 sm:gap-1.5 sm:text-xs">
        <FaStar className="shrink-0 text-orange-400 sm:text-orange-500" size={10} />
        <span className="font-semibold text-white sm:text-gray-900">4.9</span>
        <span className="text-white/70 sm:text-gray-500">(256)</span>
      </p>

      {/* Hours — desktop only */}
      <p className="mt-1.5 hidden items-center gap-1.5 text-[10px] font-semibold uppercase leading-snug text-gray-700 sm:flex">
        <FiClock className="shrink-0" size={11} />
        <span>
          <span className={spot.open ? 'text-green-600' : 'text-red-500'}>
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