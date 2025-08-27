const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const multer = require('multer');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/latest', variantController.getLatestVariantId); // Get next variant ID
router.post('/', upload.single('image'), variantController.addProductVariant); // Add variant
router.get('/:id', variantController.getProductVariants); // Get all variants of a product

module.exports = router;
