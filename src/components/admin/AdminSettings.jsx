// src/components/admin/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import {
  FiTag,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import {
  useListAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../features/adminApiSlice";

const EMOJI_PRESETS = [
  "🏨", "🍽️", "🍲", "🍸", "☕", "🎉",
  "🛍️", "💅", "🛠️", "🌳", "🏥", "🏋️",
  "💳", "🚗", "🎬", "📍",
];

const inputClass =
  "w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminSettings = ({ onNotify }) => {
  const {
    data: resp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useListAllCategoriesQuery();

  const categories = resp?.data || [];

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);

  const [newCat, setNewCat] = useState({
    name: "",
    icon: "📍",
    description: "",
  });

  const isMutating = isCreating || isUpdating || isDeleting;
  const isUnauthorized = error?.status === 401 || error?.status === 403;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) {
      onNotify?.("Category name is required", "error");
      return;
    }
    try {
      const r = await createCategory({
        name: newCat.name.trim(),
        slug: slugify(newCat.name),
        icon: newCat.icon,
        description: newCat.description.trim(),
      }).unwrap();
      onNotify?.(r?.message || "Category created", "success");
      setNewCat({ name: "", icon: "📍", description: "" });
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to create category",
        "error"
      );
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const r = await updateCategory({
        id: cat._id,
        isActive: !cat.isActive,
      }).unwrap();
      onNotify?.(r?.message || "Category updated", "success");
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    }
  };

  const handleEditSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      onNotify?.("Category name is required", "error");
      return;
    }
    try {
      const r = await updateCategory({
        id: editing._id,
        name: editing.name.trim(),
        slug: slugify(editing.name),
        icon: editing.icon,
        description: editing.description || "",
      }).unwrap();
      onNotify?.(r?.message || "Category updated", "success");
      setEditing(null);
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const r = await deleteCategory({
        id: deleteTarget._id,
        force: forceDelete,
      }).unwrap();
      onNotify?.(r?.message || "Category deleted", "success");
      setDeleteTarget(null);
      setForceDelete(false);
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to delete category",
        "error"
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage business categories that power discovery and search.
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

      {isUnauthorized && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800">
          Admin access only. You don't have permission to manage categories.
        </div>
      )}

      {/* Category manager */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTag className="text-[#5397F6]" size={16} />
            <h3 className="text-sm font-bold text-gray-900">
              Active Categories
            </h3>
          </div>
          <span className="text-xs font-bold text-gray-400">
            {categories.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center">
            <FiTag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">
              No categories yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add your first one below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isEditing = editing?._id === cat._id;
              return (
                <div
                  key={cat._id}
                  className="relative p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editing.icon}
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              icon: e.target.value,
                            }))
                          }
                          maxLength={2}
                          className="w-12 text-center text-base px-1 py-1 rounded-lg border border-gray-200"
                        />
                        <input
                          type="text"
                          value={editing.name}
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          className="flex-1 px-2 py-1 text-xs font-bold rounded-lg border border-gray-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={editing.description || ""}
                        onChange={(e) =>
                          setEditing((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description (optional)"
                        className="w-full px-2 py-1 text-[11px] rounded-lg border border-gray-200"
                      />
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200"
                          aria-label="Cancel"
                        >
                          <FiX size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={handleEditSave}
                          disabled={isUpdating}
                          className="p-1.5 rounded-lg text-white bg-[#5397F6] hover:bg-[#4288ec] disabled:opacity-60"
                          aria-label="Save"
                        >
                          {isUpdating ? (
                            <FiLoader size={13} className="animate-spin" />
                          ) : (
                            <FiCheck size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-xl shrink-0">
                          {cat.icon || "📍"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">
                            {cat.slug}
                          </p>
                          {cat.businessCount > 0 && (
                            <p className="text-[10px] text-gray-500 mt-1">
                              {cat.businessCount} business
                              {cat.businessCount === 1 ? "" : "es"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          disabled={isMutating}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg disabled:opacity-60 ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(cat)}
                          disabled={isMutating}
                          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-60"
                          aria-label="Edit"
                        >
                          <FiEdit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
                          disabled={isMutating}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add category */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FiPlus className="text-[#5397F6]" size={16} />
          Add a new category
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {EMOJI_PRESETS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() =>
                  setNewCat((p) => ({ ...p, icon: e }))
                }
                className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition border ${
                  newCat.icon === e
                    ? "bg-blue-50 border-[#5397F6]"
                    : "bg-gray-50 border-gray-200 hover:border-blue-200"
                }`}
                aria-label={`Pick icon ${e}`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newCat.name}
              onChange={(e) =>
                setNewCat((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Category name (e.g. Nightclubs)"
              className={inputClass}
              disabled={isCreating}
            />
            <input
              type="text"
              value={newCat.description}
              onChange={(e) =>
                setNewCat((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              placeholder="Short description (optional)"
              className={inputClass}
              disabled={isCreating}
            />
          </div>

          {newCat.name.trim() && (
            <p className="text-[10px] text-gray-400">
              Slug:{" "}
              <span className="font-mono text-gray-600">
                {slugify(newCat.name)}
              </span>
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || !newCat.name.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <FiLoader size={13} className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <FiPlus size={13} />
                  Add category
                </>
              )}
            </button>
          </div>
        </form>
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
                  Delete category?
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  <span className="font-semibold text-gray-800">
                    {deleteTarget.name}
                  </span>{" "}
                  will be permanently removed from the platform.
                </p>
              </div>
            </div>

            {deleteTarget.businessCount > 0 && (
              <label className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceDelete}
                  onChange={(e) => setForceDelete(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold block">
                    Force delete anyway
                  </span>
                  {deleteTarget.businessCount} business
                  {deleteTarget.businessCount === 1 ? "" : "es"} currently use
                  this category. They'll keep their `categorySlug` but the
                  category will no longer exist.
                </span>
              </label>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setForceDelete(false);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={
                  isDeleting ||
                  (deleteTarget.businessCount > 0 && !forceDelete)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold"
              >
                {isDeleting ? (
                  <>
                    <FiLoader size={13} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;