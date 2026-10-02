import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiEye, FiEyeOff, FiChevronDown } from 'react-icons/fi'

// --- 10 High-Quality Images for the Slider ---
const sliderImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200', // Hotel
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200', // Restaurant
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200', // Lounge/Bar
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200', // Cafe
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200', // Resort
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', // Office/Workspace
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200', // Fine Dining
  'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=1200', // Rooftop Bar
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200', // Spa/Wellness
  'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=1200', // Boutique Hotel
]

const BusinessSignup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countryCode, setCountryCode] = useState('+1')
  const countryRef = useRef(null)
  
  // Slider State
  const [activeImage, setActiveImage] = useState(0)

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
  })

  // Auto-play Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Business account created successfully! (Frontend Demo)')
  }

  const countryCodes = [
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+234', label: 'NG' },
    { code: '+27', label: 'ZA' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-gray-900">
      
      {/* ================= LEFT SIDE: IMAGE SLIDER (Fixed/Sticky) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Venue slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Top Header Links */}
        <div className="absolute top-0 left-0 right-0 z-20 px-10 py-8 flex items-center justify-between text-sm text-white/90">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="LocalSpot" className="h-7 w-7 object-contain brightness-0 invert" />
            <span className="font-bold tracking-wide text-white">LOCALSPOT</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
            <span className="text-white/40">|</span>
            <span className="text-white/80">
              Already registered?{' '}
              <Link to="/business/signin" className="font-semibold text-white hover:underline">Log in</Link>
            </span>
          </div>
        </div>

        {/* Glass Morphism Text Block + Copyright */}
        <div className="absolute bottom-10 left-12 right-12 z-10 flex flex-col gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">
              Join LocalSpot.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Manage your business presence, connect with locals, and grow your reach in the community.
            </p>
          </div>
          
          <p className="text-[10px] text-white/50 text-center tracking-wide">
            &copy; LocalSpot Systems Ltd. Business Account Center - Where Local Ecommerce Meets Directory
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM (Scrolls naturally) ================= */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 lg:bg-white lg:h-screen lg:overflow-y-auto">
        
        {/* Mobile Header (Now Fixed/Sticky on Mobile) */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LocalSpot" className="h-6 w-6 object-contain" />
            <span className="text-sm font-bold tracking-wide">LOCALSPOT</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Link to="/support">Support</Link>
            <span>|</span>
            <Link to="/business/signin" className="font-medium text-blue-600 hover:underline">Log in</Link>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-[480px]">
            
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                <FiMapPin size={22} />
              </div>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Create your business account
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Join LocalSpot and start managing your business presence
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    placeholder="e.g. Maple Bakery & Cafe"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    This public name will be shown on your profile
                  </p>
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner / Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="name@business.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Used for signing in and account notifications
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-24 shrink-0" ref={countryRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className="w-full flex items-center justify-between bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <span>{countryCode}</span>
                        <FiChevronDown
                          className={`text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`}
                          size={14}
                        />
                      </button>

                      {isCountryOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.code)
                                setIsCountryOpen(false)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                                countryCode === country.code
                                  ? 'bg-blue-50 text-blue-600 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{country.code}</span>
                              <span className="text-[10px] text-gray-400">{country.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="555 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Must be 8+ characters</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Must include at least 8 characters, numbers and symbols.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2"
                >
                  Create Business Account
                </button>
              </form>

              <div className="mt-4 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-[11px] text-gray-500 leading-relaxed">
                  By continuing, you agree to LocalSpot's{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <div className="mt-6 text-center lg:text-left">
                <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <Link to="/business/signin" className="font-medium text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessSignup