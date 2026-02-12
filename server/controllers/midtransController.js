import midtransClient from "midtrans-client";
import Order from "../models/order.js";

// === MIDTRANS SETUP ===
const snap = new midtransClient.Snap({
  isProduction: false, // ubah ke true kalau udah live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// === GENERATE SNAP TOKEN ===
// midtransController.js
export const createTransaction = async (req, res) => {
  try {
    const { orderId, amount, customer } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId, // gunakan _id dari MongoDB
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer?.name || "Customer",
        email: customer?.email || "example@mail.com",
      },
      credit_card: { secure: true },
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // ✅ Simpan orderId midtrans ke DB (agar bisa dicocokkan di callback)
    await Order.findByIdAndUpdate(orderId, { orderId: parameter.transaction_details.order_id });

    res.status(200).json({
      message: "Snap token created successfully",
      token: snapToken,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans Create Transaction Error:", error.message);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};


// === HANDLE CALLBACK / NOTIFICATION ===
export const handleNotification = async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id; // Ini adalah _id order

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (statusResponse.transaction_status === "capture" || statusResponse.transaction_status === "settlement") {
      order.isPaid = true;
      order.status = "Completed"; // Atau "Paid"
    } else if (statusResponse.transaction_status === "pending") {
      order.status = "Pending";
    } else if (statusResponse.transaction_status === "deny") {
      order.status = "Denied";
    } else if (statusResponse.transaction_status === "cancel" || statusResponse.transaction_status === "expire") {
      order.status = "Cancelled";
    }

    await order.save();
    console.log(`✅ Order ${orderId} updated: isPaid=${order.isPaid}, status=${order.status}`);
    res.status(200).json({ message: "Notification processed successfully" });
  } catch (error) {
    console.error("Midtrans Notification Error:", error.message);
    res.status(500).json({ message: "Failed to process notification" });
  }
};



// === (OPSIONAL) CEK STATUS TRANSAKSI SECARA MANUAL ===
export const checkTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const statusResponse = await snap.transaction.status(orderId);
    res.status(200).json(statusResponse);
  } catch (error) {
    console.error("Midtrans Check Status Error:", error.message);
    res.status(500).json({ message: "Failed to check transaction status" });
  }
};
