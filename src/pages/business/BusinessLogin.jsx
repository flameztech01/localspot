import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi'

import { useLoginBusinessAccountMutation } from '../../features/businessApiSlice'
import { setCredentials } from '../../features/auth/authSlice'
import { useToast } from '../../hooks/useToast'

// --- 10 High-Quality Images for the Slider ---
const sliderImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=1200',
]

const BusinessLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()

  // --- RTK Query mutation ---
  const [loginBusiness, { isLoading }] = useLoginBusinessAccountMutation()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Slider State
  const [activeImage, setActiveImage] = useState(0)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Auto-play Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = formData.email.trim().toLowerCase()

    try {
      const payload = {
        email,
        password: formData.password,
      }

      const result = await loginBusiness(payload).unwrap()

      // Backend response shape:
      // { success, message, data: { _id, businessName, email, role, ... }, token }
      const account = result?.data || result?.account || null
      const token = result?.token || null

      if (!account || !token) {
        showToast('Login response was malformed. Please try again.', 'error')
        return
      }

      dispatch(
        setCredentials({
          ...account,
          token,
        })
      )

      showToast(result?.message || 'Welcome back!', 'success')

      // Route by role — admins go to the admin dashboard, businesses to their dashboard
      const role = account.role
      const destination =
        role === 'admin'
          ? '/admin?tab=dashboard'
          : '/business'

      // Give the toast a moment to be seen before redirecting
      setTimeout(() => navigate(destination, { replace: true }), 800)
    } catch (err) {
      const status = err?.status
      const msg =
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        'Invalid email or password. Please try again.'

      // Backend sends 403 for unverified accounts + fresh OTP.
      // Route the user to the signup/verify step with their email prefilled.
      if (status === 403 && /not verified/i.test(msg)) {
        showToast(msg, 'error')
        navigate('/business/signup', {
          state: { verifyEmail: email, fromLogin: true },
        })
        return
      }

      showToast(msg, 'error')
    }
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
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="LocalSpot"
              className="h-7 w-7 object-contain brightness-0 invert"
            />
            <span className="font-bold tracking-wide text-white">
              LOCALSPOT
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <span className="text-white/40">|</span>
            <span className="text-white/80">
              New to LocalSpot?{' '}
              <Link
                to="/business/signup"
                className="font-semibold text-white hover:underline"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>

        {/* Glass Morphism Text Block + Copyright */}
        <div className="absolute bottom-10 left-12 right-12 z-10 flex flex-col gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome back.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Log in to manage your business presence, connect with locals, and
              keep your profile up to date.
            </p>
          </div>

          <p className="text-[10px] text-white/50 text-center tracking-wide">
            &copy; LocalSpot Systems Ltd. Business Account Center - Where Local
            Ecommerce Meets Directory
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM (Scrolls naturally) ================= */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 lg:bg-white lg:h-screen lg:overflow-y-auto">
        {/* Mobile Header (Fixed/Sticky) */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="LocalSpot"
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-bold tracking-wide">LOCALSPOT</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Link to="/support">Support</Link>
            <span>|</span>
            <Link
              to="/business/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
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
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Log in to your LocalSpot business account
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="name@business.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Link
                      to="/business/forgot-password"
                      className="text-[10px] text-blue-600 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-xs text-gray-600">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>
              </form>

              {/* Bottom Link */}
              <div className="mt-6 text-center lg:text-left">
                <p className="text-xs text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/business/signup"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Sign up
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

export default BusinessLogin