import React, { useState } from 'react'
import { FiX, FiCheck, FiUpload, FiMapPin, FiBriefcase } from 'react-icons/fi'

const AdminAddBusinessModal = ({ isOpen, onClose, onAddBusiness }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Restaurant',
    location: 'GRA, Port Harcourt',
    address: '',
    owner: '',
    ownerEmail: '',
    phone: '',
    priceRange: '$$ Moderate • $15 - $35 per person',
    tagline: '',
    description: '',
    status: 'Active',
    verified: true
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const newId = `LOC-${Math.floor(10000 + Math.random() * 90000)}`
    const newPlace = {
      ...formData,
      id: newId,
      created: 'Just now',
      rating: 5.0,
      reviewsCount: 1,
      thumbnail:
        formData.thumbnail ||
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      coverImage:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      services: ['Dine-in', 'Takeaway'],
      amenities: ['Free Wi-Fi', 'Air Conditioning']
    }

    onAddBusiness(newPlace)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Add New Business Listing
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Directly register a verified or commercial business into the LocalSpot directory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Copper Chimney Bistro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Primary Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe & Bakery">Cafe &amp; Bakery</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Hotel">Hotel &amp; Lodging</option>
                <option value="Retail / Discount">Retail / Discount</option>
                <option value="Fitness / Sports">Fitness / Sports</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Bars & Lounges">Bars &amp; Lounges</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">District / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. GRA, Port Harcourt"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Physical Address</label>
              <input
                type="text"
                placeholder="e.g. 14 Forces Avenue, Old GRA"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Owner / Merchant Name</label>
              <input
                type="text"
                placeholder="e.g. Mercy Geoffrey"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Inquiry Email</label>
              <input
                type="email"
                placeholder="owner@business.com"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+234 803 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Short Tagline</label>
            <input
              type="text"
              placeholder="e.g. Handcrafted gourmet recipes and artisan coffees."
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Business Story &amp; Details</label>
            <textarea
              rows={3}
              placeholder="Detailed description of venue, specialty, and services..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              >
                <option value="Active">Active (Immediately Live)</option>
                <option value="Pending Review">Pending Review (Add to Queue)</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Price Tier</label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-xs"
              >
                <option value="$ Budget • Under $10">$ Budget • Under $10</option>
                <option value="$$ Moderate • $10 - $35">$$ Moderate • $10 - $35</option>
                <option value="$$$ Upscale • $35 - $80">$$$ Upscale • $35 - $80</option>
                <option value="$$$$ Luxury • $80+">$$$$ Luxury • $80+</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs shadow-2xs transition-all hover:scale-[1.01]"
            >
              Save &amp; Publish Business
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminAddBusinessModal
