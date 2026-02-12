import Order from "../models/order.js";
import Product from "../models/product.js";

// =========================
// Place Order (COD)

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, customerName, tableNumber, paymentMethod } = req.body;

    if (!userId || !items || items.length === 0 || !customerName || !tableNumber) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += product.price * Number(item.quantity);
    }

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      customerName,
      tableNumber,
      paymentMethod,
      status: paymentMethod === "transfer" ? "Pending" : "Order Placed", // Untuk transfer, status awal Pending
      isPaid: false,
      isGuest: false,
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
      orderId: newOrder._id.toString(), // Return _id sebagai orderId untuk Midtrans
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Get orders by user
// =========================
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "User not found" });
    }

    const orders = await Order.find({ userId, $or: [{ paymentMethod: "cash" }, { isPaid: true }] })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Get all orders (seller/admin)
// =========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ paymentMethod: "cash" }, { isPaid: true }] })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// Confirm COD Payment
// =========================
export const confirmCashPayment = async (req, res) => {
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
    order.status = "Completed";
    await order.save();

    res.json({ success: true, message: "Pembayaran cash dikonfirmasi", order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Get seller revenue
// =========================
// controllers/orderController.js

export const getTransactions = async (req, res) => {
  try {
    const {
      start,
      end,
      status,
      channel,
      period, // 🔥 tambahan: daily / weekly / monthly
      page = 1,
      limit = 20,
      sort = "desc",
    } = req.query;

    const match = {};

    // 🔹 1. Hitung rentang waktu berdasarkan "period"
    if (period) {
      const now = new Date();
      let startDate;

      if (period === "daily") {
        // Awal hari ini
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (period === "weekly") {
        // Awal minggu (Minggu)
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        startDate = firstDayOfWeek;
      } else if (period === "monthly") {
        // Awal bulan ini
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      match.createdAt = { $gte: startDate };
    }

    // 🔹 2. Kalau ada start & end manual, override
    if (start || end) {
      match.createdAt = match.createdAt || {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end) match.createdAt.$lte = new Date(end);
    }

    // 🔹 3. Filter status (case-insensitive)
    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      match.status = { $in: statuses };
    }

    // 🔹 4. Filter channel/payment method
    if (channel) {
      const channels = channel.split(",").map((c) => c.trim());
      match.paymentMethod = { $in: channels };
    }

    // Pagination & sorting
    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 20, 1);
    const skip = (pageNum - 1) * pageSize;
    const sortOrder = sort === "asc" ? 1 : -1;

    // 🔹 5. Aggregate pipeline
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

    // 🔹 6. Hitung total pendapatan
    const totalRevenueAgg = await Order.aggregate([
      { $match: match },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalAmount || 0;

    // 🔹 7. Format data untuk frontend
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

    // 🔹 8. Response
    res.json({
      success: true,
      meta: {
        total: metadata.total,
        page: metadata.page,
        limit: pageSize,
        totalPages: Math.ceil((metadata.total || 0) / pageSize),
        totalRevenue, // 🔥 tambahan
      },
      data: rows,
    });
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
