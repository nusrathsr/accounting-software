// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { GlobalContext } from "../../context/GlobalContext";

// const AddAttendance = () => {
//   const { employees, baseURL } = useContext(GlobalContext);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().slice(0, 10),
//     employeeId: "",
//     checkIn: "",
//     checkOut: "",
//     shift: "Morning",
//     workHours: 0,
//     overtimeHours: 0,
//     status: "Present",
//     leaveType: "",
//     remarks: "",
//   });

//   const shiftHours = { Morning: 8, Evening: 8, Night: 8 };

//   // Auto calculate work & overtime hours
//   useEffect(() => {
//     if (formData.checkIn && formData.checkOut) {
//       const checkInTime = new Date(`1970-01-01T${formData.checkIn}:00`);
//       const checkOutTime = new Date(`1970-01-01T${formData.checkOut}:00`);
//       let hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
//       if (hoursWorked < 0) hoursWorked += 24;
//       const overtime =
//         hoursWorked > shiftHours[formData.shift]
//           ? hoursWorked - shiftHours[formData.shift]
//           : 0;
//       setFormData((prev) => ({
//         ...prev,
//         workHours: hoursWorked.toFixed(2),
//         overtimeHours: overtime.toFixed(2),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, workHours: 0, overtimeHours: 0 }));
//     }
//   }, [formData.checkIn, formData.checkOut, formData.shift]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ✅ Submit to backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.post(`${baseURL}/attendance`, formData);

//       Swal.fire({
//         icon: "success",
//         title: "Attendance Marked!",
//         text: res.data.message,
//       });

//       // reset form after submission
//       setFormData({
//         date: new Date().toISOString().slice(0, 10),
//         employeeId: "",
//         checkIn: "",
//         checkOut: "",
//         shift: "Morning",
//         workHours: 0,
//         overtimeHours: 0,
//         status: "Present",
//         leaveType: "",
//         remarks: "",
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error.response?.data?.message || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">
//         Daily Attendance
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="p-4 max-w-6xl mx-auto space-y-4"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Date */}
//           <div>
//             <label>Date:</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Employee */}
//           <div>
//             <label>Employee:</label>
//             <select
//               name="employeeId"
//               value={formData.employeeId}
//               onChange={handleChange}
//               required
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select Employee</option>
//               {employees.map((emp) => (
//                 <option key={emp.employeeId} value={emp._id}>
//                   {emp.fullName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Check-in */}
//           <div>
//             <label>Check-in Time:</label>
//             <input
//               type="time"
//               name="checkIn"

//               value={formData.checkIn}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Check-out */}
//           <div>
//             <label>Check-out Time:</label>
//             <input
//               type="time"
//               name="checkOut"

//               value={formData.checkOut}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Shift */}
//           <div>
//             <label>Shift:</label>
//             <select
//               name="shift"
//               value={formData.shift}
//               required
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option>Morning</option>
//               <option>Evening</option>
//               <option>Night</option>
//             </select>
//           </div>

//           {/* Status */}
//           <div>
//             <label>Status:</label>
//             <select
//               name="status"
//               required
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option>Present</option>
//               <option>Absent</option>
//               <option>Half Day</option>
//               <option>Leave</option>
//             </select>
//           </div>

//           {/* Work hours */}
//           <div>
//             <label>Work Hours:</label>
//             <input
//               type="text"
//               value={formData.workHours}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           {/* Overtime hours */}
//           <div>
//             <label>Overtime Hours:</label>
//             <input
//               type="text"
//               value={formData.overtimeHours}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           {/* Leave type (conditional) */}
//           {(formData.status === "Absent" || formData.status === "Leave") && (
//             <div>
//               <label>Leave Type:</label>
//               <select
//                 name="leaveType"
//                 value={formData.leaveType}
//                 required
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="">Select Leave Type</option>
//                 <option>Paid Leave</option>
//                 <option>Unpaid Leave</option>
//                 <option>Sick Leave</option>
//                 <option>Casual Leave</option>
//               </select>
//             </div>
//           )}

//           {/* Remarks */}
//           <div
//             className={
//               formData.status === "Absent" || formData.status === "Leave"
//                 ? ""
//                 : "md:col-span-2"
//             }
//           >
//             <label>Remarks:</label>
//             <input
//               type="text"
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-violet-500 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Saving..." : "Mark Attendance"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddAttendance;




import React, { useState, useEffect, useContext } from "react";
import api from '../../utils/api';
import TimePicker from "react-time-picker";
import Swal from "sweetalert2";
import { GlobalContext } from "../../context/GlobalContext";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaClipboardCheck,
  FaBriefcase,
  FaExclamationTriangle,
  FaArrowLeft,
  FaUserClock,
  FaSave,
  FaHourglassHalf,
  FaBusinessTime
} from "react-icons/fa";

