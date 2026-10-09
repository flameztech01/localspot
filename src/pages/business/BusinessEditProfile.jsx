// src/pages/business/BusinessEditProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiStore,
  FiArrowLeft,
  FiSave,
  FiLoader,
  FiImage,
  FiUpload,
  FiTrash2,
  FiX,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiTag,
  FiClock,
  FiAlertCircle,
  FiCamera,
  FiPlus,
  FiLogOut,
  FiRefreshCw,
  FiInfo,
} from "react-icons/fi";

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

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Small components ──────────────────────────────────────
const Field = ({ label, hint, required, icon: Icon, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {hint && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {hint}
        </span>
      )}
    </div>
    {children}
  </div>
);

const Section = ({ title, description, icon: Icon, children }) => (
  <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-[#3B82F6]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

// ─── Main ──────────────────────────────────────────────────
const BusinessEditProfile = () => {
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

  const [updateProfile, { isLoading: isSaving }] =
    useUpdateBusinessProfileMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const [loggingOut, setLoggingOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Form state
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
    location: { address: "", city: "", state: "", country: "" },
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

  // Hydrate from business
  useEffect(() => {
    if (!business || hydrated) return;

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
    setCoverPreview(business.coverImage || null);
    setHydrated(true);
  }, [business, hydrated]);

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

  // Logout
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

  // Field setters
  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const setLocation = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const setHours = (day, field, value) =>
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

  // Images
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

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeCover = () => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
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
    if (coverFile) fd.append("coverImage", coverFile);

    try {
      const result = await updateProfile(fd).unwrap();
      showToast(result?.message || "Business profile updated", "success");

      newImagePreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);

      setRemovedImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setCoverFile(null);

      await refetchBusiness();
      setTimeout(() => navigate("/business/profile"), 500);
    } catch (err) {
      showToast(err?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    newImagePreviews.forEach((url) => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    navigate("/business/profile");
  };

  // Derived
  const totalImageCount = existingImages.length + newImageFiles.length;
  const meetsImageMinimum = totalImageCount >= MIN_BUSINESS_IMAGES;

  // ─── Guards ─────────────────────────────────────────────
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Session expired
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
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

  if (bizLoading || (!hydrated && !bizError)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BusinessSidebar onLogout={handleLogout} />
        <div className="lg:ml-64 pb-20 lg:pb-8">
          <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-4">
            <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
        <BusinessBottombar />
      </div>
    );
  }

  if (bizError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Failed to load profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {bizError?.data?.message || "Something went wrong."}
          </p>
          <button
            onClick={() => refetchBusiness()}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-32 lg:pb-24">
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-3 lg:py-4 lg:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0 disabled:opacity-60"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
              Edit Profile
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  <span className="hidden sm:inline">Saving…</span>
                </>
              ) : (
                <>
                  <FiSave className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        </header>

        <div className="px-3 sm:px-4 lg:px-8 py-4 lg:py-6 max-w-4xl mx-auto space-y-5">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Edit business profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update how your business appears to customers on LocalSpot.
            </p>
          </div>

          {/* Cover */}
          <Section
            title="Cover image"
            description="Your hero banner at the top of your profile"
            icon={FiCamera}
          >
            <div className="relative w-full aspect-[16/6] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <FiImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No cover image
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-lg transition disabled:opacity-60"
                >
                  <FiUpload className="h-3.5 w-3.5" />
                  {coverPreview ? "Change" : "Upload"}
                </button>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={removeCover}
                    disabled={isSaving}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-red-500/90 backdrop-blur-sm hover:bg-red-600 transition disabled:opacity-60"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
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
            </div>
          </Section>

          {/* Basic info */}
          <Section
            title="Basic information"
            description="Name, description, and contact details"
            icon={FiStore}
          >
            <div className="space-y-4">
              <Field label="Business name" required>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setField("businessName", e.target.value)}
                  placeholder="e.g. Maple Bakery & Cafe"
                  maxLength={100}
                  disabled={isSaving}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Description"
                hint={`${formData.description.length}/1000`}
              >
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setField("description", e.target.value.slice(0, 1000))
                  }
                  placeholder="Tell customers what makes your business unique…"
                  disabled={isSaving}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Business type">
                  <select
                    value={formData.businessType}
                    onChange={(e) => setField("businessType", e.target.value)}
                    disabled={isSaving}
                    className={inputClass}
                  >
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Phone" icon={FiPhone}>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                    disabled={isSaving}
                    className={inputClass}
                  />
                </Field>

                <Field label="Website" icon={FiGlobe}>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setField("website", e.target.value)}
                    placeholder="https://yourbusiness.com"
                    disabled={isSaving}
                    className={inputClass}
                  />
                </Field>

                <Field label="Price range">
                  <div className="grid grid-cols-4 gap-2">
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
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        } disabled:opacity-60`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          </Section>

          {/* Kind + tags */}
          <Section
            title="Business kind"
            description="Helps customers find you in the right category"
            icon={FiTag}
          >
            <div className="space-y-4">
              <Field label="Kind">
                <select
                  value={formData.businessKind}
                  onChange={(e) => setField("businessKind", e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                >
                  <option value="">— Not set —</option>
                  {BUSINESS_KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </Field>

              {formData.businessKind === "others" && (
                <Field label="Describe the kind" required>
                  <input
                    type="text"
                    value={formData.businessKindOther}
                    onChange={(e) =>
                      setField(
                        "businessKindOther",
                        e.target.value.slice(0, 100),
                      )
                    }
                    placeholder="e.g. Pet Grooming, Wedding Venue"
                    disabled={isSaving}
                    className={inputClass}
                  />
                </Field>
              )}

              <Field label="Tags" hint={`${formData.tags.length}/10`}>
                <div className="flex gap-2">
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
                    placeholder="e.g. jollof, takeaway, african"
                    disabled={isSaving}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition flex-shrink-0 disabled:opacity-60"
                  >
                    <FiPlus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400 text-xs font-medium rounded-full"
                      >
                        <FiTag className="h-3 w-3" />
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          disabled={isSaving}
                          className="ml-0.5"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section
            title="Location"
            description="Where customers can find you"
            icon={FiMapPin}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Street address">
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => setLocation("address", e.target.value)}
                    placeholder="e.g. 12 Aba Road"
                    disabled={isSaving}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="City">
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setLocation("city", e.target.value)}
                  placeholder="Port Harcourt"
                  disabled={isSaving}
                  className={inputClass}
                />
              </Field>

              <Field label="State / Region">
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setLocation("state", e.target.value)}
                  placeholder="Rivers"
                  disabled={isSaving}
                  className={inputClass}
                />
              </Field>

              <Field label="Country">
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setLocation("country", e.target.value)}
                  placeholder="Nigeria"
                  disabled={isSaving}
                  className={inputClass}
                />
              </Field>

              <Field label="Short listing address" hint="Shown on cards">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Optional short form"
                  disabled={isSaving}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Hours */}
          <Section
            title="Opening hours"
            description="Set your weekly schedule"
            icon={FiClock}
          >
            <div className="space-y-1">
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

                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => setHours(day, "open", e.target.value)}
                      disabled={hours.closed || isSaving}
                      className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                    <span className="text-gray-400 text-xs">—</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => setHours(day, "close", e.target.value)}
                      disabled={hours.closed || isSaving}
                      className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    />

                    <label className="sm:ml-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) =>
                          setHours(day, "closed", e.target.checked)
                        }
                        disabled={isSaving}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-[#3B82F6]"
                      />
                      Closed
                    </label>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Gallery */}
          <Section
            title="Business images"
            description={`Upload ${MIN_BUSINESS_IMAGES}–${MAX_BUSINESS_IMAGES} photos`}
            icon={FiImage}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      meetsImageMinimum
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {totalImageCount} / {MAX_BUSINESS_IMAGES} images
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {meetsImageMinimum
                      ? "Minimum reached"
                      : `Need ${MIN_BUSINESS_IMAGES - totalImageCount} more`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => imagesInputRef.current?.click()}
                  disabled={isSaving || totalImageCount >= MAX_BUSINESS_IMAGES}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  <FiUpload className="h-3.5 w-3.5" />
                  Upload
                </button>
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesSelect}
                  className="hidden"
                />
              </div>

              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    meetsImageMinimum ? "bg-[#3B82F6]" : "bg-orange-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (totalImageCount / MAX_BUSINESS_IMAGES) * 100,
                    )}%`,
                  }}
                />
              </div>

              {totalImageCount === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <FiImage className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    No images yet
                  </p>
                  <button
                    type="button"
                    onClick={() => imagesInputRef.current?.click()}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3B82F6] hover:underline"
                  >
                    <FiUpload className="h-4 w-4" />
                    Upload images
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={url}
                        alt="Business"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        disabled={isSaving}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
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
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white bg-[#3B82F6] rounded-full">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        disabled={isSaving}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!meetsImageMinimum && totalImageCount > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/40 text-xs text-orange-800 dark:text-orange-200">
                  <FiAlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    You need at least {MIN_BUSINESS_IMAGES} images to save
                    changes to the gallery.
                  </span>
                </div>
              )}

              {removedImages.length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-200">
                  <FiInfo className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    {removedImages.length} image
                    {removedImages.length === 1 ? "" : "s"} marked for removal.
                  </span>
                </div>
              )}
            </div>
          </Section>

          {/* Footer buttons */}
          <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky save bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <FiLoader className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FiSave className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <BusinessBottombar />
    </div>
  );
};

export default BusinessEditProfile;
