// import React, { useState } from "react";
// import api from "../../utils/api"; // 👈 make sure this path matches your project

// export default function CustomerCategories() {
//   const [categoryName, setCategoryName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!categoryName.trim()) {
//       setMessage({ type: "error", text: "Category name is required" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await api.post("/customer-categories", {
//         name: categoryName,
//         description,
//       });
//       setMessage({ type: "success", text: "Category added successfully ✅" });
//       setCategoryName("");
//       setDescription("");
//     } catch (err) {
//       console.error(err);
//       setMessage({ type: "error", text: "Failed to add category ❌" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         Add Customer Category
//       </h1>

//       {message && (
//         <div
//           className={`p-3 mb-4 rounded-lg ${
//             message.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Category Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Category Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             placeholder="Enter category name"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter description (optional)"
//             rows="4"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  FaTag,
  FaSave,
  FaArrowLeft,
  FaPlus,
  FaAlignLeft
} from 'react-icons/fa';

const CustomerCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Category name is required',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/customer-categories', {
        name: categoryName,
        description,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Category added successfully!',
        timer: 2000,
        showConfirmButton: false
      });

      setCategoryName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to add category',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add Customer Category</h1>
                <p className="text-blue-100 text-sm">Create a new customer category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Category Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaTag className="w-5 h-5 text-blue-600" />
                Category Information
              </h2>
              <div className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      placeholder="Enter category name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <FaAlignLeft className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      placeholder="Enter description (optional)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerCategories;