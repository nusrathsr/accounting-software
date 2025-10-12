import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api"; 
import {
  FileText,
  Edit3,
  Trash2,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

export default function ViewCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-violet-500" />
          Categories
        </h1>
        <Link
          to="/addCategory"
          className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-lg shadow hover:bg-violet-600"
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="w-5 h-5" />
          No categories found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Description</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="px-4 py-3 border font-medium text-gray-800">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 border text-gray-600">
                    {cat.description || "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        cat.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border flex gap-3">
                    <Link
                      to={`/editCategory/${cat._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit3 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
