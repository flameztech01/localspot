// src/components/admin/AdminAdvertisementsView.jsx
import React, { useState } from "react";
import {
  FiLoader,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiImage,
  FiTrash2,
  FiAlertCircle,
  FiTv,
  FiPlus,
  FiSliders,
} from "react-icons/fi";

import {
  useAdminAdvertisementStatsQuery,
  useAdminListAdvertisementsQuery,
  useAdminApproveAdvertisementMutation,
  useAdminRejectAdvertisementMutation,
  useAdminSetAdvertisementStatusMutation,
  useAdminDeleteAdvertisementMutation,
  useAdminListAdvertisementTypesQuery,
  useAdminCreateAdvertisementTypeMutation,
  useAdminUpdateAdvertisementTypeMutation,
  useAdminListAdvertisementSlotsQuery,
  useAdminCreateAdvertisementSlotMutation,
  useAdminUpdateAdvertisementSlotMutation,
} from "../../features/adsApiSlice";

const STATUS_TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paused", label: "Paused" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
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
  paused: {
    label: "Paused",
    cls: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  expired: {
    label: "Expired",
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  draft: {
    label: "Draft",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
};

const formatNumber = (n) => Number(n || 0).toLocaleString();

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

const AdminAdvertisementsView = ({ onNotify }) => {
  const [view, setView] = useState("ads"); // "ads" | "taxonomy"
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const {
    data: statsResp,
    isLoading: loadingStats,
  } = useAdminAdvertisementStatsQuery({});

  const {
    data: listResp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useAdminListAdvertisementsQuery({
    status,
    limit,
    offset: (page - 1) * limit,
  });

  const ads = listResp?.data?.items || [];
  const pagination = listResp?.data?.pagination || {
    total: 0,
    limit,
    offset: 0,
    hasMore: false,
  };
  const stats = statsResp?.data || null;
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  const [approve, { isLoading: isApproving }] =
    useAdminApproveAdvertisementMutation();
  const [reject, { isLoading: isRejecting }] =
    useAdminRejectAdvertisementMutation();
  const [setAdStatus, { isLoading: isSetting }] =
    useAdminSetAdvertisementStatusMutation();
  const [deleteAd, { isLoading: isDeleting }] =
    useAdminDeleteAdvertisementMutation();

  const isMutating =
    isApproving || isRejecting || isSetting || isDeleting;

  const handleApprove = async (id) => {
    try {
      const r = await approve(id).unwrap();
      onNotify?.(r?.message || "Advertisement approved", "success");
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
      onNotify?.("Advertisement rejected", "success");
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to reject", "error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const r = await setAdStatus({ id, status: newStatus }).unwrap();
      onNotify?.(r?.message || "Status updated", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this advertisement permanently?")) return;
    try {
      const r = await deleteAd(id).unwrap();
      onNotify?.(r?.message || "Advertisement deleted", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Advertisements
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review ad placements and manage ad types & slots.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setView("ads")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                view === "ads"
                  ? "bg-[#5397F6] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ads
            </button>
            <button
              type="button"
              onClick={() => setView("taxonomy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                view === "taxonomy"
                  ? "bg-[#5397F6] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Types & Slots
            </button>
          </div>

          {view === "ads" && (
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              aria-label="Refresh"
            >
              <FiRefreshCw
                size={14}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {view === "ads" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Ads"
            value={formatNumber(stats?.totals?.totalAds)}
            loading={loadingStats}
            tone="blue"
          />
          <KpiCard
            label="Impressions"
            value={formatNumber(stats?.totals?.impressions)}
            loading={loadingStats}
          />
          <KpiCard
            label="Clicks"
            value={formatNumber(stats?.totals?.clicks)}
            loading={loadingStats}
          />
          <KpiCard
            label="CTR"
            value={`${stats?.totals?.ctr || 0}%`}
            loading={loadingStats}
            tone="emerald"
          />
        </div>
      )}

      {view === "ads" ? (
        <AdsListView
          status={status}
          setStatus={setStatus}
          setPage={setPage}
          page={page}
          pagination={pagination}
          ads={ads}
          isLoading={isLoading}
          isFetching={isFetching}
          isUnauthorized={isUnauthorized}
          isMutating={isMutating}
          onApprove={handleApprove}
          onRejectClick={(ad) => setRejectModal(ad)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <TaxonomyView onNotify={onNotify} />
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
                Reject advertisement
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
              Rejecting{" "}
              <span className="font-semibold">{rejectModal.title}</span>. The
              business will receive this reason.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Creative does not match the selected slot dimensions."
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

// ─── Ads list ─────────────────────────────────────────────
const AdsListView = ({
  status,
  setStatus,
  setPage,
  page,
  pagination,
  ads,
  isLoading,
  isFetching,
  isUnauthorized,
  isMutating,
  onApprove,
  onRejectClick,
  onStatusChange,
  onDelete,
}) => (
  <>
    {/* Tabs */}
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

    {isLoading ? (
      <div className="p-10 text-center bg-white rounded-2xl border border-gray-200/80">
        <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading ads…</p>
      </div>
    ) : isUnauthorized ? (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
        <p className="text-sm font-semibold text-rose-600 mb-1">
          Admin access only
        </p>
      </div>
    ) : ads.length === 0 ? (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
        <FiTv className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-700">
          No ads in this view
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ads.map((ad) => {
          const meta = STATUS_META[ad.status] || STATUS_META.draft;
          const ctr =
            ad.impressions > 0
              ? Number(((ad.clicks / ad.impressions) * 100).toFixed(2))
              : 0;
          return (
            <div
              key={ad._id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="relative h-40 bg-gray-100">
                {ad.image ? (
                  <img
                    src={ad.image}
                    alt={ad.title}
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
                {ad.slot?.name && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white truncate max-w-[140px]">
                    {ad.slot.name}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {ad.title}
                </h3>
                {ad.business?.businessName && (
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {ad.business.businessName}
                  </p>
                )}
                {ad.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {ad.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                  <span>
                    {formatDate(ad.startDate)} → {formatDate(ad.endDate)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Stat
                    label="Impressions"
                    value={formatNumber(ad.impressions)}
                  />
                  <Stat label="Clicks" value={formatNumber(ad.clicks)} />
                  <Stat label="CTR" value={`${ctr}%`} />
                </div>

                {ad.status === "rejected" && ad.rejectionReason && (
                  <div className="mt-3 text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg">
                    <span className="font-semibold">Rejected:</span>{" "}
                    {ad.rejectionReason}
                  </div>
                )}

                <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                  {ad.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(ad._id)}
                        disabled={isMutating}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                      >
                        <FiCheck size={12} />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectClick(ad)}
                        disabled={isMutating}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg disabled:opacity-50"
                      >
                        <FiX size={12} />
                        Reject
                      </button>
                    </>
                  )}

                  {ad.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(ad._id, "paused")}
                      disabled={isMutating}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg disabled:opacity-50"
                    >
                      Pause
                    </button>
                  )}

                  {ad.status === "paused" && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(ad._id, "approved")}
                      disabled={isMutating}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg disabled:opacity-50"
                    >
                      Resume
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(ad._id)}
                    disabled={isMutating}
                    className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-50"
                  >
                    <FiTrash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {!isLoading && !isUnauthorized && ads.length > 0 && (
      <div className="px-5 py-4 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs font-medium text-gray-600">
        <div>Showing {ads.length} ads</div>
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
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasMore || isFetching}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    )}
  </>
);

// ─── Taxonomy view ────────────────────────────────────────
const TaxonomyView = ({ onNotify }) => {
  const { data: typesResp, isLoading: loadingTypes } =
    useAdminListAdvertisementTypesQuery();
  const { data: slotsResp, isLoading: loadingSlots } =
    useAdminListAdvertisementSlotsQuery();

  const types = typesResp?.data || [];
  const slots = slotsResp?.data || [];

  const [createType, { isLoading: creatingType }] =
    useAdminCreateAdvertisementTypeMutation();
  const [updateType] = useAdminUpdateAdvertisementTypeMutation();
  const [createSlot, { isLoading: creatingSlot }] =
    useAdminCreateAdvertisementSlotMutation();
  const [updateSlot] = useAdminUpdateAdvertisementSlotMutation();

  const [newType, setNewType] = useState({ name: "", slug: "", category: "" });
  const [newSlot, setNewSlot] = useState({
    name: "",
    slug: "",
    position: "",
    maxActiveAds: 3,
  });

  const slugify = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleCreateType = async () => {
    if (!newType.name) return;
    try {
      await createType({
        name: newType.name,
        slug: newType.slug || slugify(newType.name),
        category: newType.category,
        isActive: true,
      }).unwrap();
      onNotify?.("Type created", "success");
      setNewType({ name: "", slug: "", category: "" });
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to create type", "error");
    }
  };

  const handleCreateSlot = async () => {
    if (!newSlot.name) return;
    try {
      await createSlot({
        name: newSlot.name,
        slug: newSlot.slug || slugify(newSlot.name),
        position: newSlot.position,
        maxActiveAds: Number(newSlot.maxActiveAds) || 3,
        isActive: true,
      }).unwrap();
      onNotify?.("Slot created", "success");
      setNewSlot({ name: "", slug: "", position: "", maxActiveAds: 3 });
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to create slot", "error");
    }
  };

  const toggleTypeActive = async (t) => {
    try {
      await updateType({ id: t._id, isActive: !t.isActive }).unwrap();
      onNotify?.(`Type ${!t.isActive ? "activated" : "deactivated"}`, "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    }
  };

  const toggleSlotActive = async (s) => {
    try {
      await updateSlot({ id: s._id, isActive: !s.isActive }).unwrap();
      onNotify?.(`Slot ${!s.isActive ? "activated" : "deactivated"}`, "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Types */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FiSliders size={16} className="text-[#5397F6]" />
          <h3 className="font-bold text-gray-900 text-sm">
            Advertisement Types
          </h3>
          <span className="ml-auto text-[10px] font-bold text-gray-400">
            {types.length}
          </span>
        </div>

        {loadingTypes ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : types.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No types configured yet.
          </p>
        ) : (
          <div className="space-y-2">
            {types.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {t.slug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleTypeActive(t)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    t.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Add new type
          </p>
          <input
            type="text"
            value={newType.name}
            onChange={(e) =>
              setNewType((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Name (e.g. Native Banner)"
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newType.slug}
              onChange={(e) =>
                setNewType((p) => ({ ...p, slug: e.target.value }))
              }
              placeholder="slug (optional)"
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            <input
              type="text"
              value={newType.category}
              onChange={(e) =>
                setNewType((p) => ({ ...p, category: e.target.value }))
              }
              placeholder="category (optional)"
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleCreateType}
            disabled={creatingType || !newType.name}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#5397F6] text-white text-xs font-semibold hover:bg-[#4288ec] disabled:opacity-60"
          >
            {creatingType ? (
              <>
                <FiLoader size={13} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <FiPlus size={13} /> Add type
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slots */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FiSliders size={16} className="text-[#5397F6]" />
          <h3 className="font-bold text-gray-900 text-sm">
            Advertisement Slots
          </h3>
          <span className="ml-auto text-[10px] font-bold text-gray-400">
            {slots.length}
          </span>
        </div>

        {loadingSlots ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No slots configured yet.
          </p>
        ) : (
          <div className="space-y-2">
            {slots.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">
                    {s.position || s.slug} · max {s.maxActiveAds} ·{" "}
                    {s.activeAdsCount || 0} live
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSlotActive(s)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    s.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Add new slot
          </p>
          <input
            type="text"
            value={newSlot.name}
            onChange={(e) =>
              setNewSlot((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Name (e.g. Home top banner)"
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newSlot.position}
              onChange={(e) =>
                setNewSlot((p) => ({ ...p, position: e.target.value }))
              }
              placeholder="position"
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            <input
              type="text"
              value={newSlot.slug}
              onChange={(e) =>
                setNewSlot((p) => ({ ...p, slug: e.target.value }))
              }
              placeholder="slug"
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            <input
              type="number"
              value={newSlot.maxActiveAds}
              onChange={(e) =>
                setNewSlot((p) => ({
                  ...p,
                  maxActiveAds: e.target.value,
                }))
              }
              placeholder="max"
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleCreateSlot}
            disabled={creatingSlot || !newSlot.name}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#5397F6] text-white text-xs font-semibold hover:bg-[#4288ec] disabled:opacity-60"
          >
            {creatingSlot ? (
              <>
                <FiLoader size={13} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <FiPlus size={13} /> Add slot
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Small components ─────────────────────────────────────
const KpiCard = ({ label, value, loading, tone = "default" }) => {
  const cls = {
    default: "text-gray-900",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
  }[tone];
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <div className={`text-3xl font-black ${cls}`}>{value}</div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase text-gray-400 tracking-wide">
      {label}
    </p>
    <p className="text-sm font-bold text-gray-900">{value}</p>
  </div>
);

export default AdminAdvertisementsView;