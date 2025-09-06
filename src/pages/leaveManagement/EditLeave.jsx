// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { useParams, useNavigate } from "react-router-dom";
// import { GlobalContext } from "../../context/GlobalContext";
// import Swal from "sweetalert2"; // ✅ Import SweetAlert2

// const EditLeave = () => {
//   const { employees, baseURL } = useContext(GlobalContext);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
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

//   // Fetch leave details
//   useEffect(() => {
//     const fetchLeave = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/leaves/${id}`);
//         const leave = res.data;
//         setFormData({
//           employeeId: leave.employeeId?._id || "",
//           employeeName: leave.employeeId?.fullName || "",
//           leaveType: leave.leaveType,
//           startDate: leave.startDate?.split("T")[0] || "",
//           endDate: leave.endDate?.split("T")[0] || "",
//           totalDays: leave.totalDays,
//           reason: leave.reason || "",
//           status: leave.status,
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching leave:", err);
//         setLoading(false);
//       }
//     };
//     fetchLeave();
//   }, [id, baseURL]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const employeeOptions = employees.map((emp) => ({
//     value: emp._id,
//     label: emp.fullName,
//   }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${baseURL}/leaves/${id}`, formData);

//       // ✅ SweetAlert success
//       Swal.fire({
//         icon: "success",
//         title: "Updated!",
//         text: "Leave updated successfully.",
//         showConfirmButton: false,
//         timer: 1500,
//       });

//       navigate("/leave");
//     } catch (err) {
//       console.error("Error updating leave:", err);

//       // ❌ SweetAlert error
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update leave. Please try again.",
//       });
//     }
//   };

//   if (loading) return <p className="text-center">Loading leave details...</p>;

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 max-w-lg mx-auto bg-white shadow rounded"
//     >
//       <h2 className="text-xl font-bold mb-4">Edit Leave</h2>

//       {/* Employee */}
//       <label className="block mb-1">Employee Name</label>
//       <Select
//         options={employeeOptions}
//         value={
//           formData.employeeId
//             ? { value: formData.employeeId, label: formData.employeeName }
//             : null
//         }
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

//       {/* Leave Type & Status */}
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

//       {/* Dates */}
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
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Update Leave
//       </button>
//     </form>
//   );
// };

// export default EditLeave;

import React, { useState, useEffect, useContext } from "react";
import api from '../../utils/api';
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from "sweetalert2";
import {
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaCheck,
  FaClock,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaFileAlt
} from "react-icons/fa";

const EditLeave = () => {
  const { employees } = useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  // Fetch leave details
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await api.get(`/leaves/${id}`);
        const leave = res.data;
        setFormData({
          employeeId: leave.employeeId?._id || "",
          employeeName: leave.employeeId?.fullName || "",
          leaveType: leave.leaveType,
          startDate: leave.startDate?.split("T")[0] || "",
          endDate: leave.endDate?.split("T")[0] || "",
          totalDays: leave.totalDays,
          reason: leave.reason || "",
          status: leave.status,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leave:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to load leave details.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setLoading(false);
        navigate("/leave");
      }
    };
    fetchLeave();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.fullName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.put(`/leaves/${id}`, formData);

      // ✅ SweetAlert success
      Swal.fire({
        title: "Success!",
        text: "Leave updated successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      navigate("/leave");
    } catch (err) {
      console.error("Error updating leave:", err);

      // ❌ SweetAlert error
      Swal.fire({
        title: "Error!",
        text: "Failed to update leave. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-700">Loading leave details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/leave")}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaEdit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Leave Entry</h1>
                <p className="text-blue-100 text-sm">Modify existing leave record</p>
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
                    value={
                      formData.employeeId
                        ? { value: formData.employeeId, label: formData.employeeName }
                        : null
                    }
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
                disabled={submitLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating Leave...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Update Leave
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
              <p className="font-medium mb-1">Edit Leave Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>You can change the employee assignment if needed</li>
                <li>Total days will automatically recalculate when dates are changed</li>
                <li>Status updates will reflect immediately in the leave records</li>
                <li>Leave type changes may affect leave balance calculations</li>
                <li>All changes are saved permanently once submitted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLeave;
