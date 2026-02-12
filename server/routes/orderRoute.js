import express from 'express';
import authUser from '../middlewares/authUser.js';
import {confirmCashPayment, getAllOrders, getTransactions, getUserOrders, placeOrder } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/pay', authUser, placeOrder);   // bikin order (COD)
orderRouter.get('/user', authUser, getUserOrders);   // ambil order user
orderRouter.get('/seller', authSeller, getAllOrders) // ambil semua order
orderRouter.post("/confirm-cash", authSeller, confirmCashPayment);
orderRouter.get("/transactions", getTransactions);
orderRouter.post("/place", authUser, placeOrder);




export default orderRouter;
