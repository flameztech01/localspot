// src/pages/business/BusinessProfile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Store,
  BadgeCheck,
  Clock,
  AlertCircle,
  XCircle,
  Edit3,
  X,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Trash2,
  MapPin,
  Phone,
  Globe,
  Tag,
  Save,
  ArrowLeft,
  Loader2,
  Star,
  Eye,
  LogOut,
  Camera,
} from "lucide-react";

import {
  useGetCurrentBusinessAccountQuery,
  useUpdateBusinessProfileMutation,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import BusinessSidebar from "../../components/BusinessSidebar";
import BusinessBottombar from "../../components/BusinessBottombar";

// ─── Constants ─────────────────────────────────────────────
const ACCENT = "#3B82F6";
const MIN_BUSINESS_IMAGES = 10;
const MAX_BUSINESS_IMAGES = 20;

const BUSINESS_TYPES = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "other", label: "Other" },
];

const PRICE_RANGES = [
  { value: 1, label: "$", hint: "Budget" },
  { value: 2, label: "$$", hint: "Moderate" },
  { value: 3, label: "$$$", hint: "Premium" },
  { value: 4, label: "$$$$", hint: "Luxury" },
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_HOURS = DAY_NAMES.map((_, day) => ({
  day,
  open: "09:00",
  close: "17:00",
  closed: false,
}));

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Small helpers ─────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
      {label}
    </label>
    {children}
  </div>
);

