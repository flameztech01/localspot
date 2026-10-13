// src/components/BookingModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CalendarPlus,
  Copy,
  Check,
  Coffee,
  Bed,
  Utensils,
  PartyPopper,
} from "lucide-react";

export default function BookingModal({ isOpen, onClose, place }) {
  // Today's date as minimum
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState("18:30");
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [seatingArea, setSeatingArea] = useState("indoor");
  const [serviceType, setServiceType] = useState("table");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state on close after animation
      setTimeout(() => {
        setIsConfirmed(false);
        setErrorMsg("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !place) return null;

  const placeName = place.name || "Selected Venue";
  const placeLocation =
    typeof place.location === "string"
      ? place.location
      : place.location?.address || place.location?.city || "Port Harcourt, Nigeria";
  const placeRating = Number(place.rating || 4.8).toFixed(1);
  const placeReviews = place.reviews || place.numReviews || 120;
  const placeImg =
    place.img ||
    place.coverImage ||
    place.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";
  const placeCategory = (place.category || place.meta || "Venue").toUpperCase();

  const timeSlots = [
    { label: "12:00 PM", value: "12:00" },
    { label: "01:30 PM", value: "13:30" },
    { label: "03:00 PM", value: "15:00" },
    { label: "05:30 PM", value: "17:30" },
    { label: "06:30 PM", value: "18:30" },
    { label: "07:30 PM", value: "19:30" },
    { label: "08:30 PM", value: "20:30" },
    { label: "09:30 PM", value: "21:30" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic reservation API request
    setTimeout(() => {
      const randomRef = `LS-BK-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(randomRef);

      // Save to localStorage for persistence
      try {
        const existing = JSON.parse(localStorage.getItem("localspot_user_bookings") || "[]");
        const newBooking = {
          id: randomRef,
          placeId: place.id,
          placeName,
          placeLocation,
          placeImg,
          placeCategory,
          date,
          time,
          guests,
          fullName,
          email,
          phone,
          specialRequests,
          seatingArea,
          serviceType,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("localspot_user_bookings", JSON.stringify([newBooking, ...existing]));
      } catch (_) {}

      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 900);
  };

  const handleCopyRef = () => {
    if (bookingRef) {
      navigator.clipboard.writeText(bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFriendlyDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="relative border-b border-gray-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0 shadow-xs">
                <img
                  src={placeImg}
                  alt={placeName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-600 text-white uppercase">
                    {placeCategory}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {placeRating}
                    <span className="text-gray-400 font-normal">({placeReviews})</span>
                  </span>
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
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isConfirmed ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Reservation Type / Seating options */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Reservation Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "indoor", label: "Indoor Dining", icon: Utensils },
                  { id: "outdoor", label: "Outdoor Terrace", icon: Coffee },
                  { id: "vip", label: "VIP / Private", icon: Sparkles },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = seatingArea === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSeatingArea(opt.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        active
                          ? "border-[#3B82F6] bg-blue-50/70 text-blue-700 shadow-xs"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${active ? "text-blue-600" : "text-gray-400"}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Guests Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reservation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Number of Guests
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(20, g + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Time Slot
                </label>
                <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" /> Instant confirmation
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const active = time === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setTime(slot.value)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        active
                          ? "bg-[#60A5FA] text-white border-[#3B82F6] shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Guest Contact Details
              </label>

              <div>
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
                  placeholder="Special requests or dietary notes (optional)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition resize-none"
                />
              </div>
            </div>

            {/* Trust and Policy Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant table hold. No reservation fee or cancellation charge.</span>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#60A5FA] hover:bg-[#3B82F6] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming your reservation...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm &amp; Book Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                <PartyPopper className="w-3.5 h-3.5" /> Reservation Confirmed
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                You're all booked!
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                A confirmation voucher and SMS pass have been sent to{" "}
                <span className="font-semibold text-gray-700">{email}</span>.
              </p>
            </div>

            {/* Reference & Summary Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                <span className="text-xs text-gray-500 font-medium">Booking Reference</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-mono font-bold text-gray-800 hover:bg-gray-100 transition shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <span>{bookingRef}</span>
                      <Copy className="w-3 h-3 text-gray-400" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Venue</span>
                  <span className="font-bold text-gray-900 truncate block">{placeName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Party</span>
                  <span className="font-bold text-gray-900 block">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-bold text-gray-900 block">{formatFriendlyDate(date)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Time</span>
                  <span className="font-bold text-gray-900 block">{time}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reservation+at+${encodeURIComponent(placeName)}&dates=${date.replace(/-/g, "")}T${time.replace(":", "")}00Z/${date.replace(/-/g, "")}T${time.replace(":", "")}00Z&details=Booking+Reference:+${bookingRef}&location=${encodeURIComponent(placeLocation)}`;
                  window.open(googleCalUrl, "_blank");
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CalendarPlus className="w-4 h-4 text-gray-500" />
                Add to Calendar
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#60A5FA] hover:bg-[#3B82F6] shadow-sm transition flex items-center justify-center"
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
