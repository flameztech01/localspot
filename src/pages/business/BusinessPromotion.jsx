// src/pages/business/BusinessPromotion.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  Megaphone,
  Plus,
  Search,
  Edit3,
  Trash2,
  Send,
  X,
  Loader2,
  Save,
  Upload,
  Image as ImageIcon,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MousePointerClick,
  ArrowLeft,
  LogOut,
  Store,
  RefreshCw,
} from "lucide-react";

import {
  useListMyPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useSubmitPromotionForReviewMutation,
} from "../../features/promotionApiSlice";
import {
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import BusinessSidebar from "../../components/BusinessSidebar";
import BusinessBottombar from "../../components/BusinessBottombar";

// ─── Constants ─────────────────────────────────────────────
const ACCENT = "#3B82F6";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "disabled", label: "Disabled" },
];

const DISCOUNT_TYPES = [
  { value: "percent", label: "Percentage (%)", icon: Percent },
  { value: "fixed", label: "Fixed amount", icon: DollarSign },
  { value: "other", label: "Other", icon: Tag },
];

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Status pill ───────────────────────────────────────────
const statusStyle = (status) => {
  switch (status) {
    case "approved":
      return {
        color:
          "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
        Icon: CheckCircle2,
      };
    case "pending":
      return {
        color:
          "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
        Icon: Clock,
      };
    case "rejected":
      return {
        color:
          "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        Icon: XCircle,
      };
    case "disabled":
      return {
        color:
          "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
        Icon: AlertCircle,
      };
    case "draft":
    default:
      return {
        color:
          "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
        Icon: Edit3,
      };
  }
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const toInputDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const emptyForm = {
  title: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  promoCode: "",
  startDate: "",
  endDate: "",
};

// ─── Component ─────────────────────────────────────────────
const BusinessPromotion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);

  const [loggingOut, setLoggingOut] = useState(false);

  // ─── Queries ──────────────────────────────────────────────
  const {
    data: promotionsResp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useListMyPromotionsQuery({ limit: 50 });

  const promotions = promotionsResp?.data || [];

  const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
  const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();
  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();
  const [submitForReview, { isLoading: isSubmitting }] =
    useSubmitPromotionForReviewMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating = isCreating || isUpdating || isDeleting || isSubmitting;

  const isUnauthorized = error?.status === 401;

  // ─── Logout ───────────────────────────────────────────────
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

  // ─── Derived ──────────────────────────────────────────────
  const counts = useMemo(() => {
    const c = {
      all: promotions.length,
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      disabled: 0,
    };
    promotions.forEach((p) => {
      if (c[p.status] !== undefined) c[p.status] += 1;
    });
    return c;
  }, [promotions]);

  const filtered = useMemo(() => {
    let list = promotions;
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.promoCode?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [promotions, statusFilter, searchQuery]);

  // ─── Modal handlers ───────────────────────────────────────
  const openCreateModal = () => {
    setEditingPromotion(null);
    setShowModal(true);
  };

  const openEditModal = (promotion) => {
    if (!["draft", "rejected"].includes(promotion.status)) {
      showToast("Only draft or rejected promotions can be edited", "error");
      return;
    }
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const closeModal = () => {
    if (isMutating) return;
    setShowModal(false);
    setEditingPromotion(null);
  };

  // ─── Delete / Submit ──────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePromotion(deleteTarget._id).unwrap();
      showToast("Promotion deleted", "success");
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        err?.data?.message || "Failed to delete promotion",
        "error"
      );
    }
  };

  const handleSubmitForReview = async () => {
    if (!submitTarget) return;
    try {
      const result = await submitForReview(submitTarget._id).unwrap();
      showToast(result?.message || "Submitted for review", "success");
      setSubmitTarget(null);
    } catch (err) {
      showToast(
        err?.data?.message || "Failed to submit for review",
        "error"
      );
    }
  };

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
              Promotions
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
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="min-w-0">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Promotions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Create special offers and submit them for admin review.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition shadow-sm hover:shadow flex-shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              New promotion
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard label="Total" value={counts.all} icon={Megaphone} />
            <StatCard label="Drafts" value={counts.draft} icon={Edit3} tone="blue" />
            <StatCard label="Pending" value={counts.pending} icon={Clock} tone="yellow" />
            <StatCard label="Approved" value={counts.approved} icon={CheckCircle2} tone="green" />
          </div>

          {/* Filters + search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 sm:p-4 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or promo code"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {STATUS_FILTERS.map((f) => {
                  const active = statusFilter === f.value;
                  const count = counts[f.value] ?? 0;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setStatusFilter(f.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                        active
                          ? "bg-[#3B82F6] text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {f.label}
                      {f.value !== "all" && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            active
                              ? "bg-white/25 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                >
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {promotions.length === 0
                  ? "No promotions yet"
                  : "No promotions match your filters"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
                {promotions.length === 0
                  ? "Create your first promotion to start attracting more customers."
                  : "Try adjusting the search or filters above."}
              </p>
              {promotions.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                >
                  <Plus className="h-4 w-4" />
                  Create your first promotion
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((promo) => (
                <PromotionCard
                  key={promo._id}
                  promotion={promo}
                  onEdit={() => openEditModal(promo)}
                  onDelete={() => setDeleteTarget(promo)}
                  onSubmit={() => setSubmitTarget(promo)}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} LocalSpot Systems Ltd. — Business Account Center
            </p>
          </footer>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <PromotionFormModal
          promotion={editingPromotion}
          onClose={closeModal}
          onSave={async (payload, id) => {
            try {
              const result = id
                ? await updatePromotion({ id, ...payload }).unwrap()
                : await createPromotion(payload).unwrap();
              showToast(
                result?.message ||
                  (id ? "Promotion updated" : "Promotion created"),
                "success"
              );
              closeModal();
            } catch (err) {
              showToast(
                err?.data?.message ||
                  (id ? "Failed to update" : "Failed to create"),
                "error"
              );
              throw err;
            }
          }}
          isSaving={isCreating || isUpdating}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete promotion?"
          body={`"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          confirmTone="danger"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Submit for review confirm */}
      {submitTarget && (
        <ConfirmModal
          title="Submit for review?"
          body={`"${submitTarget.title}" will be sent to our team for approval. You won't be able to edit it while it's under review.`}
          confirmLabel="Submit"
          confirmTone="primary"
          onCancel={() => setSubmitTarget(null)}
          onConfirm={handleSubmitForReview}
          isLoading={isSubmitting}
        />
      )}

      <BusinessBottombar />
    </div>
  );
};

// ─── Stat card ─────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, tone = "default" }) => {
  const toneClass = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    blue: "bg-blue-50 text-[#3B82F6] dark:bg-blue-900/20 dark:text-blue-400",
    yellow:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  }[tone];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {value}
          </p>
        </div>
        <div className={`p-1.5 rounded-lg flex-shrink-0 ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

// ─── Promotion card ────────────────────────────────────────
const PromotionCard = ({ promotion, onEdit, onDelete, onSubmit, isMutating }) => {
  const { color, Icon } = statusStyle(promotion.status);
  const canEdit = ["draft", "rejected"].includes(promotion.status);
  const canSubmit = ["draft", "rejected"].includes(promotion.status);
  const canDelete = promotion.status !== "approved";

  const discountLabel =
    promotion.discountValue != null
      ? promotion.discountType === "percent"
        ? `${promotion.discountValue}% off`
        : promotion.discountType === "fixed"
        ? `₦${promotion.discountValue} off`
        : promotion.discountValue
      : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        {promotion.image ? (
          <img
            src={promotion.image}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm ${color}`}
        >
          <Icon className="h-3 w-3" />
          {promotion.status || "draft"}
        </span>
        {discountLabel && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3B82F6] text-white shadow">
            {discountLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col min-w-0">
        <h3
          className="text-sm font-semibold text-gray-900 dark:text-white truncate"
          title={promotion.title}
        >
          {promotion.title}
        </h3>

        {promotion.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {promotion.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 truncate">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {formatDate(promotion.startDate)} → {formatDate(promotion.endDate)}
          </span>
        </div>

        {promotion.promoCode && (
          <div className="flex items-center gap-1.5 mt-2">
            <Tag className="h-3 w-3 text-gray-400" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {promotion.promoCode}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {promotion.viewCount || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" />
            {promotion.clickCount || 0}
          </span>
        </div>

        {promotion.status === "rejected" && promotion.rejectionReason && (
          <div className="mt-3 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded-lg">
            <span className="font-semibold">Rejected:</span>{" "}
            <span className="break-words">{promotion.rejectionReason}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={isMutating}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>
          )}

          {canSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isMutating || !promotion.image}
              title={
                !promotion.image
                  ? "Add an image before submitting"
                  : "Submit for admin review"
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-3 w-3" />
              Submit
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isMutating}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Form modal ────────────────────────────────────────────
const PromotionFormModal = ({ promotion, onClose, onSave, isSaving }) => {
  const { showToast } = useToast();
  const isEdit = !!promotion;

  const [form, setForm] = useState({
    ...emptyForm,
    ...(promotion
      ? {
          title: promotion.title || "",
          description: promotion.description || "",
          discountType: promotion.discountType || "percent",
          discountValue:
            promotion.discountValue != null ? String(promotion.discountValue) : "",
          promoCode: promotion.promoCode || "",
          startDate: toInputDate(promotion.startDate),
          endDate: toInputDate(promotion.endDate),
        }
      : {}),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(promotion?.image || null);
  const fileInputRef = useRef(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!form.startDate || !form.endDate) {
      showToast("Start and end dates are required", "error");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast("End date must be after start date", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("discountType", form.discountType);
    if (form.discountValue !== "")
      fd.append("discountValue", String(form.discountValue));
    if (form.promoCode.trim())
      fd.append("promoCode", form.promoCode.trim().toUpperCase());
    fd.append("startDate", form.startDate);
    fd.append("endDate", form.endDate);
    if (imageFile) fd.append("image", imageFile);

    try {
      await onSave(fd, promotion?._id);
    } catch (_) {
      // error toast already shown by parent
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
        className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl mx-0 sm:mx-4 mb-0 sm:mb-4 shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {isEdit ? "Edit promotion" : "New promotion"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {isEdit
                ? "Update the details and re-submit for review."
                : "Fill in the details below. You'll be able to review before submitting."}
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
          {/* Image */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Promotion image
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Promotion"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSaving}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#3B82F6] dark:hover:border-[#3B82F6] bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Click to upload an image
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Required before submitting for review
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="mt-2 text-xs text-[#3B82F6] hover:underline disabled:opacity-50"
              >
                Change image
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. 20% off all weekend"
              maxLength={100}
              disabled={isSaving}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short details about your offer..."
              maxLength={500}
              disabled={isSaving}
              className={inputClass}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {form.description.length}/500
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Discount type
              </label>
              <select
                value={form.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              >
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Discount value
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.discountValue}
                onChange={(e) => handleChange("discountValue", e.target.value)}
                placeholder={
                  form.discountType === "percent" ? "e.g. 20" : "e.g. 500"
                }
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Promo code
              </label>
              <input
                type="text"
                value={form.promoCode}
                onChange={(e) =>
                  handleChange("promoCode", e.target.value.toUpperCase())
                }
                placeholder="e.g. WEEKEND20"
                maxLength={20}
                disabled={isSaving}
                className={`${inputClass} font-mono tracking-wider`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Start <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  End <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>
            </div>
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
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                {isEdit ? "Save changes" : "Create promotion"}
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
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const toneClass =
    confirmTone === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-[#3B82F6] hover:bg-blue-700";

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
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              confirmTone === "danger"
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-blue-50 dark:bg-blue-900/20"
            }`}
          >
            {confirmTone === "danger" ? (
              <Trash2 className="h-5 w-5 text-red-500" />
            ) : (
              <Send className="h-5 w-5 text-[#3B82F6]" />
            )}
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

export default BusinessPromotion;