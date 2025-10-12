const mongoose = require("mongoose");


const stockAdjustmentSchema = new mongoose.Schema(
  {
    adjustmentId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    batchNo: {
      type: String,
    },
    expiry: {
      type: Date,
    },
    systemQty: {
      type: Number,
      required: true,
    },
    physicalQty: {
      type: Number,
      required: true,
    },
    difference: {
      type: Number,
      required: true,
    },
    adjustmentType: {
      type: String,
      enum: ["Increase", "Decrease"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    otherReason: {
      type: String,
    },
    remarks: {
      type: String,
    },
    adjustedBy: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("StockAdjustment",  stockAdjustmentSchema);



