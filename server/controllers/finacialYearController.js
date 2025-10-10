const FinancialYear = require("../models/FinancialYear.js");

// Add a new financial year
exports.addFinancialYear = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const newFinancialYear = new FinancialYear({ name, startDate, endDate });
    await newFinancialYear.save();
    res.status(201).json(newFinancialYear);
  } catch (error) {
    res.status(500).json({ message: "Error creating financial year", error });
  }
};

// Get all financial years, sorted by creation date descending
exports.getFinancialYear = async (req, res) => {
  try {
    const financialYears = await FinancialYear.find().sort({ createdAt: -1 });
    res.status(200).json(financialYears);
  } catch (error) {
    res.status(500).json({ message: "Error fetching financial years", error });
  }
};

// Delete a financial year by ID
exports.deleteFinancialYear = async (req, res) => {
  try {
    const deletedFinancialYear = await FinancialYear.findByIdAndDelete(req.params.id);
    if (!deletedFinancialYear) {
      return res.status(404).json({ message: "Financial year not found" });
    }
    res.json({ message: "Financial year deleted successfully", deletedFinancialYear });
  } catch (error) {
    console.error("Error deleting financial year:", error);
    res.status(500).json({ message: "Server error while deleting financial year", error });
  }
};
