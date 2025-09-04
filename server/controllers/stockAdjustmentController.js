const StockAdjustment = require("../models/StockAdjustment.js")
const Product = require("../models/Product")
const ProductVariant = require('../models/ProductVariant.js')




// Create Stock Adjustment
exports.createStockAdjustment = async (req, res) => {
  try {
    const {
      adjustmentId,
      date,
      product,
      variant,
      batchNo,
      expiry,
      systemQty,
      physicalQty,
      difference,
      adjustmentType,
      reason,
      otherReason,
      remarks,
      adjustedBy,
      approvedBy,
    } = req.body;

    // Validate required fields
    if (!product || !variant) {
      return res
        .status(400)
        .json({ message: "Product and variant are required" });
    }

    // Find product
    const selectedProduct = await Product.findById(product);
    if (!selectedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find variant
    const selectedVariant = await ProductVariant.findById(variant);
    if (!selectedVariant) {
      return res.status(404).json({ message: "Product Variant not found" });
    }

    // ✅ Update variant quantity
    if (adjustmentType === "Increase") {
      selectedVariant.quantity += Math.abs(Number(difference));
    } else if (adjustmentType === "Decrease") {
      selectedVariant.quantity -= Math.abs(Number(difference));
    }

    await selectedVariant.save();

    // ✅ Save adjustment record
    const newAdjustment = new StockAdjustment({
      adjustmentId,
      date,
      product,
      variant,
      batchNo,
      expiry,
      systemQty,
      physicalQty,
      difference,
      adjustmentType,
      reason,
      otherReason,
      remarks,
      adjustedBy,
      approvedBy,
    });

    await newAdjustment.save();
    res.status(201).json(newAdjustment);
} catch (error) {
  console.error("❌ Error creating stock adjustment:", error.message, error.stack);
  res.status(500).json({ message: error.message });
}

};


exports.getStockAdjustments = async (req, res) => {
  try {
    const adjustments = await StockAdjustment.find()
      .populate("product", "productName")   // only if product is a ref
      .populate("variant", "variantName");  // only if variant is a ref

    res.status(200).json(adjustments);
  } catch (err) {
    console.error("Error in getStockAdjustments:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};