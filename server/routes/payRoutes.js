const express = require("express");

const {
  createTransaction,
  handleNotification,
  checkTransactionStatus,
} = require("../controllers/midtransController");

const router = express.Router();

router.post("/create", createTransaction);
router.post("/notification", handleNotification);
router.get("/status/:orderId", checkTransactionStatus);

module.exports = router;