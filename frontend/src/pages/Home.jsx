import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Newsletter from '../components/Newsletter'
import Footer from '../components/common/Footer'

const Home = () => {
  return (
    <div >
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <Newsletter message='Be the first to hear about new collections, seasonal edits, and special offers from Forever.' />
    </div>
  )
}

export default Home
