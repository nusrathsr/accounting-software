const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  variantId: { type: String, required: true },
  variantName: { type: String },  
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  lineTotal: { type: Number, required: true },
});

const splitPaymentSchema = new mongoose.Schema({
  method: { type: String, enum: ["cash", "card", "upi", "wallet", "credit"], required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
});

const saleSchema = new mongoose.Schema({
  customerName: { type: String, default: "Walk-in" },
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    paymentMode: { type: String, enum: ["single", "split"], default: "single" },
    singlePaymentMethod: { type: String, enum: ["cash", "card", "upi", "wallet", "credit"], default: "cash" },
    paymentStatus: { type: Boolean, default: false },
    splitPayments: [splitPaymentSchema],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
