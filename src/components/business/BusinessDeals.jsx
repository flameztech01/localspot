import React, { useState } from 'react'
import { FiTag, FiPlus, FiTrash2, FiClock, FiPercent, FiCheck, FiX } from 'react-icons/fi'

const initialDealsData = [
  {
    id: 1,
    title: 'Happy Hour: 20% Off All Cocktails & Craft Beers',
    code: 'LOCALHAPPY',
    discount: '20% OFF',
    validUntil: 'Every weekday 4 PM - 7 PM',
    claimedCount: 42,
    status: 'Active',
    placeName: 'The Skyview Lounge & Grill',
  },
  {
    id: 2,
    title: 'Weekend Family Platter Special with Free Drinks',
    code: 'WEEKENDLOVE',
    discount: 'Free Drink',
    validUntil: 'Sat & Sun till Nov 30',
    claimedCount: 29,
    status: 'Active',
    placeName: 'Royal Crown Bistro',
  },
]

const BusinessDeals = ({ places = [] }) => {
  const [deals, setDeals] = useState(initialDealsData)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    code: '',
    validUntil: '',
    placeName: places[0]?.name || 'My Local Venue',
  })

  const handleAddDeal = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.discount) return

    const newDeal = {
      id: Date.now(),
      title: formData.title,
      code: formData.code.toUpperCase() || 'SPOTDEAL',
      discount: formData.discount,
      validUntil: formData.validUntil || 'Limited time offer',
      claimedCount: 0,
      status: 'Active',
      placeName: formData.placeName,
    }

    setDeals([newDeal, ...deals])
    setShowModal(false)
    setFormData({
      title: '',
      discount: '',
      code: '',
      validUntil: '',
      placeName: places[0]?.name || 'My Local Venue',
    })
  }

  const handleDeleteDeal = (id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Deals & Special Offers</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Drive more walk-ins by creating exclusive promotional deals displayed on the LocalSpot homepage and deal carousel.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <FiPlus size={16} />
          Create New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                  <FiPercent size={13} />
                  {deal.discount}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {deal.status}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base mb-1">{deal.title}</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">{deal.placeName}</p>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 mb-3">
                <span className="text-[11px] uppercase font-bold text-gray-400">Coupon:</span>
                <span className="font-mono font-bold text-sm text-gray-800 tracking-wider">
                  {deal.code}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <FiClock size={13} />
                {deal.validUntil}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">{deal.claimedCount} claims</span>
                <button
                  onClick={() => handleDeleteDeal(deal.id)}
                  className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Remove Deal"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to create a deal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiTag className="text-blue-600" /> Create Special Deal
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% off lunch orders between 12-3 PM"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Badge *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20% OFF or Free Drink"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. LUNCH20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Validity Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. Valid until next Sunday"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Publish Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessDeals
