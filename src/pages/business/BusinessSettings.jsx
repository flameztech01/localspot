// src/pages/business/BusinessSettings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Settings,
  ArrowLeft,
  LogOut,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Save,
  Lock,
  Shield,
  Bell,
  Mail,
  Phone,
  Store,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Trash2,
  KeyRound,
  Smartphone,
  Monitor,
  ExternalLink,
  Info,
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
const NOTIF_STORAGE_KEY = "localspot_business_notif_prefs";

const DEFAULT_NOTIF_PREFS = {
  newReview: true,
  newReviewReply: true,
  promotionApproved: true,
  promotionRejected: true,
  adApproved: true,
  adRejected: true,
  weeklyDigest: false,
  marketingEmails: false,
};

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Component ─────────────────────────────────────────────
const BusinessSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [loggingOut, setLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  // ─── Account form ─────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [phoneDirty, setPhoneDirty] = useState(false);

  // ─── Password form ────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  // ─── Preferences ──────────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState(DEFAULT_NOTIF_PREFS);

  // ─── Delete confirm ───────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ─── Queries ──────────────────────────────────────────────
  const {
    data: businessResp,
    isLoading: bizLoading,
    isFetching,
    error,
    refetch,
  } = useGetCurrentBusinessAccountQuery();

  const business = businessResp?.data || businessResp;
  const isUnauthorized = error?.status === 401;

  const [updateProfile, { isLoading: isSavingProfile }] =
    useUpdateBusinessProfileMutation();
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  // Hydrate phone from business
  useEffect(() => {
    if (business?.phone && !phoneDirty) {
      setPhone(business.phone);
    }
  }, [business, phoneDirty]);

  // Load notification prefs
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (raw) {
        setNotifPrefs({ ...DEFAULT_NOTIF_PREFS, ...JSON.parse(raw) });
      }
    } catch (_) {
      // ignore
    }
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

  // ─── Save phone ───────────────────────────────────────────
  const handleSavePhone = async () => {
    const trimmed = phone.trim();
    if (trimmed === (business?.phone || "")) {
      showToast("Nothing to save", "info");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("phone", trimmed);
      const result = await updateProfile(fd).unwrap();
      showToast(result?.message || "Phone updated", "success");
      setPhoneDirty(false);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || "Failed to update phone", "error");
    }
  };

  // ─── Password change (backend pending) ────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !pwForm.currentPassword ||
      !pwForm.newPassword ||
      !pwForm.confirmPassword
    ) {
      showToast("All password fields are required", "error");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("New passwords don't match", "error");
      return;
    }
    if (pwForm.currentPassword === pwForm.newPassword) {
      showToast("New password must be different", "error");
      return;
    }

    // ⚠️ Backend not yet implemented.
    // Wire this to `useUpdateBusinessPasswordMutation` once the endpoint exists:
    // try {
    //   await updatePassword(pwForm).unwrap();
    //   showToast("Password updated", "success");
    //   setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    // } catch (err) {
    //   showToast(err?.data?.message || "Failed to update password", "error");
    // }
    showToast("Password change endpoint isn't live yet — coming soon", "info");
  };

  // ─── Notifications ────────────────────────────────────────
  const toggleNotif = (key) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(next);
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  // ─── Delete account ───────────────────────────────────────
  const handleDeleteAccount = () => {
    // ⚠️ Backend not implemented — no soft-delete / deactivate endpoint yet.
    showToast("Account deletion requires contacting support for now", "info");
    setShowDeleteConfirm(false);
  };

  // ─── Unauthorized ─────────────────────────────────────────
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

  // ─── Sections nav ─────────────────────────────────────────
  const SECTIONS = [
    { id: "account", label: "Account", icon: Store },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "danger", label: "Danger zone", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BusinessSidebar onLogout={handleLogout} />

      <div className="lg:ml-64 pb-20 lg:pb-8">
        {/* Header */}
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
              Settings
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh"
              className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
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

        <div className="px-3 sm:px-4 lg:px-8 py-4 lg:py-6 max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-5">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
              Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your account, security, and preferences.
            </p>
          </div>

          {/* Section tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-2 mb-5 overflow-x-auto">
            <div className="flex gap-1 min-w-max sm:min-w-0">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const active = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                      active
                        ? "bg-[#3B82F6] text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              SECTION: ACCOUNT
          ═══════════════════════════════════════════════════ */}
          {activeSection === "account" && (
            <div className="space-y-4">
              {/* Business identity */}
              <SettingsCard
                icon={Store}
                title="Business identity"
                description="Your business name and contact details."
              >
                {bizLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Business name
                        </label>
                        <input
                          type="text"
                          value={business?.businessName || ""}
                          readOnly
                          disabled
                          className={inputClass}
                        />
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          Change your business name from{" "}
                          <button
                            type="button"
                            onClick={() => navigate("/business/profile")}
                            className="text-[#3B82F6] hover:underline"
                          >
                            Profile
                          </button>
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={business?.email || ""}
                          readOnly
                          disabled
                          className={inputClass}
                        />
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          Contact support to change your email
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setPhoneDirty(true);
                          }}
                          disabled={isSavingProfile}
                          placeholder="+2348012345678"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      {phoneDirty && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhone(business?.phone || "");
                            setPhoneDirty(false);
                          }}
                          disabled={isSavingProfile}
                          className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSavePhone}
                        disabled={isSavingProfile || !phoneDirty}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSavingProfile ? (
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
                  </>
                )}
              </SettingsCard>

              {/* Verification status */}
              <SettingsCard
                icon={Shield}
                title="Verification status"
                description="Where your account stands with LocalSpot."
              >
                <div className="space-y-3">
                  <StatusRow
                    label="Email verified"
                    value={business?.isVerified}
                    helpText={
                      business?.isVerified
                        ? "Your email is confirmed"
                        : "Verify your email to unlock features"
                    }
                  />
                  <StatusRow
                    label="Business approved"
                    value={business?.businessVerified}
                    helpText={
                      business?.businessVerified
                        ? "Your business is visible to customers"
                        : business?.businessRejectionReason ||
                          "Pending review by our team"
                    }
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              SECTION: SECURITY
          ═══════════════════════════════════════════════════ */}
          {activeSection === "security" && (
            <div className="space-y-4">
              {/* Change password */}
              <SettingsCard
                icon={KeyRound}
                title="Change password"
                description="Use a strong password of at least 8 characters."
              >
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <PasswordField
                    label="Current password"
                    value={pwForm.currentPassword}
                    onChange={(v) =>
                      setPwForm((p) => ({ ...p, currentPassword: v }))
                    }
                    visible={showPw.current}
                    onToggle={() =>
                      setShowPw((s) => ({ ...s, current: !s.current }))
                    }
                    autoComplete="current-password"
                  />
                  <PasswordField
                    label="New password"
                    value={pwForm.newPassword}
                    onChange={(v) =>
                      setPwForm((p) => ({ ...p, newPassword: v }))
                    }
                    visible={showPw.next}
                    onToggle={() => setShowPw((s) => ({ ...s, next: !s.next }))}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    label="Confirm new password"
                    value={pwForm.confirmPassword}
                    onChange={(v) =>
                      setPwForm((p) => ({ ...p, confirmPassword: v }))
                    }
                    visible={showPw.confirm}
                    onToggle={() =>
                      setShowPw((s) => ({ ...s, confirm: !s.confirm }))
                    }
                    autoComplete="new-password"
                  />

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Update password
                    </button>
                  </div>
                </form>

                <NoticeBox
                  tone="info"
                  icon={Info}
                  text="Password change endpoint is not yet live. The form will show a placeholder message until the backend is built."
                />
              </SettingsCard>

              {/* Two-factor auth */}
              <SettingsCard
                icon={Smartphone}
                title="Two-factor authentication"
                description="Add an extra layer of security to your account."
              >
                <ToggleRow
                  label="Enable 2FA"
                  description="Require a code from your phone when signing in"
                  checked={false}
                  onChange={() =>
                    showToast(
                      "2FA endpoint isn't live yet — coming soon",
                      "info",
                    )
                  }
                />
              </SettingsCard>

              {/* Sessions */}
              <SettingsCard
                icon={Monitor}
                title="Active sessions"
                description="Devices currently signed into your account."
              >
                <div className="space-y-2">
                  <SessionRow
                    device="This device"
                    browser="Current browser"
                    location="—"
                    isCurrent
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "Session management endpoint isn't live yet",
                        "info",
                      )
                    }
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sign out of all other devices
                  </button>
                </div>
              </SettingsCard>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              SECTION: NOTIFICATIONS
          ═══════════════════════════════════════════════════ */}
          {activeSection === "notifications" && (
            <SettingsCard
              icon={Bell}
              title="Notification preferences"
              description="Choose what you want to hear about. Saved on this device."
            >
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ToggleRow
                  label="New review received"
                  description="When a customer leaves a review"
                  checked={notifPrefs.newReview}
                  onChange={() => toggleNotif("newReview")}
                />
                <ToggleRow
                  label="Review reply"
                  description="When someone replies to your review reply"
                  checked={notifPrefs.newReviewReply}
                  onChange={() => toggleNotif("newReviewReply")}
                />
                <ToggleRow
                  label="Promotion approved"
                  description="When a promotion passes review"
                  checked={notifPrefs.promotionApproved}
                  onChange={() => toggleNotif("promotionApproved")}
                />
                <ToggleRow
                  label="Promotion rejected"
                  description="When a promotion is declined"
                  checked={notifPrefs.promotionRejected}
                  onChange={() => toggleNotif("promotionRejected")}
                />
                <ToggleRow
                  label="Ad approved"
                  description="When an advertisement passes review"
                  checked={notifPrefs.adApproved}
                  onChange={() => toggleNotif("adApproved")}
                />
                <ToggleRow
                  label="Ad rejected"
                  description="When an advertisement is declined"
                  checked={notifPrefs.adRejected}
                  onChange={() => toggleNotif("adRejected")}
                />
                <ToggleRow
                  label="Weekly digest"
                  description="Summary of your business performance every Monday"
                  checked={notifPrefs.weeklyDigest}
                  onChange={() => toggleNotif("weeklyDigest")}
                />
                <ToggleRow
                  label="Product updates"
                  description="New features and platform news"
                  checked={notifPrefs.marketingEmails}
                  onChange={() => toggleNotif("marketingEmails")}
                />
              </div>
            </SettingsCard>
          )}

          {/* ═══════════════════════════════════════════════════
              SECTION: DANGER ZONE
          ═══════════════════════════════════════════════════ */}
          {activeSection === "danger" && (
            <div className="space-y-4">
              <SettingsCard
                icon={LogOut}
                title="Sign out"
                description="End your session on this device."
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-3.5 w-3.5" />
                        Sign out
                      </>
                    )}
                  </button>
                </div>
              </SettingsCard>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-red-900 dark:text-red-200">
                        Danger zone
                      </h3>
                      <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-0.5">
                        These actions are permanent and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Delete business account
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Permanently remove your business, promotions, ads, and
                        reviews from LocalSpot.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition flex-shrink-0 self-start sm:self-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} LocalSpot Systems Ltd. — Business
              Account Center
            </p>
          </footer>
        </div>
      </div>

      {/* Delete account confirm */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete your business account?"
          body="This will permanently remove your business, promotions, ads, and reviews. This action cannot be undone."
          confirmLabel="Delete account"
          confirmTone="danger"
          Icon={Trash2}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          isLoading={false}
        />
      )}

      <BusinessBottombar />
    </div>
  );
};

