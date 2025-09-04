// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { GlobalContext } from "../../context/GlobalContext";
// import Swal from "sweetalert2";

// const ListHoliday = () => {
//   const { baseURL } = useContext(GlobalContext);
//   const [holidays, setHolidays] = useState([]);
//   const [filteredHolidays, setFilteredHolidays] = useState([]);

//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");

//   const fetchHolidays = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/holiday`);
//       setHolidays(res.data);
//       setFilteredHolidays(res.data);
//     } catch (err) {
//       console.error("Error fetching holidays:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   // Apply filter whenever month or date changes
//   useEffect(() => {
//     let filtered = holidays;

//     if (selectedMonth) {
//       filtered = filtered.filter((holiday) => {
//         const holidayMonth = new Date(holiday.date).getMonth() + 1; // getMonth returns 0–11
//         return holidayMonth === parseInt(selectedMonth);
//       });
//     }

//     if (selectedDate) {
//       filtered = filtered.filter((holiday) => {
//         const holidayDate = new Date(holiday.date).toISOString().split("T")[0];
//         return holidayDate === selectedDate;
//       });
//     }

//     setFilteredHolidays(filtered);
//   }, [selectedMonth, selectedDate, holidays]);

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This holiday will be deleted!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`${baseURL}/holidays/${id}`);
//           setHolidays(holidays.filter((holiday) => holiday._id !== id));
//           Swal.fire("Deleted!", "Holiday has been deleted.", "success");
//         } catch (err) {
//           Swal.fire("Error!", "Failed to delete holiday.", "error");
//         }
//       }
//     });
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Holiday Calendar</h2>

//       {/* Filters */}
//       <div className="flex items-center gap-4 mb-4">
//         {/* Month Dropdown */}
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">Filter by Month</option>
//           {[
//             "January",
//             "February",
//             "March",
//             "April",
//             "May",
//             "June",
//             "July",
//             "August",
//             "September",
//             "October",
//             "November",
//             "December",
//           ].map((month, index) => (
//             <option key={index} value={index + 1}>
//               {month}
//             </option>
//           ))}
//         </select>

//         {/* Date Picker */}
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="border p-2 rounded"
//         />

//         {/* Reset Button */}
//         <button
//           onClick={() => {
//             setSelectedMonth("");
//             setSelectedDate("");
//           }}
//           className="bg-gray-300 px-3 py-1 rounded"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Table */}
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border">Holiday Name</th>
//             <th className="p-2 border">Date</th>
//             <th className="p-2 border">Description</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredHolidays.length > 0 ? (
//             filteredHolidays.map((holiday) => (
//               <tr key={holiday._id} className="text-center">
//                 <td className="p-2 border">{holiday.name}</td>
//                 <td className="p-2 border">
//                   {new Date(holiday.date).toLocaleDateString()}
//                 </td>
//                 <td className="p-2 border">{holiday.description || "-"}</td>
//                 <td className="p-2 border space-x-2">
//                   <Link
//                     to={`/editHoliday/${holiday._id}`}
//                     className="bg-blue-500 text-white px-2 py-1 rounded"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(holiday._id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" className="p-3 text-center">
//                 No holidays found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ListHoliday;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaFilter,
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaList,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const ListHoliday = () => {
  const { baseURL } = useContext(GlobalContext);
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
   const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchHolidays = async () => {
    try {
      const res = await axios.get(`${baseURL}/holiday`);
      setHolidays(res.data);
      setFilteredHolidays(res.data);
    } catch (err) {
      console.error("Error fetching holidays:", err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Apply filter whenever month or date changes
  useEffect(() => {
    let filtered = holidays;

    if (selectedMonth) {
      filtered = filtered.filter((holiday) => {
        const holidayMonth = new Date(holiday.date).getMonth() + 1; // getMonth returns 0–11
        return holidayMonth === parseInt(selectedMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((holiday) => {
        const holidayDate = new Date(holiday.date).toISOString().split("T")[0];
        return holidayDate === selectedDate;
      });
    }

    setFilteredHolidays(filtered);
  }, [selectedMonth, selectedDate, holidays]);


  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedHolidays = filteredHolidays.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);



  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This holiday will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/holidays/${id}`);
          setHolidays(holidays.filter((holiday) => holiday._id !== id));
          Swal.fire("Deleted!", "Holiday has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete holiday.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
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
                <h1 className="text-2xl md:text-3xl font-bold text-white">Holiday Calendar</h1>
                <p className="text-blue-100 text-sm">Manage company holidays and events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                <FaFilter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filter Holidays</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Month Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                  Filter by Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">All Months</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Reset Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">Reset</label>
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setSelectedDate("");
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Holidays Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <FaCalendarAlt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Holidays List</h2>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                Total: {filteredHolidays.length} holidays
              </div>
            </div>

            {/* Table Container with scroll */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">Holiday Name</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">Date</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">Description</th>
                    <th className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolidays.length > 0 ? (
                     paginatedHolidays.map((holiday, index) => (
                      <tr key={holiday._id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="p-4 border-b border-gray-100 font-medium text-gray-900">{holiday.name}</td>
                        <td className="p-4 border-b border-gray-100 text-gray-700">
                          {new Date(holiday.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 border-b border-gray-100 text-gray-600">{holiday.description || "-"}</td>
                        <td className="p-4 border-b border-gray-100">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/editHoliday/${holiday._id}`}
                              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(holiday._id)}
                              className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1"
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
                      <td colSpan="4" className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaCalendarAlt className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">No holidays found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your filters or add new holidays</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
          {filteredHolidays.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredHolidays.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredHolidays.length}</span>{" "}
                  results
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
                    {totalPages > 0 &&
                      [...Array(Math.min(5, totalPages))].map((_, i) => {
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
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
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
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Holiday Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Use month filter to view holidays for specific months</li>
                <li>Date filter allows you to check holidays on specific dates</li>
                <li>Click "Reset Filters" to view all holidays</li>
                <li>Edit holidays to update details or change dates</li>
                <li>Delete holidays that are no longer applicable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListHoliday;




