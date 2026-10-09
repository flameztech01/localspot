// src/pages/business/BusinessSettings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Store,
  Phone,
  Mail,
  Lock,
  LogOut,
  Loader,
  AlertCircle,
  Pencil,
  X,
  Save,
  User as UserIcon,
  Shield,
  CheckCircle2,
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

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition";

// ─── Main ──────────────────────────────────────────────────
const BusinessSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const {
    data: businessResp,
    isLoading,
    error,
    refetch,
  } = useGetCurrentBusinessAccountQuery();

  const business = businessResp?.data || businessResp;
  const isUnauthorized = error?.status === 401;

  const [updateProfile] = useUpdateBusinessProfileMutation();
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
    navigate("/business/signin", { replace: true });
    setTimeout(() => window.location.reload(), 50);
  };

  // ─── Guards ──────────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-white">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-24 lg:pb-10">
        <main className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account information and preferences.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 p-6 space-y-4"
                >
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-900">
                Failed to load settings
              </p>
              <p className="text-xs text-red-700 mt-1">
                {error?.data?.message || "Something went wrong"}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* ─── Account info ─── */}
              <SettingsSection
                icon={Store}
                title="Account information"
                description="Your business account details"
              >
                {/* Business name (read-only) */}
                <Row
                  label="Business name"
                  value={business?.businessName || "—"}
                  icon={Store}
                  hint="Change from Business profile"
                />

                {/* Email (read-only) */}
                <Row
                  label="Email address"
                  value={business?.email || "—"}
                  icon={Mail}
                  hint="Email cannot be changed"
                />

                {/* Phone (editable) */}
                <Row
                  label="Phone number"
                  value={business?.phone || "Not added"}
                  icon={Phone}
                  muted={!business?.phone}
                  action={
                    <button
                      type="button"
                      onClick={() => setEditPhoneOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
                    >
                      <Pencil className="h-3 w-3" />
                      {business?.phone ? "Edit" : "Add"}
                    </button>
                  }
                />
              </SettingsSection>

              {/* ─── Verification status ─── */}
              <SettingsSection
                icon={Shield}
                title="Account status"
                description="Where your account stands"
              >
                <Row
                  label="Email verification"
                  value={business?.isVerified ? "Verified" : "Not verified"}
                  icon={CheckCircle2}
                  tone={business?.isVerified ? "good" : "bad"}
                />
                <Row
                  label="Business approval"
                  value={
                    business?.businessVerified
                      ? "Approved"
                      : business?.businessRejectionReason
                        ? "Rejected"
                        : "Pending review"
                  }
                  icon={CheckCircle2}
                  tone={
                    business?.businessVerified
                      ? "good"
                      : business?.businessRejectionReason
                        ? "bad"
                        : "warn"
                  }
                />
                {business?.businessRejectionReason && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {business.businessRejectionReason}
                  </p>
                )}
              </SettingsSection>

              {/* ─── Session ─── */}
              <SettingsSection
                icon={LogOut}
                title="Session"
                description="Sign out of your account on this device"
              >
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(true)}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-60"
                >
                  {loggingOut ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Signing out…
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </>
                  )}
                </button>
              </SettingsSection>
            </div>
          )}
        </main>
      </div>

      {/* ─── Edit phone modal ─── */}
      {editPhoneOpen && (
        <EditPhoneModal
          current={business?.phone || ""}
          onClose={() => setEditPhoneOpen(false)}
          onSuccess={() => {
            setEditPhoneOpen(false);
            refetch();
          }}
          updateProfile={updateProfile}
          onNotify={showToast}
        />
      )}

      {/* ─── Logout confirm ─── */}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !loggingOut && setLogoutConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Sign out?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  You'll need to log in again to access your business
                  dashboard.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={loggingOut}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                    Signing out…
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <BusinessBottombar />
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Section
// ──────────────────────────────────────────────────────────
const SettingsSection = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-[#3B82F6]" />
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-gray-900 truncate">{title}</h2>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </section>
);

// ──────────────────────────────────────────────────────────
// Row
// ──────────────────────────────────────────────────────────
const Row = ({ label, value, icon: Icon, hint, action, tone, muted }) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-red-600"
        : tone === "warn"
          ? "text-amber-600"
          : "text-gray-900";

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        {Icon && (
          <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <p
            className={`text-sm font-semibold mt-0.5 truncate ${
              muted ? "text-gray-400 italic" : toneClass
            }`}
          >
            {value}
          </p>
          {hint && (
            <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Edit phone modal
// ──────────────────────────────────────────────────────────
const EditPhoneModal = ({
  current,
  onClose,
  onSuccess,
  updateProfile,
  onNotify,
}) => {
  const [phone, setPhone] = useState(current || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = phone.trim();
    if (!trimmed) {
      onNotify?.("Phone number is required", "error");
      return;
    }

    if (trimmed === (current || "")) {
      onNotify?.("Nothing to update", "info");
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("phone", trimmed);
      const r = await updateProfile(fd).unwrap();
      onNotify?.(r?.message || "Phone updated", "success");
      onSuccess?.();
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to update", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={() => !isSaving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-[#3B82F6]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900">
                {current ? "Edit phone number" : "Add phone number"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customers will see this number
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0 disabled:opacity-60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
            disabled={isSaving}
            autoFocus
            className={inputClass}
          />
          <p className="text-[10px] text-gray-400 mt-1.5">
            Include the country code (e.g. +234 for Nigeria).
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !phone.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessSettings;