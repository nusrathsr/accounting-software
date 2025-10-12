const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Evening", "Night", "Custom"], // allowed types
    },
    customShift: {
      type: String,
      trim: true,
      default: "",
    },
    startTime: {
      type: String, // storing as HH:mm (e.g. "09:00")
      required: true,
    },
    endTime: {
      type: String, // storing as HH:mm (e.g. "17:00")
      required: true,
    },
    duration: {
      type: Number, // in hours (e.g. 8.50)
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
