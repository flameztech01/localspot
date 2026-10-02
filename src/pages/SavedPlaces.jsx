import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FiUser,
  FiHeart,
  FiMapPin,
  FiClock,
  FiChevronRight,
} from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'

// --- Hardcoded Data for Saved Places ---
const initialSavedPlaces = [
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
  },
]

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState(initialSavedPlaces)

  const handleRemovePlace = (id) => {
    setSavedPlaces((prev) => prev.filter((place) => place.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- Sidebar (Fixed on Desktop) --- */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 h-fit">
            {/* User Profile Card - Now clickable to go to /profile */}
            <Link 
              to="/profile"
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 hover:border-teal-500 hover:shadow-md transition-all block"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                <FiUser size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">Guest User</h3>
                <p className="text-xs text-gray-500 truncate">guest.user@example.com</p>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="mt-4 flex flex-col gap-1">
              {/* Replaced button with NavLink */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <FiUser size={18} />
                My profile
              </NavLink>
              
              <NavLink
                to="/saved"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <FiHeart size={18} />
                Saved places
              </NavLink>
            </nav>
          </aside>

          {/* --- Main Content (Scrolls independently) --- */}
          <div className="flex-1 min-w-0 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved places</h1>

            {savedPlaces.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No saved places yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  Start exploring and save your favorite spots to see them here.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  Explore places
                  <FiChevronRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => handleRemovePlace(place.id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm transition-colors"
                        title="Remove from saved"
                      >
                        <FaHeart size={16} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                        {place.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                        {place.meta}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="flex items-center gap-1.5 text-xs text-gray-600">
                          <FiMapPin size={12} className="shrink-0" />
                          <span className="truncate">{place.location}</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="flex items-center gap-1 text-xs">
                            <FaStar className="text-orange-500" size={12} />
                            <span className="font-semibold text-gray-900">{place.rating}</span>
                            <span className="text-gray-500">({place.reviews})</span>
                          </p>
                        </div>
                        <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                          <FiClock size={12} className="shrink-0" />
                          <span className={place.open ? 'text-green-600' : 'text-red-500'}>
                            {place.open ? 'Open now' : 'Closed'}
                          </span>
                          <span>•</span>
                          <span className="truncate">{place.hours}</span>
                        </p>
                      </div>

                      <div className="mt-auto pt-2">
                        <Link
                          to={`/places/${place.id}`}
                          className="block w-full py-2 text-center text-xs font-medium text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SavedPlaces