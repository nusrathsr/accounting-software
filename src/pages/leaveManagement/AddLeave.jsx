// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Select from "react-select";
// import Swal from "sweetalert2"; // ✅ Add this at the top
// import { GlobalContext } from "../../context/GlobalContext";

// const AddLeave = () => {
//   const { employees, baseURL } = useContext(GlobalContext);

//   const [formData, setFormData] = useState({
//     employeeId: "",
//     employeeName: "",
//     leaveType: "Casual",
//     startDate: "",
//     endDate: "",
//     totalDays: 0,
//     reason: "",
//     status: "Approved",
//   });

//   // Auto-calc total days
//   useEffect(() => {
//     if (formData.startDate && formData.endDate) {
//       const start = new Date(formData.startDate);
//       const end = new Date(formData.endDate);
//       const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
//       setFormData((prev) => ({ ...prev, totalDays: diff > 0 ? diff : 0 }));
//     }
//   }, [formData.startDate, formData.endDate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const employeeOptions = employees.map((emp) => ({
//     value: emp._id,
//     label: emp.fullName,
//   }));

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await axios.post(`${baseURL}/leaves`, formData);

//     // ✅ SweetAlert success
//     Swal.fire({
//       icon: "success",
//       title: "Leave Added!",
//       text: "Leave entry added successfully.",
//       timer: 1500,
//       showConfirmButton: false,
//     });

//     // Reset form
//     setFormData({
//       employeeId: "",
//       employeeName: "",
//       leaveType: "Casual",
//       startDate: "",
//       endDate: "",
//       totalDays: 0,
//       reason: "",
//       status: "Approved",
//     });
//   } catch (err) {
//     console.error("Error adding leave:", err);

//     // ❌ SweetAlert error
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "Failed to add leave. Please try again.",
//     });
//   }
// };


//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 max-w-lg mx-auto bg-white shadow rounded"
//     >
//       <h2 className="text-xl font-bold mb-4">Leave Entry (HR/Admin)</h2>

//       {/* Employee */}
//       <label className="block mb-1">Employee Name</label>
//       <Select
//         options={employeeOptions}
//         isSearchable
//         isClearable
//         placeholder="Type or select employee..."
//         onChange={(selected) => {
//           if (selected) {
//             setFormData({
//               ...formData,
//               employeeId: selected.value,
//               employeeName: selected.label,
//             });
//           } else {
//             setFormData({ ...formData, employeeId: "", employeeName: "" });
//           }
//         }}
//         onInputChange={(inputValue, action) => {
//           if (action.action === "input-change") {
//             setFormData({
//               ...formData,
//               employeeName: inputValue,
//               employeeId: "",
//             });
//           }
//         }}
//         className="mb-3"
//       />

//       {/* Leave Type & Status in a row */}
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block mb-1">Leave Type</label>
//           <select
//             name="leaveType"
//             value={formData.leaveType}
//             onChange={handleChange}
//             className="w-full border p-2 mb-3"
//           >
//             <option value="Casual">Casual</option>
//             <option value="Sick">Sick</option>
//             <option value="Paid">Paid</option>
//             <option value="Unpaid">Unpaid</option>
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full border p-2 mb-3"
//           >
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>
//       </div>

//       {/* Start Date & End Date in a row */}
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block mb-1">Start Date</label>
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 mb-3"
//           />
//         </div>

//         <div>
//           <label className="block mb-1">End Date</label>
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 mb-3"
//           />
//         </div>
//       </div>

//       {/* Total Days */}
//       <label className="block mb-1">Total Days</label>
//       <input
//         type="number"
//         name="totalDays"
//         value={formData.totalDays}
//         readOnly
//         className="w-full border p-2 mb-3 bg-gray-100"
//       />

//       {/* Reason */}
//       <label className="block mb-1">Reason (optional)</label>
//       <textarea
//         name="reason"
//         value={formData.reason}
//         onChange={handleChange}
//         className="w-full border p-2 mb-3"
//       />

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default AddLeave;


import React, { useState, useEffect, useContext } from "react";
import api from '../../utils/api';
import Select from "react-select";
import Swal from "sweetalert2";
import { GlobalContext } from "../../context/GlobalContext";
import {
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaCheck,
  FaClock,
  FaArrowLeft,
  FaPlus,
  FaSave,
  FaFileAlt
} from "react-icons/fa";

const AddLeave = () => {
  const { employees, baseURL } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    totalDays: 0,
    reason: "",
    status: "Approved",
  });

  // Auto-calc total days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setFormData((prev) => ({ ...prev, totalDays: diff > 0 ? diff : 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.fullName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leaves", formData);

      // ✅ SweetAlert success
      Swal.fire({
        title: "Success!",
        text: "Leave entry added successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      // Reset form
      setFormData({
        employeeId: "",
        employeeName: "",
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        totalDays: 0,
        reason: "",
        status: "Approved",
      });
    } catch (err) {
      console.error("Error adding leave:", err);

      // ❌ SweetAlert error
      Swal.fire({
        title: "Error!",
        text: "Failed to add leave. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
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
                <FaPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add Leave Entry</h1>
                <p className="text-blue-100 text-sm">Create a new leave record for employee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Employee Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Employee Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Employee */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaUser className="inline w-4 h-4 mr-2 text-blue-600" />
                    Employee Name *
                  </label>
                  <Select
                    options={employeeOptions}
                    isSearchable
                    isClearable
                    placeholder="Type or select employee..."
                    onChange={(selected) => {
                      if (selected) {
                        setFormData({
                          ...formData,
                          employeeId: selected.value,
                          employeeName: selected.label,
                        });
                      } else {
                        setFormData({ ...formData, employeeId: "", employeeName: "" });
                      }
                    }}
                    onInputChange={(inputValue, action) => {
                      if (action.action === "input-change") {
                        setFormData({
                          ...formData,
                          employeeName: inputValue,
                          employeeId: "",
                        });
                      }
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        backgroundColor: '#f9fafb',
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                      }),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Leave Details Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaClipboardList className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Leave Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leave Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClipboardList className="inline w-4 h-4 mr-2 text-blue-600" />
                    Leave Type *
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCheck className="inline w-4 h-4 mr-2 text-blue-600" />
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Total Days */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClock className="inline w-4 h-4 mr-2 text-blue-600" />
                    Total Days
                  </label>
                  <input
                    type="number"
                    name="totalDays"
                    value={formData.totalDays}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100 font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <FaFileAlt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Reason */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaFileAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Reason (optional)
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Enter reason for leave (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Leave...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Submit Leave
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Leave Entry Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Select employee from dropdown or type to search</li>
                <li>Total days are automatically calculated based on start and end dates</li>
                <li>Leave type determines how the leave is categorized in records</li>
                <li>Status can be set to approved, pending, or rejected as needed</li>
                <li>Reason field is optional but recommended for record keeping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;
