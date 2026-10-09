// src/pages/business/BusinessPromotion.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Plus,
  Image as ImageIcon,
  MoreVertical,
  Pencil,
  Trash2,
  Send,
  X,
  Loader,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Megaphone,
  Upload,
  Eye,
  MousePointerClick,
  Tag,
  Percent,
  DollarSign,
  Calendar,
} from "lucide-react";

import {
  useListMyPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useSubmitPromotionForReviewMutation,
} from "../../features/promotionApiSlice";
import { useLogoutBusinessAccountMutation } from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import BusinessSidebar from "../../components/BusinessSidebar";
import BusinessBottombar from "../../components/BusinessBottombar";

// ─── Constants ─────────────────────────────────────────────
const TABS = [
  { id: "active", label: "Active", statuses: ["approved"] },
  { id: "pending", label: "Pending approval", statuses: ["pending"] },
  { id: "draft", label: "Drafts", statuses: ["draft"] },
  { id: "rejected", label: "Rejected", statuses: ["rejected"] },
  { id: "expired", label: "Expired/Disabled", statuses: ["expired", "disabled"] },
];

const DISCOUNT_TYPES = [
  { value: "percent", label: "Percentage (%)", icon: Percent },
  { value: "fixed", label: "Fixed amount", icon: DollarSign },
  { value: "other", label: "Other", icon: Tag },
];

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition";

// ─── Helpers ───────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const formatDiscount = (promo) => {
  if (promo.discountValue == null) return "—";
  if (promo.discountType === "percent") return `${promo.discountValue}% off`;
  if (promo.discountType === "fixed")
    return `₦${Number(promo.discountValue).toLocaleString()} off`;
  return String(promo.discountValue);
};

const formatNumber = (n) => Number(n || 0).toLocaleString();

const daysUntil = (d) => {
  if (!d) return null;
  const diff = new Date(d).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
};

