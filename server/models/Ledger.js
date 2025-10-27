const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  voucher_no: { type: String, required: true },
  date: { type: Date, required: true },
  account_name: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  reference_type: { type: String, default: "Purchase" }, // Purchase / Sale etc.
  reference_id: { type: mongoose.Schema.Types.ObjectId, refPath: "reference_type" },
  narration: { type: String },
});

module.exports = mongoose.model("Ledger", ledgerSchema);
