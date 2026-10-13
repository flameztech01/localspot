// src/pages/business/BusinessReviews.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Reply,
  Flag,
  User as UserIcon,
  Store,
  Megaphone,
  BarChart3,
  Heart,
  LogOut,
  Image as ImageIcon,
  Menu,
  X,
  Building2,
  Check,
  Send,
  Trash2,
  Pencil,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  useListMyBusinessReviewsQuery,
  useReplyToReviewMutation,
} from "../../features/reviewApiSlice";
import {
  useGetCurrentBusinessAccountQuery,
  useLogoutBusinessAccountMutation,
} from "../../features/businessApiSlice";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/Footer";

// ─── Initial Mock Reviews for "Reviews by you" (Screenshot 1) ────────
const INITIAL_REVIEWS_BY_YOU = [
  {
    id: "r-by-1",
    status: "Published",
    statusColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    rating: 5,
    location: "67-04 Myrtle Ave Glendale, NY 11385",
    date: "Jan 17, 2024",
    text: "Excellent apartment in the very center of the city, attractions and entertainment venues are located 50m from the flat. The flat was perfectly clean and had basic slippers, gel-shampoo, clean towels.",
    likes: 6,
    dislikes: 0,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r-by-2",
    status: "Published",
    statusColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    rating: 5,
    location: "517 82nd St, Brooklyn, NY 11209",
    date: "Dec 5, 2024",
    text: "I recently rented an apartment, and it has been a fantastic experience. The apartment itself is beautiful, with modern finishes and plenty of natural light. The property management team is very attentive and responds quickly to any maintenance requests. The common areas, including the pool and gym, are always clean and well-maintained.",
    likes: 13,
    dislikes: 2,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r-by-3",
    status: "Archived",
    statusColor: "bg-gray-100 text-gray-600 border border-gray-200",
    rating: 3,
    location: "929 Hart St, Brooklyn, NY 11237",
    date: "May 6, 2023",
    text: "The property was not as advertised; several features that were supposed to be included, such as a fitness center and updated appliances, were either non-existent or in poor condition. Maintenance requests are rarely addressed in a timely manner, with some issues lingering for months without resolution. The overall upkeep of the building is lacking, with common areas often dirty and neglected.",
    likes: 4,
    dislikes: 1,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "r-by-4",
    status: "Published",
    statusColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    rating: 4,
    location: "1234 Maple Street, Brooklyn, NY 11201",
    date: "Oct 3, 2022",
    text: "I recently rented an apartment and had a positive experience overall. The location is convenient, and the building amenities are great. The apartment itself is spacious and well-maintained. However, there were a few minor issues with the plumbing that took a little longer to fix than expected. Despite that, I'm happy with my decision and would recommend it to others.",
    likes: 19,
    dislikes: 5,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
  },
];

// ─── Initial Mock Reviews for "Reviews about you" (Screenshot 2) ─────
const INITIAL_REVIEWS_ABOUT_YOU = [
  {
    id: "r-about-1",
    author: "Randy Walker",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    date: "Nov 12, 2024",
    rating: 5,
    location: "67-04 Myrtle Ave Glendale, NY 11385",
    text: "Excellent apartment in the very center of the city, attractions and entertainment venues are located 50m from the flat. The flat was perfectly clean and had basic slippers, gel-shampoo, clean towels.",
    reply: {
      author: "Michael Williams",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      date: "Nov 13, 2024",
      text: "Thank you for your feedback. I'm glad you were satisfied :)",
    },
  },
  {
    id: "r-about-2",
    author: "Kathryn Murphy",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    date: "Sep 17, 2024",
    rating: 5,
    location: "517 82nd St, Brooklyn, NY 11209",
    text: "I recently rented an apartment, and it has been a fantastic experience. The apartment itself is beautiful, with modern finishes and plenty of natural light. The property management team is very attentive and responds quickly to any maintenance requests. The common areas, including the pool and gym, are always clean and well-maintained.",
    reply: null,
  },
  {
    id: "r-about-3",
    author: "Darrell Steward",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    date: "Aug 5, 2024",
    rating: 5,
    location: "929 Hart St, Brooklyn, NY 11237",
    text: "I had a great experience with Michael Williams when selling my home. The team was professional, reliable, and extremely knowledgeable about the market. They provided excellent marketing for my property, which attracted a lot of interest and ultimately led to a quick sale above the asking price. I highly recommend their services to anyone looking to sell their home.",
    reply: null,
  },
  {
    id: "r-about-4",
    author: "Ralph Edwards",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    date: "Jul 4, 2024",
    rating: 4,
    location: "1234 Maple Street, Brooklyn, NY 11201",
    text: "I recently rented an apartment and had a positive experience overall. The location is convenient, and the building amenities are great. The apartment itself is spacious and well-maintained. However, there were a few minor issues with the plumbing that took a little longer to fix than expected. Despite that, I'm happy with my decision and would recommend it to others.",
    reply: null,
  },
];

// ─── Stars Component ────────────────────────────────────────────────
const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function BusinessReviews() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Active Tab: 'about' | 'by'
  const [activeTab, setActiveTab] = useState("about"); // Default: Reviews about you
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCardMenuId, setActiveCardMenuId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Reviews Data
  const [reviewsAboutYou, setReviewsAboutYou] = useState(
    INITIAL_REVIEWS_ABOUT_YOU
  );
  const [reviewsByYou, setReviewsByYou] = useState(INITIAL_REVIEWS_BY_YOU);

  // Reply Modal State
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  // Business Account Data
  const { data: businessResp } = useGetCurrentBusinessAccountQuery();
  const business = businessResp?.data || businessResp;
  const [logoutBusinessAccount] = useLogoutBusinessAccountMutation();

  const businessName =
    business?.businessName || "Business account name";
  const businessEmail =
    business?.email || "your_business@example.com";

  // Logout handler
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

  // Upvote / Downvote on "Reviews by you"
  const handleVote = (id, type) => {
    setReviewsByYou((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            likes: type === "up" ? r.likes + 1 : r.likes,
            dislikes: type === "down" ? r.dislikes + 1 : r.dislikes,
          };
        }
        return r;
      })
    );
    showToast(type === "up" ? "Upvoted review" : "Feedback recorded", "success");
  };

  // Submit reply
  const handleSendReply = () => {
    if (!replyInput.trim() || !replyTarget) return;

    setReviewsAboutYou((prev) =>
      prev.map((r) => {
        if (r.id === replyTarget.id) {
          return {
            ...r,
            reply: {
              author: businessName,
              avatar:
                business?.logo ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              date: "Just now",
              text: replyInput.trim(),
            },
          };
        }
        return r;
      })
    );

    showToast("Reply posted successfully", "success");
    setReplyTarget(null);
    setReplyInput("");
  };

  // Report review
  const handleReport = (author) => {
    showToast(`Reported review by ${author} for moderation review`, "info");
  };

  // Archive review
  const handleToggleArchive = (id) => {
    setReviewsByYou((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isArchived = r.status === "Archived";
          return {
            ...r,
            status: isArchived ? "Published" : "Archived",
            statusColor: isArchived
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200",
          };
        }
        return r;
      })
    );
    setActiveCardMenuId(null);
    showToast("Review status updated", "info");
  };

  // Delete review by you
  const handleDeleteReview = (id) => {
    setReviewsByYou((prev) => prev.filter((r) => r.id !== id));
    setActiveCardMenuId(null);
    showToast("Review deleted", "error");
  };

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

          {/* Right User Avatar */}
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
          2. MAIN CONTAINER (2 COLUMNS: SIDEBAR + REVIEWS)
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

              {/* Navigation Menu (Connected to Proper Locations) */}
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
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <BarChart3 className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>Analytics &amp; Business data</span>
                </Link>

                <Link
                  to="/business/reviews"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50/70 text-blue-600 transition"
                >
                  <Star className="w-4 h-4 shrink-0" />
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
              RIGHT COLUMN: Reviews Work area
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header: Title & Filter Tabs */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                Reviews
              </h1>

              {/* Tabs: Reviews about you & Reviews by you */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("about");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === "about"
                      ? "bg-white text-gray-900 border border-gray-900 shadow-xs"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Reviews about you ({reviewsAboutYou.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("by");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === "by"
                      ? "bg-white text-gray-900 border border-gray-900 shadow-xs"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Reviews by you ({reviewsByYou.length})
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                TAB 1: REVIEWS ABOUT YOU (Screenshot 2)
            ═══════════════════════════════════════════════════════ */}
            {activeTab === "about" && (
              <div className="space-y-4">
                {reviewsAboutYou.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    {/* Header Row: Reviewer Avatar, Name, Date, and Stars */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {rev.author}
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            {rev.date}
                          </p>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <StarRating rating={rev.rating} />
                    </div>

                    {/* Review on Address */}
                    <p className="text-xs text-gray-700 font-semibold">
                      Review on:{" "}
                      <span className="font-bold text-gray-900">
                        {rev.location}
                      </span>
                    </p>

                    {/* Review Comment Text */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {rev.text}
                    </p>

                    {/* Nested Business Reply (if already replied) */}
                    {rev.reply && (
                      <div className="mt-3 p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.reply.avatar}
                            alt={rev.reply.author}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-900">
                              {rev.reply.author}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {rev.reply.date}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pl-9">
                          {rev.reply.text}
                        </p>
                      </div>
                    )}

                    {/* Action Bar: Reply & Report Buttons (if not replied yet) */}
                    {!rev.reply && (
                      <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTarget(rev);
                            setReplyInput("");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReport(rev.author)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination (Screenshot 2: 1, 2) */}
                <div className="flex items-center gap-2 pt-4">
                  {[1, 2].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        currentPage === p
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                TAB 2: REVIEWS BY YOU (Screenshot 1)
            ═══════════════════════════════════════════════════════ */}
            {activeTab === "by" && (
              <div className="space-y-4">
                {reviewsByYou.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    {/* Top Row: Thumbnail + Badges/Rating/Location + Date & Menu */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Place Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {rev.image ? (
                            <img
                              src={rev.image}
                              alt={rev.location}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        {/* Status, Stars, and Location */}
                        <div className="space-y-1.5 min-w-0">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${rev.statusColor}`}
                          >
                            {rev.status}
                          </span>

                          <StarRating rating={rev.rating} />

                          <p className="text-xs font-semibold text-gray-700">
                            Review on:{" "}
                            <span className="font-bold text-gray-900">
                              {rev.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Date & 3-dots Menu */}
                      <div className="flex items-center gap-3 self-end sm:self-start">
                        <span className="text-[11px] text-gray-400 font-medium">
                          {rev.date}
                        </span>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardMenuId(
                                activeCardMenuId === rev.id ? null : rev.id
                              );
                            }}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeCardMenuId === rev.id && (
                            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in duration-100">
                              <button
                                type="button"
                                onClick={() => handleToggleArchive(rev.id)}
                                className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                              >
                                {rev.status === "Archived"
                                  ? "Publish"
                                  : "Archive"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(rev.id)}
                                className="w-full text-left px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Review Comment Text */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {rev.text}
                    </p>

                    {/* Thumbs Up / Down Footer */}
                    <div className="pt-2 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleVote(rev.id, "up")}
                        className="inline-flex items-center gap-1.5 hover:text-blue-600 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{rev.likes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVote(rev.id, "down")}
                        className="inline-flex items-center gap-1.5 hover:text-red-500 transition"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{rev.dislikes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination (Screenshot 1: 1, 2, 3) */}
                <div className="flex items-center gap-2 pt-4">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        currentPage === p
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. REPLY MODAL (When clicking Reply)
      ───────────────────────────────────────────────────────────── */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Reply to {replyTarget.author}
              </h3>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
              "{replyTarget.text}"
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Your Response
              </label>
              <textarea
                rows={4}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Write a professional and welcoming reply..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post reply</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. EXISTING APPLICATION FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}