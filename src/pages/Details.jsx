import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Star, MapPin, Phone, Mail, BedDouble } from "lucide-react";
import Datadirectory from '../data/places.json'

export default function Details({
  backHref = "/",
  shareUrl = "https://example.com/the-hotel-presidential",
  hotelTypeHref = "/hotels",
  address = "21 Aba Road, GRA, Port Harcourt",
  phoneNumber = "+2348000000000",
  email = "reservations@thehotelpresidential.com",
}) {
  const [liked, setLiked] = useState(false);

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  const handleShare = async (e) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({ title: "The Hotel Presidential", url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-6">
      <div className="w-full max-w-sm bg-gray-100">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <Link to={backHref} className="flex items-center gap-2 text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Back</span>
          </Link>
          <Link
            to={shareUrl}
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-900"
          >
            <span className="text-base">Share</span>
            <Share2 className="w-5 h-5" />
          </Link>
        </div>

        {/* Image */}
        <div className="relative h-56 w-full mx-4 rounded-t-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
            alt="The Hotel Presidential exterior at dusk"
            className="w-full h-full object-cover"
          />

          {/* Hotel badge */}
          <Link
            to={hotelTypeHref}
            className="absolute top-4 left-4 bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm"
          >
            <BedDouble className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">Hotel</span>
          </Link>

          {/* Favorite button */}
          <button
            onClick={() => setLiked((v) => !v)}
            aria-pressed={liked}
            aria-label="Save to favorites"
            className="absolute top-4 right-4 bg-white/95 rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-gray-900"
              }`}
            />
          </button>
        </div>

        {/* Details */}
        <div className="relative -mt-6 mx-4   bg-white rounded-t-3xl rounded-b-3xl shadow-sm px-5 pt-5 pb-5">
          <h1 className="text-3xl font-bold text-gray-900  leading-tight">
            The Hotel Presidential
          </h1>

          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-800">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
            <span className="text-gray-500">(2,400 reviews)</span>
            <span className="text-gray-400">.</span>
            <span className="font-medium">$55 - $300</span>
            <span className="text-gray-400">.</span>
            <span className="text-green-600 font-medium">Open 24 hours</span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{address}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-100 mx-4 mt-4 space-y-3">
          <Link
            to="/book"
            className="w-full bg-gray-900 text-white text-base font-medium py-4 rounded-2xl flex items-center justify-center"
          >
            Book a Room
          </Link>

          <div className="flex gap-3">
            <Link
              to={`tel:${phoneNumber}`}
              className="flex-1 bg-white/80 border border-gray-200 text-gray-900 text-base font-medium py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </Link>
            <Link
              to={`mailto:${email}`}
              className="flex-1 bg-white/80 border border-gray-200 text-gray-900 text-base font-medium py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Link>
          </div>

          <Link
            to={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white/80 border border-gray-200 text-gray-900 text-base font-medium py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Directions
          </Link>
        </div>
      </div>
    </div>
  );
}