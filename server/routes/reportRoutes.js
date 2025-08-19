const express =require ('express')
const router =express.Router()
const reportController =require('../controllers/reportController');

router.get('/sales',reportController.getSalesReport);
router.get('/purchase',reportController.getPurchaseReport)
router.get('/stock',reportController.getStockReport)
router.get('/expense',reportController.getExpenseReport)


module.exports = router;