const Attendance = require("../models/EmployeeAttendace");
const Employee = require("../models/Employees");

// 📌 Get all attendance (just raw data, no pagination/filter)
exports.getAttendances = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "fullName employeeId")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Get a single attendance by its record ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params; // attendance record _id

    const attendance = await Attendance.findById(id)
      .populate("employee", "fullName employeeId");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 📌 Create/mark attendance
exports.createAttendance = async (req, res) => {
  try {
    const {
      date,
      employeeId,
      checkIn,
      checkOut,
      shift,
      workHours,
      overtimeHours,
      status,
      leaveType,
      remarks,
    } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const attendance = new Attendance({
      date,
      employee: employeeId,
      checkIn,
      checkOut,
      shift,
      workHours,
      overtimeHours,
      status,
      leaveType,
      remarks,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Attendance.findByIdAndUpdate(id, req.body, { new: true })
      .populate("employee", "fullName employeeId");

    if (!updated) return res.status(404).json({ message: "Attendance not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Attendance not found" });

    res.json({ message: "Attendance deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
