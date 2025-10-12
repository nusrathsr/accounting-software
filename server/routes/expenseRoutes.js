const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const upload = require('../middleware/multer');

router.post('/', upload.single('attachment'), expenseController.addExpense);
router.get('/', expenseController.getExpenses);
router.delete('/:id',expenseController.deleteExpense)
module.exports = router;
