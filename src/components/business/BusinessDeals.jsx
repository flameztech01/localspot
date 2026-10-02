import React, { useState, useEffect } from 'react'
import {
  FiTag,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiUsers,
  FiChevronRight,
  FiX,
} from 'react-icons/fi'

const defaultDeals = [
  {
    id: 'deal-1',
    title: 'Weekend Brunch Special',
    description: '20% off all brunch items every Saturday and Sunday. Includes free mimosas for tables of 4 or more.',
    discount: '20%',
    discountLabel: 'OFF',
    validUntil: 'Dec 31, 2026',
    status: 'Active',
    claims: 142,
    venue: 'The Copper Chimney Bistro',
  },
  {
    id: 'deal-2',
    title: 'Happy Hour Cocktails',
    description: 'Buy one get one free on all signature cocktails. Available Monday through Thursday, 5PM - 8PM.',
    discount: 'BOGO',
    discountLabel: '',
    validUntil: 'Nov 15, 2026',
    status: 'Active',
    claims: 89,
    venue: 'Skyline Terrace & Craft Lounge',
  },
  {
    id: 'deal-3',
    title: 'Midweek Business Lunch',
    description: 'Free dessert with any main course purchase. Valid for dine-in only, Tuesday to Friday.',
    discount: 'FREE',
    discountLabel: 'DESSERT',
    validUntil: 'Oct 30, 2026',
    status: 'Expired',
    claims: 210,
    venue: 'Palmwood Suites',
  },
]

const BusinessDeals = ({
  deals = defaultDeals,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [selectedDeal, setSelectedDeal] = useState(null)

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    document.body.style.overflow = selectedDeal ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedDeal])

  return (
    <section className="w-full bg-[#FAFAFA] py-12">
      {/* Section Header (Padded) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Deals & Offers
          </h2>
          <p className="text-sm text-neutral-500 mt-2 font-light">
            Attract more customers with exclusive promotions and track their performance.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider text-black bg-transparent border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300 self-start sm:self-auto shrink-0 uppercase"
        >
          <FiPlus size={14} />
          Create New Deal
        </button>
      </div>

      {/* Deals Container (Full Screen Width) */}
      <div className="w-full border-t border-neutral-200">
        {deals.length === 0 ? (
          <div className="text-center py-20 bg-white border-b border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mx-auto mb-4 border border-neutral-200">
              <FiTag size={20} />
            </div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
              No active deals
            </h3>
            <p className="text-xs text-neutral-500 mt-2 mb-6 font-light">
              Create your first promotion to attract new customers.
            </p>
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Create a deal
            </button>
          </div>
        ) : (
          deals.map((deal) => (
            <React.Fragment key={deal.id}>
              {/* ============ MOBILE: Slim List Row ============ */}
              <button
                onClick={() => setSelectedDeal(deal)}
                className="md:hidden w-full flex items-center gap-3 p-4 bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
              >
                {/* Discount Badge */}
                <div className="w-14 h-14 rounded-lg shrink-0 bg-black flex flex-col items-center justify-center text-white">
                  <span className="text-[13px] font-bold leading-none">
                    {deal.discount}
                  </span>
                  {deal.discountLabel && (
                    <span className="text-[8px] font-medium uppercase tracking-widest mt-0.5 opacity-70">
                      {deal.discountLabel}
                    </span>
                  )}
                </div>

                {/* Title + Meta */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-black truncate">
                    {deal.title}
                  </h3>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5">
                    {deal.venue}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <FiUsers size={10} />
                      {deal.claims} claims
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        deal.status === 'Active'
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {deal.status}
                    </span>
                  </div>
                </div>

                <FiChevronRight
                  size={18}
                  className="text-neutral-300 shrink-0"
                />
              </button>

              {/* ============ DESKTOP: Full Row ============ */}
              <div className="hidden md:flex group items-center gap-6 p-6 bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-300">
                {/* Discount Badge (Large) */}
                <div className="w-20 h-20 rounded-xl shrink-0 bg-black flex flex-col items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                  <span className="text-base font-bold leading-none">
                    {deal.discount}
                  </span>
                  {deal.discountLabel && (
                    <span className="text-[9px] font-medium uppercase tracking-widest mt-1 opacity-70">
                      {deal.discountLabel}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-black truncate">
                      {deal.title}
                    </h3>
                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                        deal.status === 'Active'
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {deal.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                    {deal.venue}
                  </p>

                  <p className="text-xs text-neutral-500 mt-2 font-light line-clamp-1">
                    {deal.description}
                  </p>

                  {/* Inline Stats */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <FiUsers size={12} className="text-neutral-400" />
                      <span className="font-semibold text-black">
                        {deal.claims}
                      </span>
                      <span className="font-light">claims</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <FiCalendar size={12} className="text-neutral-400" />
                      <span className="font-light">Ends</span>
                      <span className="font-semibold text-black">
                        {deal.validUntil}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions (Right Side) */}
                <div className="flex items-center gap-3 shrink-0 ml-auto">
                  <button
                    onClick={() => onEdit && onEdit(deal)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(deal.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-300"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {/* ================= BOTTOM SHEET MODAL (Mobile Only) ================= */}
      {selectedDeal && (
        <div className="md:hidden fixed inset-0 z-[70] flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedDeal(null)}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 bg-white pt-3 pb-2 flex justify-center rounded-t-3xl">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute top-3 right-4 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors z-20"
            >
              <FiX size={18} />
            </button>

            {/* Discount Badge (Hero) */}
            <div className="px-6 pt-4 pb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-black flex flex-col items-center justify-center text-white mb-4">
                <span className="text-2xl font-bold leading-none">
                  {selectedDeal.discount}
                </span>
                {selectedDeal.discountLabel && (
                  <span className="text-[9px] font-medium uppercase tracking-widest mt-1 opacity-70">
                    {selectedDeal.discountLabel}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-black text-center">
                {selectedDeal.title}
              </h3>
              <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mt-1">
                {selectedDeal.venue}
              </p>
              <span
                className={`mt-3 inline-block text-[10px] font-bold uppercase tracking-widest ${
                  selectedDeal.status === 'Active'
                    ? 'text-emerald-600'
                    : 'text-red-500'
                }`}
              >
                {selectedDeal.status}
              </span>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              {/* Description */}
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {selectedDeal.description}
              </p>

              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-2 border-t border-l border-neutral-200">
                <div className="p-4 border-b border-r border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <FiUsers size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Claims
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-black">
                    {selectedDeal.claims}
                  </p>
                </div>
                <div className="p-4 border-b border-r border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <FiCalendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Valid Until
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-black mt-1">
                    {selectedDeal.validUntil}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onEdit && onEdit(selectedDeal)
                    setSelectedDeal(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FiEdit2 size={14} /> Edit Deal
                </button>
                <button
                  onClick={() => {
                    onDelete && onDelete(selectedDeal.id)
                    setSelectedDeal(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BusinessDeals