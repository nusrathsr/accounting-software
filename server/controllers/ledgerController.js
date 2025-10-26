const Ledger = require("../models/Ledger");

// ✅ Create a new ledger entry
exports.createLedger = async (req, res) => {
  try {
    const ledger = new Ledger(req.body);
    await ledger.save();
    res.status(201).json(ledger);
  } catch (error) {
    res.status(500).json({ message: "Error creating ledger entry", error });
  }
};

// ✅ Get all ledger entries
exports.getLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find().sort({ date: -1, voucher_no: -1 });
    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ledgers", error });
  }
};

// ✅ Get a single ledger entry by ID
exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findById(req.params.id);
    if (!ledger) return res.status(404).json({ message: "Ledger not found" });
    res.status(200).json(ledger);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ledger", error });
  }
};

// ✅ Update a ledger entry
exports.updateLedger = async (req, res) => {
  try {
    const updatedLedger = await Ledger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLedger) return res.status(404).json({ message: "Ledger not found" });
    res.status(200).json(updatedLedger);
  } catch (error) {
    res.status(500).json({ message: "Error updating ledger", error });
  }
};

// ✅ Delete a ledger entry
exports.deleteLedger = async (req, res) => {
  try {
    const deletedLedger = await Ledger.findByIdAndDelete(req.params.id);
    if (!deletedLedger) return res.status(404).json({ message: "Ledger not found" });
    res.status(200).json({ message: "Ledger entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ledger", error });
  }
};
