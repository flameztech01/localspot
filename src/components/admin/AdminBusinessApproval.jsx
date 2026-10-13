// src/components/admin/AdminBusinessApproval.jsx
import React, { useState } from "react";
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
  FiFileText,
  FiShield,
  FiLayers,
  FiAward,
  FiImage,
  FiCalendar,
  FiUserCheck,
} from "react-icons/fi";

import {
  useGetBusinessByIdQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
  useApproveBusinessKYCMutation,
  useRejectBusinessKYCMutation,
} from "../../features/businessApiSlice";

// ─── Constants ─────────────────────────────────────────────
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const BUSINESS_TYPE_LABELS = {
  sole_proprietorship: "Sole Proprietorship",
  partnership: "Partnership",
  llc: "Limited Liability Company",
  corporation: "Corporation",
  other: "Other",
};

const BUSINESS_KIND_LABELS = {
  hotels: "Hotels & Lodging",
  dining: "Dining & Restaurants",
  things_to_do: "Things to Do",
  shops: "Shops & Retail",
  others: "Others",
};

const REPRESENTATIVE_LABELS = {
  owner: "Sole Proprietor / Founder",
  director: "Managing Director / CEO",
  agent: "Authorized Legal Agent",
};

const ID_TYPE_LABELS = {
  nin: "National Identity Number (NIN)",
  passport: "International Passport",
  drivers_license: "Driver's License",
  voters_card: "Voter's Card",
};

const REGISTRATION_TYPE_LABELS = {
  llc: "Limited Liability Company (RC)",
  bn: "Registered Business Name (BN)",
  partnership: "General Partnership",
  corp: "Corporation / Plc",
};

// ─── Helpers ───────────────────────────────────────────────
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

const formatDateOnly = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const priceSymbol = (n) =>
  n === 1 ? "$" : n === 2 ? "$$" : n === 3 ? "$$$" : n === 4 ? "$$$$" : "—";

const isPdfUrl = (url) =>
  typeof url === "string" && url.toLowerCase().includes(".pdf");

const isImageUrl = (url) =>
  typeof url === "string" &&
  /\.(jpg|jpeg|png|webp|gif)$/i.test(url.split("?")[0]);

