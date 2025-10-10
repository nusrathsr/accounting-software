const Unit = require("../models/Unit");

// ➕ Add Unit
exports.addUnit = async (req, res) => {
  try {
    const { unit, notes } = req.body;
    const existing = await Unit.findOne({ unit });
    if (existing) {
      return res.status(400).json({ message: "Unit already exists" });
    }

    const newUnit = new Unit({ unit, notes });
    await newUnit.save();
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ message: "Error adding unit", error: error.message });
  }
};

// 📜 Get All Units
exports.getUnits = async (req, res) => {
  try {
    const units = await Unit.find().sort({ createdAt: -1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: "Error fetching units", error: error.message });
  }
};

// 🔁 Disable/Enable Unit
exports.disableUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findById(id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    unit.isActive = !unit.isActive;
    await unit.save();

    res.json({
      message: `Unit ${unit.isActive ? "enabled" : "disabled"} successfully`,
      unit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating unit", error: error.message });
  }
};

// 🗑 Permanently Delete (optional)
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByIdAndDelete(id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting unit", error: error.message });
  }
};
