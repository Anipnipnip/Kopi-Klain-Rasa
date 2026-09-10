import React, { useState } from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import ProductCard from './ProductCard'

const Categories = () => {

  const { products } = useAppContext()

  // ⭐ best seller jadi default tab pertama
  const [activeCategory, setActiveCategory] = useState('best-seller')

  // ⭐ logic produk yang ditampilkan
  const displayedProducts =
    activeCategory === 'best-seller'
      ? products.filter(product => product.inStock).slice(0, 5)
      : products.filter(
          product =>
            product.category?.toLowerCase() === activeCategory?.toLowerCase()
        )

  return (
    // ✅ TAMBAH PADDING BAWAH BIAR GA KETABRAK FOOTER
    <div className='mt-16 px-4 md:px-8 pb-32'>
      
      <p className='text-2xl md:text-3xl font-medium mb-6'>
        Kategori
      </p>

      {/* ================= TAB ================= */}
      <div className='flex gap-6 overflow-x-auto border-b border-gray-200'>

        {/* ⭐ TAB BEST SELLER (PALING DEPAN) */}
        <button
          onClick={() => setActiveCategory('best-seller')}
          className='relative pb-3 text-lg font-medium whitespace-nowrap'
        >
          🔥 Best Seller
          {activeCategory === 'best-seller' && (
            <span className='absolute left-0 bottom-0 w-full h-[3px] bg-red-500 rounded-full'></span>
          )}
        </button>

        {/* TAB KATEGORI NORMAL */}
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category.path)}
            className='relative pb-3 text-lg font-medium whitespace-nowrap'
          >
            {category.text}

            {activeCategory === category.path && (
              <span className='absolute left-0 bottom-0 w-full h-[3px] bg-red-500 rounded-full'></span>
            )}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      <div className='mt-8'>

        <p className='text-gray-600 mb-4'>
          Menampilkan:
          <span className='font-semibold ml-2'>
            {activeCategory === 'best-seller'
              ? 'Best Seller'
              : categories.find(c => c.path === activeCategory)?.text}
          </span>
        </p>

        {displayedProducts.length === 0 ? (
          <p className='text-gray-400'>Tidak ada produk</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {displayedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Categories