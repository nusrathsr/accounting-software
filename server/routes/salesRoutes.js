const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

// Sales routes
router.post("/", salesController.addSale);
router.get("/", salesController.getAllSales);
router.delete("/:id", salesController.deleteSale);
router.get("/latest", salesController.getLatestSale);


module.exports = router;
