// src/pages/business/BusinessReviews.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Star,
  MessageSquare,
  Search,
  Reply,
  Trash2,
  Edit3,
  Send,
  X,
  Loader2,
  ArrowLeft,
  LogOut,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

import {
  useListMyBusinessReviewsQuery,
  useGetMyBusinessReviewStatsQuery,
  useReplyToReviewMutation,
  useUpdateReviewReplyMutation,
  useDeleteReviewReplyMutation,
} from "../../features/reviewApiSlice";
import { useLogoutBusinessAccountMutation } from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import BusinessSidebar from "../../components/BusinessSidebar";
import BusinessBottombar from "../../components/BusinessBottombar";

// ─── Constants ─────────────────────────────────────────────
const ACCENT = "#3B82F6";

const RATING_FILTERS = [
  { value: "all", label: "All" },
  { value: "5", label: "5★" },
  { value: "4", label: "4★" },
  { value: "3", label: "3★" },
  { value: "2", label: "2★" },
  { value: "1", label: "1★" },
];

const REPLY_FILTERS = [
  { value: "all", label: "All replies" },
  { value: "unreplied", label: "Unreplied" },
  { value: "replied", label: "Replied" },
];

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Helpers ───────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "";
  try {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// ─── Star display ──────────────────────────────────────────
const Stars = ({ value = 0, size = "sm" }) => {
  const sizeClass =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= Math.round(value)
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

// ─── Mini KPI tile ─────────────────────────────────────────
const MiniKpi = ({ label, value, icon: Icon, tone = "default" }) => {
  const toneClass = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    blue: "bg-blue-50 text-[#3B82F6] dark:bg-blue-900/20 dark:text-blue-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  }[tone];

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className={`p-1.5 rounded-lg flex-shrink-0 ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
          {label}
        </p>
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
};

// ─── Component ─────────────────────────────────────────────
const BusinessReviews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyFilter, setReplyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [replyModal, setReplyModal] = useState(null);
  const [deleteReplyTarget, setDeleteReplyTarget] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // ─── Queries ──────────────────────────────────────────────
  const queryParams = useMemo(() => {
    const p = { limit: 50 };
    if (ratingFilter !== "all") p.rating = ratingFilter;
    if (replyFilter === "unreplied") p.replied = "false";
    if (replyFilter === "replied") p.replied = "true";
    if (searchQuery.trim()) p.q = searchQuery.trim();
    return p;
  }, [ratingFilter, replyFilter, searchQuery]);

  const {
    data: reviewsResp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useListMyBusinessReviewsQuery(queryParams);

  const { data: statsResp, isLoading: statsLoading } =
    useGetMyBusinessReviewStatsQuery();

  const reviews = reviewsResp?.data || [];
  const stats = statsResp?.data || {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    repliedCount: 0,
    unrepliedCount: 0,
    responseRate: 0,
  };

  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();
  const [updateReply, { isLoading: isUpdatingReply }] =
    useUpdateReviewReplyMutation();
  const [deleteReply, { isLoading: isDeletingReply }] =
    useDeleteReviewReplyMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating = isReplying || isUpdatingReply || isDeletingReply;
  const isUnauthorized = error?.status === 401;

  // ─── Logout ───────────────────────────────────────────────
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutBusinessAccount()
        .unwrap()
        .catch(() => {});
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

  // ─── Reply handlers ───────────────────────────────────────
  const handleSaveReply = async (text) => {
    if (!replyModal) return;
    const { review, mode } = replyModal;

    try {
      if (mode === "edit") {
        const result = await updateReply({ id: review._id, text }).unwrap();
        showToast(result?.message || "Reply updated", "success");
      } else {
        const result = await replyToReview({ id: review._id, text }).unwrap();
        showToast(result?.message || "Reply posted", "success");
      }
      setReplyModal(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to save reply", "error");
      throw err;
    }
  };

  const handleDeleteReply = async () => {
    if (!deleteReplyTarget) return;
    try {
      const result = await deleteReply(deleteReplyTarget._id).unwrap();
      showToast(result?.message || "Reply deleted", "success");
      setDeleteReplyTarget(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to delete reply", "error");
    }
  };

  // ─── Derived ──────────────────────────────────────────────
  const distributionTotal = useMemo(() => {
    return Object.values(stats.distribution || {}).reduce((a, b) => a + b, 0);
  }, [stats]);

  // ─── Unauthorized ─────────────────────────────────────────
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Session expired
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please log in again to continue.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/business/signin", { replace: true })}
              className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition"
            >
              Go to sign in
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Clear session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-20 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-3 lg:py-4 lg:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => navigate("/business")}
              aria-label="Back to dashboard"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
              Reviews
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh"
              className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 px-3 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <>
                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                  <span className="hidden sm:inline">Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Log out</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="px-3 sm:px-4 lg:px-8 py-4 lg:py-6 max-w-6xl mx-auto">
          {/* Page header row */}
          <div className="mb-5">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              See what customers are saying and reply to build trust.
            </p>
          </div>

          {/* Stats + distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            {/* Average rating hero */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              {statsLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Average Rating
                  </p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {Number(stats.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 pb-1">
                      / 5
                    </span>
                  </div>
                  <div className="mt-2">
                    <Stars value={stats.averageRating || 0} size="md" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Based on {stats.totalReviews || 0} review
                    {stats.totalReviews === 1 ? "" : "s"}
                  </p>
                </>
              )}
            </div>

            {/* Distribution bars */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm lg:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Rating Distribution
              </p>
              {statsLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((r) => {
                    const count = stats.distribution?.[r] || 0;
                    const pct =
                      distributionTotal > 0
                        ? (count / distributionTotal) * 100
                        : 0;
                    return (
                      <div key={r} className="flex items-center gap-3 min-w-0">
                        <span className="w-6 text-xs font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                          {r}★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden min-w-0">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-xs text-gray-500 dark:text-gray-400 text-right flex-shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Secondary KPIs */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <MiniKpi
                  label="Total"
                  value={stats.totalReviews || 0}
                  icon={MessageSquare}
                  tone="default"
                />
                <MiniKpi
                  label="Replied"
                  value={stats.repliedCount || 0}
                  icon={CheckCircle2}
                  tone="green"
                />
                <MiniKpi
                  label="Unreplied"
                  value={stats.unrepliedCount || 0}
                  icon={AlertTriangle}
                  tone={stats.unrepliedCount > 0 ? "orange" : "default"}
                />
              </div>

              {/* Response rate row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Response rate
                </span>
                <span className="text-sm font-bold text-[#3B82F6] dark:text-blue-400">
                  {stats.responseRate || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Filters + search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 sm:p-4 mb-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name or review content"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Rating chips */}
              <div className="flex items-center gap-2 min-w-0">
                <Star className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {RATING_FILTERS.map((f) => {
                    const active = ratingFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setRatingFilter(f.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                          active
                            ? "bg-[#3B82F6] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reply chips */}
              <div className="flex items-center gap-2 sm:ml-auto min-w-0">
                <MessageCircle className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {REPLY_FILTERS.map((f) => {
                    const active = replyFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setReplyFilter(f.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                          active
                            ? "bg-[#3B82F6] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {searchQuery || ratingFilter !== "all" || replyFilter !== "all"
                  ? "No reviews match your filters"
                  : "No reviews yet"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery || ratingFilter !== "all" || replyFilter !== "all"
                  ? "Try adjusting the filters above."
                  : "When customers leave feedback, you'll see it here and can reply."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onReply={() => setReplyModal({ review, mode: "create" })}
                  onEditReply={() => setReplyModal({ review, mode: "edit" })}
                  onDeleteReply={() => setDeleteReplyTarget(review)}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}

          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} LocalSpot Systems Ltd. — Business
              Account Center
            </p>
          </footer>
        </div>
      </div>

      {/* Reply modal */}
      {replyModal && (
        <ReplyModal
          review={replyModal.review}
          mode={replyModal.mode}
          onClose={() => !isMutating && setReplyModal(null)}
          onSave={handleSaveReply}
          isSaving={isReplying || isUpdatingReply}
        />
      )}

      {/* Delete reply confirm */}
      {deleteReplyTarget && (
        <ConfirmModal
          title="Delete reply?"
          body="Your reply will be removed from this review. The customer's review will remain visible."
          confirmLabel="Delete reply"
          confirmTone="danger"
          Icon={Trash2}
          onCancel={() => setDeleteReplyTarget(null)}
          onConfirm={handleDeleteReply}
          isLoading={isDeletingReply}
        />
      )}

      <BusinessBottombar />
    </div>
  );
};

// ─── Review card ───────────────────────────────────────────
const ReviewCard = ({
  review,
  onReply,
  onEditReply,
  onDeleteReply,
  isMutating,
}) => {
  const reviewer = review.user || {};
  const reviewerName =
    reviewer.fullName || reviewer.businessName || "Anonymous";
  const reviewerPhoto = reviewer.profilePhoto || null;
  const hasReply = !!review.reply?.text;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {reviewerPhoto ? (
            <img
              src={reviewerPhoto}
              alt={reviewerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-[#3B82F6]">
              {initials(reviewerName)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3
              className="text-sm font-semibold text-gray-900 dark:text-white truncate"
              title={reviewerName}
            >
              {reviewerName}
            </h3>
            <Stars value={review.rating || 0} size="sm" />
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-line break-words">
              {review.comment}
            </p>
          )}

          {/* Review images */}
          {Array.isArray(review.images) && review.images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {review.images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-200 dark:border-gray-700 hover:opacity-90 transition"
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

          {/* Business reply block */}
          {hasReply && (
            <div className="mt-3 ml-1 pl-3 border-l-2 border-[#3B82F6] bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg py-2 pr-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Reply className="h-3 w-3 text-[#3B82F6]" />
                <span className="text-[11px] font-semibold text-[#3B82F6] dark:text-blue-400">
                  Your reply
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  · {formatDate(review.reply.repliedAt || review.updatedAt)}
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                {review.reply.text}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {!hasReply ? (
              <button
                type="button"
                onClick={onReply}
                disabled={isMutating}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEditReply}
                  disabled={isMutating}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit reply
                </button>
                <button
                  type="button"
                  onClick={onDeleteReply}
                  disabled={isMutating}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Reply modal ───────────────────────────────────────────
const ReplyModal = ({ review, mode, onClose, onSave, isSaving }) => {
  const { showToast } = useToast();
  const isEdit = mode === "edit";

  const [text, setText] = useState(isEdit ? review?.reply?.text || "" : "");
  const reviewer = review?.user || {};
  const reviewerName =
    reviewer.fullName || reviewer.businessName || "Anonymous";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("Reply cannot be empty", "error");
      return;
    }
    if (trimmed.length > 500) {
      showToast("Reply is too long (max 500 characters)", "error");
      return;
    }
    try {
      await onSave(trimmed);
    } catch (_) {
      // parent already toasted
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-xl mx-0 sm:mx-4 mb-0 sm:mb-4 shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {isEdit ? "Edit your reply" : "Reply to review"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {reviewerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
          {/* Original review preview */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Stars value={review.rating || 0} size="sm" />
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.comment && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 whitespace-pre-line break-words">
                {review.comment}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your reply <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Thank the customer or address their concern professionally..."
              maxLength={500}
              disabled={isSaving}
              autoFocus
              className={inputClass}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {text.length}/500
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !text.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                {isEdit ? "Save changes" : "Post reply"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Confirm modal ─────────────────────────────────────────
const ConfirmModal = ({
  title,
  body,
  confirmLabel,
  confirmTone = "primary",
  Icon = Send,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const toneClass = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-orange-500 hover:bg-orange-600",
    primary: "bg-[#3B82F6] hover:bg-blue-700",
  }[confirmTone];

  const iconBg = {
    danger: "bg-red-50 dark:bg-red-900/20 text-red-500",
    warning: "bg-orange-50 dark:bg-orange-900/20 text-orange-500",
    primary: "bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6]",
  }[confirmTone];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed break-words">
              {body}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed ${toneClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Working...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessReviews;
