const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');

const { getProductVariants } = productController;

// Routes
router.post('/', productController.addProduct);          // Add product
router.put('/:id', productController.editProduct);      // Edit product
router.delete('/:id', productController.deleteProduct); // Delete product
router.get('/:id', productController.getProductById);   // Get product by ID
router.get('/', productController.getAllProducts);      // Get all products

router.get("/:productId/variants", productController.getProductVariants);


module.exports = router;
