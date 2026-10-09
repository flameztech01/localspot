// src/components/admin/AdminTopNav.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiMenu, FiBell, FiChevronRight } from "react-icons/fi";

import { useListBusinessesQuery } from "../../features/businessApiSlice";

const AdminTopNav = ({
  onMenuClick,
  activeTab = "dashboard",
  selectedBusinessId = null,
  onGoToApprovals,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Real pending queue — limit 5 for the dropdown preview
  const { data: pendingResp } = useListBusinessesQuery({
    status: "pending",
    limit: 5,
  });

  const pendingCount = pendingResp?.pagination?.total || 0;
  const pendingItems = pendingResp?.data || [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName =
    userInfo?.fullName ||
    userInfo?.businessName ||
    userInfo?.email?.split("@")[0] ||
    "Admin";

  const displayRole =
    userInfo?.role === "admin"
      ? "Admin"
      : userInfo?.role === "business"
        ? "Business"
        : "Moderator";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const displayBizId = selectedBusinessId
    ? selectedBusinessId.slice(-8).toUpperCase()
    : null;

  const renderBreadcrumb = () => {
    if (activeTab === "approval" && displayBizId) {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onTabChange?.("businesses")}
            className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            Businesses
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Approval</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold text-[11px] sm:text-xs font-mono border border-gray-200/60">
            {displayBizId}
          </span>
        </div>
      );
    }

    if (activeTab === "businesses") {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-900 font-bold">Businesses</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Management</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] sm:text-xs font-mono border border-blue-200/60">
            DIRECTORY
          </span>
        </div>
      );
    }

    if (activeTab === "dashboard") {
      return (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-900 font-bold">Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">Overview</span>
          <span className="ml-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] sm:text-xs font-mono border border-emerald-200/60">
            REAL-TIME
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-900 font-bold capitalize">{activeTab}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 font-medium">Management</span>
      </div>
    );
  };

  const formatRelative = (iso) => {
    if (!iso) return "";
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open sidebar menu"
          >
            <FiMenu size={20} />
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-2.5 shrink-0 group select-none"
          >
            <img
              src="/logo.png"
              alt="Localspot Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight whitespace-nowrap">
              Localspot Admin
            </span>
          </Link>

          <div className="hidden sm:block h-5 w-px bg-gray-200 shrink-0" />

          <div className="hidden sm:flex items-center truncate">
            {renderBreadcrumb()}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile breadcrumb pill */}
          {displayBizId && (
            <div className="sm:hidden text-xs">
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold font-mono text-[10px]">
                {displayBizId}
              </span>
            </div>
          )}

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
              aria-label="View notifications"
            >
              <FiBell size={18} />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">
                    Notifications
                  </span>
                  {pendingCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {pendingCount} pending
                    </span>
                  )}
                </div>

                {pendingItems.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <p className="text-xs text-gray-400">
                      No pending items right now.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {pendingItems.map((biz) => (
                      <button
                        key={biz._id}
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          onGoToApprovals?.();
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-amber-50/50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {biz.businessName || "Unnamed business"}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {biz.email || "—"}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {formatRelative(biz.createdAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {pendingCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onGoToApprovals?.();
                    }}
                    className="w-full text-center px-3 py-2.5 text-xs font-bold text-[#5397F6] hover:bg-blue-50 border-t border-gray-100 flex items-center justify-center gap-1"
                  >
                    View all pending
                    <FiChevronRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Moderator pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight whitespace-nowrap">
                {displayName}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                {displayRole}
              </span>
            </div>
            <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold shadow-2xs shrink-0">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNav;
