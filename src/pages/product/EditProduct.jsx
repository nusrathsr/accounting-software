import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { 
  FaBox, 
  FaTag, 
  FaPalette, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaTruck,
  FaImage,
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaBarcode,
  FaPercent,
  FaRulerCombined,
  FaEdit
} from 'react-icons/fa';
import { MdCategory, MdBrandingWatermark } from 'react-icons/md';

const EditProduct = () => {
  const { id } = useParams(); // product _id from URL
  const navigate = useNavigate();
  const { suppliers, baseURL, loading } = useContext(GlobalContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([
    { name: 'clothing', subcategories: ['Shirts', 'T-Shirts', 'Pants', 'Kids Wear','top','dress','shawls'] },
    { name: 'grocery', subcategories: ['Fruits', 'Vegetables', 'Snacks', 'dairy products','spices',"essentials","cookware","dinnerware"] },
    { name: 'electronics', subcategories: ['Mobiles', 'Laptops', 'Chargers','speaker',"tv","washing machine","mixer grinder","refrigerator","fan","light","vacuum cleaner","headphones","oven","kettle","electric stove","intention cooker"] },
  ]);
  const [subcategories, setSubcategories] = useState([]);
  const [taxInclusive, setTaxInclusive] = useState(false);

  // product state
  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    sizes: [{ size: "", quantity: "" }],
    color: "",
    sellingPrice: "",
    purchasePrice: "",
    tax: "",
    expiryDate: "",
    supplier: "",
    image: null, // File instead of base64
    taxPercentage: "",
    taxType: "",
    productId: "",
  });

  // 1️⃣ Fetch product details on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/products/${id}`);
        const data = res.data;

        // update subcategories list
        const selectedCat = categories.find((cat) => cat.name === data.category);
        setSubcategories(selectedCat ? selectedCat.subcategories : []);

        setProduct({
          name: data.name || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          brand: data.brand || "",
          sizes: data.sizes?.length ? data.sizes : [{ size: "", quantity: "" }],
          color: data.color || "",
          sellingPrice: data.sellingPrice || "",
          purchasePrice: data.purchasePrice || "",
          tax: data.tax || "",
          expiryDate: data.expiryDate || "",
          supplier: data.supplier || "",
          image: null, // will be handled separately
          taxPercentage: data.taxPercentage || "",
          taxType: data.taxType || "",
          productId: data.productId || "",
        });

        setTaxInclusive(!!data.taxPercentage);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, baseURL, categories]);

  // 2️⃣ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    // update subcategories when category changes
    if (name === "category") {
      const selected = categories.find((cat) => cat.name === value);
      setSubcategories(selected ? selected.subcategories : []);
      setProduct((prev) => ({ ...prev, subcategory: "" }));
    }
  };

  // 3️⃣ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  // 4️⃣ Handle size changes
  const handleSizeChange = (index, field, value) => {
    const updated = [...product.sizes];
    updated[index][field] = value;
    setProduct((prev) => ({ ...prev, sizes: updated }));
  };

  const addSizeField = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", quantity: "" }],
    }));
  };

  const removeSizeField = (index) => {
    const updated = product.sizes.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, sizes: updated }));
  };

  // 5️⃣ Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      for (const key in product) {
        if (key === "sizes") {
          formData.append(key, JSON.stringify(product.sizes));
        } else if (key === "image") {
          if (product.image) formData.append("image", product.image);
        } else {
          formData.append(key, product[key]);
        }
      }

      await axios.put(`${baseURL}/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      navigate("/listProduct"); // redirect after update
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/listProduct");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
                <FaEdit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
                <p className="text-blue-100 text-sm">Update product information and inventory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaBox className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <div className="relative">
                    <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={product.productId}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-mono"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name} className="capitalize">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subcategory */}
                {subcategories.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="subcategory"
                        value={product.subcategory}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub, i) => (
                          <option key={i} value={sub} className="capitalize">
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Brand */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <div className="relative">
                    <MdBrandingWatermark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="brand"
                      value={product.brand}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <div className="relative">
                    <FaPalette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="color"
                      value={product.color}
                      onChange={handleChange}
                      placeholder="Enter color"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaDollarSign className="w-5 h-5 text-blue-600" />
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selling Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={product.sellingPrice}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Purchase Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={product.purchasePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Section */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={taxInclusive}
                    onChange={(e) => {
                      setTaxInclusive(e.target.checked);
                      if (!e.target.checked) {
                        setProduct((prev) => ({ ...prev, taxPercentage: "", taxType: "" }));
                      }
                    }}
                    className="w-5 h-5 text-blue-600 bg-white border-2 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Tax Inclusive
                  </span>
                </label>

                {taxInclusive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tax Percentage
                      </label>
                      <div className="relative">
                        <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          name="taxPercentage"
                          value={product.taxPercentage}
                          onChange={handleChange}
                          placeholder="18"
                          className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tax Type
                      </label>
                      <div className="relative">
                        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          name="taxType"
                          value={product.taxType}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none"
                        >
                          <option value="">Select Tax Type</option>
                          <option value="GST IN">GST IN</option>
                          <option value="VAT">VAT</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="expiryDate"
                      value={product.expiryDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Supplier */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier
                  </label>
                  <div className="relative">
                    <FaTruck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="supplier"
                      value={product.supplier}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers?.map((s, i) => (
                        <option key={i} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Size-wise Stock Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaRulerCombined className="w-5 h-5 text-blue-600" />
                Size-wise Stock
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                {product.sizes.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Size</label>
                      <input
                        type="text"
                        placeholder="Size (e.g., XL, 42, etc.)"
                        value={item.size}
                        onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      disabled={product.sizes.length === 1}
                      className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSizeField}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Size
                </button>
              </div>
            </div>

            {/* Product Image Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaImage className="w-5 h-5 text-blue-600" />
                Product Image
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-all file:duration-200 file:cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a new image to replace the current one
                    </p>
                  </div>
                  {product.image && (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl shadow-lg border-4 border-white"
                      />
                    </div>
                  )}
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
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
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
              <p className="font-medium mb-1">Tips for editing products:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Fields marked with <span className="text-red-500">*</span> are required</li>
                <li>Product ID cannot be modified after creation</li>
                <li>Changing category will reset the subcategory selection</li>
                <li>Upload a new image only if you want to replace the current one</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;