// src/components/admin/AdminAddBusinessModal.jsx
import React, { useEffect, useState } from "react";
import {
  FiX,
  FiBriefcase,
  FiCheck,
  FiCopy,
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useAdminCreateBusinessMutation } from "../../features/adminApiSlice";

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
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
  { value: 4, label: "$$$$" },
];

const inputClass =
  "w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed";

const emptyForm = {
  businessName: "",
  email: "",
  password: "",
  phone: "",
  businessType: "other",
  businessKind: "",
  businessKindOther: "",
  address: "",
  description: "",
  website: "",
  categorySlug: "",
  tags: "",
  priceRange: 2,
  location: { city: "", state: "", country: "Nigeria", address: "" },
  markVerified: true,
};

const AdminAddBusinessModal = ({ isOpen, onClose, onNotify }) => {
  const [createBusiness, { isLoading }] = useAdminCreateBusinessMutation();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [created, setCreated] = useState(null); // success state

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setCreated(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateLocation = (field, value) =>
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.businessName.trim() || !form.email.trim()) {
      onNotify?.("Business name and email are required", "error");
      return;
    }

    if (form.businessKind === "others" && !form.businessKindOther.trim()) {
      onNotify?.('Please describe the "Others" business kind', "error");
      return;
    }

    const payload = {
      businessName: form.businessName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password || undefined,
      phone: form.phone.trim() || undefined,
      businessType: form.businessType,
      businessKind: form.businessKind || undefined,
      businessKindOther:
        form.businessKind === "others"
          ? form.businessKindOther.trim()
          : undefined,
      address: form.address.trim() || undefined,
      description: form.description.trim() || undefined,
      website: form.website.trim() || undefined,
      categorySlug: form.categorySlug.trim() || undefined,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      priceRange: form.priceRange,
      location: form.location,
      markVerified: form.markVerified,
    };

    try {
      const result = await createBusiness(payload).unwrap();
      setCreated(result);
      onNotify?.(result?.message || "Business created", "success");
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to create business",
        "error"
      );
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      onNotify?.("Copied to clipboard", "success");
    } catch {
      onNotify?.("Could not copy", "error");
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95"
      >
        {/* ── SUCCESS STATE ── */}
        {created ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <FiCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Business created
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-md">
                {created?.data?.businessName} has been added to the directory
                {created?.data?.businessVerified
                  ? " and is now live."
                  : " and is pending approval."}
              </p>
            </div>

            {created?.temporaryPassword && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FiAlertCircle
                    className="text-amber-600 shrink-0"
                    size={14}
                  />
                  <span className="text-xs font-bold text-amber-900">
                    Save this password — it won't be shown again
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  The business owner can log in with their email and this
                  temporary password, then change it from Settings.
                </p>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-amber-200 px-3 py-2">
                  <code className="flex-1 text-xs font-mono font-bold text-gray-900 break-all">
                    {created.temporaryPassword}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(created.temporaryPassword)}
                    className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition"
                    aria-label="Copy password"
                  >
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5397F6] flex items-center justify-center shrink-0">
                  <FiBriefcase size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-gray-900 truncate">
                    Add New Business
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    Register a business directly. It can be marked verified
                    immediately or queued for review.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-60"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* ── FORM ── */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              {/* Section: Basic */}
              <Section title="Basic information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Business name" required>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) =>
                        update("businessName", e.target.value)
                      }
                      placeholder="e.g. Maple Bakery & Cafe"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="owner@business.com"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>

                  <Field
                    label="Password"
                    hint="Leave blank to auto-generate"
                  >
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                          update("password", e.target.value)
                        }
                        placeholder="Min 8 chars (optional)"
                        className={`${inputClass} pr-10`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FiEyeOff size={14} />
                        ) : (
                          <FiEye size={14} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field label="Phone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>

                  <Field label="Business type">
                    <select
                      value={form.businessType}
                      onChange={(e) =>
                        update("businessType", e.target.value)
                      }
                      className={inputClass}
                      disabled={isLoading}
                    >
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Website">
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                </div>
              </Section>

              {/* Section: Business kind */}
              <Section title="Business kind">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Kind">
                    <select
                      value={form.businessKind}
                      onChange={(e) =>
                        update("businessKind", e.target.value)
                      }
                      className={inputClass}
                      disabled={isLoading}
                    >
                      <option value="">— Not set —</option>
                      {BUSINESS_KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {form.businessKind === "others" && (
                    <Field label="Describe the kind" required>
                      <input
                        type="text"
                        value={form.businessKindOther}
                        onChange={(e) =>
                          update("businessKindOther", e.target.value)
                        }
                        placeholder="e.g. Pet Grooming"
                        maxLength={100}
                        className={inputClass}
                        disabled={isLoading}
                      />
                    </Field>
                  )}

                  <Field label="Category slug">
                    <input
                      type="text"
                      value={form.categorySlug}
                      onChange={(e) =>
                        update("categorySlug", e.target.value)
                      }
                      placeholder="e.g. restaurants (optional)"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>

                  <Field label="Tags" hint="Comma-separated">
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => update("tags", e.target.value)}
                      placeholder="jollof, takeaway, african"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                </div>

                <Field label="Price range">
                  <div className="grid grid-cols-4 gap-2 max-w-xs">
                    {PRICE_RANGES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => update("priceRange", p.value)}
                        disabled={isLoading}
                        className={`py-2 rounded-xl text-sm font-bold transition border ${
                          form.priceRange === p.value
                            ? "bg-[#5397F6] text-white border-[#5397F6]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        } disabled:opacity-60`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </Section>

              {/* Section: Location */}
              <Section title="Location">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Street address">
                    <input
                      type="text"
                      value={form.location.address}
                      onChange={(e) =>
                        updateLocation("address", e.target.value)
                      }
                      placeholder="12 Aba Road"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field label="City">
                    <input
                      type="text"
                      value={form.location.city}
                      onChange={(e) =>
                        updateLocation("city", e.target.value)
                      }
                      placeholder="Port Harcourt"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field label="State / Region">
                    <input
                      type="text"
                      value={form.location.state}
                      onChange={(e) =>
                        updateLocation("state", e.target.value)
                      }
                      placeholder="Rivers"
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      type="text"
                      value={form.location.country}
                      onChange={(e) =>
                        updateLocation("country", e.target.value)
                      }
                      className={inputClass}
                      disabled={isLoading}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Short listing address">
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) =>
                          update("address", e.target.value)
                        }
                        placeholder="Shown on listings (optional)"
                        className={inputClass}
                        disabled={isLoading}
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              {/* Section: Description */}
              <Section title="Description">
                <Field label="Business description">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      update("description", e.target.value)
                    }
                    placeholder="A short description of what this business offers..."
                    className={`${inputClass} resize-none`}
                    disabled={isLoading}
                    maxLength={1000}
                  />
                </Field>
              </Section>

              {/* Section: Verification */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <input
                  id="markVerified"
                  type="checkbox"
                  checked={form.markVerified}
                  onChange={(e) =>
                    update("markVerified", e.target.checked)
                  }
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5397F6] focus:ring-[#5397F6]"
                  disabled={isLoading}
                />
                <label
                  htmlFor="markVerified"
                  className="text-xs text-gray-700 leading-relaxed cursor-pointer"
                >
                  <span className="font-bold text-gray-900 block">
                    Mark as verified & live immediately
                  </span>
                  <span className="text-gray-600">
                    If unchecked, the business will be created but queued for
                    manual approval.
                  </span>
                </label>
              </div>
            </form>

            {/* ── FOOTER ── */}
            <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#5397F6] hover:bg-[#4288ec] text-white font-bold text-xs shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={13} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create business"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Small helpers ────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, hint, required, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-bold text-gray-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {hint && (
        <span className="text-[10px] text-gray-400 font-medium">
          {hint}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default AdminAddBusinessModal;