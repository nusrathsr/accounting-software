const SalesInvoice = require("../models/SalesInvoice");

// Add a sale
exports.addSale = async (req, res) => {
  try {
    const sale = new SalesInvoice(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await SalesInvoice.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  try {
    await SalesInvoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get latest sale
exports.getLatestSale = async (req, res) => {
  try {
    const latestSale = await SalesInvoice.findOne().sort({ createdAt: -1 }); // Sort by newest first
    if (!latestSale) {
      return res.status(404).json({ message: "No sales found" });
    }
    res.json(latestSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

