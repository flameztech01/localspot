import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";

//new screens
import PlacesDetails from "./pages/PlacesDetails";
import SavedPlaces from "./pages/SavedPlaces";
import Profile from "./pages/Profile";
import BusinessPage from "./pages/business/BusinessPage";

//business
import BusinessSignup from "./pages/business/BusinessSignup";
import BusinessLogin from "./pages/business/BusinessLogin";
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessPromotion from "./pages/business/BusinessPromotion";
import BusinessAds from "./pages/business/BusinessAds";
import BusinessReviews from "./pages/business/BusinessReviews";
import BusinessSettings from "./pages/business/BusinessSettings";
import Reset from "./pages/business/Reset";

//admin screens
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category" element={<SearchResults />} />
        <Route path="/explore" element={<SearchResults />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/saved" element={<SavedPlaces />} />

        {/* new screens */}
        <Route path="/places/:id" element={<PlacesDetails />} />
        <Route path="/profile" element={<Profile />} />

        {/* Business & Admin screens */}
        <Route path="/business/signup" element={<BusinessSignup />} />
        <Route path="/business/signin" element={<BusinessLogin />} />
        <Route path="/business/reset" element={<Reset />} />
        <Route path="/business/reset/:token" element={<Reset />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/list-business" element={<BusinessPage />} />
        <Route path="/business/profile" element={<BusinessProfile />} />
        <Route path="/business/promotions" element={<BusinessPromotion />} />
        <Route path="/business/ads" element={<BusinessAds />} />
        <Route path="/business/reviews" element={<BusinessReviews />} />
        <Route path="/business/settings" element={<BusinessSettings />} />

        {/* admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/admin/dashboard"
          element={<AdminPage initialTab="dashboard" />}
        />
        <Route
          path="/admin/businesses"
          element={<AdminPage initialTab="businesses" />}
        />
        <Route
          path="/admin/approval"
          element={<AdminPage initialTab="approval" />}
        />
        <Route
          path="/admin/approval/:id"
          element={<AdminPage initialTab="approval" />}
        />
      </Routes>
    </div>
  );
}

export default App;
