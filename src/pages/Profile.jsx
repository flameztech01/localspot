import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiUser,
  FiHeart,
  FiSettings,
  FiShield,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiEdit2,
  FiMapPin,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiX,
  FiStar,
  FiPhone,
  FiCalendar,
  FiNavigation,
  FiInfo,
  FiMail,
  FiLock,
  FiSliders,
  FiDatabase,
  FiEye,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const initialSavedPlaces = [
  {
    id: 1,
    name: "Blue Bottle Cafe & Bakery",
    tag: "Cafe",
    category: "Coffee & Bakery",
    address: "24 Rumuola Road, Port Harcourt",
    rating: 4.8,
    reviews: 124,
    action: "Directions",
    actionIcon: FiNavigation,
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    name: "Spark Auto Mechanics",
    tag: "Services",
    category: "Auto Repair",
    address: "5 Trans-Amadi Road, Port Harcourt",
    rating: 4.9,
    reviews: 86,
    action: "Contact",
    actionIcon: FiPhone,
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    name: "Green Leaf Yoga Studio",
    tag: "Wellness",
    category: "Yoga & Fitness",
    address: "18 GRA Phase 2, Port Harcourt",
    rating: 4.7,
    reviews: 62,
    action: "Schedule",
    actionIcon: FiCalendar,
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=300",
  },
];

const navItems = [
  { label: "Profile Overview", icon: FiUser, targetId: "profile-overview" },
  {
    label: "Saved Places / Favorites",
    icon: FiHeart,
    targetId: "saved-places",
  },
  { label: "Account Settings", icon: FiSettings, targetId: "account-settings" },
  { label: "Privacy & Data", icon: FiShield, targetId: "privacy-data" },
  { label: "Notifications", icon: FiBell, targetId: "preferences" },
  { label: "Help & Support", icon: FiHelpCircle, targetId: null }, // No section on this page
];

