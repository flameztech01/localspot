import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiCheckCircle } from "react-icons/fi";

// --- High-Quality Images of Areas, Hotels, Lounges, and Buildings ---
const sliderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600", // Luxury Hotel
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1600", // Upscale Lounge
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1600", // City Area
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600", // Fine Dining
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1600", // Resort
];

const BusinessHero = ({ onAddListingClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col justify-end lg:justify-center overflow-hidden">
      {/* ================= BACKGROUND IMAGE SLIDER ================= */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Background slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Gradient overlay: darker at the bottom for mobile text readability, fades out to the right on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent" />
      </div>

      {/* ================= TOP RIGHT CONTROLS (Functional 3 Dots) ================= */}
      <div className="absolute top-8 right-8 lg:right-12 z-30 flex items-center gap-2 bg-white/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/40 shadow-sm">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === activeSlide
                ? "w-6 h-2 bg-gray-900"
                : "w-2 h-2 bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pb-16 lg:pb-0">
        {/* Changed to items-end on mobile to push content to the bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-end lg:items-center">
          {/* ================= LEFT SIDE: TEXT & CTAs ================= */}
          <div className="space-y-6 text-left w-full">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900 leading-[1.05]">
              Step Into <br />
              <span className="text-gray-400">Greatness.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-md lg:mx-0 leading-relaxed font-medium">
              Discover a new way to manage your business presence. Connect with
              locals, showcase your services, and grow your reach effortlessly.
            </p>

            {/* Updated buttons to rounded-lg for small curved edges */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={onAddListingClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-all shadow-lg shadow-gray-900/20"
              >
                List Your Business
              </button>
              <Link
                to="/business/signin"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                View Dashboard
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ================= RIGHT SIDE: FLOATING CARDS (Hidden on Mobile) ================= */}
          <div className="hidden lg:flex relative h-[600px] w-full items-center justify-center">
            {/* Floating Card */}
            <div className="absolute bottom-24 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 z-20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Verified Partner
                </p>
                <p className="text-xs font-bold text-gray-900">
                  Skyline Terrace & Lounge
                </p>
              </div>
            </div>

            {/* Tiny Rating Badge */}
            <div className="absolute top-20 left-4 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/40 z-20 flex items-center gap-1.5">
              <FiStar size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-gray-900">
                4.9 / 5.0
              </span>
              <span className="text-[10px] text-gray-500">(2k+ reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessHero;
