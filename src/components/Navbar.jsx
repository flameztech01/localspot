import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiUser,
  FiMenu,
  FiX,
  FiGrid,
  FiMapPin,
  FiTag,
  FiMessageSquare,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { logout } from "../features/auth/authSlice";

// --- Public links (not signed in) ---
const publicLinks = [
  { label: "Explore", to: "/search" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Saved Places", to: "/saved" },
];

// --- Business links (signed in) — scroll to sections ---
const businessLinks = [
  { label: "Overview", targetId: "overview", icon: FiGrid },
  { label: "Listings", targetId: "listings", icon: FiMapPin },
  { label: "Deals", targetId: "deals", icon: FiTag },
  { label: "Reviews", targetId: "reviews", icon: FiMessageSquare },
];

// --- Logo ---
const Logo = () => (
  <Link to="/" className="flex items-center gap-2" aria-label="LocalSpot home">
    <img src="/logo.png" alt="LocalSpot" className="h-7 w-7 object-contain" />
    <span className="text-sm font-bold tracking-wide text-gray-900">
      LOCALSPOT
    </span>
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // --- Redux auth state ---
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // ---- Close profile dropdown on outside click ----
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // ---- Lock body scroll while mobile menu is open ----
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ---- Close mobile menu on desktop resize ----
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- Handle business nav link click (scroll to section) ----
  const handleScrollTo = (targetId) => {
    if (window.location.pathname !== "/business") {
      navigate("/business");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  // ---- Logout via Redux ----
  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    setOpen(false);
    navigate("/");
  };

  const desktopLink = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive
        ? "bg-gray-100 font-semibold text-gray-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-base transition-colors ${
      isActive
        ? "bg-gray-100 font-medium text-gray-900"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  // First letter for avatar
  const initial = userInfo?.name?.[0]?.toUpperCase() || "B";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-8">
          {/* Logo */}
          <Logo />

          {/* ============= DESKTOP LINKS ============= */}
          <ul className="hidden items-center gap-2 md:flex lg:gap-4">
            {userInfo
              ? businessLinks.map(({ label, targetId, icon: Icon }) => (
                  <li key={label}>
                    <button
                      onClick={() => handleScrollTo(targetId)}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  </li>
                ))
              : publicLinks.map(({ label, to }) => (
                  <li key={label}>
                    <NavLink to={to} end={to === "/"} className={desktopLink}>
                      {label}
                    </NavLink>
                  </li>
                ))}
          </ul>

          {/* ============= DESKTOP ACTIONS ============= */}
          <div className="hidden items-center gap-4 md:flex">
            {userInfo ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 transition-colors hover:bg-gray-50"
                  aria-label="Open profile menu"
                >
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
                      {initial}
                    </span>
                  )}
                  <span className="max-w-[100px] truncate text-sm font-medium text-gray-800">
                    {userInfo.name?.split(" ")[0] || "Business"}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-[60]">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {userInfo.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {userInfo.email}
                      </p>
                    </div>

                    <Link
                      to="/business"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiGrid size={15} /> Business Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser size={15} /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/business/signin"
                  className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/business/signup"
                  className="rounded-lg bg-[#60A5FA] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3B82F6]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* ============= MOBILE ACTIONS ============= */}
          <div className="flex items-center gap-3 md:hidden">
            {userInfo ? (
              <Link
                to="/business"
                aria-label="Business Dashboard"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#3B82F6] text-xs font-semibold text-white"
              >
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </Link>
            ) : (
              <Link
                to="/business/signin"
                aria-label="Log in"
                className="flex h-9 items-center rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-800"
              >
                Log in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-900 transition-colors hover:bg-gray-100"
            >
              <FiMenu
                size={22}
                className={`absolute transition-all duration-300 ${
                  open
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <FiX
                size={22}
                className={`absolute transition-all duration-300 ${
                  open
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
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
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile side drawer */}
      <aside
        id="mobile-menu"
        className={`fixed left-0 top-0 z-[70] flex h-[100svh] w-[78%] max-w-[320px] flex-col overflow-y-auto border-r border-white/40 bg-white/90 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
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

        {/* Signed-in user summary */}
        {userInfo && (
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
                {initial}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {userInfo.name}
              </p>
              <p className="truncate text-xs text-gray-500">{userInfo.email}</p>
            </div>
          </div>
        )}

        {/* Drawer links */}
        <ul className="flex-1 space-y-1 px-4 py-4">
          {userInfo
            ? businessLinks.map(({ label, targetId, icon: Icon }, i) => (
                <li
                  key={label}
                  className={`transition-all duration-300 ease-out ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: open ? `${i * 60 + 100}ms` : "0ms",
                  }}
                >
                  <button
                    onClick={() => handleScrollTo(targetId)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                </li>
              ))
            : publicLinks.map(({ label, to }, i) => (
                <li
                  key={label}
                  className={`transition-all duration-300 ease-out ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: open ? `${i * 60 + 100}ms` : "0ms",
                  }}
                >
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    className={mobileLink}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

          {/* Logout button when signed in */}
          {userInfo && (
            <li
              className={`transition-all duration-300 ease-out ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: open
                  ? `${businessLinks.length * 60 + 100}ms`
                  : "0ms",
              }}
            >
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base text-red-600 transition-colors hover:bg-red-50"
              >
                <FiLogOut size={18} /> Log out
              </button>
            </li>
          )}
        </ul>

        {/* Drawer footer CTA */}
        {!userInfo && (
          <div
            className={`border-t border-gray-100 p-4 transition-all duration-300 ease-out ${
              open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: open
                ? `${publicLinks.length * 60 + 100}ms`
                : "0ms",
            }}
          >
            <div className="space-y-2">
              <Link
                to="/business/signup"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl bg-[#60A5FA] px-5 py-3 text-center text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#3B82F6]"
              >
                Sign up
              </Link>
              <Link
                to="/business/signin"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-base font-medium text-gray-800 transition-colors hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Navbar;
