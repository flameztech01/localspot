import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import {
  FaBed,
  FaUtensils,
  FaHamburger,
  FaCocktail,
  FaTree,
} from "react-icons/fa";

const categories = [
  {
    slug: "hotels",
    name: "Hotels",
    count: "164 spots",
    Icon: FaBed,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    count: "412 spots",
    Icon: FaUtensils,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "local-food",
    name: "Local food",
    count: "295 spots",
    Icon: FaHamburger,
    img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "bars-lounges",
    name: "Bars & Lounges",
    count: "128 spots",
    Icon: FaCocktail,
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "parks-recreation",
    name: "Parks & Rec",
    count: "46 places",
    Icon: FaTree,
    img: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800",
  },
];

const CategoryCard = ({ slug, name, count, Icon, img }) => (
  <Link
    to={`/categories/${slug}`}
    className="group relative block h-24 w-full overflow-hidden rounded-xl sm:h-28 lg:h-32"
  >
    <img
      src={img}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
    />

    {/* Dark gradient so the text stays readable */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

    {/* Icon */}
    <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm sm:h-9 sm:w-9">
      <Icon size={12} className="sm:hidden" />
      <Icon size={14} className="hidden sm:block" />
    </span>

    {/* Text */}
    <div className="absolute inset-x-3 bottom-2.5 text-white sm:bottom-3">
      <h3 className="truncate text-[13px] font-bold sm:text-base">{name}</h3>
      <p className="text-[10px] text-white/85 sm:text-xs">{count}</p>
    </div>
  </Link>
);

const Popular = () => {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll the mobile carousel
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const isMobile = () => window.innerWidth < 768;
    let resumeTimeout = null;

    const tick = () => {
      if (!isMobile() || isPaused) return;

      const firstCard = el.querySelector("[data-card]");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth + 12; // + gap-3 (12px)
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    };

    const interval = setInterval(tick, 2800);

    const handlePause = () => {
      setIsPaused(true);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => setIsPaused(false), 4000);
    };

    el.addEventListener("touchstart", handlePause, { passive: true });
    el.addEventListener("wheel", handlePause, { passive: true });
    el.addEventListener("mousedown", handlePause);

    return () => {
      clearInterval(interval);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      el.removeEventListener("touchstart", handlePause);
      el.removeEventListener("wheel", handlePause);
      el.removeEventListener("mousedown", handlePause);
    };
  }, [isPaused]);

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-3xl">
            Popular Categories
          </h2>
          <Link
            to="/categories"
            className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-gray-800 transition-colors hover:text-[#3B82F6] sm:gap-1 sm:text-sm"
          >
            View all categories
            <FiChevronRight size={14} className="sm:hidden" />
            <FiChevronRight size={16} className="hidden sm:block" />
          </Link>
        </div>

        {/* Mobile: auto-scrolling swipeable row. Desktop: 5 columns */}
        <div
          ref={trackRef}
          className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:scroll-pl-6 sm:px-6 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0 md:scroll-pl-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => (
            <div
              key={cat.slug}
              data-card
              className="w-[42vw] flex-none snap-start sm:w-[30vw] md:w-auto"
            >
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Popular;
