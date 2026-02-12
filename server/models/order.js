import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  customerName: { type: String, required: true },
  tableNumber: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  status: { type: String, default: "Order Placed" },
  paymentMethod: { type: String, default: "cash" },
  isPaid: { type: Boolean, default: false },
  orderId: { type: String }, // Tambahkan ini untuk menyimpan orderId Midtrans
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
