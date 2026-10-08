// src/components/Featured.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import { useGetFeaturedBusinessesQuery } from "../features/discoveryApiSlice";

const GAP = 16;

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";

// ──────────────────────────────────────────────────────────
// Debug logger — shows exactly what's happening
// ──────────────────────────────────────────────────────────
const logFeatured = (label, payload) => {
  const style = "background:#3B82F6;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold";
  // eslint-disable-next-line no-console
  console.groupCollapsed(`%c[Featured] ${label}`, style);
  // eslint-disable-next-line no-console
  Object.entries(payload).forEach(([k, v]) => console.log(k, v));
  // eslint-disable-next-line no-console
  console.groupEnd();
};

// ──────────────────────────────────────────────────────────
// Helpers
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

  return { open: isOpen, hours: `${today.open} - ${today.close}` };
};

const normalizePlace = (p) => {
  if (!p) return null;
  const id = p._id || p.id;
  if (!id) return null;

  const priceSymbol =
    p.priceRange === 1
      ? "$"
      : p.priceRange === 2
      ? "$$"
      : p.priceRange === 3
      ? "$$$"
      : p.priceRange === 4
      ? "$$$$"
      : null;

  const metaParts = [];
  if (p.categorySlug) {
    metaParts.push(
      p.categorySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  }
  if (priceSymbol) metaParts.push(priceSymbol);
  const meta = metaParts.join(" • ") || "Local spot";

  const loc = p.location || {};
  const locationLine =
    [loc.city, loc.state].filter(Boolean).join(", ") ||
    loc.address ||
    p.address ||
    "Location not set";

  const { open, hours } = getOpenState(p.openingHours);

  const img =
    p.coverImage ||
    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null) ||
    FALLBACK_IMG;

  return {
    id,
    name: p.businessName || "Unnamed business",
    meta,
    location: locationLine,
    rating: Number(p.rating || 0),
    reviews: Number(p.numReviews || 0),
    open,
    hours,
    img,
    verified: true,
  };
};

// ──────────────────────────────────────────────────────────
// Skeleton
// ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
    <div className="relative aspect-[3/2] w-full bg-gray-100 sm:aspect-[4/3] animate-pulse" />
    <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-4">
      <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
      <div className="hidden sm:block h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
      <div className="h-2.5 w-2/3 rounded bg-gray-100 animate-pulse" />
      <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
      <div className="mt-3 h-7 w-full rounded bg-gray-100 animate-pulse" />
    </div>
  </article>
);

// ──────────────────────────────────────────────────────────
// Place Card
// ──────────────────────────────────────────────────────────
const PlaceCard = ({ place, saved, onToggleSave }) => (
  <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
    <div className="relative aspect-[3/2] w-full overflow-hidden sm:aspect-[4/3]">
      <img
        src={place.img}
        alt={place.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG;
        }}
        className="h-full w-full object-cover"
      />

      {place.verified && (
        <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded bg-teal-700 px-1.5 py-0.5 text-[8px] font-medium text-white sm:left-2 sm:top-2 sm:gap-1 sm:rounded-md sm:px-2 sm:text-xs">
          <FiCheck size={9} className="sm:hidden" />
          <FiCheck size={11} className="hidden sm:block" />
          Verified
        </span>
      )}

      <button
        type="button"
        onClick={() => onToggleSave(place.id)}
        aria-label={saved ? "Remove from saved places" : "Save place"}
        aria-pressed={saved}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white sm:right-2 sm:top-2 sm:h-8 sm:w-8"
      >
        {saved ? (
          <FaHeart size={11} className="text-red-500 sm:hidden" />
        ) : (
          <FiHeart size={11} className="sm:hidden" />
        )}
        {saved ? (
          <FaHeart size={14} className="hidden text-red-500 sm:block" />
        ) : (
          <FiHeart size={14} className="hidden sm:block" />
        )}
      </button>
    </div>

    <div className="flex flex-1 flex-col p-2.5 sm:p-4">
      <h3 className="line-clamp-1 text-xs font-bold leading-tight text-gray-900 sm:line-clamp-2 sm:min-h-[2.5rem] sm:truncate sm:text-base">
        {place.name}
      </h3>

      <p className="mt-1 hidden text-xs leading-snug text-gray-500 sm:line-clamp-2 sm:block sm:min-h-[2rem]">
        {place.meta}
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-600 sm:mt-2 sm:gap-1.5 sm:text-xs">
        <FiMapPin className="shrink-0" size={10} />
        <span className="truncate">{place.location}</span>
      </p>

      <p className="mt-1 flex items-center gap-1 text-[10px] sm:mt-2 sm:gap-1.5 sm:text-xs">
        <FaStar className="shrink-0 text-orange-500" size={10} />
        <span className="font-semibold text-gray-900">{place.rating}</span>
        <span className="text-gray-500">({place.reviews})</span>
      </p>

      <p className="mt-2 hidden items-center gap-1.5 text-[11px] font-semibold uppercase leading-snug text-gray-700 sm:flex">
        <FiClock className="shrink-0" size={12} />
        <span>
          <span className={place.open ? "text-green-600" : "text-red-500"}>
            {place.open ? "Open now" : "Closed"}
          </span>
          {" • "}
          {place.hours}
        </span>
      </p>

      <Link
        to={`/places/${place.id}`}
        className="mt-2.5 block w-full rounded-md border border-gray-200 py-1.5 text-center text-[11px] font-medium text-gray-900 transition-colors hover:bg-gray-50 sm:mt-4 sm:rounded-lg sm:py-2 sm:text-sm"
      >
        Details
      </Link>
    </div>
  </article>
);

