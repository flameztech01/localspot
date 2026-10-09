import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from '../hooks/useToast'
import {
  FiMail,
  FiSend,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiMessageSquare,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
  FiExternalLink,
} from 'react-icons/fi'
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa6'

// --- Official contact & social URLs ---
const OFFICIAL_EMAIL = 'Local.spot.co@gmail.com'
const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/19cKqfiyHS/',
  linkedin: 'https://www.linkedin.com/pulse/localspot-localspot-nigeria-8lbwe',
  instagram: 'https://www.instagram.com/localspot_nigeria?stkn=d3U1YXU4bjY3aDZp',
}

// --- Department / Inquiry Types ---
const INQUIRY_TYPES = [
  { id: 'general', label: 'General Inquiry' },
  { id: 'business', label: 'Merchant Listing & Verification' },
  { id: 'advertising', label: 'Advertising & Sponsorship' },
  { id: 'correction', label: 'Report Inaccurate Venue / Hours' },
  { id: 'partnership', label: 'Partnership & Press' },
]

// --- Supported Cities ---
const CITIES = ['Port Harcourt', 'Lagos', 'Abuja', 'Ibadan', 'Enugu', 'Kano', 'Other']

// --- Frequently Asked Questions ---
const FAQS = [
  {
    question: 'How do I list my business on LocalSpot?',
    answer:
      'You can register your venue in less than 5 minutes by clicking "List Your Business" in the navigation bar. Provide your business name, address, opening hours, high-quality photos, and contact info. Our verification team will validate the details within 24 to 48 hours.',
  },
  {
    question: 'Is it free for locals and travelers to explore and bookmark spots?',
    answer:
      'Yes, LocalSpot is 100% free for community explorers. You can browse categories, filter by city or vibe, view full menus, bookmark your favorite spots, and write candid reviews at zero cost.',
  },
  {
    question: 'How do I promote my restaurant or club to get more visitors?',
    answer:
      'Once your merchant account is verified, you can access the "Promotions" and "Advertisements" tabs in your Business Dashboard. There, you can launch homepage featured banners, discounted meal vouchers, and neighborhood-targeted spotlight ads.',
  },
  {
    question: 'How do I report inaccurate hours, a phone number change, or a permanent closure?',
    answer:
      'You can either use the contact form on this page selecting "Report Inaccurate Venue / Hours", or email us directly at Local.spot.co@gmail.com. Our team inspects and updates the directory promptly.',
  },
  {
    question: 'What is the average response time for inquiries?',
    answer:
      'Our team typically replies within 2 to 4 hours during normal business days (Monday to Saturday). For fastest attention, write to Local.spot.co@gmail.com or send a direct message on our social channels.',
  },
]

