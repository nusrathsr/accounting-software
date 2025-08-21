const mongoose = require('mongoose');

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: { type: String, required: true, unique: true },
    sellerName: { type: String, required: true, trim: true },
     vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Customer"}, // <-- Add this
    product: { type: String, required: true, trim: true },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, required: true },
    paidAmount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);

