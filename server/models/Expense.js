const mongoose = require('mongoose');

// Function to auto-generate Expense ID
const generateExpenseId = () => {
  return 'EXP-' + Date.now().toString().slice(-6); // e.g., EXP-123456
};

const expenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    unique: true,
    default: generateExpenseId
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['Electricity', 'Salary', 'Misc', 'Others',"Rent"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank', 'UPI', 'Card'],
    required: true
  },
  paidTo: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  attachment: {
    url: { type: String },        // Cloudinary or storage URL
    publicId: { type: String }    // For deleting from Cloudinary
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
