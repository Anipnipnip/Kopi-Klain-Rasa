import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const { axios, user, formatPrice } = useAppContext();
  const [myOrders, setMyOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16 px-6">
      <h2 className="text-2xl font-semibold mb-8">My Orders</h2>

      {(!myOrders || myOrders.length === 0) ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-sm text-gray-500 mb-2">Order Id: {order._id}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.createdAt).toLocaleString("id-ID")}
              </p>
              <p className="font-medium mb-1">Nama: {order.customerName}</p>
              <p className="mb-1">Meja: {order.tableNumber}</p>
              <p className="mb-1">Metode: {order.paymentMethod?.toUpperCase()}</p>
              <p className="mb-1">
                Status:{" "}
                <span
                  className={`${
                    order.status === "Order Placed"
                      ? "text-blue-600"
                      : order.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="mb-1">
                Dibayar:{" "}
                <span
                  className={order.isPaid ? "text-green-600" : "text-red-600"}
                >
                  {order.isPaid ? "Sudah" : "Belum"}
                </span>
              </p>
              <p className="font-semibold mt-2">
                Total: {formatPrice(order.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
