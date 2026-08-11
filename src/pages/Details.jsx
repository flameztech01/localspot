import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Star, MapPin, Phone, Mail, BedDouble, HelpCircle } from "lucide-react";
import Datadirectory from "../data/places.json";


const getPlaceImage = (place) => {
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

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();


  const place = Datadirectory.find((p) => p.id === id) || Datadirectory[0];

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
      } catch {
     
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-6 px-4">
      <div className="w-full max-w-md bg-gray-100 flex flex-col">
      
        <div className="flex items-center justify-between px-2 pt-2 pb-4">
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

    
        <div className="relative h-64 w-full rounded-t-3xl overflow-hidden shadow-sm">
          <img
            src={getPlaceImage(place)}
            alt={place.name}
            className="w-full h-full object-cover"
          />

       
          <div className="absolute top-4 left-4 bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <BedDouble className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">
              {getCategoryLabel(place.category)}
            </span>
          </div>

        
          <button
            onClick={toggleFavorite}
            aria-pressed={isLiked}
            aria-label="Save to favorites"
            className="absolute top-4 right-4 bg-white/95 rounded-full w-9 h-9 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-900"
              }`}
            />
          </button>
        </div>

        <div className="relative -mt-6 bg-white rounded-3xl shadow-sm px-6 pt-6 pb-6 mx-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {place.name}
          </h1>

          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-sm text-gray-800">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
            <span className="font-semibold">{place.rating?.average || "4.5"}</span>
            <span className="text-gray-500">({place.rating?.totalReviews || "120"} reviews)</span>
            <span className="text-gray-400">·</span>
            <span className="font-medium text-green-600">Open now</span>
          </div>

          <div className="flex items-start gap-1.5 mt-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span>{address}</span>
          </div>

         
          {place.description && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h2 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-2">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {place.description}
              </p>
            </div>
          )}

          
          {place.pricing && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">Price Range</span>
              <span className="font-semibold text-gray-900">
                {place.pricing.currency || "NGN"}{" "}
                {place.pricing.min?.toLocaleString()} - {place.pricing.max?.toLocaleString()}{" "}
                <span className="font-normal text-gray-500 text-xs">
                  {place.pricing.priceType ? `(${place.pricing.priceType})` : ""}
                </span>
              </span>
            </div>
          )}
        </div>

      
        <div className="mx-2 mt-4 space-y-3">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold py-3.5 rounded-2xl flex items-center justify-center transition-colors shadow-sm cursor-pointer text-center"
          >
            Visit Website
          </a>

          <div className="flex gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-base font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-gray-500" />
              Call
            </a>
            <a
              href={`mailto:${email}`}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-base font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              Email
            </a>
          </div>

          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-base font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-gray-500" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}