// import React, { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const ShiftList = () => {
//   const { baseURL } = useContext(GlobalContext);
//   const [shifts, setShifts] = useState([]);

//   // Fetch all shifts
//   useEffect(() => {
//     const fetchShifts = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/shift`);
//         console.log(res);
//         setShifts(res.data);
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Failed",
//           text: error.response?.data?.message || "Unable to fetch shifts",
//         });
//       }
//     };
//     fetchShifts();
//   }, [baseURL]);

//   // Delete shift
//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will permanently delete the shift",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`${baseURL}/shift/${id}`);
//           setShifts((prev) => prev.filter((s) => s._id !== id));
//           Swal.fire("Deleted!", "Shift has been deleted.", "success");
//         } catch (error) {
//           Swal.fire({
//             icon: "error",
//             title: "Failed",
//             text: error.response?.data?.message || "Something went wrong",
//           });
//         }
//       }
//     });
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">Shift List</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 shadow rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border">#</th>
//               <th className="px-4 py-2 border">Shift</th>
//               <th className="px-4 py-2 border">Custom Shift</th>
//               <th className="px-4 py-2 border">Start Time</th>
//               <th className="px-4 py-2 border">End Time</th>
//               <th className="px-4 py-2 border">Duration (hrs)</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {shifts.length > 0 ? (
//               shifts.map((shift, index) => (
//                 <tr key={shift._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">{index + 1}</td>
//                   <td className="px-4 py-2 border">{shift.shift}</td>
//                   <td className="px-4 py-2 border">{shift.customShift || "-"}</td>
//                   <td className="px-4 py-2 border">{new Date(`1970-01-01T${shift.startTime}:00`).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   })}   </td>
//                   <td className="px-4 py-2 border">{new Date(`1970-01-01T${shift.endTime}:00`).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   })} </td>
//                   <td className="px-4 py-2 border">{shift.duration}</td>
//                   <td
//                     className={`px-4 py-2 border ${shift.status === "active"
//                         ? "text-green-600 font-semibold"
//                         : "text-red-600 font-semibold"
//                       }`}
//                   >
//                     {shift.status}
//                   </td>
//                   <td className="px-4 py-2 border flex gap-2">
//                     <Link
//                       to={`/editShift/${shift._id}`}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <FaEdit />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(shift._id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="text-center py-4 text-gray-500 border"
//                 >
//                   No shifts found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ShiftList;



import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaClock,
  FaBriefcase,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaFilter,
  FaCogs
} from "react-icons/fa";

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shift`);
        setShifts(res.data);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Unable to fetch shifts data.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  // Delete shift
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the shift",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/shift/${id}`);
          setShifts((prev) => prev.filter((s) => s._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Shift has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#3085d6"
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the shift.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        }
      }
    });
  };

  // Filter shifts based on search and status
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = 
      shift.shift.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shift.customShift && shift.customShift.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || shift.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaCogs className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Shift Management</h1>
                  <p className="text-blue-100 text-sm">Manage work shift configurations</p>
                </div>
              </div>
              <Link
                to="/addShift"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 w-fit"
              >
                <FaPlus className="w-4 h-4" />
                Add New Shift
              </Link>
            </div>
          </div>
        </div>

         {/* Summary Stats */}
        {shifts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <FaBriefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Shifts</p>
                  <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-3">
                  <FaToggleOn className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Shifts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-lg p-3">
                  <FaToggleOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactive Shifts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading shifts...</span>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="w-3 h-3" />
                        Shift Type
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Custom Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-3 h-3" />
                        Time Range
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShifts.length > 0 ? (
                    filteredShifts.map((shift, index) => (
                      <tr key={shift._id} className="hover:bg-blue-50/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded-lg p-2">
                              <FaBriefcase className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{shift.shift}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {shift.customShift || (
                            <span className="text-gray-400 italic">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                              {new Date(`1970-01-01T${shift.startTime}:00`).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            <span className="text-gray-400">-</span>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                              {new Date(`1970-01-01T${shift.endTime}:00`).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                            {shift.duration} hrs
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {shift.status === "active" ? (
                              <FaToggleOn className="w-5 h-5 text-green-500" />
                            ) : (
                              <FaToggleOff className="w-5 h-5 text-gray-400" />
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                shift.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {shift.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/editShift/${shift._id}`}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                              title="Edit Shift"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(shift._id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                              title="Delete Shift"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-gray-100 rounded-full p-4">
                            <FaBriefcase className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 mb-1">No shifts found</p>
                            <p className="text-sm text-gray-500">
                              {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search or filter criteria"
                                : "Get started by creating your first shift"
                              }
                            </p>
                          </div>
                          {!searchTerm && statusFilter === "all" && (
                            <Link
                              to="/addShift"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                              <FaPlus className="w-4 h-4" />
                              Create First Shift
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ShiftList;