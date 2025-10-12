const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unit: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Unit", unitSchema);
