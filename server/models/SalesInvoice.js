const mongoose = require("mongoose");

const salesInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String },
    number: { type: String },
    date: { type: Date, default: Date.now },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
        variantName:String,
        name: String,
        sizeOrWeight: String,
        quantity: Number,
        unitPrice: Number,
        discount: Number,
        tax: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    totalAmount: Number,

    // ✅ Payments array for split payment support
    payments: [
      {
        mode: {
          type: String,
          enum: ["cash", "upi", "card", "bank"],
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],

    // Computed fields
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },

    // ✅ String status to support split payments
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

// Auto-calc before save
salesInvoiceSchema.pre("save", function (next) {
  const totalPaid = (this.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  this.paidAmount = totalPaid;
  this.balanceAmount = this.totalAmount - totalPaid;

  if (totalPaid === 0) {
    this.paymentStatus = "unpaid";
  } else if (totalPaid < this.totalAmount) {
    this.paymentStatus = "partial";
  } else {
    this.paymentStatus = "paid";
  }

  next();
});

module.exports = mongoose.model("SalesInvoice", salesInvoiceSchema);
