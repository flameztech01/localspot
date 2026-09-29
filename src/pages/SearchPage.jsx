import { useMemo, useState } from 'react'
import { ArrowDownUp, ChevronDown, ChevronRight } from 'lucide-react'
import EmptySearchState from './components/EmptySearchState'
import SearchControls from './components/SearchControls'
import SearchPageFilter from './components/SearchPageFilter'
import SearchPagination from './components/SearchPagination'
import SearchPlaceCard from './components/SearchPlaceCard'
import { recommendedPlaces } from './searchPageData'

const initialFilters = {
  cityTag: 'Barcelona',
  category: 'Entertainment',
  location: 'GRA, Port Harcourt',
  date: '',
  minPrice: 5,
  maxPrice: 150,
  rating: 0,
}

const SearchPage = ({ onPlaceDetails }) => {
  const [query, setQuery] = useState('Afghanistan Restaurants')
  const [submittedQuery, setSubmittedQuery] = useState('Afghanistan Restaurants')
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('Popular')
  const [savedIds, setSavedIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const places = useMemo(() => {
    const sorted = [...recommendedPlaces]

    if (sortBy === 'Rating') {
      sorted.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    }

    if (sortBy === 'Name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }

    return sorted
  }, [sortBy])

const toggleSaved = (id) => {
  setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]))
}

const clearFilters = () => setFilters({ ...initialFilters, cityTag: '', category: '', rating: 0 })


return (
  <main className="min-h-screen min-w-275 bg-[#fbfbfc] font-sans text-slate-900">
    <div className="mx-auto w-full max-w-7xl px-10 pb-20 pt-7">
      <nav className="mb-5 flex items-center gap-2 text-[10px] text-slate-500" aria-label="Breadcrumb">
        <span>Explore</span>
        <ChevronRight size={11} />
        <span className="font-medium text-slate-800">Search results</span>
      </nav>

      <SearchControls
        query={query}
        location="Port Harcourt"
        onQueryChange={setQuery}
        onSearch={() => {
          setSubmittedQuery(query.trim() || 'All places')
          setCurrentPage(1)
        }}
      />

      <section className="pb-7 pt-10">
        <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-slate-950">
          No results for ‘{submittedQuery}’ in Port Harcourt
        </h1>
        <p className="mt-1 text-[10px] text-slate-500">0 places match “restaurants”.</p>
      </section>

      <div className="flex items-start">
        <SearchPageFilter filters={filters} onChange={setFilters} onClear={clearFilters} />

        <section className="min-w-0 flex-1 border-l border-slate-200 pl-8">
          <div className="mb-4 flex justify-end">
            <label className="relative flex h-9 w-36.5 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-[10px] text-slate-600">
              <ArrowDownUp size={12} />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-0 flex-1 appearance-none bg-transparent outline-none"
              >
                <option>Popular</option>
                <option>Rating</option>
                <option>Name</option>
              </select>
              <ChevronDown size={11} className="pointer-events-none" />
            </label>
          </div>

          <EmptySearchState />

          <div className="mb-4 mt-7">
            <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#4b9697]">Recommended for you</p>
            <h2 className="mt-1 text-[17px] font-bold text-slate-950">Good alternatives near your search</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {places.map((place) => (
              <SearchPlaceCard
                key={place.id}
                place={place}
                saved={savedIds.includes(place.id)}
                onSave={toggleSaved}
                onDetails={onPlaceDetails}
              />
            ))}
          </div>

          <SearchPagination currentPage={currentPage} onPageChange={setCurrentPage} />
        </section>
      </div>
    </div>
  </main>
)
}


export default SearchPage
