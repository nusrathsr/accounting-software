const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// ➕ Add Payment/Receipt
router.post("/", paymentController.addPayment);

// 📄 Get all Payments/Receipts
router.get("/", paymentController.getAllPayments);

// ❌ Delete Payment/Receipt
router.delete("/:id", paymentController.deletePayment);


module.exports = router;
