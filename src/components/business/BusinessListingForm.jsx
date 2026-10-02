import React, { useState } from 'react'
import {
  FiX,
  FiUploadCloud,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiInfo,
  FiImage,
} from 'react-icons/fi'

const categories = [
  'Restaurants',
  'Cafes',
  'Local Food',
  'Hotels',
  'Bars & Lounges',
  'Entertainment',
  'Shopping',
  'Beauty & Wellness',
  'Services',
  'Parks & Recs',
]

const availableAmenities = [
  'Free Wi-Fi',
  'Parking Space',
  'Outdoor Seating',
  'Air Conditioning',
  'Accepts Cards / POS',
  'Wheelchair Accessible',
  'Takeaway / Delivery',
  'Pet Friendly',
  'Live Music / Events',
  'Private Dining / Rooms',
]

const BusinessListingForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Restaurants',
    address: initialData?.address || '',
    city: initialData?.city || 'Port Harcourt',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    priceLevel: initialData?.priceLevel || '$$',
    openingHours: initialData?.openingHoursText || 'Mon - Sun: 8:00 AM - 10:00 PM',
    description: initialData?.description || '',
    imageUrl: initialData?.images?.[0] || '',
    amenities: initialData?.amenities || ['Free Wi-Fi', 'Air Conditioning', 'Accepts Cards / POS'],
  })

  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Business name is required'
    if (!formData.address.trim()) newErrors.address = 'Street address is required'
    if (!formData.phone.trim()) newErrors.phone = 'Contact phone is required'
    if (!formData.description.trim()) newErrors.description = 'Please add a brief description'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newListing = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      address: `${formData.address}, ${formData.city}`,
      city: formData.city,
      phone: formData.phone,
      website: formData.website,
      priceLevel: formData.priceLevel,
      openingHoursText: formData.openingHours,
      description: formData.description,
      amenities: formData.amenities,
      images: [
        formData.imageUrl ||
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ],
      rating: initialData?.rating || 5.0,
      reviewsCount: initialData?.reviewsCount || 0,
      status: initialData?.status || 'Pending Verification',
      verified: initialData?.verified ?? false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    }

    onSave(newListing)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Business Listing' : 'List a New Business on LocalSpot'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the verified details to appear on search and discovery maps
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FiInfo className="text-blue-500" /> General Business Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Business / Place Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Crown Bistro & Lounge"
                className={`w-full rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                } px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Price Tier
                </label>
                <div className="flex gap-2">
                  {['$', '$$', '$$$', '$$$$'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, priceLevel: tier }))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.priceLevel === tier
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4 pt-3 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Location & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 18 Tombia Street, GRA Phase 2"
                  className={`w-full rounded-xl border ${
                    errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                  } px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Port Harcourt"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FiPhone size={13} /> Official Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 803 123 4567"
                  className={`w-full rounded-xl border ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                  } px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FiGlobe size={13} /> Website / Social URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://mybusiness.com or instagram.com/..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FiClock size={13} /> Operating Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="e.g. Mon - Sat: 8:00 AM - 10:00 PM (Closed Sun)"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Media & Image URL */}
          <div className="space-y-4 pt-3 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FiImage className="text-blue-500" /> Cover Photo & Visuals
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Photo URL (Unsplash or direct image link)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Leave empty to automatically assign a high-definition category image.
              </p>
            </div>

            {formData.imageUrl && (
              <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
                  }}
                />
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                  Cover Preview
                </span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700">
              Amenities & Key Features
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && <FiCheck size={12} className="text-blue-600" />}
                    {amenity}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700">
              About the Business *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers what makes your spot unique, popular dishes, specialties, or services..."
              className={`w-full rounded-xl border ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
              } px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500">{errors.description}</p>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              {initialData ? 'Update Listing' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BusinessListingForm
