import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import socket from "../../socket"; // 🔥 TAMBAHAN

const MyOrders = () => {
  const { axios, isSeller, formatPrice } = useAppContext();
  axios.defaults.withCredentials = true;

  const [myOrders, setMyOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setMyOrders([...data.orders]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmCOD = async (orderId) => {
    setLoadingId(orderId);
    try {
      const { data } = await axios.post("/api/order/confirm-cash", { orderId });
      if (data.success) fetchMyOrders();
      else alert(data.message || "Gagal konfirmasi pembayaran");
    } catch (err) { console.error(err); }
    finally { setLoadingId(null); }
  };

  const handleDelivered = async (orderId) => {
    setLoadingId(orderId);
    try {
      const { data } = await axios.post("/api/order/mark-delivered", { orderId });
      if (data.success) fetchMyOrders();
      else alert(data.message);
    } catch (err) { console.error(err); }
    finally { setLoadingId(null); }
  };

  useEffect(() => {
    if (isSeller) fetchMyOrders();

    // 🔥 REALTIME LISTENER
    socket.on("new_order", (order) => {
      setMyOrders((prev) => [order, ...prev]);
    });

    socket.on("order_updated", (updatedOrder) => {
      setMyOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off("new_order");
      socket.off("order_updated");
    };
  }, [isSeller]);

  return (
    <div className="mt-16 pb-16 px-6">
      <h2 className="text-2xl font-semibold mb-8">Pesananku</h2>
      {(!myOrders || myOrders.length === 0) ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOrders.map((order) => (
            <div key={order._id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
              <p className="text-sm text-gray-500 mb-2">Order Id: {order._id}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.createdAt).toLocaleString("id-ID")}
              </p>
              <p className="font-medium mb-1">Nama: {order.customerName}</p>
              <p className="mb-1">Meja: {order.tableNumber}</p>
              <p className="mb-1">Metode: {order.paymentMethod?.toUpperCase()}</p>
              <p className="mb-1">
                Status:{" "}
                <span className={
                  order.status === "Order Placed" ? "text-blue-600"
                  : order.status === "Completed" ? "text-green-600"
                  : "text-yellow-600"
                }>
                  {order.status}
                </span>
              </p>
              <p className="mb-1">
                Dibayar: <span className={order.isPaid ? "text-green-600" : "text-red-600"}>
                  {order.isPaid ? "Sudah" : "Belum"}
                </span>
              </p>
              <p className="font-semibold mt-2">Total: {formatPrice(order.amount)}</p>
              <div className="mt-2">
                <p className="font-medium">Item:</p>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {item.product?.name} ({item.quantity}x)
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Tidak ada item</p>
                )}
              </div>

              {order.paymentMethod === "cash" && !order.isPaid && (
                <button
                  onClick={() => handleConfirmCOD(order._id)}
                  disabled={loadingId === order._id}
                  className={`mt-3 w-full text-white py-2 px-4 rounded-md 
                    ${loadingId === order._id ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {loadingId === order._id ? "Memproses..." : "Konfirmasi Pembayaran"}
                </button>
              )}

              {order.isPaid && order.status !== "Completed" && (
                <button
                  onClick={() => handleDelivered(order._id)}
                  disabled={loadingId === order._id}
                  className={`mt-3 w-full text-white py-2 px-4 rounded-md 
                    ${loadingId === order._id ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {loadingId === order._id ? "Memproses..." : "Pesanan sudah diantar"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;