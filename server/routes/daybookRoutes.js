const express = require('express');
const router = express.Router();
const daybookController = require('../controllers/daybookController');

// Get daybook transactions with filters
router.get('/daybook/transactions', daybookController.getDaybookTransactions);

// Get account names for dropdown
router.get('/daybook/accounts', daybookController.getAccountNames);

// Get voucher types for dropdown
router.get('/daybook/voucher-types', daybookController.getVoucherTypes);

module.exports = router;