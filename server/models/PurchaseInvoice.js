const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: {
      type: String,
      required: true,
      unique: true, // Matches your auto-generated PO number in frontend
    },
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number, // percentage
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
