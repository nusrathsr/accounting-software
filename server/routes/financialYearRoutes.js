const express = require('express');
const router = express.Router();
const financialYearController = require("../controllers/finacialYearController"); // fixed typo

// Routes
router.post('/', financialYearController.addFinancialYear);
router.get('/', financialYearController.getFinancialYear);
router.delete('/:id', financialYearController.deleteFinancialYear);

module.exports = router;
