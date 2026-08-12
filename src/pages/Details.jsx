import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Share2, Heart, Star, MapPin, Phone, Mail, 
  BedDouble, HelpCircle, Wifi, Waves, Utensils, Dumbbell, 
  Flower2, Plane, Car, User
} from "lucide-react";
import Datadirectory from "../../data/places.json";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const getCategoryFallback = (place) => {
  const cat = (place.category || "").toLowerCase();
  if (cat.includes("hotel")) {
    return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80";
  } else if (
    cat.includes("restaurant") ||
    cat.includes("lounge") ||
    cat.includes("dining")
  ) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
  } else if (cat.includes("cafe")) {
    return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80";
  } else {
    return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80";
  }
};

const getCategorySideImages = (category) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("hotel")) {
    return [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80"
    ];
  } else if (cat.includes("restaurant") || cat.includes("lounge") || cat.includes("dining")) {
    return [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80"
    ];
  } else if (cat.includes("cafe")) {
    return [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"
    ];
  } else {
    return [
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80"
    ];
  }
};

const getPlaceImage = (place) => {
  if (place.images && place.images.length > 0) {
    const img = place.images[0];
    if (img.startsWith("http")) return img;
    return img;
  }
  return getCategoryFallback(place);
};

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
    <circle cx="12" cy="9.5" r="3" fill="white" />
  </svg>
);

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

const getAmenityIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="w-5 h-5 mb-2" />;
  if (lower.includes("pool")) return <Waves className="w-5 h-5 mb-2" />;
  if (lower.includes("restaurant") || lower.includes("dining")) return <Utensils className="w-5 h-5 mb-2" />;
  if (lower.includes("gym") || lower.includes("fitness")) return <Dumbbell className="w-5 h-5 mb-2" />;
  if (lower.includes("spa")) return <Flower2 className="w-5 h-5 mb-2" />;
  if (lower.includes("parking")) return <Car className="w-5 h-5 mb-2" />;
  if (lower.includes("shuttle") || lower.includes("airport")) return <Plane className="w-5 h-5 mb-2" />;
  return <HelpCircle className="w-5 h-5 mb-2" />;
};

