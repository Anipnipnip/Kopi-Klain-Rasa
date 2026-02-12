import React from 'react'
import { assets } from '../assets/assets';

const posts = [
  { id: 1, img: assets.krig1, link: "https://www.instagram.com/p/Cv2Vr5Xvr2P/" },
  { id: 2, img: assets.krig2, link: "https://www.instagram.com/p/DF8xc1NTk2j/" },
  { id: 3, img: assets.krig3, link: "https://www.instagram.com/p/CU2KqPZvLZK/" },
  { id: 4, img: assets.krig4, link: "https://www.instagram.com/p/DCZDi8JPnqx/" },
  { id: 5, img: assets.krig5, link: "https://www.instagram.com/p/DDaRcfFT7Qj/" },
  { id: 6, img: assets.krig6, link: "https://www.instagram.com/p/Csqbo4VvlM2/" },
  { id: 7, img: assets.krig7, link: "https://www.instagram.com/p/DAikrMOPfif/" },
  { id: 8, img: assets.krig8, link: "https://www.instagram.com/p/DD81ecUPnvb/" },
];

const InstagramFeed = () => {
  return (
    <div 
      style={{
        backgroundImage: `url(${assets.bginstagram})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="-mx-6 md:-mx-16 mt-20 lg:-mx-24 xl:-mx-32 py-16 relative"
    >
      {/* Overlay tipis */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-2xl text-gray-600 font-bold">Follow kami!</p>

        {/* SHAPE BUTTON LINK DENGAN LOGO */}
        <a 
          href="https://www.instagram.com/klainrasa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mt-4 px-6 py-3 rounded-full bg-yellow-500 text-black font-bold text-2xl md:text-4xl 
                     hover:scale-105 transition-transform duration-200"
        >
          <img src={assets.ig_icon} alt="Instagram" className="w-8 h-8 md:w-10 md:h-10"/>
          klainrasa
        </a>

        {/* GRID FEED */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 mt-10">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <img
                src={post.img}
                alt={`Instagram post ${post.id}`}
                className="w-full h-40 sm:h-48 md:h-60 object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstagramFeed
