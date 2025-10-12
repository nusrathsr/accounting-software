const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  type: { type: String, enum: ["payment", "receipt"], required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseInvoice" },
salesId: { type: mongoose.Schema.Types.ObjectId, ref: "SalesInvoice" },
  amount: { type: Number, required: true, min: [0, "Amount must be positive"] },
  mode: { type: String, enum: ["cash", "bank", "upi"], default: "cash" },
  date: { type: Date, default: Date.now },
  notes: { 
    type: String, 
    trim: true 
  },
  reference: { 
    type: String, 
    trim: true 
  },
  status: { type: String, enum: ["pending", "completed"], default: "completed" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
