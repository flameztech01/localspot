import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiCheck,
} from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

const IMG =
  'https://i.pinimg.com/736x/22/c2/c5/22c2c520f3dfead37f645e9d9974fb3c.jpg'

const GAP = 16 // px, matches gap-4

const places = [
  {
    id: 1,
    name: 'The Copper Chimney Bistro',
    meta: 'Restaurant • Continental & Fusion',
    location: 'Issac John St, GRA PH (1.2 km)',
    rating: 4.9,
    reviews: 256,
    open: true,
    hours: '07:00 AM - 11:00 PM',
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
  },
]

const PlaceCard = ({ place, saved, onToggleSave }) => (
  <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    {/* Image */}
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <img
        src={IMG}
        alt={place.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />

      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-teal-700 px-2 py-0.5 text-[10px] font-medium text-white sm:text-xs">
        <FiCheck size={11} />
        Verified
      </span>

      <button
        type="button"
        onClick={() => onToggleSave(place.id)}
        aria-label={saved ? 'Remove from saved places' : 'Save place'}
        aria-pressed={saved}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white sm:h-8 sm:w-8"
      >
        {saved ? (
          <FaHeart size={14} className="text-red-500" />
        ) : (
          <FiHeart size={14} />
        )}
      </button>
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col p-3 sm:p-4">
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-gray-900 sm:min-h-0 sm:truncate sm:text-base">
        {place.name}
      </h3>

      <p className="mt-1 line-clamp-2 min-h-[2rem] text-[11px] leading-snug text-gray-500 sm:min-h-0 sm:truncate sm:text-xs">
        {place.meta}
      </p>

      <p className="mt-2 flex items-start gap-1.5 text-[11px] text-gray-600 sm:items-center sm:text-xs">
        <FiMapPin className="mt-0.5 shrink-0 sm:mt-0" size={12} />
        <span className="line-clamp-2 sm:truncate">{place.location}</span>
      </p>

      <p className="mt-2 flex items-center gap-1.5 text-xs">
        <FaStar className="shrink-0 text-orange-500" size={12} />
        <span className="font-semibold text-gray-900">{place.rating}</span>
        <span className="text-gray-500">({place.reviews})</span>
      </p>

      <p className="mt-2 flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-snug text-gray-700 sm:items-center sm:text-[11px]">
        <FiClock className="mt-0.5 shrink-0 sm:mt-0" size={12} />
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
        className="mt-4 block w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        Details
      </Link>
    </div>
  </article>
)

const Featured = () => {
  const trackRef = useRef(null)
  const [saved, setSaved] = useState([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  // Recalculate page, page count and arrow states from the scroll position
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
  }, [update])

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

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Handpicked &amp; verified local spots in Port Harcourt &amp;
              surroundings
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              disabled={!canPrev}
              aria-label="Previous places"
              className={arrowClass}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              disabled={!canNext}
              aria-label="Next places"
              className={arrowClass}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider: 2 per row on mobile, 4 on desktop */}
        <div
          ref={trackRef}
          onScroll={update}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {places.map((place) => (
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
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === page ? 'bg-red-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Featured