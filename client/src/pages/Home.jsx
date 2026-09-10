import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import Testimonials from '../components/Testimonials'
import InstagramFeed from '../components/InstagramFeed'

const Home = () => {
  return (
    <div className="mt-15">

      {/* ================= HOME ================= */}
      <section id="home" className="scroll-mt-28">
        <MainBanner />
        <Categories />
      </section>


      {/* ================= ABOUT ================= */}
   

      {/* ================= FOOTER / KONTAK ================= */}
      

    </div>
  )
}

export default Home