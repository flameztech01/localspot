import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Heart, MapPin, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import directoryData from "../../data/places.json";


const LocalSpotIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 22C12 22 20 14.8 20 9.5C20 5.36 16.42 2 12 2C7.58 2 4 5.36 4 9.5C4 14.8 12 22 12 22Z"
      fill="#1655F2"
    />
    <circle
      cx="12"
      cy="9.5"
      r="3"
      fill="white"
    />
  </svg>
);


const getCategoryFallback = (place) => {
  const cat = (place.category || "").toLowerCase();
  if (cat.includes("hotel")) {
    return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80";
  } else if (
    cat.includes("restaurant") ||
    cat.includes("lounge") ||
    cat.includes("dining")
  ) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
  } else if (cat.includes("cafe")) {
    return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80";
  } else {
    return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80";
  }
};

const getPlaceImage = (place) => {
  if (place.images && place.images.length > 0) {
    const img = place.images[0];
    // Use Google URLs directly
    if (img.startsWith("http")) return img;
    return img;
  }
  return getCategoryFallback(place);
};

const getCategoryLabel = (category) => {
  if (!category) return "";
  const cat = category.toLowerCase();
  if (cat.includes("hotel")) return "Hotel";
  if (
    cat.includes("restaurant") ||
    cat.includes("lounge") ||
    cat.includes("dining")
  )
    return "Restaurant";
  if (cat.includes("cafe")) return "Cafe";
  if (
    cat.includes("attraction") ||
    cat.includes("museum") ||
    cat.includes("park")
  )
    return "Attraction";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  
 
  const categoryFilter = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const categoriesRef = useRef(null);


  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);


  useEffect(() => {
    if (searchParams.get("scroll") === "categories" && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("scroll");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    newParams.set("category", categoryFilter);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", cat);
    if (searchQuery) {
      newParams.set("search", searchQuery);
    }
    setSearchParams(newParams);
  };

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const getPlacesForCategory = (categoryKey) => {
    let filtered = (directoryData.places || []).filter((place) => {
      const cat = (place.category || "").toLowerCase();
      if (categoryKey === "hotel") return cat.includes("hotel");
      if (categoryKey === "restaurant") {
        return (
          cat.includes("restaurant") ||
          cat.includes("lounge") ||
          cat.includes("dining")
        );
      }
      if (categoryKey === "cafe") return cat.includes("cafe");
      if (categoryKey === "attraction") {
        return (
          cat.includes("attraction") ||
          cat.includes("museum") ||
          cat.includes("park")
        );
      }
      return false;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (place) =>
          (place.name || "").toLowerCase().includes(q) ||
          (place.location.address || "").toLowerCase().includes(q) ||
          (place.description || "").toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const sectionsToRender = [
    { key: "hotel", label: "Hotels" },
    { key: "restaurant", label: "Restaurants" },
    { key: "cafe", label: "Cafes" },
    { key: "attraction", label: "Attractions" },
  ];

  const activeSections =
    categoryFilter === "all"
      ? sectionsToRender
      : sectionsToRender.filter((s) => s.key === categoryFilter);

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden flex flex-col justify-between">
      <div>
     
        <header className="w-full bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 md:px-12 lg:px-24 relative">
    
          <Link to="/" className="flex items-center gap-2">
            <LocalSpotIcon className="w-6 h-6 text-[#1655F2]" />
            <span className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">
              LocalSpot
            </span>
          </Link>

       
          <nav className="hidden md:flex items-center justify-center">
            <Link
              to="/"
              className="font-medium text-gray-900 text-sm md:text-base hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
          </nav>

          
          <div className="hidden md:flex">
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 font-medium text-gray-900 text-sm md:text-base hover:text-red-500 transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Favorites</span>
            </Link>
          </div>

      
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-900 focus:outline-none cursor-pointer p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

         
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg z-50 flex flex-col p-5 md:hidden gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-gray-950 text-base pb-3 border-b border-gray-100 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-medium text-gray-950 text-base hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Favorites</span>
              </Link>
            </div>
          )}
        </header>

   
        <div className="relative w-full bg-gray-50 flex items-center min-h-[460px] md:min-h-[520px] lg:min-h-[580px]">
        
          <img
            src="/project/hero-city.jpg"
            alt="Port Harcourt city aerial view"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

       
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Explore the best
              <br />
              places in your city
            </h1>

            <p className="mt-4 text-gray-200 text-sm md:text-base lg:text-lg max-w-xl font-normal leading-relaxed">
              Find and discover top hotels, restaurants, cafes and attractions
              around you.
            </p>

     
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex items-center w-full max-w-lg md:max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100 p-2 gap-2"
            >
              <div className="flex items-center flex-1 min-w-0 pl-3 gap-2.5">
                <Search className="text-gray-400 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for places e.g hotels, cafes..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent font-normal text-sm md:text-base outline-none text-gray-900 placeholder-gray-400 py-1.5"
                />
              </div>

            
              <button
                type="submit"
                className="hidden sm:block bg-black hover:bg-gray-800 text-white rounded-lg text-sm md:text-base font-semibold px-6 py-2.5 transition-colors duration-150 shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>

       
        <div
          ref={categoriesRef}
          className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-10"
        >
         
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide border transition-all duration-150 cursor-pointer text-center ${
                categoryFilter === "all"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange("hotel")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide border transition-all duration-150 cursor-pointer text-center ${
                categoryFilter === "hotel"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => handleCategoryChange("restaurant")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide border transition-all duration-150 cursor-pointer text-center ${
                categoryFilter === "restaurant"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => handleCategoryChange("cafe")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide border transition-all duration-150 cursor-pointer text-center ${
                categoryFilter === "cafe"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
              }`}
            >
              Cafes
            </button>
            <button
              onClick={() => handleCategoryChange("attraction")}
              className={`px-5 py-2.5 rounded-lg col-span-2 sm:col-span-1 text-sm font-semibold tracking-wide border transition-all duration-150 cursor-pointer text-center ${
                categoryFilter === "attraction"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
              }`}
            >
              Attractions
            </button>
          </div>
        </div>

       
        <main className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 space-y-12">
          {activeSections.map((section) => {
            const places = getPlacesForCategory(section.key);

            
            if (places.length === 0) {
              return categoryFilter !== "all" ? (
                <div key={section.key} className="py-12 text-center text-gray-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {section.label}
                  </h2>
                  <p>No places match your search query.</p>
                </div>
              ) : null;
            }

            
            const displayPlaces =
              categoryFilter === "all" ? places.slice(0, 4) : places;

            return (
              <section key={section.key} className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {section.label}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayPlaces.map((place) => {
                    const isLiked = favorites.includes(place.id);
                    return (
                      <Link
                        key={place.id}
                        to={`/details/${place.id}`}
                        className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-150"
                      >
                     
                        <div className="relative w-full aspect-video sm:h-44 md:h-48 overflow-hidden bg-gray-100">
                          <img
                            src={getPlaceImage(place)}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />

                        
                          <button
                            onClick={(e) => toggleFavorite(place.id, e)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-sm z-10 transition-colors cursor-pointer"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-900"
                              }`}
                            />
                          </button>
                        </div>

                   
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                           
                            <span className="inline-block bg-[#111111] text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                              {getCategoryLabel(place.category)}
                            </span>

                       
                            <h3 className="mt-2 text-sm md:text-base font-bold text-gray-900 group-hover:text-[#1655F2] transition-colors leading-snug line-clamp-1">
                              {place.name}
                            </h3>

                         
                            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-800">
                              <span className="text-[#FFB800] text-sm">★</span>
                              <span className="font-semibold">
                                {place.rating?.average || "4.5"}
                              </span>
                              <span className="text-gray-500">
                                ({place.rating?.totalReviews || "120"}{" "}
                                reviews)
                              </span>
                            </div>
                          </div>

                        
                          <div className="flex items-center gap-1 mt-3.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {place.location?.address ||
                                "Old GRA, Port Harcourt"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      <footer className="w-full bg-white border-t border-gray-100 px-6 py-8 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <LocalSpotIcon className="w-7 h-7 text-[#1655F2]" />
          <span className="font-bold text-gray-900 text-lg">LocalSpot</span>
        </div>

       
        <div className="flex items-center gap-8 text-sm md:text-base font-medium">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/?scroll=categories"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/favorites"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Favorites
          </Link>
        </div>

       
        <div className="flex items-center gap-5 text-gray-500">
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-gray-900 transition-colors"
          >
            <FaFacebookF className="w-4.5 h-4.5" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="hover:text-gray-900 transition-colors"
          >
            <FaInstagram className="w-4.5 h-4.5" />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="hover:text-gray-900 transition-colors"
          >
            <FaTiktok className="w-4.5 h-4.5" />
          </a>
          <a
            href="#"
            aria-label="X (Twitter)"
            className="hover:text-gray-900 transition-colors"
          >
            <FaXTwitter className="w-4.5 h-4.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}