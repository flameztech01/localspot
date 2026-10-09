// src/components/admin/AdminRevenueView.jsx
import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiRefreshCw,
  FiLoader,
  FiBarChart2,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useGetAdminAnalyticsRevenueQuery } from "../../features/analyticsApiSlice";

const RANGE_PILLS = [
  { id: "7d", label: "7 days", days: 7, granularity: "day" },
  { id: "30d", label: "30 days", days: 30, granularity: "day" },
  { id: "90d", label: "90 days", days: 90, granularity: "week" },
  { id: "365d", label: "1 year", days: 365, granularity: "month" },
];

const rangeToParams = (id) => {
  const p = RANGE_PILLS.find((x) => x.id === id) || RANGE_PILLS[1];
  const to = new Date();
  const from = new Date(to.getTime() - p.days * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    granularity: p.granularity,
  };
};

const formatCurrency = (n) => {
  const v = Number(n || 0);
  return `₦${v.toLocaleString()}`;
};

const formatCompact = (n) => {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(1)}k`;
  return `₦${v}`;
};

const formatDate = (d) => {
  if (!d) return "";
  const s = String(d);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [, m, day] = s.split("-");
    return `${m}/${day}`;
  }
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
};

const AdminRevenueView = () => {
  const [range, setRange] = useState("30d");
  const params = useMemo(() => rangeToParams(range), [range]);

  const {
    data: resp,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetAdminAnalyticsRevenueQuery(params);

  const revenue = resp?.data || null;

  const chartData = useMemo(() => {
    const series = revenue?.series || [];
    return series.map((d) => ({
      label: formatDate(d.date),
      revenue: d.revenue || 0,
      count: d.count || 0,
    }));
  }, [revenue]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Revenue
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Advertising budgets and featured listing monetization.
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800">
          Failed to load revenue analytics.{" "}
          {error?.data?.message || ""}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueCard
          label="Total Budget"
          value={formatCurrency(revenue?.totals?.totalBudget)}
          loading={isLoading}
          icon={FiDollarSign}
          tone="blue"
        />
        <RevenueCard
          label="Approved Revenue"
          value={formatCurrency(revenue?.totals?.approvedBudget)}
          loading={isLoading}
          icon={FiTrendingUp}
          tone="emerald"
        />
        <RevenueCard
          label="Pending"
          value={formatCurrency(revenue?.totals?.pendingBudget)}
          loading={isLoading}
          icon={FiBarChart2}
          tone="amber"
        />
        <RevenueCard
          label="Total Ads"
          value={(revenue?.totals?.adCount || 0).toLocaleString()}
          loading={isLoading}
          icon={FiBarChart2}
          tone="default"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Revenue over time
            </h3>
            <p className="text-xs text-gray-400">
              Approved ad budget for the selected range
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-gray-400">
            No revenue data for this period
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                  tickMargin={5}
                  minTickGap={16}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                  width={56}
                  tickFormatter={formatCompact}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#5397F6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top spenders + Revenue by slot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top spenders */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Top spenders
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (revenue?.topSpenders || []).length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              No spenders in this range.
            </p>
          ) : (
            <div className="space-y-2">
              {(revenue?.topSpenders || []).map((s, i) => (
                <div
                  key={s.businessId || i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100"
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      #{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {s.businessName || "Unknown"}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {s.adCount} ad{s.adCount === 1 ? "" : "s"} ·{" "}
                        {s.email || ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 shrink-0">
                    {formatCurrency(s.totalSpent)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue by status */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Revenue by status
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : !revenue?.byStatus ||
            Object.keys(revenue.byStatus).length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              No data in this range.
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(revenue.byStatus).map(([status, data]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 capitalize truncate">
                      {status}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {data.count} ad{data.count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900 shrink-0">
                    {formatCurrency(data.budget)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue by slot */}
      {!isLoading && (revenue?.bySlot || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Revenue by ad slot
          </h3>
          <div className="space-y-2">
            {revenue.bySlot.map((s, i) => (
              <div
                key={s.slotId || i}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {s.slotName || "Unnamed slot"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {s.count} ad{s.count === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#5397F6] shrink-0">
                  {formatCurrency(s.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RevenueCard = ({
  label,
  value,
  loading,
  icon: Icon,
  tone = "default",
}) => {
  const tones = {
    default: "bg-gray-100 text-gray-600",
    blue: "bg-blue-50 text-[#5397F6]",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <div className={`p-2 rounded-xl ${tones[tone]}`}>
          <Icon size={14} />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <div className="text-2xl font-black text-gray-900 truncate">
          {value}
        </div>
      )}
    </div>
  );
};

export default AdminRevenueView;