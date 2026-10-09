// src/components/BusinessSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Store,
  Megaphone,
  BarChart3,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  BadgeCheck,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useGetCurrentBusinessAccountQuery } from "../features/businessApiSlice";

const NAV_ITEMS = [
  {
    to: "/business",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/business/profile",
    label: "Business Profile",
    icon: Store,
  },
  {
    to: "/business/promotions",
    label: "Promotions",
    icon: Megaphone,
  },
  {
    to: "/business/ads",
    label: "Advertisements",
    icon: BarChart3,
  },
  {
    to: "/business/reviews",
    label: "Reviews",
    icon: Star,
  },
  {
    to: "/business/settings",
    label: "Settings",
    icon: Settings,
  },
];

const statusMeta = {
  approved: {
    label: "Verified",
    color:
      "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    Icon: BadgeCheck,
  },
  pending: {
    label: "Pending",
    color:
      "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
    Icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    Icon: XCircle,
  },
  unverified: {
    label: "Unverified",
    color: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
    Icon: AlertCircle,
  },
};

const BusinessSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const { data: businessResp, isLoading } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;

  const isEmailVerified = business?.isVerified ?? false;
  const isApproved = business?.businessVerified ?? false;
  const isRejected = !!business?.businessRejectionReason && !isApproved;

  const approvalStatus = !isEmailVerified
    ? "unverified"
    : isApproved
      ? "approved"
      : isRejected
        ? "rejected"
        : "pending";

  const meta = statusMeta[approvalStatus];
  const StatusIcon = meta.Icon;

  const imageCount = business?.images?.length || 0;

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return (
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`)
    );
  };

  const initials = (business?.businessName || "B").charAt(0).toUpperCase();

  const handleLogout = () => {
    // Wire to your logout mutation / dispatch
    // dispatch(logout());
    // localStorage.removeItem("userInfo");
    navigate("/business/signin");
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/business"
          onClick={handleNavClick}
          className="flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="LocalSpot"
            className="h-7 w-7 object-contain"
          />
          <span className="text-base font-bold tracking-wide text-gray-900 dark:text-white">
            LOCALSPOT
          </span>
        </Link>
      </div>

      {/* Business identity block */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {business?.coverImage ? (
                  <img
                    src={business.coverImage}
                    alt={business.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#3B82F6]">
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                  title={business?.businessName}
                >
                  {business?.businessName || "Your Business"}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${meta.color}`}
                >
                  <StatusIcon className="h-2.5 w-2.5" />
                  {meta.label}
                </span>
              </div>
            </div>

            {/* Images indicator */}
            <div className="mt-3 flex items-center justify-between bg-gray-100 dark:bg-gray-800/60 rounded-lg px-2.5 py-1.5 border border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <ImageIcon className="h-3 w-3" />
                Images
              </span>
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                {imageCount}/20
              </span>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-[#3B82F6] dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 flex-shrink-0 ${
                  active ? "text-[#3B82F6] dark:text-blue-400" : ""
                }`}
              />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
          <span className="truncate">Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
        <SidebarContent />
      </aside>

      {/* ─── Mobile top bar trigger ─── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-3 left-3 z-40 w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm active:scale-95 transition"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* ─── Mobile drawer ─── */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 h-screen w-72 max-w-[80vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col animate-[slideIn_200ms_ease-out]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default BusinessSidebar;
