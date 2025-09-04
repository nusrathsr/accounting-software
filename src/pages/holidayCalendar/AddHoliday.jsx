// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { GlobalContext } from "../../context/GlobalContext";
// import Swal from "sweetalert2";

// const AddHoliday = () => {
//   const { baseURL } = useContext(GlobalContext);

//   const [formData, setFormData] = useState({
//     name: "",
//     date: "",
//     description: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${baseURL}/holiday`, formData);

//       Swal.fire({
//         icon: "success",
//         title: "Holiday Added!",
//         text: "Holiday entry added successfully.",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setFormData({ name: "", date: "", description: "" });
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to add holiday. Please try again.",
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Add Holiday</h2>

//       <label className="block mb-1">Holiday Name</label>
//       <input
//         type="text"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 mb-3"
//       />

//       <label className="block mb-1">Date</label>
//       <input
//         type="date"
//         name="date"
//         value={formData.date}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 mb-3"
//       />

//       <label className="block mb-1">Description (optional)</label>
//       <textarea
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         className="w-full border p-2 mb-3"
//       />

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//         Add Holiday
//       </button>
//     </form>
//   );
// };

// export default AddHoliday;


import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaPlus,
  FaSave,
  FaFileAlt,
  FaGift
} from "react-icons/fa";

const AddHoliday = () => {
  const { baseURL } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseURL}/holiday`, formData);

      Swal.fire({
        title: "Success!",
        text: "Holiday entry added successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      setFormData({ name: "", date: "", description: "" });
    } catch (err) {
      console.error("Error adding holiday:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to add holiday. Please try again.",
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
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add Holiday</h1>
                <p className="text-blue-100 text-sm">Create a new holiday record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Holiday Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaGift className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Holiday Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holiday Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaGift className="inline w-4 h-4 mr-2 text-blue-600" />
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter holiday name"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Holiday Date *
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
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaFileAlt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaFileAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Enter holiday description (optional)"
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
                    Adding Holiday...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Add Holiday
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
              <p className="font-medium mb-1">Holiday Entry Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Holiday name should be clear and descriptive</li>
                <li>Date will be used for scheduling and leave calculations</li>
                <li>Description field can include cultural significance or observance details</li>
                <li>All employees will be able to view this holiday in their calendar</li>
                <li>Consider adding recurring annual holidays for better planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHoliday;
