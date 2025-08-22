const Employee = require("../models/Employees");

// Utility: Generate next employeeId (EMP001, EMP002, ...)
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
  if (!lastEmployee) return "EMP001";

  const lastId = lastEmployee.employeeId;
  const num = parseInt(lastId.replace("EMP", "")) + 1;
  return "EMP" + num.toString().padStart(3, "0");
};

// ➕ Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      joiningDate,
      designation,
      employmentType,
      salaryType,
      accountNo,
      ifsc,
      bankName,
      emergencyName,
      emergencyPhone,
      status,
    } = req.body;

    const newEmployee = new Employee({
      employeeId,
      fullName,
      dateOfBirth: dob, // match schema name
      gender,
      phone,
      email,
      joiningDate,
      designation,
      employmentType,
      salaryType,
      status,
      photo: req.file ? req.file.path : null,
      address: {
        street: address,
        city,
        state,
        pincode,
      },
      bankDetails: {
        accountNumber: accountNo,
        ifsc,
        bankName,
      },
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
      },
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error("Add Employee Error:", err);
    res.status(500).json({ error: "Failed to add employee" });
  }
};

// 📜 Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// 🔍 Get Single Employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

// ✏️ Edit Employee
exports.editEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.path; // update photo if new one uploaded
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
};

// ❌ Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};
