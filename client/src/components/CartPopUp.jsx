import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const CartPopup = () => {
  const {
    cartItems,
    products,
    formatPrice,
    getCartAmount,
    navigate,
    setShowCartPopup,
    removeFromCart,
  } = useAppContext();

  const [visible, setVisible] = useState(false);
  const cartEntries = Object.entries(cartItems);

  // ✨ trigger animation on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setShowCartPopup(false), 300); // tunggu animasi selesai
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-[95%] max-w-md pointer-events-none`}
      aria-live="polite"
    >
      <div
        className={`
          bg-white border border-gray-200 rounded-xl p-4 pointer-events-auto
          transform transition-all duration-300 ease-in-out
          ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Keranjang</h3>
          <div className="flex items-center gap-2">

            <button
              onClick={handleClose}
              aria-label="Close cart popup"
              className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Isi ringkasan */}
        {cartEntries.length === 0 ? (
          <p className="text-sm text-gray-500">Keranjang kosong</p>
        ) : (
          <div className="space-y-3 max-h-56 overflow-auto">
            {cartEntries.map(([id, qty]) => {
              const product = products.find((p) => p._id === id);
              if (!product) return null;
              return (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">x {qty}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-medium">
                      {formatPrice(product.price * qty)}
                    </p>
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer total + checkout */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold">{formatPrice(getCartAmount())}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                handleClose();
                navigate("/cart");
              }}
              className="py-2 px-3 border rounded-md text-sm"
            >
              Checkout
            </button>
            <button
              onClick={handleClose}
              className="py-2 px-3 bg-yellow-500 text-black rounded-md text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
