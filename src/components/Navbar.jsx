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
    `block rounded-xl px-4 py-3 text-base transition-colors ${
      isActive
        ? 'bg-white/60 font-medium text-gray-900'
        : 'text-gray-700 hover:bg-white/50'
    }`

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-6">
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
            <Link to="/profile" aria-label="Profile" className="text-gray-900">
              <FiUser size={20} />
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
        className={`fixed left-0 top-0 z-[70] flex h-[100svh] w-[78%] max-w-[320px] flex-col overflow-y-auto border-r border-white/40 bg-white/60 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/40 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-900 transition-colors hover:bg-white/60"
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
          className={`border-t border-white/40 p-4 transition-all duration-300 ease-out ${
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