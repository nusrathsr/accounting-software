// routes/profitLossRoutes.js
const express = require('express');
const router = express.Router();
const profitLossController = require('../controllers/profitLossController');

// Get Profit & Loss statement
router.get('/profit-loss', profitLossController.getProfitLoss);

module.exports = router;