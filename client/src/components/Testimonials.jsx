import React from 'react'
import { testimonials } from '../assets/assets'
import { motion } from 'framer-motion'

const Testimonials = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="mt-16 px-4 md:px-8 py-12 rounded-2xl 
                bg-[#B1A1A3]"
    >
      <p className="text-2xl md:text-3xl font-medium text-center text-white">
        Apa Kata Mereka?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8 gap-8">
        {testimonials.map((testi, index) => (
          <div 
            key={index} 
            className="flex flex-col justify-between items-start 
                       text-left border border-gray-200 rounded-xl 
                       p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-700 italic">“{testi.text}”</p>
            <div className="mt-4">
              <p className="font-semibold">{testi.author}</p>
              <p className="text-sm text-gray-500">{testi.role}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Testimonials
