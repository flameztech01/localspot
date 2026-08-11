import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </div>
  )
}

export default App