import React, { useState } from 'react'
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi'

// Column next to the edge: 3 images (fully visible, top/bottom bleed a little)
const columnA = [
  { 
    h: 'h-[24%]', 
    pos: 'object-top', 
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    h: 'h-[44%]', 
    pos: 'object-center', 
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    h: 'h-[36%]', 
    pos: 'object-bottom', 
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' 
  },
]

// Extreme right column: 2 images, half of each is cut off by the screen edge.
// They share the column height (flex) so the space above and below is equal.
const columnB = [
  { 
    flex: 'flex-[4]', 
    pos: 'object-left', 
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    flex: 'flex-[6]', 
    pos: 'object-right', 
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800' 
  },
]

const cities = ['Port Harcourt', 'Lagos', 'Abuja', 'Ibadan', 'Enugu', 'Kano']

const Hero = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState(cities[0])
  const [isCityOpen, setIsCityOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch({ query: query.trim(), city })
  }

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity)
    setIsCityOpen(false)
  }

  return (
    // Exactly one screen: 100svh minus the navbar (4rem + 1px border) so there is no scroll
    <section className="relative h-[calc(100svh-4.0625rem)] min-h-[36rem] w-full overflow-hidden bg-slate-50/60 lg:min-h-0">
      
      {/* Mobile Background Image & Overlay */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
          alt="City background"
          className="h-full w-full object-cover"
        />
        {/* Black faded overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Left: copy + search */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-4 pb-12 pt-6 sm:px-6 lg:flex lg:flex-row lg:items-center lg:justify-center lg:px-10 lg:py-0">
        
        {/* Top Minimal Element (Mobile Only) */}
        <div className="flex justify-center lg:hidden">
          <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            ✨ Discover Local Wonders
          </span>
        </div>

        {/* Main Content */}
        <div className="w-full lg:max-w-[52%]">
          <p className="text-xs font-bold tracking-wide text-white sm:text-sm lg:text-gray-900">
            LOCAL WONDERS AWAIT ...
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-gray-900 lg:text-5xl">
            Discover Your City&apos;s
            <br className="hidden sm:block" /> Hidden Treasures
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base lg:text-gray-500">
            Your gateway to the heartbeat of your city, immerse yourself in the
            places, food, experiences &amp; gems that define your city
          </p>

          {/* Glassmorphic Form (Mobile) / Solid White Form (Desktop) */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:gap-0 sm:rounded-xl lg:border-gray-200 lg:bg-white lg:shadow-sm lg:backdrop-blur-none"
          >
            {/* Search input */}
            <label className="flex flex-1 items-center gap-2 px-3 py-2">
              <FiSearch className="shrink-0 text-white/70 lg:text-gray-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search  (e.g Rooftop bar, Hotel in GRA...)"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50 lg:text-gray-800 lg:placeholder:text-gray-400"
              />
            </label>

            {/* Divider */}
            <span className="hidden h-8 w-px bg-white/20 sm:block lg:bg-gray-200" />
            <span className="block h-px w-full bg-white/20 sm:hidden lg:bg-gray-100" />

            {/* Custom City Dropdown */}
            <div className="relative sm:w-44">
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                aria-haspopup="listbox"
                aria-expanded={isCityOpen}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 lg:hover:bg-gray-50"
              >
                <FiMapPin className="shrink-0 text-white/70 lg:text-gray-500" size={16} />
                <span className="flex-1 truncate text-sm font-medium text-white lg:text-gray-800">
                  {city}
                </span>
                <FiChevronDown
                  className={`shrink-0 text-white/70 transition-transform duration-200 lg:text-gray-500 ${
                    isCityOpen ? 'rotate-180' : ''
                  }`}
                  size={14}
                />
              </button>

              {/* Dropdown Menu */}
              {isCityOpen && (
                <>
                  {/* Invisible backdrop to close on click-away */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCityOpen(false)}
                    aria-hidden="true"
                  />

                  <ul
                    role="listbox"
                    aria-label="Select city"
                    className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-gray-900/90 p-1 shadow-2xl backdrop-blur-xl lg:bottom-auto lg:top-full lg:mb-0 lg:mt-2 lg:border-gray-200 lg:bg-white lg:shadow-lg lg:backdrop-blur-none"
                  >
                    {cities.map((c) => (
                      <li key={c} role="option" aria-selected={city === c}>
                        <button
                          type="button"
                          onClick={() => handleCitySelect(c)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            city === c
                              ? 'bg-white/20 font-semibold text-white lg:bg-gray-100 lg:text-gray-900'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white lg:text-gray-700 lg:hover:bg-gray-50 lg:hover:text-gray-900'
                          }`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="rounded-lg bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D98706] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 sm:ml-1"
            >
              Search Place
            </button>
          </form>
        </div>
      </div>

      {/*
        Right: image collage, pinned to the screen's right edge.
        Each column is W wide; the collage is pushed off-screen by W/2,
        so the last column (2 images) is cut in half by the screen edge
        and the column before it (3 images) is fully visible.
        
        NOTE: This section is hidden on mobile (lg:flex) so it only appears on desktop.
      */}
      <div
        aria-hidden="true"
        className="hidden lg:flex lg:absolute lg:inset-y-0 lg:-right-[10vw] lg:h-full lg:gap-4"
      >
        {/* Column A: 3 images */}
        <div className="-mt-[3vh] flex h-full w-[20vw] flex-col gap-4">
          {columnA.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt=""
              referrerPolicy="no-referrer"
              className={`w-full rounded-lg object-cover ${img.h} ${img.pos}`}
            />
          ))}
        </div>

        {/* Column B: 2 images, equal space above and below, half cut off by the screen */}
        <div className="flex h-full w-[20vw] flex-col gap-4 py-[7vh]">
          {columnB.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt=""
              referrerPolicy="no-referrer"
              className={`min-h-0 w-full rounded-lg object-cover ${img.flex} ${img.pos}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero