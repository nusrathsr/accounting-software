const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Assuming you already have an Employee model
      required: false, // optional if HR types manually
    },
    employeeName: {
      type: String, // For cases when HR types name instead of selecting
      required: false,
      trim: true,
    },
    leaveType: {
      type: String,
      enum: ["Casual", "Sick", "Paid", "Unpaid"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved", // since HR adds directly
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);
