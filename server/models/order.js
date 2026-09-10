const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, ref: "user" },
  isGuest: { type: Boolean, default: false },
  guestToken: { type: String },

  customerName: String,
  tableNumber: String,

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
    },
  ],

  amount: Number,
  status: { type: String, default: "Order Placed" },
  paymentMethod: String,
  isPaid: Boolean,
  orderId: String,
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = Order;