import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FiMapPin,
  FiCompass,
  FiShield,
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiCheckCircle,
  FiHeart,
  FiGlobe,
  FiMail,
} from 'react-icons/fi'
import { FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6'

// --- Impact statistics ---
const STATS = [
  { value: '5,000+', label: 'Verified Spots', sub: 'Cafes, hotels & spots' },
  { value: '6+', label: 'Metropolitan Cities', sub: 'Across Nigeria' },
  { value: '120k+', label: 'Monthly Explorers', sub: 'Local & international' },
  { value: '98%', label: 'Merchant Satisfaction', sub: 'Listing accuracy & growth' },
]

// --- Core pillars / values ---
const PILLARS = [
  {
    icon: FiCompass,
    title: 'Hyperlocal Authenticity',
    description:
      'We believe every neighborhood has a unique heartbeat. We showcase real spots, authentic menus, and true vibes—no cookie-cutter suggestions.',
    color: 'bg-blue-50 text-blue-600 border-blue-150',
  },
  {
    icon: FiTrendingUp,
    title: 'Merchant Empowerment',
    description:
      'Local businesses are the backbone of our communities. We equip independent restaurant owners, boutique hoteliers, and creators with modern digital tools.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-150',
  },
  {
    icon: FiShield,
    title: 'Verified Reliability',
    description:
      'Nothing ruins an outing like arriving to a closed door or outdated price. Our verification team continuously validates operational hours and addresses.',
    color: 'bg-amber-50 text-amber-600 border-amber-150',
  },
  {
    icon: FiHeart,
    title: 'Community First',
    description:
      'Constructed for real locals, foodies, culture enthusiasts, and adventurous travelers seeking memorable experiences in vibrant African cities.',
    color: 'bg-rose-50 text-rose-600 border-rose-150',
  },
]

// --- How It Works workflow data ---
const HOW_IT_WORKS = {
  explorers: [
    {
      step: '01',
      title: 'Search & Filter by Vibe',
      desc: 'Filter by city, cuisine, price point, ambience, or dietary preferences to find your exact match in seconds.',
    },
    {
      step: '02',
      title: 'Review Verified Details',
      desc: 'Browse up-to-date menus, operating hours, authentic photos, and candid reviews left by real neighborhood patrons.',
    },
    {
      step: '03',
      title: 'Save, Claim Deals & Visit',
      desc: 'Bookmark places into custom collections, unlock special merchant promos, and navigate with pinpoint accuracy.',
    },
  ],
  merchants: [
    {
      step: '01',
      title: 'Claim or List Your Venue',
      desc: 'Set up your verified business profile in minutes with contact information, photo galleries, and menu items.',
    },
    {
      step: '02',
      title: 'Run Promotions & Ads',
      desc: 'Publish seasonal discounts, happy hour specials, and sponsored homepage placements targeted to your neighborhood.',
    },
    {
      step: '03',
      title: 'Track Reach & Engagement',
      desc: 'Access real-time analytics on profile visits, route clicks, menu views, and customer reviews from your dedicated dashboard.',
    },
  ],
}

// --- Supported Cities ---
const CITIES = [
  {
    name: 'Port Harcourt',
    state: 'Rivers State',
    highlight: 'The Garden City with premier lounges, coastal hospitality, and fine dining.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    count: '1,450+ Spots',
  },
  {
    name: 'Lagos',
    state: 'Lagos State',
    highlight: 'The bustling economic and nightlife capital with eclectic bistros and boutique stays.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    count: '2,200+ Spots',
  },
  {
    name: 'Abuja',
    state: 'Federal Capital Territory',
    highlight: 'Polished garden cafes, diplomatic dining, and scenic outdoor recreational spaces.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    count: '980+ Spots',
  },
  {
    name: 'Ibadan',
    state: 'Oyo State',
    highlight: 'Rich cultural heritage blended with cozy student hangouts and historic retreats.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    count: '420+ Spots',
  },
]

// --- Leadership Team ---
const TEAM = [
  {
    name: 'Tariere Gabriel',
    role: 'Founder & Chief Executive Officer',
    bio: 'Passionate about urban mobility, local commerce, and building digital infrastructure for emerging African markets.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    linkedin: 'https://www.linkedin.com/pulse/localspot-localspot-nigeria-8lbwe',
  },
  {
    name: 'Nkemdilim Okonkwo',
    role: 'Head of Merchant Partnerships',
    bio: 'Championing local business owners across Nigeria, streamlining digital onboarding and merchant growth programs.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    linkedin: 'https://www.linkedin.com/pulse/localspot-localspot-nigeria-8lbwe',
  },
  {
    name: 'Adekunle Bakare',
    role: 'VP of Engineering',
    bio: 'Leading our core platform, geospatial search engine, and high-performance microservices architecture.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    linkedin: 'https://www.linkedin.com/pulse/localspot-localspot-nigeria-8lbwe',
  },
  {
    name: 'Zainab Al-Hassan',
    role: 'Head of Product Design & Brand',
    bio: 'Crafting intuitive discovery interfaces that blend aesthetic elegance with effortless community engagement.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    linkedin: 'https://www.linkedin.com/pulse/localspot-localspot-nigeria-8lbwe',
  },
]

// --- Testimonials / Community Voices ---
const VOICES = [
  {
    quote:
      'Finding weekend breakfast spots in Port Harcourt used to mean asking on group chats and hoping the info was fresh. With LocalSpot, I found hidden spots I had driven past for years.',
    author: 'Chidinma E.',
    role: 'Food Enthusiast, Port Harcourt',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
  },
  {
    quote:
      'As a boutique cafe owner in Lekki, listing our weekly specials on Localspot increased our foot traffic by over 35% in our first two months. The merchant dashboard is a breath of fresh air.',
    author: 'Femi A.',
    role: 'Managing Director, Bean & Blossom Cafe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
]

const About = () => {
  const [activeTab, setActiveTab] = useState('explorers')

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-gray-100">
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-6 shadow-xs border border-blue-200">
                <FiCompass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
                <span>The Hyperlocal Discovery Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
                Connecting people to the pulse of their{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  neighborhoods.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-normal">
                LocalSpot bridges the gap between vibrant local culture, independent venues,
                and curious explorers. From neighborhood cafes to boutique hotels and cultural landmarks,
                we make authentic discovery effortless.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Explore Curated Spots</span>
                  <FiArrowRight size={16} />
                </Link>

                <Link
                  to="/business"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 shadow-xs transition-all hover:bg-gray-50 hover:border-gray-300"
                >
                  <span>List Your Business</span>
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiMail size={16} />
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all hover:shadow-md hover:border-blue-200"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 rounded-bl-full transition-transform group-hover:scale-110 -z-0 opacity-60" />
                  <div className="relative z-10">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= OUR STORY SECTION ================= */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Story Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Our Origin Story
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  Born from a simple frustration:{' '}
                  <span className="text-blue-600">
                    Why is it so hard to find the real gems in our own cities?
                  </span>
                </h2>

                <p className="text-base text-gray-600 leading-relaxed">
                  In rapidly expanding urban centers like Port Harcourt, Lagos, and Abuja, thousands
                  of phenomenal spaces exist—from quiet rooftop lounges with city vistas, to artisanal
                  bakeries and boutique retreats. Yet, finding them was consistently difficult: outdated
                  social media handles, disconnected review pages, and inaccurate Google listings.
                </p>

                <p className="text-base text-gray-600 leading-relaxed">
                  We built <strong className="text-gray-900 font-semibold">LocalSpot</strong> to solve this.
                  Not just as another generic directory, but as a living, community-backed pulse of each
                  neighborhood. We give small business owners the dignity of modern digital marketing
                  tools while offering city dwellers and travelers a trustworthy compass for every weekend,
                  date night, or family outing.
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    '100% verified locations & operating hours',
                    'Direct contact with merchant managers',
                    'High-resolution imagery & honest user ratings',
                    'Empowering local businesses with digital visibility',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <FiCheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 bg-gray-900">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
                      alt="Local dining ambiance"
                      className="w-full h-[360px] sm:h-[440px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />
                    
                    {/* Top location tag */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Old GRA • Port Harcourt
                      </span>
                    </div>

                    {/* Bottom caption text - fully visible with zero overlap */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <p className="text-base sm:text-lg font-bold leading-snug drop-shadow-sm">
                        Curating authentic spaces that make our cities unforgettable.
                      </p>
                    </div>
                  </div>

                  {/* Quality Verified Callout Card - positioned neatly below with no overlapping */}
                  <div className="mt-4 bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 hover:border-blue-200 transition-colors">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                      <FiAward size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Quality Verified</p>
                      <p className="text-sm font-bold text-gray-900">Only genuine, hand-vetted establishments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CORE VALUES & PILLARS ================= */}
        <section className="py-16 sm:py-24 bg-gray-50 border-y border-gray-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Guided by uncompromising values
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Every feature we build and every merchant we verify is shaped by our core principles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="group bg-white rounded-2xl border border-gray-200/80 p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className={`inline-flex items-center justify-center h-12 w-12 rounded-xl border ${pillar.color} mb-5 shadow-xs`}
                      >
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW LOCALSPOT WORKS ================= */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                The Ecosystem
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                How LocalSpot delivers value
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Whether you’re stepping out for brunch or running a neighborhood restaurant, LocalSpot is designed for you.
              </p>

              {/* Toggle Tabs */}
              <div className="mt-8 inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('explorers')}
                  className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'explorers'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Explorers & Locals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('merchants')}
                  className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'merchants'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Business Owners
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {HOW_IT_WORKS[activeTab].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-xs hover:border-blue-300 transition-all group"
                >
                  <span className="text-4xl font-black text-blue-500/30 group-hover:text-blue-600 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              {activeTab === 'explorers' ? (
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Start exploring your city now <FiArrowRight size={15} />
                </Link>
              ) : (
                <Link
                  to="/business/signup"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Register your business today <FiArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ================= CITIES WE CELEBRATE ================= */}
        <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
                  Coverage
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  Discovering Nigerian cities
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
                  We are expanding our footprint across the continent’s most exciting urban destinations.
                </p>
              </div>

              <Link
                to="/search"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Browse all cities <FiArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CITIES.map((city) => (
                <Link
                  key={city.name}
                  to={`/search?city=${encodeURIComponent(city.name)}`}
                  className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                        {city.state}
                      </span>
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium">
                        {city.count}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                      {city.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {city.highlight}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LEADERSHIP & TEAM ================= */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                The Architects
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Meet the leadership team
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                A dedicated team of technologists, hospitality veterans, and community builders committed to spotlighting the best in local culture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="group rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{member.bio}</p>
                  
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-gray-500">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn Pulse`}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <FaLinkedinIn size={13} />
                      <span>LinkedIn Pulse</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMMUNITY VOICES / TESTIMONIALS ================= */}
        <section className="py-16 sm:py-20 bg-blue-50/50 border-y border-blue-100/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="inline-block rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
                Voices of LocalSpot
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Trusted by explorers and business leaders alike
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {VOICES.map((v) => (
                <div
                  key={v.author}
                  className="bg-white rounded-2xl border border-blue-100/90 p-7 shadow-xs flex flex-col justify-between"
                >
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic mb-6">
                    "{v.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={v.avatar}
                      alt={v.author}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{v.author}</p>
                      <p className="text-xs text-gray-500">{v.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA BANNER ================= */}
        <section className="py-16 sm:py-20 bg-gray-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Ready to uncover your city’s best-kept secrets?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
              Join thousands of community members exploring the finest dining, accommodations, and hidden gems across Nigeria.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500"
              >
                <span>Start Exploring</span>
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-7 py-3.5 text-sm font-bold text-gray-200 transition-all hover:bg-gray-800 hover:border-gray-600"
              >
                <span>Contact Our Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
