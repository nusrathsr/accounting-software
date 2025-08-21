const mongoose = require('mongoose');

const salesInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      size: String,
      quantity: Number,
      unitPrice: Number,
      tax: Number,
      total: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  totalAmount: Number
}, { timestamps: true }); 

module.exports = mongoose.model('SalesInvoice', salesInvoiceSchema);
