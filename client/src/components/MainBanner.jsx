import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom"

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.kr_banner} alt="banner"   width={1440}
  height={600}
  fetchPriority="high"  className='w-full hidden md:block' />
      <img src={assets.kr_banner_sm} alt="banner"   width={430}
  height={430}
  fetchPriority="high" className='w-full md:hidden' />

      <div className='absolute inset-0 flex flex-col items-center md:items-start justify-center px-4 md:pl-18 lg:pl-24'>
<h1
  className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-white'
  style={{
    textShadow: "0 0 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)"
  }}
>          Datang karena penasaran, balik karena nyaman!
        </h1>

        <div className='flex items-center mt-6 font-medium'>
          <Link 
            to={"/products"} 
            className='group flex items-center gap-2 px-7 md:px-9 py-3 rounded text-black cursor-pointer
                      transition'
            style={{ backgroundColor: "#FABC3F" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0a733")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FABC3F")}
          >
            Beli Sekarang
          </Link>

          <Link 
            to={"/produk"} 
            className='group hidden md:flex items-center gap-2 px-9 py-3 text-white'
          >
            Explore Deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
