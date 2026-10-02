import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details'
import Favorites from './pages/Favorites'
import SearchResults from './pages/SearchResults'

//new screens
import PlacesDetails from './pages/PlacesDetails'
import SavedPlaces from './pages/SavedPlaces'
import Profile from './pages/Profile'
import BusinessPage from './pages/business/BusinessPage'
import AdminPage from './pages/admin/AdminPage'

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
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/list-business" element={<BusinessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App