import React, { useState } from 'react'
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi'

const cities = ['Port Harcourt', 'Lagos', 'Abuja', 'Ibadan', 'Enugu', 'Kano']

const Searchbar = ({
  query = '',
  city = 'Port Harcourt',
  onSearch,
  className = '',
}) => {
  const [searchVal, setSearchVal] = useState(query)
  const [selectedCity, setSelectedCity] = useState(city)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ query: searchVal.trim(), city: selectedCity })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm gap-2 sm:gap-0 ${className}`}
    >
      {/* Search text input */}
      <div className="flex flex-1 items-center gap-2.5 px-3 py-2 w-full">
        <FiSearch className="text-gray-400 shrink-0" size={18} />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search (e.g Rooftop bar, Hotel in GRA...)"
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 font-medium"
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block h-7 w-px bg-gray-200 mx-2" />
      <div className="block sm:hidden h-px w-full bg-gray-100" />

      {/* City dropdown */}
      <div className="relative w-full sm:w-48 shrink-0">
        <button
          type="button"
          onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <FiMapPin className="text-gray-400 shrink-0" size={16} />
            <span className="truncate font-medium">{selectedCity}</span>
          </div>
          <FiChevronDown
            size={14}
            className={`text-gray-400 transition-transform shrink-0 ${
              cityDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {cityDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setCityDropdownOpen(false)}
            />
            <ul className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1 overflow-hidden max-h-56 overflow-y-auto">
              {cities.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity(c)
                      setCityDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                      selectedCity === c
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
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

      {/* Submit button */}
      <button
        type="submit"
        className="w-full sm:w-auto shrink-0 bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-sm active:scale-95"
      >
        Search Place
      </button>
    </form>
  )
}

export default Searchbar