// ─── Main ──────────────────────────────────────────────────
const BusinessPromotion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("active");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formModal, setFormModal] = useState(null); // null | { mode, promo }
  const [loggingOut, setLoggingOut] = useState(false);

  // ─── Queries ─────────────────────────────────────────────
  const {
    data: promosResp,
    isLoading,
    error,
    refetch,
  } = useListMyPromotionsQuery({ limit: 50 });

  const promotions = promosResp?.data || [];
  const isUnauthorized = error?.status === 401;

  const [deletePromo, { isLoading: isDeleting }] =
    useDeletePromotionMutation();
  const [submitPromo, { isLoading: isSubmitting }] =
    useSubmitPromotionForReviewMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating = isDeleting || isSubmitting;

  // ─── Group by status ─────────────────────────────────────
  const grouped = useMemo(() => {
    const map = {};
    TABS.forEach((tab) => {
      map[tab.id] = promotions.filter((p) => tab.statuses.includes(p.status));
    });
    return map;
  }, [promotions]);

  const visible = grouped[activeTab] || [];

  // ─── Handlers ────────────────────────────────────────────
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

  const handleSubmit = async (id) => {
    setOpenMenuId(null);
    try {
      const r = await submitPromo(id).unwrap();
      showToast(r?.message || "Submitted for review", "success");
    } catch (err) {
      showToast(err?.data?.message || "Failed to submit", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePromo(deleteTarget._id).unwrap();
      showToast("Promotion deleted", "success");
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
        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* ─── Header ─── */}
          <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Promotions
            </h1>
            <button
              type="button"
              onClick={() => setFormModal({ mode: "create", promo: null })}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-indigo-500 hover:from-blue-700 hover:to-indigo-600 rounded-lg transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New promotion
            </button>
          </div>

          {/* ─── Tabs ─── */}
          <nav className="mb-6 -mx-4 lg:mx-0 px-4 lg:px-0 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                const count = grouped[tab.id]?.length || 0;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setOpenMenuId(null);
                    }}
                    className={`px-4 py-2 text-xs lg:text-sm font-medium rounded-full border transition whitespace-nowrap ${
                      active
                        ? "bg-white text-gray-900 border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ─── Loading ─── */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 overflow-hidden flex gap-4 p-4"
                >
                  <div className="w-24 h-24 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Error ─── */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-900">
                Failed to load promotions
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
          {!isLoading && !error && visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Megaphone className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {activeTab === "active"
                  ? "No active promotions"
                  : `No ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}`}
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                {activeTab === "active"
                  ? "Create a promotion to attract more customers."
                  : "Nothing to see here — try a different tab."}
              </p>
              {activeTab === "active" && (
                <button
                  type="button"
                  onClick={() =>
                    setFormModal({ mode: "create", promo: null })
                  }
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                >
                  <Plus className="h-4 w-4" />
                  Create promotion
                </button>
              )}
            </div>
          )}

          {/* ─── Card list ─── */}
          {!isLoading && !error && visible.length > 0 && (
            <div className="space-y-4">
              {visible.map((promo) => (
                <PromoCard
                  key={promo._id}
                  promo={promo}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onEdit={() =>
                    setFormModal({ mode: "edit", promo })
                  }
                  onDelete={() => {
                    setOpenMenuId(null);
                    setDeleteTarget(promo);
                  }}
                  onSubmit={() => handleSubmit(promo._id)}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Delete confirm ─── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !isDeleting && setDeleteTarget(null)}
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
                  Delete promotion?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  "{deleteTarget.title}" will be permanently removed. This
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create/Edit modal ─── */}
      {formModal && (
        <PromoFormModal
          mode={formModal.mode}
          promo={formModal.promo}
          onClose={() => setFormModal(null)}
          onSuccess={() => {
            setFormModal(null);
            refetch();
          }}
          onNotify={showToast}
        />
      )}

      <BusinessBottombar />
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Card
// ──────────────────────────────────────────────────────────
const PromoCard = ({
  promo,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
  onSubmit,
  isMutating,
}) => {
  const canEdit = ["draft", "rejected"].includes(promo.status);
  const canSubmit = ["draft", "rejected"].includes(promo.status);
  const canDelete = promo.status !== "approved";

  const days = daysUntil(promo.endDate);
  const isExpired = days === 0;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition relative">
      <div className="flex items-stretch">
        {/* Thumbnail */}
        <div className="w-28 sm:w-36 lg:w-40 bg-gray-100 flex-shrink-0 relative">
          {promo.image ? (
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[120px]">
              <ImageIcon className="h-7 w-7 text-gray-400" />
            </div>
          )}
          {promo.discountValue != null && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {promo.discountType === "percent"
                ? `${promo.discountValue}%`
                : promo.discountType === "fixed"
                  ? `₦${promo.discountValue}`
                  : "OFFER"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 lg:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold mb-1.5">
                Promotional offer
              </span>

              <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">
                {promo.title || "Untitled promotion"}
              </h3>

              <p className="text-sm text-gray-600 mt-0.5">
                {formatDiscount(promo)}
                {promo.promoCode && (
                  <span className="ml-2 text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                    {promo.promoCode}
                  </span>
                )}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {formatDate(promo.startDate)} → {formatDate(promo.endDate)}
                {days !== null && !isExpired && days <= 7 && (
                  <span className="ml-2 text-orange-600 font-semibold">
                    · {days} day{days === 1 ? "" : "s"} left
                  </span>
                )}
              </p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                Created: {formatDate(promo.createdAt)}
              </span>

              <div className="flex items-center gap-1.5">
                {canSubmit && (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isMutating}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    Finish & publish
                  </button>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(openMenuId === promo._id ? null : promo._id)
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openMenuId === promo._id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onEdit();
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil className="h-3.5 w-3.5 text-gray-400" />
                            Edit
                          </button>
                        )}

                        {canSubmit && (
                          <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isMutating}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Send className="h-3.5 w-3.5 text-blue-500" />
                            Submit for review
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={onDelete}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection reason */}
          {promo.status === "rejected" && promo.rejectionReason && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <span className="font-semibold">Rejected:</span>{" "}
              {promo.rejectionReason}
            </p>
          )}

          {/* Bottom stats row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(promo.viewCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MousePointerClick className="h-3.5 w-3.5" />
              {formatNumber(promo.clickCount)}
            </span>
            <StatusPill status={promo.status} />
          </div>
        </div>
      </div>
    </article>
  );
};

// ──────────────────────────────────────────────────────────
// Status pill
// ──────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const config =
    {
      approved: {
        label: "Active",
        cls: "text-emerald-700 bg-emerald-50",
        Icon: CheckCircle2,
      },
      pending: {
        label: "Pending",
        cls: "text-amber-700 bg-amber-50",
        Icon: Clock,
      },
      rejected: {
        label: "Rejected",
        cls: "text-red-700 bg-red-50",
        Icon: XCircle,
      },
      disabled: {
        label: "Disabled",
        cls: "text-gray-600 bg-gray-100",
        Icon: Ban,
      },
      expired: {
        label: "Expired",
        cls: "text-gray-600 bg-gray-100",
        Icon: Clock,
      },
      draft: {
        label: "Draft",
        cls: "text-blue-700 bg-blue-50",
        Icon: Pencil,
      },
    }[status] || {
      label: status,
      cls: "text-gray-600 bg-gray-100",
      Icon: AlertCircle,
    };

  const Icon = config.Icon;
  return (
    <span
      className={`ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${config.cls}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

// ──────────────────────────────────────────────────────────
// Form modal (create + edit)
// ──────────────────────────────────────────────────────────
const PromoFormModal = ({ mode, promo, onClose, onSuccess, onNotify }) => {
  const isEdit = mode === "edit" && promo;

  const [createPromo, { isLoading: isCreating }] =
    useCreatePromotionMutation();
  const [updatePromo, { isLoading: isUpdating }] =
    useUpdatePromotionMutation();

  const isSaving = isCreating || isUpdating;

  const [form, setForm] = useState({
    title: promo?.title || "",
    description: promo?.description || "",
    discountType: promo?.discountType || "percent",
    discountValue:
      promo?.discountValue != null ? String(promo.discountValue) : "",
    promoCode: promo?.promoCode || "",
    startDate: toInputDate(promo?.startDate),
    endDate: toInputDate(promo?.endDate),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(promo?.image || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (field, value) =>
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
      onNotify?.("Title is required", "error");
      return;
    }
    if (!form.startDate || !form.endDate) {
      onNotify?.("Start and end dates are required", "error");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      onNotify?.("End date must be after start date", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    if (form.description.trim())
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
      const r = isEdit
        ? await updatePromo({ id: promo._id, formData: fd }).unwrap()
        : await createPromo(fd).unwrap();

      onNotify?.(
        r?.message || (isEdit ? "Promotion updated" : "Promotion created"),
        "success",
      );
      onSuccess?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message ||
          (isEdit ? "Failed to update" : "Failed to create"),
        "error",
      );
    }
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
              {isEdit ? "Edit promotion" : "New promotion"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit
                ? "Update the details and save."
                : "Fill in the details — you can save it as a draft first."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => !isSaving && onClose()}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0 disabled:opacity-60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Promotion image
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Promotion"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSaving}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition disabled:opacity-60"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#3B82F6] bg-gray-50 flex flex-col items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">
                  Click to upload promotion image
                </span>
                <span className="text-[10px] text-gray-400">
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
                className="mt-2 text-xs font-semibold text-[#3B82F6] hover:underline disabled:opacity-60"
              >
                Change image
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Happy Hour: 20% off all cocktails"
              maxLength={100}
              disabled={isSaving}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short details about your offer..."
              maxLength={500}
              disabled={isSaving}
              className={`${inputClass} resize-none`}
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {form.description.length}/500
            </p>
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Discount type
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setField("discountType", e.target.value)}
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
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Discount value
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.discountValue}
                onChange={(e) => setField("discountValue", e.target.value)}
                placeholder={
                  form.discountType === "percent" ? "e.g. 20" : "e.g. 5000"
                }
                disabled={isSaving}
                className={inputClass}
              />
            </div>
          </div>

          {/* Promo code */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Promo code
            </label>
            <input
              type="text"
              value={form.promoCode}
              onChange={(e) =>
                setField("promoCode", e.target.value.toUpperCase())
              }
              placeholder="e.g. HAPPY20"
              maxLength={20}
              disabled={isSaving}
              className={`${inputClass} font-mono tracking-wider`}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Optional. Auto-uppercase.
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Start <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                End <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>
          </div>

          {/* Help text */}
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-2.5 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-[#3B82F6] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-[#3B82F6] leading-relaxed">
              Promotions are saved as drafts. Once submitted, they go through
              admin review before becoming publicly visible.
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
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                {isEdit ? "Save changes" : "Create promotion"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessPromotion;