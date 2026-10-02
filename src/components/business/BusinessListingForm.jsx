import React, { useState, useEffect, useRef } from 'react'
import {
  FiX,
  FiPlus,
  FiCheck,
  FiImage,
  FiMapPin,
  FiChevronDown,
  FiUploadCloud,
} from 'react-icons/fi'

const CATEGORIES = [
  'Restaurants',
  'Hotels',
  'Bars & Lounges',
  'Cafes',
  'Beauty & Wellness',
  'Shopping',
  'Entertainment',
  'Services',
  'Local Food',
  'Parks & Recs',
]

const AMENITIES = [
  'Free Wi-Fi',
  'Parking Space',
  'Outdoor Seating',
  'Air Conditioning',
  'Accepts Cards / POS',
  'Live Music / Events',
  'Wheelchair Accessible',
  'Pet Friendly',
  'Delivery',
  'Takeout',
  'Reservations',
  '24/7 Service',
]

const PRICE_LEVELS = ['$', '$$', '$$$', '$$$$']

const BusinessListingForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    priceLevel: '$$',
    openingHoursText: '',
    description: '',
    amenities: [],
    images: [],
  })

  const [errors, setErrors] = useState({})
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const categoryRef = useRef(null)
  const priceRef = useRef(null)

  // Prefill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        address: initialData.address || '',
        city: initialData.city || '',
        phone: initialData.phone || '',
        website: initialData.website || '',
        priceLevel: initialData.priceLevel || '$$',
        openingHoursText: initialData.openingHoursText || '',
        description: initialData.description || '',
        amenities: initialData.amenities || [],
        images: initialData.images || [],
      })
    } else {
      setFormData({
        name: '',
        category: '',
        address: '',
        city: '',
        phone: '',
        website: '',
        priceLevel: '$$',
        openingHoursText: '',
        description: '',
        amenities: [],
        images: [],
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false)
      }
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setIsPriceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Business name is required'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const payload = {
      ...formData,
      id: initialData?.id || `biz-${Date.now()}`,
      rating: initialData?.rating || 0,
      reviewsCount: initialData?.reviewsCount || 0,
      verified: initialData?.verified || false,
      status: initialData?.status || 'Pending Verification',
    }

    onSave(payload)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {initialData ? 'Edit Business Listing' : 'Add New Business'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {initialData
                ? 'Update your business details below.'
                : 'Fill in the details to list your business on LocalSpot.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Basic Information
            </h3>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. The Copper Chimney Bistro"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category + Price Level Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                >
                  <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.category || 'Select category'}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 max-h-52 overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat }))
                          setIsCategoryOpen(false)
                          if (errors.category) setErrors((prev) => ({ ...prev, category: null }))
                        }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          formData.category === cat
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Level Dropdown */}
              <div className="relative" ref={priceRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Level
                </label>
                <button
                  type="button"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <span className="text-gray-900">{formData.priceLevel}</span>
                  <FiChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isPriceOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
                    {PRICE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, priceLevel: level }))
                          setIsPriceOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          formData.priceLevel === level
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Tell customers what makes your business special..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Contact & Location
            </h3>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Issac John St, GRA Phase 2"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            {/* City + Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Port Harcourt"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 803 000 0000"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Website + Hours Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  name="openingHoursText"
                  value={formData.openingHoursText}
                  onChange={handleChange}
                  placeholder="e.g. 07:00 AM - 11:00 PM"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Amenities & Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && <FiCheck size={12} className="stroke-[3]" />}
                    {amenity}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Photos
            </h3>
            
            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200"
                  >
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <FiUploadCloud size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">
                  Click to upload photos
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  PNG, JPG up to 5MB each
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              'Save Changes'
            ) : (
              'Submit for Verification'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessListingForm