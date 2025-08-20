const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Purchase routes
router.post("/", purchaseController.addPurchase);
router.get("/", purchaseController.getAllPurchases);
router.put("/:id", purchaseController.updatePurchase);
router.delete("/:id", purchaseController.deletePurchase);
router.get("/dues", purchaseController.getPurchaseDues);

module.exports = router;