// ──────────────────────────────────────────────────────────
// Debug panel (only visible in dev / when ?debug=1)
// ──────────────────────────────────────────────────────────
const DebugPanel = ({ info }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-4 rounded-xl border-2 border-dashed border-rose-300 bg-rose-50/50 p-3 text-xs font-mono">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-rose-700">
          🐛 Featured Debug Panel
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] text-rose-600 underline"
        >
          {open ? "hide" : "show"}
        </button>
      </div>
      {open && (
        <pre className="overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed text-gray-800 max-h-64">
          {JSON.stringify(info, null, 2)}
        </pre>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────
const Featured = () => {
  const trackRef = useRef(null);
  const [saved, setSaved] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fulfilledTimeStamp,
    startedTimeStamp,
    requestId,
    status,
  } = useGetFeaturedBusinessesQuery({ page: 1, limit: 8 });

  // ─── DEBUG: log every render's query state ──────────────
  useEffect(() => {
    logFeatured("Query State", {
      status,
      isLoading,
      isFetching,
      isError,
      error,
      apiData,
      requestId,
      startedTimeStamp,
      fulfilledTimeStamp,
      apiURL: import.meta.env.VITE_API_URL || "(not set — falling back to /api)",
    });
  }, [
    status,
    isLoading,
    isFetching,
    isError,
    error,
    apiData,
    requestId,
    startedTimeStamp,
    fulfilledTimeStamp,
  ]);

  // ─── DEBUG: log the actual URL being hit ────────────────
  useEffect(() => {
    const base =
      import.meta.env.VITE_API_URL || "(not set — falling back to /api)";
    const fullUrl = `${base}/v1/discovery/featured?page=1&limit=8`;
    // eslint-disable-next-line no-console
    console.log(
      "%c[Featured] Request URL",
      "background:#059669;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold",
      "\n  base:    ",
      base,
      "\n  full:    ",
      fullUrl,
      "\n  env:     ",
      import.meta.env.MODE,
      "\n  prod?:   ",
      import.meta.env.PROD
    );
  }, []);

  // ─── DEBUG: surface RTK error details in console ────────
  useEffect(() => {
    if (!isError || !error) return;
    // eslint-disable-next-line no-console
    console.group(
      "%c[Featured] ❌ FETCH ERROR",
      "background:#DC2626;color:#fff;padding:3px 8px;border-radius:3px;font-weight:bold"
    );
    // eslint-disable-next-line no-console
    console.log("error.status:", error.status);
    // eslint-disable-next-line no-console
    console.log("error.data:", error.data);
    // eslint-disable-next-line no-console
    console.log("error.message:", error.message);
    // eslint-disable-next-line no-console
    console.log("full error object:", error);
    // eslint-disable-next-line no-console
    console.log(
      "→ Check the Network tab for the request. Common causes:",
      "\n  • 404 → VITE_API_URL wrong (missing /api or wrong domain)",
      "\n  • (failed) / CORS → backend doesn't allow your Vercel origin",
      "\n  • 500 → backend error (check server logs)"
    );
    // eslint-disable-next-line no-console
    console.groupEnd();
  }, [isError, error]);

  // Extract businesses
  const apiPlaces = (() => {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(apiData.data?.businesses)) return apiData.data.businesses;
    if (Array.isArray(apiData.businesses)) return apiData.businesses;
    if (Array.isArray(apiData.data)) return apiData.data;
    if (Array.isArray(apiData.items)) return apiData.items;
    return [];
  })();

  const displayPlaces = apiPlaces.map(normalizePlace).filter(Boolean);
  const showEmptyState = !isLoading && (isError || displayPlaces.length === 0);
  const showSkeleton = isLoading;

  // Slider logic
  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth + GAP;
    const ratio = (el.scrollWidth + GAP) / step;
    setPageCount(Math.max(1, Math.ceil(ratio - 0.01)));
    setPage(Math.round(el.scrollLeft / step));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, displayPlaces.length]);

  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
    update();
  }, [displayPlaces.length, update]);

  const scrollToPage = (index) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * (el.clientWidth + GAP), behavior: "smooth" });
  };

  const slide = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth + GAP), behavior: "smooth" });
  };

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10";

  // Debug panel info — always log-friendly
  const debugInfo = {
    env: {
      VITE_API_URL: import.meta.env.VITE_API_URL || "(not set)",
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
    },
    query: {
      status,
      isLoading,
      isFetching,
      isError,
      requestId,
      hasData: !!apiData,
      rawShape:
        apiData && typeof apiData === "object"
          ? Object.keys(apiData)
          : typeof apiData,
      businessesExtracted: apiPlaces.length,
      placesAfterNormalize: displayPlaces.length,
    },
    error: error
      ? {
          status: error.status,
          message: error.message || "(no message)",
          data: error.data || "(no data)",
        }
      : null,
  };

  // Show debug panel when explicitly asked via ?debug=1
  const showDebugPanel =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Handpicked &amp; verified local spots in Port Harcourt &amp;
              surroundings
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              disabled={!canPrev || displayPlaces.length === 0}
              aria-label="Previous places"
              className={arrowClass}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              disabled={!canNext || displayPlaces.length === 0}
              aria-label="Next places"
              className={arrowClass}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Empty / Error state */}
        {showEmptyState && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
              <FiAlertCircle size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isError
                ? "Couldn't load featured spots"
                : "No featured spots yet"}
            </h3>
            <p className="mt-1 max-w-md text-xs text-gray-500 leading-relaxed">
              {isError
                ? "Check your connection or try again in a moment."
                : "Featured spots will appear here once they are published."}
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

            {/* Show debug info inline in the empty state for quick triage */}
            <div className="mt-6 w-full max-w-lg text-left">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quick diagnostics
              </p>
              <div className="rounded-lg bg-gray-900 text-[10px] text-gray-100 p-3 font-mono overflow-x-auto">
                <div>
                  <span className="text-emerald-400">VITE_API_URL: </span>
                  {import.meta.env.VITE_API_URL || "(not set)"}
                </div>
                <div>
                  <span className="text-emerald-400">status: </span>
                  {String(status)}
                </div>
                <div>
                  <span className="text-emerald-400">error.status: </span>
                  {String(error?.status || "—")}
                </div>
                <div>
                  <span className="text-emerald-400">error.message: </span>
                  {String(error?.message || "—")}
                </div>
                <div>
                  <span className="text-emerald-400">response keys: </span>
                  {apiData && typeof apiData === "object"
                    ? Object.keys(apiData).join(", ") || "(none)"
                    : String(typeof apiData)}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Open DevTools → Console for full logs. Add{" "}
                <code className="bg-gray-100 px-1 rounded">?debug=1</code> to
                the URL for a full panel.
              </p>
            </div>
          </div>
        )}

        {/* Skeleton */}
        {showSkeleton && (
          <div className="mt-6 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex w-[calc(50%-0.5rem)] flex-none lg:w-[calc(25%-0.75rem)]"
              >
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {/* Slider */}
        {!showEmptyState && !showSkeleton && (
          <>
            <div
              ref={trackRef}
              onScroll={update}
              className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {displayPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex w-[calc(50%-0.5rem)] flex-none snap-start lg:w-[calc(25%-0.75rem)]"
                >
                  <PlaceCard
                    place={place}
                    saved={saved.includes(place.id)}
                    onToggleSave={toggleSave}
                  />
                </div>
              ))}
            </div>

            {pageCount > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === page
                        ? "bg-red-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Debug panel — only when ?debug=1 */}
        {showDebugPanel && <DebugPanel info={debugInfo} />}
      </div>
    </section>
  );
};

export default Featured;