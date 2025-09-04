// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { GlobalContext } from "../../context/GlobalContext";
// import Swal from "sweetalert2";

// const LeaveRecord = () => {
//   const { baseURL } = useContext(GlobalContext);
//   const [leaves, setLeaves] = useState([]);
//   const [filters, setFilters] = useState({
//     employee: "",
//     startDate: "",
//     endDate: "",
//     leaveType: "",
//   });

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 3;

//   // Fetch all leaves
//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/leaves`);
//       setLeaves(res.data);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   // Delete leave with SweetAlert
//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This leave record will be deleted!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`${baseURL}/leaves/${id}`);
//           setLeaves(leaves.filter((leave) => leave._id !== id));
//           Swal.fire("Deleted!", "Leave record has been deleted.", "success");
//         } catch (err) {
//           console.error("Error deleting leave:", err);
//           Swal.fire("Error!", "Something went wrong.", "error");
//         }
//       }
//     });
//   };

//   // Apply filters
//   const filteredLeaves = leaves.filter((leave) => {
//     const employeeMatch = leave.employeeId?.fullName
//       ?.toLowerCase()
//       .includes(filters.employee.toLowerCase());

//     const leaveTypeMatch = filters.leaveType
//       ? leave.leaveType === filters.leaveType
//       : true;

//     const startDateMatch = filters.startDate
//       ? new Date(leave.startDate) >= new Date(filters.startDate)
//       : true;

//     const endDateMatch = filters.endDate
//       ? new Date(leave.endDate) <= new Date(filters.endDate)
//       : true;

//     return employeeMatch && leaveTypeMatch && startDateMatch && endDateMatch;
//   });

//   // Pagination logic
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

//   return (
//     <div className="p-4 max-w-6xl mx-auto bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Leave List</h2>

//       {/* 🔎 Filters Section */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search by Employee"
//           value={filters.employee}
//           onChange={(e) =>
//             setFilters({ ...filters, employee: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           value={filters.startDate}
//           onChange={(e) =>
//             setFilters({ ...filters, startDate: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           value={filters.endDate}
//           onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <select
//           value={filters.leaveType}
//           onChange={(e) =>
//             setFilters({ ...filters, leaveType: e.target.value })
//           }
//           className="border p-2 rounded"
//         >
//           <option value="">All Types</option>
//           <option value="Casual">Casual</option>
//           <option value="Sick">Sick</option>
//           <option value="Paid">Paid</option>
//           <option value="Unpaid">Unpaid</option>
//         </select>
//       </div>

//       {/* Table */}
//       <table className="w-full border text-sm">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2 border">Employee</th>
//             <th className="p-2 border">Type</th>
//             <th className="p-2 border">Start</th>
//             <th className="p-2 border">End</th>
//             <th className="p-2 border">Days</th>
//             <th className="p-2 border">Status</th>
//             <th className="p-2 border">Reason</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentLeaves.length > 0 ? (
//             currentLeaves.map((leave) => (
//               <tr key={leave._id} className="text-center">
//                 <td className="p-2 border">
//                   {leave.employeeId?.fullName || "N/A"}
//                 </td>
//                 <td className="p-2 border">{leave.leaveType}</td>
//                 <td className="p-2 border">
//                   {new Date(leave.startDate).toLocaleDateString()}
//                 </td>
//                 <td className="p-2 border">
//                   {new Date(leave.endDate).toLocaleDateString()}
//                 </td>
//                 <td className="p-2 border">{leave.totalDays}</td>
//                 <td
//                   className={`p-2 border font-semibold ${
//                     leave.status === "Approved"
//                       ? "text-green-600"
//                       : leave.status === "Rejected"
//                       ? "text-red-600"
//                       : "text-yellow-600"
//                   }`}
//                 >
//                   {leave.status}
//                 </td>
//                 <td className="p-2 border">{leave.reason || "-"}</td>
//                 <td className="p-2 border space-x-2">
//                   <Link
//                     to={`/editLeave/${leave._id}`}
//                     className="bg-blue-500 text-white px-2 py-1 rounded"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(leave._id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="p-3 text-center">
//                 No leave records found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-4 space-x-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveRecord;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from "sweetalert2";
import {
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaCheck,
  FaClock,
  FaArrowLeft,
  FaList,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUndo
} from "react-icons/fa";

const LeaveRecord = () => {
  const { baseURL } = useContext(GlobalContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employee: "",
    startDate: "",
    endDate: "",
    leaveType: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${baseURL}/leaves`);
      setLeaves(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to load leave records.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      employee: "",
      startDate: "",
      endDate: "",
      leaveType: "",
    });
    setCurrentPage(1);
  };

  // Delete leave with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This leave record will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/leaves/${id}`);
          setLeaves(leaves.filter((leave) => leave._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Leave record has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6"
          });
        } catch (err) {
          console.error("Error deleting leave:", err);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        }
      }
    });
  };

  // Apply filters
  const filteredLeaves = leaves.filter((leave) => {
    const employeeMatch = leave.employeeId?.fullName
      ?.toLowerCase()
      .includes(filters.employee.toLowerCase());

    const leaveTypeMatch = filters.leaveType
      ? leave.leaveType === filters.leaveType
      : true;

    const startDateMatch = filters.startDate
      ? new Date(leave.startDate) >= new Date(filters.startDate)
      : true;

    const endDateMatch = filters.endDate
      ? new Date(leave.endDate) <= new Date(filters.endDate)
      : true;

    return employeeMatch && leaveTypeMatch && startDateMatch && endDateMatch;
  });

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "Rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-700">Loading leave records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Leave Records</h1>
                <p className="text-blue-100 text-sm">Manage and view all leave entries</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaSearch className="inline w-4 h-4 mr-2 text-blue-600" />
                  Search Employee
                </label>
                <input
                  type="text"
                  placeholder="Search by employee name"
                  value={filters.employee}
                  onChange={(e) =>
                    setFilters({ ...filters, employee: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                  Start Date From
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                  End Date To
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaClipboardList className="inline w-4 h-4 mr-2 text-blue-600" />
                  Leave Type
                </label>
                <select
                  value={filters.leaveType}
                  onChange={(e) =>
                    setFilters({ ...filters, leaveType: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">All Types</option>
                  <option value="Casual">Casual</option>
                  <option value="Sick">Sick</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaClipboardList className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Leave Records</h2>
              </div>
              <div className="text-sm text-gray-600">
                Total: {filteredLeaves.length} records
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaUser className="inline w-4 h-4 mr-2" />
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaClipboardList className="inline w-4 h-4 mr-2" />
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaClock className="inline w-4 h-4 mr-2" />
                      Days
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <FaCheck className="inline w-4 h-4 mr-2" />
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLeaves.length > 0 ? (
                    currentLeaves.map((leave, index) => (
                      <tr key={leave._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {leave.employeeId?.fullName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-100">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-100">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100">
                          <span className="font-semibold text-gray-900">{leave.totalDays}</span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-100 max-w-xs">
                          <span className="truncate block">{leave.reason || "-"}</span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/editLeave/${leave._id}`}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-md"
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(leave._id)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-all duration-200 hover:shadow-md"
                            >
                              <FaTrash className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaClipboardList className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-lg">No leave records found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your filters or add a new leave record</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Leave Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Use filters to quickly find specific leave records</li>
                <li>Click Edit to modify leave details and approval status</li>
                <li>Status colors: Green (Approved), Red (Rejected), Yellow (Pending)</li>
                <li>Total days are automatically calculated based on date range</li>
                <li>Delete actions require confirmation to prevent accidental removal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRecord;