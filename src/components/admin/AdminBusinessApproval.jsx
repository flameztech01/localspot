import React, { useState } from 'react'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiExternalLink,
  FiEdit,
  FiShield,
  FiUser,
  FiCalendar,
  FiInfo,
  FiShare2
} from 'react-icons/fi'

const AdminBusinessApproval = ({
  business,
  onBack,
  onApprove,
  onReject,
  onToast
}) => {
  const [checklist, setChecklist] = useState({
    taxId: true,
    addressMatch: true,
    pricingVerified: true,
    phoneEmailVerified: true
  })

  const [reviewerNotes, setReviewerNotes] = useState('')
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('Missing required tax documentation')
  const [currentStep, setCurrentStep] = useState(3) // 3 = Review (Current stage)
  const [approvalStatus, setApprovalStatus] = useState(business?.status || 'Pending Review')

  // Fallback data if business is missing
  const b = business || {
    id: 'BID-09381',
    name: 'Artisan Roasters & Bakery',
    category: 'Food & Beverage -> Cafe & Bakery',
    subCategory: 'Restaurant & Bar',
    location: 'Downtown Core, Austin, TX',
    address: '400 Congress Ave, Suite 120',
    city: 'Austin',
    state: 'Texas 78701',
    neighborhood: 'Downtown Arts & Financial District',
    coordinates: '30.2672° N, 97.7431° W',
    status: 'Pending Review',
    owner: 'Marina Garcia',
    ownerEmail: 'hello@artisanroasters.example.com',
    phone: '+1 (512) 555-0184',
    whatsapp: '+1 (512) 555-0184',
    website: 'artisanroasters.example.com',
    created: 'Oct 24, 2026 - 14:32 UTC',
    rating: 4.9,
    priceRange: '$$ Moderate • $10 - $25 per person',
    claimCode: '#AR-Austin-9242',
    isClaimed: true,
    tagline: 'Handcrafted espresso, fresh sourdough, and community gathering space.',
    description:
      'Founded in 2018, Artisan Roasters & Bakery blends small-batch single-origin coffees alongside naturally fermented artisanal breads and Viennoiserie pastries. We partner directly with sustainable coffee farms in Colombia, Ethiopia, and Guatemala. Our open-concept seating provides high-speed fiber internet for remote workers, alongside outdoor terrace hospitality for weekend gatherings and private events.',
    hours: 'Mon - Fri: 6:30 AM - 6:00 PM\nSat - Sun: 7:00 AM - 5:00 PM',
    services: ['Dine-in', 'Takeaway', 'Curbside pickup', 'Workspace board', 'Private events'],
    amenities: ['Free Wi-Fi', 'Wheelchair accessible', 'Outdoor patio', 'Pet friendly', 'Power sockets'],
    media: {
      logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        { title: 'Exterior seating', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80' },
        { title: 'Espresso bar', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80' },
        { title: 'Bakery case', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { title: 'Patio area', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  }

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleApproveAction = () => {
    setApprovalStatus('Approved')
    setCurrentStep(4)
    if (onApprove) onApprove(b.id)
    if (onToast) onToast(`Business "${b.name}" approved successfully!`)
  }

  const handleConfirmReject = () => {
    setApprovalStatus('Rejected')
    setRejectionModalOpen(false)
    if (onReject) onReject(b.id, rejectionReason)
    if (onToast) onToast(`Business "${b.name}" review updated with change request.`)
  }

  const steps = [
    { num: 1, name: 'Draft', status: 'Completed' },
    { num: 2, name: 'Submitted', status: 'Completed' },
    { num: 3, name: 'Review', status: 'Current stage' },
    { num: 4, name: 'Approved', status: 'Pending' },
    { num: 5, name: 'Published', status: 'Scheduled' },
    { num: 6, name: 'Lifecycle', status: 'Stages' }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Navigation & Review Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200/80">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors self-start"
        >
          <FiArrowLeft size={14} />
          <span>Back to businesses</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-medium text-gray-500">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold flex items-center gap-1 shadow-xs">
            <FiUser size={12} />
            <span>Moderator Favour L.</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold">
            SLA Target 24h: <strong className="text-amber-700">18h remaining</strong>
          </span>
          <span className="hidden md:inline text-gray-400">
            Submitted: Oct 24, 2026 - 14:32 UTC
          </span>
          <span className="hidden lg:inline text-gray-400">
            New registration • Submitter: Owner
          </span>
        </div>
      </div>

      {/* Main Approval Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Business approval
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                approvalStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : approvalStatus === 'Rejected'
                  ? 'bg-rose-50 text-rose-700 border border-rose-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {approvalStatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Verify new commercial listings and their documented basics before they go live in the directory.
          </p>
        </div>
      </div>

      {/* 6-Step Stepper Bar (Screenshot 2) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] gap-2">
          {steps.map((step) => {
            const isCompleted = step.num < currentStep
            const isCurrent = step.num === currentStep
            return (
              <div
                key={step.num}
                className={`flex-1 flex flex-col p-2.5 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-900 shadow-xs'
                    : isCompleted
                    ? 'bg-gray-50 border border-gray-200 text-gray-800'
                    : 'bg-white border border-gray-100 text-gray-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>{step.name}</span>
                  {isCompleted ? (
                    <FiCheckCircle className="text-blue-600" size={13} />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  ) : null}
                </div>
                <div className="text-[10px] font-medium text-gray-500">
                  {isCurrent ? 'Current stage' : step.status}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Business Hero Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                b.thumbnail ||
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80'
              }
              alt={b.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-gray-900">{b.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                  {b.subCategory || 'Restaurant & Bar'}
                </span>
                {b.isClaimed && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                    Claimed
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Coffee &amp; Beverage • Specialty coffee • Downtown Core, Austin, TX
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2 font-mono">
                <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  Claim code: {b.claimCode || '#AR-Austin-9242'}
                </span>
                <a
                  href={`https://${b.website || 'artisanroasters.example.com'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-sans"
                >
                  {b.website || 'artisanroasters.example.com'}
                  <FiExternalLink size={12} />
                </a>
                <span className="text-gray-500 font-sans">{b.phone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToast && onToast('Editing mode opened')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors shrink-0"
          >
            <FiEdit size={13} />
            <span>Edit</span>
          </button>
        </div>

        {/* Notice line */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
          <FiInfo size={14} className="text-blue-500 shrink-0" />
          <span>Accepting congratulations, kick-start unit needs checks against the listing policies.</span>
        </div>
      </div>

      {/* Two Column Layout (Profile Details Left + Review Decision Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): All 5 profile sections + media inspection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1 of 5: Business profile */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Business profile</h3>
              <span className="text-[11px] font-bold text-gray-400">Section 1 of 5</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Official business name
                  </span>
                  <div className="font-bold text-gray-900 text-sm">{b.name}</div>
                </div>
                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Primary category
                  </span>
                  <div className="font-semibold text-gray-900">{b.category}</div>
                </div>
              </div>

              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Tagline
                </span>
                <p className="font-medium text-gray-800">{b.tagline}</p>
              </div>

              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Description (story &amp; ethos)
                </span>
                <p className="text-gray-700 leading-relaxed font-normal">{b.description}</p>
              </div>
            </div>
          </div>

          {/* Section 2 of 5: Contact information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Contact information</h3>
              <span className="text-[11px] font-bold text-gray-400">Section 2 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Primary telephone
                  </span>
                  <div className="font-bold text-gray-900">{b.phone}</div>
                </div>
                <FiCheckCircle className="text-emerald-500" size={16} />
              </div>

              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    WhatsApp
                  </span>
                  <div className="font-bold text-gray-900">{b.whatsapp || b.phone}</div>
                </div>
                <FiCheckCircle className="text-emerald-500" size={16} />
              </div>

              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Inquiry email
                </span>
                <div className="font-medium text-gray-900">{b.ownerEmail}</div>
              </div>

              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Website
                </span>
                <div className="font-medium text-blue-600 flex items-center gap-1">
                  <span>{b.website}</span>
                  <FiExternalLink size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 of 5: Location & map */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Location &amp; map</h3>
              <span className="text-[11px] font-bold text-gray-400">Section 3 of 5</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address details */}
              <div className="space-y-3 text-xs">
                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Street address
                  </span>
                  <div className="font-bold text-gray-900">{b.address}</div>
                </div>

                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    City, state &amp; ZIP
                  </span>
                  <div className="font-medium text-gray-900">
                    {b.city}, {b.state}
                  </div>
                </div>

                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Neighborhood
                  </span>
                  <div className="font-medium text-gray-900">{b.neighborhood}</div>
                </div>

                <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    GPS coordinates
                  </span>
                  <div className="font-mono text-gray-700">{b.coordinates}</div>
                </div>
              </div>

              {/* Styled interactive map preview card (matching Screenshot 2) */}
              <div className="relative rounded-2xl overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 min-h-[220px]">
                {/* Blueprint lines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#5397F6_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Road representation lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30 stroke-blue-400" fill="none">
                  <path d="M 0 100 Q 150 120 300 80 T 500 130" strokeWidth="6" />
                  <path d="M 120 0 L 180 300" strokeWidth="4" />
                </svg>

                {/* Radar pulse around pin */}
                <div className="relative flex flex-col items-center">
                  <span className="absolute -top-1 w-12 h-12 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="px-3 py-1.5 rounded-xl bg-white shadow-lg border border-blue-200 text-[11px] font-bold text-blue-900 flex items-center gap-1.5 z-10">
                    <FiMapPin className="text-blue-600" size={13} />
                    <span>400 Congress Ave</span>
                  </div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-1 border-2 border-white shadow-md z-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 of 5: Operating schedule & price */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Operating schedule &amp; price</h3>
              <span className="text-[11px] font-bold text-gray-400">Section 4 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Hours</span>
                <div className="flex items-center justify-between font-semibold text-gray-800">
                  <span>Mon - Fri</span>
                  <span className="font-mono text-gray-600">6:30 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-gray-800">
                  <span>Sat - Sun</span>
                  <span className="font-mono text-gray-600">7:00 AM - 5:00 PM</span>
                </div>
              </div>

              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Price tier
                </span>
                <div className="font-bold text-gray-900 text-sm mt-1">{b.priceRange}</div>
                <p className="text-[11px] text-gray-500 mt-1">Average order ticket verified by menu sample.</p>
              </div>
            </div>
          </div>

          {/* Section 5 of 5: Services & amenities */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Services &amp; amenities</h3>
              <span className="text-[11px] font-bold text-gray-400">Section 5 of 5</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Services</span>
                <div className="flex flex-wrap gap-2">
                  {b.services?.map((svc) => (
                    <span
                      key={svc}
                      className="px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Amenities</span>
                <div className="flex flex-wrap gap-2">
                  {b.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media inspection (Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">Media inspection</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  3 of 3 requirements met
                </span>
              </div>
              <span className="text-xs text-gray-400">Verified resolution</span>
            </div>

            {/* Logo and Cover Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Logo</span>
                <div className="relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-slate-900 flex items-center justify-center">
                  <img
                    src={b.media?.logo}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                    400x400 PNG
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Cover banner</span>
                <div className="relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-slate-900">
                  <img
                    src={b.media?.cover}
                    alt="Cover banner preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                    1600x400 HDR
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery (4 submitted) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Gallery (4 submitted)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {b.media?.gallery?.map((g, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="h-20 rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={g.url}
                        alt={g.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 block truncate">
                      {g.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Review Decision & Audit History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Review Decision Card (Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
              Review decision
            </h3>

            {/* Status & SLA details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-amber-600">{approvalStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Assigned to</span>
                <span className="font-semibold text-gray-900">Favour L.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">SLA countdown</span>
                <span className="font-bold text-amber-700">18h remaining</span>
              </div>
            </div>

            {/* Compliance checklist */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Compliance checklist
              </span>

              <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.taxId}
                  onChange={() => toggleCheck('taxId')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Business registration and tax ID / State license matches physical registry</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.addressMatch}
                  onChange={() => toggleCheck('addressMatch')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Address and GPS coordinates match physical location</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.pricingVerified}
                  onChange={() => toggleCheck('pricingVerified')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Menu and pricing structure verified reasonable</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.phoneEmailVerified}
                  onChange={() => toggleCheck('phoneEmailVerified')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Contact phone and email domain verified</span>
              </label>
            </div>

            {/* Reviewer Notes Textarea */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Reviewer notes
                </span>
                <span className="text-[10px] text-gray-400">Optional internal</span>
              </div>
              <textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Add reviewer notes or instructions before changing status..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Action Buttons (Orange Approve Listing, Outline Reject - Screenshot 2) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleApproveAction}
                disabled={approvalStatus === 'Approved'}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-emerald-600 text-white font-bold text-xs shadow-sm shadow-amber-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <FiCheck size={16} />
                <span>{approvalStatus === 'Approved' ? 'Listing Approved' : 'Approve listing'}</span>
              </button>

              <button
                onClick={() => setRejectionModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-bold text-xs transition-colors"
              >
                Request changes / reject
              </button>

              <button
                onClick={() => setRejectionModalOpen(true)}
                className="w-full text-center text-[11px] text-gray-400 hover:text-gray-700 py-1"
              >
                Preview Rejection Message
              </button>
            </div>
          </div>

          {/* Audit History Card (Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Audit history</h3>
              <span className="text-[10px] font-bold text-gray-400">3 events</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Assigned to simon</div>
                  <div className="text-[11px] text-gray-500">Oct 25, 10:00 UTC - Assigned via Queue #4</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Automated checks passed</div>
                  <div className="text-[11px] text-gray-500">Oct 24, 14:35 UTC - Score: 0.94/1.00</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Registration submitted</div>
                  <div className="text-[11px] text-gray-500">Oct 24, 14:32 UTC - Marina Garcia [Owner]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection / Request Changes Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="text-amber-500" />
                Request Changes or Reject
              </h3>
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select the reason for requesting changes. An automated notification will be emailed to{' '}
              <strong className="text-gray-800">{b.ownerEmail}</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-700 block">Primary Reason</label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-blue-100"
              >
                <option value="Missing required tax documentation">
                  Missing required tax documentation
                </option>
                <option value="GPS Coordinates and address mismatch">
                  GPS Coordinates and address mismatch
                </option>
                <option value="Unclear or low-resolution venue media">
                  Unclear or low-resolution venue media
                </option>
                <option value="Duplicate listing suspected">
                  Duplicate listing suspected
                </option>
                <option value="Policy violation in business description">
                  Policy violation in business description
                </option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-gray-700 block">Reviewer Feedback Instructions</label>
              <textarea
                rows={3}
                placeholder="Specify what the business owner needs to correct before resubmitting..."
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-100"
                defaultValue="Please upload a verified state business permit and updated high-resolution photo of your entrance signage."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Send Request to Merchant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBusinessApproval
