// src/components/PopularSpots.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiHeart,
  FiMapPin,
  FiWifiOff,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import { useListPublicBusinessesQuery } from "../features/businessApiSlice";

const PAGE_SIZE = 8;
const FETCH_LIMIT = 40;

const FILTERS = [
  { label: "All", value: "" },
  { label: "Hotels", value: "hotels" },
  { label: "Dining spots", value: "dining" },
  { label: "Things to do", value: "things_to_do" },
  { label: "Shops", value: "shops" },
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";

const OBJECT_POSITIONS = [
  "object-left",
  "object-center",
  "object-right",
  "object-top",
  "object-bottom",
];

// ──────────────────────────────────────────────────────────
// Opening hours
// ──────────────────────────────────────────────────────────
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

  return {
    open: isOpen,
    hours: `${today.open} - ${today.close}`,
  };
};

// ──────────────────────────────────────────────────────────
// Kind tag
// ──────────────────────────────────────────────────────────
const KIND_TAG = {
  hotels: "HOTEL",
  dining: "DINING",
  things_to_do: "THINGS TO DO",
  shops: "SHOPPING",
  others: "LOCAL",
};

const formatTag = (biz) => {
  if (biz.businessKind === "others" && biz.businessKindOther) {
    return biz.businessKindOther.toUpperCase().slice(0, 22);
  }
  return KIND_TAG[biz.businessKind] || "PLACE";
};

// ──────────────────────────────────────────────────────────
// Meta line — "Restaurants • ₦₦"
// ──────────────────────────────────────────────────────────
const formatMeta = (biz) => {
  const parts = [];
  if (biz.categorySlug) {
    parts.push(
      biz.categorySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    );
  }
  if (biz.priceRange) {
    parts.push("₦".repeat(biz.priceRange));
  }
  return parts.join(" • ");
};

// ──────────────────────────────────────────────────────────
// Normalizer
// ──────────────────────────────────────────────────────────
const normalizeSpot = (biz, index = 0) => {
  if (!biz) return null;
  const id = biz._id || biz.id;
  if (!id) return null;

  const { open, hours } = getOpenState(biz.openingHours);
  const loc = biz.location || {};
  const locationLine =
    [loc.city, loc.state].filter(Boolean).join(", ") ||
    loc.address ||
    "Port Harcourt";

  const img =
    biz.coverImage ||
    (Array.isArray(biz.images) && biz.images.length > 0
      ? biz.images[0]
      : null) ||
    FALLBACK_IMG;

  return {
    id,
    name: biz.businessName || "Unnamed business",
    tag: formatTag(biz),
    group: biz.businessKind || null,
    meta: formatMeta(biz),
    location: locationLine,
    rating: Number(biz.rating || 0),
    reviews: Number(biz.numReviews || 0),
    open,
    hours,
    img,
    pos: OBJECT_POSITIONS[index % OBJECT_POSITIONS.length],
  };
};

// ──────────────────────────────────────────────────────────
// Skeleton
// ──────────────────────────────────────────────────────────
const SkeletonSpot = () => (
  <article className="relative flex aspect-[3/4] w-full animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:aspect-auto">
    <div className="absolute inset-0 sm:relative sm:aspect-[4/3] sm:w-full" />
  </article>
);

// ──────────────────────────────────────────────────────────
// Card
// ──────────────────────────────────────────────────────────
const SpotCard = ({ spot, saved, onToggleSave }) => (
  <Link
    to={`/places/${spot.id}`}
    className="group relative flex aspect-[3/4] w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 sm:aspect-auto"
    aria-label={`View ${spot.name}`}
  >
    {/* Image */}
    <div className="absolute inset-0 overflow-hidden sm:relative sm:inset-auto sm:aspect-[4/3] sm:w-full">
      <img
        src={spot.img}
        alt={spot.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG;
        }}
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${spot.pos || "object-center"}`}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 sm:hidden" />

      <span className="absolute left-2 top-2 rounded bg-white px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-gray-900 sm:text-[9px]">
        {spot.tag}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave(spot.id);
        }}
        aria-label={saved ? "Remove from saved places" : "Save place"}
        aria-pressed={saved}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-all hover:scale-110 hover:bg-white"
      >
        {saved ? (
          <FaHeart size={13} className="text-red-500" />
        ) : (
          <FiHeart size={13} />
        )}
      </button>

      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30 sm:flex">
        <span className="translate-y-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-900 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="relative z-10 mt-auto flex flex-col p-2.5 sm:mt-0 sm:flex-1 sm:p-4">
      <h3 className="line-clamp-2 text-xs font-bold leading-tight text-white sm:min-h-0 sm:truncate sm:text-gray-900 sm:transition-colors sm:group-hover:text-[#3B82F6] sm:text-sm">
        {spot.name}
      </h3>

      <p className="mt-2 hidden text-xs leading-snug text-gray-600 sm:block sm:truncate">
        {spot.meta || "Local spot"}
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] text-white/75 sm:mt-1.5 sm:gap-1.5 sm:text-xs sm:text-gray-600">
        <FiMapPin className="shrink-0" size={10} />
        <span className="truncate">{spot.location || "Port Harcourt"}</span>
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] sm:mt-1.5 sm:gap-1.5 sm:text-xs">
        <FaStar
          className="shrink-0 text-orange-400 sm:text-orange-500"
          size={10}
        />
        <span className="font-semibold text-white sm:text-gray-900">
          {spot.rating.toFixed(1)}
        </span>
        <span className="text-white/70 sm:text-gray-500">
          ({spot.reviews})
        </span>
      </p>

      <p className="mt-1.5 hidden items-center gap-1.5 text-[10px] font-semibold uppercase leading-snug text-gray-700 sm:flex">
        <FiClock className="shrink-0" size={11} />
        <span>
          <span className={spot.open ? "text-green-600" : "text-red-500"}>
            {spot.open ? "Open now" : "Closed"}
          </span>
          {" • "}
          {spot.hours || (spot.open ? "Open" : "Closed")}
        </span>
      </p>

      <div className="mt-3 hidden items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] font-semibold text-gray-500 sm:flex sm:group-hover:text-[#3B82F6] sm:transition-colors">
        <span>View details</span>
        <FiArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  </Link>
);

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────
const PopularSpots = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [saved, setSaved] = useState([]);

  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListPublicBusinessesQuery({
    kind: active || undefined,
    sort: "popular",
    limit: FETCH_LIMIT,
    page: 1,
  });

  const apiPlaces = apiData?.data?.businesses || [];

  const spots = useMemo(
    () => apiPlaces.map((p, i) => normalizeSpot(p, i)).filter(Boolean),
    [apiPlaces],
  );

  const showEmptyState = !isLoading && (isError || spots.length === 0);
  const showSkeleton = isLoading;

  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const shown = spots.slice(0, PAGE_SIZE);

  // Navigate to /search with the current filter applied
  const handleSeeAll = () => {
    const params = new URLSearchParams();
    if (active) params.set("category", active);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : "/search");
  };

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Popular Spots
        </h2>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter popular spots"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              role="tab"
              aria-selected={active === f.value}
              onClick={() => setActive(f.value)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:px-5 sm:text-sm ${
                active === f.value
                  ? "border-gray-900 bg-white text-gray-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty / error state */}
        {showEmptyState && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
              <FiWifiOff size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isError ? "Couldn't load popular spots" : "No spots here yet"}
            </h3>
            <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
              {isError
                ? "Check your connection or try again in a moment."
                : "Businesses will appear here once they've been approved by our team."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <FiRefreshCw
                size={13}
                className={isFetching ? "animate-spin" : ""}
              />
              Try again
            </button>
          </div>
        )}

        {/* Skeleton */}
        {showSkeleton && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonSpot key={i} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!showEmptyState && !showSkeleton && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {shown.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  saved={saved.includes(spot.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>

            {shown.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">
                No spots in this category yet.
              </p>
            )}

            {/* Load more → routes to /search with current filter */}
            {spots.length > PAGE_SIZE && (
              <div className="mt-8 flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleSeeAll}
                  className="w-full rounded-lg border border-[#60A5FA] bg-white px-6 py-2.5 text-sm font-medium text-[#3B82F6] transition-colors hover:bg-blue-50 sm:w-auto"
                >
                  Load more popular places
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PopularSpots;