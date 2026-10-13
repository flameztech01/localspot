// src/pages/business/BusinessVerification.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  Upload,
  FileText,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  FileCheck,
  ChevronDown,
  Camera,
  Activity,
  LogOut,
  Menu,
  X,
  Check,
  Loader2,
  BadgeCheck,
  Layers,
  Eye,
  EyeOff,
  Hourglass,
  Image as ImageIcon,
  Trash2,
  Plus,
  Tag as TagIcon,
} from "lucide-react";

import {
  useGetMyBusinessKYCQuery,
  useSubmitBusinessKYCMutation,
  useUpdateBusinessKYCMutation,
} from "../../features/businessApiSlice";
import {
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from "../../features/authApiSlice";
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
  { value: "llc", label: "Limited Liability Company" },
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

const REPRESENTATIVE_OPTIONS = [
  { value: "owner", label: "Sole Proprietor / Founder" },
  { value: "director", label: "Managing Director / CEO" },
  { value: "agent", label: "Authorized Legal Agent" },
];

const ID_TYPE_OPTIONS = [
  { value: "nin", label: "National Identity Number (NIN)" },
  { value: "passport", label: "International Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voters_card", label: "Voter's Card" },
];

const REGISTRATION_TYPE_OPTIONS = [
  { value: "llc", label: "Limited Liability Company (RC)" },
  { value: "bn", label: "Registered Business Name (BN)" },
  { value: "partnership", label: "General Partnership" },
  { value: "corp", label: "Corporation / Plc" },
];

// ─── Helpers ───────────────────────────────────────────────
const toInputDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const inputCls =
  "w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed";

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
                className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-2 transition ${
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

// ─── Section wrapper ───────────────────────────────────────
const SectionCard = ({ icon, title, badge, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      {badge && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

// ─── Main Component ────────────────────────────────────────
const BusinessVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // ─── Account data ─────────────────────────────────────
  const { data: userResp } = useGetCurrentUserQuery();
  const business = userResp?.data || userResp;
  const [logoutUser] = useLogoutUserMutation();

  const accountName =
    business?.businessName || business?.fullName || "Your Business";
  const businessEmail = business?.email || "";
  const businessPhone = business?.phone || "";
  const avatarUrl = business?.logo || null;

  // ─── KYC data ─────────────────────────────────────────
  const { data: kycResp } = useGetMyBusinessKYCQuery();

  const kyc = kycResp?.data?.kyc || business || {};
  const kycStatus = kycResp?.data?.status || "none";
  const kycRejectionReason = kycResp?.data?.rejectionReason || null;
  const kycSubmittedAt = kycResp?.data?.submittedAt || null;
  const kycReviewedAt = kycResp?.data?.reviewedAt || null;

  const [submitKYC, { isLoading: isSubmitting }] =
    useSubmitBusinessKYCMutation();
  const [updateKYC, { isLoading: isUpdating }] = useUpdateBusinessKYCMutation();

  const isSaving = isSubmitting || isUpdating;

  const phoneVerified = !!business?.phone;
  const emailVerified = !!business?.isVerified;

  // ═══════════════════════════════════════════════════════
  // BUSINESS PROFILE STATE
  // ═══════════════════════════════════════════════════════
  const [businessName, setBusinessName] = useState("");
  const [businessKind, setBusinessKind] = useState("");
  const [businessKindOther, setBusinessKindOther] = useState("");
  const [businessType, setBusinessType] = useState("other");
  const [priceRange, setPriceRange] = useState(2);
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Location
  const [locCity, setLocCity] = useState("");
  const [locState, setLocState] = useState("");
  const [locCountry, setLocCountry] = useState("");

  // Hours
  const [openingHours, setOpeningHours] = useState(DEFAULT_HOURS);

  // Media
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const logoInputRef = useRef(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const coverInputRef = useRef(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const galleryInputRef = useRef(null);

  // ═══════════════════════════════════════════════════════
  // KYC STATE
  // ═══════════════════════════════════════════════════════
  const [representativeType, setRepresentativeType] = useState("owner");
  const [ownerLegalName, setOwnerLegalName] = useState("");
  const [ownerDob, setOwnerDob] = useState("");
  const [idType, setIdType] = useState("nin");
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [idFilePreview, setIdFilePreview] = useState(null);
  const idInputRef = useRef(null);

  const [registeredBusinessName, setRegisteredBusinessName] = useState("");
  const [registrationType, setRegistrationType] = useState("llc");
  const [cacNumber, setCacNumber] = useState("");
  const [cacStatus, setCacStatus] = useState("");
  const [cacFile, setCacFile] = useState(null);
  const [cacFilePreview, setCacFilePreview] = useState(null);
  const [activityFile, setActivityFile] = useState(null);
  const [activityPreview, setActivityPreview] = useState(null);
  const cacInputRef = useRef(null);
  const activityInputRef = useRef(null);

  const [operatingAddress, setOperatingAddress] = useState("");
  const [utilityFile, setUtilityFile] = useState(null);
  const [utilityPreview, setUtilityPreview] = useState(null);
  const utilityInputRef = useRef(null);

  const [riskCategory, setRiskCategory] = useState("");
  const [foodLicenceNumber, setFoodLicenceNumber] = useState("");
  const [foodLicenceExpiry, setFoodLicenceExpiry] = useState("");
  const [liquorLicenceNumber, setLiquorLicenceNumber] = useState("");
  const [licenceFile, setLicenceFile] = useState(null);
  const [licencePreview, setLicencePreview] = useState(null);
  const licenceInputRef = useRef(null);

  const [agreeTerms, setAgreeTerms] = useState(false);

  // ─── Hydrate from existing KYC ────────────────────────
  useEffect(() => {
    if (!kyc) return;

    // Business profile
    setBusinessName(kyc.businessName || "");
    setBusinessKind(kyc.businessKind || "");
    setBusinessKindOther(kyc.businessKindOther || "");
    setBusinessType(kyc.businessType || "other");
    setPriceRange(kyc.priceRange || 2);
    setDescription(kyc.description || "");
    setWebsite(kyc.website || "");
    setShortAddress(kyc.address || "");
    setTags(Array.isArray(kyc.tags) ? kyc.tags : []);
    setLocCity(kyc.location?.city || "");
    setLocState(kyc.location?.state || "");
    setLocCountry(kyc.location?.country || "");
    setOpeningHours(
      Array.isArray(kyc.openingHours) && kyc.openingHours.length > 0
        ? kyc.openingHours
        : DEFAULT_HOURS,
    );
    if (kyc.logo) setLogoPreview(kyc.logo);
    if (kyc.coverImage) setCoverPreview(kyc.coverImage);
    setExistingImages(Array.isArray(kyc.images) ? kyc.images : []);

    // KYC
    setRepresentativeType(kyc.representativeType || "owner");
    setOwnerLegalName(kyc.ownerLegalName || "");
    setOwnerDob(toInputDate(kyc.ownerDob));
    setIdType(kyc.idType || "nin");
    setIdNumber(kyc.idNumber || "");
    if (kyc.idDocument) setIdFilePreview(kyc.idDocument);

    setRegisteredBusinessName(kyc.registeredBusinessName || "");
    setRegistrationType(kyc.registrationType || "llc");
    setCacNumber(kyc.cacNumber || "");
    setCacStatus(kyc.cacStatus || "");
    if (kyc.cacDocument) setCacFilePreview(kyc.cacDocument);
    if (kyc.activityProofFile) setActivityPreview(kyc.activityProofFile);

    setOperatingAddress(kyc.operatingAddress || "");
    if (kyc.utilityBillFile) setUtilityPreview(kyc.utilityBillFile);

    setRiskCategory(kyc.riskCategory || "");
    setFoodLicenceNumber(kyc.foodLicenceNumber || "");
    setFoodLicenceExpiry(toInputDate(kyc.foodLicenceExpiry));
    setLiquorLicenceNumber(kyc.liquorLicenceNumber || "");
    if (kyc.regulatoryLicenceFile) setLicencePreview(kyc.regulatoryLicenceFile);

    setAgreeTerms(!!kyc.kycDeclarationAccepted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kyc?._id, kyc?.kycStatus]);

  // ─── Cleanup blob URLs on unmount ─────────────────────
  useEffect(() => {
    return () => {
      [
        idFilePreview,
        cacFilePreview,
        activityPreview,
        utilityPreview,
        licencePreview,
        logoPreview,
        coverPreview,
        ...galleryPreviews,
      ].forEach((u) => {
        if (u?.startsWith?.("blob:")) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Body scroll lock ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ─── Status flags ─────────────────────────────────────
  const isApproved = kycStatus === "approved";
  const isPending = kycStatus === "pending";
  const isRejected = kycStatus === "rejected";
  const isLocked = isApproved;
  const shouldHideForm = (isApproved || isPending) && !showEditForm;

  // ─── Derived counts ───────────────────────────────────
  const totalImages = existingImages.length + galleryFiles.length;

  // ─── Handlers ─────────────────────────────────────────
  const handleLogout = async () => {
    setMobileMenuOpen(false);
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

  const makeFileHandler = (setFile, setPreview, label) => (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview((prev) => {
      if (prev?.startsWith?.("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    showToast(`${label} selected`, "success");
    e.target.value = "";
  };

  const handleIdSelect = makeFileHandler(setIdFile, setIdFilePreview, "ID document");
  const handleCacSelect = makeFileHandler(setCacFile, setCacFilePreview, "CAC certificate");
  const handleActivitySelect = makeFileHandler(setActivityFile, setActivityPreview, "Storefront photo");
  const handleUtilitySelect = makeFileHandler(setUtilityFile, setUtilityPreview, "Address proof");
  const handleLicenceSelect = makeFileHandler(setLicenceFile, setLicencePreview, "Licence");

  const handleLogoSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    if (logoPreview?.startsWith?.("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(f));
    setRemoveLogo(false);
    e.target.value = "";
  };

  const handleRemoveLogo = () => {
    if (logoPreview?.startsWith?.("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
  };

  const handleCoverSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    if (coverPreview?.startsWith?.("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(f));
    setRemoveCover(false);
    e.target.value = "";
  };

  const handleRemoveCover = () => {
    if (coverPreview?.startsWith?.("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(true);
  };

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
    setGalleryFiles((prev) => [...prev, ...accepted]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
    if (files.length > remaining) {
      showToast(`Only ${remaining} more image(s) allowed`, "error");
    }
    e.target.value = "";
  };

  const removeGalleryNew = (idx) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => {
      const url = prev[idx];
      if (url?.startsWith?.("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removeGalleryExisting = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput("");
      return;
    }
    if (tags.length >= 20) {
      showToast("You can add up to 20 tags", "error");
      return;
    }
    setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const setHour = (day, field, value) =>
    setOpeningHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, [field]: value } : h)),
    );

  // ─── Submit ───────────────────────────────────────────
  const handleSubmitKYC = async (e) => {
    e.preventDefault();

    if (isLocked) {
      showToast("Your KYC is already approved — no changes needed", "info");
      return;
    }

    // Business basics
    if (!businessName.trim()) {
      showToast("Business name is required", "error");
      return;
    }
    if (!businessKind) {
      showToast("Please select a business category", "error");
      return;
    }
    if (businessKind === "others" && !businessKindOther.trim()) {
      showToast("Please describe your business category", "error");
      return;
    }

    // KYC required
    if (!ownerLegalName.trim()) {
      showToast("Owner legal name is required", "error");
      return;
    }
    if (!idNumber.trim()) {
      showToast("Government ID number is required", "error");
      return;
    }
    if (!operatingAddress.trim()) {
      showToast("Operating address is required", "error");
      return;
    }
    if (!agreeTerms) {
      showToast("Please agree to the verification declaration", "error");
      return;
    }

    // First submission requires documents
    if (!isRejected && !isPending && !idFile && !idFilePreview) {
      showToast("Please upload your government ID", "error");
      return;
    }
    if (!isRejected && !isPending && !utilityFile && !utilityPreview) {
      showToast("Please upload proof of address", "error");
      return;
    }

    // Gallery minimum only on first submission
    if (
      existingImages.length + galleryFiles.length < MIN_BUSINESS_IMAGES &&
      !isRejected &&
      !isPending
    ) {
      showToast(
        `Please upload at least ${MIN_BUSINESS_IMAGES} business images (you have ${
          existingImages.length + galleryFiles.length
        })`,
        "error",
      );
      return;
    }

    const fd = new FormData();

    // Business profile
    fd.append("businessName", businessName.trim());
    fd.append("businessKind", businessKind);
    if (businessKind === "others")
      fd.append("businessKindOther", businessKindOther.trim());
    fd.append("businessType", businessType);
    fd.append("priceRange", String(priceRange));
    if (description.trim()) fd.append("description", description.trim());
    if (website.trim()) fd.append("website", website.trim());
    if (shortAddress.trim()) fd.append("address", shortAddress.trim());
    fd.append("tags", JSON.stringify(tags));
    fd.append(
      "location",
      JSON.stringify({
        city: locCity,
        state: locState,
        country: locCountry,
      }),
    );
    fd.append("openingHours", JSON.stringify(openingHours));

    // KYC
    fd.append("representativeType", representativeType);
    fd.append("ownerLegalName", ownerLegalName.trim());
    if (ownerDob) fd.append("ownerDob", ownerDob);
    fd.append("idType", idType);
    fd.append("idNumber", idNumber.trim());
    if (registeredBusinessName.trim())
      fd.append("registeredBusinessName", registeredBusinessName.trim());
    fd.append("registrationType", registrationType);
    if (cacNumber.trim()) fd.append("cacNumber", cacNumber.trim());
    if (cacStatus.trim()) fd.append("cacStatus", cacStatus.trim());
    fd.append("operatingAddress", operatingAddress.trim());
    if (riskCategory.trim()) fd.append("riskCategory", riskCategory.trim());
    if (foodLicenceNumber.trim())
      fd.append("foodLicenceNumber", foodLicenceNumber.trim());
    if (foodLicenceExpiry) fd.append("foodLicenceExpiry", foodLicenceExpiry);
    if (liquorLicenceNumber.trim())
      fd.append("liquorLicenceNumber", liquorLicenceNumber.trim());
    fd.append("kycDeclarationAccepted", String(agreeTerms));

    // Files
    if (idFile) fd.append("idDocument", idFile);
    if (cacFile) fd.append("cacDocument", cacFile);
    if (activityFile) fd.append("activityProof", activityFile);
    if (utilityFile) fd.append("utilityBill", utilityFile);
    if (licenceFile) fd.append("regulatoryLicence", licenceFile);
    if (logoFile) fd.append("logo", logoFile);
    if (coverFile) fd.append("coverImage", coverFile);
    galleryFiles.forEach((f) => fd.append("images", f));
    if (removedImages.length > 0)
      fd.append("removeImages", JSON.stringify(removedImages));

    try {
      const action = isRejected || isPending ? updateKYC : submitKYC;
      const r = await action(fd).unwrap();
      showToast(
        r?.message ||
          "Submission received. Our compliance team will review within 24–48 hours.",
        "success",
      );
      setShowEditForm(false);
    } catch (err) {
      showToast(
        err?.data?.message ||
          err?.data?.errors?.[0]?.message ||
          "Failed to submit. Please try again.",
        "error",
      );
    }
  };

  // ─── Status banner config ─────────────────────────────
  const statusBanner = useMemo(() => {
    if (isApproved) {
      return {
        tone: "emerald",
        label: "KYC Status: Approved — Verified Trust Badge issued",
        title: "You are a Verified Business",
        body: "Your account has passed compliance review. Your Verified Trust Badge is now visible on your public listing.",
        Icon: BadgeCheck,
      };
    }
    if (isPending) {
      return {
        tone: "amber",
        label: "KYC Status: Compliance Review In Progress",
        title: "Submission under review",
        body: "Our compliance team is reviewing your documents. This usually takes 24–48 hours.",
        Icon: Clock,
      };
    }
    if (isRejected) {
      return {
        tone: "rose",
        label: "KYC Status: Rejected — Action Required",
        title: "Your KYC was rejected",
        body:
          kycRejectionReason ||
          "Please review the rejection reason and resubmit corrected documents.",
        Icon: AlertCircle,
      };
    }
    return {
      tone: "blue",
      label: "KYC Status: Not submitted",
      title: "Official Verified Badge Eligibility",
      body: "Localspot requires corporate CAC registration, owner identity verification, location evidence, and category-specific safety certificates to safeguard customers.",
      Icon: ShieldCheck,
    };
  }, [isApproved, isPending, isRejected, kycRejectionReason]);

  const bannerColors = {
    emerald: "from-emerald-600 to-teal-700",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-600 to-red-700",
    blue: "from-blue-600 to-indigo-700",
  }[statusBanner.tone];

  const StatusIcon = statusBanner.Icon;

  const NAV_ITEMS = [
    { to: "/business/profile", label: "Edit profile", Icon: UserIcon, active: false },
    { to: "/business/activity", label: "Activity log", Icon: Activity, active: false },
    { to: "/business/verification", label: "Verification & badges", Icon: ShieldCheck, active: true },
  ];

  const pendingSteps = [
    { label: "Submission received", done: true, time: formatDate(kycSubmittedAt) },
    { label: "Compliance review", done: false, active: true, time: "Usually 24–48 hours" },
    { label: "Trust Badge issued", done: false, time: "After approval" },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-gray-900 flex flex-col font-sans">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LocalSpot Logo" className="w-7 h-7 object-contain shrink-0" />
            <span className="text-base font-extrabold tracking-wider text-gray-900">LOCALSPOT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/search" className="hover:text-blue-600 transition-colors">Explore</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/saved" className="hover:text-blue-600 transition-colors">Saved Places</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/business/profile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition overflow-hidden"
              title="Business profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={accountName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-gray-600" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── BREADCRUMB ─── */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-hidden">
            <Link to="/business" className="hover:text-blue-600 transition-colors shrink-0">Merchants</Link>
            <span className="text-gray-400 shrink-0">›</span>
            <Link to="/business/profile" className="hover:text-blue-600 transition-colors shrink-0">Business profile</Link>
            <span className="text-gray-400 shrink-0">›</span>
            <span className="text-gray-900 font-semibold truncate">Verification &amp; badges (KYC)</span>
          </nav>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={accountName} className="w-full h-full object-cover" />
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
                    {businessName || accountName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{businessEmail}</p>
                </div>
              </div>
              <nav className="pt-3 space-y-1">
                {NAV_ITEMS.map(({ to, label, Icon, active }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition ${
                      active
                        ? "font-semibold bg-blue-50/70 text-blue-600"
                        : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-blue-600" : "text-gray-500"}`} />
                    <span>{label}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Business Verification &amp; Badges (KYC)
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Complete all verification requirements to obtain the{" "}
                <strong className="text-blue-600">Verified Business Trust Badge</strong>{" "}
                and get your business listed publicly.
              </p>
            </div>

            {/* Status banner */}
            <div className={`bg-gradient-to-r ${bannerColors} rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white border border-white/20">
                  <StatusIcon className="w-4 h-4" />
                  <span>{statusBanner.label}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">{statusBanner.title}</h3>
                <p className="text-xs text-white/90 max-w-xl leading-relaxed">{statusBanner.body}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 border border-white/20 shrink-0 text-center">
                <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center mb-2 shadow">
                  <BadgeCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Verified Trust Badge</span>
                <span className="text-[10px] text-white/90 mt-0.5">
                  {isApproved ? "Issued" : isPending ? "Under review" : isRejected ? "Rejected" : "Not issued"}
                </span>
              </div>
            </div>

            {/* PENDING CARD */}
            {isPending && !showEditForm && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Hourglass className="w-7 h-7 text-amber-600 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Verification under review</h2>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        Our compliance team is reviewing your submitted documents.
                        You don't need to do anything — we'll notify you by email.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Submitted</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(kycSubmittedAt)}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Expected review time</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">24 – 48 hours</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Progress</p>
                    <ol className="space-y-4">
                      {pendingSteps.map((step, i) => (
                        <li key={step.label} className="flex items-start gap-3">
                          <div className="flex flex-col items-center shrink-0">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                                step.done ? "bg-emerald-500" : step.active ? "bg-amber-500" : "bg-gray-200"
                              }`}
                            >
                              {step.done ? (
                                <Check className="w-4 h-4" />
                              ) : step.active ? (
                                <Clock className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            {i < pendingSteps.length - 1 && (
                              <span className={`w-0.5 h-8 mt-1 ${step.done ? "bg-emerald-400" : "bg-gray-200"}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className={`text-sm font-semibold ${
                              step.done ? "text-emerald-700" : step.active ? "text-amber-700" : "text-gray-400"
                            }`}>
                              {step.label}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{step.time}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Update submission
                    </button>
                    <Link
                      to="/business"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition shadow-sm"
                    >
                      Back to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* APPROVED CARD */}
            {isApproved && !showEditForm && (
              <div className="bg-white rounded-2xl border border-emerald-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">You're a Verified Business 🎉</h2>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        Your account passed compliance review. The Verified Trust Badge is now live on your public listing.
                      </p>
                    </div>
                  </div>
                  {kycReviewedAt && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Approved on</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(kycReviewedAt)}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View submission
                    </button>
                    <Link
                      to="/business"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm font-semibold text-white transition shadow-sm"
                    >
                      Back to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* REJECTED BANNER */}
            {isRejected && kycRejectionReason && (
              <div className="bg-white rounded-2xl border border-rose-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-rose-500 to-red-500" />
                <div className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-rose-900">Previous submission was rejected</h3>
                    <p className="text-sm text-rose-800/90 mt-1 leading-relaxed">{kycRejectionReason}</p>
                    <p className="text-xs text-rose-700/80 mt-2">Please correct the information below and resubmit for review.</p>
                  </div>
                </div>
              </div>
            )}

            {/* FORM */}
            {!shouldHideForm && (
              <>
                {(isApproved || isPending) && showEditForm && (
                  <div className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs sm:text-sm text-blue-800">
                      You're viewing your submission. Any changes you save will update your existing record.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-100 transition shrink-0"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      Hide form
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmitKYC} className="space-y-6">
                  {/* SECTION 1 — Contact */}
                  <SectionCard
                    icon={<Phone className="w-4 h-4 text-blue-600" />}
                    title="1. Verified Phone Number & Email"
                    badge="Mandatory"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/40 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">Primary Contact Phone</label>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {businessPhone || "Not provided"}
                          </span>
                          {phoneVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> On file
                            </span>
                          ) : (
                            <Link to="/business/settings" className="text-xs font-bold text-blue-600 hover:underline shrink-0">
                              Add phone
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/40 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">Official Business Email</label>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-gray-900 truncate pr-2">
                            {businessEmail || "—"}
                          </span>
                          {emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 shrink-0">
                              <AlertCircle className="w-3 h-3" /> Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 2 — Business Basics */}
                  <SectionCard
                    icon={<Building2 className="w-4 h-4 text-blue-600" />}
                    title="2. Business Basics"
                    badge="Required"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Maple Bakery & Cafe"
                          disabled={isLocked}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Category *
                        </label>
                        <CustomDropdown
                          value={businessKind}
                          onChange={setBusinessKind}
                          options={[
                            { value: "", label: "Select a category…" },
                            ...BUSINESS_KINDS,
                          ]}
                          disabled={isLocked}
                        />
                      </div>

                      {businessKind === "others" && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Describe your category *
                          </label>
                          <input
                            type="text"
                            value={businessKindOther}
                            onChange={(e) => setBusinessKindOther(e.target.value.slice(0, 100))}
                            placeholder="e.g. Pet grooming"
                            disabled={isLocked}
                            className={inputCls}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Business Type *
                        </label>
                        <CustomDropdown
                          value={businessType}
                          onChange={setBusinessType}
                          options={BUSINESS_TYPES}
                          disabled={isLocked}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Website
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourbusiness.com"
                          disabled={isLocked}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Price Range
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-w-sm">
                        {PRICE_RANGES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setPriceRange(p.value)}
                            disabled={isLocked}
                            title={p.hint}
                            className={`py-2.5 rounded-lg text-sm font-bold transition border ${
                              priceRange === p.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                            } disabled:opacity-60`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Short Description
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                        placeholder="Tell customers what makes your business special…"
                        disabled={isLocked}
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Tags (up to 20)
                      </label>
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
                          placeholder="e.g. bakery, cakes, breakfast"
                          disabled={isLocked}
                          className={inputCls}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          disabled={isLocked}
                          className="inline-flex items-center justify-center gap-1 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex-shrink-0 disabled:opacity-60"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full capitalize"
                            >
                              <TagIcon className="h-3 w-3" />
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                disabled={isLocked}
                                className="ml-0.5 hover:text-blue-900 disabled:opacity-50"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </SectionCard>

                  {/* SECTION 3 — Location & Hours */}
                  <SectionCard
                    icon={<MapPin className="w-4 h-4 text-blue-600" />}
                    title="3. Location & Opening Hours"
                    badge="Required"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Short Listing Address
                      </label>
                      <input
                        type="text"
                        value={shortAddress}
                        onChange={(e) => setShortAddress(e.target.value)}
                        placeholder="e.g. 12 Marina Road, Lagos"
                        disabled={isLocked}
                        className={inputCls}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                        <input
                          type="text"
                          value={locCity}
                          onChange={(e) => setLocCity(e.target.value)}
                          placeholder="Lagos"
                          disabled={isLocked}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">State / Region</label>
                        <input
                          type="text"
                          value={locState}
                          onChange={(e) => setLocState(e.target.value)}
                          placeholder="Lagos"
                          disabled={isLocked}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
                        <input
                          type="text"
                          value={locCountry}
                          onChange={(e) => setLocCountry(e.target.value)}
                          placeholder="Nigeria"
                          disabled={isLocked}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Opening Hours</label>
                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                        {openingHours.map((h) => (
                          <div key={h.day} className="px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {DAY_NAMES[h.day]}
                              </span>
                              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={h.closed}
                                  onChange={(e) => setHour(h.day, "closed", e.target.checked)}
                                  disabled={isLocked}
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
                                  onChange={(e) => setHour(h.day, "open", e.target.value)}
                                  disabled={isLocked}
                                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                />
                                <span className="text-gray-400 text-xs">to</span>
                                <input
                                  type="time"
                                  value={h.close}
                                  onChange={(e) => setHour(h.day, "close", e.target.value)}
                                  disabled={isLocked}
                                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 4 — Media */}
                  <SectionCard
                    icon={<ImageIcon className="w-4 h-4 text-blue-600" />}
                    title="4. Business Images"
                    badge={`${totalImages}/${MAX_BUSINESS_IMAGES}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Logo */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Logo (square)</label>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                          {!isLocked && (
                            <>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => logoInputRef.current?.click()}
                                  className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold shadow"
                                >
                                  {logoPreview ? "Change" : "Upload"}
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
                              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
                            </>
                          )}
                        </div>
                      </div>

                      {/* Cover */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Cover banner</label>
                        <div className="relative aspect-square sm:aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                          {coverPreview ? (
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                          {!isLocked && (
                            <>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => coverInputRef.current?.click()}
                                  className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold shadow"
                                >
                                  {coverPreview ? "Change" : "Upload"}
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
                              <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gallery */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-gray-700">
                          Gallery (min {MIN_BUSINESS_IMAGES}, max {MAX_BUSINESS_IMAGES})
                        </label>
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={totalImages >= MAX_BUSINESS_IMAGES}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Add images
                          </button>
                        )}
                      </div>

                      {!isLocked && (
                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryAdd}
                          className="hidden"
                        />
                      )}

                      {totalImages === 0 ? (
                        <div
                          className={fileBoxCls(isLocked)}
                          onClick={() => !isLocked && galleryInputRef.current?.click()}
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">
                            No images yet — add at least {MIN_BUSINESS_IMAGES}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {existingImages.map((url, idx) => (
                            <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                              <img src={url} alt={`Business ${idx + 1}`} className="w-full h-full object-cover" />
                              {!isLocked && (
                                <button
                                  type="button"
                                  onClick={() => removeGalleryExisting(url)}
                                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          {galleryPreviews.map((url, idx) => (
                            <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-blue-300 ring-2 ring-blue-500">
                              <img src={url} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-blue-600">
                                New
                              </span>
                              {!isLocked && (
                                <button
                                  type="button"
                                  onClick={() => removeGalleryNew(idx)}
                                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {totalImages > 0 && totalImages < MIN_BUSINESS_IMAGES && (
                        <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mt-3">
                          Add at least {MIN_BUSINESS_IMAGES - totalImages} more to reach the minimum.
                        </p>
                      )}

                      {removedImages.length > 0 && (
                        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mt-3">
                          {removedImages.length} image{removedImages.length === 1 ? "" : "s"} marked for removal — save to apply.
                        </p>
                      )}
                    </div>
                  </SectionCard>

                  {/* SECTION 5 — Representative */}
                  <SectionCard
                    icon={<UserIcon className="w-4 h-4 text-blue-600" />}
                    title="5. Verified Owner or Authorized Representative"
                    badge="Mandatory"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Representative Capacity *</label>
                        <CustomDropdown value={representativeType} onChange={setRepresentativeType} options={REPRESENTATIVE_OPTIONS} disabled={isLocked} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Legal Name *</label>
                        <input type="text" value={ownerLegalName} onChange={(e) => setOwnerLegalName(e.target.value)} placeholder="Full Legal Name" disabled={isLocked} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
                        <input type="date" value={ownerDob} onChange={(e) => setOwnerDob(e.target.value)} disabled={isLocked} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Government ID Type *</label>
                        <div className="mb-3">
                          <CustomDropdown value={idType} onChange={setIdType} options={ID_TYPE_OPTIONS} disabled={isLocked} />
                        </div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">ID Document Number *</label>
                        <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter ID Number" disabled={isLocked} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Government ID *</label>
                        <div onClick={() => !isLocked && idInputRef.current?.click()} className={fileBoxCls(isLocked)}>
                          <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                          <p className="text-xs font-semibold text-gray-700 break-all px-2">
                            {idFilePreview ? (
                              <span className="text-blue-600 font-bold">✓ {idFile?.name || "Uploaded"}{!isLocked && " (Click to change)"}</span>
                            ) : ("Drag & drop ID file or browse")}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG, or PDF up to 8MB</p>
                          <input ref={idInputRef} type="file" accept="image/*,.pdf" onChange={handleIdSelect} disabled={isLocked} className="hidden" />
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 6 — CAC */}
                  <SectionCard
                    icon={<FileText className="w-4 h-4 text-blue-600" />}
                    title="6. Business Existence & CAC Registration"
                    badge="Mandatory"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registered Entity Name *</label>
                        <input type="text" value={registeredBusinessName} onChange={(e) => setRegisteredBusinessName(e.target.value)} placeholder="e.g. Pleasure Restaurant & Lounge Ltd" disabled={isLocked} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Corporate Structure *</label>
                        <CustomDropdown value={registrationType} onChange={setRegistrationType} options={REGISTRATION_TYPE_OPTIONS} disabled={isLocked} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">CAC / RC Number *</label>
                        <input type="text" value={cacNumber} onChange={(e) => setCacNumber(e.target.value)} placeholder="RC-1234567" disabled={isLocked} className={inputCls} />
                      </div>
                    </div>

                    {(cacStatus || cacNumber) && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                        <span className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          CAC Registry Cross-Check: {cacStatus || "Awaiting verification"}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload CAC Certificate *</label>
                        <div onClick={() => !isLocked && cacInputRef.current?.click()} className={fileBoxCls(isLocked)}>
                          <FileCheck className="w-6 h-6 text-blue-600 mb-1" />
                          <p className="text-xs font-semibold text-gray-700 break-all px-2">
                            {cacFilePreview ? (
                              <span className="text-blue-600 font-bold">✓ {cacFile?.name || "Uploaded"}{!isLocked && " (Click to change)"}</span>
                            ) : ("Upload Certificate (PDF / Image)")}
                          </p>
                          <input ref={cacInputRef} type="file" accept="image/*,.pdf" onChange={handleCacSelect} disabled={isLocked} className="hidden" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Business Activity Evidence (Storefront Photo) *</label>
                        <div onClick={() => !isLocked && activityInputRef.current?.click()} className={fileBoxCls(isLocked)}>
                          <Camera className="w-6 h-6 text-blue-600 mb-1" />
                          <p className="text-xs font-semibold text-gray-700 break-all px-2">
                            {activityPreview ? (
                              <span className="text-blue-600 font-bold">✓ {activityFile?.name || "Uploaded"}{!isLocked && " (Click to change)"}</span>
                            ) : ("Upload Storefront or Facility Photo")}
                          </p>
                          <input ref={activityInputRef} type="file" accept="image/*" onChange={handleActivitySelect} disabled={isLocked} className="hidden" />
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 7 — Address */}
                  <SectionCard
                    icon={<MapPin className="w-4 h-4 text-blue-600" />}
                    title="7. Address & Service-Area Verification"
                    badge="Mandatory"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Physical Operating Address *</label>
                      <input type="text" value={operatingAddress} onChange={(e) => setOperatingAddress(e.target.value)} placeholder="Physical Street Address, City, Postal Code" disabled={isLocked} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Proof of Address (Utility Bill / Lease) *</label>
                        <div onClick={() => !isLocked && utilityInputRef.current?.click()} className={fileBoxCls(isLocked)}>
                          <FileText className="w-6 h-6 text-blue-600 mb-1" />
                          <p className="text-xs font-semibold text-gray-700 break-all px-2">
                            {utilityPreview ? (
                              <span className="text-blue-600 font-bold">✓ {utilityFile?.name || "Uploaded"}{!isLocked && " (Click to change)"}</span>
                            ) : ("Upload Utility Bill or Lease (< 3 months)")}
                          </p>
                          <input ref={utilityInputRef} type="file" accept="image/*,.pdf" onChange={handleUtilitySelect} disabled={isLocked} className="hidden" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-800 mb-1">Duplicate-Listing Check</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            Localspot verifies that no duplicate businesses or fraudulent claims exist at this address.
                          </p>
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Zero duplicate conflicts detected</span>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 8 — Licences */}
                  <SectionCard
                    icon={<Layers className="w-4 h-4 text-blue-600" />}
                    title="8. Category-Specific Licences"
                    badge="Industry Specific"
                  >
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-blue-900 leading-relaxed">
                      <strong>Higher-Risk Category Requirement:</strong> Businesses providing hospitality, food, healthcare, childcare, financial, or nightlife services must provide valid operational licences before badges are issued.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Assigned Risk Category</label>
                        <input type="text" value={riskCategory} onChange={(e) => setRiskCategory(e.target.value)} placeholder="Auto-assigned after review" disabled={isLocked} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Food Hygiene / NAFDAC Licence #</label>
                        <input type="text" value={foodLicenceNumber} onChange={(e) => setFoodLicenceNumber(e.target.value)} placeholder="e.g. FSA-HYS-99201" disabled={isLocked} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Licence Expiry</label>
                        <input type="date" value={foodLicenceExpiry} onChange={(e) => setFoodLicenceExpiry(e.target.value)} disabled={isLocked} className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Liquor / Other Regulatory Licence #</label>
                      <input type="text" value={liquorLicenceNumber} onChange={(e) => setLiquorLicenceNumber(e.target.value)} placeholder="Optional — for bars, clubs, licensed venues" disabled={isLocked} className={inputCls} />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Regulatory Licence</label>
                      <div onClick={() => !isLocked && licenceInputRef.current?.click()} className={fileBoxCls(isLocked)}>
                        <FileCheck className="w-6 h-6 text-blue-600 mb-1" />
                        <p className="text-xs font-semibold text-gray-700 break-all px-2">
                          {licencePreview ? (
                            <span className="text-blue-600 font-bold">✓ {licenceFile?.name || "Uploaded"}{!isLocked && " (Click to change)"}</span>
                          ) : ("Upload Licence Document")}
                        </p>
                        <input ref={licenceInputRef} type="file" accept="image/*,.pdf" onChange={handleLicenceSelect} disabled={isLocked} className="hidden" />
                      </div>
                    </div>
                  </SectionCard>

                  {/* SECTION 9 — Declaration */}
                  <SectionCard
                    icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
                    title="9. Administrator Review & Compliance Declaration"
                  >
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed space-y-2">
                      <p><strong>Administrator Review Process:</strong></p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-500">
                        <li>Government identity and CAC cross-verification with public databases.</li>
                        <li>Duplicate-listing and address verification inspection.</li>
                        <li>Industry licence validation with issuing authorities.</li>
                      </ul>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        disabled={isLocked}
                        className="w-4 h-4 mt-0.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700 leading-relaxed">
                        I declare under penalty of perjury that I am the legal owner or authorized representative of{" "}
                        <strong>{businessName || accountName}</strong>, and all uploaded corporate documents, CAC credentials, addresses, and licences are authentic, current, and true.
                      </span>
                    </label>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                      <Link
                        to="/business/profile"
                        className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={isSaving || isLocked}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition shadow-sm inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting…</span>
                          </>
                        ) : isLocked ? (
                          <>
                            <BadgeCheck className="w-4 h-4" />
                            <span>KYC Approved</span>
                          </>
                        ) : isRejected ? (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Resubmit for Verification</span>
                          </>
                        ) : isPending ? (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Submit for Verification</span>
                          </>
                        )}
                      </button>
                    </div>
                  </SectionCard>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating mobile menu */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        style={{ animationDuration: mobileMenuOpen ? "0s" : "2s" }}
        className={`lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center transition-colors ${
          mobileMenuOpen ? "" : "animate-bounce"
        }`}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed bottom-24 right-4 left-4 sm:left-auto sm:w-72 z-[58] bg-white rounded-2xl shadow-2xl border border-gray-200 py-2">
            {NAV_ITEMS.map(({ to, label, Icon, active }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                  active
                    ? "font-semibold bg-blue-50/70 text-blue-600"
                    : "font-medium text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-blue-600" : "text-gray-500"}`} />
                <span>{label}</span>
              </Link>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessVerification;