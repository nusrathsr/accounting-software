const mongoose = require("mongoose");

const AllLedgerSchema = new mongoose.Schema(
  {
    ledgerId: {
      type: String,
      unique: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    accountType: {
      type: String,
      required: true,
      enum: ["Asset", "Liability", "Income", "Expense", "Equity"],
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

    group: {
      type: String,
      default: "",
      enum: [
        "",
        "Current Asset",
        "Fixed Asset",
        "Supplier",
        "Customer",
        "Indirect Expense",
        "Direct Expense",
        "Bank",
        "Capital",
      ],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AllLedger", AllLedgerSchema);
