// src/components/admin/AdminFeaturedView.jsx
import React, { useMemo, useState } from "react";
import {
  FiStar,
  FiPlus,
  FiSearch,
  FiX,
  FiLoader,
  FiRefreshCw,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiImage,
  FiCheck,
} from "react-icons/fi";

import {
  useListFeaturedBusinessesQuery,
  useAdminToggleFeaturedMutation,
} from "../../features/adminApiSlice";
import { useListBusinessesQuery } from "../../features/businessApiSlice";

const PLAN_OPTIONS = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const DURATION_OPTIONS = [
  { value: "", label: "No expiry" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "180", label: "6 months" },
  { value: "365", label: "1 year" },
];

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

const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
};

const AdminFeaturedView = ({ onNotify }) => {
  const [page, setPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState(true);
  const limit = 20;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const {
    data: resp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useListFeaturedBusinessesQuery({ activeOnly, page, limit });

  const featured = resp?.data || [];
  const pagination = resp?.pagination || {
    total: 0,
    page,
    limit,
    pages: 1,
  };
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  const [toggleFeatured, { isLoading: isToggling }] =
    useAdminToggleFeaturedMutation();

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      const r = await toggleFeatured({
        id: removeTarget._id,
        featured: false,
      }).unwrap();
      onNotify?.(r?.message || "Removed from featured", "success");
      setRemoveTarget(null);
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
            Featured Listings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Promote high-value businesses on the homepage and discovery carousels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs shadow-sm transition"
          >
            <FiPlus size={14} />
            Feature a business
          </button>
        </div>
      </div>

      {/* Toggle active-only */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveOnly(true);
            setPage(1);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeOnly
              ? "bg-[#5397F6] text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Active now
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveOnly(false);
            setPage(1);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            !activeOnly
              ? "bg-[#5397F6] text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All (incl. expired)
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-gray-200/80">
          <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading featured…</p>
        </div>
      ) : isUnauthorized ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Admin access only
          </p>
        </div>
      ) : featured.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <FiStar size={28} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            {activeOnly ? "No active featured listings" : "No featured listings yet"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {activeOnly
              ? "Toggle above to see expired ones, or feature a business to get started."
              : "Feature a business to promote it on the homepage."}
          </p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs"
          >
            <FiPlus size={13} />
            Feature a business
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((biz) => {
            const days = daysUntil(biz.featuredUntil);
            const expired = days !== null && days <= 0;

            return (
              <div
                key={biz._id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col"
              >
                <div className="relative h-32 bg-gray-100">
                  {biz.coverImage ? (
                    <img
                      src={biz.coverImage}
                      alt={biz.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                      expired
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    <FiStar size={10} />
                    {expired ? "Expired" : "Featured"}
                  </span>
                  {biz.featuredPlan && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white capitalize">
                      {biz.featuredPlan}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {biz.businessName}
                  </h3>
                  {biz.categorySlug && (
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {biz.categorySlug}
                    </p>
                  )}

                  <div className="mt-3 space-y-1.5 text-[11px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar size={11} />
                      <span>
                        Since {formatDate(biz.featuredAt)}
                      </span>
                    </div>
                    {biz.featuredUntil ? (
                      <div className="flex items-center gap-1.5">
                        <FiClock size={11} />
                        <span
                          className={
                            expired
                              ? "text-rose-600 font-semibold"
                              : days <= 7
                              ? "text-orange-600 font-semibold"
                              : ""
                          }
                        >
                          {expired
                            ? `Expired ${formatDate(biz.featuredUntil)}`
                            : `${days} day${days === 1 ? "" : "s"} left`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <FiCheck size={11} className="text-emerald-500" />
                        <span>No expiry</span>
                      </div>
                    )}
                  </div>

                  {biz.featuredNotes && (
                    <p className="text-[11px] text-gray-500 mt-3 line-clamp-2 bg-gray-50 px-2 py-1.5 rounded-lg">
                      {biz.featuredNotes}
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `/business/${biz._id}`,
                          "_blank",
                          "noopener"
                        )
                      }
                      className="text-[11px] font-bold text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(biz)}
                      disabled={isToggling}
                      className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-50"
                    >
                      <FiTrash2 size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isUnauthorized && featured.length > 0 && (
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
              onClick={() =>
                setPage((p) => Math.min(pagination.pages, p + 1))
              }
              disabled={page >= pagination.pages || isFetching}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {addModalOpen && (
        <AddFeaturedModal
          onClose={() => setAddModalOpen(false)}
          onNotify={onNotify}
        />
      )}

      {removeTarget && (
        <ConfirmModal
          title="Remove from featured?"
          body={`"${removeTarget.businessName}" will no longer appear in featured carousels. You can re-feature it later.`}
          confirmLabel="Remove"
          confirmTone="danger"
          onCancel={() => !isToggling && setRemoveTarget(null)}
          onConfirm={handleRemove}
          isLoading={isToggling}
        />
      )}
    </div>
  );
};

// ─── Add featured modal ──────────────────────────────────
const AddFeaturedModal = ({ onClose, onNotify }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState("basic");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");

  const { data: resp, isLoading } = useListBusinessesQuery({
    status: "approved",
    limit: 50,
  });

  const approved = resp?.data || [];

  const filtered = useMemo(() => {
    if (!search.trim()) return approved;
    const q = search.trim().toLowerCase();
    return approved.filter(
      (b) =>
        b.businessName?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.location?.city?.toLowerCase().includes(q)
    );
  }, [approved, search]);

  const [toggleFeatured, { isLoading: isSaving }] =
    useAdminToggleFeaturedMutation();

  const handleSave = async () => {
    if (!selected) {
      onNotify?.("Pick a business first", "error");
      return;
    }
    const until = duration
      ? new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000)
      : null;
    try {
      const r = await toggleFeatured({
        id: selected._id,
        featured: true,
        plan,
        until: until ? until.toISOString() : null,
        notes: notes.trim(),
      }).unwrap();
      onNotify?.(
        r?.message || `${selected.businessName} is now featured`,
        "success"
      );
      onClose();
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to feature", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => !isSaving && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Feature a business
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Only approved businesses can be featured.
            </p>
          </div>
          <button
            onClick={() => !isSaving && onClose()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approved businesses…"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              disabled={isSaving}
            />
          </div>

          {/* Business list */}
          <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
            {isLoading ? (
              <div className="p-6 text-center">
                <FiLoader
                  className="animate-spin text-[#5397F6] mx-auto"
                  size={18}
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-gray-500">
                  {approved.length === 0
                    ? "No approved businesses yet."
                    : "No matches."}
                </p>
              </div>
            ) : (
              filtered.map((b) => {
                const isSelected = selected?._id === b._id;
                const alreadyFeatured = b.isFeatured;
                return (
                  <button
                    key={b._id}
                    type="button"
                    onClick={() =>
                      !alreadyFeatured && setSelected(isSelected ? null : b)
                    }
                    disabled={isSaving || alreadyFeatured}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition ${
                      isSelected
                        ? "bg-blue-50"
                        : alreadyFeatured
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {b.coverImage ? (
                        <img
                          src={b.coverImage}
                          alt={b.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#5397F6]">
                          {(b.businessName || "B").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {b.businessName}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {b.location?.city || b.email}
                      </p>
                    </div>
                    {alreadyFeatured && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                        Already featured
                      </span>
                    )}
                    {isSelected && (
                      <FiCheck
                        className="text-[#5397F6] shrink-0"
                        size={14}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Internal notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              disabled={isSaving}
              placeholder="Optional — for admin reference only"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !selected}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold"
          >
            {isSaving ? (
              <>
                <FiLoader size={13} className="animate-spin" />
                Featuring…
              </>
            ) : (
              <>
                <FiStar size={13} />
                Feature business
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm modal ───────────────────────────────────────
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
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-[#5397F6] hover:bg-[#4288ec]";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-4"
      >
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-60 ${toneClass}`}
          >
            {isLoading ? (
              <>
                <FiLoader size={13} className="animate-spin" />
                Working…
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

export default AdminFeaturedView;