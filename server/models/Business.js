const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    // 1. Basic Business Info
    businessName: { type: String, required: true },
    businessType: { type: String },
    industryType: { type: String },
    startDate: { type: Date },
    logo: { type: String }, // Cloudinary URL

    // 2. Contact & Address
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },

    // 3. Tax & Compliance
    gstin: { type: String },
    pan: { type: String },

    // 4. Bank / Payment
    bankName: { type: String },
    accountHolder: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    upi: { type: String },

    // 5. Owner / Admin
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerMobile: { type: String },
    password: { type: String },

    // 6. Accounting
    financialYearStart: { type: Date },
    currency: { type: String },
    invoicePrefix: { type: String },
    enableInventory: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
