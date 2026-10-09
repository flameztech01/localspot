// src/components/admin/AdminBusinessApproval.jsx
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiExternalLink,
  FiLoader,
  FiInfo,
  FiUser,
} from "react-icons/fi";

import {
  useGetBusinessByIdQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} from "../../features/businessApiSlice";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const priceSymbol = (n) =>
  n === 1 ? "$" : n === 2 ? "$$" : n === 3 ? "$$$" : n === 4 ? "$$$$" : "—";

const AdminBusinessApproval = ({
  businessId,
  onBack,
  onNotify,
  onApproved,
  onRejected,
}) => {
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(
    "Missing required business documentation"
  );

  const {
    data: resp,
    isLoading,
    error,
  } = useGetBusinessByIdQuery(businessId, { skip: !businessId });

  const business = resp?.data || null;

  const [approveBusiness, { isLoading: isApproving }] =
    useApproveBusinessMutation();
  const [rejectBusiness, { isLoading: isRejecting }] =
    useRejectBusinessMutation();

  const isMutating = isApproving || isRejecting;

  const handleApprove = async () => {
    if (!business) return;
    try {
      const result = await approveBusiness(business._id).unwrap();
      onNotify?.(result?.message || "Business approved successfully");
      onApproved?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to approve business",
        "error"
      );
    }
  };

  const handleReject = async () => {
    if (!business) return;
    if (!rejectionReason.trim()) {
      onNotify?.("Rejection reason is required", "error");
      return;
    }
    try {
      const result = await rejectBusiness({
        id: business._id,
        reason: rejectionReason.trim(),
      }).unwrap();
      onNotify?.(result?.message || "Business rejected");
      setRejectionModalOpen(false);
      onRejected?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to reject business",
        "error"
      );
    }
  };

  // ─── Loading / errors ────────────────────────────────────
  if (!businessId) {
    return (
      <EmptyState
        title="No business selected"
        body="Pick a business from the management list to review."
        onBack={onBack}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <FiLoader className="h-6 w-6 text-[#5397F6] animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading business…</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <EmptyState
        title="Could not load business"
        body={
          error?.data?.message ||
          "The business may have been deleted or you don't have access."
        }
        onBack={onBack}
      />
    );
  }

  const status = !business.isVerified
    ? "unverified"
    : business.businessVerified
    ? "approved"
    : business.businessRejectionReason
    ? "rejected"
    : "pending";

  const statusMeta = {
    approved: {
      label: "Approved",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-300",
      Icon: FiCheckCircle,
    },
    pending: {
      label: "Pending Review",
      className: "bg-amber-100 text-amber-900 border border-amber-300",
      Icon: FiClock,
    },
    rejected: {
      label: "Rejected",
      className: "bg-rose-50 text-rose-700 border border-rose-300",
      Icon: FiX,
    },
    unverified: {
      label: "Email Unverified",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
      Icon: FiAlertTriangle,
    },
  }[status];

  const StatusIcon = statusMeta.Icon;

  const cover =
    business.coverImage ||
    (Array.isArray(business.images) && business.images[0]) ||
    null;
  const gallery = Array.isArray(business.images) ? business.images : [];

  const loc = business.location || {};
  const cityState = [loc.city, loc.state].filter(Boolean).join(", ");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors self-start"
        >
          <FiArrowLeft size={14} />
          Back to businesses
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-gray-500">
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold font-mono">
            {business._id.slice(-8).toUpperCase()}
          </span>
          <span className="hidden md:inline text-gray-400">
            Submitted {formatDate(business.createdAt)}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Business approval
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${statusMeta.className}`}
          >
            <StatusIcon size={13} />
            {statusMeta.label}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Verify the details below before approving or rejecting.
        </p>
      </div>

      {/* Rejection reason banner if applicable */}
      {status === "rejected" && business.businessRejectionReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-rose-900">
              Previously rejected
            </h3>
            <p className="text-xs mt-1 text-rose-800 leading-relaxed">
              {business.businessRejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Hero banner */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
            {cover ? (
              <img
                src={cover}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#5397F6]">
                {(business.businessName || "B").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-gray-900 truncate">
                {business.businessName || "Unnamed business"}
              </h2>
              {business.categorySlug && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                  {business.categorySlug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
              {loc.city && (
                <span className="inline-flex items-center gap-1">
                  <FiMapPin size={12} className="text-gray-400" />
                  {cityState}
                </span>
              )}
              {business.phone && (
                <span className="inline-flex items-center gap-1">
                  <FiPhone size={12} className="text-gray-400" />
                  {business.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <FiMail size={12} className="text-gray-400" />
                {business.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT — business details */}
        <div className="lg:col-span-8 space-y-6">
          <SectionCard
            title="Business profile"
            section="Section 1 of 4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoTile label="Business name" value={business.businessName} />
              <InfoTile
                label="Business type"
                value={
                  business.businessType
                    ? business.businessType
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    : "—"
                }
              />
              <InfoTile
                label="Price range"
                value={
                  business.priceRange
                    ? `${priceSymbol(business.priceRange)} (${
                        business.priceRange
                      } of 4)`
                    : "—"
                }
              />
              <InfoTile
                label="Website"
                value={
                  business.website ? (
                    <a
                      href={
                        business.website.startsWith("http")
                          ? business.website
                          : `https://${business.website}`
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      {business.website}
                      <FiExternalLink size={11} />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </div>

            {business.description && (
              <div className="mt-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Description
                </span>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            )}

            {Array.isArray(business.tags) && business.tags.length > 0 && (
              <div className="mt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {business.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Contact information" section="Section 2 of 4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoTile label="Email" value={business.email} />
              <InfoTile label="Phone" value={business.phone || "—"} />
              {business.location?.address && (
                <InfoTile
                  label="Street address"
                  value={business.location.address}
                />
              )}
              {business.address && (
                <InfoTile label="Listing address" value={business.address} />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Location" section="Section 3 of 4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoTile label="City" value={loc.city || "—"} />
              <InfoTile label="State / Region" value={loc.state || "—"} />
              <InfoTile label="Country" value={loc.country || "—"} />
            </div>

            {loc.coordinates?.coordinates &&
              loc.coordinates.coordinates.some((n) => n !== 0) && (
                <div className="mt-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    GPS coordinates
                  </span>
                  <div className="font-mono text-xs text-gray-700">
                    {loc.coordinates.coordinates[1]?.toFixed(4)}° N,{" "}
                    {loc.coordinates.coordinates[0]?.toFixed(4)}° E
                  </div>
                </div>
              )}
          </SectionCard>

          <SectionCard title="Opening hours" section="Section 4 of 4">
            {Array.isArray(business.openingHours) &&
            business.openingHours.length > 0 ? (
              <div className="space-y-1.5">
                {DAY_NAMES.map((name, day) => {
                  const h = business.openingHours.find(
                    (x) => x.day === day
                  );
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-semibold text-gray-700">
                        {name}
                      </span>
                      {!h || h.closed ? (
                        <span className="text-rose-500 font-medium">
                          Closed
                        </span>
                      ) : (
                        <span className="font-mono text-gray-600">
                          {h.open} — {h.close}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No opening hours submitted yet.
              </p>
            )}
          </SectionCard>

          {/* Media */}
          {gallery.length > 0 && (
            <SectionCard title="Business images" section="Media">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:opacity-90 transition"
                  >
                    <img
                      src={url}
                      alt={`Business ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* RIGHT — decision panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
              Review decision
            </h3>

            <div className="space-y-2 text-xs">
              <Row
                label="Email verified"
                value={business.isVerified ? "Yes" : "No"}
                tone={business.isVerified ? "good" : "bad"}
              />
              <Row
                label="Business approved"
                value={business.businessVerified ? "Yes" : "No"}
                tone={business.businessVerified ? "good" : "bad"}
              />
              {business.businessVerifiedAt && (
                <Row
                  label="Approved at"
                  value={formatDate(business.businessVerifiedAt)}
                />
              )}
              <Row
                label="Active account"
                value={business.isActive ? "Yes" : "No"}
                tone={business.isActive ? "good" : "bad"}
              />
            </div>

            {status === "unverified" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <FiInfo size={14} className="mt-0.5 shrink-0" />
                <span>
                  This business hasn't verified their email yet. Ask them to
                  complete email verification before reviewing.
                </span>
              </div>
            )}

            {status !== "approved" && (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isMutating || status === "unverified"}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <FiCheck size={16} />
                  {status === "rejected"
                    ? "Approve anyway"
                    : "Approve business"}
                </button>

                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(true)}
                  disabled={isMutating}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-bold text-xs transition-colors disabled:opacity-60"
                >
                  Reject with reason
                </button>
              </div>
            )}

            {status === "approved" && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <FiCheckCircle size={16} />
                <span>This business is approved and visible to customers.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection modal */}
      {rejectionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isRejecting && setRejectionModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="text-amber-500" />
                Reject business
              </h3>
              <button
                type="button"
                onClick={() => !isRejecting && setRejectionModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              The business owner will see this message and can update their
              profile before resubmitting.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Rejection reason
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please upload a valid business permit and clarify your physical address."
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
                maxLength={500}
              />
              <p className="text-[10px] text-gray-400 text-right">
                {rejectionReason.length}/500
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                disabled={isRejecting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold"
              >
                {isRejecting ? (
                  <>
                    <FiLoader size={13} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Small components ─────────────────────────────────────
const SectionCard = ({ title, section, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      {section && (
        <span className="text-[11px] font-bold text-gray-400">{section}</span>
      )}
    </div>
    {children}
  </div>
);

const InfoTile = ({ label, value }) => (
  <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
      {label}
    </span>
    <div className="font-semibold text-gray-900 text-xs break-words">
      {value || "—"}
    </div>
  </div>
);

const Row = ({ label, value, tone }) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
      ? "text-rose-600"
      : "text-gray-900";
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold ${toneClass}`}>{value}</span>
    </div>
  );
};

const EmptyState = ({ title, body, onBack }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3 max-w-lg mx-auto">
    <FiAlertTriangle className="h-8 w-8 text-gray-300 mx-auto" />
    <h3 className="text-base font-bold text-gray-900">{title}</h3>
    <p className="text-xs text-gray-500 max-w-sm mx-auto">{body}</p>
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5397F6] text-white text-xs font-bold"
      >
        <FiArrowLeft size={13} /> Back to list
      </button>
    )}
  </div>
);

export default AdminBusinessApproval;