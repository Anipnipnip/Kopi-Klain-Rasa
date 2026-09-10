import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProducCard = ({ product }) => {
  const { formatPrice, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    const optimizedImage = product.image[0].replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_250/"
  );

  console.log(optimizedImage);

  return product && (
    <div className="border border-gray-500/20 rounded-lg px-4 py-4 sm:px-3 bg-white w-full shadow-sm hover:shadow-md transition flex flex-col justify-between h-full text-[#3F171C] overflow-hidden">
      
      {/* Gambar */}
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="group cursor-pointer flex items-center justify-center px-2"
      >
        <img
  src={optimizedImage}
  alt={product.name}
  width={131}
  height={110}
  loading="lazy"
  decoding="async"
  className="group-hover:scale-105 transition max-h-28 object-contain"
/>
      </div>

      {/* Info */}
      <div className="text-sm mt-3 flex flex-col flex-grow min-w-0">
        <p className="opacity-70">{product.category}</p>

        {/* Nama produk */}
        <p
          onClick={() => {
            navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0);
          }}
          className="font-medium text-base line-clamp-2 cursor-pointer hover:underline"
        >
          {product.name}
        </p>

        <div className="flex-grow"></div>

        {/* Harga + Button */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
          
          {/* Harga */}
          <p className="text-[13px] sm:text-base font-semibold">
            {formatPrice(product.price)}
          </p>

          {/* Button */}
          <div onClick={(e) => e.stopPropagation()} className="sm:ml-auto">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black px-2 h-[34px] rounded text-sm whitespace-nowrap transition active:scale-95 w-full sm:w-auto"
                onClick={() => addToCart(product._id)}
              >
                <img
                  className="w-4 h-4 filter brightness-0"
                  src={assets.cart_icon}
                  alt="cart_icon"
                />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between px-1 w-full sm:w-[90px] h-[34px] bg-[#3F171C]/20 rounded text-sm">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="px-2 h-full"
                >
                  -
                </button>

                <span className="text-center w-5">
                  {cartItems[product._id]}
                </span>

                <button
                  onClick={() => addToCart(product._id)}
                  className="px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProducCard;