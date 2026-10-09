// src/pages/SavedPlaces.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiUser,
  FiHeart,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import {
  useListSavedPlacesQuery,
  useUnsavePlaceMutation,
} from "../features/savedPlaceApiSlice";

// ─── Helpers ───────────────────────────────────────────────
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";

const KIND_TAG = {
  hotels: "Hotel",
  dining: "Restaurant",
  things_to_do: "Things to Do",
  shops: "Shop",
  others: "Business",
};

const toMinutes = (s) => {
  if (!s || typeof s !== "string") return null;
  const [h, m] = s.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const getOpenState = (openingHours) => {
  if (!Array.isArray(openingHours) || openingHours.length === 0) {
    return { open: false, hours: "See details" };
  }
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = openingHours.find((h) => h.day === day);

  if (!today || today.closed) return { open: false, hours: "Closed today" };

  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  if (open === null || close === null)
    return { open: false, hours: "See details" };

  let isOpen;
  if (close < open) isOpen = minutes >= open || minutes <= close;
  else isOpen = minutes >= open && minutes <= close;

  return { open: isOpen, hours: `${today.open} - ${today.close}` };
};

const formatMeta = (biz) => {
  const parts = [];
  if (biz.categorySlug) {
    parts.push(
      biz.categorySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  } else if (biz.businessKind) {
    parts.push(KIND_TAG[biz.businessKind] || "Local");
  }
  if (biz.priceRange) parts.push("₦".repeat(biz.priceRange));
  return parts.join(" • ");
};

// ─── Component ─────────────────────────────────────────────
const SavedPlaces = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: savedResp,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useListSavedPlacesQuery(undefined, { skip: !userInfo });

  const [unsavePlace, { isLoading: isUnsaving }] = useUnsavePlaceMutation();

  const places = savedResp?.data || [];
  const isUnauthorized = error?.status === 401;

  const handleRemove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await unsavePlace(id).unwrap();
    } catch (err) {
      // Non-blocking — RTK Query will keep the UI in sync via invalidation
      console.error("Failed to remove:", err);
    }
  };

  // ─── Not logged in ───────────────────────────────────────
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <FiUser className="h-7 w-7 text-teal-700" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Sign in to see saved places
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Save your favorite spots and find them all in one place.
            </p>
            <Link
              to="/business/signin"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Sign in
              <FiChevronRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Session expired
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Please log in again to view saved places.
            </p>
            <Link
              to="/business/signin"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 h-fit">
            <Link
              to="/profile"
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 hover:border-teal-500 hover:shadow-md transition-all block"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0 overflow-hidden">
                {userInfo?.profilePhoto ? (
                  <img
                    src={userInfo.profilePhoto}
                    alt={userInfo.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={24} />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {userInfo?.fullName || userInfo?.businessName || "Your account"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo?.email || ""}
                </p>
              </div>
            </Link>

            <nav className="mt-4 flex flex-col gap-1">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <FiUser size={18} />
                My profile
              </NavLink>

              <NavLink
                to="/saved"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <FiHeart size={18} />
                Saved places
              </NavLink>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Saved places
              </h1>
              {!isLoading && places.length > 0 && (
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
                >
                  <FiRefreshCw
                    size={13}
                    className={isFetching ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                      <div className="h-8 w-full bg-gray-100 rounded animate-pulse mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && isError && !isUnauthorized && (
              <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
                <FiAlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Couldn't load saved places
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  {error?.data?.message || "Something went wrong."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition disabled:opacity-60"
                >
                  <FiRefreshCw
                    size={13}
                    className={isFetching ? "animate-spin" : ""}
                  />
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && places.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No saved places yet
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  Start exploring and save your favorite spots to see them here.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  Explore places
                  <FiChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* Grid */}
            {!isLoading && !isError && places.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {places.map((biz) => {
                  const { open, hours } = getOpenState(biz.openingHours);
                  const img =
                    biz.coverImage ||
                    (Array.isArray(biz.images) && biz.images[0]) ||
                    FALLBACK_IMG;
                  const locationLine =
                    [biz.location?.city, biz.location?.state]
                      .filter(Boolean)
                      .join(", ") ||
                    biz.location?.address ||
                    "Port Harcourt";

                  return (
                    <Link
                      key={biz._id}
                      to={`/places/${biz._id}`}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={img}
                          alt={biz.businessName}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMG;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleRemove(e, biz._id)}
                          disabled={isUnsaving}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm transition-colors disabled:opacity-60"
                          title="Remove from saved"
                          aria-label="Remove from saved"
                        >
                          <FaHeart size={16} />
                        </button>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-teal-700 transition-colors">
                          {biz.businessName}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                          {formatMeta(biz) || "Local spot"}
                        </p>

                        <div className="space-y-2 mb-4">
                          <p className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FiMapPin size={12} className="shrink-0" />
                            <span className="truncate">{locationLine}</span>
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-1 text-xs">
                              <FaStar className="text-orange-500" size={12} />
                              <span className="font-semibold text-gray-900">
                                {Number(biz.rating || 0).toFixed(1)}
                              </span>
                              <span className="text-gray-500">
                                ({biz.numReviews || 0})
                              </span>
                            </p>
                          </div>
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                            <FiClock size={12} className="shrink-0" />
                            <span
                              className={
                                open ? "text-green-600" : "text-red-500"
                              }
                            >
                              {open ? "Open now" : "Closed"}
                            </span>
                            <span>•</span>
                            <span className="truncate">{hours}</span>
                          </p>
                        </div>

                        <div className="mt-auto pt-2">
                          <div className="block w-full py-2 text-center text-xs font-medium text-gray-900 border border-gray-200 rounded-lg group-hover:bg-gray-50 transition-colors">
                            View details
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedPlaces;