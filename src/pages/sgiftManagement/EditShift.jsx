// import React, { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// const EditShift = () => {
//   const { baseURL} = useContext(GlobalContext);
//   const { id } = useParams(); // get shift ID from URL
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     shift: "",
//     customShift: "",
//     startTime: "",
//     endTime: "",
//     duration: 0,
//     status: "",
//   });

//   // fetch shift data by ID
//   useEffect(() => {
//     const fetchShift = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/shift/${id}`);
//         setFormData(res.data); // prefill with backend data
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Failed",
//           text: error.response?.data?.message || "Unable to fetch shift",
//         });
//       }
//     };
//     fetchShift();
//   }, [id, baseURL]);

//   // calculate duration when start/end changes
//   useEffect(() => {
//     if (formData.startTime && formData.endTime) {
//       const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
//       const endTime = new Date(`1970-01-01T${formData.endTime}:00`);
//       let hours = (endTime - startTime) / (1000 * 60 * 60);
//       if (hours < 0) hours += 24; // handle overnight shifts
//       setFormData((prev) => ({ ...prev, duration: hours.toFixed(2) }));
//     }
//   }, [formData.startTime, formData.endTime]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${baseURL}/shift/${id}`, formData);
//       Swal.fire({
//         icon: "success",
//         title: "Updated!",
//         text: "Shift updated successfully",
//       });
//       navigate("/shift"); // redirect back to list
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error.response?.data?.message || "Something went wrong",
//       });
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-grey-800 mb-4">Edit Shift</h1>
//       <form
//         className="p-4 max-w-6xl mx-auto space-y-4"
//         onSubmit={handleSubmit}
//       >
//         <div className="grid grid-cols-1 md:grid-col-2 gap-4">
//           {/* shift type */}
//           <div>
//             <label>Shift:</label>
//             <select
//               name="shift"
//               required
//               onChange={handleChange}
//               value={formData.shift}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select</option>
//               <option value="Morning">Morning</option>
//               <option value="Night">Night</option>
//               <option value="Evening">Evening</option>
//               <option value="Custom">Custom</option>
//             </select>
//           </div>

//           {formData.shift === "Custom" && (
//             <div>
//               <label>Specify Shift</label>
//               <input
//                 type="text"
//                 name="customShift"
//                 onChange={handleChange}
//                 value={formData.customShift}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//           )}

//           {/* start Time */}
//           <div>
//             <label>Start Time</label>
//             <input
//               type="time"
//               name="startTime"
//               onChange={handleChange}
//               value={formData.startTime}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* end time */}
//           <div>
//             <label>End Time</label>
//             <input
//               type="time"
//               name="endTime"
//               onChange={handleChange}
//               value={formData.endTime}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* total hours */}
//           <div>
//             <label>Duration</label>
//             <input
//               type="text"
//               readOnly
//               name="duration"
//               value={formData.duration}
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           {/* status */}
//           <div>
//             <label>Status</label>
//             <select
//               name="status"
//               onChange={handleChange}
//               value={formData.status}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="bg-violet-500 text-white px-4 py-2 rounded"
//         >
//           Update
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditShift;

import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import {
  FaClock,
  FaBriefcase,
  FaPlay,
  FaStop,
  FaHourglassHalf,
  FaToggleOn,
  FaArrowLeft,
  FaEdit,
  FaCogs
} from "react-icons/fa";

const EditShift = () => {
  const { id } = useParams(); // get shift ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shift: "",
    customShift: "",
    startTime: "",
    endTime: "",
    duration: 0,
    status: "",
  });

  // fetch shift data by ID
  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await api.get(`/shift/${id}`);
        setFormData(res.data); // prefill with backend data
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Unable to fetch shift data.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      }
    };
    fetchShift();
  }, [id]);

  // calculate duration when start/end changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
      const endTime = new Date(`1970-01-01T${formData.endTime}:00`);
      let hours = (endTime - startTime) / (1000 * 60 * 60);
      if (hours < 0) hours += 24; // handle overnight shifts
      setFormData((prev) => ({ ...prev, duration: hours.toFixed(2) }));
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/shift/${id}`, formData);
      
      Swal.fire({
        title: "Success!",
        text: "Shift updated successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });
      
      navigate("/shift"); // redirect back to list
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the shift.",
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
              <button 
                onClick={() => navigate("/shift")}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaCogs className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Shift</h1>
                <p className="text-blue-100 text-sm">Update work shift configuration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">

            {/* Shift Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaBriefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Shift Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shift Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaBriefcase className="inline w-4 h-4 mr-2 text-blue-600" />
                    Shift *
                  </label>
                  <select
                    name="shift"
                    required
                    onChange={handleChange}
                    value={formData.shift}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select Shift Type</option>
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                    <option value="Evening">Evening</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {/* Custom Shift Name */}
                {formData.shift === "Custom" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <FaBriefcase className="inline w-4 h-4 mr-2 text-blue-600" />
                      Specify Shift *
                    </label>
                    <input
                      type="text"
                      name="customShift"
                      onChange={handleChange}
                      value={formData.customShift}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter custom shift name"
                    />
                  </div>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaToggleOn className="inline w-4 h-4 mr-2 text-blue-600" />
                    Status *
                  </label>
                  <select
                    name="status"
                    onChange={handleChange}
                    value={formData.status}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                <h2 className="text-xl font-semibold text-gray-900">Time Configuration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaPlay className="inline w-4 h-4 mr-2 text-blue-600" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    onChange={handleChange}
                    value={formData.startTime}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaStop className="inline w-4 h-4 mr-2 text-blue-600" />
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    onChange={handleChange}
                    value={formData.endTime}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaHourglassHalf className="inline w-4 h-4 mr-2 text-blue-600" />
                    Duration (Hours)
                  </label>
                  <input
                    type="text"
                    readOnly
                    name="duration"
                    value={formData.duration}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100 font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/shift")}
                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit className="w-4 h-4" />
                    Update Shift
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
              <p className="font-medium mb-1">Shift Update Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Duration is automatically recalculated when you change start or end times</li>
                <li>Use 'Custom' shift type to create unique shift names for your organization</li>
                <li>Setting status to 'Inactive' will hide this shift from attendance marking</li>
                <li>Cross-midnight shifts (e.g., night shifts) are handled automatically</li>
                <li>Changes will be applied immediately after saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShift;
