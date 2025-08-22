import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";

const AddEmployee = () => {
  const { baseURL } = useContext(GlobalContext);

  const [employee, setEmployee] = useState({
    employeeId: "",
    fullName: "",
    photo: null,
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    joiningDate: "",
    designation: "",
    employmentType: "",
    salaryType: "",
    accountNo: "",
    ifsc: "",
    bankName: "",
    emergencyName: "",
    emergencyPhone: "",
    status: "Active",
  });

  // Auto-generate Employee ID
  useEffect(() => {
    const randomId = "EMP" + Math.floor(1000 + Math.random() * 9000);
    setEmployee((prev) => ({ ...prev, employeeId: randomId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(employee).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(`${baseURL}/employees`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Employee added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding employee.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Employee</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Employee ID */}
        <div>
          <label className="block font-medium mb-1">Employee ID</label>
          <input
            type="text"
            value={employee.employeeId}
            disabled
            className="w-full border rounded-lg p-2 bg-gray-100"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={employee.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block font-medium mb-1">Photo</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={employee.dob}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={employee.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={employee.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            value={employee.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={employee.state}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={employee.pincode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Joining Date */}
        <div>
          <label className="block font-medium mb-1">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={employee.joiningDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Designation Dropdown */}
        <div>
          <label className="block font-medium mb-1">Designation</label>
          <select
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select</option>
            <option>Cashier</option>
            <option>Manager</option>
            <option>Accountant</option>
            <option>Helper</option>
            <option>Supervisor</option>
            <option>Cleaner</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block font-medium mb-1">Employment Type</label>
          <select
            name="employmentType"
            value={employee.employmentType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
        </div>

        {/* Salary Type */}
        <div>
          <label className="block font-medium mb-1">Salary Type</label>
          <select
            name="salaryType"
            value={employee.salaryType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select</option>
            <option>Monthly</option>
            <option>Hourly</option>
            <option>Daily Wage</option>
          </select>
        </div>

        {/* Bank Details */}
        <div>
          <label className="block font-medium mb-1">Bank Account No</label>
          <input
            type="text"
            name="accountNo"
            value={employee.accountNo}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">IFSC</label>
          <input
            type="text"
            name="ifsc"
            value={employee.ifsc}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={employee.bankName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block font-medium mb-1">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyName"
            value={employee.emergencyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Emergency Phone</label>
          <input
            type="text"
            name="emergencyPhone"
            value={employee.emergencyPhone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={employee.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Resigned</option>
          </select>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
