// src/pages/business/BusinessAds.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Plus,
  Image as ImageIcon,
  Eye,
  MousePointerClick,
  MoreVertical,
  BarChart3,
  Pencil,
  Trash2,
  Send,
  Pause,
  Play,
  X,
  Loader,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Megaphone,
  Upload,
} from "lucide-react";

import {
  useListMyAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useUpdateMyAdvertisementMutation,
  useDeleteMyAdvertisementMutation,
  useSubmitMyAdvertisementMutation,
  usePauseMyAdvertisementMutation,
  useResumeMyAdvertisementMutation,
  useGetMyAdvertisementPerformanceQuery,
  useListAdvertisementTypesQuery,
  useListAdvertisementSlotsQuery,
} from "../../features/adsApiSlice";
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
  {
    id: "expired",
    label: "Expired/Disabled",
    statuses: ["expired", "disabled", "paused"],
  },
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

const formatBudget = (n) => {
  const v = Number(n || 0);
  if (!v) return "$---";
  return `$${v.toLocaleString()}`;
};

const formatNumber = (n) => Number(n || 0).toLocaleString();

// ─── Main component ────────────────────────────────────────
const BusinessAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("active");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [performanceTarget, setPerformanceTarget] = useState(null);
  const [formModal, setFormModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', ad }
  const [loggingOut, setLoggingOut] = useState(false);

  // ─── Queries ─────────────────────────────────────────────
  const {
    data: adsResp,
    isLoading,
    error,
    refetch,
  } = useListMyAdvertisementsQuery();

  const advertisements = adsResp?.data || [];
  const isUnauthorized = error?.status === 401;

  const [deleteAd, { isLoading: isDeleting }] = useDeleteMyAdvertisementMutation();
  const [submitAd, { isLoading: isSubmitting }] = useSubmitMyAdvertisementMutation();
  const [pauseAd, { isLoading: isPausing }] = usePauseMyAdvertisementMutation();
  const [resumeAd, { isLoading: isResuming }] = useResumeMyAdvertisementMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating = isDeleting || isSubmitting || isPausing || isResuming;

  // ─── Group by status ─────────────────────────────────────
  const grouped = useMemo(() => {
    const map = {};
    TABS.forEach((tab) => {
      map[tab.id] = advertisements.filter((a) => tab.statuses.includes(a.status));
    });
    return map;
  }, [advertisements]);

  const visibleAds = grouped[activeTab] || [];

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
      const r = await submitAd(id).unwrap();
      showToast(r?.message || "Submitted for review", "success");
    } catch (err) {
      showToast(err?.data?.message || "Failed to submit", "error");
    }
  };

  const handlePause = async (id) => {
    setOpenMenuId(null);
    try {
      const r = await pauseAd(id).unwrap();
      showToast(r?.message || "Ad paused", "success");
    } catch (err) {
      showToast(err?.data?.message || "Failed to pause", "error");
    }
  };

  const handleResume = async (id) => {
    setOpenMenuId(null);
    try {
      const r = await resumeAd(id).unwrap();
      showToast(r?.message || "Ad resumed", "success");
    } catch (err) {
      showToast(err?.data?.message || "Failed to resume", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAd(deleteTarget._id).unwrap();
      showToast("Advertisement deleted", "success");
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
              Ad campaigns
            </h1>
            <button
              type="button"
              onClick={() => setFormModal({ mode: "create" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-indigo-500 hover:from-blue-700 hover:to-indigo-600 rounded-lg transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Start a new advert
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
                Failed to load campaigns
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
          {!isLoading && !error && visibleAds.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Megaphone className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {activeTab === "active"
                  ? "No active campaigns"
                  : `No ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}`}
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                {activeTab === "active"
                  ? "Start a new advert to boost your business visibility."
                  : "Nothing to see here — try a different tab."}
              </p>
              {activeTab === "active" && (
                <button
                  type="button"
                  onClick={() => setFormModal({ mode: "create" })}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                >
                  <Plus className="h-4 w-4" />
                  Start a new advert
                </button>
              )}
            </div>
          )}

          {/* ─── Card list ─── */}
          {!isLoading && !error && visibleAds.length > 0 && (
            <div className="space-y-4">
              {visibleAds.map((ad) => (
                <AdCard
                  key={ad._id}
                  ad={ad}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onViewStats={() => setPerformanceTarget(ad)}
                  onEdit={() => setFormModal({ mode: "edit", ad })}
                  onDelete={() => {
                    setOpenMenuId(null);
                    setDeleteTarget(ad);
                  }}
                  onSubmit={() => handleSubmit(ad._id)}
                  onPause={() => handlePause(ad._id)}
                  onResume={() => handleResume(ad._id)}
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
                  Delete campaign?
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

      {/* ─── Performance modal ─── */}
      {performanceTarget && (
        <PerformanceModal
          ad={performanceTarget}
          onClose={() => setPerformanceTarget(null)}
        />
      )}

      {/* ─── Create/Edit modal ─── */}
      {formModal && (
        <AdFormModal
          mode={formModal.mode}
          ad={formModal.ad || null}
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
// Ad card
// ──────────────────────────────────────────────────────────
const AdCard = ({
  ad,
  openMenuId,
  setOpenMenuId,
  onViewStats,
  onEdit,
  onDelete,
  onSubmit,
  onPause,
  onResume,
  isMutating,
}) => {
  const typeName = ad.type?.name || "Campaign";
  const canEdit = ["draft", "rejected", "paused"].includes(ad.status);
  const canSubmit = ["draft", "rejected"].includes(ad.status);
  const canPause = ad.status === "approved";
  const canResume = ad.status === "paused";
  const canDelete = ad.status !== "approved";

  return (
    <article className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition relative">
      <div className="flex items-stretch">
        {/* Thumbnail */}
        <div className="w-28 sm:w-36 lg:w-40 bg-gray-100 flex-shrink-0 relative">
          {ad.image ? (
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[120px]">
              <ImageIcon className="h-7 w-7 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 lg:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold mb-1.5">
                {typeName}
              </span>

              <p className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                {formatBudget(ad.budget)}
              </p>

              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {ad.title || ad.link || "Untitled campaign"}
              </p>

              <p className="text-xs font-semibold text-gray-700 mt-1 tabular-nums">
                {formatNumber(ad.impressions)} imp
              </p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                Created: {formatDate(ad.createdAt)}
              </span>

              <div className="flex items-center gap-1.5">
                {ad.status === "draft" ? (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isMutating}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    Finish & publish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onViewStats}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition whitespace-nowrap"
                  >
                    Statistics
                  </button>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(openMenuId === ad._id ? null : ad._id)
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openMenuId === ad._id && (
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

                        {canPause && (
                          <button
                            type="button"
                            onClick={onPause}
                            disabled={isMutating}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Pause className="h-3.5 w-3.5 text-orange-500" />
                            Pause
                          </button>
                        )}

                        {canResume && (
                          <button
                            type="button"
                            onClick={onResume}
                            disabled={isMutating}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Play className="h-3.5 w-3.5 text-emerald-500" />
                            Resume
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onViewStats();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <BarChart3 className="h-3.5 w-3.5 text-gray-400" />
                          View stats
                        </button>

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

          {/* Bottom stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(ad.impressions)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MousePointerClick className="h-3.5 w-3.5" />
              {formatNumber(ad.clicks)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {formatNumber(ad.conversions)}
            </span>
            <StatusPill status={ad.status} />
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
      paused: {
        label: "Paused",
        cls: "text-orange-700 bg-orange-50",
        Icon: Pause,
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
// Ad form modal (create + edit)
// ──────────────────────────────────────────────────────────
const AdFormModal = ({ mode, ad, onClose, onSuccess, onNotify }) => {
  const isEdit = mode === "edit" && ad;

  const { data: typesResp } = useListAdvertisementTypesQuery();
  const { data: slotsResp } = useListAdvertisementSlotsQuery();

  const types = typesResp?.data || [];
  const slots = slotsResp?.data || [];

  const [createAd, { isLoading: isCreating }] =
    useCreateAdvertisementMutation();
  const [updateAd, { isLoading: isUpdating }] =
    useUpdateMyAdvertisementMutation();

  const isSaving = isCreating || isUpdating;

  const [form, setForm] = useState({
    type: ad?.type?._id || ad?.type || "",
    slot: ad?.slot?._id || ad?.slot || "",
    title: ad?.title || "",
    description: ad?.description || "",
    link: ad?.link || "",
    startDate: toInputDate(ad?.startDate),
    endDate: toInputDate(ad?.endDate),
    budget: ad?.budget != null ? String(ad.budget) : "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(ad?.image || null);
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

    if (!form.type) {
      onNotify?.("Please choose an ad type", "error");
      return;
    }
    if (!form.slot) {
      onNotify?.("Please choose a slot", "error");
      return;
    }
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
    fd.append("type", form.type);
    fd.append("slot", form.slot);
    fd.append("title", form.title.trim());
    if (form.description.trim())
      fd.append("description", form.description.trim());
    if (form.link.trim()) fd.append("link", form.link.trim());
    fd.append("startDate", form.startDate);
    fd.append("endDate", form.endDate);
    if (form.budget !== "") fd.append("budget", String(form.budget));
    if (imageFile) fd.append("image", imageFile);

    try {
      const r = isEdit
        ? await updateAd({ id: ad._id, ...Object.fromEntries(fd) }).unwrap()
        : await createAd(fd).unwrap();

      onNotify?.(
        r?.message || (isEdit ? "Ad updated" : "Ad created"),
        "success",
      );
      onSuccess?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message || (isEdit ? "Failed to update" : "Failed to create"),
        "error",
      );
    }
  };

  const selectedSlot = slots.find((s) => s._id === form.slot);

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
              {isEdit ? "Edit campaign" : "New campaign"}
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
              Creative image
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Creative"
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
                className="w-full aspect-[2/1] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#3B82F6] bg-gray-50 flex flex-col items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">
                  Click to upload creative
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

          {/* Type + Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Ad type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => setField("type", e.target.value)}
                disabled={isSaving || types.length === 0}
                className={inputClass}
              >
                <option value="">Select a type</option>
                {types.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                    {t.category ? ` (${t.category})` : ""}
                  </option>
                ))}
              </select>
              {types.length === 0 && (
                <p className="text-[10px] text-orange-600 mt-1">
                  No types available
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Slot <span className="text-red-500">*</span>
              </label>
              <select
                value={form.slot}
                onChange={(e) => setField("slot", e.target.value)}
                disabled={isSaving || slots.length === 0}
                className={inputClass}
              >
                <option value="">Select a slot</option>
                {slots.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                    {s.position ? ` — ${s.position}` : ""}
                  </option>
                ))}
              </select>
              {selectedSlot?.dimensions?.width && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Recommended: {selectedSlot.dimensions.width}×
                  {selectedSlot.dimensions.height}
                </p>
              )}
            </div>
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
              placeholder="e.g. Grand opening — 30% off"
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
              placeholder="Short details about your campaign..."
              maxLength={500}
              disabled={isSaving}
              className={`${inputClass} resize-none`}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {form.description.length}/500
            </p>
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Destination link
            </label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setField("link", e.target.value)}
              placeholder="https://your-business.com/offer"
              disabled={isSaving}
              className={inputClass}
            />
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

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Budget
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.budget}
              onChange={(e) => setField("budget", e.target.value)}
              placeholder="0.00"
              disabled={isSaving}
              className={inputClass}
            />
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
                {isEdit ? "Save changes" : "Create campaign"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Performance modal
// ──────────────────────────────────────────────────────────
const PerformanceModal = ({ ad, onClose }) => {
  const [range, setRange] = useState("30d");

  const { from, to } = useMemo(() => {
    const now = new Date();
    const to = now.toISOString();
    let from;
    switch (range) {
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "30d":
      default:
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
    }
    return { from, to };
  }, [range]);

  const { data, isLoading, error } = useGetMyAdvertisementPerformanceQuery({
    id: ad._id,
    from,
    to,
  });

  const perf = data?.data;
  const totals = perf?.totals || {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900">
              Campaign performance
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{ad.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex gap-1.5 mb-4">
            {[
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days" },
              { value: "90d", label: "90 days" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                  range === r.value
                    ? "bg-[#3B82F6] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {error?.data?.message || "Failed to load stats"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <KpiTile
                label="Impressions"
                value={formatNumber(totals.impressions)}
                icon={Eye}
              />
              <KpiTile
                label="Clicks"
                value={formatNumber(totals.clicks)}
                icon={MousePointerClick}
              />
              <KpiTile
                label="CTR"
                value={`${totals.ctr || 0}%`}
                icon={BarChart3}
                accent
              />
              <KpiTile
                label="Conversions"
                value={formatNumber(totals.conversions)}
                icon={CheckCircle2}
              />
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const KpiTile = ({ label, value, icon: Icon, accent = false }) => (
  <div
    className={`rounded-xl border p-3.5 ${
      accent ? "bg-blue-50 border-blue-100" : "bg-white border-gray-200"
    }`}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <Icon
        className={`h-3.5 w-3.5 ${accent ? "text-[#3B82F6]" : "text-gray-400"}`}
      />
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${
          accent ? "text-[#3B82F6]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
    <p
      className={`text-xl font-bold tabular-nums ${
        accent ? "text-[#3B82F6]" : "text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default BusinessAds;