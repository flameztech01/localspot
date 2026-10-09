// src/pages/business/BusinessProfile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Pencil,
  BadgeCheck,
  Check,
  Globe,
  Tag as TagIcon,
  Image as ImageIcon,
  AlertCircle,
  Save,
  X,
  Plus,
  Loader,
  Upload,
  Trash2,
  User as UserIcon,
  Building2,
  DollarSign,
  ChevronDown,
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
const MIN_BUSINESS_IMAGES = 10;
const MAX_BUSINESS_IMAGES = 20;

const BUSINESS_TYPES = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "other", label: "Other" },
];

const BUSINESS_KINDS = [
  { value: "hotels", label: "Hotels" },
  { value: "dining", label: "Dining Spots" },
  { value: "things_to_do", label: "Things to Do" },
  { value: "shops", label: "Shops" },
  { value: "others", label: "Others" },
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

const TABS = [
  { id: "general", label: "General information" },
  { id: "contact", label: "Contact details" },
  { id: "location", label: "Location" },
  { id: "hours", label: "Opening hours" },
  { id: "media", label: "Media" },
];

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition";

const CARD = "rounded-lg border border-gray-200 bg-white";
const TILE = "rounded-lg bg-gray-50 border border-gray-100 p-4 lg:p-5";

// ─── Custom Dropdown ───────────────────────────────────────
const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={`${inputClass} flex items-center justify-between gap-2 text-left ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        <span className={`truncate ${!selected ? "text-gray-400" : ""}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition ${
                  active
                    ? "bg-blue-50 text-[#3B82F6] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check className="h-4 w-4 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Component ─────────────────────────────────────────────
const BusinessProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("general");
  const [editMode, setEditMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef(null);

  // Images state
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  // Cover
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  const imagesInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Form
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    businessType: "other",
    businessKind: "",
    businessKindOther: "",
    website: "",
    phone: "",
    address: "",
    priceRange: 2,
    tags: [],
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
    openingHours: DEFAULT_HOURS,
  });

  const [tagInput, setTagInput] = useState("");

  // ─── Data ────────────────────────────────────────────────
  const {
    data: businessResp,
    isLoading,
    error,
    refetch,
  } = useGetCurrentBusinessAccountQuery();

  const business = businessResp?.data || businessResp;
  const isUnauthorized = error?.status === 401;

  const [updateProfile, { isLoading: isSaving }] =
    useUpdateBusinessProfileMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  // Outside click for tabs dropdown
  useEffect(() => {
    const handler = (e) => {
      if (
        tabDropdownRef.current &&
        !tabDropdownRef.current.contains(e.target)
      ) {
        setTabDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const hydrateForm = () => {
    if (!business) return;
    setFormData({
      businessName: business.businessName || "",
      description: business.description || "",
      businessType: business.businessType || "other",
      businessKind: business.businessKind || "",
      businessKindOther: business.businessKindOther || "",
      website: business.website || "",
      phone: business.phone || "",
      address: business.address || "",
      priceRange: business.priceRange || 2,
      tags: Array.isArray(business.tags) ? business.tags : [],
      location: {
        address: business.location?.address || "",
        city: business.location?.city || "",
        state: business.location?.state || "",
        country: business.location?.country || "",
      },
      openingHours:
        Array.isArray(business.openingHours) && business.openingHours.length > 0
          ? business.openingHours
          : DEFAULT_HOURS,
    });
    setExistingImages(Array.isArray(business.images) ? business.images : []);
    setLogoPreview(business.logo || null);
    setCoverPreview(business.coverImage || null);
    setRemovedImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setLogoFile(null);
    setCoverFile(null);
    setRemoveLogo(false);
    setRemoveCover(false);
    setTagInput("");
  };

  useEffect(() => {
    if (business) hydrateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Logout ──────────────────────────────────────────────
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

  // ─── Field setters ───────────────────────────────────────
  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const setLocationField = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const setHour = (day, field, value) =>
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
    if (formData.tags.includes(t)) {
      setTagInput("");
      return;
    }
    if (formData.tags.length >= 20) {
      showToast("You can add up to 20 tags", "error");
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

  // ─── Image handlers ──────────────────────────────────────
  const totalImages = existingImages.length + newImageFiles.length;

  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_BUSINESS_IMAGES - totalImages;
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

  // Logo
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
    setRemoveLogo(false);
    e.target.value = "";
  };

  const handleRemoveLogo = () => {
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
  };

  // Cover
  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));
    setRemoveCover(false);
    e.target.value = "";
  };

  const handleRemoveCover = () => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(true);
  };

  // ─── Save ────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.businessName.trim()) {
      showToast("Business name is required", "error");
      return;
    }

    if (
      formData.businessKind === "others" &&
      !formData.businessKindOther.trim()
    ) {
      showToast('Please describe the "Others" business kind', "error");
      return;
    }

    const fd = new FormData();

    fd.append("businessName", formData.businessName.trim());
    fd.append("description", formData.description.trim());
    fd.append("businessType", formData.businessType);
    fd.append("website", formData.website.trim());
    fd.append("phone", formData.phone.trim());
    fd.append("address", formData.address.trim());
    fd.append("priceRange", String(formData.priceRange));

    if (formData.businessKind) {
      fd.append("businessKind", formData.businessKind);
      if (formData.businessKind === "others") {
        fd.append("businessKindOther", formData.businessKindOther.trim());
      }
    }

    fd.append("tags", JSON.stringify(formData.tags));
    fd.append("location", JSON.stringify(formData.location));
    fd.append("openingHours", JSON.stringify(formData.openingHours));

    // Gallery
    if (removedImages.length > 0) {
      fd.append("removeImages", JSON.stringify(removedImages));
    }
    newImageFiles.forEach((file) => fd.append("images", file));

    // Logo
    if (logoFile) fd.append("logo", logoFile);
    if (removeLogo) fd.append("removeLogo", "true");

    // Cover
    if (coverFile) fd.append("coverImage", coverFile);
    if (removeCover) fd.append("removeCover", "true");

    try {
      const result = await updateProfile(fd).unwrap();
      showToast(result?.message || "Profile updated", "success");

      newImagePreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);

      setRemovedImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setLogoFile(null);
      setCoverFile(null);
      setEditMode(false);
      await refetch();
    } catch (err) {
      showToast(err?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    newImagePreviews.forEach((url) => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    hydrateForm();
    setEditMode(false);
  };

  // ─── Derived ─────────────────────────────────────────────
  const isVerified = business?.isVerified && business?.businessVerified;
  const location = business?.location || {};

  const hoursByGroup = useMemo(() => {
    const hours = Array.isArray(business?.openingHours)
      ? business.openingHours
      : [];
    if (hours.length === 0) return [];

    const get = (day) => hours.find((h) => h.day === day);

    const groups = [];
    const weekdays = [1, 2, 3, 4, 5].map((d) => get(d)).filter(Boolean);

    const allSame =
      weekdays.length === 5 &&
      weekdays.every(
        (h) =>
          h.open === weekdays[0].open &&
          h.close === weekdays[0].close &&
          h.closed === weekdays[0].closed,
      );

    if (allSame) {
      groups.push({
        label: "Mon - Fri",
        open: weekdays[0].open,
        close: weekdays[0].close,
        closed: weekdays[0].closed,
      });
    } else {
      weekdays.forEach((h, idx) =>
        groups.push({
          label: DAY_NAMES[idx + 1].slice(0, 3),
          open: h.open,
          close: h.close,
          closed: h.closed,
        }),
      );
    }

    const sat = get(6);
    const sun = get(0);

    if (sat)
      groups.push({
        label: "Saturday",
        open: sat.open,
        close: sat.close,
        closed: sat.closed,
      });
    if (sun)
      groups.push({
        label: "Sunday",
        open: sun.open,
        close: sun.close,
        closed: sun.closed,
      });

    return groups;
  }, [business?.openingHours]);

  // ─── Guards ──────────────────────────────────────────────
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className={`${CARD} shadow-sm p-8 max-w-md w-full text-center`}>
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Session expired
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in again to view your profile.
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <BusinessSidebar onLogout={handleLogout} />
        <div className="lg:ml-64 pb-24 lg:pb-10">
          <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-4">
            <div className="h-10 w-56 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-52 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <BusinessBottombar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className={`${CARD} shadow-sm p-8 max-w-md w-full text-center`}>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Failed to load profile
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error?.data?.message || "Something went wrong."}
          </p>
          <button
            onClick={() => refetch()}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ─── Display values ──────────────────────────────────────
  const displayLogo = logoPreview || null;
  const displayCover = coverPreview || null;
  const currentImages = editMode
    ? [
        ...existingImages.map((url) => ({ url, isNew: false })),
        ...newImagePreviews.map((url) => ({ url, isNew: true })),
      ]
    : (business?.images || []).map((url) => ({ url, isNew: false }));

  const activeTabObj = TABS.find((t) => t.id === activeTab);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-28 lg:pb-10">
        {/* ─── Header ─── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-3">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 tracking-tight truncate">
              Business profile
            </h1>

            <div className="flex items-center gap-2 flex-shrink-0">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-3.5 lg:px-4 py-2 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="h-3.5 w-3.5 animate-spin" />
                        <span className="hidden sm:inline">Saving…</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Save changes</span>
                        <span className="sm:hidden">Save</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 lg:px-4 py-2 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-5 lg:py-6 space-y-6">
          {/* ─── Tabs ─── */}
          <nav>
            {/* Mobile: custom dropdown */}
            <div className="lg:hidden" ref={tabDropdownRef}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Section
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTabDropdownOpen((v) => !v)}
                  className={`${inputClass} flex items-center justify-between gap-2 text-left`}
                >
                  <span className="truncate font-medium text-gray-900">
                    {activeTabObj?.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${
                      tabDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {tabDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
                    {TABS.map((tab) => {
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setTabDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition ${
                            active
                              ? "bg-blue-50 text-[#3B82F6] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{tab.label}</span>
                          {active && (
                            <Check className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: pills */}
            <div className="hidden lg:flex flex-wrap items-center gap-2">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition whitespace-nowrap ${
                      active
                        ? "bg-white text-gray-900 border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ─── Hero card ─── */}
          <div className={`${CARD} overflow-hidden`}>
            {/* Cover banner */}
            <div className="relative h-32 sm:h-44 lg:h-56 bg-gradient-to-br from-blue-100 via-indigo-100 to-slate-200">
              {displayCover ? (
                <img
                  src={displayCover}
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white/60" />
                </div>
              )}

              {editMode && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg transition disabled:opacity-60"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Change cover</span>
                    <span className="sm:hidden">Cover</span>
                  </button>
                  {displayCover && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      disabled={isSaving}
                      className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm transition disabled:opacity-60"
                      aria-label="Remove cover"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
            </div>

            {/* Avatar + name */}
            <div className="px-4 sm:px-6 lg:px-7 pb-5 -mt-10 sm:-mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 min-w-0">
                  {/* Avatar — uses LOGO field */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white ring-4 ring-white shadow-md flex items-center justify-center overflow-hidden"
                      style={{ borderRadius: "9999px" }}
                    >
                      {displayLogo ? (
                        <img
                          src={displayLogo}
                          alt={business?.businessName}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: "9999px" }}
                        />
                      ) : (
                        <UserIcon className="h-9 w-9 sm:h-11 sm:w-11 text-[#3B82F6]" />
                      )}
                    </div>

                    {editMode && (
                      <>
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={isSaving}
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#3B82F6] hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition disabled:opacity-60"
                          aria-label="Change logo"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoSelect}
                          className="hidden"
                        />
                        {displayLogo && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            disabled={isSaving}
                            className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition disabled:opacity-60"
                            aria-label="Remove logo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="min-w-0 sm:pb-1">
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          setField("businessName", e.target.value)
                        }
                        placeholder="Business name"
                        disabled={isSaving}
                        className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight w-full bg-transparent border-b-2 border-dashed border-gray-300 focus:border-[#3B82F6] focus:outline-none px-1 pb-0.5"
                      />
                    ) : (
                      <h2
                        className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight break-words"
                        title={business?.businessName}
                      >
                        {business?.businessName || "Your business"}
                      </h2>
                    )}

                    {editMode && (
                      <p className="text-[11px] text-gray-400 mt-2">
                        Logo should be square (1:1). Cover is a wide banner.
                      </p>
                    )}
                  </div>
                </div>

                {isVerified && (
                  <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#3B82F6] text-white text-xs font-semibold flex-shrink-0 sm:mb-2">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              TAB: GENERAL
          ══════════════════════════════════════════════════ */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <section>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">
                  About
                </h3>

                {editMode ? (
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add a tag (e.g. jollof, african)"
                        disabled={isSaving}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-1 px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition flex-shrink-0 disabled:opacity-60"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add tag
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#3B82F6] text-xs font-medium rounded-full capitalize"
                          >
                            <TagIcon className="h-3 w-3" />
                            {t}
                            <button
                              type="button"
                              onClick={() => removeTag(t)}
                              disabled={isSaving}
                              className="ml-0.5 hover:text-blue-900 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  business?.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {business.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )
                )}

                {editMode ? (
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setField("description", e.target.value.slice(0, 2000))
                    }
                    placeholder="Tell customers what makes your business unique..."
                    disabled={isSaving}
                    className={`${inputClass} resize-none`}
                  />
                ) : business?.description ? (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {business.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No description added yet.
                  </p>
                )}
              </section>

              <section>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">
                  Business details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={TILE}>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Business type
                      </span>
                    </div>
                    {editMode ? (
                      <CustomDropdown
                        value={formData.businessType}
                        onChange={(v) => setField("businessType", v)}
                        options={BUSINESS_TYPES}
                        placeholder="Select type"
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {BUSINESS_TYPES.find(
                          (t) => t.value === business?.businessType,
                        )?.label || "—"}
                      </p>
                    )}
                  </div>

                  <div className={TILE}>
                    <div className="flex items-center gap-2 mb-2">
                      <TagIcon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Business kind
                      </span>
                    </div>
                    {editMode ? (
                      <div className="space-y-2">
                        <CustomDropdown
                          value={formData.businessKind}
                          onChange={(v) => setField("businessKind", v)}
                          options={[
                            { value: "", label: "— Not set —" },
                            ...BUSINESS_KINDS,
                          ]}
                          placeholder="Select kind"
                          disabled={isSaving}
                        />
                        {formData.businessKind === "others" && (
                          <input
                            type="text"
                            value={formData.businessKindOther}
                            onChange={(e) =>
                              setField(
                                "businessKindOther",
                                e.target.value.slice(0, 100),
                              )
                            }
                            placeholder="Describe the kind"
                            disabled={isSaving}
                            className={inputClass}
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {business?.businessKind
                          ? business.businessKind === "others"
                            ? business.businessKindOther || "Others"
                            : BUSINESS_KINDS.find(
                                (k) => k.value === business.businessKind,
                              )?.label || "—"
                          : "—"}
                      </p>
                    )}
                  </div>

                  <div className={`${TILE} sm:col-span-2`}>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Price range
                      </span>
                    </div>
                    {editMode ? (
                      <div className="grid grid-cols-4 gap-2 max-w-sm">
                        {PRICE_RANGES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setField("priceRange", p.value)}
                            disabled={isSaving}
                            title={p.hint}
                            className={`py-2 rounded-lg text-sm font-bold transition border ${
                              formData.priceRange === p.value
                                ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                            } disabled:opacity-60`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {"$".repeat(business?.priceRange || 0) || "—"}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {PRICE_RANGES.find(
                            (p) => p.value === business?.priceRange,
                          )?.hint || ""}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: CONTACT
          ══════════════════════════════════════════════════ */}
          {activeTab === "contact" && (
            <section>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">
                Contact details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={TILE}>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Phone
                    </span>
                  </div>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      disabled={isSaving}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 break-words">
                      {business?.phone || (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                  )}
                </div>

                <div className={TILE}>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Email
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 break-all">
                    {business?.email || "—"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div className={`${TILE} sm:col-span-2`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Website
                    </span>
                  </div>
                  {editMode ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setField("website", e.target.value)}
                      placeholder="https://yourbusiness.com"
                      disabled={isSaving}
                      className={inputClass}
                    />
                  ) : business?.website ? (
                    <a
                      href={
                        business.website.startsWith("http")
                          ? business.website
                          : `https://${business.website}`
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-semibold text-[#3B82F6] hover:underline break-all"
                    >
                      {business.website}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Not added</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: LOCATION
          ══════════════════════════════════════════════════ */}
          {activeTab === "location" && (
            <section>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">
                Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`${TILE} sm:col-span-2`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Street address
                    </span>
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        setLocationField("address", e.target.value)
                      }
                      placeholder="e.g. 12 Aba Road"
                      disabled={isSaving}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      {location.address || (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                  )}
                </div>

                {[
                  { key: "city", label: "City", placeholder: "Port Harcourt" },
                  {
                    key: "state",
                    label: "State / Region",
                    placeholder: "Rivers",
                  },
                  { key: "country", label: "Country", placeholder: "Nigeria" },
                ].map((f) => (
                  <div key={f.key} className={TILE}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      {f.label}
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.location[f.key]}
                        onChange={(e) =>
                          setLocationField(f.key, e.target.value)
                        }
                        placeholder={f.placeholder}
                        disabled={isSaving}
                        className={inputClass}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {location[f.key] || (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}

                <div className={`${TILE} sm:col-span-2`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Short listing address
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="Shown on cards (optional)"
                      disabled={isSaving}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      {business?.address || (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: HOURS
          ══════════════════════════════════════════════════ */}
          {activeTab === "hours" && (
            <section>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">
                Opening hours
              </h3>

              {editMode ? (
                <div
                  className={`${CARD} divide-y divide-gray-100 overflow-hidden`}
                >
                  {DAY_NAMES.map((name, day) => {
                    const h =
                      formData.openingHours.find((x) => x.day === day) || {
                        day,
                        open: "09:00",
                        close: "17:00",
                        closed: false,
                      };
                    return (
                      <div key={day} className="px-4 py-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {name}
                          </span>
                          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={h.closed}
                              onChange={(e) =>
                                setHour(day, "closed", e.target.checked)
                              }
                              disabled={isSaving}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                            />
                            Closed
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={h.open}
                            onChange={(e) =>
                              setHour(day, "open", e.target.value)
                            }
                            disabled={h.closed || isSaving}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50"
                          />
                          <span className="text-gray-400 text-xs flex-shrink-0">
                            to
                          </span>
                          <input
                            type="time"
                            value={h.close}
                            onChange={(e) =>
                              setHour(day, "close", e.target.value)
                            }
                            disabled={h.closed || isSaving}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : hoursByGroup.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 italic">
                    Opening hours not set
                  </p>
                </div>
              ) : (
                <div
                  className={`${CARD} divide-y divide-gray-100 overflow-hidden`}
                >
                  {hoursByGroup.map((h) => (
                    <div
                      key={h.label}
                      className="flex items-center justify-between gap-4 px-4 lg:px-5 py-3.5"
                    >
                      <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                        {h.label}
                      </span>
                      {h.closed ? (
                        <span className="text-sm font-semibold text-red-500">
                          Closed
                        </span>
                      ) : (
                        <span className="text-sm text-gray-900 tabular-nums">
                          {h.open} — {h.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: MEDIA
          ══════════════════════════════════════════════════ */}
          {activeTab === "media" && (
            <section>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">
                  Photos
                </h3>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {currentImages.length}/{MAX_BUSINESS_IMAGES}
                </span>
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={() => imagesInputRef.current?.click()}
                  disabled={
                    isSaving || currentImages.length >= MAX_BUSINESS_IMAGES
                  }
                  className="w-full mb-4 py-3.5 border-2 border-dashed border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:border-[#3B82F6] hover:text-[#3B82F6] transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload photos
                </button>
              )}
              <input
                ref={imagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesSelect}
                className="hidden"
              />

              {currentImages.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-10 text-center">
                  <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 italic">
                    No photos added yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {currentImages.map((img, idx) => (
                    <div
                      key={`${img.url}-${idx}`}
                      className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                        img.isNew ? "ring-2 ring-[#3B82F6]" : ""
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Business ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {img.isNew && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#3B82F6]">
                          New
                        </span>
                      )}
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => {
                            if (img.isNew) {
                              const newIdx = newImagePreviews.indexOf(img.url);
                              if (newIdx > -1) removeNewImage(newIdx);
                            } else {
                              removeExistingImage(img.url);
                            }
                          }}
                          disabled={isSaving}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {editMode &&
                currentImages.length > 0 &&
                currentImages.length < MIN_BUSINESS_IMAGES && (
                  <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2.5 rounded-lg mt-4">
                    Add at least {MIN_BUSINESS_IMAGES - currentImages.length}{" "}
                    more to reach the minimum of {MIN_BUSINESS_IMAGES}.
                  </p>
                )}

              {editMode && removedImages.length > 0 && (
                <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2.5 rounded-lg mt-3">
                  {removedImages.length} image
                  {removedImages.length === 1 ? "" : "s"} marked for removal —
                  save to apply.
                </p>
              )}
            </section>
          )}

          {editMode && <div className="h-16 lg:hidden" />}
        </main>
      </div>

      {/* ─── Save bar (edit mode, mobile) ─── */}
      {editMode && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
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