// ─── Main ──────────────────────────────────────────────────
const AdminBusinessApproval = ({
  businessId,
  onBack,
  onNotify,
  onApproved,
  onRejected,
}) => {
  const [rejectionModal, setRejectionModal] = useState(null);
  // null | { target: "application" | "kyc" }
  const [rejectionReason, setRejectionReason] = useState("");
  const [showFullGallery, setShowFullGallery] = useState(false);

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
  const [approveBusinessKYC, { isLoading: isApprovingKYC }] =
    useApproveBusinessKYCMutation();
  const [rejectBusinessKYC, { isLoading: isRejectingKYC }] =
    useRejectBusinessKYCMutation();

  const isMutating =
    isApproving || isRejecting || isApprovingKYC || isRejectingKYC;

  // ─── Status computation ────────────────────────────────
  const appStatus = business?.businessApplicationStatus || "none";
  const kycStatus = business?.kycStatus || "none";

  const handleApproveApplication = async () => {
    if (!business) return;
    try {
      const result = await approveBusiness(business._id).unwrap();
      onNotify?.(result?.message || "Business application approved");
      onApproved?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to approve application",
        "error",
      );
    }
  };

  const handleApproveKYC = async () => {
    if (!business) return;
    try {
      const result = await approveBusinessKYC(business._id).unwrap();
      onNotify?.(result?.message || "KYC approved — Trust Badge issued");
      onApproved?.();
    } catch (err) {
      onNotify?.(err?.data?.message || "Failed to approve KYC", "error");
    }
  };

  const openRejectModal = (target) => {
    setRejectionReason("");
    setRejectionModal({ target });
  };

  const handleConfirmReject = async () => {
    if (!business || !rejectionModal) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      onNotify?.("Rejection reason is required", "error");
      return;
    }

    try {
      if (rejectionModal.target === "kyc") {
        const r = await rejectBusinessKYC({ id: business._id, reason }).unwrap();
        onNotify?.(r?.message || "KYC rejected");
      } else {
        const r = await rejectBusiness(business._id, reason).unwrap?.() ||
          (await rejectBusiness({ id: business._id, reason }).unwrap());
        onNotify?.(r?.message || "Business application rejected");
      }
      setRejectionModal(null);
      onRejected?.();
    } catch (err) {
      onNotify?.(
        err?.data?.message || "Failed to reject",
        "error",
      );
    }
  };

  // ─── Guard states ──────────────────────────────────────
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

  // ─── Derived display data ──────────────────────────────
  const loc = business.location || {};
  const cityState = [loc.city, loc.state].filter(Boolean).join(", ");
  const cover =
    business.coverImage ||
    (Array.isArray(business.images) && business.images[0]) ||
    null;
  const gallery = Array.isArray(business.images) ? business.images : [];
  const visibleGallery = showFullGallery ? gallery : gallery.slice(0, 8);

  const hasKYCData =
    business.ownerLegalName ||
    business.idNumber ||
    business.operatingAddress ||
    business.cacNumber ||
    business.idDocument ||
    business.utilityBillFile ||
    business.regulatoryLicenceFile ||
    business.activityProofFile;

  const hasAnyKYCPending = kycStatus === "pending";
  const hasAnyApplicationPending = appStatus === "pending";
  const isFullyApproved =
    business.businessVerified && kycStatus === "approved";

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
            Submitted {formatDate(business.businessApplicationSubmittedAt || business.createdAt)}
          </span>
        </div>
      </div>

      {/* Title + Status badges */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Business review
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label="Email"
              value={business.isVerified ? "Verified" : "Unverified"}
              tone={business.isVerified ? "success" : "warning"}
            />
            <StatusBadge
              label="Application"
              value={
                appStatus === "approved"
                  ? "Approved"
                  : appStatus === "rejected"
                    ? "Rejected"
                    : appStatus === "pending"
                      ? "Pending"
                      : "Not submitted"
              }
              tone={
                appStatus === "approved"
                  ? "success"
                  : appStatus === "rejected"
                    ? "danger"
                    : appStatus === "pending"
                      ? "warning"
                      : "muted"
              }
            />
            <StatusBadge
              label="KYC"
              value={
                kycStatus === "approved"
                  ? "Verified"
                  : kycStatus === "rejected"
                    ? "Rejected"
                    : kycStatus === "pending"
                      ? "Pending"
                      : "Not submitted"
              }
              tone={
                kycStatus === "approved"
                  ? "success"
                  : kycStatus === "rejected"
                    ? "danger"
                    : kycStatus === "pending"
                      ? "warning"
                      : "muted"
              }
            />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review the business application and KYC credentials before approving
          or rejecting.
        </p>
      </div>

      {/* Rejection banners */}
      {appStatus === "rejected" && business.businessRejectionReason && (
        <Banner
          tone="danger"
          title="Application previously rejected"
          body={business.businessRejectionReason}
          timestamp={business.businessApplicationReviewedAt}
        />
      )}
      {kycStatus === "rejected" && business.kycRejectionReason && (
        <Banner
          tone="danger"
          title="KYC previously rejected"
          body={business.kycRejectionReason}
          timestamp={business.kycReviewedAt}
        />
      )}

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : cover ? (
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
              {business.businessKind && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                  {business.businessKind === "others"
                    ? business.businessKindOther || "Others"
                    : BUSINESS_KIND_LABELS[business.businessKind] ||
                      business.businessKind}
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT — details */}
        <div className="lg:col-span-8 space-y-6">
          {/* ── General information ── */}
          <SectionCard title="General information" icon={<FiInfo />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoTile label="Business name" value={business.businessName} />
              <InfoTile
                label="Business kind"
                value={
                  business.businessKind
                    ? business.businessKind === "others"
                      ? business.businessKindOther || "Others"
                      : BUSINESS_KIND_LABELS[business.businessKind]
                    : "—"
                }
              />
              <InfoTile
                label="Business type"
                value={
                  business.businessType
                    ? BUSINESS_TYPE_LABELS[business.businessType]
                    : "—"
                }
              />
              <InfoTile
                label="Price range"
                value={
                  business.priceRange
                    ? `${priceSymbol(business.priceRange)} (${business.priceRange} of 4)`
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
              <InfoTile
                label="Application status"
                value={
                  <span className="capitalize">{appStatus}</span>
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

          {/* ── Contact ── */}
          <SectionCard title="Contact information" icon={<FiMail />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoTile label="Email" value={business.email} />
              <InfoTile label="Phone" value={business.phone || "—"} />
              {loc.address && (
                <InfoTile label="Street address" value={loc.address} />
              )}
              {business.address && (
                <InfoTile label="Listing address" value={business.address} />
              )}
            </div>
          </SectionCard>

          {/* ── Location ── */}
          <SectionCard title="Location" icon={<FiMapPin />}>
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

          {/* ── Opening hours ── */}
          <SectionCard title="Opening hours" icon={<FiClock />}>
            {Array.isArray(business.openingHours) &&
            business.openingHours.length > 0 ? (
              <div className="space-y-1.5">
                {DAY_NAMES.map((name, day) => {
                  const h = business.openingHours.find((x) => x.day === day);
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

          {/* ── Media gallery ── */}
          {(gallery.length > 0 || business.coverImage || business.logo) && (
            <SectionCard title="Business images" icon={<FiImage />}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-gray-500">
                  {gallery.length} image{gallery.length === 1 ? "" : "s"}
                </span>
                {gallery.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setShowFullGallery((v) => !v)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {showFullGallery ? "Show less" : "Show all"}
                  </button>
                )}
              </div>

              {gallery.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  No gallery images submitted yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {visibleGallery.map((url, i) => (
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
              )}

              <div className="grid grid-cols-2 gap-3 mt-3">
                {business.logo && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <img
                      src={business.logo}
                      alt="Logo"
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-[11px] font-semibold text-gray-700">
                      Logo
                    </span>
                  </div>
                )}
                {business.coverImage && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <img
                      src={business.coverImage}
                      alt="Cover"
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-[11px] font-semibold text-gray-700">
                      Cover banner
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════════════════════════
              KYC SECTION
          ════════════════════════════════════════════════════ */}
          {hasKYCData && (
            <>
              {/* ── Representative / owner ── */}
              <SectionCard title="Verified representative" icon={<FiUserCheck />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoTile
                    label="Capacity"
                    value={
                      business.representativeType
                        ? REPRESENTATIVE_LABELS[business.representativeType]
                        : "—"
                    }
                  />
                  <InfoTile
                    label="Legal name"
                    value={business.ownerLegalName || "—"}
                  />
                  <InfoTile
                    label="Date of birth"
                    value={formatDateOnly(business.ownerDob)}
                  />
                  <InfoTile
                    label="ID type"
                    value={
                      business.idType
                        ? ID_TYPE_LABELS[business.idType]
                        : "—"
                    }
                  />
                  <InfoTile
                    label="ID number"
                    value={business.idNumber || "—"}
                  />
                </div>

                {business.idDocument && (
                  <FilePreview
                    label="Government ID document"
                    url={business.idDocument}
                  />
                )}
              </SectionCard>

              {/* ── CAC registry ── */}
              <SectionCard title="CAC registration" icon={<FiFileText />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoTile
                    label="Registered entity name"
                    value={business.registeredBusinessName || "—"}
                  />
                  <InfoTile
                    label="Corporate structure"
                    value={
                      business.registrationType
                        ? REGISTRATION_TYPE_LABELS[business.registrationType]
                        : "—"
                    }
                  />
                  <InfoTile
                    label="CAC / RC number"
                    value={business.cacNumber || "—"}
                  />
                  <InfoTile
                    label="Registry status"
                    value={business.cacStatus || "—"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {business.cacDocument && (
                    <FilePreview
                      label="CAC certificate"
                      url={business.cacDocument}
                    />
                  )}
                  {business.activityProofFile && (
                    <FilePreview
                      label="Storefront / activity photo"
                      url={business.activityProofFile}
                    />
                  )}
                </div>
              </SectionCard>

              {/* ── Address verification ── */}
              <SectionCard title="Address verification" icon={<FiMapPin />}>
                <InfoTile
                  label="Operating address"
                  value={business.operatingAddress || "—"}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {business.utilityBillFile && (
                    <FilePreview
                      label="Utility bill / lease"
                      url={business.utilityBillFile}
                    />
                  )}

                  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                      Duplicate-listing check
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      {business.duplicateListingChecked
                        ? "Cleared — no conflicts"
                        : "Not yet checked"}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Licences ── */}
              {(business.foodLicenceNumber ||
                business.liquorLicenceNumber ||
                business.regulatoryLicenceFile ||
                business.riskCategory) && (
                <SectionCard
                  title="Category-specific licences"
                  icon={<FiLayers />}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoTile
                      label="Risk category"
                      value={business.riskCategory || "—"}
                    />
                    <InfoTile
                      label="Food hygiene licence #"
                      value={business.foodLicenceNumber || "—"}
                    />
                    <InfoTile
                      label="Licence expiry"
                      value={formatDateOnly(business.foodLicenceExpiry)}
                    />
                    <InfoTile
                      label="Liquor / other licence #"
                      value={business.liquorLicenceNumber || "—"}
                    />
                  </div>

                  {business.regulatoryLicenceFile && (
                    <FilePreview
                      label="Regulatory licence document"
                      url={business.regulatoryLicenceFile}
                    />
                  )}
                </SectionCard>
              )}

              {/* ── Declaration / KYC workflow ── */}
              <SectionCard title="Compliance declaration" icon={<FiShield />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoTile
                    label="Declaration accepted"
                    value={
                      business.kycDeclarationAccepted ? (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <FiCheck size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold inline-flex items-center gap-1">
                          <FiX size={12} /> No
                        </span>
                      )
                    }
                  />
                  <InfoTile
                    label="Submitted at"
                    value={formatDate(business.kycSubmittedAt)}
                  />
                  {business.kycReviewedAt && (
                    <InfoTile
                      label="Reviewed at"
                      value={formatDate(business.kycReviewedAt)}
                    />
                  )}
                  {business.kycReviewedBy && (
                    <InfoTile
                      label="Reviewed by"
                      value="Admin reviewer"
                    />
                  )}
                </div>
              </SectionCard>
            </>
          )}

          {!hasKYCData && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <FiInfo className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-700 mb-1">
                No KYC submission yet
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                This business hasn't submitted their verification documents
                yet. KYC data will appear here once they do.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — decision panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4 lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
              Review decisions
            </h3>

            {/* Fact summary */}
            <div className="space-y-2 text-xs">
              <Row
                label="Email verified"
                value={business.isVerified ? "Yes" : "No"}
                tone={business.isVerified ? "good" : "bad"}
              />
              <Row
                label="Application"
                value={
                  appStatus === "approved"
                    ? "Approved"
                    : appStatus === "rejected"
                      ? "Rejected"
                      : appStatus === "pending"
                        ? "Pending"
                        : "Not submitted"
                }
                tone={
                  appStatus === "approved"
                    ? "good"
                    : appStatus === "rejected"
                      ? "bad"
                      : appStatus === "pending"
                        ? "warn"
                        : "muted"
                }
              />
              <Row
                label="KYC"
                value={
                  kycStatus === "approved"
                    ? "Verified"
                    : kycStatus === "rejected"
                      ? "Rejected"
                      : kycStatus === "pending"
                        ? "Pending"
                        : "Not submitted"
                }
                tone={
                  kycStatus === "approved"
                    ? "good"
                    : kycStatus === "rejected"
                      ? "bad"
                      : kycStatus === "pending"
                        ? "warn"
                        : "muted"
                }
              />
              {business.businessVerifiedAt && (
                <Row
                  label="Approved at"
                  value={formatDate(business.businessVerifiedAt)}
                />
              )}
              {business.kycReviewedAt && (
                <Row
                  label="KYC reviewed"
                  value={formatDate(business.kycReviewedAt)}
                />
              )}
              <Row
                label="Active account"
                value={business.isActive ? "Yes" : "No"}
                tone={business.isActive ? "good" : "bad"}
              />
            </div>

            {/* Unverified email warning */}
            {!business.isVerified && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <FiInfo size={14} className="mt-0.5 shrink-0" />
                <span>
                  This business hasn't verified their email yet. Ask them to
                  complete email verification before approving.
                </span>
              </div>
            )}

            {/* Fully approved state */}
            {isFullyApproved && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <FiAward size={16} className="mt-0.5 shrink-0" />
                <span>
                  Fully verified business. The Trust Badge is live on their
                  public listing.
                </span>
              </div>
            )}

            {/* ── Application review actions ── */}
            {hasAnyApplicationPending && business.isVerified && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Application decision
                </p>
                <button
                  type="button"
                  onClick={handleApproveApplication}
                  disabled={isMutating}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                >
                  {isApproving ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      Approving…
                    </>
                  ) : (
                    <>
                      <FiCheck size={14} />
                      Approve application
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openRejectModal("application")}
                  disabled={isMutating}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-bold text-xs transition-colors disabled:opacity-60"
                >
                  Reject application
                </button>
              </div>
            )}

            {/* ── KYC review actions ── */}
            {hasAnyKYCPending && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  KYC decision
                </p>
                <button
                  type="button"
                  onClick={handleApproveKYC}
                  disabled={isMutating}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                >
                  {isApprovingKYC ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      Issuing badge…
                    </>
                  ) : (
                    <>
                      <FiAward size={14} />
                      Approve KYC &amp; issue badge
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openRejectModal("kyc")}
                  disabled={isMutating}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-bold text-xs transition-colors disabled:opacity-60"
                >
                  Reject KYC
                </button>
              </div>
            )}

            {/* Nothing pending */}
            {!hasAnyApplicationPending &&
              !hasAnyKYCPending &&
              !isFullyApproved && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs">
                  <FiInfo size={14} className="mt-0.5 shrink-0" />
                  <span>
                    No pending decisions. This record is either fully approved
                    or nothing has been submitted yet.
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Rejection modal */}
      {rejectionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isMutating && setRejectionModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="text-amber-500" />
                {rejectionModal.target === "kyc"
                  ? "Reject KYC submission"
                  : "Reject business application"}
              </h3>
              <button
                type="button"
                onClick={() => !isMutating && setRejectionModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              The business owner will see this message and can update their
              submission before resubmitting.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Rejection reason
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={
                  rejectionModal.target === "kyc"
                    ? "e.g. The uploaded utility bill is older than 3 months. Please resubmit a recent document."
                    : "e.g. Please upload a valid business permit and clarify your physical address."
                }
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
                onClick={() => setRejectionModal(null)}
                disabled={isMutating}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isMutating || !rejectionReason.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold"
              >
                {isMutating ? (
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

// ─── Small components ──────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      {icon && <span className="text-[#5397F6]">{icon}</span>}
      <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
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
        : tone === "warn"
          ? "text-amber-600"
          : tone === "muted"
            ? "text-gray-400"
            : "text-gray-900";
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold ${toneClass}`}>{value}</span>
    </div>
  );
};

const StatusBadge = ({ label, value, tone }) => {
  const cls =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : tone === "danger"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border ${cls}`}
    >
      <span className="opacity-70">{label}:</span>
      {value}
    </span>
  );
};

const Banner = ({ tone, title, body, timestamp }) => {
  const cls =
    tone === "danger"
      ? "bg-rose-50 border-rose-200 text-rose-900"
      : tone === "warning"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-gray-50 border-gray-200 text-gray-800";
  return (
    <div className={`border rounded-2xl p-4 flex items-start gap-3 ${cls}`}>
      <FiAlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs mt-1 leading-relaxed">{body}</p>
        {timestamp && (
          <p className="text-[10px] opacity-70 mt-1.5">
            {formatDate(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

const FilePreview = ({ label, url }) => (
  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70">
    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">
      {label}
    </span>
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
    >
      <FiFileText size={13} />
      {isPdfUrl(url) ? "View PDF" : "View document"}
      <FiExternalLink size={11} />
    </a>
    {isImageUrl(url) && (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="block mt-2 rounded-lg overflow-hidden border border-gray-200"
      >
        <img src={url} alt={label} className="w-full max-h-32 object-cover" />
      </a>
    )}
  </div>
);

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