const settingsSections = [
  {
    title: "ACCOUNT",
    id: "account-settings",
    note: "Security & Credentials",
    rows: [
      {
        icon: FiUser,
        title: "Personal Information",
        sub: "Display name and basic account roster",
        value: "",
      },
      {
        icon: FiMail,
        title: "Email Address",
        sub: "Primary sign-in email and verification",
        value: "jane.doe@example.com",
      },
      {
        icon: FiLock,
        title: "Password & Security",
        sub: "Update password or review login sessions",
        value: "Updated 3 days ago",
      },
    ],
  },
  {
    title: "PREFERENCES",
    id: "preferences",
    note: "Discover Customization",
    rows: [
      {
        icon: FiBell,
        title: "Notifications",
        sub: "Email alerts, saved business updates, and weekly digest",
        value: "Digest Only",
      },
      {
        icon: FiSliders,
        title: "Location Preferences",
        sub: "Default city search narrow and discovery radius",
        value: "Downtown (10 mi)",
      },
    ],
  },
  {
    title: "PRIVACY & DATA",
    id: "privacy-data",
    note: "User Rights & Exports",
    rows: [
      {
        icon: FiEye,
        title: "Privacy Setting",
        sub: "Public profile visibility and search history tracking",
        value: "Private",
      },
      {
        icon: FiDatabase,
        title: "Account & Data Control",
        sub: "Download data or delete consumer account",
        value: "Manage",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reusable Modal
// ---------------------------------------------------------------------------
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Header (Sticky + Custom Dropdown)
// ---------------------------------------------------------------------------
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-4 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-100">
            <FiMapPin size={18} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-gray-900">
              LocalSpot
            </span>
            <span className="block text-[10px] text-gray-500">
              Consumer Directory
            </span>
          </span>
        </Link>

        {/* Location select */}
        <div className="relative hidden md:block">
          <FiMapPin
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={13}
          />
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 text-xs rounded-md pl-8 pr-7 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Port Harcourt, Nigeria</option>
            <option>Lagos, Nigeria</option>
            <option>Abuja, Nigeria</option>
          </select>
          <FiChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={13}
          />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search for places, businesses, ideas..."
            className="w-full bg-white border border-gray-300 text-xs rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 sm:hidden" />

        {/* Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-gray-700 ml-auto">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/categories" className="hover:text-blue-600">
            Categories
          </Link>
          <Link to="/trends" className="hover:text-blue-600">
            Trends
          </Link>
        </nav>

        {/* Account pill with Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-md pl-1.5 pr-2.5 py-1 hover:bg-gray-50 transition-colors shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <FiUser size={12} />
            </span>
            <span className="text-xs font-medium text-gray-800 hidden sm:inline">
              My Account
            </span>
            <FiChevronDown
              size={12}
              className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60] animate-fade-in">
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Profile Overview
              </Link>
              <Link
                to="/saved"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Saved Places
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Account Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  alert("Logging out...");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thin blue divider strip */}
      <div className="border-t border-blue-300" />
      <div className="bg-blue-100 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-1.5 flex items-center justify-between text-[10px] text-blue-800">
          <span className="font-medium">Home / My Account</span>
          <span className="hidden sm:inline">
            Open Now · Explore · Review · Save Favorites
          </span>
        </div>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const SiteFooter = () => (
  <footer className="bg-white border-t border-gray-200 mt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FiMapPin size={13} />
            </span>
            <span className="text-sm font-extrabold tracking-wide text-gray-900">
              LOCALSPOT
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 max-w-[200px] leading-relaxed">
            Your neighborhood directory for venues &amp; local community
            businesses.
          </p>
          <div className="flex items-center gap-3 mt-4 text-gray-700">
            <FiTwitter size={15} />
            <FiFacebook size={15} />
            <FiInstagram size={15} />
            <FiLinkedin size={15} />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">Explore</h4>
          <ul className="space-y-1.5 text-[11px] text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Hotels Spots
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600">
                All Categories
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600">
                Saved Places (3)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">For Business</h4>
          <ul className="space-y-1.5 text-[11px] text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">
                List Your Business
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600">
                Claim Existing Place
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600">
                Merchant Dashboard
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600">
                Ad Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">
            Support &amp; Resources
          </h4>
          <ul className="space-y-1.5 text-[11px] text-gray-500">
            <li>
              <Link to="/help" className="hover:text-blue-600">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-blue-600">
                Help
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
        © 2026 LOCALSPOT SYSTEMS LTD. DEMOGRAPHIC SPACE SMART ISLAND. ALL
        STRUCTURAL LISTINGS RESERVED.
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const Profile = () => {
  const [savedPlaces, setSavedPlaces] = useState(initialSavedPlaces);
  const [likedIds, setLikedIds] = useState(initialSavedPlaces.map((p) => p.id));
  const [activeTab, setActiveTab] = useState("All Places");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for active navigation item
  const [activeNav, setActiveNav] = useState("Profile Overview");

  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    memberId: "Member ID: 8821-0042",
  });

  const tabs = ["All Places", "Recently Added", "Top Rated"];

  const handleToggleHeart = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  // Handle navigation clicks
  const handleNavClick = (item) => {
    setActiveNav(item.label);
    if (item.targetId) {
      const element = document.getElementById(item.targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // For items without a target section on this page
      alert(
        `Navigation to "${item.label}" is not fully implemented in this demo.`,
      );
    }
  };

  const visiblePlaces = (() => {
    if (activeTab === "Top Rated")
      return [...savedPlaces].sort((a, b) => b.rating - a.rating);
    if (activeTab === "Recently Added") return [...savedPlaces].reverse();
    return savedPlaces;
  })();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4">
        {/* Page title */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight scroll-mt-24"
          id="profile-overview"
        >
          My Account
        </h1>
        <p className="text-xs sm:text-sm font-medium text-blue-700 mt-1.5">
          Manage your LocalSpot account, profile preferences, and saved places
        </p>

        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
          {/* ------------------------------ LEFT COLUMN (Sticky) ------------------------------ */}
          <aside className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24 h-fit">
            {/* Profile card */}
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-blue-700">
                  <FiUser size={24} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900 truncate">
                      {profile.name}
                    </h2>
                    <span className="text-[9px] font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded px-1.5 py-0.5">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 truncate">
                    {profile.email}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {profile.memberId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-3 w-full py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiEdit2 size={13} />
                Edit Profile
              </button>

              <div className="mt-3 p-2.5 bg-white border border-blue-200 rounded-md text-[10px] text-gray-500 leading-relaxed">
                Your profile helps us personalize local recommendations and keep
                your saved places in sync.
              </div>
            </div>

            {/* Account navigation */}
            <nav className="bg-blue-50 border border-blue-300 rounded-xl overflow-hidden">
              <div className="px-4 pt-3 pb-2 text-[11px] font-extrabold text-gray-900 uppercase tracking-wide">
                Account Navigation
              </div>
              <div className="px-3 pb-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium rounded-md border transition-colors ${
                        isActive
                          ? "bg-white border-blue-400 text-gray-900 shadow-sm"
                          : "bg-white border-blue-100 text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          size={13}
                          className={isActive ? "text-blue-600" : ""}
                        />
                        {item.label}
                      </span>
                      <FiChevronRight
                        size={13}
                        className={`text-gray-400 ${isActive ? "text-blue-500" : ""}`}
                      />
                    </button>
                  );
                })}
                <button
                  onClick={() => alert("Logging out...")}
                  className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <FiLogOut size={13} />
                  Log Out
                </button>
              </div>
            </nav>
          </aside>

          {/* ------------------------------ RIGHT COLUMN ------------------------------ */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* Saved places */}
            <section
              id="saved-places"
              className="scroll-mt-24 bg-blue-50 border border-blue-300 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xs font-extrabold text-gray-900">
                    Saved Places
                  </h2>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-0.5 text-[10px] font-medium rounded-full border transition-colors ${
                          activeTab === tab
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <Link
                  to="/saved"
                  className="text-[10px] font-semibold text-blue-700 hover:underline whitespace-nowrap"
                >
                  View All Saved Places
                </Link>
              </div>

              <div className="space-y-3">
                {visiblePlaces.map((place) => {
                  const ActionIcon = place.actionIcon;
                  const liked = likedIds.includes(place.id);
                  return (
                    <div
                      key={place.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-2.5 bg-white border border-blue-200 rounded-lg"
                    >
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full sm:w-24 h-20 rounded-md object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-gray-900">
                            {place.name}
                          </h4>
                          <span className="text-[9px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
                            {place.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {place.category}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                          <FiMapPin size={10} /> {place.address}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[10px]">
                          <FiStar
                            size={10}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="font-semibold text-gray-900">
                            {place.rating}
                          </span>
                          <span className="text-gray-400">
                            ({place.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[88px]">
                          <ActionIcon size={11} />
                          {place.action}
                        </button>
                        <button
                          onClick={() => handleToggleHeart(place.id)}
                          aria-label="Toggle favorite"
                          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-red-50 transition-colors"
                        >
                          <FiHeart
                            size={12}
                            className={
                              liked
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2 p-2 bg-blue-100 border border-blue-300 rounded-md text-[10px] text-blue-800">
                <FiInfo size={12} className="shrink-0" />
                <span>
                  Your saved places are synced across devices. Remove a place
                  anytime by tapping the heart.
                </span>
              </div>
            </section>

            {/* Account settings & preferences */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
                <div>
                  <h2
                    className="text-base font-extrabold text-gray-900 scroll-mt-24"
                    id="account-settings-header"
                  >
                    Account Settings &amp; Preferences
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Easy to point for personal data, notifications, and security
                    controls.
                  </p>
                </div>
                <button className="self-start sm:self-auto px-2.5 py-1 text-[9px] font-bold uppercase text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors">
                  GDPR Unused Data Rules
                </button>
              </div>

              <div className="space-y-4">
                {settingsSections.map((section) => (
                  <div
                    key={section.title}
                    id={section.id}
                    className="scroll-mt-24 bg-blue-50 border border-blue-300 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-blue-100 border-b border-blue-300">
                      <h3 className="text-[11px] font-extrabold text-gray-900 tracking-wide">
                        {section.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-blue-700">
                        {section.note}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      {section.rows.map((row) => {
                        const Icon = row.icon;
                        return (
                          <button
                            key={row.title}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-white border border-blue-200 rounded-md text-left hover:border-blue-400 transition-colors"
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <span className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Icon size={13} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[11px] font-bold text-gray-900">
                                  {row.title}
                                </span>
                                <span className="block text-[10px] text-gray-500 truncate">
                                  {row.sub}
                                </span>
                              </span>
                            </span>
                            <span className="flex items-center gap-2 shrink-0">
                              {row.value && (
                                <span className="text-[10px] font-semibold text-gray-800 hidden sm:inline">
                                  {row.value}
                                </span>
                              )}
                              <FiChevronRight
                                size={13}
                                className="text-gray-400"
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 p-2.5 bg-blue-100 border border-blue-300 rounded-md text-[10px] text-blue-800">
                  <FiInfo size={12} className="shrink-0" />
                  <span>
                    Review your privacy settings regularly to make sure your
                    personal data and notification preferences are up to date.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
