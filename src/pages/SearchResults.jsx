// src/pages/SearchResults.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiChevronRight,
  FiSliders,
  FiChevronDown,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Searchbar from "../components/Searchbar";
import Filter, { CATEGORIES } from "../components/Filter";
import PlaceCard from "../components/PlaceCard";
import Pagination from "../components/Pagination";

import { useListPublicBusinessesQuery } from "../features/businessApiSlice";
import {
  useListSavedPlaceIdsQuery,
  useToggleSavedPlaceMutation,
} from "../features/savedPlaceApiSlice";

const ITEMS_PER_PAGE = 9;
const FETCH_LIMIT = 200; // we pull everything, then filter client-side

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";

// Filter category id → backend businessKind
const CATEGORY_TO_KIND = {
  hotels: "hotels",
  restaurant: "dining",
  restaurants: "dining",
  "local food": "dining",
  "local-food": "dining",
  "bars & lounges": "things_to_do",
  "bars-lounges": "things_to_do",
  "parks & recs": "things_to_do",
  "parks-recs": "things_to_do",
  parks: "things_to_do",
  entertainment: "things_to_do",
  cafes: "dining",
  cafe: "dining",
  shopping: "shops",
  shops: "shops",
  "beauty & wellness": "others",
  "beauty-wellness": "others",
  beauty: "others",
  services: "others",
  service: "others",
};

const resolveKind = (categoryId) => {
  if (!categoryId) return null;
  const key = categoryId.toLowerCase().trim();
  if (["hotels", "dining", "things_to_do", "shops", "others"].includes(key)) {
    return key;
  }
  return CATEGORY_TO_KIND[key] || null;
};

// Convert openingHours → open state
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

// Backend business → PlaceCard shape
const KIND_LABEL = {
  hotels: "Hotel",
  dining: "Restaurant",
  things_to_do: "Things to Do",
  shops: "Shop",
  others: "Business",
};

const normalizeBusiness = (biz) => {
  if (!biz) return null;
  const id = biz._id || biz.id;
  if (!id) return null;

  const { open, hours } = getOpenState(biz.openingHours);
  const loc = biz.location || {};
  const img =
    biz.coverImage ||
    (Array.isArray(biz.images) && biz.images.length > 0
      ? biz.images[0]
      : null) ||
    FALLBACK_IMG;

  const priceSymbol = biz.priceRange ? "₦".repeat(biz.priceRange) : "";

  const categoryLabel = biz.categorySlug
    ? biz.categorySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : KIND_LABEL[biz.businessKind] || "Local spot";

  const subCategory = KIND_LABEL[biz.businessKind] || "";

  return {
    id,
    // Card fields
    name: biz.businessName || "Unnamed business",
    category: categoryLabel,
    subCategory,
    priceLevel: priceSymbol,
    priceUSD: Number(biz.priceRange || 0) * 30, // rough proxy for slider
    verified: !!(biz.isVerified && biz.businessVerified),
    isFeatured: !!biz.isFeatured,
    description: biz.description || "",
    img,
    images: Array.isArray(biz.images) ? biz.images : [],
    logo: biz.logo || null,
    location: {
      address: loc.address || "",
      city: loc.city || "",
      state: loc.state || "",
      country: loc.country || "",
    },
    rating: {
      average: Number(biz.rating || 0),
      totalReviews: Number(biz.numReviews || 0),
    },
    openingHoursText: hours,
    open,
    hours,
    viewCount: Number(biz.viewCount || 0),
    businessKind: biz.businessKind || null,
    tags: Array.isArray(biz.tags) ? biz.tags : [],
    createdAt: biz.createdAt,
  };
};

// ─── Component ─────────────────────────────────────────────
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // URL-driven state
  const initialQuery = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "Port Harcourt";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ─── Fetch all businesses once ────────────────────────────
  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useListPublicBusinessesQuery({
    limit: FETCH_LIMIT,
    page: 1,
    sort: "popular",
  });

  const apiBusinesses = apiData?.data?.businesses || [];

  // ─── Saved places from backend ────────────────────────────
  const { data: savedIdsResp } = useListSavedPlaceIdsQuery(undefined, {
    skip: !userInfo,
  });
  const savedIds = savedIdsResp?.data || [];

  const [toggleSaved] = useToggleSavedPlaceMutation();

  const handleToggleFavorite = async (id) => {
    if (!userInfo) {
      navigate("/business/signin", {
        state: { redirectTo: "/search" },
      });
      return;
    }
    try {
      await toggleSaved(id).unwrap();
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  // ─── Sync URL params ──────────────────────────────────────
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const c = searchParams.get("city") || "Port Harcourt";
    const cat = searchParams.get("category") || "";
    setQuery(q);
    setCity(c);
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  // ─── Normalize all businesses ────────────────────────────
  const allPlaces = useMemo(
    () => apiBusinesses.map(normalizeBusiness).filter(Boolean),
    [apiBusinesses]
  );

  // ─── Category counts ─────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      const kind = resolveKind(cat.id);
      const matchCount = kind
        ? allPlaces.filter((p) => p.businessKind === kind).length
        : 0;
      counts[cat.id] = matchCount || cat.defaultCount || 0;
    });
    return counts;
  }, [allPlaces]);

  // ─── Handlers ────────────────────────────────────────────
  const handleSearchSubmit = ({ query: newQuery, city: newCity }) => {
    setQuery(newQuery);
    setCity(newCity);
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    if (newQuery) newParams.set("q", newQuery);
    if (newCity) newParams.set("city", newCity);
    if (selectedCategory) newParams.set("category", selectedCategory);
    setSearchParams(newParams);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat) newParams.set("category", cat);
    else newParams.delete("category");
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setPriceRange([0, 150]);
    setSelectedDate("");
    setRatingFilter(null);
    setCurrentPage(1);
    setSearchParams({});
  };

  // ─── Filtering + sorting ─────────────────────────────────
  const filteredPlaces = useMemo(() => {
    const result = allPlaces.filter((p) => {
      // Query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const subMatch = p.subCategory.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const addrMatch = p.location.address.toLowerCase().includes(q);
        const cityMatch = p.location.city.toLowerCase().includes(q);
        const tagsMatch = p.tags.some((t) => t.toLowerCase().includes(q));
        if (
          !nameMatch &&
          !catMatch &&
          !subMatch &&
          !descMatch &&
          !addrMatch &&
          !cityMatch &&
          !tagsMatch
        ) {
          return false;
        }
      }

      // City
      if (city && city !== "All Cities" && p.location.city) {
        if (!p.location.city.toLowerCase().includes(city.toLowerCase())) {
          if (!query.trim()) return false;
        }
      }

      // Category → businessKind
      if (selectedCategory) {
        const kind = resolveKind(selectedCategory);
        if (kind && p.businessKind !== kind) return false;
      }

      // Price (rough proxy — 30 * priceRange)
      if (
        p.priceUSD < priceRange[0] ||
        p.priceUSD > priceRange[1]
      ) {
        // Only apply if the range is not the default
        if (priceRange[0] > 0 || priceRange[1] < 150) {
          return false;
        }
      }

      // Rating
      if (ratingFilter !== null) {
        const avg = p.rating.average || 0;
        if (ratingFilter === 5 && avg < 4.8) return false;
        if (ratingFilter === 4 && (avg < 4.0 || avg >= 4.8)) return false;
        if (ratingFilter === 3 && (avg < 3.0 || avg >= 4.0)) return false;
        if (ratingFilter === 2 && avg >= 3.0) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating.average - a.rating.average;
      }
      if (sortBy === "price_asc") {
        return a.priceUSD - b.priceUSD;
      }
      if (sortBy === "price_desc") {
        return b.priceUSD - a.priceUSD;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // popular: verified first, then review count
      const scoreA = (a.verified ? 1000 : 0) + a.rating.totalReviews;
      const scoreB = (b.verified ? 1000 : 0) + b.rating.totalReviews;
      return scoreB - scoreA;
    });

    return result;
  }, [
    allPlaces,
    query,
    city,
    selectedCategory,
    priceRange,
    ratingFilter,
    sortBy,
  ]);

  // ─── Pagination ──────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE)
  );

  const paginatedPlaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlaces, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const sortLabels = {
    popular: "Most Popular",
    rating: "Top Rated",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    name: "Name A-Z",
  };

  const displayTerm = query
    ? `'${query}'`
    : selectedCategory
    ? `'${selectedCategory}'`
    : "Places";
  const displayCity = city ? `in ${city}` : "in Port Harcourt";

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-4"
        >
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Explore
          </Link>
          <FiChevronRight size={13} className="text-gray-400" />
          <span className="font-semibold text-gray-900">Search results</span>
        </nav>

        {/* Top Searchbar */}
        <div className="mb-8">
          <Searchbar
            query={query}
            city={city}
            onSearch={handleSearchSubmit}
            className="w-full"
          />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              SHOWING RESULTS FOR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
              {displayTerm} {displayCity}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isLoading
                ? "Loading places…"
                : `${filteredPlaces.length} ${
                    filteredPlaces.length === 1 ? "place" : "places"
                  } match ${query ? `"${query}"` : "current filters"}`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
            >
              <FiSliders size={14} />
              <span>Filter</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
              >
                <span className="text-gray-500 font-normal">Sort:</span>
                <span>{sortLabels[sortBy]}</span>
                <FiChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-gray-100 bg-white shadow-xl py-1">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSortBy(key);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                          sortBy === key
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs sticky top-20">
            <Filter
              categoryCounts={categoryCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              selectedCity={city}
              onSelectCity={(newCity) => {
                setCity(newCity);
                setCurrentPage(1);
              }}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto h-full w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <Filter
                  categoryCounts={categoryCounts}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    handleSelectCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  selectedCity={city}
                  onSelectCity={setCity}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 w-full min-w-0">
            {/* Loading skeletons */}
            {isLoading && (
              <div className="columns-2 gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="mb-4 sm:mb-0 break-inside-avoid bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3.5 w-3/4 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                      <div className="h-8 w-full bg-gray-100 rounded animate-pulse mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && isError && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-2xl border border-red-200 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                  <FiAlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Couldn't load places
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
                  {error?.data?.message ||
                    "Check your connection or try again in a moment."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs disabled:opacity-60"
                >
                  <FiRefreshCw
                    size={14}
                    className={isFetching ? "animate-spin" : ""}
                  />
                  Try again
                </button>
              </div>
            )}

            {/* Results */}
            {!isLoading && !isError && paginatedPlaces.length > 0 && (
              <>
                <div className="columns-2 gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                  {paginatedPlaces.map((place) => (
                    <div key={place.id} className="mb-4 sm:mb-0 break-inside-avoid">
                      <PlaceCard
                        place={place}
                        isSaved={savedIds.includes(place.id)}
                        onToggleSave={handleToggleFavorite}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-12 mb-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}

            {/* Empty state */}
            {!isLoading && !isError && paginatedPlaces.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <FiSearch size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No places found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
                  We couldn't find any places matching your current search or
                  filter criteria. Try adjusting your filters or resetting them.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;