// src/pages/Signup.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiMapPin,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiArrowLeft,
  FiMail,
  FiBriefcase,
  FiUploadCloud,
  FiX,
  FiPlus,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

import {
  useRegisterUserMutation,
  useVerifyUserOTPMutation,
  useResendOTPMutation,
} from "../features/authApiSlice";
import { useSubmitBusinessApplicationMutation } from "../features/businessApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { useToast } from "../hooks/useToast";

// ─────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────
const sliderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
];

const countryCodes = [
  { code: "+234", label: "NG" },
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+27", label: "ZA" },
];

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
  { value: 1, label: "₦", hint: "Budget" },
  { value: 2, label: "₦₦", hint: "Moderate" },
  { value: 3, label: "₦₦₦", hint: "Upscale" },
  { value: 4, label: "₦₦₦₦", hint: "Luxury" },
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const MIN_BUSINESS_IMAGES = 10;
const MAX_BUSINESS_IMAGES = 20;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // RTK Query
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifyUserOTP, { isLoading: isVerifying }] = useVerifyUserOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  const [submitBusinessApplication, { isLoading: isSubmittingApp }] =
    useSubmitBusinessApplicationMutation();

  // Step machine: "register" | "verify" | "business"
  const [step, setStep] = useState("register");

  // ─── Register state ──────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+234");
  const countryRef = useRef(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registerAsBusiness, setRegisterAsBusiness] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  // ─── Verify state ────────────────────────────────────────
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef([]);
  const [resendIn, setResendIn] = useState(0);

  // Slider
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Autofocus first OTP box
  useEffect(() => {
    if (step === "verify") {
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ═════════════════════════════════════════════════════════
  // STEP 1 — Register
  // ═════════════════════════════════════════════════════════
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      showToast("Please accept the Terms & Privacy Policy", "error");
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone
        ? `${countryCode}${formData.phone.replace(/\D/g, "")}`
        : undefined,
    };

    try {
      const result = await registerUser(payload).unwrap();
      const email = result?.data?.email || payload.email;
      setPendingEmail(email);
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setResendIn(RESEND_COOLDOWN_SECONDS);
      setStep("verify");
      showToast(
        result?.message || "Verification code sent to your email",
        "success",
      );
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        "Registration failed. Please try again.";
      showToast(msg, "error");
    }
  };

  // ═════════════════════════════════════════════════════════
  // STEP 2 — Verify OTP
  // ═════════════════════════════════════════════════════════
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpValues];
    next[index] = digit;
    setOtpValues(next);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpValues(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const otp = otpValues.join("");
    if (otp.length !== OTP_LENGTH) {
      showToast("Please enter the full 6-digit code", "error");
      return;
    }

    try {
      const result = await verifyUserOTP({ email: pendingEmail, otp }).unwrap();
      dispatch(setCredentials({ ...result.data, token: result.token }));

      showToast(result?.message || "Account verified successfully", "success");

      if (registerAsBusiness) {
        // Move into the business application step
        setStep("business");
      } else {
        setTimeout(() => navigate("/"), 700);
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        "Verification failed. Please try again.";
      showToast(msg, "error");
      setOtpValues(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || isResending) return;
    try {
      await resendOTP({
        email: pendingEmail,
        purpose: "verification",
      }).unwrap();
      showToast("A new code has been sent to your email", "success");
      setResendIn(RESEND_COOLDOWN_SECONDS);
      setOtpValues(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      const msg =
        err?.data?.message || "Could not resend code. Please try again later.";
      showToast(msg, "error");
    }
  };

  const handleBackToRegister = () => {
    setStep("register");
    setOtpValues(Array(OTP_LENGTH).fill(""));
    setPendingEmail("");
    setResendIn(0);
  };

  // ═════════════════════════════════════════════════════════
  // STEP 3 — Business application
  // ═════════════════════════════════════════════════════════
  const [biz, setBiz] = useState({
    businessName: "",
    businessKind: "",
    businessKindOther: "",
    businessType: "sole_proprietorship",
    description: "",
    website: "",
    phone: formData.phone || "",
    address: "",
    cacNumber: "",
    priceRange: 2,
  });

  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);

  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    lat: "",
    lng: "",
  });

  const [openingHours, setOpeningHours] = useState(
    DAYS.map((_, i) => ({
      day: i,
      open: "09:00",
      close: "18:00",
      closed: i === 0, // Sunday default closed
    })),
  );

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [cacFile, setCacFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // File[]

  const galleryPreviews = useMemo(
    () =>
      galleryFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [galleryFiles],
  );

  // Cleanup object URLs on change/unmount
  useEffect(() => {
    return () => galleryPreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [galleryPreviews]);

  const handleBizChange = (e) =>
    setBiz((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLocationChange = (e) =>
    setLocation((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addTag = () => {
    const t = tagsInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagsInput("");
      return;
    }
    setTags((prev) => [...prev, t]);
    setTagsInput("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryFiles((prev) => {
      const next = [...prev, ...files];
      if (next.length > MAX_BUSINESS_IMAGES) {
        showToast(
          `Max ${MAX_BUSINESS_IMAGES} images — extra files were dropped`,
          "error",
        );
        return next.slice(0, MAX_BUSINESS_IMAGES);
      }
      return next;
    });
    e.target.value = "";
  };

  const removeGalleryImage = (index) =>
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));

  const updateHour = (day, patch) =>
    setOpeningHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    );

  const validateBusinessApplication = () => {
    if (!biz.businessName.trim()) return "Business name is required";
    if (!biz.businessKind) return "Please select a business category";
    if (biz.businessKind === "others" && !biz.businessKindOther.trim())
      return "Please describe your business category";
    if (!biz.address.trim()) return "Business address is required";
    if (!biz.cacNumber.trim()) return "CAC number is required";
    if (galleryFiles.length < MIN_BUSINESS_IMAGES)
      return `Please upload at least ${MIN_BUSINESS_IMAGES} business images (you have ${galleryFiles.length})`;
    if (galleryFiles.length > MAX_BUSINESS_IMAGES)
      return `Please upload at most ${MAX_BUSINESS_IMAGES} business images`;
    return null;
  };

  const handleSubmitBusinessApplication = async (e) => {
    e.preventDefault();

    const err = validateBusinessApplication();
    if (err) {
      showToast(err, "error");
      return;
    }

    const fd = new FormData();

    // Simple fields
    fd.append("businessName", biz.businessName.trim());
    fd.append("businessKind", biz.businessKind);
    if (biz.businessKind === "others") {
      fd.append("businessKindOther", biz.businessKindOther.trim());
    }
    fd.append("businessType", biz.businessType);
    fd.append("description", biz.description.trim());
    fd.append("website", biz.website.trim());
    fd.append("phone", biz.phone.trim());
    fd.append("address", biz.address.trim());
    fd.append("cacNumber", biz.cacNumber.trim());
    fd.append("priceRange", String(biz.priceRange));

    // JSON fields
    fd.append("tags", JSON.stringify(tags));
    fd.append(
      "location",
      JSON.stringify({
        address: location.address || biz.address,
        city: location.city,
        state: location.state,
        country: location.country,
        coordinates:
          location.lat && location.lng
            ? {
                type: "Point",
                coordinates: [Number(location.lng), Number(location.lat)],
              }
            : undefined,
      }),
    );
    fd.append("openingHours", JSON.stringify(openingHours));

    // Files
    galleryFiles.forEach((f) => fd.append("images", f));
    if (logoFile) fd.append("logo", logoFile);
    if (coverFile) fd.append("coverImage", coverFile);
    if (cacFile) fd.append("cacDocument", cacFile);

    try {
      const result = await submitBusinessApplication(fd).unwrap();
      showToast(
        result?.message ||
          "Application submitted! Our team will review it shortly.",
        "success",
      );
      setTimeout(() => navigate("/business/pending"), 800);
    } catch (error) {
      const msg =
        error?.data?.message ||
        error?.data?.errors?.[0]?.message ||
        "Could not submit your application. Please try again.";
      showToast(msg, "error");
    }
  };

  // ═════════════════════════════════════════════════════════
  // Render helpers
  // ═════════════════════════════════════════════════════════
  const stepTitle = {
    register: "Create your account",
    verify: "Verify your email",
    business: "Tell us about your business",
  };

  const stepSubtitle = {
    register: registerAsBusiness
      ? "Set up your account first, then complete your business profile."
      : "Join LocalSpot and discover great places around you.",
    verify: "We sent a 6-digit code to your email.",
    business:
      "This information is reviewed by our team before your listing goes live.",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-gray-900">
      {/* ============ LEFT: IMAGE SLIDER ============ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="absolute top-0 left-0 right-0 z-20 px-10 py-8 flex items-center justify-between text-sm text-white/90">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="LocalSpot"
              className="h-7 w-7 object-contain brightness-0 invert"
            />
            <span className="font-bold tracking-wide text-white">LOCALSPOT</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <span className="text-white/40">|</span>
            <span className="text-white/80">
              Already registered?{" "}
              <Link
                to="/signin"
                className="font-semibold text-white hover:underline"
              >
                Log in
              </Link>
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-12 right-12 z-10 flex flex-col gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">
              {step === "business" ? "Grow your business." : "Join LocalSpot."}
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              {step === "business"
                ? "Get discovered by locals, manage your listing, and showcase everything your business has to offer."
                : "Manage your presence, connect with locals, and grow your reach in the community."}
            </p>
          </div>
          <p className="text-[10px] text-white/50 text-center tracking-wide">
            &copy; LocalSpot Systems Ltd. - Where Local Ecommerce Meets Directory
          </p>
        </div>
      </div>

      {/* ============ RIGHT: FORM ============ */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 lg:bg-white lg:h-screen lg:overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="LocalSpot"
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-bold tracking-wide">LOCALSPOT</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Link to="/support">Support</Link>
            <span>|</span>
            <Link to="/signin" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <div className="flex-grow flex items-start lg:items-center justify-center py-10 px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-[520px]">
            {/* Icon bubble */}
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                {step === "verify" ? (
                  <FiMail size={22} />
                ) : step === "business" ? (
                  <FiBriefcase size={22} />
                ) : (
                  <FiMapPin size={22} />
                )}
              </div>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              {step === "verify" && (
                <button
                  type="button"
                  onClick={handleBackToRegister}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4"
                >
                  <FiArrowLeft size={14} />
                  Back to signup
                </button>
              )}

              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {stepTitle[step]}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {stepSubtitle[step]}{" "}
                {step === "verify" && (
                  <span className="font-medium text-gray-700">
                    {pendingEmail}
                  </span>
                )}
              </p>
            </div>

            {/* ═══════ REGISTER ═══════ */}
            {step === "register" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Full name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isRegistering}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isRegistering}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-24 shrink-0" ref={countryRef}>
                        <button
                          type="button"
                          disabled={isRegistering}
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                          className="w-full flex items-center justify-between bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                          <span>{countryCode}</span>
                          <FiChevronDown
                            className={`text-gray-400 transition-transform ${
                              isCountryOpen ? "rotate-180" : ""
                            }`}
                            size={14}
                          />
                        </button>

                        {isCountryOpen && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                            {countryCodes.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(c.code);
                                  setIsCountryOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                                  countryCode === c.code
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span>{c.code}</span>
                                <span className="text-[10px] text-gray-400">
                                  {c.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="803 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isRegistering}
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Must be 8+ characters
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        minLength={8}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isRegistering}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pr-10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <FiEyeOff size={16} />
                        ) : (
                          <FiEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Register as business toggle */}
                  <button
                    type="button"
                    onClick={() => setRegisterAsBusiness((v) => !v)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                      registerAsBusiness
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    disabled={isRegistering}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                        registerAsBusiness
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {registerAsBusiness && (
                        <FiCheck size={12} strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FiBriefcase size={14} className="text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          Sign up as a business
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        After verifying your email you'll be asked for your
                        business details. Every application is reviewed by our
                        team.
                      </p>
                    </div>
                  </button>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isRegistering || !agreedToTerms}
                    className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isRegistering ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Terms */}
                <div className="mt-4 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-[11px] text-gray-500 leading-relaxed"
                  >
                    By continuing, you agree to LocalSpot's{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <div className="mt-6 text-center lg:text-left">
                  <p className="text-xs text-gray-500">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* ═══════ VERIFY ═══════ */}
            {step === "verify" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center lg:text-left">
                      Enter verification code
                    </label>
                    <div
                      className="flex justify-center lg:justify-between gap-2"
                      onPaste={handleOtpPaste}
                    >
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={isVerifying}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center lg:text-left">
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || otpValues.some((v) => !v)}
                    className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : registerAsBusiness ? (
                      "Verify & Continue"
                    ) : (
                      "Verify & Finish"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Didn't get the code?{" "}
                    {resendIn > 0 ? (
                      <span className="text-gray-400">
                        Resend in {resendIn}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isResending ? "Sending..." : "Resend code"}
                      </button>
                    )}
                  </p>
                </div>

                {registerAsBusiness && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                    <FiInfo size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Next you'll be asked for your business details — CAC
                      number, address, images, and more.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ═══════ BUSINESS APPLICATION ═══════ */}
            {step === "business" && (
              <form
                onSubmit={handleSubmitBusinessApplication}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8"
              >
                {/* Section 1: Identity */}
                <Section
                  title="Business Identity"
                  icon={<FiBriefcase size={14} />}
                >
                  <Field label="Business Name" required>
                    <input
                      type="text"
                      name="businessName"
                      value={biz.businessName}
                      onChange={handleBizChange}
                      placeholder="e.g. Maple Bakery & Cafe"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Category" required>
                    <select
                      name="businessKind"
                      value={biz.businessKind}
                      onChange={handleBizChange}
                      className={inputCls}
                    >
                      <option value="">Select a category…</option>
                      {BUSINESS_KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {biz.businessKind === "others" && (
                    <Field label="Describe your category" required>
                      <input
                        type="text"
                        name="businessKindOther"
                        value={biz.businessKindOther}
                        onChange={handleBizChange}
                        maxLength={100}
                        placeholder="e.g. Pet grooming"
                        className={inputCls}
                      />
                    </Field>
                  )}

                  <Field label="Business Type" required>
                    <select
                      name="businessType"
                      value={biz.businessType}
                      onChange={handleBizChange}
                      className={inputCls}
                    >
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Short Description">
                    <textarea
                      name="description"
                      value={biz.description}
                      onChange={handleBizChange}
                      rows={3}
                      placeholder="Tell customers what makes your business special…"
                      className={inputCls}
                    />
                  </Field>

                  {/* Tags */}
                  <Field
                    label="Tags"
                    hint="Press Enter to add — e.g. bakery, cakes, breakfast"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add a tag…"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => removeTag(t)}
                              className="hover:text-blue-900"
                            >
                              <FiX size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>
                </Section>

                {/* Section 2: Contact */}
                <Section title="Contact & Registration">
                  <Field label="Phone Number">
                    <input
                      type="tel"
                      name="phone"
                      value={biz.phone}
                      onChange={handleBizChange}
                      placeholder="+234 803 123 4567"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Website">
                    <input
                      type="url"
                      name="website"
                      value={biz.website}
                      onChange={handleBizChange}
                      placeholder="https://example.com"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="CAC Registration Number" required>
                    <input
                      type="text"
                      name="cacNumber"
                      value={biz.cacNumber}
                      onChange={handleBizChange}
                      placeholder="RC-1234567"
                      className={inputCls}
                    />
                  </Field>

                  <Field
                    label="CAC Document"
                    hint="Upload your CAC certificate (image or PDF)"
                  >
                    <FileInput
                      accept="image/*,application/pdf"
                      file={cacFile}
                      onSelect={setCacFile}
                      onClear={() => setCacFile(null)}
                      label="Upload CAC document"
                    />
                  </Field>
                </Section>

                {/* Section 3: Location */}
                <Section title="Location">
                  <Field label="Street Address" required>
                    <input
                      type="text"
                      name="address"
                      value={biz.address}
                      onChange={handleBizChange}
                      placeholder="12 Marina Road"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="City">
                      <input
                        type="text"
                        name="city"
                        value={location.city}
                        onChange={handleLocationChange}
                        placeholder="Lagos"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="State">
                      <input
                        type="text"
                        name="state"
                        value={location.state}
                        onChange={handleLocationChange}
                        placeholder="Lagos"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Country">
                      <input
                        type="text"
                        name="country"
                        value={location.country}
                        onChange={handleLocationChange}
                        placeholder="Nigeria"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Latitude" hint="Optional">
                      <input
                        type="number"
                        step="any"
                        name="lat"
                        value={location.lat}
                        onChange={handleLocationChange}
                        placeholder="6.5244"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Longitude" hint="Optional">
                      <input
                        type="number"
                        step="any"
                        name="lng"
                        value={location.lng}
                        onChange={handleLocationChange}
                        placeholder="3.3792"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </Section>

                {/* Section 4: Hours & Price */}
                <Section title="Hours & Pricing">
                  <Field label="Opening Hours">
                    <div className="space-y-2">
                      {openingHours.map((h) => (
                        <div
                          key={h.day}
                          className="flex items-center gap-3 py-1.5"
                        >
                          <span className="w-20 text-xs font-medium text-gray-700">
                            {DAYS[h.day].slice(0, 3)}
                          </span>
                          <label className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <input
                              type="checkbox"
                              checked={!h.closed}
                              onChange={(e) =>
                                updateHour(h.day, { closed: !e.target.checked })
                              }
                              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Open
                          </label>
                          {!h.closed && (
                            <>
                              <input
                                type="time"
                                value={h.open}
                                onChange={(e) =>
                                  updateHour(h.day, { open: e.target.value })
                                }
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                              />
                              <span className="text-gray-400 text-xs">–</span>
                              <input
                                type="time"
                                value={h.close}
                                onChange={(e) =>
                                  updateHour(h.day, { close: e.target.value })
                                }
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                              />
                            </>
                          )}
                          {h.closed && (
                            <span className="flex-1 text-[11px] text-gray-400 italic">
                              Closed
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Field>

                  <Field label="Price Range">
                    <div className="grid grid-cols-4 gap-2">
                      {PRICE_RANGES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() =>
                            setBiz((prev) => ({ ...prev, priceRange: p.value }))
                          }
                          className={`py-2.5 rounded-lg border text-center transition-colors ${
                            biz.priceRange === p.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="text-sm font-semibold">{p.label}</div>
                          <div className="text-[10px] text-gray-500">
                            {p.hint}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Field>
                </Section>

                {/* Section 5: Images */}
                <Section title="Images">
                  <Field
                    label="Gallery Images"
                    required
                    hint={`Between ${MIN_BUSINESS_IMAGES} and ${MAX_BUSINESS_IMAGES} images`}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryAdd}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="cursor-pointer flex flex-col items-center gap-1.5"
                      >
                        <FiUploadCloud size={22} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          Click to upload images
                        </span>
                        <span className="text-[10px] text-gray-400">
                          JPG, PNG or WEBP
                        </span>
                      </label>
                    </div>

                    {galleryPreviews.length > 0 && (
                      <>
                        <p
                          className={`text-[11px] mt-2 font-medium ${
                            galleryFiles.length < MIN_BUSINESS_IMAGES
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {galleryFiles.length} / {MAX_BUSINESS_IMAGES} uploaded
                          {galleryFiles.length < MIN_BUSINESS_IMAGES &&
                            ` — add ${
                              MIN_BUSINESS_IMAGES - galleryFiles.length
                            } more`}
                        </p>

                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {galleryPreviews.map((p, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-lg overflow-hidden group"
                            >
                              <img
                                src={p.url}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(i)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Logo" hint="Square image (optional)">
                      <FileInput
                        accept="image/*"
                        file={logoFile}
                        onSelect={setLogoFile}
                        onClear={() => setLogoFile(null)}
                        label="Upload logo"
                        preview
                      />
                    </Field>

                    <Field label="Cover Image" hint="Wide banner (optional)">
                      <FileInput
                        accept="image/*"
                        file={coverFile}
                        onSelect={setCoverFile}
                        onClear={() => setCoverFile(null)}
                        label="Upload cover"
                        preview
                      />
                    </Field>
                  </div>
                </Section>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="w-full py-3 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingApp ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 leading-relaxed text-center mt-4">
                    By submitting, you confirm the information provided is
                    accurate. Our team will review your application and notify
                    you by email.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 bg-white";

const Section = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      {icon && <span className="text-blue-600">{icon}</span>}
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, required, hint, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
    </div>
    {children}
  </div>
);

const FileInput = ({ accept, file, onSelect, onClear, label, preview }) => (
  <div>
    {!file ? (
      <label className="flex items-center justify-center gap-2 w-full px-3 py-3 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors">
        <FiUploadCloud size={14} />
        {label}
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSelect(f);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    ) : (
      <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
        {preview && (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-10 h-10 rounded object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">
            {file.name}
          </p>
          <p className="text-[10px] text-gray-400">
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiX size={14} />
        </button>
      </div>
    )}
  </div>
);

export default Signup;