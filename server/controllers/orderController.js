const Order = require("../models/order");
const Product = require("../models/product");
const { getIO } = require("../socket");

// =========================
// Place Order (COD / Transfer)
const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, customerName, tableNumber, paymentMethod } = req.body;

    if (!items || items.length === 0 || !customerName || !tableNumber) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.json({ success: false, message: "Product not found" });
      amount += product.price * Number(item.quantity);
    }

    let isGuest = false;
    let guestToken = null;

    if (!userId) {
      isGuest = true;
      guestToken = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    const newOrder = await Order.create({
      userId: userId || null,
      isGuest,
      guestToken,
      items,
      amount,
      customerName,
      tableNumber,
      paymentMethod,
      isPaid: false,
      status: paymentMethod === "transfer" ? "Pending" : "Order Placed"
    });

    // 🔥 populate sebelum emit
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.product");

    const io = getIO();
    io.emit("new_order", populatedOrder);

    return res.json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
      orderId: newOrder._id,
      guestToken,
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Get orders by user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "User not found" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentMethod: "cash" }, { isPaid: true }]
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Get all orders (seller/admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentMethod: "cash" }, { isPaid: true }]
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Confirm COD Payment
const confirmCashPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID tidak ada" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order tidak ditemukan" });
    }

    if (order.paymentMethod !== "cash") {
      return res.json({ success: false, message: "Bukan metode cash" });
    }

    order.isPaid = true;
    order.status = "Pesanan sedang dibuat";
    await order.save();

    // 🔥 populate + realtime
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product");

    const io = getIO();
    io.emit("order_updated", populatedOrder);

    res.json({ success: true, message: "Pembayaran cash dikonfirmasi", order: populatedOrder });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Mark as Delivered
const markAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order tidak ditemukan" });
    }

    if (!order.isPaid) {
      return res.json({ success: false, message: "Belum dibayar" });
    }

    order.status = "Completed";
    await order.save();

    // 🔥 populate + realtime
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product");

    const io = getIO();
    io.emit("order_updated", populatedOrder);

    res.json({ success: true, message: "Pesanan selesai", order: populatedOrder });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Get seller revenue / transactions (🔥 TIDAK DIUBAH)
const getTransactions = async (req, res) => {
  try {
    const {
      start,
      end,
      status,
      channel,
      period,
      page = 1,
      limit = 20,
      sort = "desc",
    } = req.query;

    const match = {};

    if (period) {
      const now = new Date();
      let startDate;

      if (period === "daily") startDate = new Date(now.setHours(0, 0, 0, 0));
      else if (period === "weekly") {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        startDate = firstDayOfWeek;
      } else if (period === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      match.createdAt = { $gte: startDate };
    }

    if (start || end) {
      match.createdAt = match.createdAt || {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end) match.createdAt.$lte = new Date(end);
    }

    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      match.status = { $in: statuses };
    }

    if (channel) {
      const channels = channel.split(",").map((c) => c.trim());
      match.paymentMethod = { $in: channels };
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 20, 1);
    const skip = (pageNum - 1) * pageSize;
    const sortOrder = sort === "asc" ? 1 : -1;

    const pipeline = [
      { $match: match },
      {
        $project: {
          _id: 1,
          orderId: { $toString: "$_id" },
          createdAt: 1,
          customerName: 1,
          customerEmail: 1,
          paymentMethod: 1,
          status: 1,
          amount: 1,
          itemsCount: { $size: { $ifNull: ["$items", []] } },
        },
      },
      { $sort: { createdAt: sortOrder } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    const metadata = result[0].metadata[0] || { total: 0, page: pageNum };
    const data = result[0].data || [];

    const totalRevenueAgg = await Order.aggregate([
      { $match: match },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.totalAmount || 0;

    const rows = data.map((r) => ({
      orderId: r.orderId,
      createdAt: r.createdAt,
      transactionType: "Payment",
      channel: r.paymentMethod || "unknown",
      status: r.status,
      amount: r.amount || 0,
      customerName: r.customerName || null,
      customerEmail: r.customerEmail || null,
      itemsCount: r.itemsCount || 0,
    }));

    res.json({
      success: true,
      meta: {
        total: metadata.total,
        page: metadata.page,
        limit: pageSize,
        totalPages: Math.ceil((metadata.total || 0) / pageSize),
        totalRevenue,
      },
      data: rows,
    });
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  confirmCashPayment,
  markAsDelivered,
  getTransactions,
};