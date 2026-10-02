import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  BusinessHero,
  BusinessStats,
  BusinessListings,
  BusinessDeals,
  BusinessReviews,
} from '../../components/business'

const BusinessPage = () => {
  return (
    <div>
      <Navbar />
      <BusinessHero />
      <BusinessStats />
      <BusinessListings />
      <BusinessDeals />
      <BusinessReviews />
      <Footer />
    </div>
  )
}

export default BusinessPage