import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ⬅️ import navigate

const Cart = () => {
  const { cartItems, products, formatPrice, removeFromCart, getCartAmount } = useAppContext();
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [snapToken, setSnapToken] = useState(null);

  const navigate = useNavigate(); // ⬅️ hook navigate

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName || !tableNumber) {
      return toast.error("Nama dan Nomor Meja harus diisi!");
    }

    if (paymentMethod === "cash") {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/place`, {
        items: Object.entries(cartItems).map(([id, qty]) => ({ product: id, quantity: qty })),
        customerName,
        tableNumber,
        paymentMethod,
      }, { withCredentials: true });

      if (data.success) {
        toast.success("Silahkan ke kasir untuk pembayaran agar pesanan bisa diproses");
        navigate("/my-orders"); // ⬅️ langsung ke MyOrders
      }
      return;
    }

    if (paymentMethod === "transfer") {
      try {
        const orderRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/place`, {
          items: Object.entries(cartItems).map(([id, qty]) => ({ product: id, quantity: qty })),
          customerName,
          tableNumber,
          paymentMethod,
        }, { withCredentials: true });

        if (!orderRes.data.success) {
          return toast.error("Gagal membuat order");
        }

        const orderId = orderRes.data.orderId;

        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/midtrans/create`, {
          orderId,
          amount: getCartAmount(),
          customer: { name: customerName, email: "customer@example.com" },
          items: Object.entries(cartItems).map(([id, qty]) => {
            const product = products.find((p) => p._id === id);
            return { id, name: product?.name, price: product?.price, quantity: qty };
          }),
        }, { withCredentials: true });

        setSnapToken(data.token);

        if (window.snap) {
          window.snap.pay(data.token, {
            onSuccess: () => {
              toast.success("Pembayaran berhasil!");
              navigate("/my-orders"); // ⬅️ redirect otomatis ke MyOrders
            },
            onPending: () => toast("Menunggu pembayaran..."),
            onError: () => toast.error("Pembayaran gagal"),
            onClose: () => toast("Transaksi dibatalkan"),
          });
        } else {
          toast.error("Snap.js belum ke-load");
        }
      } catch (err) {
        toast.error("Gagal membuat transaksi Midtrans");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-12 pb-20 md:pb-10">

      {/* Cart Items */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        {Object.entries(cartItems).map(([id, qty]) => {
          const product = products.find((p) => p._id === id);
          if (!product) return null;
          return (
            <div
              key={id}
              className="flex justify-between items-center border p-4 rounded-lg mb-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600">x {qty}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p>{formatPrice(product.price * qty)}</p>
                <button
                  onClick={() => removeFromCart(id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <form onSubmit={handleCheckout} className="flex-1 border p-6 rounded-lg shadow-lg bg-white transition-shadow duration-300 hover:shadow-xl">
        <label className="block mb-2">Nama</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="Masukkan nama"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <label className="block mb-2">Nomor Meja</label>
        <input
          type="number"
          min="1"
          max="99"
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="01"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <label className="block mb-2">Metode Pembayaran</label>
        <div className="mb-4 flex gap-4">
          <label
            className={`
              flex-1 text-center py-2 rounded-lg cursor-pointer font-medium transition
              ${paymentMethod === "transfer" ? "bg-yellow-500 text-black shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
          >
            <input
              type="radio"
              name="payment"
              value="transfer"
              checked={paymentMethod === "transfer"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            Transfer
          </label>

          <label
            className={`
              flex-1 text-center py-2 rounded-lg cursor-pointer font-medium transition
              ${paymentMethod === "cash" ? "bg-yellow-500 text-black shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
          >
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            Cash
          </label>
        </div>

        <p className="mb-2">Subtotal: {formatPrice(getCartAmount())}</p>
        <p className="font-semibold mb-4">Total: {formatPrice(getCartAmount())}</p>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-300"
        >
          Bayar
        </button>
      </form>
    </div>
  );
};

export default Cart;
