// src/pages/business/BusinessReviews.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Star,
  Pencil,
  Loader,
  AlertCircle,
  MessageSquare,
  Send,
  Trash2,
  X,
  RefreshCw,
  User as UserIcon,
  LogOut,
  CornerDownRight,
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

// ─── Helpers ───────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const Stars = ({ value = 0, size = "sm" }) => {
  const cls =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${
            i <= Math.round(value)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

const initials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// ─── Main ──────────────────────────────────────────────────
const BusinessReviews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [replyModal, setReplyModal] = useState(null); // { review, mode }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const {
    data: reviewsResp,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useListMyBusinessReviewsQuery({ limit: 50 });

  const { data: statsResp } = useGetMyBusinessReviewStatsQuery();

  const reviews = reviewsResp?.data || [];
  const stats = statsResp?.data || {};
  const isUnauthorized = error?.status === 401;

  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();
  const [updateReply, { isLoading: isUpdatingReply }] =
    useUpdateReviewReplyMutation();
  const [deleteReply, { isLoading: isDeletingReply }] =
    useDeleteReviewReplyMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating = isReplying || isUpdatingReply || isDeletingReply;

  const totalReviews = stats.totalReviews ?? reviews.length;

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
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

  const handleSaveReply = async (text) => {
    if (!replyModal) return;
    const { review, mode } = replyModal;
    try {
      if (mode === "edit") {
        const r = await updateReply({ id: review._id, text }).unwrap();
        showToast(r?.message || "Reply updated", "success");
      } else {
        const r = await replyToReview({ id: review._id, text }).unwrap();
        showToast(r?.message || "Reply posted", "success");
      }
      setReplyModal(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to save reply", "error");
    }
  };

  const handleDeleteReply = async () => {
    if (!deleteTarget) return;
    try {
      const r = await deleteReply(deleteTarget._id).unwrap();
      showToast(r?.message || "Reply deleted", "success");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to delete", "error");
    }
  };

  // ─── Guards ──────────────────────────────────────────────
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Session expired
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in again to continue.
          </p>
          <button
            onClick={() => navigate("/business/signin", { replace: true })}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-24 lg:pb-10">
        {/* ─── Header ─── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-3">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight truncate">
              Reviews
            </h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => navigate("/business/profile")}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
          {/* ─── Tabs ─── */}
          <nav className="mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 text-xs lg:text-sm font-medium rounded-full border bg-white text-gray-900 border-gray-900"
              >
                Reviews about you ({totalReviews})
              </button>
            </div>
          </nav>

          {/* ─── Loading ─── */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* ─── Error ─── */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-900">
                Failed to load reviews
              </p>
              <p className="text-xs text-red-700 mt-1">
                {error?.data?.message || "Something went wrong"}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Try again
              </button>
            </div>
          )}

          {/* ─── Empty ─── */}
          {!isLoading && !error && reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No reviews yet
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                When customers leave feedback, you'll see it here and can reply.
              </p>
            </div>
          )}

          {/* ─── Reviews list ─── */}
          {!isLoading && !error && reviews.length > 0 && (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onReply={() => setReplyModal({ review, mode: "create" })}
                  onEditReply={() => setReplyModal({ review, mode: "edit" })}
                  onDeleteReply={() => setDeleteTarget(review)}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Reply modal ─── */}
      {replyModal && (
        <ReplyModal
          review={replyModal.review}
          mode={replyModal.mode}
          onClose={() => !isMutating && setReplyModal(null)}
          onSave={handleSaveReply}
          isSaving={isReplying || isUpdatingReply}
        />
      )}

      {/* ─── Delete reply confirm ─── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !isDeletingReply && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Delete reply?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your reply will be removed. The customer's review stays
                  visible.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeletingReply}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReply}
                disabled={isDeletingReply}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {isDeletingReply ? (
                  <>
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete reply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <BusinessBottombar />
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Review card
// ──────────────────────────────────────────────────────────
const ReviewCard = ({ review, onReply, onEditReply, onDeleteReply, isMutating }) => {
  const reviewer = review.user || {};
  const name = reviewer.fullName || reviewer.businessName || "Customer";
  const hasReply = !!review.reply?.text;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#F5F1EC] flex items-center justify-center overflow-hidden flex-shrink-0">
          {reviewer.profilePhoto ? (
            <img
              src={reviewer.profilePhoto}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : initials(name) ? (
            <span className="text-[11px] font-bold text-gray-500">
              {initials(name)}
            </span>
          ) : (
            <UserIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + date + stars */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(review.createdAt)}
              </p>
            </div>
            <Stars value={review.rating || 0} size="sm" />
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-600 leading-relaxed mt-2 whitespace-pre-line">
              {review.comment}
            </p>
          )}

          {/* Review images (if any) */}
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

          {/* Nested reply block */}
          {hasReply && (
            <div className="mt-4 rounded-xl bg-[#F5F1EC] p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                <UserIcon className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900">Your business</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {formatDate(review.reply.repliedAt || review.updatedAt)}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mt-1.5 whitespace-pre-line">
                  {review.reply.text}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            {!hasReply ? (
              <button
                type="button"
                onClick={onReply}
                disabled={isMutating}
                className="inline-flex items-center gap-1 font-medium text-gray-500 hover:text-gray-900 transition disabled:opacity-50"
              >
                <CornerDownRight className="h-3.5 w-3.5" />
                Reply
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEditReply}
                  disabled={isMutating}
                  className="font-medium text-gray-500 hover:text-gray-900 transition disabled:opacity-50"
                >
                  Edit reply
                </button>
                <button
                  type="button"
                  onClick={onDeleteReply}
                  disabled={isMutating}
                  className="font-medium text-gray-500 hover:text-red-600 transition disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// ──────────────────────────────────────────────────────────
// Reply modal
// ──────────────────────────────────────────────────────────
const ReplyModal = ({ review, mode, onClose, onSave, isSaving }) => {
  const { showToast } = useToast();
  const isEdit = mode === "edit";
  const [text, setText] = useState(isEdit ? review?.reply?.text || "" : "");

  const reviewer = review?.user || {};
  const name = reviewer.fullName || reviewer.businessName || "Customer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("Reply cannot be empty", "error");
      return;
    }
    if (trimmed.length > 500) {
      showToast("Reply is too long (max 500 chars)", "error");
      return;
    }
    await onSave(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      onClick={() => !isSaving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? "Edit your reply" : "Reply to review"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0 disabled:opacity-60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Original review preview */}
          <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Stars value={review.rating || 0} size="sm" />
              <span className="text-[11px] text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.comment && (
              <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line">
                {review.comment}
              </p>
            )}
          </div>

          {/* Reply textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {text.length}/500
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !text.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Saving…
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

export default BusinessReviews;