// ─── Settings card ─────────────────────────────────────────
const SettingsCard = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-[#3B82F6]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Password field ────────────────────────────────────────
const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label={visible ? "Hide" : "Show"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

// ─── Toggle row ────────────────────────────────────────────
const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-[#3B82F6]" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

// ─── Status row ────────────────────────────────────────────
const StatusRow = ({ label, value, helpText }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </p>
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {helpText}
        </p>
      )}
    </div>
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${
        value
          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {value ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Yes
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          No
        </>
      )}
    </span>
  </div>
);

// ─── Session row ───────────────────────────────────────────
const SessionRow = ({ device, browser, location, isCurrent }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
      <Monitor className="h-4 w-4 text-[#3B82F6]" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {device}
        </p>
        {isCurrent && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Current
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {browser} · {location}
      </p>
    </div>
  </div>
);

// ─── Notice box ────────────────────────────────────────────
const NoticeBox = ({ tone = "info", icon: Icon, text }) => {
  const toneClass = {
    info: "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-100 dark:border-blue-900/40",
    warning:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-100 dark:border-orange-900/40",
  }[tone];

  return (
    <div
      className={`mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs leading-relaxed ${toneClass}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
      <span>{text}</span>
    </div>
  );
};

// ─── Confirm modal ─────────────────────────────────────────
const ConfirmModal = ({
  title,
  body,
  confirmLabel,
  confirmTone = "primary",
  Icon = AlertTriangle,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const toneClass = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-orange-500 hover:bg-orange-600",
    primary: "bg-[#3B82F6] hover:bg-blue-700",
  }[confirmTone];

  const iconBg = {
    danger: "bg-red-50 dark:bg-red-900/20 text-red-500",
    warning: "bg-orange-50 dark:bg-orange-900/20 text-orange-500",
    primary: "bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6]",
  }[confirmTone];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed break-words">
              {body}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed ${toneClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Working...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
