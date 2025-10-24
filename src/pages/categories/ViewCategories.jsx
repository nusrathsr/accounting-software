// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../utils/api"; 
// import {
//   FileText,
//   Edit3,
//   Trash2,
//   PlusCircle,
//   AlertCircle,
// } from "lucide-react";

// export default function ViewCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/categories");
//       setCategories(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // ✅ Delete category
//   const deleteCategory = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;
//     try {
//       await api.delete(`/categories/${id}`);
//       setCategories(categories.filter((cat) => cat._id !== id));
//     } catch (err) {
//       console.error("Error deleting category:", err);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold text-gray-800 flex items-center">
//           <FileText className="w-5 h-5 mr-2 text-violet-500" />
//           Categories
//         </h1>
//         <Link
//           to="/addCategory"
//           className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-lg shadow hover:bg-violet-600"
//         >
//           <PlusCircle className="w-4 h-4" />
//           Add Category
//         </Link>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : categories.length === 0 ? (
//         <div className="flex items-center gap-2 text-gray-500">
//           <AlertCircle className="w-5 h-5" />
//           No categories found
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-3 border">#</th>
//                 <th className="px-4 py-3 border">Name</th>
//                 <th className="px-4 py-3 border">Description</th>
//                 <th className="px-4 py-3 border">Status</th>
//                 <th className="px-4 py-3 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((cat, index) => (
//                 <tr key={cat._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 border">{index + 1}</td>
//                   <td className="px-4 py-3 border font-medium text-gray-800">
//                     {cat.name}
//                   </td>
//                   <td className="px-4 py-3 border text-gray-600">
//                     {cat.description || "-"}
//                   </td>
//                   <td className="px-4 py-3 border">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-medium ${
//                         cat.status === "active"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {cat.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 border flex gap-3">
//                     <Link
//                       to={`/editCategory/${cat._id}`}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <Edit3 className="w-5 h-5" />
//                     </Link>
//                     <button
//                       onClick={() => deleteCategory(cat._id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../utils/api"; 
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTag,
  FaSearch
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";

export default function ViewCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch categories',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // ✅ Delete category
  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error deleting category:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete category',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <MdCategory className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Categories</h1>
                  <p className="text-purple-100 text-sm">Manage product categories</p>
                </div>
              </div>
              <Link
                to="/addCategory"
                className="flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPlus className="w-4 h-4" />
                Add Category
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-purple-50 rounded-full p-6 mb-4">
                <FaTag className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by adding your first category"}
              </p>
              {!searchTerm && (
                <Link
                  to="/addCategory"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                >
                  <FaPlus className="w-4 h-4" />
                  Add First Category
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-purple-600">{filteredCategories.length}</span> of <span className="font-semibold">{categories.length}</span> categories
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      Active: <span className="font-semibold text-green-600">
                        {categories.filter(c => c.status === 'active').length}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Inactive: <span className="font-semibold text-red-600">
                        {categories.filter(c => c.status === 'inactive').length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((cat, index) => (
                      <tr 
                        key={cat._id} 
                        className="hover:bg-purple-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                              <FaTag className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                              {cat.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {cat.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              cat.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {cat.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              to={`/editCategory/${cat._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md"
                              title="Edit Category"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteCategory(cat._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
                              title="Delete Category"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}