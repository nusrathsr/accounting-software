const mongoose = require('mongoose');

const salesInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String},
  number: { type: String },
  date: { type: Date, default: Date.now },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      size: String,
      quantity: Number,
      unitPrice: Number,
      discount: Number,
      tax: Number,
      total: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  totalAmount: Number,
  paymentMode: { type: String, default: "cash" },       
  paymentStatus: { type: Boolean, default: false },
}, { timestamps: true }); 

module.exports = mongoose.model('SalesInvoice', salesInvoiceSchema);
