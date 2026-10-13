// src/pages/business/BusinessAds.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Megaphone,
  Plus,
  Eye,
  Heart,
  Phone,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  Search,
  Trash2,
  UploadCloud,
  Check,
  X,
  ChevronDown,
  User as UserIcon,
  Store,
  Star,
  LogOut,
  Image as ImageIcon,
  Loader2,
  Menu,
  Building2,
  DollarSign,
  Layers,
  ArrowRight,
  Info,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";

import {
  useListMyAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useDeleteMyAdvertisementMutation,
} from "../../features/adsApiSlice";
import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

// ─── Initial Campaigns (Exact items from Screenshot) ─────────────────
const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    type: "Promotional offer",
    typeColor: "bg-gray-100 text-gray-700",
    price: "$1,360",
    address: "444 Park Ave, Brooklyn, NY 11205",
    sqm: "45 sq.m",
    created: "12/06/2024",
    status: "active",
    statusTab: "active",
    views: 678,
    likes: 5,
    calls: 1,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    actionType: "statistics",
  },
  {
    id: "camp-2",
    type: "Featured listing",
    typeColor: "bg-gray-100 text-gray-700",
    price: "$1,360",
    address: "444 Park Ave, Brooklyn, NY 11205",
    sqm: "45 sq.m",
    created: "12/06/2024",
    status: "active",
    statusTab: "active",
    views: 678,
    likes: 5,
    calls: 1,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    actionType: "statistics",
  },
  {
    id: "camp-3",
    type: "Full Campaign",
    typeColor: "bg-gray-100 text-gray-700",
    price: "$--.---",
    address: "517 82nd St, Brooklyn, NY 11209",
    sqm: "00 sq.m",
    created: "13/12/2024",
    status: "draft",
    statusTab: "draft",
    views: 0,
    likes: 0,
    calls: 0,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    actionType: "finish",
  },
];

// Tabs from Screenshot 1
const STATUS_TABS = [
  { id: "active", label: "Active", count: 3 },
  { id: "pending", label: "Pending approval", count: 2 },
  { id: "draft", label: "Drafts", count: 2 },
  { id: "rejected", label: "Rejected", count: 0 },
  { id: "expired", label: "Expired/Disabled", count: 0 },
];

// Sample Products for Product Selector
const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Aurelia Cotton Maxi Dress",
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "p2",
    name: "Klass Linen Button Shirt",
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "p3",
    name: "Fiona Ruffled Shell Top",
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80",
  },
];

// Sales Team Members
const SALES_TEAM = [
  {
    id: "st-1",
    name: "Laura Fox",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    assigned: true,
  },
  {
    id: "st-2",
    name: "Denis Carlson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    assigned: false,
  },
  {
    id: "st-3",
    name: "Ryan Killgore",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    assigned: true,
  },
  {
    id: "st-4",
    name: "Vashitha Rath",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    assigned: false,
  },
  {
    id: "st-5",
    name: "Ashley Jordan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    assigned: true,
  },
  {
    id: "st-6",
    name: "Sarah McLaudrin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    assigned: false,
  },
];

