// src/pages/business/BusinessActivityLog.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Activity,
  Clock,
  ShieldCheck,
  Star,
  CreditCard,
  LogOut,
  User as UserIcon,
  Camera,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Megaphone,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";

import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    action: "Business Profile Updated",
    category: "Profile",
    detail: "Operating hours and contact information modified.",
    time: "Today at 02:14 PM",
    ip: "192.168.1.45 (London, UK)",
    icon: UserIcon,
    badgeColor: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  {
    id: "act-2",
    action: "KYC Compliance Document Uploaded",
    category: "Verification",
    detail: "CAC certificate of incorporation submitted for compliance review.",
    time: "Today at 11:30 AM",
    ip: "192.168.1.45 (London, UK)",
    icon: ShieldCheck,
    badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  {
    id: "act-3",
    action: "New Ad Campaign Launched",
    category: "Advertising",
    detail: "Weekend Wardrobe Refresh campaign published ($500 budget).",
    time: "Yesterday at 04:20 PM",
    ip: "192.168.1.45 (London, UK)",
    icon: Megaphone,
    badgeColor: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  {
    id: "act-4",
    action: "Merchant Reply to Customer Review",
    category: "Reviews",
    detail: "Responded to review by Randy Walker regarding Glendale location.",
    time: "Oct 11, 2024 at 09:12 AM",
    ip: "192.168.1.45 (London, UK)",
    icon: Star,
    badgeColor: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  {
    id: "act-5",
    action: "Account Password Updated",
    category: "Security",
    detail: "Business merchant credentials updated with multi-factor authentication.",
    time: "Oct 08, 2024 at 06:45 PM",
    ip: "192.168.1.45 (London, UK)",
    icon: ShieldCheck,
    badgeColor: "bg-gray-100 text-gray-700 border border-gray-200",
  },
];

export default function BusinessActivityLog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: businessResp } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const businessName =
    business?.businessName || "Pleasure Restaurant & Lounge";
  const businessEmail =
    business?.email || "contact@pleasurerestaurant.com";

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

  const filteredActivities = INITIAL_ACTIVITIES.filter((act) => {
    const matchesCat =
      filterCategory === "all" || act.category.toLowerCase() === filterCategory;
    const matchesSearch =
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
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

          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition"
              title="Business profile"
            >
              <UserIcon className="w-4 h-4 text-gray-600" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
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
            <span className="text-gray-900 font-semibold">Activity log</span>
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTAINER (2 COLUMNS: SIDEBAR + ACTIVITY LOG)
      ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Sidebar matching screenshot */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
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
                  >
                    <Camera className="w-3 h-3" />
                  </Link>
                </div>

                <div className="min-w-0 w-full">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {businessName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {businessEmail}
                  </p>
                </div>
              </div>

              {/* Navigation Menu (Connected to Respective Pages) */}
              <nav className="pt-3 space-y-1">
                <Link
                  to="/business/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <UserIcon className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Edit profile</span>
                </Link>

                <Link
                  to="/business/activity"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50/70 text-blue-600 transition"
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Activity log</span>
                </Link>

                <Link
                  to="/business/verification"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Verification &amp; badges</span>
                </Link>

              </nav>
            </div>
          </aside>

          {/* RIGHT COLUMN: Activity Log Content */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Merchant Activity Log
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Chronological history of security, profile, verification, and advertising actions.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter activity..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Activities List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              {filteredActivities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs text-blue-600 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                          {act.action}
                        </h4>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {act.time}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600">{act.detail}</p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400">
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${act.badgeColor}`}>
                          {act.category}
                        </span>
                        <span>IP: {act.ip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
