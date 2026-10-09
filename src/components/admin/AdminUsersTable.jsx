// src/components/admin/AdminUsersTable.jsx
import React, { useState } from "react";
import {
  FiSearch,
  FiShield,
  FiRefreshCw,
  FiLoader,
  FiMoreVertical,
  FiKey,
  FiTrash2,
  FiUserX,
  FiUserCheck,
  FiAlertCircle,
} from "react-icons/fi";

import {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
  useAdminSendPasswordResetMutation,
} from "../../features/adminApiSlice";

const ROLE_FILTERS = [
  { value: "", label: "All roles" },
  { value: "business", label: "Business" },
  { value: "admin", label: "Admin" },
];

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "verified", label: "Email verified" },
  { value: "unverified", label: "Email unverified" },
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

const AdminUsersTable = ({ onNotify }) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cascade, setCascade] = useState(false);

  const {
    data: resp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useListUsersQuery({ role, status, q, page, limit });

  const users = resp?.data || [];
  const pagination = resp?.pagination || {
    total: 0,
    page,
    limit,
    pages: 1,
  };
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  const [updateRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [toggleActive, { isLoading: isToggling }] =
    useToggleUserActiveMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [sendReset, { isLoading: isSendingReset }] =
    useAdminSendPasswordResetMutation();

  const isMutating =
    isUpdatingRole || isToggling || isDeleting || isSendingReset;

  const handleRoleChange = async (userId, newRole) => {
    try {
      const r = await updateRole({ id: userId, role: newRole }).unwrap();
      onNotify?.(r?.message || "Role updated", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update role", "error");
    }
  };

  const handleToggleActive = async (user) => {
    setOpenMenuId(null);
    const label = user.businessName || user.fullName || user.email;
    if (
      !window.confirm(
        user.isActive ? `Suspend ${label}?` : `Reactivate ${label}?`
      )
    )
      return;
    try {
      const r = await toggleActive(user._id).unwrap();
      onNotify?.(r?.message || "Status updated", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    }
  };

  const handleSendReset = async (userId) => {
    setOpenMenuId(null);
    try {
      const r = await sendReset(userId).unwrap();
      onNotify?.(r?.message || "Password reset sent", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to send reset", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const r = await deleteUser({
        id: deleteTarget._id,
        cascade,
      }).unwrap();
      onNotify?.(r?.message || "User deleted", "success");
      setDeleteTarget(null);
      setCascade(false);
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
            Users & Merchants
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage platform roles, suspend accounts, and control access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 self-start sm:self-auto"
        >
          <FiRefreshCw
            size={13}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <div className="relative">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, business, email or phone…"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          >
            {ROLE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center">
            <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading users…</p>
          </div>
        ) : isUnauthorized ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-rose-600 mb-1">
              Admin access only
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <FiSearch className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              No users match your filters
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try a different search or clear the filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {users.map((u) => {
                  const displayName =
                    u.businessName || u.fullName || u.email;
                  const isAdmin = u.role === "admin";

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {initials(displayName)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-gray-900 truncate max-w-[220px]">
                              {displayName}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono truncate">
                              {u._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isAdmin && <FiShield size={10} />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="truncate max-w-[220px]">
                          {u.email}
                        </div>
                        {u.phone && (
                          <div className="text-[10px] text-gray-400">
                            {u.phone}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {u.isActive ? "Active" : "Suspended"}
                          </span>
                          {!u.isVerified && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            disabled={isMutating}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                          >
                            <option value="business">Business</option>
                            <option value="admin">Admin</option>
                          </select>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === u._id ? null : u._id
                                )
                              }
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              aria-label="More options"
                            >
                              <FiMoreVertical size={15} />
                            </button>

                            {openMenuId === u._id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
                                <button
                                  type="button"
                                  onClick={() => handleSendReset(u._id)}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FiKey size={13} className="text-gray-400" />
                                  Send password reset
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(u)}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  {u.isActive ? (
                                    <>
                                      <FiUserX
                                        size={13}
                                        className="text-orange-500"
                                      />
                                      Suspend account
                                    </>
                                  ) : (
                                    <>
                                      <FiUserCheck
                                        size={13}
                                        className="text-emerald-500"
                                      />
                                      Reactivate account
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteTarget(u);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <FiTrash2 size={13} />
                                  Delete user
                                </button>
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
        {!isLoading && !isUnauthorized && users.length > 0 && (
          <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-gray-600">
            <div>
              Page {pagination.page} of {pagination.pages} ·{" "}
              {pagination.total} total
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

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <FiAlertCircle className="text-rose-500" size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Delete user?
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  <span className="font-semibold text-gray-800">
                    {deleteTarget.businessName ||
                      deleteTarget.fullName ||
                      deleteTarget.email}
                  </span>{" "}
                  will be permanently removed. This cannot be undone.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 cursor-pointer">
              <input
                type="checkbox"
                checked={cascade}
                onChange={(e) => setCascade(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-[11px] text-rose-900 leading-relaxed">
                <span className="font-bold block">
                  Also delete related data
                </span>
                Removes their reviews, promotions, and advertisements from the
                platform.
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold"
              >
                {isDeleting ? (
                  <>
                    <FiLoader size={13} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete user"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTable;