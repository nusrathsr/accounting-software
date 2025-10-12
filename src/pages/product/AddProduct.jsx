import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';
import { FaBox, FaArrowLeft, FaBarcode } from 'react-icons/fa';
import api from '../../utils/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    brand: '',
    status: 'Active',
    productId: ''
  });

  // Generate Product ID
  const generateProductId = () => {
    const prefix = "PROD";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

  useEffect(() => {
    // Generate Product ID
    const newId = generateProductId();
    setProductId(newId);
    setProduct(prev => ({ ...prev, productId: newId }));

    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        // Assuming backend returns array like [{ name: 'clothing' }, ...]
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch categories from server',
        });
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/products", product);
      Swal.fire({
        icon: 'success',
        title: 'Product added!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/listProduct');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to add product. Please try again.',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/listProduct');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <FaBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Product</h1>
              <p className="text-blue-100 text-sm">Create and manage your product inventory</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product ID</label>
                <div className="relative">
                  <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    readOnly
                    value={productId}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-mono"
                  />
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
