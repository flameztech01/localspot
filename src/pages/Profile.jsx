// src/pages/Profile.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as logoutAction } from "../features/auth/authSlice"; // Adjust path if needed
import {
  useGetProfileQuery,
  useGetSavedPlacesQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUnsavePlaceMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useLogoutMutation,
} from "../features/userApiSlice"; // Adjust path if needed
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
  FiCamera,
  FiAlertTriangle,
} from "react-icons/fi";

// ---------------------------------------------------------------------------
// Static Config
// ---------------------------------------------------------------------------
const navItems = [
  { label: "Profile Overview", icon: FiUser, targetId: "profile-overview" },
  { label: "Saved Places / Favorites", icon: FiHeart, targetId: "saved-places" },
  { label: "Account Settings", icon: FiSettings, targetId: "account-settings" },
  { label: "Privacy & Data", icon: FiShield, targetId: "privacy-data" },
  { label: "Notifications", icon: FiBell, targetId: "preferences" },
  { label: "Help & Support", icon: FiHelpCircle, targetId: null, to: "/help" },
];

const settingsSections = [
  {
    title: "ACCOUNT",
    id: "account-settings",
    note: "Security & Credentials",
    rows: [
      { key: "personal", icon: FiUser, title: "Personal Information", sub: "Display name and basic account roster", value: "" },
      { key: "email", icon: FiMail, title: "Email Address", sub: "Primary sign-in email and verification", value: "" },
      { key: "password", icon: FiLock, title: "Password & Security", sub: "Update password or review login sessions", value: "Change password" },
    ],
  },
  {
    title: "PREFERENCES",
    id: "preferences",
    note: "Discover Customization",
    rows: [
      { key: "notifications", icon: FiBell, title: "Notifications", sub: "Email alerts, saved business updates, and weekly digest", value: "Manage" },
      { key: "location", icon: FiSliders, title: "Location Preferences", sub: "Default city search narrow and discovery radius", value: "Manage" },
    ],
  },
  {
    title: "PRIVACY & DATA",
    id: "privacy-data",
    note: "User Rights & Exports",
    rows: [
      { key: "privacy", icon: FiEye, title: "Privacy Setting", sub: "Public profile visibility and search history tracking", value: "Private" },
      { key: "data", icon: FiDatabase, title: "Account & Data Control", sub: "Download data or delete consumer account", value: "Manage" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300";

const unwrap = (res) => res?.data?.data ?? res?.data ?? res ?? null;

const getSavedPlaceCore = (saved) =>
  saved?.place && typeof saved.place === "object" ? saved.place : saved;

const getPlaceId = (saved) => {
  const p = getSavedPlaceCore(saved);
  return p?._id || saved?.placeId || (typeof saved?.place === "string" ? saved.place : null);
};

const getPlaceView = (saved) => {
  const p = getSavedPlaceCore(saved);
  const [lng, lat] = p?.location?.coordinates?.coordinates || [];
  return {
    id: getPlaceId(saved),
    name: p?.businessName || p?.name || "Unknown Place",
    tag: p?.tags?.[0] || p?.businessKind || "Place",
    category: p?.businessKind || p?.categorySlug || "Place",
    address: p?.location?.address || p?.address || p?.location?.city || p?.location?.state || "",
    rating: Number(p?.rating || 0),
    reviews: p?.numReviews ?? p?.reviews ?? 0,
    img: p?.coverImage || p?.logo || p?.images?.[0] || FALLBACK_IMG,
    hasCoords: Number.isFinite(lng) && Number.isFinite(lat),
    coords: Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null,
    createdAt: saved?.createdAt || p?.createdAt || null,
  };
};

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
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
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
// Header
// ---------------------------------------------------------------------------
const Header = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerName = userInfo?.name || userInfo?.fullName || "My Account";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-4 lg:gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img 
            src="/logo.png" 
            alt="LocalSpot" 
            className="w-10 h-10 object-contain" 
          />
          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-gray-900">LocalSpot</span>
            <span className="block text-[10px] text-gray-500">Consumer Directory</span>
          </span>
        </Link>

        {/* Location Selector */}
        <div className="relative hidden md:block">
          <FiMapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
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
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search for places, businesses, ideas..."
            className="w-full bg-white border border-gray-300 text-xs rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 sm:hidden" />

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-gray-700 ml-auto">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/categories" className="hover:text-blue-600">Categories</Link>
          <Link to="/trends" className="hover:text-blue-600">Trends</Link>
        </nav>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-md pl-1.5 pr-2.5 py-1 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center overflow-hidden">
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt={headerName} className="w-full h-full object-cover" />
              ) : (
                <FiUser size={12} />
              )}
            </span>
            <span className="text-xs font-medium text-gray-800 hidden sm:inline truncate max-w-[100px]">
              {headerName}
            </span>
            <FiChevronDown
              size={12}
              className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60]">
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
                  setIsDropdownOpen(false);
                  onLogout?.();
                }}
                className="w-full text-left block px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-blue-300" />
      <div className="bg-blue-100 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-1.5 flex items-center justify-between text-[10px] text-blue-800">
          <span className="font-medium">Home / My Account</span>
          <span className="hidden sm:inline">Open Now · Explore · Review · Save Favorites</span>
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
            <img 
              src="/logo.png" 
              alt="LocalSpot" 
              className="w-7 h-7 object-contain" 
            />
            <span className="text-sm font-extrabold tracking-wide text-gray-900">LOCALSPOT</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 max-w-[200px] leading-relaxed">
            Your neighborhood directory for venues &amp; local community businesses.
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
            <li><Link to="/" className="hover:text-blue-600">Hotels Spots</Link></li>
            <li><Link to="/" className="hover:text-blue-600">All Categories</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Saved Places</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">For Business</h4>
          <ul className="space-y-1.5 text-[11px] text-gray-500">
            <li><Link to="/" className="hover:text-blue-600">List Your Business</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Claim Existing Place</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Merchant Dashboard</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Ad Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">Support &amp; Resources</h4>
          <ul className="space-y-1.5 text-[11px] text-gray-500">
            <li><Link to="/help" className="hover:text-blue-600">Contact us</Link></li>
            <li><Link to="/help" className="hover:text-blue-600">Help</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
        © 2026 LOCALSPOT SYSTEMS LTD. DEMOGRAPHIC SPACE SMART ISLAND. ALL STRUCTURAL LISTINGS RESERVED.
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  // ── Queries ────────────────────────────────────────────────
  const {
    data: profileRes,
    isError: profileError,
    error: profileErrObj,
  } = useGetProfileQuery();

  const { data: savedRes, isLoading: savedLoading } = useGetSavedPlacesQuery();

  // ── Mutations ──────────────────────────────────────────────
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] = useUpdateAvatarMutation();
  const [unsavePlace] = useUnsavePlaceMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [logoutApi] = useLogoutMutation();

  // ── Normalise data ─────────────────────────────────────────
  const profile = useMemo(() => unwrap(profileRes) || {}, [profileRes]);

  const savedPlaces = useMemo(() => {
    const raw = unwrap(savedRes);
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map(getPlaceView);
  }, [savedRes]);

  // Redirect if not logged in
  useEffect(() => {
    if (profileError && profileErrObj?.status === 401) {
      navigate("/login", { replace: true });
    }
  }, [profileError, profileErrObj, navigate]);

  // ── Derived display values ──────────────────────────────────
  const displayName =
    userInfo?.name || userInfo?.fullName || profile.name || profile.fullName || "User";
  const displayEmail = userInfo?.email || profile.email || "—";
  const displayAvatar = userInfo?.avatar || profile.avatar || "";
  const memberIdSource = userInfo?._id || profile._id || profile.memberId;
  const memberId = memberIdSource
    ? `Member ID: ${String(memberIdSource).slice(-8).toUpperCase()}`
    : "";

  // ── UI state ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("All Places");
  const [activeNav, setActiveNav] = useState("Profile Overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ── Edit-profile form ──────────────────────────────────────
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!isEditModalOpen) return;
    setEditForm({
      name: userInfo?.name || userInfo?.fullName || profile.name || profile.fullName || "",
      phone: userInfo?.phone || profile.phone || "",
      address: userInfo?.address || profile.address || profile.location?.address || "",
      city: userInfo?.city || profile.city || profile.location?.city || "",
    });
    setEditError("");
  }, [isEditModalOpen, userInfo, profile]);

  // ── Password form ──────────────────────────────────────────
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    if (!isPasswordModalOpen) return;
    setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPwdError("");
    setPwdSuccess("");
  }, [isPasswordModalOpen]);

  // ── Delete form ────────────────────────────────────────────
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!isDeleteModalOpen) return;
    setDeleteConfirmText("");
    setDeleteError("");
  }, [isDeleteModalOpen]);

  // ── Derived UI values ─────────────────────────────────────
  const tabs = ["All Places", "Recently Added", "Top Rated"];
  const visiblePlaces = useMemo(() => {
    const arr = [...savedPlaces];
    if (activeTab === "Top Rated") return arr.sort((a, b) => b.rating - a.rating);
    if (activeTab === "Recently Added")
      return arr.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
    return arr;
  }, [savedPlaces, activeTab]);

  // ── Handlers ──────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (_) {
      // Ignore API error, still clear local state
    }
    dispatch(logoutAction());
    navigate("/login", { replace: true });
  };

  const handleNavClick = (item) => {
    setActiveNav(item.label);
    if (item.to) return navigate(item.to);
    if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setEditError("");
    if (!editForm.name.trim()) {
      setEditError("Name is required");
      return;
    }
    try {
      const res = await updateProfile({
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        city: editForm.city.trim(),
      }).unwrap();

      const updated = res?.data?.data ?? res?.data ?? res;
      if (updated && userInfo) {
        dispatch(
          setCredentials({
            ...userInfo,
            name: updated.name ?? userInfo.name,
            fullName: updated.fullName ?? userInfo.fullName,
            phone: updated.phone ?? userInfo.phone,
            avatar: updated.avatar ?? userInfo.avatar,
            address: updated.address ?? userInfo.address,
            city: updated.city ?? userInfo.city,
          })
        );
      }
      setIsEditModalOpen(false);
    } catch (err) {
      setEditError(err?.data?.message || "Could not update your profile. Try again.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5 MB.");
    
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await updateAvatar(fd).unwrap();
      const updated = res?.data?.data ?? res?.data ?? res;
      if (updated?.avatar && userInfo) {
        dispatch(setCredentials({ ...userInfo, avatar: updated.avatar }));
      }
    } catch (err) {
      alert(err?.data?.message || "Failed to upload avatar.");
    }
  };

  const handleUnsavePlace = async (place) => {
    if (!place.id) return;
    try {
      await unsavePlace(place.id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not remove this saved place.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    
    if (!pwdForm.currentPassword) return setPwdError("Current password is required");
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6)
      return setPwdError("New password must be at least 6 characters");
    if (pwdForm.newPassword !== pwdForm.confirmPassword)
      return setPwdError("New passwords do not match");
      
    try {
      await changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      }).unwrap();
      setPwdSuccess("Password updated successfully.");
      setTimeout(() => setIsPasswordModalOpen(false), 900);
    } catch (err) {
      setPwdError(err?.data?.message || "Could not update your password.");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      setDeleteError("Type DELETE to confirm");
      return;
    }
    try {
      await deleteAccount().unwrap();
      dispatch(logoutAction());
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err?.data?.message || "Could not delete your account.");
    }
  };

  const handleSettingsRowClick = (row) => {
    switch (row.key) {
      case "personal": return setIsEditModalOpen(true);
      case "password": return setIsPasswordModalOpen(true);
      case "data": return setIsDeleteModalOpen(true);
      case "email":
        return alert("Email changes require re-verification. Contact support to change your email.");
      default:
        return alert(`"${row.title}" settings are coming soon.`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Header onLogout={handleLogout} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4">
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
          {/* ─── LEFT COLUMN ──────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24 h-fit">
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <label
                  className="relative w-14 h-14 rounded-full bg-blue-200 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-blue-700 cursor-pointer group"
                  title="Change avatar"
                >
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={24} />
                  )}
                  <span className="absolute inset-0 bg-black/40 text-white items-center justify-center hidden group-hover:flex">
                    {isUploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiCamera size={14} />
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar}
                  />
                </label>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900 truncate">
                      {displayName}
                    </h2>
                    {userInfo && (
                      <span className="text-[9px] font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded px-1.5 py-0.5">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 truncate">{displayEmail}</p>
                  {memberId && <p className="text-[10px] text-gray-400 mt-0.5">{memberId}</p>}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-3 w-full py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiEdit2 size={13} />
                Edit Profile
              </button>

              <div className="mt-3 p-2.5 bg-white border border-blue-200 rounded-md text-[10px] text-gray-500 leading-relaxed">
                Your profile helps us personalize local recommendations and keep your saved places in sync.
              </div>
            </div>

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
                      className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white border-blue-400 text-gray-900 shadow-sm"
                          : "bg-white border-blue-100 text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={13} className={isActive ? "text-blue-600" : ""} />
                        {item.label}
                      </span>
                      <FiChevronRight size={13} className={isActive ? "text-blue-500" : "text-gray-400"} />
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  <FiLogOut size={13} />
                  Log Out
                </button>
              </div>
            </nav>
          </aside>

          {/* ─── RIGHT COLUMN ─────────────────────────────── */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* Saved places */}
            <section
              id="saved-places"
              className="scroll-mt-24 bg-blue-50 border border-blue-300 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xs font-extrabold text-gray-900">
                    Saved Places {savedPlaces.length > 0 && `(${savedPlaces.length})`}
                  </h2>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-0.5 text-[10px] font-medium rounded-full border transition-colors cursor-pointer ${
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

              {savedLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-white/60 border border-blue-200 animate-pulse" />
                  ))}
                </div>
              ) : visiblePlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-lg border border-dashed border-blue-200">
                  <FiHeart size={22} className="text-blue-300 mb-2" />
                  <p className="text-[11px] font-semibold text-gray-700">No saved places yet</p>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[220px]">
                    Tap the heart icon on any business to save it here.
                  </p>
                  <Link
                    to="/"
                    className="mt-3 px-3 py-1.5 text-[10px] font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Explore places
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {visiblePlaces.map((place) => (
                    <div
                      key={place.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-2.5 bg-white border border-blue-200 rounded-lg"
                    >
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full sm:w-24 h-20 rounded-md object-cover shrink-0"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{place.name}</h4>
                          {place.tag && (
                            <span className="text-[9px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 capitalize">
                              {place.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 capitalize">{place.category}</p>
                        {place.address && (
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                            <FiMapPin size={10} /> {place.address}
                          </p>
                        )}
                        {place.rating > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-[10px]">
                            <FiStar size={10} className="text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-gray-900">{place.rating.toFixed(1)}</span>
                            <span className="text-gray-400">({place.reviews} reviews)</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {place.hasCoords ? (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[88px]"
                          >
                            <FiNavigation size={11} />
                            Directions
                          </a>
                        ) : (
                          <Link
                            to={`/business/${place.id}`}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[88px]"
                          >
                            <FiChevronRight size={11} />
                            Details
                          </Link>
                        )}
                        <button
                          onClick={() => handleUnsavePlace(place)}
                          aria-label="Remove from favorites"
                          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <FiHeart size={12} className="text-red-500 fill-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-2 p-2 bg-blue-100 border border-blue-300 rounded-md text-[10px] text-blue-800">
                <FiInfo size={12} className="shrink-0" />
                <span>Your saved places are synced across devices. Remove a place anytime by tapping the heart.</span>
              </div>
            </section>

            {/* Settings */}
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
                    Easy to point for personal data, notifications, and security controls.
                  </p>
                </div>
                <button className="self-start sm:self-auto px-2.5 py-1 text-[9px] font-bold uppercase text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors cursor-pointer">
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
                      <h3 className="text-[11px] font-extrabold text-gray-900 tracking-wide">{section.title}</h3>
                      <span className="text-[10px] font-semibold text-blue-700">{section.note}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      {section.rows.map((row) => {
                        const Icon = row.icon;
                        const displayValue = row.key === "email" ? displayEmail : row.value;
                        return (
                          <button
                            key={row.title}
                            onClick={() => handleSettingsRowClick(row)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-white border border-blue-200 rounded-md text-left hover:border-blue-400 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <span className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Icon size={13} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[11px] font-bold text-gray-900">{row.title}</span>
                                <span className="block text-[10px] text-gray-500 truncate">{row.sub}</span>
                              </span>
                            </span>
                            <span className="flex items-center gap-2 shrink-0">
                              {displayValue && (
                                <span className="text-[10px] font-semibold text-gray-800 hidden sm:inline max-w-[160px] truncate">
                                  {displayValue}
                                </span>
                              )}
                              <FiChevronRight size={13} className="text-gray-400" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 p-2.5 bg-blue-100 border border-blue-300 rounded-md text-[10px] text-blue-800">
                  <FiInfo size={12} className="shrink-0" />
                  <span>Review your privacy settings regularly to make sure your personal data and notification preferences are up to date.</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* ── Edit Profile Modal ──────────────────────────────── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isUpdatingProfile && setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {editError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <FiAlertTriangle size={14} className="shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={displayEmail}
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-500 mt-1">Contact support to change your primary email.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="+234 …"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                placeholder="Port Harcourt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              placeholder="Street, area…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdatingProfile}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUpdatingProfile ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Change Password Modal ────────────────────────────── */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => !isChangingPassword && setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {pwdError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <FiAlertTriangle size={14} className="shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}
          {pwdSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              {pwdSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              type="password"
              required
              value={pwdForm.currentPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={pwdForm.newPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
            <input
              type="password"
              required
              minLength={6}
              value={pwdForm.confirmPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isChangingPassword}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Account Modal ─────────────────────────────── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
        title="Delete Account"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex gap-2">
            <FiAlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              This permanently deletes your account, saved places, and reviews. This action{" "}
              <strong>cannot</strong> be undone.
            </span>
          </div>

          {deleteError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {deleteError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-mono"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeletingAccount}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount || deleteConfirmText.trim().toUpperCase() !== "DELETE"}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDeletingAccount ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete My Account"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;