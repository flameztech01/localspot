// src/pages/business/BusinessProfile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Tag as TagIcon,
  Image as ImageIcon,
  AlertCircle,
  Check,
  X,
  Plus,
  Trash2,
  Camera,
  Upload,
  User as UserIcon,
  Building2,
  Activity,
  ShieldCheck,
  LogOut,
  ChevronDown,
  BadgeCheck,
  Clock,
  DollarSign,
  Save,
  Loader2,
  Pencil,
} from "lucide-react";

import {
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from "../../features/authApiSlice";
import {
  useGetMyBusinessApplicationQuery,
  useUpdateBusinessApplicationMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

// ─── Constants ─────────────────────────────────────────────
const MIN_BUSINESS_IMAGES = 10;
const MAX_BUSINESS_IMAGES = 20;

const BUSINESS_KINDS = [
  { value: "hotels", label: "Hotels & Lodging" },
  { value: "dining", label: "Dining & Restaurants" },
  { value: "things_to_do", label: "Things to Do" },
  { value: "shops", label: "Shops & Retail" },
  { value: "others", label: "Others" },
];

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

const TABS = [
  { id: "general", label: "General information" },
  { id: "contact", label: "Contact details" },
  { id: "location", label: "Location" },
  { id: "hours", label: "Opening hours" },
  { id: "media", label: "Media" },
];

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition";

const fileBoxCls = (disabled) =>
  `border-2 border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center min-h-[110px] ${
    disabled
      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
      : "border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 cursor-pointer"
  }`;

// ─── Custom Dropdown ───────────────────────────────────────
const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={`${inputCls} flex items-center justify-between gap-2 text-left ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        <span
          className={`truncate ${!selected ? "text-gray-400" : "text-gray-900"}`}
        >
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
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
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────
const BusinessProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [loggingOut, setLoggingOut] = useState(false);
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef(null);

  // ─── Auth ─────────────────────────────────────────────
  const { data: userResp } = useGetCurrentUserQuery();
  const user = userResp?.data || userResp;
  const [logoutUser] = useLogoutUserMutation();

  const businessName =
    user?.businessName || user?.fullName || "Your Business";
  const businessEmail = user?.email || "";
  const avatarUrl = user?.logo || null;

  // ─── Application data ─────────────────────────────────
  const {
    data: appResp,
    isLoading,
    error,
    refetch,
  } = useGetMyBusinessApplicationQuery();

  const application = appResp?.data?.application || user;
  const appStatus = appResp?.data?.status || "none";

  const [updateApplication, { isLoading: isSaving }] =
    useUpdateBusinessApplicationMutation();

  const isUnauthorized = error?.status === 401;
  const isApproved = appStatus === "approved";

  // ─── Form state ───────────────────────────────────────
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

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Logo / Cover
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // ─── Hydrate form from application ────────────────────
  const hydrateForm = () => {
    if (!application) return;
    setFormData({
      businessName: application.businessName || "",
      description: application.description || "",
      businessType: application.businessType || "other",
      businessKind: application.businessKind || "",
      businessKindOther: application.businessKindOther || "",
      website: application.website || "",
      phone: application.phone || "",
      address: application.address || "",
      priceRange: application.priceRange || 2,
      tags: Array.isArray(application.tags) ? application.tags : [],
      location: {
        address: application.location?.address || "",
        city: application.location?.city || "",
        state: application.location?.state || "",
        country: application.location?.country || "",
      },
      openingHours:
        Array.isArray(application.openingHours) &&
        application.openingHours.length > 0
          ? application.openingHours
          : DEFAULT_HOURS,
    });
    setExistingImages(
      Array.isArray(application.images) ? application.images : [],
    );
    setLogoPreview(application.logo || null);
    setCoverPreview(application.coverImage || null);
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
    if (application) hydrateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application?._id, appStatus]);

  // ─── Cleanup blob URLs ────────────────────────────────
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

  // ─── Outside-click for tabs dropdown ──────────────────
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

  // ─── Handlers ─────────────────────────────────────────
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    try {
      localStorage.removeItem("persist:root");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    } catch (_) {}
    navigate("/signin", { replace: true });
  };

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

  // Gallery
  const totalImages = existingImages.length + newImageFiles.length;

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_BUSINESS_IMAGES - totalImages;
    if (remaining <= 0) {
      showToast(`Max ${MAX_BUSINESS_IMAGES} images reached`, "error");
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
      showToast(`Only ${remaining} more image(s) allowed`, "error");
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

  // Save
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

    const totalProjected = existingImages.length + newImageFiles.length;
    if (totalProjected < MIN_BUSINESS_IMAGES) {
      showToast(
        `At least ${MIN_BUSINESS_IMAGES} images required (currently ${totalProjected})`,
        "error",
      );
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

    if (removedImages.length > 0) {
      fd.append("removeImages", JSON.stringify(removedImages));
    }
    newImageFiles.forEach((file) => fd.append("images", file));

    if (logoFile) fd.append("logo", logoFile);
    if (removeLogo) fd.append("removeLogo", "true");

    if (coverFile) fd.append("coverImage", coverFile);
    if (removeCover) fd.append("removeCover", "true");

    try {
      const r = await updateApplication(fd).unwrap();
      showToast(r?.message || "Profile updated", "success");

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
      showToast(
        err?.data?.message ||
          err?.data?.errors?.[0]?.message ||
          "Failed to update profile",
        "error",
      );
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

  // ─── Derived ──────────────────────────────────────────
  const hoursByGroup = useMemo(() => {
    const hours = Array.isArray(application?.openingHours)
      ? application.openingHours
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
  }, [application?.openingHours]);

  const currentImages = editMode
    ? [
        ...existingImages.map((url) => ({ url, isNew: false })),
        ...newImagePreviews.map((url) => ({ url, isNew: true })),
      ]
    : (application?.images || []).map((url) => ({ url, isNew: false }));

  const activeTabObj = TABS.find((t) => t.id === activeTab);

  // ─── Guards ───────────────────────────────────────────
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
            Please log in again to view your profile.
          </p>
          <button
            onClick={() => navigate("/signin", { replace: true })}
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
      <div className="min-h-screen bg-[#FBFBFC]">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          <div className="h-10 w-56 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-52 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
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

  // ─── Nav items ────────────────────────────────────────
  const NAV_ITEMS = [
    {
      to: "/business/profile",
      label: "Edit profile",
      Icon: UserIcon,
      active: true,
    },
    {
      to: "/business/activity",
      label: "Activity log",
      Icon: Activity,
      active: false,
    },
    {
      to: "/business/verification",
      label: "Verification & badges",
      Icon: ShieldCheck,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 font-sans">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-hidden">
            <Link
              to="/business"
              className="hover:text-blue-600 transition-colors shrink-0"
            >
              Merchants
            </Link>
            <span className="text-gray-400 shrink-0">›</span>
            <span className="text-gray-900 font-semibold truncate">
              Business profile
            </span>
          </nav>
        </div>
      </div>

      {/* ─── Main ─── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── Sidebar (sticky) ─── */}
          <aside className="lg:col-span-3 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <Link
                    to="/business/profile"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow transition"
                  >
                    <Camera className="w-3 h-3" />
                  </Link>
                </div>

                <div className="min-w-0 w-full">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {businessName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {businessEmail}
                  </p>
                  {isApproved && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-semibold">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <nav className="pt-3 space-y-1">
                {NAV_ITEMS.map(({ to, label, Icon, active }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition ${
                      active
                        ? "font-semibold bg-blue-50/70 text-blue-600"
                        : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ─── Right workspace ─── */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Business profile
              </h1>

              <div className="flex items-center gap-2 flex-shrink-0">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-60"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span className="hidden sm:inline">Saving…</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">
                            Save changes
                          </span>
                          <span className="sm:hidden">Save</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Status banner */}
            {!isApproved && appStatus !== "none" && (
              <div
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  appStatus === "pending"
                    ? "border-amber-200 bg-amber-50"
                    : "border-rose-200 bg-rose-50"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    appStatus === "pending"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-semibold ${
                      appStatus === "pending"
                        ? "text-amber-800"
                        : "text-rose-800"
                    }`}
                  >
                    {appStatus === "pending"
                      ? "Application under review"
                      : "Application rejected"}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      appStatus === "pending"
                        ? "text-amber-800/90"
                        : "text-rose-800/90"
                    }`}
                  >
                    {appStatus === "pending"
                      ? "You can still update your profile. Saving keeps your application in the review queue."
                      : application?.businessRejectionReason ||
                        "Please review and update your profile before resubmitting."}
                  </p>
                </div>
              </div>
            )}

            {/* Tabs — mobile dropdown + desktop pills */}
            <nav>
              <div className="lg:hidden" ref={tabDropdownRef}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Section
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTabDropdownOpen((v) => !v)}
                    className={`${inputCls} flex items-center justify-between gap-2 text-left`}
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
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1">
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
                                ? "bg-blue-50 text-blue-600 font-semibold"
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

            {/* ═══════════ TAB: GENERAL ═══════════ */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                  <h3 className="text-base font-bold text-gray-900">
                    About your business
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business name *
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          setField("businessName", e.target.value)
                        }
                        placeholder="e.g. Maple Bakery & Cafe"
                        disabled={isSaving}
                        className={inputCls}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {application?.businessName || "—"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Description
                    </label>
                    {editMode ? (
                      <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          setField("description", e.target.value.slice(0, 2000))
                        }
                        placeholder="Tell customers what makes your business unique…"
                        disabled={isSaving}
                        className={`${inputCls} resize-none`}
                      />
                    ) : application?.description ? (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {application.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No description added yet.
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tags
                    </label>
                    {editMode ? (
                      <>
                        <div className="flex gap-2 mb-3">
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
                            placeholder="Add a tag…"
                            disabled={isSaving}
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-1 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex-shrink-0 disabled:opacity-60"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full capitalize"
                              >
                                <TagIcon className="h-3 w-3" />
                                {t}
                                <button
                                  type="button"
                                  onClick={() => removeTag(t)}
                                  className="ml-0.5 hover:text-blue-900"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : application?.tags?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {application.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No tags yet
                      </p>
                    )}
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Business details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Business type
                      </label>
                      {editMode ? (
                        <CustomDropdown
                          value={formData.businessType}
                          onChange={(v) => setField("businessType", v)}
                          options={BUSINESS_TYPES}
                          disabled={isSaving}
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {BUSINESS_TYPES.find(
                            (t) => t.value === application?.businessType,
                          )?.label || "—"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Business category
                      </label>
                      {editMode ? (
                        <div className="space-y-2">
                          <CustomDropdown
                            value={formData.businessKind}
                            onChange={(v) => setField("businessKind", v)}
                            options={[
                              { value: "", label: "— Not set —" },
                              ...BUSINESS_KINDS,
                            ]}
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
                              placeholder="Describe your category"
                              disabled={isSaving}
                              className={inputCls}
                            />
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {application?.businessKind
                            ? application.businessKind === "others"
                              ? application.businessKindOther || "Others"
                              : BUSINESS_KINDS.find(
                                  (k) => k.value === application.businessKind,
                                )?.label || "—"
                            : "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Price range
                    </label>
                    {editMode ? (
                      <div className="grid grid-cols-4 gap-2 max-w-sm">
                        {PRICE_RANGES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setField("priceRange", p.value)}
                            disabled={isSaving}
                            title={p.hint}
                            className={`py-2.5 rounded-lg text-sm font-bold transition border ${
                              formData.priceRange === p.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {"$".repeat(application?.priceRange || 0) || "—"}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {PRICE_RANGES.find(
                            (p) => p.value === application?.priceRange,
                          )?.hint || ""}
                        </span>
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ═══════════ TAB: CONTACT ═══════════ */}
            {activeTab === "contact" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  Contact details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        Phone
                      </span>
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+234 800 000 0000"
                        disabled={isSaving}
                        className={inputCls}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {application?.phone || (
                          <span className="text-gray-400 italic">
                            Not added
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        Email
                      </span>
                    </label>
                    <p className="text-sm font-semibold text-gray-900 break-all">
                      {application?.email || businessEmail || "—"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        Website
                      </span>
                    </label>
                    {editMode ? (
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setField("website", e.target.value)}
                        placeholder="https://yourbusiness.com"
                        disabled={isSaving}
                        className={inputCls}
                      />
                    ) : application?.website ? (
                      <a
                        href={
                          application.website.startsWith("http")
                            ? application.website
                            : `https://${application.website}`
                        }
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm font-semibold text-blue-600 hover:underline break-all"
                      >
                        {application.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not added</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════ TAB: LOCATION ═══════════ */}
            {activeTab === "location" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-gray-900">Location</h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Street address
                    </span>
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        setLocationField("address", e.target.value)
                      }
                      placeholder="e.g. 12 Marina Road"
                      disabled={isSaving}
                      className={inputCls}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      {application?.location?.address || (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "city", label: "City", placeholder: "Lagos" },
                    { key: "state", label: "State", placeholder: "Lagos" },
                    {
                      key: "country",
                      label: "Country",
                      placeholder: "Nigeria",
                    },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {f.label}
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location[f.key]}
                          onChange={(e) =>
                            setLocationField(f.key, e.target.value)
                          }
                          placeholder={f.placeholder}
                          disabled={isSaving}
                          className={inputCls}
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {application?.location?.[f.key] || (
                            <span className="text-gray-400 italic">
                              Not set
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Short listing address
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="Shown on cards (optional)"
                      disabled={isSaving}
                      className={inputCls}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      {application?.address || (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ═══════════ TAB: HOURS ═══════════ */}
            {activeTab === "hours" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  Opening hours
                </h3>

                {editMode ? (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
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
                                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              Closed
                            </label>
                          </div>
                          {!h.closed && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={h.open}
                                onChange={(e) =>
                                  setHour(day, "open", e.target.value)
                                }
                                disabled={isSaving}
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                              />
                              <span className="text-gray-400 text-xs">to</span>
                              <input
                                type="time"
                                value={h.close}
                                onChange={(e) =>
                                  setHour(day, "close", e.target.value)
                                }
                                disabled={isSaving}
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                              />
                            </div>
                          )}
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
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {hoursByGroup.map((h) => (
                      <div
                        key={h.label}
                        className="flex items-center justify-between gap-4 px-4 py-3.5"
                      >
                        <span className="text-sm font-semibold text-gray-700">
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

            {/* ═══════════ TAB: MEDIA ═══════════ */}
            {activeTab === "media" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    Business images
                  </h3>
                  <span className="text-xs text-gray-500">
                    {currentImages.length}/{MAX_BUSINESS_IMAGES}
                  </span>
                </div>

                {/* Logo + Cover */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Logo (square)
                    </label>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      {editMode && (
                        <>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold shadow"
                            >
                              Change
                            </button>
                            {logoPreview && (
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoSelect}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Cover banner
                    </label>
                    <div className="relative aspect-square sm:aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      {editMode && (
                        <>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => coverInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold shadow"
                            >
                              Change
                            </button>
                            {coverPreview && (
                              <button
                                type="button"
                                onClick={handleRemoveCover}
                                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverSelect}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-gray-700">
                      Gallery (min {MIN_BUSINESS_IMAGES}, max{" "}
                      {MAX_BUSINESS_IMAGES})
                    </label>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={currentImages.length >= MAX_BUSINESS_IMAGES}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Add images
                      </button>
                    )}
                  </div>

                  {editMode && (
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryAdd}
                      className="hidden"
                    />
                  )}

                  {currentImages.length === 0 ? (
                    <div className={fileBoxCls(!editMode)}>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">
                        No images yet — add at least {MIN_BUSINESS_IMAGES}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {currentImages.map((img, idx) => (
                        <div
                          key={`${img.url}-${idx}`}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 border ${
                            img.isNew ? "ring-2 ring-blue-500" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`Business ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {img.isNew && (
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-blue-600">
                              New
                            </span>
                          )}
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => {
                                if (img.isNew) {
                                  const newIdx =
                                    newImagePreviews.indexOf(img.url);
                                  if (newIdx > -1) removeNewImage(newIdx);
                                } else {
                                  removeExistingImage(img.url);
                                }
                              }}
                              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {editMode &&
                    currentImages.length > 0 &&
                    currentImages.length < MIN_BUSINESS_IMAGES && (
                      <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mt-3">
                        Add at least{" "}
                        {MIN_BUSINESS_IMAGES - currentImages.length} more to
                        reach the minimum.
                      </p>
                    )}

                  {editMode && removedImages.length > 0 && (
                    <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mt-3">
                      {removedImages.length} image
                      {removedImages.length === 1 ? "" : "s"} marked for
                      removal — save to apply.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessProfile;