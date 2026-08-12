import { useState } from "react";
import {
  MapPin,
  Heart,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Navigation,
  Star,
  Users,
  BedDouble,
  Ruler,
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  Bus,
  Car,
} from "lucide-react";


function Facebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function Instagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Twitter(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 5.9c-.7.3-1.5.6-2.4.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.2 4.2 0 0 0-7.2 3.8A11.9 11.9 0 0 1 3 4.9a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1c-.6.2-1.3.2-1.9.1a4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 18.6a11.9 11.9 0 0 0 6.4 1.9c7.7 0 11.9-6.4 11.9-11.9v-.5c.8-.6 1.5-1.3 2-2.2Z" />
    </svg>
  );
}

export default function HotelDetailPage() {
  const [activeTab, setActiveTab] = useState("Rooms & Suites");

  const tabs = ["About", "Rooms & Suites", "Amenities", "Reviews", "Location", "Contact Information"];

  const heroImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";
  const galleryImgs = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  ];
  const roomImg = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80";

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Waves, label: "Swimming Pool" },
    { icon: UtensilsCrossed, label: "Restaurant" },
    { icon: Dumbbell, label: "Fitness Center" },
    { icon: Sparkles, label: "Spa" },
    { icon: Bus, label: "Airport Shuttle" },
    { icon: Car, label: "Free Parking" },
  ];

  const ratingBreakdown = [
    { stars: 5, count: 120 },
    { stars: 4, count: 90 },
    { stars: 3, count: 11 },
    { stars: 2, count: 3 },
    { stars: 1, count: 2 },
  ];

  const reviews = Array.from({ length: 6 }).map(() => ({
    name: "Jane Prosper",
    rating: 5,
    time: "1hr ago",
    text: "The rooms were spotless and the staff were incredibly friendly. An amazing experience.",
  }));

  const hours = [
    { day: "Monday", time: "09:00AM - 12:00PM" },
    { day: "Tuesday", time: "09:00AM - 12:00PM" },
    { day: "Wednesday", time: "09:00AM - 12:00PM" },
    { day: "Thursday", time: "09:00AM - 12:00PM" },
    { day: "Friday", time: "09:00AM - 12:00PM" },
    { day: "Saturday", time: "09:00AM - 12:00PM" },
    { day: "Sunday", time: "09:00AM - 12:00PM" },
  ];

  return (
    <div className="bg-white min-h-screen">

   
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600 fill-blue-600" />
          <span className="font-bold text-gray-900">LocalSpot</span>
        </div>
        <nav className="text-sm text-gray-700 font-medium">Home</nav>
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Heart className="w-4 h-4 text-red-500" />
          Favorites
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 pt-6">

        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-1 text-sm text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-700">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        <div className="relative mb-16">
          <div className="grid grid-cols-4 gap-3">
            <div
              className="col-span-3 relative rounded-xl overflow-hidden h-80 bg-cover bg-center flex flex-col justify-between p-4"
              style={{ backgroundImage: `url('${heroImg}')` }}
            >
              <div className="flex items-center justify-between">
                <span className="bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Hotel
                </span>
                <span className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-gray-600" />
                </span>
              </div>

              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">The Hotel Presidential</h1>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    4.8 (2,408 reviews)
                  </span>
                  <span>·</span>
                  <span>₦55 - ₦300</span>
                  <span>·</span>
                  <span className="text-green-400">Open 24 hours</span>
                </div>
                <div className="flex items-center gap-1 text-sm mb-7">
                  <MapPin className="w-3.5 h-3.5" />
                  21 Aba Road, GRA, Port Harcourt
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {galleryImgs.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden h-[94px]">
                  <img src={img} alt="Room" className="w-full h-full object-cover" />
                  {i === 2 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                      +21
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        
          <div className="absolute -bottom-8 left-10 right-[calc(25%+0.75rem)] flex justify-center">
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg px-4 py-4">
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                <Phone className="w-4 h-4" /> Call
              </button>
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                <Mail className="w-4 h-4" /> Email
              </button>
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                <MapPin className="w-4 h-4" /> Directions
              </button>
            </div>
          </div>
        </div>

      
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8 text-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 whitespace-nowrap font-medium ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

     
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            The Hotel Presidential offers a blend of luxury and comfort in the
            heart of Port Harcourt. Enjoy elegant rooms, premium amenities,
            and exceptional hospitality whether you're here for business or
            leisure.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Rooms & Suites</h2>
          <div className="grid grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative">
                  <img src={roomImg} alt="Deluxe Room" className="w-full h-32 object-cover" />
                  <span className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-gray-400" />
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-gray-900 font-semibold text-sm mb-2">Deluxe Room</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> 2 guests
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3" /> King Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> 35m
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">Free WiFi</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">Breakfast</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">City View</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-bold text-sm">₦50,000 <span className="text-gray-400 font-normal text-xs">/ night</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-4 gap-4">
            {amenities.map((a, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                <a.icon className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 text-xs font-medium">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

     
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What Guests Say</h2>

          <div className="flex gap-8">
            <div className="w-56 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">4.8</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-4">(238 reviews)</p>

              <div className="space-y-1.5">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4 flex items-center gap-0.5">
                      {r.stars} <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900"
                        style={{ width: `${(r.count / 120) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-6">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              {reviews.map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=random`}
                      alt={r.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-900 text-xs font-semibold">{r.name}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="text-gray-400 text-[10px]">{r.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

   
        <div className="mb-10">
          <div className="rounded-xl overflow-hidden h-56 relative">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLya9zaBnBPfBjNsJkSNOUZ-vK-6fiVWYiYWb-Vr2sFPyhaZMCu7d6y8g&s=10"
              alt="Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-900 fill-white" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" /> 21 Aba Road, GRA, Port Harcourt
            </span>
            <a href="#" className="text-gray-900 font-medium">Open in Maps →</a>
          </div>
        </div>

      
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Opening Hours</h2>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-gray-700">{h.day}</span>
                  <span className="text-gray-500">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" /> +234 704 123 4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" /> info@thehotelpresidential.com
              </p>
              <p className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-500" /> www.thehotelpresidential.com
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Facebook className="w-4 h-4 text-gray-500" />
                <Instagram className="w-4 h-4 text-gray-500" />
                <Twitter className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer className="border-t border-gray-100 px-8 py-6 grid grid-cols-3 items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span className="font-bold text-gray-900 text-sm">LocalSpot</span>
        </div>
        <nav className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <span>Home</span>
          <span>Categories</span>
          <span>Favorites</span>
        </nav>
        <div className="flex items-center justify-end gap-3">
          <Facebook className="w-4 h-4 text-gray-400" />
          <Instagram className="w-4 h-4 text-gray-400" />
          <Twitter className="w-4 h-4 text-gray-400" />
        </div>
      </footer>

    </div>
  );
}