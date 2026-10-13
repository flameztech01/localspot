// src/pages/business/BusinessTransfers.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  CreditCard,
  ArrowDownLeft,
  Download,
  User as UserIcon,
  Camera,
  Activity,
  ShieldCheck,
  Star,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";

import {
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from "../../features/authApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

const TRANSFERS_LIST = [
  {
    id: "tx-1",
    reference: "PAY-2024-99120",
    description: "Bi-Weekly Merchant Settlement",
    amount: "£2,450.00",
    fee: "£12.50",
    net: "£2,437.50",
    status: "Completed",
    date: "Oct 12, 2024 at 10:15 AM",
    account: "Barclays Bank (*** 4921)",
  },
  {
    id: "tx-2",
    reference: "PAY-2024-98402",
    description: "Customer Booking Payouts (Weekend Deals)",
    amount: "£1,820.00",
    fee: "£9.10",
    net: "£1,810.90",
    status: "Completed",
    date: "Sep 28, 2024 at 09:30 AM",
    account: "Barclays Bank (*** 4921)",
  },
  {
    id: "tx-3",
    reference: "PAY-2024-97103",
    description: "Promotional Offer Revenue Share",
    amount: "£940.00",
    fee: "£4.70",
    net: "£935.30",
    status: "Completed",
    date: "Sep 14, 2024 at 11:45 AM",
    account: "Barclays Bank (*** 4921)",
  },
  {
    id: "tx-4",
    reference: "PAY-2024-96420",
    description: "Merchant Settlement Batch #39",
    amount: "£3,100.00",
    fee: "£15.50",
    net: "£3,084.50",
    status: "Completed",
    date: "Aug 30, 2024 at 02:20 PM",
    account: "Barclays Bank (*** 4921)",
  },
];

const BusinessTransfers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  const { data: userResp } = useGetCurrentUserQuery();
  const business = userResp?.data || userResp;
  const [logoutUser] = useLogoutUserMutation();

  const businessName =
    business?.businessName || business?.fullName || "Your Business";
  const businessEmail = business?.email || "";
  const avatarUrl = business?.logo || null;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap().catch(() => {});
    } catch (_) {}
    dispatch(logout());
    try {
      localStorage.removeItem("persist:root");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    } catch (_) {}
    showToast("Logged out", "info");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
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

          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition overflow-hidden"
              title="Business profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-gray-600" />
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── BREADCRUMB ─── */}
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
              Merchants
            </Link>
            <span className="text-gray-400 font-normal">›</span>
            <Link
              to="/business/profile"
              className="hover:text-blue-600 transition-colors"
            >
              Business profile
            </Link>
            <span className="text-gray-400 font-normal">›</span>
            <span className="text-gray-900 font-semibold">
              Transfers &amp; Payouts
            </span>
          </nav>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center shadow-xs">
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
                </div>
              </div>

              <nav className="pt-3 space-y-1">
                <Link
                  to="/business/profile"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <UserIcon className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Edit profile</span>
                </Link>

                <Link
                  to="/business/activity"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Activity className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Activity log</span>
                </Link>

                <Link
                  to="/business/verification"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Verification &amp; badges</span>
                </Link>

                <Link
                  to="/business/reviews"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Star className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Reviews</span>
                </Link>

                <Link
                  to="/business/transfers"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50/70 text-blue-600 transition"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Transfers</span>
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

          {/* RIGHT: Transfers content */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Transfers &amp; Payouts
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Automated direct settlements into your verified merchant bank
                  account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBankModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Payout Settings</span>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <span className="text-xs text-gray-400 font-medium">
                  Available Balance
                </span>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  £3,410.80
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Scheduled for next payout cycle
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <span className="text-xs text-gray-400 font-medium">
                  Total Disbursed (All Time)
                </span>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  £28,310.00
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  14 successful settlements
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <span className="text-xs text-gray-400 font-medium">
                  Default Bank Account
                </span>
                <p className="text-base font-bold text-gray-900 mt-1 truncate">
                  Barclays Bank UK
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Sort: 20-04-15 · Acct: *** 4921
                </p>
              </div>
            </div>

            {/* Transfer History */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Transfer History
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    showToast("Exporting payout records to CSV", "info")
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Statement</span>
                </button>
              </div>

              <div className="space-y-3">
                {TRANSFERS_LIST.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <ArrowDownLeft className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {tx.description}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          Ref: {tx.reference} · {tx.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-black text-gray-900">
                          {tx.net}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Gross: {tx.amount}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payout Settings Modal */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Merchant Payout Account
              </h3>
              <button
                type="button"
                onClick={() => setBankModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  defaultValue="Barclays Bank UK"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  defaultValue={businessName}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  defaultValue="89204921"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Sort Code / Routing Number
                </label>
                <input
                  type="text"
                  defaultValue="20-04-15"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBankModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setBankModalOpen(false);
                  showToast("Payout account details updated", "success");
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BusinessTransfers;