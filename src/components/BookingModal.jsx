// src/components/BookingModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CalendarPlus,
  Copy,
  Check,
  Plus,
  Trash2,
  Send,
} from "lucide-react";
import {
  useGetBookingFormSchemaQuery,
  useCreateBookingMutation,
} from "../features/bookingApiSlice"; // adjust if your path differs

// ──────────────────────────────────────────────────────────────
// Date / formatting helpers (local-time safe)
// ──────────────────────────────────────────────────────────────
const toLocalDateInput = (d) => {
  const x = new Date(d);
  const off = x.getTimezoneOffset();
  return new Date(x.getTime() - off * 60000).toISOString().slice(0, 10);
};

const todayLocal = () => toLocalDateInput(new Date());

const tomorrowLocal = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateInput(d);
};

const prettyOption = (v) =>
  String(v)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatFriendlyDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr || "—";
  }
};

const formatFriendlyDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

// Build initial `details` object from a schema
const initDetails = (schema) => {
  const out = {};
  (schema?.fields || []).forEach((f) => {
    if (f.type === "repeater") {
      out[f.name] = [];
    } else if (f.type === "date") {
      out[f.name] = tomorrowLocal();
    } else if (f.type === "select") {
      out[f.name] = f.default ?? f.options?.[0] ?? "";
    } else if (f.type === "number") {
      out[f.name] = f.default ?? f.min ?? 1;
    } else {
      out[f.name] = f.default ?? "";
    }
  });
  return out;
};

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, place, user = null }) {
  const businessId = place?._id || place?.id;

  const {
    data: schemaRes,
    isLoading: isSchemaLoading,
    isError: isSchemaError,
    error: schemaError,
  } = useGetBookingFormSchemaQuery(businessId, {
    skip: !isOpen || !businessId,
  });

  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  const schema = schemaRes?.data?.schema;
  const kind = schemaRes?.data?.kind;
  const business = schemaRes?.data?.business;
  const constants = schemaRes?.data?.constants || {};
  const cancelCutoff = constants.cancelCutoffHours ?? 24;

  const [details, setDetails] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Lock scroll / reset on close ─────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      const t = setTimeout(() => {
        setResult(null);
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ── Escape to close ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isSubmitting, onClose]);

  // ── Prefill guest info from logged-in user ───────────────────
  useEffect(() => {
    if (!isOpen) return;
    setFullName((v) => v || user?.fullName || user?.name || "");
    setEmail((v) => v || user?.email || "");
    setPhone((v) => v || user?.phone || "");
  }, [isOpen, user]);

  // ── Reset details when switching business ────────────────────
  useEffect(() => {
    setDetails({});
    setResult(null);
    setErrorMsg("");
  }, [businessId]);

  // ── Initialise details once the schema arrives ───────────────
  useEffect(() => {
    if (!schema) return;
    setDetails((prev) => (Object.keys(prev).length ? prev : initDetails(schema)));
  }, [schema]);

  const placeName = business?.businessName || place?.businessName || place?.name || "Selected Venue";
  const placeLocation =
    typeof place?.location === "string"
      ? place.location
      : place?.location?.address || business?.location?.address || business?.location?.city || "Nigeria";
  const placeRating = Number(place?.rating || 0).toFixed(1);
  const placeReviews = place?.numReviews ?? place?.reviews ?? 0;
  const placeImg =
    place?.img ||
    place?.coverImage ||
    place?.image ||
    business?.coverImage ||
    business?.logo ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";
  const placeCategory = String(
    place?.category || place?.meta || business?.businessKind || "Venue"
  )
    .replace(/_/g, " ")
    .toUpperCase();

  // ── Field helpers ────────────────────────────────────────────
  const setField = (name, value) =>
    setDetails((d) => ({ ...d, [name]: value }));

  const isFieldVisible = (f) =>
    !f.dependsOn || details[f.dependsOn.field] === f.dependsOn.value;

  const validate = () => {
    const errs = [];
    if (!fullName.trim()) errs.push("Full name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.push("A valid email address is required");
    if (!phone.trim()) errs.push("Phone number is required");

    (schema?.fields || []).forEach((f) => {
      if (!f.required || !isFieldVisible(f)) return;
      const v = details[f.name];
      if (v === "" || v === undefined || v === null) {
        errs.push(`${f.label || f.name} is required`);
      }
    });

    if (
      kind === "hotels" &&
      details.checkIn &&
      details.checkOut &&
      new Date(details.checkOut) <= new Date(details.checkIn)
    ) {
      errs.push("Check-out must be after check-in");
    }

    return errs;
  };

  const buildDetailsPayload = () => {
    const out = {};
    (schema?.fields || []).forEach((f) => {
      if (!isFieldVisible(f)) return;
      const v = details[f.name];

      if (f.type === "repeater") {
        const items = (v || [])
          .filter((i) => i?.name?.trim() && Number(i.quantity) >= 1)
          .map((i) => ({ name: i.name.trim(), quantity: Number(i.quantity) }));
        if (items.length) out[f.name] = items;
        return;
      }

      if (v === "" || v === undefined || v === null) return;
      out[f.name] = f.type === "number" ? Number(v) : v;
    });
    return out;
  };

  const previewSummary = () => {
    if (!schema) return "";
    try {
      switch (kind) {
        case "hotels": {
          const nights =
            details.checkIn && details.checkOut
              ? Math.max(
                  0,
                  Math.round(
                    (new Date(details.checkOut) - new Date(details.checkIn)) / 86400000
                  )
                )
              : null;
          return `${nights ?? "?"} night(s) · ${details.rooms} room(s) · ${details.adults} adult(s)${
            details.children ? `, ${details.children} child(ren)` : ""
          }`;
        }
        case "dining":
          return `${details.partySize} guest(s) · ${formatFriendlyDate(
            details.reservationDate
          )}${details.reservationTime ? ` at ${details.reservationTime}` : ""}`;
        case "things_to_do":
          return `${details.participants} participant(s) · ${formatFriendlyDate(
            details.activityDate
          )}${details.timeSlot ? ` · ${details.timeSlot}` : ""}`;
        case "shops":
          return `${prettyOption(details.fulfillmentType || "")} · ${formatFriendlyDate(
            details.preferredDate
          )}`;
        default:
          return formatFriendlyDate(details.preferredDate);
      }
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const errs = validate();
    if (errs.length) {
      setErrorMsg(errs[0]);
      return;
    }

    try {
      const res = await createBooking({
        businessId,
        guestName: fullName.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        specialRequests: specialRequests.trim() || undefined,
        details: buildDetailsPayload(),
      }).unwrap();

      setResult(res.data);
    } catch (err) {
      if (err?.status === 401) {
        setErrorMsg("Please sign in to make a booking.");
      } else if (err?.status === 409) {
        setErrorMsg(err?.data?.message || "You already have a booking around this time.");
      } else {
        setErrorMsg(
          err?.data?.message ||
            err?.message ||
            "Could not send your booking request. Please try again."
        );
      }
    }
  };

  const handleCopyRef = () => {
    if (result?.referenceCode) {
      navigator.clipboard.writeText(result.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Render a single schema field ─────────────────────────────
  const renderField = (f) => {
    if (!isFieldVisible(f)) return null;

    const value = details[f.name];
    const label = f.label || prettyOption(f.name);
    const requiredMark = f.required ? <span className="text-red-500">*</span> : null;

    // Select → segmented buttons (nicer than a dropdown)
    if (f.type === "select") {
      const options = f.options || [];
      const cols = options.length <= 3 ? "grid-cols-3" : "grid-cols-2";
      return (
        <div key={f.name}>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            {label} {requiredMark}
          </label>
          <div className={`grid ${cols} gap-2`}>
            {options.map((opt) => {
              const active = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setField(f.name, opt)}
                  className={`py-2 px-2 rounded-xl border text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "border-[#3B82F6] bg-blue-50/70 text-blue-700 shadow-xs"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {prettyOption(opt)}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Repeater (shops → items)
    if (f.type === "repeater") {
      const rows = Array.isArray(value) ? value : [];
      const updateRow = (i, key, v) => {
        const next = [...rows];
        next[i] = { ...next[i], [key]: v };
        setField(f.name, next);
      };
      const addRow = () => setField(f.name, [...rows, { name: "", quantity: 1 }]);
      const removeRow = (i) => setField(f.name, rows.filter((_, idx) => idx !== i));

      return (
        <div key={f.name}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {label} {requiredMark}
            </label>
            <button
              type="button"
              onClick={addRow}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add item
            </button>
          </div>
          <div className="space-y-2">
            {rows.length === 0 && (
              <p className="text-[11px] text-gray-400 italic">
                Optional — add items you'd like to order.
              </p>
            )}
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={row.name || ""}
                  onChange={(e) => updateRow(i, "name", e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                />
                <input
                  type="number"
                  min={1}
                  value={row.quantity ?? 1}
                  onChange={(e) => updateRow(i, "quantity", e.target.value)}
                  className="w-16 px-2 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-center focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Number → stepper
    if (f.type === "number") {
      const min = f.min ?? 0;
      const max = f.max ?? 50;
      const n = Number(value) || min;
      return (
        <div key={f.name}>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            {label} {requiredMark}
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setField(f.name, Math.max(min, n - 1))}
              disabled={n <= min}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              -
            </button>
            <div className="flex-1 text-center font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-center gap-1.5">
              {f.name === "rooms" ? (
                <span>{n} {n === 1 ? "Room" : "Rooms"}</span>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{n}</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setField(f.name, Math.min(max, n + 1))}
              disabled={n >= max}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      );
    }

    // Date / time / text
    const inputType = f.type === "date" ? "date" : f.type === "time" ? "time" : "text";
    const minAttr = f.type === "date" ? todayLocal() : undefined;
    const Icon =
      f.type === "date" ? Calendar : f.type === "time" ? Clock : null;

    return (
      <div key={f.name}>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          {label} {requiredMark}
        </label>
        <div className="relative">
          <input
            type={inputType}
            min={minAttr}
            value={value ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => setField(f.name, e.target.value)}
            className={`w-full ${
              Icon ? "pl-9" : "pl-3.5"
            } pr-3.5 py-2.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition`}
          />
          {Icon && (
            <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          )}
        </div>
      </div>
    );
  };

  if (!isOpen || !place) return null;

  // Group fields into a 2-col grid where it makes sense
  const dateFields = (schema?.fields || []).filter(
    (f) => f.type === "date" || f.type === "time"
  );
  const otherFields = (schema?.fields || []).filter(
    (f) => f.type !== "date" && f.type !== "time"
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="relative border-b border-gray-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0 shadow-xs">
                <img src={placeImg} alt={placeName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-600 text-white uppercase">
                    {placeCategory}
                  </span>
                  {placeReviews > 0 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {placeRating}
                      <span className="text-gray-400 font-normal">({placeReviews})</span>
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate mt-0.5">
                  {placeName}
                </h2>
                <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
                  <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                  {placeLocation}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition shrink-0 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        {isSchemaLoading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading booking options…</span>
          </div>
        ) : isSchemaError ? (
          <div className="p-6 sm:p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Bookings unavailable</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {schemaError?.data?.message ||
                "This business isn't accepting bookings right now. Please try again later."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-[#60A5FA] hover:bg-[#3B82F6] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : !result ? (
          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
          >
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Schema-driven fields */}
            {dateFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dateFields.map(renderField)}
              </div>
            )}
            <div className="space-y-4">{otherFields.map(renderField)}</div>

            {/* Guest contact details */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Guest Contact Details
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email address for confirmation"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone number (+234)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Special requests (optional)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition resize-none"
                />
              </div>
            </div>

            {/* Policy notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {business?.businessName || "The business"} will review your request. Free
                cancellation up to {cancelCutoff} hours before.
              </span>
            </div>

            {/* Summary preview + submit */}
            {previewSummary() && (
              <div className="text-[11px] text-gray-500 text-center font-medium">
                {previewSummary()}
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#60A5FA] hover:bg-[#3B82F6] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending your request…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Booking Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ── Success / pending screen ─────────────────────── */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Request sent
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Awaiting confirmation
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {business?.businessName || placeName} will review your request. You'll get
                an email at <span className="font-semibold text-gray-700">{email}</span>{" "}
                once it's confirmed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                <span className="text-xs text-gray-500 font-medium">Reference</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-mono font-bold text-gray-800 hover:bg-gray-100 transition shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <span>{result.referenceCode}</span>
                      <Copy className="w-3 h-3 text-gray-400" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Venue
                  </span>
                  <span className="font-bold text-gray-900 truncate block">
                    {result.businessName || placeName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Status
                  </span>
                  <span className="font-bold text-amber-600 capitalize block">
                    {result.status || "pending"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Summary
                  </span>
                  <span className="font-bold text-gray-900 block">
                    {result.summary || previewSummary()}
                  </span>
                </div>
                {result.startAt && (
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      When
                    </span>
                    <span className="font-bold text-gray-900 block">
                      {formatFriendlyDateTime(result.startAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  const start = result.startAt ? new Date(result.startAt) : null;
                  const dateStr = start
                    ? toLocalDateInput(start).replace(/-/g, "")
                    : (details.checkIn || details.reservationDate || details.activityDate || "")
                        .replace(/-/g, "");
                  const timeStr = start
                    ? `${String(start.getHours()).padStart(2, "0")}${String(
                        start.getMinutes()
                      ).padStart(2, "0")}`
                    : (details.reservationTime || details.preferredTime || "1200").replace(
                        ":",
                        ""
                      );
                  if (!dateStr) return;
                  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `Booking at ${placeName}`
                  )}&dates=${dateStr}T${timeStr}00/${dateStr}T${timeStr}00&details=${encodeURIComponent(
                    `Reference: ${result.referenceCode}`
                  )}&location=${encodeURIComponent(placeLocation)}`;
                  window.open(url, "_blank");
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-gray-500" />
                Add to Calendar
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#60A5FA] hover:bg-[#3B82F6] shadow-sm transition flex items-center justify-center cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}