// src/pages/business/BusinessAds.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  BarChart3,
  Plus,
  Search,
  Edit3,
  Trash2,
  Send,
  X,
  Loader2,
  Save,
  Image as ImageIcon,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MousePointerClick,
  ArrowLeft,
  LogOut,
  Pause,
  Play,
  TrendingUp,
  DollarSign,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  useListMyAdvertisementsQuery,
  useGetMyAdvertisementQuery,
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
const ACCENT = "#3B82F6";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paused", label: "Paused" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
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
    case "paused":
      return {
        color:
          "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
        Icon: Pause,
      };
    case "rejected":
      return {
        color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        Icon: XCircle,
      };
    case "disabled":
    case "expired":
      return {
        color: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
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

const formatCurrency = (v) => {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString()}`;
};

// ─── Component ─────────────────────────────────────────────
const BusinessAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [performanceAd, setPerformanceAd] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [pauseTarget, setPauseTarget] = useState(null);
  const [resumeTarget, setResumeTarget] = useState(null);

  const [loggingOut, setLoggingOut] = useState(false);

  // ─── Queries ──────────────────────────────────────────────
  const {
    data: adsResp,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useListMyAdvertisementsQuery();

  const advertisements = adsResp?.data || [];

  const { data: typesResp, isLoading: typesLoading } =
    useListAdvertisementTypesQuery();
  const { data: slotsResp, isLoading: slotsLoading } =
    useListAdvertisementSlotsQuery();

  const types = typesResp?.data || [];
  const slots = slotsResp?.data || [];

  const [createAd, { isLoading: isCreating }] =
    useCreateAdvertisementMutation();
  const [updateAd, { isLoading: isUpdating }] =
    useUpdateMyAdvertisementMutation();
  const [deleteAd, { isLoading: isDeleting }] =
    useDeleteMyAdvertisementMutation();
  const [submitAd, { isLoading: isSubmitting }] =
    useSubmitMyAdvertisementMutation();
  const [pauseAd, { isLoading: isPausing }] = usePauseMyAdvertisementMutation();
  const [resumeAd, { isLoading: isResuming }] =
    useResumeMyAdvertisementMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const isMutating =
    isCreating ||
    isUpdating ||
    isDeleting ||
    isSubmitting ||
    isPausing ||
    isResuming;

  const isUnauthorized = error?.status === 401;

  // ─── Logout ───────────────────────────────────────────────
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutBusinessAccount()
        .unwrap()
        .catch(() => {});
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
      all: advertisements.length,
      draft: 0,
      pending: 0,
      approved: 0,
      paused: 0,
      rejected: 0,
      disabled: 0,
      expired: 0,
    };
    advertisements.forEach((a) => {
      if (c[a.status] !== undefined) c[a.status] += 1;
    });
    return c;
  }, [advertisements]);

  const totals = useMemo(() => {
    return advertisements.reduce(
      (acc, a) => {
        acc.impressions += Number(a.impressions || 0);
        acc.clicks += Number(a.clicks || 0);
        acc.budget += Number(a.budget || 0);
        return acc;
      },
      { impressions: 0, clicks: 0, budget: 0 },
    );
  }, [advertisements]);

  const overallCtr =
    totals.impressions > 0
      ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
      : 0;

  const filtered = useMemo(() => {
    let list = advertisements;
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.slot?.name?.toLowerCase().includes(q) ||
          a.type?.name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [advertisements, statusFilter, searchQuery]);

  // ─── Handlers ─────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingAd(null);
    setShowFormModal(true);
  };

  const openEditModal = (ad) => {
    if (!["draft", "rejected", "paused"].includes(ad.status)) {
      showToast("Only draft, paused or rejected ads can be edited", "error");
      return;
    }
    setEditingAd(ad);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (isMutating) return;
    setShowFormModal(false);
    setEditingAd(null);
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

  const handleSubmit = async () => {
    if (!submitTarget) return;
    try {
      const result = await submitAd(submitTarget._id).unwrap();
      showToast(result?.message || "Submitted for review", "success");
      setSubmitTarget(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to submit", "error");
    }
  };

  const handlePause = async () => {
    if (!pauseTarget) return;
    try {
      const result = await pauseAd(pauseTarget._id).unwrap();
      showToast(result?.message || "Advertisement paused", "success");
      setPauseTarget(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to pause", "error");
    }
  };

  const handleResume = async () => {
    if (!resumeTarget) return;
    try {
      const result = await resumeAd(resumeTarget._id).unwrap();
      showToast(result?.message || "Advertisement resumed", "success");
      setResumeTarget(null);
    } catch (err) {
      showToast(err?.data?.message || "Failed to resume", "error");
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
              Advertisements
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
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
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
                Advertisements
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Create targeted ad placements and submit them for review.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              disabled={typesLoading || slotsLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition shadow-sm hover:shadow flex-shrink-0 self-start sm:self-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              New advertisement
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard
              label="Total Ads"
              value={counts.all}
              icon={BarChart3}
              tone="blue"
            />
            <StatCard
              label="Impressions"
              value={totals.impressions.toLocaleString()}
              icon={Eye}
              tone="default"
            />
            <StatCard
              label="Clicks"
              value={totals.clicks.toLocaleString()}
              icon={MousePointerClick}
              tone="default"
            />
            <StatCard
              label="CTR"
              value={`${overallCtr}%`}
              icon={TrendingUp}
              tone="green"
            />
          </div>

          {/* Filter chips + search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 sm:p-4 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, slot, or type"
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
                      {f.value !== "all" && count > 0 && (
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
                <BarChart3 className="h-8 w-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {advertisements.length === 0
                  ? "No advertisements yet"
                  : "No advertisements match your filters"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
                {advertisements.length === 0
                  ? "Create your first advertisement to start getting visibility on LocalSpot."
                  : "Try adjusting the search or filters above."}
              </p>
              {advertisements.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  disabled={typesLoading || slotsLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  Create your first ad
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ad) => (
                <AdvertisementCard
                  key={ad._id}
                  ad={ad}
                  onEdit={() => openEditModal(ad)}
                  onDelete={() => setDeleteTarget(ad)}
                  onSubmit={() => setSubmitTarget(ad)}
                  onPause={() => setPauseTarget(ad)}
                  onResume={() => setResumeTarget(ad)}
                  onViewPerformance={() => setPerformanceAd(ad)}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}

          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} LocalSpot Systems Ltd. — Business
              Account Center
            </p>
          </footer>
        </div>
      </div>

      {/* Create / Edit modal */}
      {showFormModal && (
        <AdvertisementFormModal
          ad={editingAd}
          types={types}
          slots={slots}
          onClose={closeFormModal}
          onSave={async (formData, id) => {
            try {
              const result = id
                ? await updateAd({ id, ...formData }).unwrap()
                : await createAd(formData).unwrap();
              showToast(
                result?.message ||
                  (id ? "Advertisement updated" : "Advertisement created"),
                "success",
              );
              closeFormModal();
            } catch (err) {
              showToast(
                err?.data?.message ||
                  (id ? "Failed to update" : "Failed to create"),
                "error",
              );
              throw err;
            }
          }}
          isSaving={isCreating || isUpdating}
        />
      )}

      {/* Performance modal */}
      {performanceAd && (
        <PerformanceModal
          ad={performanceAd}
          onClose={() => setPerformanceAd(null)}
        />
      )}

      {/* Confirm modals */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete advertisement?"
          body={`"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          confirmTone="danger"
          Icon={Trash2}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}

      {submitTarget && (
        <ConfirmModal
          title="Submit for review?"
          body={`"${submitTarget.title}" will be sent to our team for approval. You won't be able to edit it while it's under review.`}
          confirmLabel="Submit"
          confirmTone="primary"
          Icon={Send}
          onCancel={() => setSubmitTarget(null)}
          onConfirm={handleSubmit}
          isLoading={isSubmitting}
        />
      )}

      {pauseTarget && (
        <ConfirmModal
          title="Pause advertisement?"
          body={`"${pauseTarget.title}" will stop showing to users. You can resume it anytime.`}
          confirmLabel="Pause"
          confirmTone="warning"
          Icon={Pause}
          onCancel={() => setPauseTarget(null)}
          onConfirm={handlePause}
          isLoading={isPausing}
        />
      )}

      {resumeTarget && (
        <ConfirmModal
          title="Resume advertisement?"
          body={`"${resumeTarget.title}" will start showing to users again.`}
          confirmLabel="Resume"
          confirmTone="primary"
          Icon={Play}
          onCancel={() => setResumeTarget(null)}
          onConfirm={handleResume}
          isLoading={isResuming}
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
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 truncate">
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

// ─── Advertisement card ────────────────────────────────────
const AdvertisementCard = ({
  ad,
  onEdit,
  onDelete,
  onSubmit,
  onPause,
  onResume,
  onViewPerformance,
  isMutating,
}) => {
  const { color, Icon } = statusStyle(ad.status);

  const canEdit = ["draft", "rejected", "paused"].includes(ad.status);
  const canSubmit = ["draft", "rejected"].includes(ad.status);
  const canPause = ad.status === "approved";
  const canResume = ad.status === "paused";
  const canDelete = ad.status !== "approved";

  const ctr =
    ad.impressions > 0
      ? Number(((ad.clicks / ad.impressions) * 100).toFixed(2))
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.title}
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
          {ad.status || "draft"}
        </span>
        {ad.slot?.name && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white truncate max-w-[120px]">
            {ad.slot.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col min-w-0">
        <h3
          className="text-sm font-semibold text-gray-900 dark:text-white truncate"
          title={ad.title}
        >
          {ad.title}
        </h3>

        {ad.type?.name && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {ad.type.name}
            {ad.type.category ? ` · ${ad.type.category}` : ""}
          </p>
        )}

        {ad.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {ad.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 truncate">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {formatDate(ad.startDate)} → {formatDate(ad.endDate)}
          </span>
        </div>

        {ad.budget > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <DollarSign className="h-3 w-3 text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
              {formatCurrency(ad.budget)} budget
            </span>
          </div>
        )}

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
              Views
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {Number(ad.impressions || 0).toLocaleString()}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
              Clicks
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {Number(ad.clicks || 0).toLocaleString()}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
              CTR
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {ctr}%
            </p>
          </div>
        </div>

        {ad.status === "rejected" && ad.rejectionReason && (
          <div className="mt-3 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded-lg">
            <span className="font-semibold">Rejected:</span>{" "}
            <span className="break-words">{ad.rejectionReason}</span>
          </div>
        )}

        {ad.status === "paused" && ad.pauseReason && (
          <div className="mt-3 text-[11px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1.5 rounded-lg">
            <span className="font-semibold">Paused:</span>{" "}
            <span className="break-words">{ad.pauseReason}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onViewPerformance}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
          >
            <TrendingUp className="h-3 w-3" />
            Stats
          </button>

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
              disabled={isMutating || !ad.image}
              title={
                !ad.image
                  ? "Add an image before submitting"
                  : "Submit for review"
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-3 w-3" />
              Submit
            </button>
          )}

          {canPause && (
            <button
              type="button"
              onClick={onPause}
              disabled={isMutating}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition disabled:opacity-50"
            >
              <Pause className="h-3 w-3" />
              Pause
            </button>
          )}

          {canResume && (
            <button
              type="button"
              onClick={onResume}
              disabled={isMutating}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              Resume
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
const AdvertisementFormModal = ({
  ad,
  types,
  slots,
  onClose,
  onSave,
  isSaving,
}) => {
  const { showToast } = useToast();
  const isEdit = !!ad;

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

    if (!form.type) {
      showToast("Please choose an advertisement type", "error");
      return;
    }
    if (!form.slot) {
      showToast("Please choose a slot", "error");
      return;
    }
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
      await onSave(fd, ad?._id);
    } catch (_) {
      // parent already showed toast
    }
  };

  const selectedSlot = slots.find((s) => s._id === form.slot);

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
              {isEdit ? "Edit advertisement" : "New advertisement"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {isEdit
                ? "Update the details and re-submit for review."
                : "Choose a placement and fill in the creative details."}
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
              Creative image
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Ad creative"
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
                className="w-full aspect-[2/1] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#3B82F6] dark:hover:border-[#3B82F6] bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Click to upload a creative
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
                Change creative
              </button>
            )}
          </div>

          {/* Type + slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Advertisement type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
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
                <p className="text-[10px] text-orange-500 mt-1">
                  No types configured. Contact support.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Slot <span className="text-red-500">*</span>
              </label>
              <select
                value={form.slot}
                onChange={(e) => handleChange("slot", e.target.value)}
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
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  Recommended: {selectedSlot.dimensions.width}×
                  {selectedSlot.dimensions.height}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Grand opening — 30% off"
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
              placeholder="Short details about your ad..."
              maxLength={500}
              disabled={isSaving}
              className={inputClass}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              {form.description.length}/500
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Destination link
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="url"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://your-business.com/offer"
                disabled={isSaving}
                className={`${inputClass} pl-9`}
              />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Where users land after clicking your ad
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Budget
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="0.00"
                  disabled={isSaving}
                  className={`${inputClass} pl-9`}
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
                {isEdit ? "Save changes" : "Create advertisement"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Performance modal ─────────────────────────────────────
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
  const series = (perf?.series || []).map((d) => ({
    date: typeof d.date === "string" ? d.date.slice(5, 10) : "",
    impressions: d.impressions || 0,
    clicks: d.clicks || 0,
    conversions: d.conversions || 0,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl mx-0 sm:mx-4 mb-0 sm:mb-4 shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              Performance
            </h3>
            <p
              className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate"
              title={ad.title}
            >
              {ad.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
          {/* Range picker */}
          <div className="flex gap-1">
            {[
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days" },
              { value: "90d", label: "90 days" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  range === r.value
                    ? "bg-[#3B82F6] text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {error?.data?.message || "Failed to load performance data"}
              </p>
            </div>
          ) : (
            <>
              {/* KPI tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiTile
                  label="Impressions"
                  value={totals.impressions.toLocaleString()}
                />
                <KpiTile
                  label="Clicks"
                  value={totals.clicks.toLocaleString()}
                />
                <KpiTile label="CTR" value={`${totals.ctr}%`} accent />
                <KpiTile
                  label="Conversions"
                  value={totals.conversions.toLocaleString()}
                />
              </div>

              {/* Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                    Daily breakdown
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: ACCENT }}
                      />
                      Impressions
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      Clicks
                    </span>
                  </div>
                </div>

                {series.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                    No data for this period
                  </div>
                ) : (
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series}>
                        <defs>
                          <linearGradient
                            id="impressionsGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={ACCENT}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={ACCENT}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                          tickMargin={5}
                          minTickGap={16}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                          width={36}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.95)",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="impressions"
                          stroke={ACCENT}
                          strokeWidth={2}
                          fill="url(#impressionsGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="#9ca3af"
                          strokeWidth={2}
                          fill="transparent"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Current status
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle(ad.status).color}`}
                >
                  {ad.status}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const KpiTile = ({ label, value, accent = false }) => (
  <div
    className={`rounded-xl border p-3 min-w-0 ${
      accent
        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }`}
  >
    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
      {label}
    </p>
    <p
      className={`text-lg font-bold mt-0.5 truncate ${
        accent
          ? "text-[#3B82F6] dark:text-blue-400"
          : "text-gray-900 dark:text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

// ─── Confirm modal ─────────────────────────────────────────
const ConfirmModal = ({
  title,
  body,
  confirmLabel,
  confirmTone = "primary",
  Icon = Send,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const toneClass = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-orange-500 hover:bg-orange-600",
    primary: "bg-[#3B82F6] hover:bg-blue-700",
  }[confirmTone];

  const iconBg = {
    danger: "bg-red-50 dark:bg-red-900/20 text-red-500",
    warning: "bg-orange-50 dark:bg-orange-900/20 text-orange-500",
    primary: "bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6]",
  }[confirmTone];

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
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon className="h-5 w-5" />
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

export default BusinessAds;
