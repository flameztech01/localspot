// src/pages/business/BusinessVerification.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  FileText,
  User as UserIcon,
  Phone,
  Mail,
  Building2,
  MapPin,
  FileCheck,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Camera,
  Activity,
  Star,
  CreditCard,
  LogOut,
  Menu,
  Image as ImageIcon,
  Loader2,
  Lock,
  BadgeCheck,
  Layers,
  ArrowRight,
} from "lucide-react";

import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

export default function BusinessVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Account Data
  const { data: businessResp } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const businessName =
    business?.businessName || "Pleasure Restaurant & Lounge";
  const businessEmail =
    business?.email || "contact@pleasurerestaurant.com";
  const businessPhone =
    business?.phone || "+44 20 7946 0912";

  // KYC Form State
  // 1. Contact Verification
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);

  // 2. Verified Owner / Authorized Representative
  const [representativeType, setRepresentativeType] = useState("owner");
  const [ownerLegalName, setOwnerLegalName] = useState(
    "Gabriel Alpha Michael"
  );
  const [ownerDob, setOwnerDob] = useState("1988-04-12");
  const [idType, setIdType] = useState("nin");
  const [idNumber, setIdNumber] = useState("NIN-90823419082");
  const [idFilePreview, setIdFilePreview] = useState("national_id_front.pdf");
  const idInputRef = useRef(null);

  // 3. Business Existence & Activity (CAC)
  const [registeredBusinessName, setRegisteredBusinessName] = useState(
    "Pleasure Restaurant & Lounge Ltd"
  );
  const [registrationType, setRegistrationType] = useState("llc");
  const [cacNumber, setCacNumber] = useState("RC-1849204");
  const [cacStatus, setCacStatus] = useState("Active & Verified on Registry");
  const [cacFilePreview, setCacFilePreview] = useState(
    "cac_certificate_of_incorporation.pdf"
  );
  const [activityProofFile, setActivityProofFile] = useState(
    "business_storefront_activity.jpg"
  );
  const cacInputRef = useRef(null);
  const activityInputRef = useRef(null);

  // 4. Address Verification
  const [operatingAddress, setOperatingAddress] = useState(
    "148 Fleet Street, London EC4A 2BU"
  );
  const [utilityBillFile, setUtilityBillFile] = useState(
    "utility_bill_september_2024.pdf"
  );
  const utilityInputRef = useRef(null);
  const [duplicateChecked, setDuplicateChecked] = useState(true);

  // 5. Category-Specific Licences
  const [riskCategory, setRiskCategory] = useState(
    "Hospitality, Dining & Food Handling (Tier 2 Risk)"
  );
  const [foodLicenceNumber, setFoodLicenceNumber] = useState(
    "FSA-HYS-99201"
  );
  const [foodLicenceExpiry, setFoodLicenceExpiry] = useState("2026-12-31");
  const [liquorLicenceNumber, setLiquorLicenceNumber] = useState(
    "LON-LIQ-33104"
  );
  const [licenceFile, setLicenceFile] = useState(
    "food_safety_health_license.pdf"
  );
  const licenceInputRef = useRef(null);

  // Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutBusinessAccount().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    showToast("Logged out", "info");
    navigate("/business/signin");
  };

  const handleSubmitKYC = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please agree to the verification declaration", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast(
        "KYC submission received! Our compliance team will review your credentials within 24-48 hours.",
        "success"
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="LocalSpot Home"
          >
            <img
              src="/logo.png"
              alt="LocalSpot Logo"
              className="w-7 h-7 object-contain shrink-0"
            />
            <span className="text-base font-extrabold tracking-wider text-gray-900">
              LOCALSPOT
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link
              to="/search"
              className="hover:text-blue-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/saved"
              className="hover:text-blue-600 transition-colors"
            >
              Saved Places
            </Link>
          </nav>

          {/* Right User Avatar */}
          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition"
              title="Business profile"
            >
              <UserIcon className="w-4 h-4 text-gray-600" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Explore
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Contact
            </Link>
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Saved Places
            </Link>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. BREADCRUMB
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <nav
            className="flex items-center gap-2 text-xs text-gray-500 font-medium"
            aria-label="Breadcrumb"
          >
            <Link
              to="/business"
              className="hover:text-blue-600 transition-colors"
            >
              Merchants
            </Link>
            <span className="text-gray-400 font-normal">›</span>
            <Link
              to="/business/profile"
              className="hover:text-blue-600 transition-colors"
            >
              Business profile
            </Link>
            <span className="text-gray-400 font-normal">›</span>
            <span className="text-gray-900 font-semibold">
              Verification &amp; badges (KYC)
            </span>
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTAINER (2 COLUMNS: SIDEBAR + KYC WORKSPACE)
      ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: Business Profile Card & Connected Menu
              (Exact match with user's uploaded screenshot)
          ═════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              {/* Profile Avatar with Camera Icon Overlay */}
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80"
                      alt={businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Link
                    to="/business/profile"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow transition"
                    title="Change photo"
                  >
                    <Camera className="w-3 h-3" />
                  </Link>
                </div>

                <div className="min-w-0 w-full">
                  <h3
                    className="text-sm sm:text-base font-bold text-gray-900 truncate"
                    title={businessName}
                  >
                    {businessName}
                  </h3>
                  <p
                    className="text-xs text-gray-500 truncate mt-0.5"
                    title={businessEmail}
                  >
                    {businessEmail}
                  </p>
                </div>
              </div>

              {/* Navigation Menu (All Connected to Respective Pages) */}
              <nav className="pt-3 space-y-1">
                {/* 1. Edit Profile */}
                <Link
                  to="/business/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <UserIcon className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Edit profile</span>
                </Link>

                {/* 2. Activity Log */}
                <Link
                  to="/business/activity"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Activity className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Activity log</span>
                </Link>

                {/* 3. Verification & Badges (Active highlighted in screenshot!) */}
                <Link
                  to="/business/verification"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50/70 text-blue-600 transition"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verification &amp; badges</span>
                </Link>

              </nav>
            </div>
          </aside>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: Comprehensive KYC & Verification Suite
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header: Title and Status Banner */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Business Verification &amp; Badges (KYC)
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Complete all mandatory verification requirements to obtain the{" "}
                <strong className="text-blue-600">Verified Business Trust Badge</strong>, boost search ranking, and enable merchant payouts.
              </p>
            </div>

            {/* Trust Badge & Progress Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>KYC Status: Compliance Review In Progress</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Official Verified Badge Eligibility
                </h3>
                <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
                  Localspot requires corporate CAC registration, owner identity verification, location evidence, and category-specific safety certificates to safeguard customers.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 shrink-0 text-center">
                <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center mb-2 shadow">
                  <BadgeCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Verified Trust Badge
                </span>
                <span className="text-[10px] text-blue-100 mt-0.5">
                  Tier 2 Verified Merchant
                </span>
              </div>
            </div>

            {/* KYC Form Container */}
            <form onSubmit={handleSubmitKYC} className="space-y-6">
              {/* ─────────────────────────────────────────────────────
                  SECTION 1: Verified Phone Number & Email
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      1. Verified Phone Number &amp; Email
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/40 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Primary Contact Phone
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {businessPhone}
                      </span>
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> SMS Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneVerified(true);
                            showToast("Verification code sent to phone", "info");
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Verify with OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/40 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Official Business Email
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 truncate pr-2">
                        {businessEmail}
                      </span>
                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Email Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEmailVerified(true);
                            showToast("Verification email sent", "info");
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Resend Link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  SECTION 2: Verified Owner or Authorized Representative
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      2. Verified Owner or Authorized Representative
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Representative Designation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Representative Capacity *
                    </label>
                    <div className="relative">
                      <select
                        value={representativeType}
                        onChange={(e) => setRepresentativeType(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                      >
                        <option value="owner">Sole Proprietor / Founder</option>
                        <option value="director">Managing Director / CEO</option>
                        <option value="agent">Authorized Legal Agent</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Legal Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Legal Name (as on ID) *
                    </label>
                    <input
                      type="text"
                      value={ownerLegalName}
                      onChange={(e) => setOwnerLegalName(e.target.value)}
                      placeholder="Full Legal Name"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={ownerDob}
                      onChange={(e) => setOwnerDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* ID Type & Document Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Government ID Type *
                    </label>
                    <div className="relative mb-3">
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                      >
                        <option value="nin">National Identity Number (NIN)</option>
                        <option value="passport">International Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="voters_card">Voter's Card</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>

                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      ID Document Number *
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter ID Number"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Upload Valid Government ID (Front &amp; Back) *
                    </label>
                    <div
                      onClick={() => idInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[120px]"
                    >
                      <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                      <p className="text-xs font-semibold text-gray-700">
                        {idFilePreview ? (
                          <span className="text-blue-600 font-bold">
                            ✓ {idFilePreview} (Click to change)
                          </span>
                        ) : (
                          "Drag & drop ID file or browse"
                        )}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        JPEG, PNG, or PDF up to 5MB
                      </p>
                      <input
                        ref={idInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setIdFilePreview(e.target.files[0].name);
                            showToast("Government ID uploaded", "success");
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  SECTION 3: CAC Registration & Existence Evidence
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      3. Business Existence &amp; CAC Registration Records
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Registered Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Registered Corporate Entity Name *
                    </label>
                    <input
                      type="text"
                      value={registeredBusinessName}
                      onChange={(e) => setRegisteredBusinessName(e.target.value)}
                      placeholder="e.g. Pleasure Restaurant & Lounge Ltd"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Entity Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Corporate Structure *
                    </label>
                    <div className="relative">
                      <select
                        value={registrationType}
                        onChange={(e) => setRegistrationType(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                      >
                        <option value="llc">Limited Liability Company (RC)</option>
                        <option value="bn">Registered Business Name (BN)</option>
                        <option value="partnership">General Partnership</option>
                        <option value="corp">Corporation / Plc</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* CAC Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      CAC Registration / RC Number *
                    </label>
                    <input
                      type="text"
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value)}
                      placeholder="RC-1234567"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Registry Live Verification Badge */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    CAC Registry Cross-Check: {cacStatus}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold underline cursor-pointer">
                    View Registry Record
                  </span>
                </div>

                {/* Upload CAC Certificate & Storefront Photo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Upload CAC Certificate of Incorporation *
                    </label>
                    <div
                      onClick={() => cacInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[110px]"
                    >
                      <FileCheck className="w-6 h-6 text-blue-600 mb-1" />
                      <p className="text-xs font-semibold text-gray-700">
                        {cacFilePreview ? (
                          <span className="text-blue-600 font-bold">
                            ✓ {cacFilePreview}
                          </span>
                        ) : (
                          "Upload Certificate (PDF / Image)"
                        )}
                      </p>
                      <input
                        ref={cacInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setCacFilePreview(e.target.files[0].name);
                            showToast("CAC certificate uploaded", "success");
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business Activity Evidence (Storefront / Premises Photo) *
                    </label>
                    <div
                      onClick={() => activityInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[110px]"
                    >
                      <Camera className="w-6 h-6 text-blue-600 mb-1" />
                      <p className="text-xs font-semibold text-gray-700">
                        {activityProofFile ? (
                          <span className="text-blue-600 font-bold">
                            ✓ {activityProofFile}
                          </span>
                        ) : (
                          "Upload Storefront or Facility Photo"
                        )}
                      </p>
                      <input
                        ref={activityInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setActivityProofFile(e.target.files[0].name);
                            showToast("Activity photo uploaded", "success");
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  SECTION 4: Address or Service-Area Verification
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      4. Address &amp; Service-Area Verification
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Mandatory
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Physical Operational Facility Address *
                  </label>
                  <input
                    type="text"
                    value={operatingAddress}
                    onChange={(e) => setOperatingAddress(e.target.value)}
                    placeholder="Physical Street Address, City, Postal Code"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Proof of Operational Address (Utility Bill / Lease Agreement) *
                    </label>
                    <div
                      onClick={() => utilityInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[110px]"
                    >
                      <FileText className="w-6 h-6 text-blue-600 mb-1" />
                      <p className="text-xs font-semibold text-gray-700">
                        {utilityBillFile ? (
                          <span className="text-blue-600 font-bold">
                            ✓ {utilityBillFile}
                          </span>
                        ) : (
                          "Upload Utility Bill or Lease (< 3 months)"
                        )}
                      </p>
                      <input
                        ref={utilityInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUtilityBillFile(e.target.files[0].name);
                            showToast("Address document uploaded", "success");
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Duplicate Listing Check Result */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800 mb-1">
                        Duplicate-Listing Automated Check
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        To maintain high trust, Localspot verifies that no duplicate businesses or fraudulent claims exist at this address.
                      </p>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Zero duplicate conflicts detected for this location</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  SECTION 5: Category-Specific Licences (Higher Risk)
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      5. Category-Specific Licences &amp; Regulatory Safeguards
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    Industry Specific
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-blue-900 leading-relaxed">
                  <strong>Higher-Risk Category Requirement:</strong> Businesses providing hospitality, food preparation, healthcare, childcare, financial, or nightlife services must provide valid operational operating licences before badges are issued.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Assigned Risk Category
                    </label>
                    <input
                      type="text"
                      disabled
                      value={riskCategory}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Food Hygiene / NAFDAC / License # *
                    </label>
                    <input
                      type="text"
                      value={foodLicenceNumber}
                      onChange={(e) => setFoodLicenceNumber(e.target.value)}
                      placeholder="e.g. FSA-HYS-99201"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      License Expiration Date *
                    </label>
                    <input
                      type="date"
                      value={foodLicenceExpiry}
                      onChange={(e) => setFoodLicenceExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Upload Regulatory Operating License *
                  </label>
                  <div
                    onClick={() => licenceInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px]"
                  >
                    <FileCheck className="w-6 h-6 text-blue-600 mb-1" />
                    <p className="text-xs font-semibold text-gray-700">
                      {licenceFile ? (
                        <span className="text-blue-600 font-bold">
                          ✓ {licenceFile}
                        </span>
                      ) : (
                        "Upload Licence Document"
                      )}
                    </p>
                    <input
                      ref={licenceInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setLicenceFile(e.target.files[0].name);
                          showToast("Licence file uploaded", "success");
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  SECTION 6: Review & Final Submission Declaration
              ───────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    6. Administrator Review &amp; Compliance Declaration
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed space-y-2">
                  <p>
                    <strong>Administrator Review Process:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    <li>Government identity and CAC cross-verification with public databases.</li>
                    <li>Duplicate-listing and address verification inspection.</li>
                    <li>Industry license validation with issuing authorities.</li>
                  </ul>
                </div>

                {/* Agreement Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    I declare under penalty of perjury that I am the legal owner or authorized representative of{" "}
                    <strong>{businessName}</strong>, and all uploaded corporate documents, CAC credentials, addresses, and licenses are authentic, current, and true.
                  </span>
                </label>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <Link
                    to="/business/profile"
                    className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition shadow-sm inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting KYC Credentials...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. EXISTING APPLICATION FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
