import api from '../../utils/api';
import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { Link } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaFilter, 
  FaClock,
  FaUsers,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
  FaUndo
} from "react-icons/fa";
import Swal from 'sweetalert2';

// helper to format YYYY-MM-DD
const formatDate = (d) => d.toISOString().split("T")[0];

// quick filter presets
const quickFilters = {
  "This Week": () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(today.setDate(diff));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
  "Last Week": () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const end = new Date(today.setDate(diff - 1));
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
  "This Month": () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
  "Last Month": () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
  "This Year": () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
  "Last Year": () => {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  },
};

const AttendanceReport = () => {
  const [attendances, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [shifts, setShifts] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 4;
  const { baseURL, shift } = useContext(GlobalContext);

  useEffect(() => {
    fetchEmployeesAttendance();
  }, [baseURL]);

  const fetchEmployeesAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setAttendance(response.data);
    } catch (error) {
      console.error("failed to load attendance ", error);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setShifts("");
    setDates({ startDate: "", endDate: "" });
    setPage(1);
  };

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
      await api.delete(`/attendance/${id}`);
      setAttendance(attendances.filter((att) => att._id !== id));
      Swal.fire({
        title: 'Deleted!',
        text: 'The attendance has been deleted.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });
    } catch (error) {
      console.error("Error deleting attendance:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete attendance.',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  // filter logic
  useEffect(() => {
    let data = [...attendances];

    if (search) {
      data = data.filter(
        (a) =>
          (a.employee?.fullName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (a.employee?.employeeId || "").includes(search)
      );
    }
    
    if (shifts) {
      data = data.filter((a) => a.shift === shifts);
    }
    if (dates.startDate && dates.endDate) {
      data = data.filter(
        (a) => a.date >= dates.startDate && a.date <= dates.endDate
      );
    }

    setFiltered(data);
    setPage(1);
  }, [search, shifts, dates, attendances]);

  // pagination
  const startIdx = (page - 1) * perPage;
  const paginated = filtered.slice(startIdx, startIdx + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // employee short report
  const report = search
    ? (() => {
        const empRecords = filtered.filter(
          (a) =>
            (a.employee?.fullName || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (a.employee?.employeeId || "").includes(search)
        );
        if (empRecords.length === 0) return null;
        const totalDays = empRecords.length;
        const present = empRecords.filter((a) => a.status === "Present").length;
        const absent = empRecords.filter((a) => a.status === "Absent").length;
        const leave = empRecords.filter((a) => a.status === "Leave").length;
        const overtime = empRecords.reduce(
          (sum, a) => sum + a.overtimeHours,
          0
        );
        return { totalDays, present, absent, leave, overtime };
      })()
    : null;

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      Present: "bg-green-100 text-green-800 border-green-200",
      Absent: "bg-red-100 text-red-800 border-red-200",
      Leave: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Half Day": "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaFileAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Attendance Report</h1>
                <p className="text-blue-100 text-sm">View and manage employee attendance records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <FaFilter className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
              >
                <FaUndo className="w-4 h-4" />
                Reset Filters
              </button>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by Employee Name or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClock className="inline w-4 h-4 mr-2 text-blue-600" />
                    Shift
                  </label>
                  <select
                    value={shifts}
                    onChange={(e) => setShifts(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">All Shifts</option>
                      {shift
                      .filter((sh) => sh.status === "active")
                      .map((sh) => (
                        <option key={sh._id} value={sh.shift}>
                          {sh.shift}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dates.startDate}
                    onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dates.endDate}
                    onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quick Filters</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setDates(quickFilters[e.target.value]());
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select Period</option>
                    {Object.keys(quickFilters).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Report */}
        {report && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaChartLine className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Employee Summary</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.totalDays}</div>
                  <div className="text-sm text-blue-700 font-medium">Total Days</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{report.present}</div>
                  <div className="text-sm text-green-700 font-medium">Present</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{report.absent}</div>
                  <div className="text-sm text-red-700 font-medium">Absent</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{report.leave}</div>
                  <div className="text-sm text-yellow-700 font-medium">Leave</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{report.overtime.toFixed(1)}</div>
                  <div className="text-sm text-purple-700 font-medium">Overtime Hrs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-2">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Attendance Records ({filtered.length})
              </h2>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">
                <FaFileAlt className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Records Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or date range.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginated.map((att, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(att.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{att.employee.fullName}</div>
                        <div className="text-sm text-gray-500">{att.employee.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {att.checkIn && (
                            <div>In: {new Date(`1970-01-01T${att.checkIn}:00`).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}</div>
                          )}
                          {att.checkOut && (
                            <div>Out: {new Date(`1970-01-01T${att.checkOut}:00`).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit", 
                              hour12: true,
                            })}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {att.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={att.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Work: {att.workHours}h</div>
                          {att.overtimeHours > 0 && (
                            <div className="text-orange-600">OT: {att.overtimeHours}h</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {att.leaveType || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-32 truncate">
                        {att.remarks || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/editAttendance/${att._id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit attendance"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(att._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete attendance"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIdx + 1} to {Math.min(startIdx + perPage, filtered.length)} of {filtered.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;