const DisplayValue = ({ value, placeholder = "Not set", link }) => {
  if (!value) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
        {placeholder}
      </p>
    );
  }
  if (link) {
    const href = link.startsWith("http") ? link : `https://${link}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-sm text-[#3B82F6] hover:underline break-all"
      >
        {value}
      </a>
    );
  }
  return (
    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line break-words">
      {value}
    </p>
  );
};

// ─── Circular progress ring ────────────────────────────────
const ProgressRing = ({ value = 0, size = 80 }) => {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={ACCENT}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-gray-800 dark:text-white">
          {value}%
        </span>
      </div>
    </div>
  );
};

// ─── Component ─────────────────────────────────────────────
const BusinessProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const {
    data: businessResp,
    isLoading: bizLoading,
    error: bizError,
    refetch: refetchBusiness,
  } = useGetCurrentBusinessAccountQuery();

  const business = businessResp?.data || businessResp;
  const isUnauthorized = bizError?.status === 401;

  const [updateBusinessProfile, { isLoading: isSaving }] =
    useUpdateBusinessProfileMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const [loggingOut, setLoggingOut] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // ─── Draft form state ─────────────────────────────────────
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    businessType: "other",
    website: "",
    phone: "",
    address: "",
    priceRange: 2,
    tags: [],
    location: { city: "", state: "", country: "", address: "" },
    openingHours: DEFAULT_HOURS,
  });

  const [tagInput, setTagInput] = useState("");

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const imagesInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Hydrate form when business loads
  useEffect(() => {
    if (!business) return;
    setFormData({
      businessName: business.businessName || "",
      description: business.description || "",
      businessType: business.businessType || "other",
      website: business.website || "",
      phone: business.phone || "",
      address: business.address || "",
      priceRange: business.priceRange || 2,
      tags: Array.isArray(business.tags) ? business.tags : [],
      location: {
        city: business.location?.city || "",
        state: business.location?.state || "",
        country: business.location?.country || "",
        address: business.location?.address || "",
      },
      openingHours:
        Array.isArray(business.openingHours) && business.openingHours.length > 0
          ? business.openingHours
          : DEFAULT_HOURS,
    });
    setExistingImages(Array.isArray(business.images) ? business.images : []);
    setRemovedImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setCoverFile(null);
    setCoverPreview(null);
  }, [business]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ─── Field handlers ───────────────────────────────────────
  const handleFieldChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLocationChange = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const handleHoursChange = (day, field, value) =>
    setFormData((prev) => ({
      ...prev,
      openingHours: prev.openingHours.map((h) =>
        h.day === day ? { ...h, [field]: value } : h,
      ),
    }));

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (formData.tags.includes(t)) return setTagInput("");
    if (formData.tags.length >= 10) {
      showToast("You can add up to 10 tags", "error");
      return;
    }
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  };

  const removeTag = (tag) =>
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));

  // ─── Image handlers ───────────────────────────────────────
  const totalImageCount = existingImages.length + newImageFiles.length;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_BUSINESS_IMAGES - totalImageCount;
    if (remaining <= 0) {
      showToast(`You already have ${MAX_BUSINESS_IMAGES} images`, "error");
      e.target.value = "";
      return;
    }
    const accepted = files.slice(0, remaining);
    setNewImageFiles((prev) => [...prev, ...accepted]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
    if (files.length > remaining) {
      showToast(
        `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed`,
        "error",
      );
    }
    e.target.value = "";
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      const url = prev[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // ─── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    const fd = new FormData();
    fd.append("businessName", formData.businessName);
    fd.append("description", formData.description);
    fd.append("businessType", formData.businessType);
    fd.append("website", formData.website);
    fd.append("phone", formData.phone);
    fd.append("address", formData.address);
    fd.append("priceRange", String(formData.priceRange));
    fd.append("tags", JSON.stringify(formData.tags));
    fd.append("location", JSON.stringify(formData.location));
    fd.append("openingHours", JSON.stringify(formData.openingHours));

    if (removedImages.length > 0) {
      fd.append("removeImages", JSON.stringify(removedImages));
    }
    newImageFiles.forEach((file) => fd.append("images", file));
    if (coverFile) fd.append("coverImage", coverFile);

    try {
      const result = await updateBusinessProfile(fd).unwrap();
      showToast(result?.message || "Business profile updated", "success");

      newImagePreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);

      setRemovedImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setCoverFile(null);
      setCoverPreview(null);
      setEditMode(false);
      refetchBusiness();
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        "Failed to update profile";
      showToast(msg, "error");
    }
  };

  const handleCancel = () => {
    newImagePreviews.forEach((url) => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setRemovedImages([]);
    setCoverFile(null);
    setCoverPreview(null);
    setTagInput("");
    setEditMode(false);
    if (business) {
      setFormData({
        businessName: business.businessName || "",
        description: business.description || "",
        businessType: business.businessType || "other",
        website: business.website || "",
        phone: business.phone || "",
        address: business.address || "",
        priceRange: business.priceRange || 2,
        tags: Array.isArray(business.tags) ? business.tags : [],
        location: {
          city: business.location?.city || "",
          state: business.location?.state || "",
          country: business.location?.country || "",
          address: business.location?.address || "",
        },
        openingHours:
          Array.isArray(business.openingHours) &&
          business.openingHours.length > 0
            ? business.openingHours
            : DEFAULT_HOURS,
      });
      setExistingImages(Array.isArray(business.images) ? business.images : []);
    }
  };

  // ─── Derived ──────────────────────────────────────────────
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

  const statusMeta = {
    approved: {
      label: "Verified Business",
      color:
        "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      Icon: BadgeCheck,
    },
    pending: {
      label: "Pending Approval",
      color:
        "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
      Icon: Clock,
    },
    rejected: {
      label: "Rejected",
      color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
      Icon: XCircle,
    },
    unverified: {
      label: "Email Unverified",
      color: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
      Icon: AlertCircle,
    },
  }[approvalStatus];

  const StatusIcon = statusMeta.Icon;
  const initials = (business?.businessName || "B").charAt(0).toUpperCase();

  const galleryTotal = existingImages.length + newImageFiles.length;
  const galleryReady = galleryTotal >= MIN_BUSINESS_IMAGES;

  // Completion checklist — only what the backend supports
  const completionItems = [
    { label: "Business name", done: !!business?.businessName },
    { label: "Business description", done: !!business?.description },
    {
      label: "Confirm your location",
      done: !!(business?.location?.city || business?.address),
    },
    { label: "Add phone number", done: !!business?.phone },
    { label: "Add website", done: !!business?.website },
    {
      label: "Add business hours",
      done: (business?.openingHours?.length || 0) > 0,
    },
    {
      label: "Choose a business type",
      done: business?.businessType && business.businessType !== "other",
    },
    { label: "Add tags", done: (business?.tags?.length || 0) > 0 },
    { label: "Upload cover image", done: !!business?.coverImage },
    {
      label: `Upload ${MIN_BUSINESS_IMAGES}+ business images`,
      done: (business?.images?.length || 0) >= MIN_BUSINESS_IMAGES,
    },
  ];
  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) *
      100,
  );

  // ─── Loading / error guards ───────────────────────────────
  if (bizLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BusinessSidebar onLogout={handleLogout} />
        <div className="lg:ml-64 pb-20 lg:pb-8">
          <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-4">
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
        <BusinessBottombar />
      </div>
    );
  }

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

  if (bizError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Failed to load business
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {bizError?.data?.message || "Something went wrong."}
          </p>
          <button
            onClick={() => refetchBusiness()}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const coverSrc = coverPreview || business?.coverImage || null;

  const approvalBanner = (() => {
    if (approvalStatus === "approved") return null;
    const meta = {
      pending: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-800 dark:text-yellow-200",
        title: "Pending admin approval",
        body: "Your profile is under review. You can still update your details while you wait.",
        Icon: Clock,
      },
      rejected: {
        bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        text: "text-red-800 dark:text-red-200",
        title: "Business application rejected",
        body:
          business?.businessRejectionReason ||
          "Please update your profile based on the feedback and re-submit.",
        Icon: XCircle,
      },
      unverified: {
        bg: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        title: "Email not verified",
        body: "Verify your email to complete your setup.",
        Icon: AlertCircle,
      },
    }[approvalStatus];
    if (!meta) return null;
    const Icon = meta.Icon;
    return (
      <div
        className={`border rounded-xl p-4 mb-6 flex items-start gap-3 ${meta.bg}`}
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
  })();

  // ─── Tabs ─────────────────────────────────────────────────
  const TABS = [
    { id: "info", label: "General info", icon: Store },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "location", label: "Location", icon: MapPin },
    { id: "hours", label: "Hours", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-20 lg:pb-8">
        {/* Sticky header */}
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
              Business Profile
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {business && (
              <button
                type="button"
                onClick={() => navigate("/business")}
                className="hidden sm:flex items-center gap-2 min-w-0 rounded-full pl-2 pr-0.5 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:inline truncate max-w-[140px]">
                  {business.businessName}
                </span>
                <span className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                Business profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage how customers see your business on LocalSpot.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="hidden sm:inline-flex px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
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
                        Save changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit profile
                </button>
              )}
            </div>
          </div>

          {approvalBanner}

          {/* ─── Completion status card (reference-styled) ─── */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 sm:p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start gap-5 sm:gap-8">
              <div className="flex flex-col items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <ProgressRing value={completionPct} size={84} />
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Profile completion
                </p>
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Complete your profile
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {completionItems.filter((i) => i.done).length}/
                    {completionItems.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {completionItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 min-w-0"
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-[#3B82F6] flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs truncate ${
                          item.done
                            ? "text-gray-700 dark:text-gray-200"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Cover + identity card ─── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
            <div className="relative h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900">
              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white/40" />
                </div>
              )}

              {editMode && (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Change cover
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
            </div>

            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start gap-4 -mt-12 sm:-mt-14">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {coverSrc ? (
                  <img
                    src={coverSrc}
                    alt={business?.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#3B82F6]">
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 sm:pt-12 lg:pt-14 w-full">
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate"
                  title={business?.businessName}
                >
                  {business?.businessName || "Your Business"}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.color}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusMeta.label}
                  </span>
                  {business?.location?.city && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {business.location.city}
                      {business.location.state
                        ? `, ${business.location.state}`
                        : ""}
                    </span>
                  )}
                  {business?.rating > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      {Number(business.rating).toFixed(1)} (
                      {business.numReviews || 0})
                    </span>
                  )}
                  {business?.viewCount > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {business.viewCount} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Tabs ─── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
              <div className="flex gap-1 sm:gap-2 px-2 sm:px-4 min-w-max sm:min-w-0">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                        active
                          ? "text-[#3B82F6] border-[#3B82F6]"
                          : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {tab.id === "gallery" && (
                        <span
                          className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            galleryReady
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                          }`}
                        >
                          {galleryTotal}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* ─── INFO TAB ─── */}
              {activeTab === "info" && (
                <div className="space-y-5">
                  <Field label="Business name">
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleFieldChange("businessName", e.target.value)
                        }
                        className={inputClass}
                      />
                    ) : (
                      <DisplayValue value={formData.businessName} />
                    )}
                  </Field>

                  <Field label="Description">
                    {editMode ? (
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                        placeholder="Tell customers what makes your business unique..."
                        className={inputClass}
                      />
                    ) : (
                      <DisplayValue
                        value={formData.description}
                        placeholder="No description yet"
                      />
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Business type">
                      {editMode ? (
                        <select
                          value={formData.businessType}
                          onChange={(e) =>
                            handleFieldChange("businessType", e.target.value)
                          }
                          className={inputClass}
                        >
                          {BUSINESS_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <DisplayValue
                          value={
                            BUSINESS_TYPES.find(
                              (t) => t.value === formData.businessType,
                            )?.label || formData.businessType
                          }
                        />
                      )}
                    </Field>

                    <Field label="Price range">
                      {editMode ? (
                        <div className="grid grid-cols-4 gap-2">
                          {PRICE_RANGES.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() =>
                                handleFieldChange("priceRange", p.value)
                              }
                              className={`py-2 rounded-lg text-sm font-semibold transition border ${
                                formData.priceRange === p.value
                                  ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
                              }`}
                              title={p.hint}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <DisplayValue
                          value={
                            PRICE_RANGES.find(
                              (p) => p.value === formData.priceRange,
                            )?.label || "$$"
                          }
                        />
                      )}
                    </Field>

                    <Field label="Phone" icon={Phone}>
                      {editMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleFieldChange("phone", e.target.value)
                          }
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue value={formData.phone} />
                      )}
                    </Field>

                    <Field label="Website" icon={Globe}>
                      {editMode ? (
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) =>
                            handleFieldChange("website", e.target.value)
                          }
                          placeholder="https://..."
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue
                          value={formData.website}
                          link={formData.website}
                        />
                      )}
                    </Field>
                  </div>

                  <Field label="Tags">
                    {editMode ? (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            placeholder="e.g. jollof, takeaway, african"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-3 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition flex-shrink-0"
                          >
                            Add
                          </button>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400 text-xs font-medium rounded-full"
                              >
                                <Tag className="h-3 w-3" />
                                {t}
                                <button
                                  type="button"
                                  onClick={() => removeTag(t)}
                                  className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-200"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : formData.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {formData.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400 text-xs font-medium rounded-full"
                          >
                            <Tag className="h-3 w-3" />
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <DisplayValue
                        value=""
                        placeholder="No tags yet — add a few to help customers find you"
                      />
                    )}
                  </Field>
                </div>
              )}

              {/* ─── GALLERY TAB ─── */}
              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {galleryTotal} / {MAX_BUSINESS_IMAGES} images
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {galleryReady
                          ? "Minimum reached. Looking good!"
                          : `Add ${MIN_BUSINESS_IMAGES - galleryTotal} more to reach the minimum of ${MIN_BUSINESS_IMAGES}`}
                      </p>
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => imagesInputRef.current?.click()}
                        disabled={galleryTotal >= MAX_BUSINESS_IMAGES}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                      </button>
                    )}
                    <input
                      ref={imagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        galleryReady ? "bg-[#3B82F6]" : "bg-orange-400"
                      }`}
                      style={{
                        width: `${Math.min(100, (galleryTotal / MAX_BUSINESS_IMAGES) * 100)}%`,
                      }}
                    />
                  </div>

                  {galleryTotal === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No images yet
                      </p>
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => imagesInputRef.current?.click()}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#3B82F6] hover:underline"
                        >
                          <Upload className="h-4 w-4" />
                          Upload images
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {existingImages.map((url) => (
                        <div
                          key={url}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group"
                        >
                          <img
                            src={url}
                            alt="Business"
                            className="w-full h-full object-cover"
                          />
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition"
                              aria-label="Remove image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      {newImageFiles.map((_, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-blue-400"
                        >
                          <img
                            src={newImagePreviews[idx]}
                            alt="New upload"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-blue-500 rounded-full">
                            New
                          </span>
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition"
                            aria-label="Remove image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editMode && removedImages.length > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                      {removedImages.length} image
                      {removedImages.length === 1 ? "" : "s"} marked for removal
                      — save to apply.
                    </p>
                  )}
                </div>
              )}

              {/* ─── LOCATION TAB ─── */}
              {activeTab === "location" && (
                <div className="space-y-5">
                  <Field label="Street address" icon={MapPin}>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.location.address}
                        onChange={(e) =>
                          handleLocationChange("address", e.target.value)
                        }
                        placeholder="e.g. 12 Aba Road"
                        className={inputClass}
                      />
                    ) : (
                      <DisplayValue value={formData.location.address} />
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="City">
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location.city}
                          onChange={(e) =>
                            handleLocationChange("city", e.target.value)
                          }
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue value={formData.location.city} />
                      )}
                    </Field>
                    <Field label="State / Region">
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location.state}
                          onChange={(e) =>
                            handleLocationChange("state", e.target.value)
                          }
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue value={formData.location.state} />
                      )}
                    </Field>
                    <Field label="Country">
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location.country}
                          onChange={(e) =>
                            handleLocationChange("country", e.target.value)
                          }
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue value={formData.location.country} />
                      )}
                    </Field>
                    <Field label="Business address (short)">
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            handleFieldChange("address", e.target.value)
                          }
                          placeholder="Shown on listings"
                          className={inputClass}
                        />
                      ) : (
                        <DisplayValue value={formData.address} />
                      )}
                    </Field>
                  </div>
                </div>
              )}

              {/* ─── HOURS TAB ─── */}
              {activeTab === "hours" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Set your weekly opening hours. Toggle "Closed" for days you
                    don't open.
                  </p>

                  {DAY_NAMES.map((name, day) => {
                    const hours = formData.openingHours.find(
                      (h) => h.day === day,
                    ) || {
                      day,
                      open: "09:00",
                      close: "17:00",
                      closed: false,
                    };
                    return (
                      <div
                        key={day}
                        className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <span className="w-24 sm:w-28 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                          {name}
                        </span>

                        {editMode ? (
                          <>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                handleHoursChange(day, "open", e.target.value)
                              }
                              disabled={hours.closed}
                              className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50"
                            />
                            <span className="text-gray-400 text-xs">—</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                handleHoursChange(day, "close", e.target.value)
                              }
                              disabled={hours.closed}
                              className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50"
                            />
                            <label className="sm:ml-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={hours.closed}
                                onChange={(e) =>
                                  handleHoursChange(
                                    day,
                                    "closed",
                                    e.target.checked,
                                  )
                                }
                                className="h-3.5 w-3.5 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                              />
                              Closed
                            </label>
                          </>
                        ) : hours.closed ? (
                          <span className="text-sm text-red-500 font-medium">
                            Closed
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {hours.open} — {hours.close}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Small footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} LocalSpot Systems Ltd. — Business
              Account Center
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile save bar (fixed above bottombar) */}
      {editMode && (
        <div className="fixed bottom-20 left-0 right-0 lg:hidden px-4 pb-2 z-40 pointer-events-none">
          <div className="pointer-events-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3 flex gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2.5 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <BusinessBottombar />
    </div>
  );
};

export default BusinessProfile;
