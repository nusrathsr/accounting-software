const express = require("express");
const router = express.Router();
const stockAdjustmentController =require("../controllers/stockAdjustmentController")



router.post("/",stockAdjustmentController.createStockAdjustment);
router.get("/",stockAdjustmentController.getStockAdjustments)


module.exports = router;
