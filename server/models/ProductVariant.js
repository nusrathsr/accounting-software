const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    variantId: { type: String, unique: true, sparse: true },

    // Reference to the main product
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },

    // Variant details
    variantName: { type: String, required: true, trim: true },   // e.g., "Maggie 300gm"
    sizeOrWeight: { type: String, trim: true },                  // e.g., "300gm"

    // Stock and pricing
    quantity: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    expiryDate: { type: Date },                                  // Added for stock expiry tracking

    // Tax info
    taxInclusive: { type: Boolean, default: false },
    taxPercentage: { type: Number, default: 0 },
    taxType: { type: String, trim: true },

    // Media
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductVariant', productVariantSchema);
