const express = require('express');

const authUser = require('../middlewares/authUser');
const authSeller = require('../middlewares/authSeller');
const authGuestUser = require('../middlewares/authGuestUser');

const {
  confirmCashPayment,
  getAllOrders,
  getTransactions,
  getUserOrders,
  placeOrder,
  markAsDelivered
} = require('../controllers/orderController');

const orderRouter = express.Router();

orderRouter.post('/pay', authUser, placeOrder);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post("/confirm-cash", authSeller, confirmCashPayment);

// 🔥 NEW
orderRouter.post("/mark-delivered", authSeller, markAsDelivered);

orderRouter.get("/transactions", getTransactions);
orderRouter.post("/place", authGuestUser, placeOrder);

module.exports = orderRouter;