const AddAttendance = () => {
  const { employees, shift } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    employeeId: "",
    checkIn: "",
    checkOut: "",
    shift: "Morning",
    workHours: 0,
    overtimeHours: 0,
    status: "Present",
    leaveType: "",
    remarks: "",
  });

  // Auto calculate work & overtime hours
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkInTime = new Date(`1970-01-01T${formData.checkIn}:00`);
      const checkOutTime = new Date(`1970-01-01T${formData.checkOut}:00`);
      let hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      if (hoursWorked < 0) hoursWorked += 24;

      let overtime;
      shift.forEach((sh) => {
        if (formData.shift === sh.shift) {
          overtime = hoursWorked > sh.duration ? hoursWorked - sh.duration : 0
        }
      })
      setFormData((prev) => ({
        ...prev,
        workHours: hoursWorked.toFixed(2),
        overtimeHours: overtime.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({ ...prev, workHours: 0, overtimeHours: 0 }));
    }
  }, [formData.checkIn, formData.checkOut, formData.shift]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "shift") {

      const selectedShift = shift.find((sh) => sh.shift === value);
      if (selectedShift) {
        setFormData((prev) => ({
          ...prev,
          shift: value,
          checkIn: selectedShift.startTime,  // auto fill
          checkOut: selectedShift.endTime,   // auto fill
        }));
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };


  // ✅ Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/attendance", formData);

      Swal.fire({
        title: "Success!",
        text: "Attendance marked successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      // reset form after submission
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        employeeId: "",
        checkIn: "",
        checkOut: "",
        shift: "Morning",
        workHours: 0,
        overtimeHours: 0,
        status: "Present",
        leaveType: "",
        remarks: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error marking attendance.",
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
                <FaUserClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Daily Attendance</h1>
                <p className="text-blue-100 text-sm">Mark employee attendance record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">

            {/* Basic Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaCalendarAlt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Employee */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaUser className="inline w-4 h-4 mr-2 text-blue-600" />
                    Employee *
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp._id}>
                        {emp.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClipboardCheck className="inline w-4 h-4 mr-2 text-blue-600" />
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option>Present</option>
                    <option>Half Day</option>
                    <option>Leave</option>
                  </select>
                </div>

                {/* Shift */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaBriefcase className="inline w-4 h-4 mr-2 text-blue-600" />
                    Shift *
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">select Shift</option>
                    {shift
                      .filter((sh) => sh.status === "active")
                      .map((sh) => (
                        <option key={sh._id} value={sh.shift}>
                          {sh.shift}
                        </option>
                      ))}

                  </select>
                </div>
              </div>
            </div>

            {/* Time Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaClock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Time Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-in */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClock className="inline w-4 h-4 mr-2 text-blue-600" />
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                  {/* <TimePicker
                    onChange={handleChange}
                    value={formData.checkIn}
                    disableClock={true} // hides the analog clock
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  /> */}
                </div>

                {/* Check-out */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaClock className="inline w-4 h-4 mr-2 text-blue-600" />
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Work hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaBusinessTime className="inline w-4 h-4 mr-2 text-blue-600" />
                    Work Hours
                  </label>
                  <input
                    type="text"
                    value={formData.workHours}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100 font-medium text-gray-700"
                  />
                </div>

                {/* Overtime hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaHourglassHalf className="inline w-4 h-4 mr-2 text-blue-600" />
                    Overtime Hours
                  </label>
                  <input
                    type="text"
                    value={formData.overtimeHours}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100 font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Leave Information Section (conditional) */}
            {(formData.status === "Leave") && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-2">
                    <FaExclamationTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Leave Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* Leave type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <FaExclamationTriangle className="inline w-4 h-4 mr-2 text-blue-600" />
                      Leave Type *
                    </label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      required
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="">Select Leave Type</option>
                      <option>Paid Leave</option>
                      <option>Unpaid Leave</option>
                      <option>Sick Leave</option>
                      <option>Casual Leave</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <FaClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Remarks */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter any additional remarks"
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
                    Marking Attendance...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Mark Attendance
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
              <p className="font-medium mb-1">Attendance Marking Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Work hours and overtime are automatically calculated based on check-in/out times</li>
                <li>Leave type is required when status is set to 'Absent' or 'Leave'</li>
                <li>Each shift has standard 8-hour duration for overtime calculation</li>
                <li>Remarks field can be used for additional notes or explanations</li>
                <li>Date defaults to today but can be changed for backdated entries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAttendance;
