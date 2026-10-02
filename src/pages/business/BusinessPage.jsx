import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiLock,
  FiArrowRight,
  FiUserPlus,
  FiLogIn,
  FiCheck,
  FiBarChart2,
  FiTag,
  FiMessageSquare,
} from 'react-icons/fi'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  BusinessHero,
  BusinessStats,
  BusinessListings,
  BusinessDeals,
  BusinessReviews,
} from '../../components/business'

// ---------------------------------------------------------------------------
// Locked state — full viewport height, content anchored to bottom
// ---------------------------------------------------------------------------
const LockedBusinessPage = ({ onShowDemo }) => {
  return (
    <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-gray-950">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1600"
        alt="Business dashboard preview"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950 lg:bg-gradient-to-br lg:from-gray-950 lg:via-gray-950/85 lg:to-gray-900/90" />

      {/* Content — flex-1 so it grows to fill, justify-end pins to bottom on mobile */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-6 sm:px-6 lg:justify-center lg:px-8 lg:pb-0">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ==================== LEFT: Copy & CTAs ==================== */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
              <FiLock size={11} />
              Business Dashboard
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-4xl xl:text-5xl">
              Sign in to access your{' '}
              <span className="text-amber-400">business dashboard</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Manage your listings, deals, reviews, and analytics — all in one
              place. Log in to your business account, or create one in under a
              minute.
            </p>

            <ul className="mt-5 space-y-2">
              {[
                { icon: FiBarChart2, text: 'Real-time performance analytics' },
                { icon: FiTag, text: 'Create and manage deals & promotions' },
                {
                  icon: FiMessageSquare,
                  text: 'Reply to customer reviews instantly',
                },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-amber-400">
                    <Icon size={12} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/business/signin"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300"
              >
                <FiLogIn size={15} />
                Log in
              </Link>
              <Link
                to="/business/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <FiUserPlus size={15} />
                Create account
              </Link>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs text-white/50">
                Just exploring? Preview the dashboard with sample data.
              </p>
              <button
                type="button"
                onClick={onShowDemo}
                className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white/90 underline underline-offset-4 decoration-white/30 transition-colors hover:text-white hover:decoration-white"
              >
                Show Demo Data
                <FiArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* ==================== RIGHT: Preview mockup (desktop) ==================== */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-3xl bg-amber-400/10 blur-3xl" />

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-[10px] uppercase tracking-widest text-white/40">
                  localspot / business
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Views', value: '12.4k' },
                  { label: 'Reviews', value: '48' },
                  { label: 'Leads', value: '324' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                  >
                    <p className="text-base font-bold text-white">
                      {s.value}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-end gap-1.5 h-20 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-amber-400/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="mt-3 space-y-1.5">
                {[
                  'The Copper Chimney',
                  'Skyline Terrace',
                  'Palmwood Suites',
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-400/20 text-amber-400">
                        <FiCheck size={10} />
                      </span>
                      <span className="text-xs text-white/80">{name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const BusinessPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [showDemo, setShowDemo] = useState(false)

  const isAuthenticated = Boolean(userInfo)
  const canViewDashboard = isAuthenticated || showDemo

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {!isAuthenticated && showDemo && (
        <div className="w-full bg-amber-400 text-amber-950">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider">
              Previewing with demo data — actions are disabled
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/business/signin"
                className="text-xs font-bold underline underline-offset-2 hover:no-underline"
              >
                Log in
              </Link>
              <button
                type="button"
                onClick={() => setShowDemo(false)}
                className="text-xs font-bold underline underline-offset-2 hover:no-underline"
              >
                Exit preview
              </button>
            </div>
          </div>
        </div>
      )}

      {canViewDashboard ? (
        <>
          <BusinessHero />
          <BusinessStats />
          <BusinessListings />
          <BusinessDeals />
          <BusinessReviews />
          <Footer />
        </>
      ) : (
        <LockedBusinessPage onShowDemo={() => setShowDemo(true)} />
      )}
    </div>
  )
}

export default BusinessPage