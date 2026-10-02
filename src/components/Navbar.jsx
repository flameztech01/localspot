import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiUser, FiMenu, FiX } from 'react-icons/fi'

const links = [
  { label: 'Explore', to: '/search' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Saved Places', to: '/saved' },
]

// RESTORED YOUR ORIGINAL LOGO
const Logo = () => (
  <Link to="/" className="flex items-center gap-2" aria-label="LocalSpot home">
    <img
      src="/logo.png"
      alt="LocalSpot"
      className="h-7 w-7 object-contain"
    />
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

  // Close the mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const desktopLink = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive
        ? 'bg-gray-100 font-semibold text-gray-900'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
    }`

  const mobileLink = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-base transition-colors ${
      isActive
        ? 'bg-gray-100 font-medium text-gray-900'
        : 'text-gray-600 hover:bg-gray-50'
    }`

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Desktop links (centered) */}
          <ul className="hidden items-center gap-2 md:flex lg:gap-6">
            {links.map(({ label, to }) => (
              <li key={label}>
                <NavLink to={to} end={to === '/'} className={desktopLink}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop actions: User Icon + List Business */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/profile"
              aria-label="Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <FiUser size={18} />
            </Link>
            <Link
              to="/list-business"
              className="rounded-lg bg-[#60A5FA] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B82F6]"
            >
              List your business
            </Link>
          </div>

          {/* Mobile actions: User Icon + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/profile"
              aria-label="Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500"
            >
              <FiUser size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-900 transition-colors hover:bg-gray-100"
            >
              <FiMenu
                size={22}
                className={`absolute transition-all duration-300 ${
                  open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <FiX
                size={22}
                className={`absolute transition-all duration-300 ${
                  open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile side drawer */}
      <aside
        id="mobile-menu"
        className={`fixed left-0 top-0 z-[70] flex h-[100svh] w-[78%] max-w-[320px] flex-col overflow-y-auto border-r border-white/40 bg-white/90 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-900 transition-colors hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer links */}
        <ul className="flex-1 space-y-1 px-4 py-4">
          {links.map(({ label, to }, i) => (
            <li
              key={label}
              className={`transition-all duration-300 ease-out ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${i * 60 + 100}ms` : '0ms' }}
            >
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
        </ul>

        {/* Drawer footer CTA */}
        <div
          className={`border-t border-gray-100 p-4 transition-all duration-300 ease-out ${
            open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}
          style={{
            transitionDelay: open ? `${links.length * 60 + 100}ms` : '0ms',
          }}
        >
          <Link
            to="/list-business"
            onClick={() => setOpen(false)}
            className="block w-full rounded-xl bg-[#60A5FA] px-5 py-3 text-center text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#3B82F6]"
          >
            List your business
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Navbar