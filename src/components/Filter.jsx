import React from 'react'
import {
  BedDouble,
  Utensils,
  Soup,
  Wine,
  Trees,
  Coffee,
  Ticket,
  ShoppingBag,
  Sparkles,
  Wrench,
  Calendar,
  Check,
  X,
  MapPin,
} from 'lucide-react'
import { FaStar } from 'react-icons/fa'

export const CATEGORIES = [
  { id: 'Hotels', label: 'Hotels', icon: BedDouble, defaultCount: 632 },
  { id: 'Restaurants', label: 'Restaurants', icon: Utensils, defaultCount: 108 },
  { id: 'Local Food', label: 'Local food', icon: Soup, defaultCount: 280 },
  { id: 'Bars & Lounges', label: 'Bars & Lounges', icon: Wine, defaultCount: 347 },
  { id: 'Parks & Recs', label: 'Parks & Recs', icon: Trees, defaultCount: 54 },
  { id: 'Cafes', label: 'Cafes', icon: Coffee, defaultCount: 64 },
  { id: 'Entertainment', label: 'Entertainment', icon: Ticket, defaultCount: 10 },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, defaultCount: 35 },
  { id: 'Beauty & Wellness', label: 'Beauty & Wellness', icon: Sparkles, defaultCount: 98 },
  { id: 'Services', label: 'Services', icon: Wrench, defaultCount: 230 },
]

const Filter = ({
  categoryCounts = {},
  selectedCategory = '',
  onSelectCategory,
  selectedCity = 'Port Harcourt',
  onSelectCity,
  selectedDate = '',
  onSelectDate,
  priceRange = [0, 150],
  onPriceChange,
  ratingFilter = null,
  onRatingChange,
  onResetFilters,
  className = '',
}) => {
  const cities = ['Port Harcourt', 'Lagos', 'Abuja', 'Ibadan', 'Enugu', 'Kano']

  // Detect active filter chips
  const activeChips = []
  if (selectedCategory) {
    activeChips.push({
      id: 'category',
      label: selectedCategory,
      onRemove: () => onSelectCategory(''),
    })
  }
  if (priceRange[0] > 0 || priceRange[1] < 150) {
    activeChips.push({
      id: 'price',
      label: `$${priceRange[0]} - $${priceRange[1]}`,
      onRemove: () => onPriceChange([0, 150]),
    })
  }
  if (ratingFilter) {
    activeChips.push({
      id: 'rating',
      label: `${ratingFilter} ★`,
      onRemove: () => onRatingChange(null),
    })
  }

  const ratingOptions = [
    { value: 5, label: '5 ★' },
    { value: 4, label: '4 ★' },
    { value: 3, label: '3 ★' },
    { value: 2, label: '2-1 ★' },
  ]

  return (
    <aside className={`w-full text-gray-800 ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">Filter</h2>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-3 border-b border-gray-100">
          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              <Check size={11} className="text-gray-500" />
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                className="hover:text-red-500 transition-colors ml-0.5"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Categories */}
      <div className="py-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
          Category
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected =
              selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.label.toLowerCase()
            const count = categoryCounts[cat.id] ?? cat.defaultCount

            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectCategory(isSelected ? '' : cat.id)
                  }
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={15}
                      className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                    />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[11px] tabular-nums ${
                      isSelected ? 'text-blue-500 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Location and Date */}
      <div className="py-4 border-b border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Location and date
        </h3>

        {/* Location Select */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
            <MapPin size={14} />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-blue-500 transition-colors"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
            <Calendar size={14} />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-blue-500 transition-colors"
            placeholder="Choose date"
          />
        </div>
      </div>

      {/* Price */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Price
          </h3>
          <span className="text-[11px] font-semibold text-gray-500">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>

        {/* Range Slider */}
        <div className="px-1 py-2">
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
        </div>

        {/* Min / Max inputs */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <span className="text-gray-400 mr-1">$</span>
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) =>
                onPriceChange([
                  Math.max(0, parseInt(e.target.value) || 0),
                  priceRange[1],
                ])
              }
              className="w-full outline-none text-gray-800 font-medium"
            />
          </div>
          <span className="text-gray-400 text-xs">—</span>
          <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <span className="text-gray-400 mr-1">$</span>
            <input
              type="number"
              min={priceRange[0]}
              max="150"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([
                  priceRange[0],
                  Math.min(150, parseInt(e.target.value) || 150),
                ])
              }
              className="w-full outline-none text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="py-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
          Average rating
        </h3>
        <div className="space-y-2">
          {ratingOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={ratingFilter === opt.value}
                onChange={() =>
                  onRatingChange(ratingFilter === opt.value ? null : opt.value)
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex items-center gap-1 font-medium">
                <span>{opt.label}</span>
                <FaStar size={11} className="text-amber-400 inline" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Filter
