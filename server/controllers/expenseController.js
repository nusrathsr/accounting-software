const Expense = require('../models/Expense')
const cloudinary = require('../utils/cloudinary'); // Your Cloudinary config

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    let attachmentData = {};
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "expenses" });
      attachmentData = { url: uploadRes.secure_url, publicId: uploadRes.public_id };
    }

    const expense = new Expense({
      ...req.body,
      attachment: attachmentData
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
