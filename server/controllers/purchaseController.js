const PurchaseInvoice = require("../models/PurchaseInvoice");

// Add a purchase
exports.addPurchase = async (req, res) => {
  try {
    const purchase = new PurchaseInvoice(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseInvoice.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a purchase
exports.deletePurchase = async (req, res) => {
  try {
    await PurchaseInvoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

