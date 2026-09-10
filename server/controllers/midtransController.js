const midtransClient = require("midtrans-client");
const Order = require("../models/order");
const { getIO } = require("../socket");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const { orderId, amount, customer } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer?.name || "Customer",
        email: customer?.email || "example@mail.com",
      },
      credit_card: { secure: true },
    };

    const transaction = await snap.createTransaction(parameter);

    await Order.findByIdAndUpdate(orderId, {
      orderId: parameter.transaction_details.order_id,
    });

    res.status(200).json({
      message: "Snap token created successfully",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans Create Transaction Error:", error.message);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

// HANDLE NOTIFICATION
const handleNotification = async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔥 STATUS FIX (konsisten)
    if (
      statusResponse.transaction_status === "capture" ||
      statusResponse.transaction_status === "settlement"
    ) {
      order.isPaid = true;
      order.status = "Pesanan sedang dibuat";
    } else if (statusResponse.transaction_status === "pending") {
      order.status = "Pending";
    } else if (statusResponse.transaction_status === "deny") {
      order.status = "Denied";
    } else if (
      statusResponse.transaction_status === "cancel" ||
      statusResponse.transaction_status === "expire"
    ) {
      order.status = "Cancelled";
    }

    await order.save();

    // 🔥 POPULATE SEBELUM EMIT
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product");

    const io = getIO();
    io.emit("order_updated", populatedOrder);

    console.log(`✅ Order ${orderId} updated`);
    res.status(200).json({ message: "Notification processed successfully" });

  } catch (error) {
    console.error("Midtrans Notification Error:", error.message);
    res.status(500).json({ message: "Failed to process notification" });
  }
};

// CHECK STATUS
const checkTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const statusResponse = await snap.transaction.status(orderId);
    res.status(200).json(statusResponse);
  } catch (error) {
    console.error("Midtrans Check Status Error:", error.message);
    res.status(500).json({ message: "Failed to check transaction status" });
  }
};

module.exports = {
  createTransaction,
  handleNotification,
  checkTransactionStatus,
};