const TABS = [
  { id: "about", label: "About" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Contact Information" },
];

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const place = (Datadirectory.places || []).find((p) => p.id === parseInt(id)) || (Datadirectory.places || [])[0];
  const isHotel = (place.category || "").toLowerCase().includes("hotel");

  const [activeTab, setActiveTab] = useState("about");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const isLiked = favorites.includes(place.id);

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = prev.includes(place.id)
        ? prev.filter((item) => item !== place.id)
        : [...prev, place.id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const address = place.location?.address || "Port Harcourt, Nigeria";
  const phoneNumber = place.contact?.phone || "+2348000000000";
  const email = place.contact?.email || "info@localspot.com";
  const website = place.contact?.website || "https://example.com";
  const shareUrl = window.location.href;

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  const handleShare = async (e) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({ title: place.name, url: shareUrl });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const tabsToRender = isHotel ? TABS : TABS.filter(t => t.id !== "rooms");

  const scrollToSection = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const headerOffset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      let currentActiveTab = "about";
      for (const tab of tabsToRender) {
        const element = document.getElementById(tab.id);
        if (element && scrollPosition >= element.offsetTop) {
          currentActiveTab = tab.id;
        }
      }
      setActiveTab(currentActiveTab);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabsToRender]);


  const mockRooms = [
    { id: 1, title: "Deluxe Room", guests: 2, bed: "King Bed", size: "28m", features: ["Free Wifi", "Breakfast", "City View"], price: 98, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Executive Suite", guests: 2, bed: "King Bed", size: "35m", features: ["Free Wifi", "Breakfast", "City View"], price: 150, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Family Room", guests: 4, bed: "2 Queen Beds", size: "40m", features: ["Free Wifi", "Breakfast", "Pool View"], price: 180, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Presidential Suite", guests: 3, bed: "King Bed", size: "55m", features: ["Free Wifi", "Breakfast", "Ocean View"], price: 350, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Standard Room", guests: 2, bed: "Queen Bed", size: "24m", features: ["Free Wifi", "City View"], price: 80, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Ocean View Room", guests: 2, bed: "King Bed", size: "30m", features: ["Free Wifi", "Breakfast", "Ocean View"], price: 120, image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=400&q=80" },
  ];

 
  const reviewDistribution = [
    { stars: 5, count: 120 },
    { stars: 4, count: 98 },
    { stars: 3, count: 11 },
    { stars: 2, count: 8 },
    { stars: 1, count: 2 },
  ];
  const totalMockReviews = reviewDistribution.reduce((sum, item) => sum + item.count, 0);

  const getDayHours = (day) => {
    const hours = place.openingHours?.[day];
    if (!hours) return "Closed";
    if (typeof hours === "object") {
      return `${hours.open} - ${hours.close}`;
    }
    return hours;
  };

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const sideImages = getCategorySideImages(place.category);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 pb-0 flex flex-col justify-between">
      <div>
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-900 font-medium hover:text-[#1655F2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Back</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-900 font-medium hover:text-[#1655F2] transition-colors cursor-pointer"
          >
            <span className="text-base">Share</span>
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex gap-4 h-[60vh] min-h-[400px]">
            {/* Main Left Image */}
            <div className="relative w-full md:w-[75%] h-full rounded-[32px] overflow-hidden shadow-sm bg-gray-100">
              <img
                src={getPlaceImage(place)}
                alt={place.name}
                className="w-full h-full object-cover"
              />
             
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
  
              <div className="absolute top-6 left-6 bg-white rounded-lg px-3 py-2 flex items-center gap-1.5 shadow-md">
                <BedDouble className="w-4 h-4 text-gray-900" />
                <span className="text-sm font-semibold text-gray-900">
                  {getCategoryLabel(place.category)}
                </span>
              </div>
  
              <button
                onClick={toggleFavorite}
                aria-pressed={isLiked}
                aria-label="Save to favorites"
                className="absolute top-6 right-6 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-900"
                  }`}
                />
              </button>
  
              <div className="absolute bottom-12 left-6 md:left-12 right-6 flex flex-col gap-3">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  {place.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-200">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                    <span className="font-semibold text-white">{place.rating?.average || "4.5"}</span>
                    <span>({(place.rating?.totalReviews || 120).toLocaleString()} reviews)</span>
                  </div>
                  <span>·</span>
                  {place.pricing && (
                    <>
                      <span className="font-medium text-white">
                        {place.pricing.currency === "NGN" ? "₦" : "$"}{place.pricing.min?.toLocaleString()} - {place.pricing.currency === "NGN" ? "₦" : "$"}{place.pricing.max?.toLocaleString()}
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span className="font-medium text-green-400">Open now</span>
                </div>
  
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{address}</span>
                </div>
              </div>
            </div>

            {/* Right Side Images */}
            <div className="hidden md:flex md:w-[25%] flex-col gap-4 h-full">
              <div className="relative w-full h-[33.33%] rounded-[24px] overflow-hidden bg-gray-100">
                <img 
                  src={place.images?.[1] || sideImages[0]} 
                  alt={`${place.name} view 1`} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="relative w-full h-[33.33%] rounded-[24px] overflow-hidden bg-gray-100">
                <img 
                  src={place.images?.[2] || sideImages[1]} 
                  alt={`${place.name} view 2`} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="relative w-full h-[33.33%] rounded-[24px] overflow-hidden bg-gray-100 group cursor-pointer">
                <img 
                  src={place.images?.[3] || sideImages[2]} 
                  alt={`${place.name} view 3`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <span className="text-white text-2xl font-medium tracking-wider">
                    +{place.images?.length > 4 ? place.images.length - 4 : 21}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -mt-6 z-10 w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-between p-2">
            <a
              href={`tel:${phoneNumber}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-900 font-semibold cursor-pointer"
            >
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <div className="w-px h-8 bg-gray-200"></div>
            <a
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-900 font-semibold cursor-pointer"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Email</span>
            </a>
            <div className="w-px h-8 bg-gray-200"></div>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-900 font-semibold cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Directions</span>
            </a>
          </div>

          
          <div className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md mt-10 border-b border-gray-200 overflow-x-auto no-scrollbar pb-[2px]">
            <div className="flex items-center gap-6 md:gap-10 min-w-max px-2">
              {tabsToRender.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`py-4 text-sm md:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-10 space-y-16">
           
            <section id="about" className="scroll-mt-32">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl">
                {place.description || 
                 `Welcome to ${place.name}. Located in the heart of Port Harcourt, we offer a blend of comfort, style, and exceptional service.`}
              </p>
            </section>

         
            {isHotel && (
              <section id="rooms" className="scroll-mt-32">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Rooms & Suites</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockRooms.map((room) => (
                    <div key={room.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 w-full bg-gray-100">
                        <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50">
                          <Heart className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900">{room.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {room.guests} Guests</span>
                          <span className="text-gray-300">|</span>
                          <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {room.bed}</span>
                          <span className="text-gray-300">|</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {room.size}</span>
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {room.features.map(feat => (
                            <span key={feat} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                              {feat}
                            </span>
                          ))}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-end">
                          <span className="text-xl font-bold text-gray-900">${room.price}</span>
                          <span className="text-sm text-gray-500 ml-1 mb-0.5 font-medium">/ night</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          
            <section id="amenities" className="scroll-mt-32">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="flex flex-wrap gap-4">
                {(place.amenities?.length ? place.amenities : ["Free WiFi", "Swimming Pool", "Restaurant", "Fitness Center", "Spa", "Airport Shuttle", "Free Parking"]).map((amenity) => (
                  <div key={amenity} className="flex flex-col items-center justify-center bg-[#F3F4F6] text-gray-700 w-28 h-24 rounded-2xl hover:bg-gray-200 transition-colors">
                    {getAmenityIcon(amenity)}
                    <span className="text-[11px] font-semibold text-center px-1">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="reviews" className="scroll-mt-32">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">What Guests Say</h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                
                
                <div className="lg:col-span-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">{place.rating?.average || "4.8"}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 mt-1 font-medium">({(place.rating?.totalReviews || 120).toLocaleString()} reviews)</span>
                  
                  <div className="mt-6 space-y-2.5">
                    {reviewDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center text-sm">
                        <span className="w-3 text-gray-700 font-medium">{item.stars}</span>
                        <Star className="w-3 h-3 text-gray-400 fill-gray-400 mx-1.5" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                          <div 
                            className="h-full bg-black rounded-full" 
                            style={{ width: `${(item.count / totalMockReviews) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-500 w-6 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(place.testimonials?.length ? place.testimonials : [
                    { name: "Jane Cooper", rating: 5, comment: "The rooms were spotless and the staff were incredibly friendly. An amazing experience!" },
                    { name: "Jane Cooper", rating: 4, comment: "The rooms were spotless and the staff were incredibly friendly. An amazing experience!" },
                    { name: "Jane Cooper", rating: 5, comment: "The rooms were spotless and the staff were incredibly friendly. An amazing experience!" },
                    { name: "Jane Cooper", rating: 5, comment: "The rooms were spotless and the staff were incredibly friendly. An amazing experience!" },
                  ]).map((review, i) => {
                    const rev = typeof review === 'string' ? { name: "Guest", rating: 5, comment: review } : review;
                    return (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${rev.name}`} alt={rev.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{rev.name}</h4>
                          <div className="flex text-[#FFB800] mt-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-3 h-3 ${j < rev.rating ? "fill-[#FFB800]" : "fill-gray-200 text-gray-200"}`} />
                            ))}
                            <span className="text-gray-400 text-xs ml-2 font-medium">1 day ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mt-2">
                        {rev.comment}
                      </p>
                    </div>
                  )})}
                </div>
              </div>
            </section>

         
            <section id="location" className="scroll-mt-32">
              <div className="w-full h-64 md:h-[400px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-200 shadow-sm">
                
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" alt="Map View" className="w-full h-full object-cover opacity-50 grayscale" />
                
             
                <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-xl">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center z-10">
                    <MapPin className="w-5 h-5 fill-white" />
                  </div>
                  <div className="w-4 h-4 bg-black rotate-45 -mt-2 z-0"></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 px-2 gap-3">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  {address}
                </div>
                <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 hover:text-[#1655F2] flex items-center gap-1 transition-colors">
                  Open in Maps &rarr;
                </a>
              </div>
            </section>

          
            <section id="contact" className="scroll-mt-32 pt-10 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Opening Hours</h2>
                  <div className="space-y-4 max-w-sm">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex justify-between items-center text-sm md:text-base border-b border-gray-100 pb-3">
                        <span className="capitalize text-gray-600 font-medium">{day}</span>
                        <span className="font-medium text-gray-900">{getDayHours(day)}</span>
                      </div>
                    ))}
                  </div>
                </div>

            
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="space-y-5 text-gray-700">
                    <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 hover:text-[#1655F2] transition-colors">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{phoneNumber}</span>
                    </a>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-[#1655F2] transition-colors">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{email}</span>
                    </a>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1655F2] transition-colors">
                      <GlobeIcon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <a href="#" className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                      <FaFacebookF className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
                      <FaInstagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                      <FaXTwitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>


      <footer className="w-full bg-white border-t border-gray-100 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <LocalSpotIcon className="w-7 h-7 text-[#1655F2]" />
          <span className="font-bold text-gray-900 text-lg">LocalSpot</span>
        </div>
        <div className="flex items-center gap-8 text-sm md:text-base font-medium">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/?scroll=categories" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</Link>
          <Link to="/favorites" className="text-gray-600 hover:text-gray-900 transition-colors">Favorites</Link>
        </div>
        <div className="flex items-center gap-5 text-gray-500">
           <FaFacebookF className="w-4.5 h-4.5 hover:text-gray-900 cursor-pointer transition-colors" />
           <FaInstagram className="w-4.5 h-4.5 hover:text-gray-900 cursor-pointer transition-colors" />
           <FaTiktok className="w-4.5 h-4.5 hover:text-gray-900 cursor-pointer transition-colors" />
           <FaXTwitter className="w-4.5 h-4.5 hover:text-gray-900 cursor-pointer transition-colors" />
        </div>
      </footer>
    </div>
  );
}

const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);