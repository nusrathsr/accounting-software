const Shift = require("../models/Shift");

// 👉 Create a new shift
exports.createShift = async (req, res) => {
  try {
    const { shift, customShift, startTime, endTime, duration, status } = req.body;

    if (!shift || !startTime || !endTime) {
      return res.status(400).json({ message: "Shift, start time and end time are required" });
    }

    const newShift = new Shift({
      shift,
      customShift: shift === "Custom" ? customShift : "",
      startTime,
      endTime,
      duration,
      status,
    });

    await newShift.save();
    res.status(201).json({ message: "Shift created successfully", shift: newShift });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 👉 Get all shifts
exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ createdAt: -1 });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 👉 Get a single shift by ID
exports.getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 👉 Update shift
exports.updateShift = async (req, res) => {
  try {
    const { shift, customShift, startTime, endTime, duration, status } = req.body;

    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      {
        shift,
        customShift: shift === "Custom" ? customShift : "",
        startTime,
        endTime,
        duration,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedShift) return res.status(404).json({ message: "Shift not found" });

    res.json({ message: "Shift updated successfully", shift: updatedShift });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 👉 Delete shift
exports.deleteShift = async (req, res) => {
  try {
    const deleted = await Shift.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Shift not found" });
    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
