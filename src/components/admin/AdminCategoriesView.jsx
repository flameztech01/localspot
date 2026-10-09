// src/components/admin/AdminCategoriesView.jsx
import React from "react";
import { FiLoader, FiTag, FiRefreshCw } from "react-icons/fi";

import { useListCategoriesQuery } from "../../features/discoveryApiSlice";

const AdminCategoriesView = () => {
  const { data, isLoading, isFetching, refetch, error } =
    useListCategoriesQuery();

  const categories = data?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            All active business categories on LocalSpot.
          </p>
        </div>

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
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800">
          Failed to load categories. {error?.data?.message || ""}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
          <FiTag className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            No categories configured
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Categories must be created via the backend or a future admin CRUD
            endpoint.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5397F6] flex items-center justify-center text-lg shrink-0">
                {c.icon || "📍"}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {c.name}
                </h4>
                <p className="text-[11px] text-gray-500 font-mono truncate">
                  {c.slug}
                </p>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  c.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesView;