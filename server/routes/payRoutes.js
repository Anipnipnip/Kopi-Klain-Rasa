import express from "express";
import {
  createTransaction,
  handleNotification,
  checkTransactionStatus,
} from "../controllers/midtransController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/notification", handleNotification);
router.get("/status/:orderId", checkTransactionStatus);

export default router;
