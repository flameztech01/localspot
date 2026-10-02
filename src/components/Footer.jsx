import React from 'react'
import { Link } from 'react-router-dom'
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa6'

const footerLinks = {
  explore: [
    { label: 'Explore Spots', href: '/search' },
    { label: 'All Categories', href: '/category' },
    { label: 'Saved Places (3)', href: '/saved' },
  ],
  business: [
    { label: 'List Your Business', href: '/business' },
    { label: 'Claim Existing Place', href: '/business' },
    { label: 'Merchant Portal Login', href: '/business' },
    { label: 'Ad Pricing', href: '/business' },
  ],
  support: [
    { label: 'Contact us', href: '/contact' },
    { label: 'City guides', href: '/search' },
    { label: 'Privacy & terms', href: '/about' },
  ],
}

const SocialIcon = ({ href, label, icon: Icon }) => (
  <a
    href={href}
    aria-label={label}
    className="text-gray-700 transition-colors hover:text-gray-950"
  >
    <Icon size={18} />
  </a>
)

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200/90 bg-white py-10 sm:py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Localspot Logo"
                className="w-6 h-6 object-contain shrink-0"
              />
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-gray-900">
                LOCALSPOT
              </span>
            </div>

            <p className="mb-5 max-w-sm text-xs leading-relaxed text-gray-500">
              Hyperlocal neighborhood discovery, venues and merchant coordination.
            </p>

            <div className="flex items-center gap-4">
              <SocialIcon href="#" label="X (Twitter)" icon={FaXTwitter} />
              <SocialIcon href="#" label="Instagram" icon={FaInstagram} />
              <SocialIcon href="#" label="YouTube" icon={FaYoutube} />
              <SocialIcon href="#" label="LinkedIn" icon={FaLinkedin} />
            </div>
          </div>

          {/* Explore Column (2-3 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-3.5 text-xs font-bold text-gray-900">Explore</h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Businesses Column (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="mb-3.5 text-xs font-bold text-gray-900">For Businesses</h3>
            <ul className="space-y-2.5">
              {footerLinks.business.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources Column (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-3.5 text-xs font-bold text-gray-900">Support &amp; Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Divider & Exact Copyright Bar */}
        <div className="mt-10 border-t border-gray-200/80 pt-6">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            © 2026 LOCALSPOT SYSTEMS LTD. ALL LOCAL DISCOVERIES PROTECTED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer