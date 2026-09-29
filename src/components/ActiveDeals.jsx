import React from 'react'
import { FiArrowRight, FiClock } from 'react-icons/fi'

// Placeholder data for the deals
const deals = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    title: 'Happy Hour: 20% Off All Craft Cocktails m',
    provider: 'Skyline Lounge & Terrace • Inbox',
    validity: 'VALID: Tues - Thur • 5:00 PM - 8:00 PM • Expires in 3 days',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
    title: 'Complimentary Breakfast on Weekend Bookings',
    provider: 'Grand Crestview Hotel & Suites',
    validity: 'VALID: Friday - Sunday • Expires at the end of the month',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
    title: 'Buy 1 Specialty Latte, Get 1 Free',
    provider: 'Artisan Coffee Lab • GRA, Inbox',
    validity: 'VALID: Daily before 11:00 AM • Ongoing campaign',
  },
]

const DealCard = ({ deal }) => (
  <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    {/* Image */}
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <img
        src={deal.image}
        alt={deal.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col p-4">
      <h3 className="mb-1 text-sm font-bold leading-snug text-gray-900 sm:text-base">
        {deal.title}
      </h3>
      
      <p className="mb-3 text-xs text-gray-500">
        {deal.provider}
      </p>

      {/* Validity Badge */}
      <div className="flex items-start gap-1.5 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-[10px] font-semibold uppercase leading-tight text-amber-800">
        <FiClock className="mt-0.5 shrink-0" size={12} />
        <span>{deal.validity}</span>
      </div>

      {/* Button */}
      <button
        type="button"
        className="mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        View Deal Details
      </button>
    </div>
  </article>
)

const ActiveDeals = () => {
  return (
    <section className="w-full bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded bg-amber-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
              Limited time offers
            </span>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Active Deals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Special discounts and packages directly from verified local businesses
            </p>
          </div>
          
          <a
            href="#"
            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            See all deals
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActiveDeals