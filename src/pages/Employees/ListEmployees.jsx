import React, { useEffect, useState, useContext } from "react";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaUserPlus,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown
} from "react-icons/fa";

const ListEmployees = () => {
  const { baseURL } = useContext(GlobalContext);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseURL}/employees`);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch employees.',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;
    
    try {
      await axios.delete(`${baseURL}/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      Swal.fire({
        title: 'Deleted!',
        text: 'The employee has been deleted.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete employee.',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  // Apply filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesEmploymentType =
      employmentTypeFilter === "" || emp.employmentType === employmentTypeFilter;

    const matchesDesignation =
      designationFilter === "" || emp.designation === designationFilter;

    return matchesSearch && matchesEmploymentType && matchesDesignation;
  });

  // pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Employee Directory</h1>
                  <p className="text-indigo-100 text-sm">Manage your workforce</p>
                </div>
              </div>
              
              <Link
                to="/addEmployees"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 w-fit"
              >
                <FaUserPlus className="w-4 h-4" />
                Add Employee
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-3">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.status === 'Active').length}
                </p>
              </div>
              <div className="bg-green-500 rounded-lg p-3">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full-time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {employees.filter(emp => emp.employmentType === 'Full-time').length}
                </p>
              </div>
              <div className="bg-purple-500 rounded-lg p-3">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

        
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                <FaFilter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaSearch className="inline w-4 h-4 mr-2 text-blue-600" />
                  Search Employee
                </label>
                <input
                  type="text"
                  placeholder="Name or Employee ID"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={employmentTypeFilter}
                  onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                >   
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                >
                  <option value="">All Designations</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Helper">Helper</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Cleaner">Cleaner</option>
                </select>
              </div>

             
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  paginatedEmployees.map((emp, index) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {emp.photo ? (
                            <img
                              src={emp.photo}
                              alt={emp.fullName}
                              className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                              {emp.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{emp.fullName}</div>
                            <div className="text-sm text-gray-500">{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{emp.email || '--'}</div>
                          <div className="text-gray-500">{emp.phone || '--'}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{emp.designation || '--'}</div>
                          <div className="text-gray-500">{emp.employmentType || '--'}</div>
                          <div className="text-xs text-gray-400">Joined: {formatDate(emp.joiningDate)}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            emp.status === "Active"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : emp.status === "Inactive"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            emp.status === "Active" ? "bg-green-400" :
                            emp.status === "Inactive" ? "bg-yellow-400" : "bg-red-400"
                          }`}></div>
                          {emp.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/editEmployees/${emp._id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Employee"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Employee"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan="5">
                      <div className="text-gray-400">
                        <FaUsers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No employees found</p>
                        <p className="text-sm">Try adjusting your search criteria or add a new employee</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredEmployees.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredEmployees.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <FaChevronLeft className="w-3 h-3" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {totalPages > 0 && [...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                      }
                      
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            page === pageNum
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-indigo-800">
              <p className="font-medium mb-1">Employee Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-indigo-700">
                <li>Use the search bar to quickly find employees by name or ID</li>
                <li>Filter by employment type or designation to narrow results</li>
                <li>Click the edit icon to modify employee details</li>
                <li>Employee status is color-coded for quick identification</li>
                <li>Use pagination controls to navigate through large employee lists</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEmployees;
