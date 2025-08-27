const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    checkIn: {
      type: String, // storing as "HH:mm"
      required: false,
    },
    checkOut: {
      type: String, // storing as "HH:mm"
      required: false,
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      required: true,
    },
    workHours: {
      type: Number,
      default: 0,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Leave"],
      default: "Present",
    },
    leaveType: {
      type: String,
      enum: ["Paid Leave", "Unpaid Leave", "Sick Leave", "Casual Leave", ""],
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
