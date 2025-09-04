const Leave = require("../models/Leave");

// 📌 Create a new leave
exports.createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    console.error("Error creating leave:", error);
    res.status(500).json({ message: "Failed to create leave" });
  }
};

// 📌 Get all leaves
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "fullName email") // populate employee details
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// 📌 Get single leave by ID
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate("employeeId", "fullName email");
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (error) {
    console.error("Error fetching leave:", error);
    res.status(500).json({ message: "Failed to fetch leave" });
  }
};

// 📌 Update leave
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ message: "Failed to update leave" });
  }
};

// 📌 Delete leave
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave:", error);
    res.status(500).json({ message: "Failed to delete leave" });
  }
};
