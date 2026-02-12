import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import Testimonials from '../components/Testimonials'
import InstagramFeed from '../components/InstagramFeed'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='mt-15'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <Testimonials/>
        <InstagramFeed/>
    </div>
  )
}

export default Home