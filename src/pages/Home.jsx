import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Popular from '../components/Popular'
import Boost from '../components/Boost'
import PopularSpots from '../components/PopularSpots'
import ActiveDeals from '../components/ActiveDeals'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Featured />
      <Popular />
      <Boost />
      <PopularSpots />
      <ActiveDeals />
      <Footer />
    </div>
  )
}

export default Home
