const express = require('express');
const router = express.Router();
const saleController =require('../controllers/saleController.js')


router.post("/",saleController.createSale);     // ➡️ POST /api/sales
router.get("/",saleController.getSales);        // ➡️ GET /api/sales
router.get("/:id",saleController.getSaleById);  // ➡️ GET /api/sales/:id

module.exports = router;