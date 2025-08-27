const mongoose = require('mongoose');

// Product Variant schema
const productVariantSchema = new mongoose.Schema({
  variantId: { type: String, unique: true, required: true }, // e.g., VAR-2100
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // reference to main product
  variantName: { type: String, required: true }, // e.g., "Maggie 300gm"
  sizeOrWeight: { type: String, required: true }, // e.g., "300gm"
  quantity: { type: Number, required: true, default: 0 },
  sellingPrice: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  taxInclusive: { type: Boolean, default: false },
  taxPercentage: { type: Number },
  taxType: { type: String },
  image: { type: String }, // optional
}, { timestamps: true });

module.exports = mongoose.model('ProductVariant', productVariantSchema);
