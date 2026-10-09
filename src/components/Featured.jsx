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
  FiImage,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import { useGetFeaturedBusinessesQuery } from "../features/discoveryApiSlice";

const GAP = 16;

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

// ──────────────────────────────────────────────────────────
// Image resolver — real images only, no stock fallback
// ──────────────────────────────────────────────────────────
const resolveBusinessImage = (biz) => {
  if (!biz) return null;

  // 1. Explicit cover image (Cloudinary URL)
  if (typeof biz.coverImage === "string" && biz.coverImage.trim().length > 0) {
    return biz.coverImage.trim();
  }

  // 2. First image in the images array
  if (Array.isArray(biz.images) && biz.images.length > 0) {
    const first = biz.images.find(
      (u) => typeof u === "string" && u.trim().length > 0,
    );
    if (first) return first.trim();
  }

  // 3. Nothing — return null so the card shows a branded placeholder
  return null;
};

// ──────────────────────────────────────────────────────────
// Normalizer
// ──────────────────────────────────────────────────────────
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
        .join(" "),
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

  return {
    id,
    name: p.businessName || "Unnamed business",
    meta,
    location: locationLine,
    rating: Number(p.rating || 0),
    reviews: Number(p.numReviews || 0),
    open,
    hours,
    img: resolveBusinessImage(p), // ← real URL or null, no stock photo
    verified: true,
  };
};

// ──────────────────────────────────────────────────────────
// Image placeholder (no photos, no stock, just initials)
// ──────────────────────────────────────────────────────────
const ImagePlaceholder = ({ name }) => {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
      <div className="flex flex-col items-center gap-1 text-white/90">
        <FiImage className="h-6 w-6 opacity-70" size={24} />
        <span className="text-2xl font-black tracking-tight">{initial}</span>
        <span className="text-[9px] font-medium uppercase tracking-widest opacity-80">
          No image yet
        </span>
      </div>
    </div>
  );
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
const PlaceCard = ({ place, saved, onToggleSave }) => {
  const [imgBroken, setImgBroken] = useState(false);
  const showReal = place.img && !imgBroken;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
      <div className="relative aspect-[3/2] w-full overflow-hidden sm:aspect-[4/3]">
        {showReal ? (
          <img
            src={place.img}
            alt={place.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgBroken(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder name={place.name} />
        )}

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
  } = useGetFeaturedBusinessesQuery({ page: 1, limit: 8 });

  const apiPlaces = (() => {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(apiData.data?.businesses)) return apiData.data.businesses;
    if (Array.isArray(apiData.businesses)) return apiData.businesses;
    if (Array.isArray(apiData.data)) return apiData.data;
    if (Array.isArray(apiData.items)) return apiData.items;
    return [];
  })();

  // Debug log to verify images are coming from the API
  useEffect(() => {
    if (!apiPlaces.length) return;
    // eslint-disable-next-line no-console
    console.groupCollapsed(
      `%c[Featured] Image check — ${apiPlaces.length} businesses`,
      "background:#059669;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold",
    );
    apiPlaces.forEach((b) => {
      // eslint-disable-next-line no-console
      console.log(
        `${b.businessName || "(unnamed)"}`,
        "\n  coverImage:",
        b.coverImage || "(none)",
        "\n  images:",
        Array.isArray(b.images) ? `${b.images.length} entries` : "(none)",
        "\n  first image:",
        Array.isArray(b.images) && b.images.length > 0 ? b.images[0] : "(none)",
      );
    });
    // eslint-disable-next-line no-console
    console.groupEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPlaces.length]);

  const displayPlaces = apiPlaces.map(normalizePlace).filter(Boolean);
  const showEmptyState = !isLoading && (isError || displayPlaces.length === 0);
  const showSkeleton = isLoading;

  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
                ? error?.data?.message ||
                  "Check your connection or try again in a moment."
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
      </div>
    </section>
  );
};

export default Featured;
