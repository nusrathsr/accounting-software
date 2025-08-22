import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    status: "",
  });

  const [preview, setPreview] = useState(null);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/employees/${id}`);
        setEmployee(data);
        if (data.photo) setPreview(data.photo);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    fetchEmployee();
  }, [id, baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEmployee({ ...employee, photo: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(employee).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.put(`${baseURL}/employees/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (error) {
      console.error(error);
      alert("Error updating employee.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Employee</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Employee ID (non-editable) */}
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

        {/* Photo Upload + Preview */}
        <div>
          <label className="block font-medium mb-1">Photo</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Employee Preview"
              className="mt-2 w-24 h-24 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* DOB */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={employee.dob ? employee.dob.split("T")[0] : ""}
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
            value={employee.joiningDate ? employee.joiningDate.split("T")[0] : ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Designation */}
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Update Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
