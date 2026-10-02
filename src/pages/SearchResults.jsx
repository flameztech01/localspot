import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FiChevronRight, FiSliders, FiChevronDown, FiX, FiSearch } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Searchbar from '../components/Searchbar'
import Filter, { CATEGORIES } from '../components/Filter'
import PlaceCard from '../components/PlaceCard'
import Pagination from '../components/Pagination'
import directoryData from '../../data/places.json'

const ITEMS_PER_PAGE = 9

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Read URL query params
  const initialQuery = searchParams.get('q') || ''
  const initialCity = searchParams.get('city') || 'Port Harcourt'
  const initialCategory = searchParams.get('category') || ''

  // Filter & Search states
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedDate, setSelectedDate] = useState('')
  const [priceRange, setPriceRange] = useState([0, 150])
  const [ratingFilter, setRatingFilter] = useState(null)
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Favorites state synced with localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })

  // Sync with URL params when they change
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const c = searchParams.get('city') || 'Port Harcourt'
    const cat = searchParams.get('category') || ''
    setQuery(q)
    setCity(c)
    setSelectedCategory(cat)
    setCurrentPage(1)
  }, [searchParams])

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  const handleSearchSubmit = ({ query: newQuery, city: newCity }) => {
    setQuery(newQuery)
    setCity(newCity)
    setCurrentPage(1)
    const newParams = new URLSearchParams()
    if (newQuery) newParams.set('q', newQuery)
    if (newCity) newParams.set('city', newCity)
    if (selectedCategory) newParams.set('category', selectedCategory)
    setSearchParams(newParams)
  }

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (cat) {
      newParams.set('category', cat)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  const handleResetFilters = () => {
    setQuery('')
    setSelectedCategory('')
    setPriceRange([0, 150])
    setSelectedDate('')
    setRatingFilter(null)
    setCurrentPage(1)
    setSearchParams({})
  }

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts = {}
    const allPlaces = directoryData.places || []
    CATEGORIES.forEach((cat) => {
      const match = allPlaces.filter((p) => {
        const placeCat = (p.category || '').toLowerCase()
        const target = cat.id.toLowerCase()
        if (target.includes('hotel')) return placeCat.includes('hotel')
        if (target.includes('restaurant')) return placeCat.includes('restaurant')
        if (target.includes('food')) return placeCat.includes('food') || placeCat.includes('dining')
        if (target.includes('bar') || target.includes('lounge'))
          return placeCat.includes('bar') || placeCat.includes('lounge') || placeCat.includes('nightlife')
        if (target.includes('park') || target.includes('rec'))
          return placeCat.includes('park') || placeCat.includes('attraction') || placeCat.includes('rec')
        if (target.includes('cafe')) return placeCat.includes('cafe') || placeCat.includes('coffee')
        if (target.includes('entertainment')) return placeCat.includes('entertainment') || placeCat.includes('cinema')
        if (target.includes('shop')) return placeCat.includes('shop') || placeCat.includes('mall')
        if (target.includes('beauty') || target.includes('wellness'))
          return placeCat.includes('beauty') || placeCat.includes('spa') || placeCat.includes('wellness')
        if (target.includes('service')) return placeCat.includes('service')
        return placeCat === target
      })
      counts[cat.id] = match.length || cat.defaultCount
    })
    return counts
  }, [])

  // Filter places
  const filteredPlaces = useMemo(() => {
    let result = (directoryData.places || []).filter((p) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase().trim()
        const nameMatch = p.name?.toLowerCase().includes(q)
        const catMatch = p.category?.toLowerCase().includes(q)
        const subMatch = p.subCategory?.toLowerCase().includes(q)
        const descMatch = p.description?.toLowerCase().includes(q)
        const addrMatch = p.location?.address?.toLowerCase().includes(q)
        if (!nameMatch && !catMatch && !subMatch && !descMatch && !addrMatch) {
          return false
        }
      }

      // City filter (soft filter: if city specified and place has city)
      if (city && city !== 'All Cities' && p.location?.city) {
        if (!p.location.city.toLowerCase().includes(city.toLowerCase())) {
          // Keep if query specified and matched name
          if (!query.trim()) return false
        }
      }

      // Category filter
      if (selectedCategory) {
        const placeCat = (p.category || '').toLowerCase()
        const target = selectedCategory.toLowerCase()
        let match = false
        if (target.includes('hotel') && placeCat.includes('hotel')) match = true
        else if (target.includes('restaurant') && placeCat.includes('restaurant')) match = true
        else if (target.includes('food') && (placeCat.includes('food') || placeCat.includes('dining'))) match = true
        else if ((target.includes('bar') || target.includes('lounge')) && (placeCat.includes('bar') || placeCat.includes('lounge') || placeCat.includes('nightlife'))) match = true
        else if ((target.includes('park') || target.includes('rec')) && (placeCat.includes('park') || placeCat.includes('attraction') || placeCat.includes('rec'))) match = true
        else if (target.includes('cafe') && (placeCat.includes('cafe') || placeCat.includes('coffee'))) match = true
        else if (target.includes('entertainment') && (placeCat.includes('entertainment') || placeCat.includes('cinema'))) match = true
        else if (target.includes('shop') && (placeCat.includes('shop') || placeCat.includes('mall'))) match = true
        else if ((target.includes('beauty') || target.includes('wellness')) && (placeCat.includes('beauty') || placeCat.includes('spa') || placeCat.includes('wellness'))) match = true
        else if (target.includes('service') && placeCat.includes('service')) match = true
        else if (placeCat === target) match = true

        if (!match) return false
      }

      // Price filter
      const pUSD = p.priceUSD || (p.pricing?.min ? Math.round(p.pricing.min / 1000) : 30)
      if (pUSD < priceRange[0] || pUSD > priceRange[1]) {
        return false
      }

      // Rating filter
      if (ratingFilter !== null) {
        const avg = p.rating?.average || 4.0
        if (ratingFilter === 5 && avg < 4.8) return false
        if (ratingFilter === 4 && (avg < 4.0 || avg >= 4.8)) return false
        if (ratingFilter === 3 && (avg < 3.0 || avg >= 4.0)) return false
        if (ratingFilter === 2 && avg >= 3.0) return false
      }

      return true
    })

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating?.average || 0) - (a.rating?.average || 0)
      }
      if (sortBy === 'price_asc') {
        const priceA = a.priceUSD || a.pricing?.min || 0
        const priceB = b.priceUSD || b.pricing?.min || 0
        return priceA - priceB
      }
      if (sortBy === 'price_desc') {
        const priceA = a.priceUSD || a.pricing?.max || 0
        const priceB = b.priceUSD || b.pricing?.max || 0
        return priceB - priceA
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      // 'popular': verified first, then highest review count
      const scoreA = (a.verified ? 1000 : 0) + (a.rating?.totalReviews || 0)
      const scoreB = (b.verified ? 1000 : 0) + (b.rating?.totalReviews || 0)
      return scoreB - scoreA
    })

    return result
  }, [query, city, selectedCategory, priceRange, ratingFilter, sortBy])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE))
  const paginatedPlaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPlaces.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPlaces, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }

  const sortLabels = {
    popular: 'Most Popular',
    rating: 'Top Rated',
    price_asc: 'Price: Low to High',
    price_desc: 'Price: High to Low',
    name: 'Name A-Z',
  }

  // Display title text
  const displayTerm = query ? `'${query}'` : selectedCategory ? `'${selectedCategory}'` : 'Places'
  const displayCity = city ? `in ${city}` : 'in Port Harcourt'

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Explore
          </Link>
          <FiChevronRight size={13} className="text-gray-400" />
          <span className="font-semibold text-gray-900">Search results</span>
        </nav>

        {/* Top Searchbar */}
        <div className="mb-8">
          <Searchbar
            query={query}
            city={city}
            onSearch={handleSearchSubmit}
            className="w-full"
          />
        </div>

        {/* Showing Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              SHOWING RESULTS FOR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
              {displayTerm} {displayCity}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} match {query ? `"${query}"` : 'current filters'}
            </p>
          </div>

          {/* Right Controls: Filter Toggle (Mobile) + Sort Dropdown */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
            >
              <FiSliders size={14} />
              <span>Filter</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
              >
                <span className="text-gray-500 font-normal">Sort:</span>
                <span>{sortLabels[sortBy]}</span>
                <FiChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${
                    sortDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-gray-100 bg-white shadow-xl py-1">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSortBy(key)
                          setSortDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                          sortBy === key
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs sticky top-20">
            <Filter
              categoryCounts={categoryCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              selectedCity={city}
              onSelectCity={(newCity) => {
                setCity(newCity)
                setCurrentPage(1)
              }}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto h-full w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <Filter
                  categoryCounts={categoryCounts}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    handleSelectCategory(cat)
                    setMobileFilterOpen(false)
                  }}
                  selectedCity={city}
                  onSelectCity={setCity}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Results Grid & Pagination */}
          <div className="flex-1 w-full min-w-0">
            {paginatedPlaces.length > 0 ? (
              <>
                {/* 
                  CHANGED HERE: 
                  Switched from standard grid to CSS columns for mobile masonry effect.
                  - `columns-2` creates 2 masonry columns on mobile.
                  - `sm:grid sm:grid-cols-2 xl:grid-cols-3` reverts to your standard grid on larger screens.
                */}
                <div className="columns-2 gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                  {paginatedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSaved={favorites.includes(place.id)}
                      onToggleSave={toggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 mb-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <FiSearch size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No places found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
                  We couldn't find any places matching your current search or filter criteria. Try adjusting your filters or resetting them.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SearchResults