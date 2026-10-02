import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa6'

const footerLinks = {
  explore: [
    { label: 'Explore Spots', href: '#' },
    { label: 'All Categories', href: '#' },
    { label: 'Saved Places (3)', href: '#' },
  ],
  business: [
    { label: 'List Your Business', href: '/business' },
    { label: 'Merchant Dashboard', href: '/business' },
    { label: 'Promote Deals', href: '/business' },
    { label: 'Admin Control Hub', href: '/admin' },
  ],
  support: [
    { label: 'Contact us', href: '/contact' },
    { label: 'Explore Spots', href: '/search' },
  ],
}

const SocialIcon = ({ href, label, icon: Icon }) => (
  <a
    href={href}
    aria-label={label}
    className="text-gray-800 transition-colors hover:text-gray-500"
  >
    <Icon size={18} />
  </a>
)

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <FiMapPin className="text-blue-600" size={14} />
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-900">
                LOCALSPOT
              </span>
            </div>

            <p className="mb-6 max-w-xs text-xs leading-relaxed text-gray-500">
              Hyperlocal neighborhood discovery, venues &amp; merchant coordination.
            </p>

            <div className="flex items-center gap-4">
              <SocialIcon href="#" label="X (Twitter)" icon={FaXTwitter} />
              <SocialIcon href="#" label="Instagram" icon={FaInstagram} />
              <SocialIcon href="#" label="YouTube" icon={FaYoutube} />
              <SocialIcon href="#" label="LinkedIn" icon={FaLinkedin} />
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="mb-4 text-xs font-bold text-gray-900">Explore</h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Businesses Column */}
          <div>
            <h3 className="mb-4 text-xs font-bold text-gray-900">For Businesses</h3>
            <ul className="space-y-2.5">
              {footerLinks.business.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources Column */}
          <div>
            <h3 className="mb-4 text-xs font-bold text-gray-900">Support &amp; Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-[9px] font-medium uppercase tracking-wide text-gray-400">
            © 2025 LOCALSPOT SYSTEMS LTD. [WIREFRAME SPEC DRAFT 0.6] ALL STRUCTURAL LAYOUTS PROTECTED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer