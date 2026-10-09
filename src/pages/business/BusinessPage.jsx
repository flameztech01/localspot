// src/pages/business/BusinessPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Store,
  Eye,
  Star,
  Megaphone,
  BadgeCheck,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Edit3,
  X,
  CheckCircle2,
  XCircle,
  Upload,
  BarChart3,
  Package,
  LogOut,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { useGetBusinessAnalyticsQuery } from "../../features/analyticsApiSlice";
import { useListMyPromotionsQuery } from "../../features/promotionApiSlice";
import { useListMyAdvertisementsQuery } from "../../features/adsApiSlice";
import { logout } from "../../features/auth/authSlice";
import BusinessSidebar from "../../components/BusinessSidebar";
import BusinessBottombar from "../../components/BusinessBottombar";

// ─── Constants ─────────────────────────────────────────────
const ACCENT = "#3B82F6";
const RECENT_PROMOTIONS_LIMIT = 5;
const MIN_BUSINESS_IMAGES = 10;
const MAX_BUSINESS_IMAGES = 20;

const QUICK_FILTERS = [
  { type: "week", label: "This Week" },
  { type: "month", label: "This Month" },
  { type: "last2Months", label: "Last 2 Months" },
  { type: "all", label: "All Time" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatFilterLabel = (filter) => {
  switch (filter.type) {
    case "all":
      return "All Time";
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "last2Months":
      return "Last 2 Months";
    case "year":
      return String(filter.year);
    case "yearMonth": {
      const d = new Date(filter.year, filter.month, 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    default:
      return "This Week";
  }
};

const formatFilterSubtitle = (filter) => {
  switch (filter.type) {
    case "all":
      return "All time";
    case "week":
      return "Last 7 days";
    case "month":
      return "This month · daily";
    case "last2Months":
      return "Last 2 months · monthly";
    case "year":
      return `${filter.year} · monthly`;
    case "yearMonth": {
      const d = new Date(filter.year, filter.month, 1);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    default:
      return "Last 7 days";
  }
};

// ─── Component ─────────────────────────────────────────────
const BusinessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chartFilter, setChartFilter] = useState({ type: "week" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropLevel, setDropLevel] = useState("root");
  const [dropYear, setDropYear] = useState(null);
  const chartFilterRef = useRef(null);

  const [showImagesModal, setShowImagesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const openDropdown = () => {
    setDropLevel("root");
    setDropYear(null);
    setDropdownOpen(true);
  };
  const closeDropdown = () => setDropdownOpen(false);

  // ─── Logout ─────────────────────────────────────────────
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

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
      localStorage.removeItem("businessToken");
      sessionStorage.clear();
    } catch (_) {}

    try {
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    } catch (_) {}

    navigate("/business/signin", { replace: true });
    setTimeout(() => window.location.reload(), 50);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        chartFilterRef.current &&
        !chartFilterRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // ─── Queries ───────────────────────────────────────────────
  const {
    data: businessResp,
    isLoading: bizLoading,
    error: bizError,
    refetch: refetchBusiness,
  } = useGetCurrentBusinessAccountQuery();

  const business = businessResp?.data || businessResp;
  const isUnauthorized = bizError?.status === 401;

  const analyticsParams = useMemo(() => {
    const now = new Date();
    const params = { granularity: "day" };
    switch (chartFilter.type) {
      case "week": {
        const from = new Date(now);
        from.setDate(from.getDate() - 6);
        params.from = from.toISOString();
        params.to = now.toISOString();
        break;
      }
      case "month": {
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        params.from = from.toISOString();
        params.to = now.toISOString();
        break;
      }
      case "last2Months": {
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        params.from = from.toISOString();
        params.to = now.toISOString();
        params.granularity = "month";
        break;
      }
      case "year": {
        params.from = new Date(chartFilter.year, 0, 1).toISOString();
        params.to = new Date(chartFilter.year, 11, 31).toISOString();
        params.granularity = "month";
        break;
      }
      case "yearMonth": {
        params.from = new Date(
          chartFilter.year,
          chartFilter.month,
          1,
        ).toISOString();
        params.to = new Date(
          chartFilter.year,
          chartFilter.month + 1,
          0,
        ).toISOString();
        break;
      }
      case "all":
      default:
        break;
    }
    return params;
  }, [chartFilter]);

  const skipAnalytics = isUnauthorized || !!bizError;

  const { data: analyticsResp, isLoading: analyticsLoading } =
    useGetBusinessAnalyticsQuery(analyticsParams, { skip: skipAnalytics });

  const analytics = analyticsResp?.data;

  const { data: promotionsResp, isLoading: promosLoading } =
    useListMyPromotionsQuery({ limit: 20 }, { skip: skipAnalytics });

  const promotions = promotionsResp?.data || [];

  const { data: adsResp } = useListMyAdvertisementsQuery(undefined, {
    skip: skipAnalytics,
  });

  const advertisements = adsResp?.data || [];

  // ─── Derived ───────────────────────────────────────────────
  const isEmailVerified = business?.isVerified ?? false;
  const isApproved = business?.businessVerified ?? false;
  const isRejected = !!business?.businessRejectionReason && !isApproved;

  const approvalStatus = !isEmailVerified
    ? "unverified"
    : isApproved
      ? "approved"
      : isRejected
        ? "rejected"
        : "pending";

  const profileImages = business?.images || [];
  const imageCount = profileImages.length;
  const imagesReady = imageCount >= MIN_BUSINESS_IMAGES;

  const completionItems = [
    !!business?.businessName,
    !!business?.description,
    !!business?.phone,
    !!business?.address || !!business?.location?.city,
    !!business?.coverImage,
    imagesReady,
    (business?.tags?.length || 0) > 0,
    (business?.openingHours?.length || 0) > 0,
    !!business?.website,
  ];
  const completionPct = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );

  const totalViews =
    analytics?.overview?.profileViews ?? business?.viewCount ?? 0;
  const rating = business?.rating ?? 0;
  const numReviews = business?.numReviews ?? 0;
  const activePromotions = promotions.filter(
    (p) => p.status === "approved",
  ).length;
  const activeAds = advertisements.filter(
    (a) => a.status === "approved",
  ).length;

  const recentPromotions = useMemo(() => {
    return [...promotions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, RECENT_PROMOTIONS_LIMIT);
  }, [promotions]);

  const chartData = useMemo(() => {
    const series = analytics?.series?.views || [];
    if (series.length) {
      return series.map((d) => ({
        label:
          chartFilter.type === "last2Months" || chartFilter.type === "year"
            ? d.date
            : d.date?.slice(-2) || "",
        amount: d.count || 0,
      }));
    }
    if (chartFilter.type === "week") {
      const out = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        out.push({
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
          amount: 0,
        });
      }
      return out;
    }
    return [];
  }, [analytics, chartFilter]);

  // ─── Unauthorized state ──────────────────────────────────
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
            You're not signed in, or your session has expired. Please log in
            again or clear your session.
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
              className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loggingOut ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                  Clearing session...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Clear session & log out
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Other errors ─────────────────────────────────────────
  if (bizError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Failed to load business profile
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {bizError?.data?.message ||
              "Something went wrong. Please try again."}
          </p>

          <div className="space-y-2">
            <button
              onClick={() => refetchBusiness()}
              className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Status helpers ────────────────────────────────────────
  const statusMeta = {
    approved: {
      label: "Verified Business",
      color: "text-green-600 bg-green-50",
      Icon: BadgeCheck,
    },
    pending: {
      label: "Pending Approval",
      color: "text-yellow-600 bg-yellow-50",
      Icon: Clock,
    },
    rejected: {
      label: "Rejected",
      color: "text-red-600 bg-red-50",
      Icon: XCircle,
    },
    unverified: {
      label: "Email Unverified",
      color: "text-gray-500 bg-gray-100",
      Icon: AlertCircle,
    },
  }[approvalStatus];

  const promotionStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "disabled":
        return "text-gray-500 bg-gray-100";
      case "draft":
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  // ─── Mobile Hero Card ──────────────────────────────────────
  const HeroCard = () => {
    const initials = (business?.businessName || "B").charAt(0).toUpperCase();

    return (
      <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {business?.coverImage ? (
              <img
                src={business.coverImage}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-[#3B82F6]">
                {initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="text-base font-bold text-gray-900 truncate"
              title={business?.businessName}
            >
              {business?.businessName || "Your Business"}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${statusMeta.color}`}
            >
              <statusMeta.Icon className="h-3 w-3" />
              {statusMeta.label}
            </span>
          </div>
          <button
            onClick={() => navigate("/business/profile")}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition flex-shrink-0"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Profile Views
            </span>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {totalViews}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Rating
            </span>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {rating.toFixed(1)}
              <span className="text-xs font-medium text-gray-400 ml-1">
                ({numReviews})
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 gap-2">
          <div className="flex items-center gap-5 min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] text-gray-500">Promos</span>
              <p className="text-sm font-bold text-gray-900 truncate">
                {activePromotions}
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-gray-500">Ads</span>
              <p className="text-sm font-bold text-gray-900 truncate">
                {activeAds}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowImagesModal(true)}
            className="flex items-center gap-1 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 px-3 py-1.5 rounded-lg transition shadow-sm flex-shrink-0"
          >
            <ImageIcon className="h-3 w-3" />
            {imageCount}/{MAX_BUSINESS_IMAGES}
          </button>
        </div>
      </div>
    );
  };

  // ─── Desktop Stat Card ─────────────────────────────────────
  const StatCard = ({ icon: Icon, label, value, sub }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
            {value}
          </p>
          {sub && (
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{sub}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-[#3B82F6] flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  // ─── Chart Filter Dropdown ────────────────────────────────
  const ChartFilterDropdown = () => {
    const availableYears = useMemo(() => {
      const years = new Set();
      years.add(new Date().getFullYear());
      const earliest = business?.createdAt
        ? new Date(business.createdAt)
        : null;
      if (earliest) {
        for (
          let y = earliest.getFullYear();
          y <= new Date().getFullYear();
          y++
        ) {
          years.add(y);
        }
      }
      return Array.from(years).sort((a, b) => b - a);
    }, [business]);

    const isActive = (type, extras = {}) => {
      if (chartFilter.type !== type) return false;
      if ("year" in extras && chartFilter.year !== extras.year) return false;
      if ("month" in extras && chartFilter.month !== extras.month) return false;
      return true;
    };

    const Item = ({ onClick, children, active = false }) => (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between gap-2 ${
          active
            ? "bg-blue-50 text-[#3B82F6] font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span className="truncate">{children}</span>
        {active && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
        )}
      </button>
    );

    const DrillItem = ({ onClick, label }) => (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left px-3 py-2 text-xs transition flex items-center justify-between gap-2 text-gray-700 hover:bg-gray-50"
      >
        <span className="truncate">{label}</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
      </button>
    );

    const BackBtn = ({ onClick, children }) => (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition flex items-center gap-1.5 border-b border-gray-100"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {children}
      </button>
    );

    const SectionLabel = ({ children }) => (
      <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-gray-400 font-medium">
        {children}
      </div>
    );

    return (
      <div ref={chartFilterRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => (dropdownOpen ? closeDropdown() : openDropdown())}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 transition max-w-[180px]"
        >
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{formatFilterLabel(chartFilter)}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden max-h-[420px] overflow-y-auto">
            {dropLevel === "root" && (
              <>
                <SectionLabel>Quick Ranges</SectionLabel>
                {QUICK_FILTERS.map((f) => (
                  <Item
                    key={f.type}
                    active={isActive(f.type)}
                    onClick={() => {
                      setChartFilter({ type: f.type });
                      closeDropdown();
                    }}
                  >
                    {f.label}
                  </Item>
                ))}

                <div className="my-1 border-t border-gray-100" />
                <SectionLabel>Browse by Year</SectionLabel>

                {availableYears.map((y) => (
                  <DrillItem
                    key={y}
                    label={y}
                    onClick={() => {
                      setDropYear(y);
                      setDropLevel("months");
                    }}
                  />
                ))}
              </>
            )}

            {dropLevel === "months" && (
              <>
                <BackBtn
                  onClick={() => {
                    setDropLevel("root");
                    setDropYear(null);
                  }}
                >
                  {dropYear}
                </BackBtn>

                <Item
                  active={isActive("year", { year: dropYear })}
                  onClick={() => {
                    setChartFilter({ type: "year", year: dropYear });
                    closeDropdown();
                  }}
                >
                  Full year of {dropYear}
                </Item>

                <div className="my-1 border-t border-gray-100" />

                {MONTH_NAMES.map((name, idx) => (
                  <Item
                    key={idx}
                    active={isActive("yearMonth", {
                      year: dropYear,
                      month: idx,
                    })}
                    onClick={() => {
                      setChartFilter({
                        type: "yearMonth",
                        year: dropYear,
                        month: idx,
                      });
                      closeDropdown();
                    }}
                  >
                    {name}
                  </Item>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── Approval Banner ───────────────────────────────────────
  const ApprovalBanner = () => {
    if (approvalStatus === "approved") return null;

    const meta = {
      pending: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
        title: "Account pending approval",
        body: "Your business has been submitted for review. You'll be notified once our team approves it. In the meantime, feel free to complete your profile.",
        Icon: Clock,
      },
      rejected: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-800",
        title: "Business application rejected",
        body:
          business?.businessRejectionReason ||
          "Your application was rejected. Please review our guidelines and update your profile before resubmitting.",
        Icon: XCircle,
      },
      unverified: {
        bg: "bg-gray-50 border-gray-200",
        text: "text-gray-700",
        title: "Email not verified",
        body: "Verify your email address to continue setting up your business.",
        Icon: AlertCircle,
      },
    }[approvalStatus];

    if (!meta) return null;
    const Icon = meta.Icon;

    return (
      <div
        className={`border rounded-2xl p-4 mb-6 flex items-start gap-3 ${meta.bg}`}
      >
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${meta.text}`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${meta.text}`}>{meta.title}</h3>
          <p className={`text-xs mt-1 leading-relaxed ${meta.text} opacity-90`}>
            {meta.body}
          </p>
        </div>
      </div>
    );
  };

  // ─── Images Modal ──────────────────────────────────────────
  const ImagesModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setShowImagesModal(false)}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-6 mx-4 mb-4 sm:mb-0 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Business Images</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {imageCount} of {MAX_BUSINESS_IMAGES} · minimum{" "}
              {MIN_BUSINESS_IMAGES}
            </p>
          </div>
          <button
            onClick={() => setShowImagesModal(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {imageCount === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No images uploaded yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Upload at least {MIN_BUSINESS_IMAGES} photos of your business from
              different angles.
            </p>
            <button
              onClick={() => {
                setShowImagesModal(false);
                navigate("/business/profile");
              }}
              className="mt-4 px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Images
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {profileImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={url}
                    alt={`Business image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {!imagesReady && (
              <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mb-3">
                Upload {MIN_BUSINESS_IMAGES - imageCount} more to reach the
                minimum.
              </p>
            )}

            <button
              onClick={() => {
                setShowImagesModal(false);
                navigate("/business/profile");
              }}
              className="w-full py-2.5 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center justify-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Manage Images
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ─── Recent Promotions ─────────────────────────────────────
  const RecentPromotions = () => (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-2xl">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-700 truncate">
          Recent Promotions
        </h2>
        <button
          onClick={() => navigate("/business/promotions")}
          className="text-sm text-[#3B82F6] hover:underline flex-shrink-0"
        >
          View all
        </button>
      </div>

      {promosLoading ? (
        <div className="divide-y divide-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-14 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse ml-2" />
            </div>
          ))}
        </div>
      ) : recentPromotions.length === 0 ? (
        <div className="text-center py-10">
          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No promotions yet</p>
          <button
            onClick={() => navigate("/business/promotions")}
            className="mt-3 text-[#3B82F6] hover:underline text-sm font-medium"
          >
            Create your first promotion
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentPromotions.map((promo) => (
            <div
              key={promo._id}
              onClick={() => navigate("/business/promotions")}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-medium text-gray-900 text-sm truncate"
                    title={promo.title}
                  >
                    {promo.title}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${promotionStatusColor(
                      promo.status,
                    )}`}
                  >
                    {promo.status || "draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 truncate">
                  {promo.discountValue != null && (
                    <>
                      <span className="flex-shrink-0">
                        {promo.discountType === "percent"
                          ? `${promo.discountValue}% off`
                          : `₦${promo.discountValue} off`}
                      </span>
                      <span className="flex-shrink-0">·</span>
                    </>
                  )}
                  <span className="truncate">
                    {new Date(promo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-20 lg:pb-8">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 py-3 lg:py-4 lg:px-6 flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900 lg:text-xl truncate">
            Business Dashboard
          </h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {business && (
              <button
                type="button"
                onClick={() => navigate("/business/profile")}
                aria-label="Open business profile"
                className="hidden sm:flex items-center gap-2 min-w-0 rounded-full pl-2 pr-0.5 py-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <span className="text-sm text-gray-600 hidden md:inline truncate max-w-[140px]">
                  {business.businessName}
                </span>
                <span className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {business.coverImage ? (
                    <img
                      src={business.coverImage}
                      alt={business.businessName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-4 w-4 text-[#3B82F6]" />
                  )}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
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

        <div className="w-full px-1 sm:px-4 lg:px-6 py-4">
          <HeroCard />

          <ApprovalBanner />

          {/* Desktop welcome + stat cards */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 mb-6 min-w-0">
              <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {business?.coverImage ? (
                  <img
                    src={business.coverImage}
                    alt={business.businessName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-6 w-6 text-[#3B82F6]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  className="text-2xl font-bold text-gray-900 truncate"
                  title={business?.businessName}
                >
                  Welcome back, {business?.businessName || "Business"}!
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.color}`}
                  >
                    <statusMeta.Icon className="h-3.5 w-3.5" />
                    {statusMeta.label}
                  </span>
                  {business?.location?.city && (
                    <span className="text-gray-500 text-sm inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5" />
                      {business.location.city}
                      {business.location.state
                        ? `, ${business.location.state}`
                        : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={Eye}
                label="Profile Views"
                value={totalViews}
                sub="All time"
              />
              <StatCard
                icon={Star}
                label="Rating"
                value={rating.toFixed(1)}
                sub={`${numReviews} reviews`}
              />
              <StatCard
                icon={Megaphone}
                label="Active Promos"
                value={activePromotions}
                sub={`${promotions.length} total`}
              />
              <StatCard
                icon={Package}
                label="Active Ads"
                value={activeAds}
                sub={`${advertisements.length} total`}
              />
            </div>
          </div>

          {/* Chart + Quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm min-w-0">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-700 truncate">
                    Profile Views
                  </h3>
                  <span className="text-xs text-gray-400 truncate block">
                    {formatFilterSubtitle(chartFilter)}
                  </span>
                </div>
                <ChartFilterDropdown />
              </div>

              {analyticsLoading ? (
                <div className="h-48 animate-pulse bg-gray-200 rounded" />
              ) : chartData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                  No data for this period
                </div>
              ) : (
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="viewsGradient"
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
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        tickMargin={5}
                        minTickGap={16}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        width={40}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(value) => [value, "Views"]}
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={ACCENT}
                        strokeWidth={2}
                        fill="url(#viewsGradient)"
                        dot={{ r: 2, fill: ACCENT }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <button
                onClick={() => navigate("/business/profile")}
                className="flex flex-row lg:flex-col items-center justify-center gap-1.5 lg:gap-0 px-2.5 py-2.5 lg:p-4 bg-[#3B82F6] hover:bg-blue-700 text-white rounded-xl lg:rounded-2xl transition shadow-sm hover:shadow-md min-w-0"
              >
                <Edit3 className="h-4 w-4 lg:h-8 lg:w-8 lg:mb-1 flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium truncate">
                  Edit Profile
                </span>
              </button>
              <button
                onClick={() => setShowImagesModal(true)}
                className="flex flex-row lg:flex-col items-center justify-center gap-1.5 lg:gap-0 px-2.5 py-2.5 lg:p-4 bg-blue-50 hover:bg-blue-100 text-[#3B82F6] rounded-xl lg:rounded-2xl transition border border-blue-100 min-w-0"
              >
                <ImageIcon className="h-4 w-4 lg:h-8 lg:w-8 lg:mb-1 flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium truncate">
                  {imageCount}/{MAX_BUSINESS_IMAGES} Images
                </span>
              </button>
              <button
                onClick={() => navigate("/business/promotions")}
                className="flex flex-row lg:flex-col items-center justify-center gap-1.5 lg:gap-0 px-2.5 py-2.5 lg:p-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl lg:rounded-2xl transition min-w-0"
              >
                <Megaphone className="h-4 w-4 lg:h-8 lg:w-8 lg:mb-1 flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium truncate">
                  Promotions
                </span>
              </button>
              <button
                onClick={() => navigate("/business/ads")}
                className="flex flex-row lg:flex-col items-center justify-center gap-1.5 lg:gap-0 px-2.5 py-2.5 lg:p-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl lg:rounded-2xl transition min-w-0"
              >
                <BarChart3 className="h-4 w-4 lg:h-8 lg:w-8 lg:mb-1 flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium truncate">
                  Ads
                </span>
              </button>
              <button
                onClick={() => navigate("/business/reviews")}
                className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl lg:rounded-2xl px-3 py-2.5 lg:p-3 flex items-center justify-center transition"
              >
                <span className="text-xs lg:text-sm font-medium">
                  View Reviews
                </span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Profile completion + images preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm min-w-0">
              <div className="flex items-center justify-between mb-4 gap-2">
                <h3 className="text-sm font-semibold text-gray-700 truncate">
                  Profile Completion
                </h3>
                <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                  {completionPct}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
                <div
                  className="h-full bg-[#3B82F6] transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  { label: "Business name", done: !!business?.businessName },
                  { label: "Description", done: !!business?.description },
                  { label: "Contact phone", done: !!business?.phone },
                  {
                    label: "Address / City",
                    done: !!(business?.address || business?.location?.city),
                  },
                  { label: "Cover image", done: !!business?.coverImage },
                  {
                    label: `Business images (${imageCount}/${MIN_BUSINESS_IMAGES})`,
                    done: imagesReady,
                  },
                  {
                    label: "Tags",
                    done: (business?.tags?.length || 0) > 0,
                  },
                  {
                    label: "Opening hours",
                    done: (business?.openingHours?.length || 0) > 0,
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 min-w-0 text-gray-600"
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-[#3B82F6] flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`truncate ${
                        item.done ? "" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/business/profile")}
                className="mt-4 text-[#3B82F6] hover:underline text-sm font-medium"
              >
                Complete your profile →
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm min-w-0">
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="text-sm font-semibold text-gray-700 truncate">
                  Business Images
                </h3>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {imageCount}/{MAX_BUSINESS_IMAGES}
                </span>
              </div>

              {imageCount === 0 ? (
                <div className="text-center py-6">
                  <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No images yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {profileImages.slice(0, 6).map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={url}
                        alt={`Business ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowImagesModal(true)}
                className="mt-4 text-[#3B82F6] hover:underline text-sm font-medium"
              >
                Manage images →
              </button>
            </div>
          </div>

          <RecentPromotions />
        </div>
      </div>

      {/* Floating status button (mobile) */}
      <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setShowStatusModal(true)}
          className="relative group"
        >
          <div
            className={`absolute inset-0 rounded-full animate-ping ${
              approvalStatus === "approved"
                ? "bg-green-500/40"
                : approvalStatus === "pending"
                  ? "bg-orange-500/40"
                  : "bg-red-500/40"
            }`}
            style={{ animationDuration: "1.5s" }}
          />
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
              approvalStatus === "approved"
                ? "bg-green-500 border-green-400"
                : approvalStatus === "pending"
                  ? "bg-orange-500 border-orange-400"
                  : "bg-red-500 border-red-400"
            }`}
          >
            <statusMeta.Icon className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>

      {/* Status modal */}
      {showStatusModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowStatusModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 mx-4 mb-4 sm:mb-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Account Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500 flex-shrink-0">
                  Email
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isEmailVerified
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isEmailVerified ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500 flex-shrink-0">
                  Business
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.color}`}
                >
                  <statusMeta.Icon className="h-3 w-3" />
                  {statusMeta.label}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                {approvalStatus === "approved" && (
                  <p className="text-sm text-green-600">
                    Your business is live and visible to customers.
                  </p>
                )}
                {approvalStatus === "pending" && (
                  <p className="text-sm text-yellow-600">
                    Your profile is under review. We'll notify you once it's
                    approved.
                  </p>
                )}
                {approvalStatus === "rejected" && (
                  <p className="text-sm text-red-600">
                    {business?.businessRejectionReason ||
                      "Your application was rejected. Please update and resubmit."}
                  </p>
                )}
                {approvalStatus === "unverified" && (
                  <p className="text-sm text-gray-600">
                    Verify your email to continue.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  navigate("/business/profile");
                }}
                className="w-full mt-3 py-2.5 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Edit Business Profile
              </button>

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  handleLogout();
                }}
                disabled={loggingOut}
                className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagesModal && <ImagesModal />}

      <BusinessBottombar />
    </div>
  );
};

export default BusinessPage;