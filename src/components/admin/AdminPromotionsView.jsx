// src/components/admin/AdminPromotionsView.jsx
import React, { useState } from "react";
import {
  FiLoader,
  FiCheck,
  FiX,
  FiSlash,
  FiTrash2,
  FiRefreshCw,
  FiImage,
  FiAlertCircle,
  FiTag,
} from "react-icons/fi";

import {
  useAdminListPromotionsQuery,
  useAdminApprovePromotionMutation,
  useAdminRejectPromotionMutation,
  useAdminDisablePromotionMutation,
  useAdminRemoveExpiredPromotionsMutation,
} from "../../features/promotionApiSlice";

const STATUS_TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Drafts" },
  { value: "disabled", label: "Disabled" },
  { value: "", label: "All" },
];

const STATUS_META = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  disabled: {
    label: "Disabled",
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  draft: {
    label: "Draft",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
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

const AdminPromotionsView = ({ onNotify }) => {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const {
    data: resp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useAdminListPromotionsQuery({ status, page, limit });

  const promotions = resp?.items || [];
  const pagination = resp?.pagination || {
    total: 0,
    page,
    limit,
    pages: 1,
  };
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  const [approve, { isLoading: isApproving }] =
    useAdminApprovePromotionMutation();
  const [reject, { isLoading: isRejecting }] =
    useAdminRejectPromotionMutation();
  const [disable, { isLoading: isDisabling }] =
    useAdminDisablePromotionMutation();
  const [removeExpired, { isLoading: isRemoving }] =
    useAdminRemoveExpiredPromotionsMutation();

  const isMutating = isApproving || isRejecting || isDisabling || isRemoving;

  const handleApprove = async (id) => {
    try {
      const r = await approve(id).unwrap();
      onNotify?.(r?.message || "Promotion approved", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to approve", "error");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try {
      await reject({
        id: rejectModal._id,
        reason: rejectReason.trim(),
      }).unwrap();
      onNotify?.("Promotion rejected", "success");
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to reject", "error");
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this promotion? It will stop showing to users."))
      return;
    try {
      const r = await disable(id).unwrap();
      onNotify?.(r?.message || "Promotion disabled", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to disable", "error");
    }
  };

  const handleRemoveExpired = async () => {
    if (
      !window.confirm(
        "Permanently delete all expired promotions? This cannot be undone."
      )
    )
      return;
    try {
      const r = await removeExpired().unwrap();
      onNotify?.(r?.message || "Expired promotions removed", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to remove", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Promotions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review merchant promotions before they go live.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <FiRefreshCw
              size={13}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleRemoveExpired}
            disabled={isRemoving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            <FiTrash2 size={13} />
            Purge expired
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                active
                  ? "bg-[#5397F6] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-gray-200/80">
          <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading promotions…</p>
        </div>
      ) : isUnauthorized ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
          <p className="text-sm font-semibold text-rose-600 mb-1">
            Admin access only
          </p>
          <p className="text-xs text-gray-500">
            Your account doesn't have permission to manage promotions.
          </p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
          <FiTag className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            No promotions in this view
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Try a different status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {promotions.map((promo) => {
            const meta = STATUS_META[promo.status] || STATUS_META.draft;
            const discountLabel = promo.discountValue != null
              ? promo.discountType === "percent"
                ? `${promo.discountValue}% off`
                : promo.discountType === "fixed"
                ? `₦${promo.discountValue} off`
                : String(promo.discountValue)
              : null;

            return (
              <div
                key={promo._id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col"
              >
                <div className="relative h-40 bg-gray-100">
                  {promo.image ? (
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                  {discountLabel && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5397F6] text-white shadow">
                      {discountLabel}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {promo.title}
                      </h3>
                      {promo.business?.businessName && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {promo.business.businessName}
                        </p>
                      )}
                    </div>
                  </div>

                  {promo.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {promo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                    <span>
                      {formatDate(promo.startDate)} → {formatDate(promo.endDate)}
                    </span>
                  </div>

                  {promo.promoCode && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <FiTag size={11} className="text-gray-400" />
                      <span className="text-[11px] font-mono font-semibold tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {promo.promoCode}
                      </span>
                    </div>
                  )}

                  {promo.status === "rejected" && promo.rejectionReason && (
                    <div className="mt-3 text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg">
                      <span className="font-semibold">Rejected:</span>{" "}
                      {promo.rejectionReason}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
                    {promo.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(promo._id)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                        >
                          <FiCheck size={12} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModal(promo)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg disabled:opacity-50"
                        >
                          <FiX size={12} />
                          Reject
                        </button>
                      </>
                    )}

                    {promo.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => handleDisable(promo._id)}
                        disabled={isMutating}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                      >
                        <FiSlash size={12} />
                        Disable
                      </button>
                    )}

                    {promo.status === "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(promo._id)}
                        disabled={isMutating}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                      >
                        <FiCheck size={12} />
                        Approve anyway
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isUnauthorized && promotions.length > 0 && (
        <div className="px-5 py-4 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs font-medium text-gray-600">
          <div>
            Page {pagination.page} of {pagination.pages} · {pagination.total} total
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages || isFetching}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isRejecting && setRejectModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="text-rose-500" />
                Reject promotion
              </h3>
              <button
                type="button"
                onClick={() => !isRejecting && setRejectModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Rejecting <span className="font-semibold">{rejectModal.title}</span>.
              The reason will be shown to the business owner.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Discount amount is not clearly stated in the image. Please resubmit with clearer details."
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
              maxLength={500}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                disabled={isRejecting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={isRejecting || !rejectReason.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold"
              >
                {isRejecting ? (
                  <>
                    <FiLoader size={13} className="animate-spin" />
                    Rejecting…
                  </>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsView;