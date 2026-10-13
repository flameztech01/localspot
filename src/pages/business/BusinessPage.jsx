// src/pages/business/BusinessPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  User as UserIcon,
  Store,
  Megaphone,
  BarChart3,
  Star,
  Heart,
  LogOut,
  Image as ImageIcon,
  Menu,
  X,
  Building2,
  Calendar,
  Check,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

// ─── Data by Timeframe (Week, Month, Quarter, Year) ──────────────────
const TIMEFRAME_DATA = {
  week: {
    kpis: {
      impressions: { value: "1,648", change: "+100%", isPositive: true },
      views: { value: "119", change: "+223%", isPositive: true },
      searchAppearances: { value: "872", change: "-18%", isPositive: false },
      conversionRate: "872",
      totalClicks: 1509,
    },
    popularity: [
      { day: "Mon", date: "15", value: 4800 },
      { day: "Tue", date: "16", value: 3600 },
      { day: "Wed", date: "17", value: 4300 },
      { day: "Thu", date: "18", value: 5800 },
      { day: "Fri", date: "19", value: 7200 },
      { day: "Sat", date: "20", value: 8100 },
      { day: "Sun", date: "21", value: 7900 },
    ],
    customerSources: [
      { day: "Sun 12", ads: 1500, organic: 180 },
      { day: "Mon 13", ads: 2550, organic: 240, label: "2550" },
      { day: "Tue 14", ads: 2200, organic: 190 },
      { day: "Wed 15", ads: 2350, organic: 210 },
      { day: "Thu 16", ads: 2700, organic: 260 },
      { day: "Fri 17", ads: 2800, organic: 310 },
      { day: "Sat 18", ads: 2450, organic: 290 },
    ],
    clicksBreakdown: [
      { name: "Phone clicks", value: 655, color: "#34D399" },
      { name: "Whatsapp clicks", value: 205, color: "#8B5CF6" },
      { name: "Direction clicks", value: 359, color: "#FBBF24" },
      { name: "Website clicks", value: 205, color: "#60A5FA" },
    ],
    topPlaces: [
      {
        id: 1,
        name: "Alakaha",
        volume: 195,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 2,
        name: "Rumuola",
        volume: 90,
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 3,
        name: "House Quarters",
        volume: 330,
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        name: "Plaulk Car wash",
        volume: 56,
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 5,
        name: "Ada george",
        volume: 35,
        image:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
  month: {
    kpis: {
      impressions: { value: "6,920", change: "+48%", isPositive: true },
      views: { value: "540", change: "+115%", isPositive: true },
      searchAppearances: { value: "3,410", change: "+12%", isPositive: true },
      conversionRate: "3,120",
      totalClicks: 4890,
    },
    popularity: [
      { day: "W1", date: "1-7", value: 4200 },
      { day: "W2", date: "8-14", value: 5900 },
      { day: "W3", date: "15-21", value: 7600 },
      { day: "W4", date: "22-31", value: 9200 },
    ],
    customerSources: [
      { day: "Week 1", ads: 6400, organic: 1200 },
      { day: "Week 2", ads: 8200, organic: 1600, label: "8200" },
      { day: "Week 3", ads: 9500, organic: 1800 },
      { day: "Week 4", ads: 10400, organic: 2100 },
    ],
    clicksBreakdown: [
      { name: "Phone clicks", value: 2140, color: "#34D399" },
      { name: "Whatsapp clicks", value: 890, color: "#8B5CF6" },
      { name: "Direction clicks", value: 1240, color: "#FBBF24" },
      { name: "Website clicks", value: 620, color: "#60A5FA" },
    ],
    topPlaces: [
      {
        id: 1,
        name: "House Quarters",
        volume: 980,
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 2,
        name: "Alakaha",
        volume: 640,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 3,
        name: "Rumuola",
        volume: 380,
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        name: "Ada george",
        volume: 210,
        image:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 5,
        name: "Plaulk Car wash",
        volume: 175,
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
  quarter: {
    kpis: {
      impressions: { value: "19,840", change: "+85%", isPositive: true },
      views: { value: "1,620", change: "+170%", isPositive: true },
      searchAppearances: { value: "10,950", change: "+4%", isPositive: true },
      conversionRate: "8,940",
      totalClicks: 14200,
    },
    popularity: [
      { day: "Jan", date: "M1", value: 5100 },
      { day: "Feb", date: "M2", value: 6800 },
      { day: "Mar", date: "M3", value: 9400 },
    ],
    customerSources: [
      { day: "Jan", ads: 18500, organic: 4200 },
      { day: "Feb", ads: 24000, organic: 5800, label: "24000" },
      { day: "Mar", ads: 29500, organic: 6900 },
    ],
    clicksBreakdown: [
      { name: "Phone clicks", value: 6100, color: "#34D399" },
      { name: "Whatsapp clicks", value: 2900, color: "#8B5CF6" },
      { name: "Direction clicks", value: 3300, color: "#FBBF24" },
      { name: "Website clicks", value: 1900, color: "#60A5FA" },
    ],
    topPlaces: [
      {
        id: 1,
        name: "House Quarters",
        volume: 2980,
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 2,
        name: "Alakaha",
        volume: 1950,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 3,
        name: "Rumuola",
        volume: 1240,
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        name: "Plaulk Car wash",
        volume: 780,
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 5,
        name: "Ada george",
        volume: 590,
        image:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
  year: {
    kpis: {
      impressions: { value: "84,320", change: "+140%", isPositive: true },
      views: { value: "7,810", change: "+290%", isPositive: true },
      searchAppearances: { value: "48,200", change: "+25%", isPositive: true },
      conversionRate: "39,400",
      totalClicks: 61800,
    },
    popularity: [
      { day: "Q1", date: "24", value: 4600 },
      { day: "Q2", date: "24", value: 6800 },
      { day: "Q3", date: "24", value: 8900 },
      { day: "Q4", date: "24", value: 10400 },
    ],
    customerSources: [
      { day: "Q1", ads: 72000, organic: 18000 },
      { day: "Q2", ads: 94000, organic: 24000 },
      { day: "Q3", ads: 112000, organic: 29000, label: "112k" },
      { day: "Q4", ads: 128000, organic: 34000 },
    ],
    clicksBreakdown: [
      { name: "Phone clicks", value: 26400, color: "#34D399" },
      { name: "Whatsapp clicks", value: 12900, color: "#8B5CF6" },
      { name: "Direction clicks", value: 14200, color: "#FBBF24" },
      { name: "Website clicks", value: 8300, color: "#60A5FA" },
    ],
    topPlaces: [
      {
        id: 1,
        name: "House Quarters",
        volume: 12400,
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 2,
        name: "Alakaha",
        volume: 9100,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 3,
        name: "Rumuola",
        volume: 5300,
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        name: "Plaulk Car wash",
        volume: 3200,
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 5,
        name: "Ada george",
        volume: 2450,
        image:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
};

export default function BusinessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Active Timeframe Pill (Week, Month, Quarter, Year)
  const [timeframe, setTimeframe] = useState("week");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuCard, setActiveMenuCard] = useState(null);

  // Business Account Data
  const { data: businessResp } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const businessName =
    business?.businessName || "Business account name";
  const businessEmail =
    business?.email || "your_business@example.com";

  // Current active data
  const currentData = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA.week;

  const handleLogout = async () => {
    try {
      await logoutBusinessAccount().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    showToast("Logged out", "info");
    navigate("/business/signin");
  };

  // Close card menus on outside click
  useEffect(() => {
    const handler = () => setActiveMenuCard(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="LocalSpot Home"
          >
            <img
              src="/logo.png"
              alt="LocalSpot Logo"
              className="w-7 h-7 object-contain shrink-0"
            />
            <span className="text-base font-extrabold tracking-wider text-gray-900">
              LOCALSPOT
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link
              to="/search"
              className="hover:text-blue-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/saved"
              className="hover:text-blue-600 transition-colors"
            >
              Saved Places
            </Link>
          </nav>

          {/* Profile Circle Icon */}
          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition"
              title="Business profile"
            >
              <UserIcon className="w-4 h-4 text-gray-600" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Explore
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Contact
            </Link>
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 font-medium"
            >
              Saved Places
            </Link>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTAINER (2 COLUMNS: SIDEBAR + DASHBOARD OVERVIEW)
      ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: Business Profile Card & Connected Menu
          ═════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              {/* Profile Avatar & Info */}
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center shadow-xs">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>

                <div className="min-w-0 w-full">
                  <h3
                    className="text-sm sm:text-base font-bold text-gray-900 truncate"
                    title={businessName}
                  >
                    {businessName}
                  </h3>
                  <p
                    className="text-xs text-gray-500 truncate mt-0.5"
                    title={businessEmail}
                  >
                    {businessEmail}
                  </p>
                </div>
              </div>

              {/* Navigation Menu (All Connected to Proper Locations) */}
              <nav className="pt-3 space-y-1">
                <Link
                  to="/business/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <UserIcon className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Business profile</span>
                </Link>

                <Link
                  to="/business/ads"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Megaphone className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Ads manager</span>
                </Link>

                <Link
                  to="/business"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50/70 text-blue-600 transition"
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Analytics &amp; Business data</span>
                </Link>

                <Link
                  to="/business/reviews"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Star className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Reviews</span>
                </Link>

                <Link
                  to="/saved"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Heart className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Favorites</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: Analytics Dashboard Overview
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header: Title & Timeframe Filter Pills */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                Analytics
              </h1>

              {/* Timeframe Filter Pills (Week, Month, Quarter, Year) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {["week", "month", "quarter", "year"].map((tf) => {
                  const isActive = timeframe === tf;
                  const label =
                    tf.charAt(0).toUpperCase() + tf.slice(1);
                  return (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => {
                        setTimeframe(tf);
                        showToast(`Showing ${label} metrics`, "info");
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                        isActive
                          ? "bg-white text-gray-900 border border-gray-900 shadow-xs"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                ROW 1: 3 KPI CARDS
            ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Total impressions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-medium">Total impressions</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuCard(
                        activeMenuCard === "kpi1" ? null : "kpi1"
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {currentData.kpis.impressions.value}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ArrowUpRight className="w-3 h-3" />
                    {currentData.kpis.impressions.change}
                  </span>
                </div>
              </div>

              {/* Card 2: Profile views */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-medium">Profile views</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuCard(
                        activeMenuCard === "kpi2" ? null : "kpi2"
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {currentData.kpis.views.value}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ArrowUpRight className="w-3 h-3" />
                    {currentData.kpis.views.change}
                  </span>
                </div>
              </div>

              {/* Card 3: Search appearances */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-medium">Search appearances</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuCard(
                        activeMenuCard === "kpi3" ? null : "kpi3"
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {currentData.kpis.searchAppearances.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      currentData.kpis.searchAppearances.isPositive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-500 border border-red-200"
                    }`}
                  >
                    {currentData.kpis.searchAppearances.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {currentData.kpis.searchAppearances.change}
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                ROW 2: POPULARITY LINE CHART + TOTAL CLICKS DONUT CHART
            ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Chart: Your business popularity (~60%) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Your business popularity
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={currentData.popularity}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="popularityGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#60A5FA"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#60A5FA"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#9CA3AF" }}
                        tickFormatter={(value, index) => {
                          const item = currentData.popularity[index];
                          return item?.date
                            ? `${value} ${item.date}`
                            : value;
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        domain={[0, 10000]}
                        tickFormatter={(val) =>
                          val === 0 ? "0" : `${val / 1000}k`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                        formatter={(val) => [`${val} visitors`, "Popularity"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        fill="url(#popularityGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#2563EB" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Chart: Total Clicks Donut Chart (~40%) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Total Clicks
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
                  {currentData.kpis.totalClicks.toLocaleString()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Donut Chart */}
                  <div className="sm:col-span-5 h-36 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentData.clicksBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={56}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {currentData.clicksBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderRadius: "8px",
                            fontSize: "11px",
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend Counts */}
                  <div className="sm:col-span-7 space-y-2 text-xs">
                    {currentData.clicksBreakdown.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-gray-600 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[11px] truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                ROW 3: CUSTOMER SOURCES BAR CHART + CONVERSION RATE
            ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Bar Chart: Customer Sources (~75%) */}
              <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Customer Sources
                  </h3>

                  {/* Legend: From ads & Organic */}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                      From ads
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-gray-800" />
                      Organic
                    </span>
                  </div>
                </div>

                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={currentData.customerSources}
                      margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                      barSize={18}
                    >
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        domain={[0, 3000]}
                        ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      />
                      <Bar
                        dataKey="ads"
                        fill="#14B8A6"
                        radius={[6, 6, 0, 0]}
                        label={{
                          position: "top",
                          fill: "#111827",
                          fontSize: 10,
                          fontWeight: 700,
                          formatter: (val) => (val === 2550 ? "2550" : ""),
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Card: Conversion rate (~25%) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                    Conversion rate
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    {currentData.kpis.conversionRate}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    Verified customer visits &amp; inquiries
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                  <Link to="/business/ads" className="hover:underline">
                    Boost conversion →
                  </Link>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                ROW 4: TOP 5 PLACES (WORLD MAP + LOCATIONS TABLE)
            ───────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: World Map with Glowing Radar Pins (lg:col-span-7) */}
                <div className="lg:col-span-7">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3">
                    Top 5 places
                  </h3>

                  <div className="relative w-full h-56 sm:h-64 rounded-xl bg-gray-50/70 border border-gray-100 overflow-hidden flex items-center justify-center p-2">
                    {/* SVG Vector World Map Paths */}
                    <svg
                      viewBox="0 0 1000 500"
                      className="w-full h-full opacity-60"
                      fill="#D1D5DB"
                    >
                      {/* Americas */}
                      <path d="M150,120 Q180,90 220,110 T250,180 T210,250 T180,300 T210,420 T190,460 T160,350 T130,220 Z" />
                      <path d="M230,100 Q260,80 320,90 T350,140 T300,170 T240,140 Z" />
                      {/* Europe */}
                      <path d="M470,120 Q520,100 560,130 T540,180 T480,190 T460,150 Z" />
                      {/* Africa */}
                      <path d="M480,210 Q540,200 580,240 T570,360 T510,400 T470,300 T460,240 Z" />
                      {/* Asia */}
                      <path d="M590,110 Q700,90 820,120 T860,220 T760,280 T680,240 T600,180 Z" />
                      {/* Australia */}
                      <path d="M780,340 Q840,320 880,350 T860,420 T800,430 T760,380 Z" />
                    </svg>

                    {/* Glowing Location Pins */}
                    {/* Location 1: North America */}
                    <div className="absolute top-[32%] left-[24%]">
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 animate-ping absolute -top-1 -left-1" />
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-md border border-white" />
                    </div>

                    {/* Location 2: Europe/UK */}
                    <div className="absolute top-[28%] left-[50%]">
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 animate-ping absolute -top-1 -left-1" />
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-md border border-white" />
                    </div>

                    {/* Location 3: West Africa / Nigeria */}
                    <div className="absolute top-[52%] left-[49%]">
                      <div className="w-6 h-6 rounded-full bg-blue-500/40 animate-ping absolute -top-1.5 -left-1.5" />
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-md border border-white" />
                    </div>

                    {/* Location 4: Asia */}
                    <div className="absolute top-[36%] left-[68%]">
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 animate-ping absolute -top-1 -left-1" />
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-md border border-white" />
                    </div>

                    {/* Location 5: Australia */}
                    <div className="absolute top-[75%] left-[82%]">
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 animate-ping absolute -top-1 -left-1" />
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-md border border-white" />
                    </div>
                  </div>
                </div>

                {/* Right: Table of Top Places (lg:col-span-5) */}
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <span>Names</span>
                    <div className="flex gap-10">
                      <span>#</span>
                      <span className="w-24">place</span>
                      <span>volume</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentData.topPlaces.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs font-semibold py-1 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-gray-400 w-4">{p.id}</span>
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 px-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-6 h-6 rounded-md object-cover shrink-0 border border-gray-200"
                          />
                          <span className="text-gray-800 truncate">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-gray-900 font-bold shrink-0">
                          {p.volume}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. EXISTING APPLICATION FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}