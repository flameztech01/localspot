import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiUser, FiMenu, FiX } from 'react-icons/fi'

const links = [
  { label: 'Explore', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Saved Places', to: '/saved' },
]

const Logo = () => (
  <Link to="/" className="flex items-center gap-2" aria-label="LocalSpot home">
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B82F6]">
      <span className="h-3.5 w-3.5 rounded-full border-2 border-white" />
    </span>
    <span className="text-sm font-bold tracking-wide text-gray-900">LOCALSPOT</span>
  </Link>
)

const Navbar = () => {
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu if the screen grows to desktop size
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const desktopLink = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive
        ? 'bg-gray-200 font-medium text-gray-900'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-base transition-colors ${
      isActive
        ? 'bg-gray-100 font-medium text-gray-900'
        : 'text-gray-700 hover:bg-gray-50'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Logo />

        {/* Desktop links (centered) */}
        <ul className="hidden items-center gap-2 md:flex lg:gap-4">
          {links.map(({ label, to }) => (
            <li key={label}>
              <NavLink to={to} end={to === '/'} className={desktopLink}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/profile"
            aria-label="Profile"
            className="text-gray-900 transition-colors hover:text-[#3B82F6]"
          >
            <FiUser size={20} />
          </Link>
          <Link
            to="/list-business"
            className="rounded-lg bg-[#60A5FA] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B82F6]"
          >
            List your business
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/profile"
            aria-label="Profile"
            className="text-gray-900"
          >
            <FiUser size={20} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-900 hover:bg-gray-100"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute left-0 top-16 w-full border-b border-gray-100 bg-white shadow-lg transition-all duration-200 md:hidden ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <ul className="space-y-1 px-4 py-4">
          {links.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Link
              to="/list-business"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg bg-[#60A5FA] px-5 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#3B82F6]"
            >
              List your business
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar