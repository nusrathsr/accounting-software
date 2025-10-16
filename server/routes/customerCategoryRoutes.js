const express = require("express");
const router = express.Router();
const { addCustomerCategory } = require("../controllers/customerCategoryController");
const { getCustomerCategories } = require("../controllers/customerCategoryController");

// POST - Add customer category
router.post("/", addCustomerCategory);
router.get("/", getCustomerCategories);

module.exports = router;