export default function BusinessAds({ initialView = "list" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Determine view: 'list' or 'create' based on prop, query, or path
  const [view, setView] = useState(() => {
    if (initialView === "create" || location.pathname.includes("/create")) {
      return "create";
    }
    return "list";
  });

  useEffect(() => {
    if (location.pathname.includes("/create")) {
      setView("create");
    } else {
      setView("list");
    }
  }, [location.pathname]);

  // Account Data
  const { data: businessResp } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const businessName =
    business?.businessName || "Business account name";
  const businessEmail =
    business?.email || "your_business@example.com";

  // List View State
  const [activeTab, setActiveTab] = useState("active");
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [selectedStatsAd, setSelectedStatsAd] = useState(null);
  const [activeGearMenuId, setActiveGearMenuId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create Form State (Exact fields from Screenshot 2)
  const [campaignName, setCampaignName] = useState(
    "Weekend Wardrobe Refresh"
  );
  const [campaignType, setCampaignType] = useState("Discount");
  const [campaignGoal, setCampaignGoal] = useState("Increase Sales");

  // Timeline
  const [startDate, setStartDate] = useState("Jan 12, 2025");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("Jan 14, 2025");
  const [endTime, setEndTime] = useState("12:00");
  const [timezone, setTimezone] = useState("Asia/Jakarta (GMT+7)");
  const [timePeriod, setTimePeriod] = useState("AM/PM");

  // Incentive
  const [offerType, setOfferType] = useState("Percentage discount");
  const [minPurchase, setMinPurchase] = useState("$20");
  const [discountValue, setDiscountValue] = useState("15%");
  const [promoCode, setPromoCode] = useState("WEEKEND15");
  const [autoApplyPromo, setAutoApplyPromo] = useState(false);

  // Products
  const [productApplyMode, setProductApplyMode] = useState("specific"); // 'all' | 'specific'
  const [selectedCategories, setSelectedCategories] = useState([
    "Dresses",
    "Tops",
  ]);
  const [selectedProducts, setSelectedProducts] = useState(INITIAL_PRODUCTS);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [excludedSearchQuery, setExcludedSearchQuery] = useState("");

  // Budget
  const [campaignBudget, setCampaignBudget] = useState("$500");
  const [dailyBudget, setDailyBudget] = useState("$50");
  const [expectedDuration, setExpectedDuration] = useState("7 days");

  // Campaign Image
  const [campaignImagePreview, setCampaignImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  // Target Audience
  const [customerSegmentType, setCustomerSegmentType] = useState(
    "Customer segment"
  );
  const [locationsSelected, setLocationsSelected] = useState([
    "Indonesia",
    "Malaysia",
  ]);
  const [customerTypesSelected, setCustomerTypesSelected] = useState([
    "Returning",
    "VIP",
  ]);
  const [purchaseHistory, setPurchaseHistory] = useState(
    "Bought 1+ item in last 30 days"
  );
  const [lastActiveDate, setLastActiveDate] = useState(
    "Active within last 30 days"
  );

  // Channels
  const [channelsSelected, setChannelsSelected] = useState([
    "Email",
    "Website",
  ]);

  // Sales Team
  const [personInCharge, setPersonInCharge] = useState("Mario Prat");
  const [salesTeamMembers, setSalesTeamMembers] = useState(SALES_TEAM);

  // Close gear menu when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveGearMenuId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    if (activeTab === "active") {
      return campaigns.filter((c) => c.statusTab === "active");
    }
    if (activeTab === "draft") {
      return campaigns.filter((c) => c.statusTab === "draft");
    }
    return campaigns.filter((c) => c.statusTab === activeTab);
  }, [campaigns, activeTab]);

  // Handlers
  const handleOpenCreate = () => {
    setView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelCreate = () => {
    setView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCampaignImagePreview(URL.createObjectURL(file));
      showToast("Campaign image uploaded", "success");
    }
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product removed from campaign", "info");
  };

  const handleToggleLocation = (loc) => {
    setLocationsSelected((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleToggleCustomerType = (ct) => {
    setCustomerTypesSelected((prev) =>
      prev.includes(ct) ? prev.filter((t) => t !== ct) : [...prev, ct]
    );
  };

  const handleToggleChannel = (ch) => {
    setChannelsSelected((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleToggleTeamMember = (id) => {
    setSalesTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, assigned: !m.assigned } : m))
    );
  };

  const handleSaveDraft = () => {
    const newDraft = {
      id: `camp-${Date.now()}`,
      type: campaignType,
      typeColor: "bg-gray-100 text-gray-700",
      price: campaignBudget || "$--.---",
      address: "444 Park Ave, Brooklyn, NY 11205",
      sqm: "45 sq.m",
      created: new Date().toLocaleDateString("en-GB"),
      status: "draft",
      statusTab: "draft",
      views: 0,
      likes: 0,
      calls: 0,
      image:
        campaignImagePreview ||
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      actionType: "finish",
    };
    setCampaigns([newDraft, ...campaigns]);
    showToast("Campaign saved to drafts", "info");
    setView("list");
  };

  const handleLaunchCampaign = () => {
    if (!campaignName.trim()) {
      showToast("Please enter a campaign name", "error");
      return;
    }
    const newCampaign = {
      id: `camp-${Date.now()}`,
      type: campaignType,
      typeColor: "bg-gray-100 text-gray-700",
      price: campaignBudget || "$1,360",
      address: "444 Park Ave, Brooklyn, NY 11205",
      sqm: "45 sq.m",
      created: new Date().toLocaleDateString("en-GB"),
      status: "active",
      statusTab: "active",
      views: 1,
      likes: 0,
      calls: 0,
      image:
        campaignImagePreview ||
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      actionType: "statistics",
    };
    setCampaigns([newCampaign, ...campaigns]);
    showToast("Campaign launched successfully!", "success");
    setView("list");
  };

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

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION HEADER (Matching Screenshots)
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

          {/* Desktop Nav Links (from screenshots: Explore, About Us, Contact, Saved Places) */}
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

          {/* Right User Avatar Profile Icon */}
          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition"
              title="Business Profile"
            >
              <UserIcon className="w-4 h-4 text-gray-600" />
            </Link>

            {/* Mobile Menu Toggle */}
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
          2. BREADCRUMB (Shown on Create New Ad)
      ───────────────────────────────────────────────────────────── */}
      {view === "create" && (
        <div className="bg-white border-b border-gray-200/80">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
            <nav
              className="flex items-center gap-2 text-xs text-gray-500 font-medium"
              aria-label="Breadcrumb"
            >
              <Link
                to="/business"
                className="hover:text-blue-600 transition-colors"
              >
                My profile
              </Link>
              <span className="text-gray-400 font-normal">›</span>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="hover:text-blue-600 transition-colors"
              >
                Ads manager
              </button>
              <span className="text-gray-400 font-normal">›</span>
              <span className="text-gray-900 font-semibold">
                Create new ad
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN LAYOUT (2 COLUMNS: SIDEBAR + CONTENT)
      ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: Business Profile Card & Menu
          ═════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              {/* Profile Avatar & Info (exact layout from screenshot) */}
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

              {/* Navigation Menu */}
              <nav className="pt-3 space-y-1">
                <Link
                  to="/business/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <UserIcon className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Business profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    view === "list" || view === "create"
                      ? "bg-blue-50/70 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>Ads manager</span>
                </button>

                <Link
                  to="/business"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <BarChart3 className="w-4 h-4 shrink-0 text-gray-500" />
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
              RIGHT COLUMN: Main Content Area
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-6">
            {/* ═══════════════════════════════════════════════════════
                VIEW 1: AD CAMPAIGNS LIST (Screenshot 1)
            ═══════════════════════════════════════════════════════ */}
            {view === "list" && (
              <div className="space-y-6">
                {/* Header Row: Title & Start a new advert button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Ad campaigns
                  </h1>

                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white shadow-sm transition transform active:scale-95"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>Start a new advert</span>
                  </button>
                </div>

                {/* Filter Tabs Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {STATUS_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                          isActive
                            ? "bg-white text-gray-900 border border-gray-900 shadow-xs"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    );
                  })}
                </div>

                {/* Campaigns Cards List */}
                <div className="space-y-4">
                  {filteredCampaigns.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                      <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-gray-700 mb-1">
                        No campaigns in this tab
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">
                        Launch an advertisement to promote your business and drive visits.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl"
                      >
                        Create an advert
                      </button>
                    </div>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-gray-300 transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                          {/* Left: Image Container */}
                          <div className="md:col-span-4 h-36 sm:h-40 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center shrink-0">
                            {camp.image ? (
                              <img
                                src={camp.image}
                                alt={camp.type}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-12 h-12 text-gray-300" />
                            )}
                          </div>

                          {/* Middle: Content */}
                          <div className="md:col-span-5 space-y-1.5 min-w-0">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                              {camp.type}
                            </span>

                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                              {camp.price}
                            </h3>

                            <p className="text-xs text-gray-600 font-medium truncate">
                              {camp.address}
                            </p>

                            <p className="text-xs font-bold text-gray-800">
                              {camp.sqm}
                            </p>
                          </div>

                          {/* Right: Date, Actions, and Metrics */}
                          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end h-full space-y-4 pt-2 md:pt-0">
                            <p className="text-[11px] text-gray-400 font-medium">
                              Created: {camp.created}
                            </p>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                              {camp.actionType === "statistics" ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStatsAd(camp)}
                                  className="px-4 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition"
                                >
                                  Statistics
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleOpenCreate}
                                  className="px-4 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition"
                                >
                                  Finish and publish
                                </button>
                              )}

                              {/* Settings Gear Dropdown */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveGearMenuId(
                                      activeGearMenuId === camp.id
                                        ? null
                                        : camp.id
                                    );
                                  }}
                                  className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 shadow-2xs transition"
                                  title="Campaign options"
                                >
                                  <Settings className="w-3.5 h-3.5" />
                                </button>

                                {activeGearMenuId === camp.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in duration-100"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveGearMenuId(null);
                                        handleOpenCreate();
                                      }}
                                      className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                                    >
                                      Edit campaign
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveGearMenuId(null);
                                        showToast(
                                          "Campaign status toggled",
                                          "info"
                                        );
                                      }}
                                      className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                                    >
                                      Pause / Resume
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveGearMenuId(null);
                                        setCampaigns(
                                          campaigns.filter(
                                            (c) => c.id !== camp.id
                                          )
                                        );
                                        showToast(
                                          "Campaign removed",
                                          "error"
                                        );
                                      }}
                                      className="w-full text-left px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Metrics Counter Footer */}
                            <div className="flex items-center gap-3.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {camp.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {camp.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {camp.calls}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                VIEW 2: CREATE A NEW ADVERT (Screenshot 2)
            ═══════════════════════════════════════════════════════ */}
            {view === "create" && (
              <div className="space-y-6">
                {/* Header Row: Title & Cancel */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Create a new advert
                  </h1>

                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                    <span>Cancel</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8">
                  {/* ─────────────────────────────────────────────────
                      1. Basic Info
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Basic Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          placeholder="e.g. Weekend Wardrobe Refresh"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Campaign Type
                        </label>
                        <div className="relative">
                          <select
                            value={campaignType}
                            onChange={(e) => setCampaignType(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                          >
                            <option value="Discount">Discount</option>
                            <option value="Promotional offer">
                              Promotional offer
                            </option>
                            <option value="Featured listing">
                              Featured listing
                            </option>
                            <option value="Full Campaign">
                              Full Campaign
                            </option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Goal
                        </label>
                        <div className="relative">
                          <select
                            value={campaignGoal}
                            onChange={(e) => setCampaignGoal(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                          >
                            <option value="Increase Sales">
                              Increase Sales
                            </option>
                            <option value="Brand Awareness">
                              Brand Awareness
                            </option>
                            <option value="Drive Foot Traffic">
                              Drive Foot Traffic
                            </option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      2. Timeline
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Timeline
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Start Date & Time */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Start Date &amp; Time
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* End Date & Time */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          End Date &amp; Time
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          />
                          <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Timezone */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Timezone
                        </label>
                        <div className="relative">
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="Asia/Jakarta (GMT+7)">
                              Asia/Jakarta (GMT+7)
                            </option>
                            <option value="Europe/London (GMT+0)">
                              Europe/London (GMT+0)
                            </option>
                            <option value="America/New_York (GMT-5)">
                              America/New_York (GMT-5)
                            </option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="AM/PM">AM/PM</option>
                            <option value="24 Hours">24 Hours</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      3. Incentive Setup
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Incentive Setup
                    </h3>
                    <div className="space-y-4">
                      {/* Row 1: Offer Type & Min Purchase */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Offer Type
                          </label>
                          <div className="relative">
                            <select
                              value={offerType}
                              onChange={(e) => setOfferType(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                            >
                              <option value="Percentage discount">
                                Percentage discount
                              </option>
                              <option value="Fixed amount discount">
                                Fixed amount discount
                              </option>
                              <option value="Free Gift">Free Gift</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Minimum Purchase Requirement
                          </label>
                          <input
                            type="text"
                            value={minPurchase}
                            onChange={(e) => setMinPurchase(e.target.value)}
                            placeholder="$20"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Row 2: Discount Value & Promo Code */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Discount Value
                          </label>
                          <input
                            type="text"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            placeholder="15%"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <p className="text-[10px] text-red-500 mt-1">
                            Discount value is reflected during customer checkout.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Promo Code
                          </label>
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter Promo Code"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                          />
                          <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={autoApplyPromo}
                              onChange={(e) =>
                                setAutoApplyPromo(e.target.checked)
                              }
                              className="w-3.5 h-3.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-600">
                              Automatic promotion apply
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      4. Products
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Products
                    </h3>

                    {/* Apply To Toggle Buttons */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Apply To
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setProductApplyMode("all")}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                            productApplyMode === "all"
                              ? "bg-blue-50 text-blue-600 border-blue-300"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          All products
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductApplyMode("specific")}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                            productApplyMode === "specific"
                              ? "bg-blue-50 text-blue-600 border-blue-300"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          ✓ Specific Products
                        </button>
                      </div>
                    </div>

                    {/* 3 Columns: Categories, Product Selector, Excluded Products */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Categories Checkboxes */}
                      <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                        <p className="text-xs font-bold text-gray-700 mb-2">
                          Categories
                        </p>
                        {["Dresses", "Tops", "Outerwear", "Pants", "Skirts"].map(
                          (cat) => {
                            const isChecked = selectedCategories.includes(cat);
                            return (
                              <label
                                key={cat}
                                className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 hover:text-gray-900"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleCategory(cat)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span>{cat}</span>
                              </label>
                            );
                          }
                        )}
                      </div>

                      {/* Product Selector with Selected list */}
                      <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                        <p className="text-xs font-bold text-gray-700 mb-1">
                          Product Selector
                        </p>
                        <div className="relative mb-2">
                          <input
                            type="text"
                            value={productSearchQuery}
                            onChange={(e) =>
                              setProductSearchQuery(e.target.value)
                            }
                            placeholder="Search Product"
                            className="w-full pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                          />
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2" />
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {selectedProducts.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white border border-gray-200 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-7 h-7 rounded object-cover shrink-0"
                                />
                                <span className="truncate text-[11px] font-medium text-gray-800">
                                  {p.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(p.id)}
                                className="text-gray-400 hover:text-red-500 shrink-0"
                                title="Remove product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Excluded Products */}
                      <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                        <p className="text-xs font-bold text-gray-700 mb-1">
                          Excluded Products
                        </p>
                        <div className="relative">
                          <input
                            type="text"
                            value={excludedSearchQuery}
                            onChange={(e) =>
                              setExcludedSearchQuery(e.target.value)
                            }
                            placeholder="Search Product"
                            className="w-full pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                          />
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2" />
                        </div>
                        <p className="text-[11px] text-gray-400 italic pt-2">
                          No products currently excluded from this offer.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      5. Budget & Cost Control
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Budget &amp; Cost Control
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Campaign Budget
                        </label>
                        <input
                          type="text"
                          value={campaignBudget}
                          onChange={(e) => setCampaignBudget(e.target.value)}
                          placeholder="$500"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Daily Budget Limit
                        </label>
                        <input
                          type="text"
                          value={dailyBudget}
                          onChange={(e) => setDailyBudget(e.target.value)}
                          placeholder="$50"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Expected Duration
                        </label>
                        <input
                          type="text"
                          value={expectedDuration}
                          onChange={(e) => setExpectedDuration(e.target.value)}
                          placeholder="7 days"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      6. Campaign Image File
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Campaign Image File
                    </h3>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[140px]"
                    >
                      {campaignImagePreview ? (
                        <div className="relative w-full max-w-sm h-36 rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={campaignImagePreview}
                            alt="Campaign Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCampaignImagePreview(null);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs text-gray-700 font-semibold">
                            Drag and drop your image or{" "}
                            <span className="text-blue-600 underline">
                              Browse image
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Max size 10MB
                          </p>
                        </>
                      )}
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      7. Target Audience
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Target Audience
                    </h3>
                    <div className="space-y-4">
                      {/* Customer Type Select */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Customer Type
                        </label>
                        <div className="relative">
                          <select
                            value={customerSegmentType}
                            onChange={(e) =>
                              setCustomerSegmentType(e.target.value)
                            }
                            className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                          >
                            <option value="Customer segment">
                              Customer segment
                            </option>
                            <option value="All active users">
                              All active users
                            </option>
                            <option value="Local area residents">
                              Local area residents
                            </option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Location Pills */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {["Indonesia", "Singapore", "Malaysia"].map((loc) => {
                            const isSelected = locationsSelected.includes(loc);
                            return (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => handleToggleLocation(loc)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                                  isSelected
                                    ? "bg-blue-50 text-blue-600 border-blue-300"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                {isSelected ? `✓ ${loc}` : loc}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Customer type Pills */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Customer type
                        </label>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {["New", "Returning", "VIP"].map((ct) => {
                            const isSelected = customerTypesSelected.includes(ct);
                            return (
                              <button
                                key={ct}
                                type="button"
                                onClick={() => handleToggleCustomerType(ct)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                                  isSelected
                                    ? "bg-blue-50 text-blue-600 border-blue-300"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                {isSelected ? `✓ ${ct}` : ct}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Purchase History & Last Active Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Purchase History
                          </label>
                          <div className="relative">
                            <select
                              value={purchaseHistory}
                              onChange={(e) =>
                                setPurchaseHistory(e.target.value)
                              }
                              className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                            >
                              <option value="Bought 1+ item in last 30 days">
                                Bought 1+ item in last 30 days
                              </option>
                              <option value="Bought 3+ items this year">
                                Bought 3+ items this year
                              </option>
                              <option value="First-time purchaser">
                                First-time purchaser
                              </option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Last Active Date
                          </label>
                          <div className="relative">
                            <select
                              value={lastActiveDate}
                              onChange={(e) =>
                                setLastActiveDate(e.target.value)
                              }
                              className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                            >
                              <option value="Active within last 30 days">
                                Active within last 30 days
                              </option>
                              <option value="Active within last 7 days">
                                Active within last 7 days
                              </option>
                              <option value="All recorded users">
                                All recorded users
                              </option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      8. Channels & Distribution
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Channels &amp; Distribution
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {["Email", "Website", "Mobile App"].map((ch) => {
                        const isSelected = channelsSelected.includes(ch);
                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => handleToggleChannel(ch)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                              isSelected
                                ? "bg-blue-50 text-blue-600 border-blue-300"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {isSelected ? `✓ ${ch}` : ch}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      9. Sales Team Assignment
                  ───────────────────────────────────────────────── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Sales Team Assignment
                    </h3>
                    <div className="space-y-4">
                      {/* Person in charge */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Person in charge
                        </label>
                        <div className="relative">
                          <select
                            value={personInCharge}
                            onChange={(e) => setPersonInCharge(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                          >
                            <option value="Mario Prat">Mario Prat</option>
                            <option value="Laura Fox">Laura Fox</option>
                            <option value="Ashley Jordan">Ashley Jordan</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Multi-select checkboxes */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Sales Team Assignment
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {salesTeamMembers.map((member) => (
                            <label
                              key={member.id}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition ${
                                member.assigned
                                  ? "bg-blue-50/50 border-blue-200 text-gray-900"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={member.assigned}
                                onChange={() =>
                                  handleToggleTeamMember(member.id)
                                }
                                className="w-3.5 h-3.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                              <span className="text-xs font-medium truncate">
                                {member.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons at Bottom of Form */}
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                    >
                      Save to draft
                    </button>
                    <button
                      type="button"
                      onClick={handleLaunchCampaign}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition shadow-sm"
                    >
                      Launch campaign
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. STATISTICS MODAL (When user clicks "Statistics")
      ───────────────────────────────────────────────────────────── */}
      {selectedStatsAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedStatsAd.type}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  Campaign Performance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStatsAd(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-[11px] text-gray-400 font-medium">Views</p>
                <p className="text-lg font-black text-gray-900">
                  {selectedStatsAd.views.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-[11px] text-gray-400 font-medium">Likes</p>
                <p className="text-lg font-black text-gray-900">
                  {selectedStatsAd.likes}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-[11px] text-gray-400 font-medium">Inquiries</p>
                <p className="text-lg font-black text-gray-900">
                  {selectedStatsAd.calls}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 mb-5">
              <div className="flex justify-between">
                <span>Address target:</span>
                <strong className="text-gray-800">
                  {selectedStatsAd.address}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Created date:</span>
                <strong className="text-gray-800">
                  {selectedStatsAd.created}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Budget allocated:</span>
                <strong className="text-gray-800">
                  {selectedStatsAd.price}
                </strong>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStatsAd(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. EXISTING APPLICATION FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}