// src/pages/PlacesDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ChevronLeft,
  Heart,
  MapPin,
  Share2,
  Phone,
  Globe,
  Tag,
  X,
  Check,
  Clock,
  Mail,
  AlertCircle,
} from "lucide-react";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import { useGetPublicBusinessByIdQuery } from "../features/businessApiSlice";
import {
  useListBusinessReviewsPublicQuery,
  useGetBusinessReviewStatsPublicQuery,
  useCreateReviewMutation,
} from "../features/reviewApiSlice";

// ─── Helpers ───────────────────────────────────────────────
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200";

const BUSINESS_KIND_LABELS = {
  hotels: "Hotel",
  dining: "Restaurant",
  things_to_do: "Things to Do",
  shops: "Shop",
  others: "Business",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatPriceRange = (n) =>
  [1, 2, 3, 4].includes(Number(n)) ? "$".repeat(Number(n)) : "$$";

const formatRating = (n) => {
  const v = Number(n || 0);
  return Number.isFinite(v) ? v.toFixed(1) : "0.0";
};

const formatRelativeDate = (d) => {
  if (!d) return "";
  try {
    const date = new Date(d);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const toMinutes = (s) => {
  if (!s || typeof s !== "string") return null;
  const [h, m] = s.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const getOpenState = (openingHours) => {
  if (!Array.isArray(openingHours) || openingHours.length === 0) {
    return { open: null, hours: "See details" };
  }
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = openingHours.find((h) => h.day === day);

  if (!today) return { open: null, hours: "See details" };
  if (today.closed) return { open: false, hours: "Closed today" };

  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  if (open === null || close === null)
    return { open: null, hours: "See details" };

  let isOpen;
  if (close < open) isOpen = minutes >= open || minutes <= close;
  else isOpen = minutes >= open && minutes <= close;

  return {
    open: isOpen,
    hours: `${today.open} - ${today.close}`,
  };
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// ─── Modal ─────────────────────────────────────────────────
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────
const PlacesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [allReviews, setAllReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // ─── Queries ─────────────────────────────────────────────
  const {
    data: businessResp,
    isLoading,
    error,
    refetch,
  } = useGetPublicBusinessByIdQuery(id, { skip: !id });

  const {
    data: reviewsResp,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
  } = useListBusinessReviewsPublicQuery(
    { businessId: id, page: reviewPage, limit: 5 },
    { skip: !id }
  );

  const { data: statsResp } = useGetBusinessReviewStatsPublicQuery(id, {
    skip: !id,
  });

  const [createReview, { isLoading: isCreatingReview }] =
    useCreateReviewMutation();

  // Accumulate reviews as pages load
  useEffect(() => {
    const pageData = reviewsResp?.data || [];
    if (reviewPage === 1) {
      setAllReviews(pageData);
    } else if (pageData.length) {
      setAllReviews((prev) => {
        const seen = new Set(prev.map((r) => r._id));
        const fresh = pageData.filter((r) => !seen.has(r._id));
        return [...prev, ...fresh];
      });
    }
  }, [reviewsResp, reviewPage]);

  const business = businessResp?.data;
  const pagination = reviewsResp?.pagination || {};
  const stats = statsResp?.data || {};
  const hasMoreReviews =
    pagination.page && pagination.pages
      ? pagination.page < pagination.pages
      : false;

  // ─── Derived ─────────────────────────────────────────────
  const derived = useMemo(() => {
    if (!business) return null;
    const { open, hours } = getOpenState(business.openingHours);
    const images =
      Array.isArray(business.images) && business.images.length > 0
        ? business.images
        : [business.coverImage || FALLBACK_IMG];

    return {
      open,
      hours,
      images,
      cover: business.coverImage || images[0] || FALLBACK_IMG,
      logo: business.logo || null,
      kindLabel: BUSINESS_KIND_LABELS[business.businessKind] || "Business",
      cityState:
        [business.location?.city, business.location?.state]
          .filter(Boolean)
          .join(", ") || "",
    };
  }, [business]);

  // ─── Handlers ────────────────────────────────────────────
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.businessName,
          text: `Check out ${business?.businessName}!`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const handleOpenReviewModal = () => {
    if (!userInfo) {
      navigate("/business/signin", {
        state: { redirectTo: `/places/${id}` },
      });
      return;
    }
    setActiveModal("review");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!id || !newReview.comment.trim()) return;

    try {
      await createReview({
        businessId: id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      }).unwrap();
      setReviewSubmitted(true);
      setNewReview({ rating: 5, comment: "" });
      setTimeout(() => {
        setActiveModal(null);
        setReviewSubmitted(false);
        setReviewPage(1);
      }, 1500);
    } catch (err) {
      alert(err?.data?.message || "Failed to submit review");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-orange-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-orange-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-orange-500" />);
      }
    }
    return stars;
  };

  // ─── Guards ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="h-6 w-32 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="h-10 w-72 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="h-5 w-56 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] sm:h-[450px] mb-8">
            <div className="md:col-span-2 bg-gray-100 rounded-xl animate-pulse" />
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {error?.status === 404
                ? "Business not found"
                : "Couldn't load business"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {error?.data?.message ||
                "The business may have been removed or is not yet approved."}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Try again
              </button>
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition"
              >
                Back home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    business.location?.address ||
      `${business.location?.city || ""} ${
        business.location?.state || ""
      }`.trim()
  )}`;

  const displayRating = business.rating || 0;
  const displayReviews = business.numReviews || stats.totalReviews || 0;

  const activeImages = derived.images;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft size={18} />
          Back to results
        </Link>

        {/* ─── Header ─── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {derived.logo && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm flex-shrink-0">
                <img
                  src={derived.logo}
                  alt={business.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {business.businessName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1 font-semibold text-gray-900">
                  <FaStar className="text-orange-500" size={14} />
                  {formatRating(displayRating)}
                </span>
                <span className="text-gray-400">•</span>
                <span>{displayReviews} reviews</span>
                <span className="text-gray-400">•</span>
                <span>{formatPriceRange(business.priceRange)}</span>
                <span className="text-gray-400">•</span>
                <span>{derived.kindLabel}</span>
                {derived.open !== null && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`font-medium ${
                        derived.open ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {derived.open ? "Open now" : "Closed"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Share2 size={14} />
              )}
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {saved ? (
                <FaHeart size={14} className="text-red-500" />
              ) : (
                <Heart size={14} />
              )}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleOpenReviewModal}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* ─── Gallery ─── */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] sm:h-[450px]">
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group">
            <img
              src={activeImages[0]}
              alt={business.businessName}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {activeImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`${business.businessName} ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {idx === 3 && activeImages.length > 5 && (
                  <button
                    onClick={() => setActiveModal("photos")}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                  >
                    <span className="text-white text-sm font-medium">
                      +{activeImages.length - 5} Photos
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Content + Sidebar ─── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Left Column ─── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall info */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Overall info
              </h2>
              {business.description ? (
                <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                  {business.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic mb-6">
                  No description provided.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {business.location?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="text-gray-400 mt-0.5 shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Address
                      </p>
                      <p className="text-sm text-gray-900">
                        {business.location.address}
                        {derived.cityState ? `, ${derived.cityState}` : ""}
                      </p>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <div className="flex items-start gap-3">
                    <Phone
                      className="text-gray-400 mt-0.5 shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Phone
                      </p>
                      <a
                        href={`tel:${business.phone}`}
                        className="text-sm text-gray-900 hover:text-teal-700"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-start gap-3">
                    <Mail
                      className="text-gray-400 mt-0.5 shrink-0"
                      size={18}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">
                        Email
                      </p>
                      <a
                        href={`mailto:${business.email}`}
                        className="text-sm text-gray-900 hover:text-teal-700 break-all"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-start gap-3">
                    <Globe
                      className="text-gray-400 mt-0.5 shrink-0"
                      size={18}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">
                        Website
                      </p>
                      <a
                        href={
                          business.website.startsWith("http")
                            ? business.website
                            : `https://${business.website}`
                        }
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-teal-700 hover:underline break-all"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}

                {Array.isArray(business.tags) && business.tags.length > 0 && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <Tag
                      className="text-gray-400 mt-0.5 shrink-0"
                      size={18}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {business.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Reviews</h2>

              {/* Rating summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatRating(stats.averageRating || business.rating)}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(stats.averageRating || business.rating || 0)}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {stats.totalReviews || displayReviews} reviews
                  </span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.distribution?.[star] || 0;
                    const total = stats.totalReviews || 0;
                    const pct =
                      total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-3 text-gray-600">{star}</span>
                        <FaStar className="text-orange-500" size={10} />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-gray-500">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleOpenReviewModal}
                  className="px-4 py-2 text-sm font-medium text-teal-700 border border-teal-700 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
                >
                  Write a review
                </button>
              </div>

              {/* Reviews list */}
              {reviewsLoading && reviewPage === 1 ? (
                <div className="mt-6 space-y-5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allReviews.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {allReviews.map((review) => (
                    <ReviewItem
                      key={review._id}
                      review={review}
                      renderStars={renderStars}
                    />
                  ))}
                </div>
              )}

              {hasMoreReviews && (
                <button
                  onClick={() => setReviewPage((p) => p + 1)}
                  disabled={reviewsFetching}
                  className="mt-6 w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-60"
                >
                  {reviewsFetching ? "Loading…" : "Load more reviews"}
                </button>
              )}
            </section>
          </div>

          {/* ─── Right Column ─── */}
          <div className="space-y-6">
            {/* Map */}
            {(business.location?.address || business.location?.city) && (
              <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative h-48 bg-gray-200">
                  <iframe
                    title="Business Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      business.location?.address || derived.cityState
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-900 font-medium mb-3">
                    {business.location?.address || derived.cityState}
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin size={16} />
                    Get Directions
                  </a>
                </div>
              </section>
            )}

            {/* Hours */}
            {Array.isArray(business.openingHours) &&
              business.openingHours.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="text-gray-400" size={18} />
                    Opening hours
                  </h2>
                  <div className="space-y-2">
                    {business.openingHours.map((h) => {
                      const isToday = new Date().getDay() === h.day;
                      return (
                        <div
                          key={h.day}
                          className={`flex items-center justify-between text-sm py-1 ${
                            isToday
                              ? "font-semibold text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          <span>{DAY_NAMES[h.day]}</span>
                          {h.closed ? (
                            <span className="text-red-500">Closed</span>
                          ) : (
                            <span className="tabular-nums">
                              {h.open} — {h.close}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            {/* Quick stats */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                At a glance
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {business.categorySlug || derived.kindLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price range</span>
                  <span className="font-medium text-gray-900">
                    {formatPriceRange(business.priceRange)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Views</span>
                  <span className="font-medium text-gray-900 tabular-nums">
                    {Number(business.viewCount || 0).toLocaleString()}
                  </span>
                </div>
                {business.isFeatured && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Featured</span>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ─── Modals ─── */}

      {/* Photos */}
      <Modal
        isOpen={activeModal === "photos"}
        onClose={() => setActiveModal(null)}
        title="All Photos"
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {activeImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Gallery ${idx}`}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </Modal>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Write review */}
      <Modal
        isOpen={activeModal === "review"}
        onClose={() => setActiveModal(null)}
        title="Write a Review"
        maxWidth="max-w-lg"
      >
        {reviewSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Thank you!</h4>
            <p className="text-sm text-gray-500 mt-1">
              Your review has been submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setNewReview({ ...newReview, rating: star })
                    }
                    className="focus:outline-none"
                  >
                    <FaStar
                      size={24}
                      className={
                        star <= newReview.rating
                          ? "text-orange-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                required
                rows={5}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                placeholder="Tell us about your experience..."
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {newReview.comment.length}/1000
              </p>
            </div>
            <button
              type="submit"
              disabled={isCreatingReview || !newReview.comment.trim()}
              className="w-full py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreatingReview ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

// ─── Review item ───────────────────────────────────────────
const ReviewItem = ({ review, renderStars }) => {
  const reviewer = review.user || {};
  const name = reviewer.fullName || reviewer.businessName || "Customer";
  const avatar = reviewer.profilePhoto || null;

  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[11px] font-bold text-gray-500">
            {getInitials(name)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-gray-900 truncate">{name}</h4>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatRelativeDate(review.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {renderStars(review.rating || 0)}
        </div>
        {review.comment && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>
        )}
        {Array.isArray(review.images) && review.images.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {review.images.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100"
              >
                <img
                  src={url}
                  alt={`Review ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesDetails;