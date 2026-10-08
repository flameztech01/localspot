// src/components/admin/AdminDashboardView.jsx
import React, { useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiArrowUpRight,
  FiTv,
  FiDollarSign,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import {
  useGetAdminAnalyticsOverviewQuery,
  useGetAdminAnalyticsAdvertisingQuery,
  useGetAdminAnalyticsRevenueQuery,
} from "../../features/analyticsApiSlice";
import { useListBusinessesQuery } from "../../features/businessApiSlice";

const RANGE_PILLS = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
];

const rangeToParams = (rangeId) => {
  const pill = RANGE_PILLS.find((p) => p.id === rangeId) || RANGE_PILLS[1];
  const to = new Date();
  const from = new Date(to.getTime() - pill.days * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    granularity: pill.days > 60 ? "week" : "day",
  };
};

const formatNumber = (n) => {
  if (n === undefined || n === null) return "0";
  return Number(n).toLocaleString();
};

const formatCurrency = (n) => {
  const v = Number(n || 0);
  return `₦${v.toLocaleString()}`;
};

const formatShortDate = (iso) => {
  if (!iso) return "";
  // Handles both ISO and the "%Y-%m-%d" strings Mongo returns
  const s = String(iso);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [, m, d] = s.split("-");
    return `${m}/${d}`;
  }
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
};

const AdminDashboardView = ({
  onSelectBusinessApproval,
  onNavigateToBusinesses,
}) => {
  const [range, setRange] = useState("30d");
  const params = useMemo(() => rangeToParams(range), [range]);

  const {
    data: overviewResp,
    isLoading: loadingOverview,
    isError: overviewError,
    refetch: refetchOverview,
    isFetching: fetchingOverview,
  } = useGetAdminAnalyticsOverviewQuery(params);

  const { data: adsResp, isLoading: loadingAds } =
    useGetAdminAnalyticsAdvertisingQuery(params);

  const { data: revenueResp, isLoading: loadingRevenue } =
    useGetAdminAnalyticsRevenueQuery(params);

  const { data: pendingResp } = useListBusinessesQuery({
    status: "pending",
    limit: 5,
  });

  const overview = overviewResp?.data || null;
  const ads = adsResp?.data || null;
  const revenue = revenueResp?.data || null;
  const pendingBusinesses = pendingResp?.data || [];
  const pendingTotal = pendingResp?.pagination?.total || 0;

  const isLoading = loadingOverview || loadingAds || loadingRevenue;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Overview of LocalSpot platform activity and performance
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetchOverview()}
            disabled={fetchingOverview}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-60"
            aria-label="Refresh"
          >
            <FiRefreshCw
              size={14}
              className={fetchingOverview ? "animate-spin" : ""}
            />
          </button>

          <div className="inline-flex items-center bg-gray-100/90 p-1 rounded-2xl border border-gray-200/80">
            {RANGE_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setRange(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  range === pill.id
                    ? "bg-[#5397F6] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {overviewError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-900">
              Failed to load dashboard analytics
            </p>
            <p className="text-xs text-rose-800 mt-0.5">
              Check that the admin analytics endpoints are reachable.
            </p>
          </div>
        </div>
      )}

      {/* Business Overview KPI cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Business Overview
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
            Real-time
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Businesses"
            value={formatNumber(overview?.totals?.businesses?.total)}
            loading={isLoading}
            icon={FiCheckCircle}
            tone="blue"
            onClick={onNavigateToBusinesses}
            hint={`${overview?.totals?.businesses?.active || 0} active`}
          />
          <StatCard
            label="Email Verified"
            value={formatNumber(overview?.totals?.businesses?.emailVerified)}
            loading={isLoading}
            icon={FiCheckCircle}
            tone="emerald"
            onClick={onNavigateToBusinesses}
            hint="Confirmed accounts"
          />
          <StatCard
            label="Pending Review"
            value={formatNumber(overview?.totals?.businesses?.pendingApproval)}
            loading={isLoading}
            icon={FiClock}
            tone="amber"
            highlight
            onClick={() =>
              pendingBusinesses[0] &&
              onSelectBusinessApproval?.(pendingBusinesses[0]._id)
            }
            hint="Needs moderator check"
          />
          <StatCard
            label="Rejected"
            value={formatNumber(overview?.totals?.businesses?.rejected)}
            loading={isLoading}
            icon={FiAlertCircle}
            tone="rose"
            hint="Applications declined"
          />
        </div>
      </section>

      {/* Platform Activity series + advertising/revenue summaries */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Series chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Platform Activity
              </h3>
              <p className="text-xs text-gray-400">
                New businesses and events over the selected range
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="h-56 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <MiniLineChart
              businesses={overview?.series?.businesses || []}
              events={overview?.series?.events || []}
            />
          )}
        </div>

        {/* Sub totals widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Directory Snapshot
            </h4>
            <div className="space-y-3 text-xs">
              <Row
                label="Categories"
                value={formatNumber(overview?.totals?.categories)}
              />
              <Row
                label="Promotions"
                value={formatNumber(overview?.totals?.promotions?.total)}
              />
              <Row
                label="Advertisements"
                value={formatNumber(overview?.totals?.advertisements?.total)}
              />
              <Row
                label="Events tracked"
                value={formatNumber(overview?.totals?.events?.total)}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
              <MiniStat
                label="New businesses"
                value={overview?.recent?.newBusinesses}
              />
              <MiniStat
                label="New promos"
                value={overview?.recent?.newPromotions}
              />
              <MiniStat
                label="New ads"
                value={overview?.recent?.newAdvertisements}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Last 7 days
            </p>
          </div>
        </div>
      </section>

      {/* Advertising + Revenue */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advertising */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <FiTv className="text-blue-600" size={18} />
            <h3 className="font-bold text-gray-900 text-base">Advertising</h3>
          </div>

          {loadingAds ? (
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-100">
                <MiniKpi
                  label="Active"
                  value={formatNumber(ads?.totals?.total)}
                />
                <MiniKpi
                  label="Impressions"
                  value={formatNumber(ads?.totals?.impressions)}
                />
                <MiniKpi
                  label="Clicks"
                  value={formatNumber(ads?.totals?.clicks)}
                  tone="emerald"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-500">Click-through rate</span>
                <span className="font-extrabold text-blue-600 text-base">
                  {ads?.totals?.ctr || 0}%
                </span>
              </div>

              {ads?.byStatus && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(ads.byStatus).map(([status, count]) => (
                    <span
                      key={status}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700"
                    >
                      {status}: {count}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <FiDollarSign className="text-emerald-600" size={18} />
            <h3 className="font-bold text-gray-900 text-base">Revenue</h3>
          </div>

          {loadingRevenue ? (
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-100">
                <MiniKpi
                  label="Total budget"
                  value={formatCurrency(revenue?.totals?.totalBudget)}
                />
                <MiniKpi
                  label="Approved"
                  value={formatCurrency(revenue?.totals?.approvedBudget)}
                  tone="emerald"
                />
                <MiniKpi
                  label="Pending"
                  value={formatCurrency(revenue?.totals?.pendingBudget)}
                  tone="amber"
                />
              </div>

              {revenue?.topSpenders?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Top spenders
                  </p>
                  {revenue.topSpenders.slice(0, 3).map((s) => (
                    <div
                      key={s.businessId}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-700 font-semibold truncate max-w-[60%]">
                        {s.businessName}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {formatCurrency(s.totalSpent)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Needs attention */}
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Needs Attention
              </h3>
              {pendingTotal > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white uppercase tracking-wider">
                  {pendingTotal} pending
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Newly submitted businesses waiting for verification
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToBusinesses}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Open all <FiChevronRight size={14} />
          </button>
        </div>

        {pendingBusinesses.length === 0 ? (
          <div className="py-8 text-center">
            <FiCheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">
              Nothing pending
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The review queue is empty.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl text-left">
                      Business
                    </th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Submitted</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingBusinesses.map((biz) => (
                    <tr
                      key={biz._id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {biz.businessName}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {biz.categorySlug || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {biz.createdAt
                          ? new Date(biz.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            onSelectBusinessApproval?.(biz._id)
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#5397F6] text-white font-bold text-xs transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = "blue",
  hint,
  loading,
  onClick,
  highlight,
}) => {
  const tones = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
  };
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border shadow-xs transition-all ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${
        highlight
          ? "border-amber-200"
          : "border-gray-200/80"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`p-2.5 rounded-xl border ${tones[tone]}`}
        >
          <Icon size={16} />
        </div>
      </div>

      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <div className="text-3xl font-black text-gray-900">{value}</div>
      )}
      {hint && (
        <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-gray-500">
          {hint}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-lg font-black text-gray-900">{value ?? 0}</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
      {label}
    </p>
  </div>
);

const MiniKpi = ({ label, value, tone = "default" }) => {
  const cls = {
    default: "text-gray-900",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  }[tone];
  return (
    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
      <div className="text-[10px] font-bold text-gray-500 uppercase truncate">
        {label}
      </div>
      <div className={`text-base font-black mt-1 truncate ${cls}`}>
        {value}
      </div>
    </div>
  );
};

// ─── Mini line chart (no chart lib) ───────────────────────
const MiniLineChart = ({ businesses = [], events = [] }) => {
  const all = useMemo(() => {
    const map = new Map();
    businesses.forEach((b) => map.set(b.date, { date: b.date, biz: b.count, events: 0 }));
    events.forEach((e) => {
      const existing = map.get(e.date) || { date: e.date, biz: 0, events: 0 };
      existing.events = e.count;
      map.set(e.date, existing);
    });
    return Array.from(map.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );
  }, [businesses, events]);

  if (all.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-gray-400">
        No data for this range
      </div>
    );
  }

  const maxBiz = Math.max(1, ...all.map((d) => d.biz));
  const maxEvents = Math.max(1, ...all.map((d) => d.events));
  const W = 600;
  const H = 200;
  const pad = 20;
  const stepX = (W - pad * 2) / Math.max(1, all.length - 1);

  const pathFor = (key, max) => {
    return all
      .map((d, i) => {
        const x = pad + i * stepX;
        const y = H - pad - (d[key] / max) * (H - pad * 2);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-4 text-xs font-semibold mb-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="text-gray-600">New businesses</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-gray-600">Events</span>
        </span>
      </div>

      <div className="w-full h-56">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="0"
              y1={(H / 3) * i}
              x2={W}
              y2={(H / 3) * i}
              stroke="#f1f5f9"
              strokeDasharray="3 3"
            />
          ))}

          <path
            d={pathFor("events", maxEvents)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={pathFor("biz", maxBiz)}
            fill="none"
            stroke="#5397F6"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
        {all.map((d) => (
          <span key={d.date}>{formatShortDate(d.date)}</span>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardView;