import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProducCard = ({ product }) => {
  const { formatPrice, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return product && (
    <div className="border border-gray-500/20 rounded-lg md:px-4 px-3 py-4 bg-white w-full shadow-sm hover:shadow-md transition">
      {/* Gambar */}
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="group cursor-pointer flex items-center justify-center px-2"
      >
        <img
          className="group-hover:scale-105 transition max-h-28 object-contain"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Info */}
      <div className="text-gray-500/60 text-sm mt-2">
        <p>{product.category}</p>
        <p
          onClick={() => {
            navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0);
          }}
          className="text-gray-700 font-medium text-lg truncate cursor-pointer hover:underline"
        >
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
          <p>(4)</p>
        </div>

        {/* Harga + Button */}
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {formatPrice(product.price)}
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            className="text-primary flex-shrink-0"
          >
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart_icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
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
