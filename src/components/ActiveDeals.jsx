import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiClock,
  FiWifiOff,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiExternalLink,
} from 'react-icons/fi'

// ✅ One level up from src/components/ → src/features/
import { useGetActivePromotionsQuery } from '../features/discoveryApiSlice'

// ---------------------------------------------------------------------------
// Demo data — only shown when the user clicks "Show Demo Data"
// ---------------------------------------------------------------------------
const mockDeals = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    title: 'Happy Hour: 20% Off All Craft Cocktails',
    provider: 'Skyline Lounge & Terrace • Inbox',
    validity:
      'VALID: Tues - Thur • 5:00 PM - 8:00 PM • Expires in 3 days',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
    title: 'Complimentary Breakfast on Weekend Bookings',
    provider: 'Grand Crestview Hotel & Suites',
    validity:
      'VALID: Friday - Sunday • Expires at the end of the month',
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

// ---------------------------------------------------------------------------
// Slider images for the "Run Ads with Us" promo
// ---------------------------------------------------------------------------
const adSliderImages = [
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1600',
]

// ---------------------------------------------------------------------------
// Normalizer — map backend payloads into the DealCard shape
// ---------------------------------------------------------------------------
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'

const normalizeDeal = (p) => {
  if (!p) return null

  if (p.provider && p.validity) return p

  const providerParts = [
    p.businessName || p.business?.name || 'LocalSpot Partner',
    p.location?.address || p.location?.city,
  ].filter(Boolean)

  const validityParts = []
  if (p.schedule || p.validityText) {
    validityParts.push(p.validityText || p.schedule)
  }
  if (p.startsAt && p.endsAt) {
    validityParts.push(
      `Expires ${new Date(p.endsAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })}`
    )
  }

  return {
    id: p.id,
    image: p.image || p.imageUrl || p.images?.[0] || FALLBACK_IMG,
    title: p.title || p.name || 'Special Offer',
    provider: providerParts.join(' • ') || 'LocalSpot Partner',
    validity:
      validityParts.join(' • ') ||
      'VALID: See details for terms and dates',
  }
}

// ---------------------------------------------------------------------------
// Deal Card
// ---------------------------------------------------------------------------
const DealCard = ({ deal }) => (
  <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <img
        src={deal.image}
        alt={deal.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG
        }}
        className="h-full w-full object-cover"
      />
    </div>

    <div className="flex flex-1 flex-col p-4">
      <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-gray-900 sm:text-base">
        {deal.title}
      </h3>

      <p className="mb-3 line-clamp-1 text-xs text-gray-500">
        {deal.provider}
      </p>

      <div className="flex items-start gap-1.5 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-[10px] font-semibold uppercase leading-tight text-amber-800">
        <FiClock className="mt-0.5 shrink-0" size={12} />
        <span className="line-clamp-2">{deal.validity}</span>
      </div>

      <Link
        to={`/deals/${deal.id}`}
        className="mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        View Deal Details
      </Link>
    </div>
  </article>
)

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
const SkeletonDeal = () => (
  <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="aspect-[16/10] w-full animate-pulse bg-gray-100" />
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-8 w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-3 h-8 w-full animate-pulse rounded bg-gray-100" />
    </div>
  </article>
)

// ---------------------------------------------------------------------------
// Run Ads With Us — image slider with text overlay
// ---------------------------------------------------------------------------
const RunAdsSlider = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % adSliderImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () =>
    setIndex((i) => (i - 1 + adSliderImages.length) % adSliderImages.length)
  const next = () => setIndex((i) => (i + 1) % adSliderImages.length)

  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900">
      <div className="relative w-full min-h-[260px] sm:min-h-[300px] lg:min-h-[320px]">
        {/* Background images with crossfade */}
        {adSliderImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Promo slide ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Dark gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

        {/* Overlay content */}
        <div className="relative z-10 flex h-full flex-col justify-between gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
              <FiZap size={12} />
              For Business Owners
            </div>

            <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              Want to run ads with us?
            </h3>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Get your business in front of thousands of locals actively
              searching for what you offer. Feature promotions, boost
              visibility, and track performance in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/business/ads/learn-more"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300"
            >
              Click here to learn more
              <FiExternalLink size={14} />
            </Link>

            <Link
              to="/business/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Get started
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
          {adSliderImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? 'w-5 bg-white'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Arrows (desktop only) */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:flex"
        >
          <FiChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:flex"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty / Error state
// ---------------------------------------------------------------------------
const DealsEmptyState = ({ isError, isFetching, refetch, onShowDemo }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
      <FiWifiOff size={20} />
    </div>
    <h3 className="text-sm font-semibold text-gray-900">
      {isError ? "Couldn't load active deals" : 'No active deals right now'}
    </h3>
    <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
      {isError
        ? 'Check your connection or try again in a moment.'
        : 'New promos from local businesses will appear here as soon as they go live.'}
    </p>

    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
      >
        <FiRefreshCw
          size={13}
          className={isFetching ? 'animate-spin' : ''}
        />
        Try again
      </button>
      <button
        type="button"
        onClick={onShowDemo}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
      >
        Show Demo Data
      </button>
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const ActiveDeals = () => {
  const [showDemo, setShowDemo] = useState(false)

  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetActivePromotionsQuery({ page: 1, limit: 6 })

  const apiDeals = (() => {
    if (!apiData) return []
    if (Array.isArray(apiData)) return apiData
    if (Array.isArray(apiData.promotions)) return apiData.promotions
    if (Array.isArray(apiData.businesses)) return apiData.businesses
    if (Array.isArray(apiData.data)) return apiData.data
    if (Array.isArray(apiData.items)) return apiData.items
    return []
  })()

  const displayDeals = showDemo
    ? mockDeals
    : apiDeals.map(normalizeDeal).filter(Boolean)

  const showEmptyState =
    !showDemo && !isLoading && (isError || apiDeals.length === 0)

  const showSkeleton = isLoading && !showDemo

  return (
    <section className="w-full bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="mb-2 inline-block rounded bg-amber-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
                Limited time offers
              </span>
              {showDemo && (
                <span className="mb-2 rounded border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                  Demo Data
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Active Deals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Special discounts and packages directly from verified local
              businesses
            </p>
          </div>

          <Link
            to="/deals"
            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            See all deals
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Empty / Error state */}
        {showEmptyState && (
          <DealsEmptyState
            isError={isError}
            isFetching={isFetching}
            refetch={refetch}
            onShowDemo={() => setShowDemo(true)}
          />
        )}

        {/* Skeleton */}
        {showSkeleton && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonDeal key={i} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!showEmptyState && !showSkeleton && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {displayDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {showDemo && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowDemo(false)}
                  className="text-[11px] font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                >
                  Hide demo data
                </button>
              </div>
            )}
          </>
        )}

        {/* Run Ads With Us — slider with text overlay */}
        <RunAdsSlider />
      </div>
    </section>
  )
}

export default ActiveDeals