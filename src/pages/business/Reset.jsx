import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMapPin, FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

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

const Reset = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Slider State
  const [activeImage, setActiveImage] = useState(0)

  // Auto-play Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // Simulate API call to send reset link
    setIsSubmitted(true)
  }

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
              Remember your password?{' '}
              <Link to="/business/signin" className="font-semibold text-white hover:underline">Log in</Link>
            </span>
          </div>
        </div>

        {/* Glass Morphism Text Block + Copyright */}
        <div className="absolute bottom-10 left-12 right-12 z-10 flex flex-col gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">
              Reset your password.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              We'll help you get back into your account securely and quickly.
            </p>
          </div>
          
          <p className="text-[10px] text-white/50 text-center tracking-wide">
            &copy; LocalSpot Systems Ltd. Business Account Center - Where Local Ecommerce Meets Directory
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM (Scrolls naturally) ================= */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 lg:bg-white lg:h-screen lg:overflow-y-auto">
        
        {/* Mobile Header (Fixed/Sticky) */}
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
            
            {/* Back Button (History) */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <FiArrowLeft size={14} />
              Go back
            </button>

            {/* Top Icon */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                {isSubmitted ? <FiCheckCircle size={22} /> : <FiMail size={22} />}
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isSubmitted ? 'Check your email' : 'Reset your password'}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {isSubmitted 
                  ? "We've sent a password reset link to your email address." 
                  : "Enter your email address and we'll send you a link to reset your password."
                }
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              {isSubmitted ? (
                <div className="text-center space-y-6">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Try another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Email Address */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="mt-6 text-center lg:text-left">
                <Link 
                  to="/business/signin" 
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft size={14} />
                  Back to log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reset