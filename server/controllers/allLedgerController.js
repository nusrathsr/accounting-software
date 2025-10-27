const AllLedger =require('../models/AllLedger')




// Function to generate next ledgerId
async function generateLedgerId() {
  const lastLedger = await AllLedger.findOne().sort({ createdAt: -1 });

  if (!lastLedger || !lastLedger.ledgerId) {
    return "LDG0001";
  }

  const lastIdNumber = parseInt(lastLedger.ledgerId.replace("LDG", "")) + 1;
  return "LDG" + lastIdNumber.toString().padStart(4, "0");
}

// Add New Ledger
exports.addLedger = async (req, res) => {
  try {
    const ledgerId = await generateLedgerId();

    const newLedger = new AllLedger({
      ledgerId,
      accountName: req.body.accountName,
      accountType: req.body.accountType,
      openingBalance: req.body.openingBalance || 0,
      balanceType: req.body.balanceType || "Debit",
      group: req.body.group || "",
      description: req.body.description || "",
    });

    await newLedger.save();
    res.status(201).json({ success: true, message: "Ledger added successfully", data: newLedger });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding ledger", error: error.message });
  }
};

// Get All Ledgers
exports.getLedgers = async (req, res) => {
  try {
    const ledgers = await AllLedger.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: ledgers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch ledgers", error: error.message });
  }
};

// Get One Ledger
exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await AllLedger.findById(req.params.id);
    if (!ledger) return res.status(404).json({ success: false, message: "Ledger not found" });
    res.status(200).json({ success: true, data: ledger });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch ledger", error: error.message });
  }
};

// Update Ledger
exports.updateLedger = async (req, res) => {
  try {
    const updatedLedger = await AllLedger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLedger) return res.status(404).json({ success: false, message: "Ledger not found" });
    res.status(200).json({ success: true, message: "Ledger updated successfully", data: updatedLedger });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update ledger", error: error.message });
  }
};

// Delete Ledger
exports.deleteLedger = async (req, res) => {
  try {
    const deleted = await AllLedger.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Ledger not found" });
    res.status(200).json({ success: true, message: "Ledger deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete ledger", error: error.message });
  }
};
