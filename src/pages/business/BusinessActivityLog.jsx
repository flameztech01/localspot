// src/pages/business/BusinessActivityLog.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Activity,
  ShieldCheck,
  Star,
  LogOut,
  User as UserIcon,
  Camera,
  Megaphone,
  Search,
  CreditCard,
  X,
  Menu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from "../../features/authApiSlice";
import { useGetMyActivityLogQuery } from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

// ─── Category meta (icon + badge colors) ───────────────────
const CATEGORY_META = {
  Profile: {
    Icon: UserIcon,
    badgeColor: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  Verification: {
    Icon: ShieldCheck,
    badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  Advertising: {
    Icon: Megaphone,
    badgeColor: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  Reviews: {
    Icon: Star,
    badgeColor: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  Security: {
    Icon: ShieldCheck,
    badgeColor: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  Account: {
    Icon: UserIcon,
    badgeColor: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  Billing: {
    Icon: CreditCard,
    badgeColor: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  },
  System: {
    Icon: Activity,
    badgeColor: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

const STATUS_META = {
  pending: {
    Icon: Clock,
    cls: "text-amber-700 bg-amber-50 border border-amber-200",
    label: "Pending",
  },
  success: {
    Icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    label: "Completed",
  },
  error: {
    Icon: AlertCircle,
    cls: "text-rose-700 bg-rose-50 border border-rose-200",
    label: "Rejected",
  },
  info: {
    Icon: Info,
    cls: "text-gray-600 bg-gray-100 border border-gray-200",
    label: null,
  },
};

// ─── Date helpers ───────────────────────────────────────────
const isToday = (d) => {
  const now = new Date();
  const x = new Date(d);
  return (
    x.getDate() === now.getDate() &&
    x.getMonth() === now.getMonth() &&
    x.getFullYear() === now.getFullYear()
  );
};

const isYesterday = (d) => {
  const now = new Date();
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  const x = new Date(d);
  return (
    x.getDate() === y.getDate() &&
    x.getMonth() === y.getMonth() &&
    x.getFullYear() === y.getFullYear()
  );
};

const formatTimestamp = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday(d)) return `Today at ${time}`;
  if (isYesterday(d)) return `Yesterday at ${time}`;

  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${date} at ${time}`;
};

const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: "Verification", label: "Verification" },
  { value: "Profile", label: "Profile" },
  { value: "Advertising", label: "Advertising" },
  { value: "Reviews", label: "Reviews" },
  { value: "Security", label: "Security" },
  { value: "Billing", label: "Billing" },
];

// ─── Page ───────────────────────────────────────────────────
const BusinessActivityLog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // ─── Account data ──────────────────────────────────────
  const { data: userResp } = useGetCurrentUserQuery();
  const business = userResp?.data || userResp;
  const [logoutUser] = useLogoutUserMutation();

  const businessName =
    business?.businessName || business?.fullName || "Your Business";
  const businessEmail = business?.email || "";
  const avatarUrl = business?.logo || null;

  // ─── Activity log ──────────────────────────────────────
  const {
    data: activityResp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyActivityLogQuery({
    page,
    limit: 50,
    category: filterCategory,
    q: searchQuery,
  });

  const logs = activityResp?.data || [];
  const pagination = activityResp?.pagination || {};
  const isUnauthorized = error?.status === 401;

  // ─── Handlers ──────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    try {
      localStorage.removeItem("persist:root");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    } catch (_) {}
    showToast("Logged out", "info");
    navigate("/signin");
  };

  const handleCategoryChange = (cat) => {
    setFilterCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  // ─── Guards ────────────────────────────────────────────
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Session expired
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in again to view your activity.
          </p>
          <button
            onClick={() => navigate("/signin", { replace: true })}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    {
      to: "/business/profile",
      label: "Edit profile",
      Icon: UserIcon,
      active: false,
    },
    {
      to: "/business/activity",
      label: "Activity log",
      Icon: Activity,
      active: true,
    },
    {
      to: "/business/verification",
      label: "Verification & badges",
      Icon: ShieldCheck,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
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
            <Link to="/search" className="hover:text-blue-600 transition-colors">
              Explore
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link to="/saved" className="hover:text-blue-600 transition-colors">
              Saved Places
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition overflow-hidden"
              title="Business profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-gray-600" />
              )}
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

      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-hidden">
            <Link
              to="/business"
              className="hover:text-blue-600 transition-colors shrink-0"
            >
              Merchants
            </Link>
            <span className="text-gray-400 shrink-0">›</span>
            <Link
              to="/business/profile"
              className="hover:text-blue-600 transition-colors shrink-0"
            >
              Business profile
            </Link>
            <span className="text-gray-400 shrink-0">›</span>
            <span className="text-gray-900 font-semibold truncate">
              Activity log
            </span>
          </nav>
        </div>
      </div>

      {/* ─── Main ─── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    )}
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

              <nav className="pt-3 space-y-1">
                {NAV_ITEMS.map(({ to, label, Icon, active }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition ${
                      active
                        ? "font-semibold bg-blue-50/70 text-blue-600"
                        : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Merchant Activity Log
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Chronological history of security, profile, verification, and
                  advertising actions on your account.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Filter activity..."
                    className="w-full pl-9 pr-8 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="shrink-0 w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="-mx-4 lg:mx-0 px-4 lg:px-0 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                {CATEGORY_FILTERS.map((f) => {
                  const active = filterCategory === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => handleCategoryChange(f.value)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition whitespace-nowrap ${
                        active
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity list */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              {/* Loading skeleton */}
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-14">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-7 h-7 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    No activity yet
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {searchQuery || filterCategory !== "all"
                      ? "Try a different filter or clear your search."
                      : "Actions on your account will appear here as they happen."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => {
                    const cat =
                      CATEGORY_META[log.category] || CATEGORY_META.System;
                    const status = STATUS_META[log.status] || STATUS_META.info;
                    const IconComponent = cat.Icon;
                    const StatusIcon = status.Icon;

                    return (
                      <div
                        key={log._id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs text-blue-600 mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                              {log.action}
                            </h4>
                            <span className="text-[11px] text-gray-400 font-medium shrink-0">
                              {formatTimestamp(log.createdAt)}
                            </span>
                          </div>

                          {log.detail && (
                            <p className="text-xs text-gray-600">
                              {log.detail}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-400">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold ${cat.badgeColor}`}
                            >
                              {log.category}
                            </span>

                            {status.label && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${status.cls}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            )}

                            {log.ip && (
                              <span className="truncate">IP: {log.ip}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetching}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                  >
                    Previous
                  </button>

                  <span className="text-xs text-gray-500 font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={page >= pagination.pages || isFetching}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                  >
                    {isFetching && page < pagination.pages ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessActivityLog;