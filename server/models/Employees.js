const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true, 
    },
    fullName: {
      type: String,
      required: true,
    },
    photo: {
      type: String, 
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, 
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    designation: {
      type: String,
      enum: ["Cashier", "Manager", "Accountant", "Helper", "Other"],
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
    },
    salaryType: {
      type: String,
      enum: ["Monthly", "Hourly", "Daily Wage"],
    },
    bankDetails: {
      accountNumber: { type: String },
      ifsc: { type: String },
      bankName: { type: String },
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Resigned"],
      default:"Active"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
