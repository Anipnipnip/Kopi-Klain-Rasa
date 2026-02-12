import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
    const {navigate} = useAppContext();

  return (
    <div className='mt-16 px-4 md:px-8'>
      <p className='text-2xl md:text-3xl font-medium'>Kategori</p>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-6 gap-8'>
        {categories.map((category, index) => (
          <div 
            key={index} 
            className='group cursor-pointer flex flex-col justify-center items-center text-center border border-gray-200 rounded-xl p-6 hover:shadow-md transition'
            onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0,0)
            }}
          >
            <img 
              src={category.image} 
              alt={category.text} 
              className='group-hover:scale-105 transition w-30 h-30 object-contain'
            />
            <p className='text-lg font-semibold mt-3'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
