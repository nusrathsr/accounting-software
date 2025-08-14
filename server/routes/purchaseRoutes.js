const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Purchase routes
router.post("/", purchaseController.addPurchase);
router.get("/", purchaseController.getAllPurchases);
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
