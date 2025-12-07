const mongoose = require("mongoose");

const AccountProfileSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["Customer", "Supplier", "Expense", "Income", "Asset", "Liability"],
      required: true,
    },

    // Contact Info
    contact: {
      contactPerson: { type: String },
      mobileNo: { type: String },
      email: { type: String },
    },

    // Address
    address: {
      building: { type: String },
      street: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    gstNo: {
      type: String,
      default: "",
    },

    openingBalance: {
      type: Number,
      default: 0,
    },

    balanceType: {
      type: String,
      enum: ["Debit", "Credit"],
      default: "Debit",
    },

    outstandingBalance: {
      type: Number,
      default: 0,
    },

    lastTransactionDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountProfile", AccountProfileSchema);
