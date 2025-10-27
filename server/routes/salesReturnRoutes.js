const express = require('express');
const router = express.Router();
const salesReturnController = require('../controllers/salesReturnController');

// Create a new sales return
router.post('/', salesReturnController.addSalesReturn);

// Get all sales returns (with filters)
router.get('/', salesReturnController.getAllSalesReturns);

// Get sales return statistics
router.get('/stats', salesReturnController.getSalesReturnStats);

// Get sale invoice details for creating return
router.get('/sale/:saleId', salesReturnController.getSaleForReturn);

// Get single sales return by MongoDB ID
router.get('/:id', salesReturnController.getSalesReturnById);

// Get single sales return by Return ID
router.get('/return-id/:returnId', salesReturnController.getSalesReturnByReturnId);

// Update sales return (refund status, etc.)
router.put('/:id', salesReturnController.updateSalesReturn);

// Delete sales return
router.delete('/:id', salesReturnController.deleteSalesReturn);

module.exports = router;