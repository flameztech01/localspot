// src/components/admin/AdminBusinessManagement.jsx
import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiStar,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiEye,
  FiTrash2,
  FiBriefcase,
  FiRefreshCw,
  FiLoader,
} from "react-icons/fi";

import {
  useListBusinessesQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} from "../../features/businessApiSlice";

const STATUS_TABS = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "unverified", label: "Unverified" },
  { value: "all", label: "All" },
];

const STATUS_META = {
  approved: {
    label: "Approved",
    badge:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    Icon: FiCheckCircle,
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-800 border border-amber-300",
    dot: "bg-amber-500",
    Icon: FiClock,
  },
  rejected: {
    label: "Rejected",
    badge: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
    Icon: FiX,
  },
  unverified: {
    label: "Unverified",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    Icon: FiAlertCircle,
  },
};

// Derive an admin-facing status from the user doc
const deriveStatus = (user) => {
  if (!user) return "unverified";
  if (!user.isVerified) return "unverified";
  if (user.businessVerified) return "approved";
  if (user.businessRejectionReason) return "rejected";
  return "pending";
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

const AdminBusinessManagement = ({ onSelectBusinessApproval, onNotify }) => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: listResp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useListBusinessesQuery({
    status: statusFilter,
    page,
    limit,
  });

  const businesses = listResp?.data || [];
  const pagination = listResp?.pagination || {
    total: 0,
    page,
    limit,
    pages: 1,
  };

  const [approveBusiness, { isLoading: isApproving }] =
    useApproveBusinessMutation();
  const [rejectBusiness, { isLoading: isRejecting }] =
    useRejectBusinessMutation();

  const isMutating = isApproving || isRejecting;
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  // Client-side search filter (backend doesn't support q param on listBusinesses yet)
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return businesses;
    const q = searchTerm.trim().toLowerCase();
    return businesses.filter((b) => {
      const name = (b.businessName || "").toLowerCase();
      const email = (b.email || "").toLowerCase();
      const city = (b.location?.city || "").toLowerCase();
      const category = (b.categorySlug || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        city.includes(q) ||
        category.includes(q)
      );
    });
  }, [businesses, searchTerm]);

  // Selection helpers
  const allSelected =
    filtered.length > 0 && filtered.every((b) => selectedIds.includes(b._id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filtered.map((b) => b._id));
  };
  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Mutations
  const handleApprove = async (id) => {
    try {
      await approveBusiness(id).unwrap();
      onNotify?.("Business approved successfully", "success");
      setOpenMenuId(null);
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to approve business",
        "error"
      );
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      "Why is this business being rejected? The owner will see this message."
    );
    if (!reason || !reason.trim()) return;
    try {
      await rejectBusiness({ id, reason: reason.trim() }).unwrap();
      onNotify?.("Business rejected", "success");
      setOpenMenuId(null);
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to reject business",
        "error"
      );
    }
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    let ok = 0;
    let fail = 0;
    for (const id of selectedIds) {
      try {
        await approveBusiness(id).unwrap();
        ok += 1;
      } catch {
        fail += 1;
      }
    }
    setSelectedIds([]);
    onNotify?.(
      `Approved ${ok} business${ok === 1 ? "" : "es"}${
        fail > 0 ? `, ${fail} failed` : ""
      }`,
      fail > 0 ? "error" : "success"
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Business Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review, approve, and manage all businesses on LocalSpot.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 self-start sm:self-auto"
        >
          <FiRefreshCw
            size={13}
            className={isFetching ? "animate-spin" : ""}
          />
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Status tabs + search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                  setSelectedIds([]);
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

        <div className="relative">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Search by name, email, city, category…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Batch bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-bold text-blue-900">
              {selectedIds.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={isMutating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-60"
            >
              <FiCheck size={14} />
              Approve all
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center">
            <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading businesses…</p>
          </div>
        ) : isUnauthorized ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-rose-600 mb-1">
              Admin access only
            </p>
            <p className="text-xs text-gray-500">
              Your account doesn't have permission to manage businesses.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FiBriefcase className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              No businesses in this view
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try a different filter or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </th>
                  <th className="py-3.5 px-4">Business</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((biz) => {
                  const status = deriveStatus(biz);
                  const meta = STATUS_META[status];
                  const StatusIcon = meta.Icon;
                  const isSelected = selectedIds.includes(biz._id);
                  const thumb =
                    biz.coverImage ||
                    (Array.isArray(biz.images) && biz.images[0]) ||
                    null;
                  const city = biz.location?.city || "";
                  const state = biz.location?.state || "";
                  const loc = [city, state].filter(Boolean).join(", ") || "—";

                  return (
                    <tr
                      key={biz._id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        isSelected ? "bg-blue-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(biz._id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={biz.businessName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-[#5397F6]">
                                {(biz.businessName || "B")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-gray-900 truncate max-w-[200px]">
                              {biz.businessName || "Unnamed"}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 truncate">
                                {biz._id.slice(-8).toUpperCase()}
                              </span>
                              {biz.rating > 0 && (
                                <span className="flex items-center gap-0.5 font-bold text-amber-500">
                                  <FiStar
                                    className="fill-amber-400"
                                    size={11}
                                  />
                                  {Number(biz.rating).toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-medium whitespace-nowrap">
                        {biz.categorySlug ? (
                          biz.categorySlug
                            .split("-")
                            .map(
                              (w) => w.charAt(0).toUpperCase() + w.slice(1)
                            )
                            .join(" ")
                        ) : (
                          <span className="text-gray-400 italic">
                            Uncategorized
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FiMapPin
                            className="text-gray-400 shrink-0"
                            size={13}
                          />
                          <span className="truncate max-w-[160px]">{loc}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badge}`}
                        >
                          <StatusIcon size={11} />
                          {meta.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                        <div className="truncate max-w-[180px]">
                          {biz.email || "—"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {biz.phone || ""}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(biz.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1.5">
                          {status === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(biz._id)}
                                disabled={isMutating}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-60"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectBusinessApproval?.(biz._id)
                                }
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold"
                              >
                                View
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                onSelectBusinessApproval?.(biz._id)
                              }
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold"
                            >
                              View
                            </button>
                          )}

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === biz._id ? null : biz._id
                                )
                              }
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              aria-label="More options"
                            >
                              <FiMoreVertical size={15} />
                            </button>

                            {openMenuId === biz._id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onSelectBusinessApproval?.(biz._id);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiEye size={13} className="text-gray-400" />
                                  Full details
                                </button>
                                {!biz.businessVerified && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleReject(biz._id);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <FiX size={13} />
                                    Reject
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isUnauthorized && filtered.length > 0 && (
          <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-gray-600">
            <div>
              Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
              total
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
      </div>
    </div>
  );
};

export default AdminBusinessManagement;