// src/components/BusinessSidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Loader,
} from "lucide-react";

import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../features/businessApiSlice";
import { logout } from "../features/auth/authSlice";

// Cream palette — tweak here, applies everywhere
const CREAM = "#FDFCE8";
const CREAM_SOFT = "#FBF9DE";
const CREAM_BORDER = "#EFEBC4";
const ACCENT = "#3B82F6";

const NAV_ITEMS = [
  { to: "/business", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/business/profile", label: "Business Profile", icon: Store },
  { to: "/business/promotions", label: "Promotions", icon: Megaphone },
  { to: "/business/ads", label: "Advertisements", icon: BarChart3 },
  { to: "/business/reviews", label: "Reviews", icon: Star },
  { to: "/business/settings", label: "Settings", icon: Settings },
];

const statusMeta = {
  approved: {
    label: "Verified",
    color: "text-emerald-700 bg-emerald-100 border border-emerald-200",
    Icon: BadgeCheck,
  },
  pending: {
    label: "Pending",
    color: "text-amber-700 bg-amber-100 border border-amber-200",
    Icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "text-rose-700 bg-rose-100 border border-rose-200",
    Icon: XCircle,
  },
  unverified: {
    label: "Unverified",
    color: "text-gray-600 bg-gray-100 border border-gray-200",
    Icon: AlertCircle,
  },
};

const BusinessSidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: businessResp, isLoading } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

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

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    if (typeof onLogout === "function") {
      return onLogout();
    }
    try {
      await logoutBusinessAccount().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    try {
      localStorage.removeItem("persist:root");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      sessionStorage.clear();
    } catch (_) {}
    navigate("/business/signin", { replace: true });
    setTimeout(() => window.location.reload(), 50);
  };

  const handleNavClick = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: `1px solid ${CREAM_BORDER}` }}
      >
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
          <span className="text-base font-bold tracking-wide text-gray-900">
            LOCALSPOT
          </span>
        </Link>
      </div>

      {/* Business identity */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: `1px solid ${CREAM_BORDER}` }}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3.5 w-24 bg-white/60 rounded animate-pulse" />
              <div className="h-3 w-16 bg-white/60 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EFEBC4] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
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
                  className="text-sm font-semibold text-gray-900 truncate"
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
            <div className="mt-3 flex items-center justify-between bg-white/70 border border-[#EFEBC4] rounded-lg px-2.5 py-1.5">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <ImageIcon className="h-3 w-3" />
                Images
              </span>
              <span className="text-[11px] font-semibold text-gray-800">
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
                  ? "bg-white text-[#3B82F6] shadow-sm"
                  : "text-gray-700 hover:bg-white/60 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-4 w-4 flex-shrink-0 ${
                  active ? "text-[#3B82F6]" : "text-gray-500"
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
      <div
        className="px-3 py-3"
        style={{ borderTop: `1px solid ${CREAM_BORDER}` }}
      >
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/70 hover:text-red-600 transition-colors disabled:opacity-60"
        >
          {loggingOut ? (
            <>
              <Loader className="h-4 w-4 flex-shrink-0 animate-spin" />
              <span className="truncate">Logging out…</span>
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Log out</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-screen w-64 z-40"
        style={{
          backgroundColor: CREAM,
          borderRight: `1px solid ${CREAM_BORDER}`,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-3 left-3 z-40 w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 shadow-sm active:scale-95 transition"
        style={{
          backgroundColor: CREAM,
          border: `1px solid ${CREAM_BORDER}`,
        }}
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="lg:hidden fixed top-0 left-0 h-screen w-72 max-w-[80vw] z-50 flex flex-col animate-[slideIn_200ms_ease-out]"
            style={{
              backgroundColor: CREAM,
              borderRight: `1px solid ${CREAM_BORDER}`,
            }}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white/60"
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