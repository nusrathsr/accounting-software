const mongoose = require('mongoose');

// product schema
const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true }, // Product ID
  name: { type: String, required: true },                     // Product Name
  brand: { type: String },                                     // Brand
  category: { type: String, required: true },                  // Category
  stockStatus: { type: String, default: 'Active' },           // Status (Active / Cancel)

  sellingPrice: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  expiryDate: { type: Date },

  // Add this field to link variants
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
