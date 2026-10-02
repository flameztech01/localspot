import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FiChevronLeft,
  FiHeart,
  FiMapPin,
  FiShare2,
  FiPhone,
  FiGlobe,
  FiTag,
  FiX,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi'
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import directoryData from '../../data/places.json'

// --- Hardcoded Data (Reviews, Meals, Menu) ---
const hardcodedReviews = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    date: '2 days ago',
    text: 'Absolutely amazing experience! The seafood okra was out of this world. The staff were very attentive and the ambiance was perfect for a quiet dinner. Highly recommend!',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    date: '1 week ago',
    text: 'Great food and lovely atmosphere. The only reason I am giving 4 stars is because we had to wait a bit for a table despite having a reservation. But the food made up for it.',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    date: '2 weeks ago',
    text: 'One of the best restaurants in Port Harcourt. The catfish pepper soup is a must-try. Clean environment and excellent service.',
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    date: '3 weeks ago',
    text: 'Celebrated my birthday here and it was fantastic. The staff went above and beyond. The live band was a nice touch!',
  },
  {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 3,
    date: '1 month ago',
    text: 'Food was good, but the service was a bit slow. Maybe it was just a busy night. Will give it another try.',
  },
]

const hardcodedPopularMeals = [
  {
    id: 1,
    name: 'Seafood Okra',
    price: '₦5,500',
    img: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    name: 'Fried Rice & Chicken',
    price: '₦4,000',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    name: 'Catfish Pepper Soup',
    price: '₦4,500',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=200',
  },
]

const hardcodedFullMenu = [
  {
    category: 'Starters',
    items: [
      { name: 'Spring Rolls', price: '₦2,500' },
      { name: 'Chicken Wings', price: '₦3,500' },
      { name: 'Peppered Snail', price: '₦4,000' },
    ],
  },
  {
    category: 'Main Course',
    items: [
      { name: 'Seafood Okra', price: '₦5,500' },
      { name: 'Fried Rice & Chicken', price: '₦4,000' },
      { name: 'Catfish Pepper Soup', price: '₦4,500' },
      { name: 'Goat Meat Pepper Soup', price: '₦4,200' },
      { name: 'Jollof Rice & Beef', price: '₦3,800' },
    ],
  },
  {
    category: 'Drinks & Cocktails',
    items: [
      { name: 'Chapman', price: '₦1,500' },
      { name: 'Pina Colada', price: '₦2,500' },
      { name: 'Fresh Juice', price: '₦1,200' },
    ],
  },
]

const fallbackImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=400',
]

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-fade-in`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// --- Main Component ---
const PlacesDetails = () => {
  const { id } = useParams()

  // Find the place from the JSON data based on ID
  const rawPlace = directoryData.places?.find((p) => String(p.id) === String(id)) || directoryData.places?.[0] || {}

  // Normalize the dynamic data to fit the UI
  const place = {
    id: rawPlace.id || 1,
    name: rawPlace.name || 'Sharro Restaurant',
    rating: rawPlace.rating?.average || 4.8,
    reviewsCount: rawPlace.rating?.totalReviews || 120,
    price: rawPlace.priceLevel || '$$$',
    category: rawPlace.category || 'Restaurant',
    isOpen: rawPlace.openingHoursText?.toLowerCase().includes('open') || true,
    hours: rawPlace.openingHoursText || '07:00 AM - 11:00 PM',
    description:
      rawPlace.description ||
      'A top-rated dining destination located in the heart of Port Harcourt. We offer a diverse menu featuring local and continental dishes, prepared with the freshest ingredients. Our cozy ambiance and exceptional service make it the perfect spot for family dinners, romantic dates, or business lunches.',
    address: rawPlace.location?.address || rawPlace.location?.city || '123 Main Street, GRA Phase 2, Port Harcourt',
    phone: rawPlace.phone || '+234 801 234 5678',
    website: rawPlace.website || 'www.sharrorestaurant.com',
    services: rawPlace.services || 'Dine-in, Takeout, Delivery, Reservations',
    // Ensure we always have at least 5 images for the layout
    images: rawPlace.images?.length >= 5 ? rawPlace.images : [...(rawPlace.images || []), ...fallbackImages].slice(0, 5),
    // Hardcoded sections as requested
    reviews: hardcodedReviews,
    popularMeals: hardcodedPopularMeals,
    fullMenu: hardcodedFullMenu,
  }

  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)

  // Modal States
  const [activeModal, setActiveModal] = useState(null) // 'photos', 'menu', 'review'
  const [selectedImage, setSelectedImage] = useState(null)

  // Review States
  const [visibleReviews, setVisibleReviews] = useState(3)
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `Check out ${place.name} on our platform!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Star renderer
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-orange-500" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-orange-500" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-orange-500" />)
      }
    }
    return stars
  }

  // Handle Review Submit
  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!newReview.name || !newReview.text) return

    // Add to top of reviews
    place.reviews.unshift({
      id: Date.now(),
      name: newReview.name,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      rating: newReview.rating,
      date: 'Just now',
      text: newReview.text,
    })

    setReviewSubmitted(true)
    setTimeout(() => {
      setActiveModal(null)
      setReviewSubmitted(false)
      setNewReview({ name: '', rating: 5, text: '' })
    }, 2000)
  }

  // Directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.address
  )}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FiChevronLeft size={18} />
          Back to results
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-gray-900">
                <FaStar className="text-orange-500" size={14} />
                {place.rating}
              </span>
              <span className="text-gray-400">•</span>
              <span>{place.reviewsCount} reviews</span>
              <span className="text-gray-400">•</span>
              <span>{place.price}</span>
              <span className="text-gray-400">•</span>
              <span>{place.category}</span>
              <span className="text-gray-400">•</span>
              <span className={`font-medium ${place.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                {place.isOpen ? 'Open now' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <FiCheck size={14} className="text-green-500" /> : <FiShare2 size={14} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {saved ? <FaHeart size={14} className="text-red-500" /> : <FiHeart size={14} />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => setActiveModal('review')}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] sm:h-[450px]">
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group">
            <img
              src={place.images[0]}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {place.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden group">
                <img
                  src={img}
                  alt={`${place.name} ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {idx === 3 && (
                  <button
                    onClick={() => setActiveModal('photos')}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                  >
                    <span className="text-white text-sm font-medium">+12 Photos</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content & Sidebar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Info */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Overall info</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {place.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-sm text-gray-900">{place.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm text-gray-900">{place.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiGlobe className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <a href={`https://${place.website}`} target="_blank" rel="noreferrer" className="text-sm text-teal-700 hover:underline">
                      {place.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiTag className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Services</p>
                    <p className="text-sm text-gray-900">{place.services}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews (Hardcoded) */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Reviews</h2>
              
              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{place.rating}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(place.rating)}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{place.reviewsCount} reviews</span>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-gray-600">{star}</span>
                      <FaStar className="text-orange-500" size={10} />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right text-gray-500">
                        {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%'}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveModal('review')}
                  className="px-4 py-2 text-sm font-medium text-teal-700 border border-teal-700 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
                >
                  Write a review
                </button>
              </div>

              {/* Individual Reviews */}
              <div className="mt-6 space-y-6">
                {place.reviews.slice(0, visibleReviews).map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {renderStars(review.rating)}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {visibleReviews < place.reviews.length && (
                <button
                  onClick={() => setVisibleReviews((prev) => prev + 3)}
                  className="mt-6 w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Load more reviews <FiChevronDown size={16} />
                </button>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Map Section */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative h-48 bg-gray-200">
                <iframe
                  title="Restaurant Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    place.address
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-900 font-medium mb-3">{place.address}</p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiMapPin size={16} />
                  Get Directions
                </a>
              </div>
            </section>

            {/* Popular Meals (Hardcoded) */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Popular meals</h2>
              <div className="space-y-4">
                {place.popularMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center gap-3">
                    <img
                      src={meal.img}
                      alt={meal.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {meal.name}
                      </h4>
                      <p className="text-sm text-teal-700 font-medium mt-0.5">
                        {meal.price}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMeal(selectedMeal === meal.id ? null : meal.id)}
                      className={`p-2 rounded-full transition-colors ${
                        selectedMeal === meal.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-400 hover:text-teal-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiCheck size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveModal('menu')}
                className="mt-4 w-full py-2 text-sm font-medium text-teal-700 border border-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
              >
                View full menu
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}

      {/* Photo Gallery Modal */}
      <Modal
        isOpen={activeModal === 'photos'}
        onClose={() => setActiveModal(null)}
        title="All Photos"
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {place.images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Gallery ${idx}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </Modal>

      {/* Lightbox for selected image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <FiX size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Full Menu Modal */}
      <Modal
        isOpen={activeModal === 'menu'}
        onClose={() => setActiveModal(null)}
        title="Full Menu"
        maxWidth="max-w-xl"
      >
        <div className="space-y-8">
          {place.fullMenu.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                {category.category}
              </h4>
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Write a Review Modal */}
      <Modal
        isOpen={activeModal === 'review'}
        onClose={() => setActiveModal(null)}
        title="Write a Review"
        maxWidth="max-w-lg"
      >
        {reviewSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <FiCheck size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Thank you!</h4>
            <p className="text-sm text-gray-500 mt-1">Your review has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <FaStar
                      size={24}
                      className={star <= newReview.rating ? 'text-orange-500' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                required
                rows={4}
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  )
}

export default PlacesDetails