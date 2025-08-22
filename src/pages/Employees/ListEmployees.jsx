import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListEmployees = () => {
  const { baseURL } = useContext(GlobalContext);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/employees`);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${baseURL}/employees/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
        alert("Employee deleted successfully!");
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee.");
      }
    }
  };

  // Apply filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" || emp.status === statusFilter;

    const matchesDesignation =
      designationFilter === "" || emp.designation === designationFilter;

    return matchesSearch && matchesStatus && matchesDesignation;
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <Link
          to="/addEmployees"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Employee ID"
          className="border px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Resigned">Resigned</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
        >
          <option value="">All Designations</option>
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Accountant">Accountant</option>
          <option value="Helper">Helper</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Employee ID</th>
              <th className="border p-2 text-left">Full Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Designation</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="border p-2">{emp.employeeId}</td>
                  <td className="border p-2 flex items-center gap-3">
                    {emp.photo ? (
                      <img
                        src={emp.photo}
                        alt={emp.fullName}
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm">
                        ?
                      </div>
                    )}
                    <span>{emp.fullName}</span>
                  </td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.phone}</td>
                  <td className="border p-2">{emp.designation}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : emp.status === "Inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/editEmployees/${emp._id}`}
                      className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center"
                    >
                      <FaEdit className="mr-1" /> 
                    </Link>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center"
                    >
                      <FaTrash className="mr-1" /> 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-4 text-center" colSpan="7">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEmployees;