const Contact = () => {
  const { showToast } = useToast()

  // --- Form state ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Port Harcourt',
    inquiryType: 'general',
    subject: '',
    message: '',
  })

  // --- Form submission states ---
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)
  const [copiedItem, setCopiedItem] = useState(null)

  // --- FAQ open accordion state ---
  const [openFaq, setOpenFaq] = useState(0)

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(key)
    showToast(`Copied ${text} to clipboard!`, 'info', 2500)
    setTimeout(() => {
      setCopiedItem(null)
    }, 2500)
  }

  // Field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Validate form
  const validate = () => {
    const errs = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name (at least 2 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.'
    }

    if (formData.phone.trim() && formData.phone.trim().length < 7) {
      errs.phone = 'Please provide a valid phone number or leave blank.'
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 4) {
      errs.subject = 'Please enter a clear subject (at least 4 characters).'
    }

    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errs.message = 'Please provide details in your message (at least 15 characters).'
    }

    return errs
  }

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('Please fix the errors in the form before submitting.', 'error', 3500)
      return
    }

    setIsSubmitting(true)

    // Simulate reliable API submission
    setTimeout(() => {
      const ticketId = `LSP-${Math.floor(100000 + Math.random() * 900000)}`
      const payload = {
        id: ticketId,
        ...formData,
        timestamp: new Date().toISOString(),
      }

      try {
        const existing = JSON.parse(localStorage.getItem('localspot_inquiries') || '[]')
        localStorage.setItem('localspot_inquiries', JSON.stringify([payload, ...existing]))
      } catch {
        // Fallback
      }

      setIsSubmitting(false)
      setSubmittedTicket(payload)
      showToast('Your message has been sent successfully! Our team will respond shortly.', 'success', 4000)
    }, 850)
  }

  // Reset to send another message
  const handleResetForm = () => {
    setSubmittedTicket(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: 'Port Harcourt',
      inquiryType: 'general',
      subject: '',
      message: '',
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO HEADER ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-gray-100">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-5 border border-blue-200">
              <FiMessageSquare className="h-3.5 w-3.5 text-blue-600" />
              <span>We’re Here to Help</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
              Get in touch with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                LocalSpot
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have a question about a venue, need assistance with your merchant dashboard,
              or looking to partner with us? Reach out directly via email or our official social channels.
            </p>
          </div>
        </section>

        {/* ================= FAST CONTACT CHANNELS ================= */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Official Email */}
              <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                    <FiMail size={22} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Direct Email Support</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    For consumer discovery questions, account issues, and merchant support.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-gray-900 break-all">{OFFICIAL_EMAIL}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`mailto:${OFFICIAL_EMAIL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Open in Mail</span>
                    <FiExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(OFFICIAL_EMAIL, 'official_email')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {copiedItem === 'official_email' ? (
                      <>
                        <FiCheck size={13} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Merchant Partnerships */}
              <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                    <FiCheckCircle size={22} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Merchant & Ads Desk</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Venue verification, ads placement, and merchant portal onboarding.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-gray-900 break-all">{OFFICIAL_EMAIL}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Priority Review</span>
                  <a
                    href={`mailto:${OFFICIAL_EMAIL}?subject=Merchant%20Listing%20Inquiry%20-%20LocalSpot`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Send Message</span>
                    <FiExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Card 3: Social Communities */}
              <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                    <FiMessageSquare size={22} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Official Social Channels</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Connect with our active community on Facebook, Instagram, and LinkedIn.
                  </p>
                  
                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LocalSpot on Facebook"
                      className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white"
                      title="Follow on Facebook"
                    >
                      <FaFacebook size={16} />
                    </a>
                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LocalSpot on Instagram"
                      className="h-9 w-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center transition-all hover:bg-pink-600 hover:text-white"
                      title="Follow on Instagram"
                    >
                      <FaInstagram size={16} />
                    </a>
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LocalSpot on LinkedIn"
                      className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center transition-all hover:bg-blue-700 hover:text-white"
                      title="Connect on LinkedIn"
                    >
                      <FaLinkedin size={16} />
                    </a>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Follow & Message</span>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>@localspot_nigeria</span>
                    <FiExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE CONTACT FORM & COMMUNITY CHANNELS ================= */}
        <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form Column (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
                {submittedTicket ? (
                  /* Success View */
                  <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                      <FiCheckCircle size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Message Received!</h2>
                    <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                      Thank you for contacting LocalSpot, <strong>{submittedTicket.name}</strong>.
                      Our team has received your inquiry and will reach out via{' '}
                      <strong>{submittedTicket.email}</strong> shortly.
                    </p>

                    <div className="mt-6 inline-block bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600">
                      <span>Ticket Reference: </span>
                      <strong className="text-gray-900 font-mono text-sm">{submittedTicket.id}</strong>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <FiRefreshCw size={15} />
                        <span>Send Another Message</span>
                      </button>
                      <Link
                        to="/search"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span>Explore Spots</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        Send us a message
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Fill in your details and our team will get back to you promptly.
                      </p>
                    </div>

                    {/* Inquiry Type Pills */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Reason for Inquiry <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INQUIRY_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, inquiryType: type.id }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              formData.inquiryType === type.id
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Gabriel Tariere"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.name
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@domain.com"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Phone Number <span className="text-gray-400 text-[10px]">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 800 000 0000"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.phone
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          City / Region
                        </label>
                        <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                        >
                          {CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief summary of your inquiry"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.subject
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {errors.subject && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <FiAlertCircle size={12} /> {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-gray-400">
                          {formData.message.length} chars
                        </span>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please write your questions, details, or feedback here..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.message
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <FiAlertCircle size={12} /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <FiSend size={16} />
                            <span>Submit Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column: Connect Online & Fast Actions (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Official Online Channels Card */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-2">
                      Digital Channels
                    </span>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      Connect with LocalSpot Online
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      Follow our official community pages to discover new venues, read featured write-ups, and get support.
                    </p>
                  </div>

                  {/* Channel Links */}
                  <div className="space-y-3 pt-1">
                    {/* Facebook */}
                    <a
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/60 hover:bg-blue-50/60 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <FaFacebook size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Facebook Page
                          </p>
                          <p className="text-[11px] text-gray-500">Official updates & community shares</p>
                        </div>
                      </div>
                      <FiExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </a>

                    {/* Instagram */}
                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/60 hover:bg-pink-50/60 hover:border-pink-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                          <FaInstagram size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                            Instagram Profile
                          </p>
                          <p className="text-[11px] text-gray-500">@localspot_nigeria</p>
                        </div>
                      </div>
                      <FiExternalLink size={14} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/60 hover:bg-blue-50/60 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#0077B5] text-white flex items-center justify-center shadow-xs">
                          <FaLinkedin size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            LinkedIn Publication
                          </p>
                          <p className="text-[11px] text-gray-500">Pulse: Localspot Nigeria</p>
                        </div>
                      </div>
                      <FiExternalLink size={14} className="text-gray-400 group-hover:text-blue-700 transition-colors" />
                    </a>

                    {/* Direct Gmail */}
                    <a
                      href={`mailto:${OFFICIAL_EMAIL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/60 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <FiMail size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            Official Gmail Inbox
                          </p>
                          <p className="text-[11px] text-gray-500 break-all">{OFFICIAL_EMAIL}</p>
                        </div>
                      </div>
                      <FiExternalLink size={14} className="text-gray-400 group-hover:text-emerald-700 transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Direct Merchant Hotline Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-7 text-white shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                      Business Owners
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Need fast-track merchant listing?
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed mb-4">
                    Claim your existing venue or list a brand new restaurant or hotel to reach thousands of monthly explorers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <Link
                      to="/business"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      <span>Visit Merchant Portal</span>
                      <FiArrowRight size={13} />
                    </Link>
                    <a
                      href={`mailto:${OFFICIAL_EMAIL}?subject=Urgent%20Merchant%20Listing%20Assistance`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2.5 rounded-xl transition-all"
                    >
                      <FiMail size={13} />
                      <span>Email Merchant Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                Clear Answers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Got quick questions? Check out our most common answers below.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    key={faq.question}
                    className="border border-gray-200/90 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50/70 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <FiChevronDown
                        size={18}
                        className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500">
                Still have questions? Reach out directly via{' '}
                <a
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {OFFICIAL_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
