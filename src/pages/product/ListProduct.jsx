import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';
import {
  MdDeleteForever,
  MdCategory,
  MdSearch,
  MdFilterList,
  MdInventory2,
  MdViewModule,
  MdViewList,
  MdSort,
  MdRefresh,
  MdVisibility,
  MdTrendingUp,
  MdTrendingDown
} from "react-icons/md";
import {
  FaRegEdit,
  FaBox,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaBarcode,
  FaTag,
  FaDollarSign,
  FaImage,
  FaFilter,
  FaDownload,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";

const ListProduct = () => {
  const { baseURL } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filter, setFilter] = useState({ search: "", category: "", sortBy: "name", sortOrder: "asc", stockFilter: "all" });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/products`);
      setProducts(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch products. Please try again.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (productsData) => {
    const total = productsData.length;
    let lowStock = 0;
    let outOfStock = 0;

    productsData.forEach(product => {
      const totalStock = product.variants && product.variants.length > 0
        ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
        : product.quantity || 0;

      if (totalStock === 0) outOfStock++;
      else if (totalStock < 10) lowStock++;
    });

    setStats({ total, lowStock, outOfStock });
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), fetchCategories()]);
    setRefreshing(false);
    Swal.fire({
      icon: 'success',
      title: 'Refreshed!',
      text: 'Product data has been updated.',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This product will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-6 py-2',
        cancelButton: 'rounded-xl px-6 py-2'
      }
    });

    if (!result.isConfirmed) return;

    try {
      setDeleteLoading(id);
      await axios.delete(`${baseURL}/products/${id}`);
      const updatedProducts = products.filter((prod) => prod._id !== id);
      setProducts(updatedProducts);
      calculateStats(updatedProducts);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The product has been removed.',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' }
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Could not delete this product.',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilter({ search: "", category: "", sortBy: "name", sortOrder: "asc", stockFilter: "all" });
    setPage(1);
  };

  // Enhanced filtering and sorting
  const filterAndSortProducts = () => {
    let filtered = products.filter(prod => {
      const searchMatch = prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        prod.productId.toLowerCase().includes(filter.search.toLowerCase()) ||
        (prod.brand && prod.brand.toLowerCase().includes(filter.search.toLowerCase()));
      const categoryMatch = filter.category ? prod.category === filter.category : true;

      // Stock filter
      const totalStock = prod.variants && prod.variants.length > 0
        ? prod.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
        : prod.quantity || 0;

      let stockMatch = true;
      if (filter.stockFilter === 'outOfStock') stockMatch = totalStock === 0;
      else if (filter.stockFilter === 'lowStock') stockMatch = totalStock > 0 && totalStock < 10;
      else if (filter.stockFilter === 'inStock') stockMatch = totalStock >= 10;

      return searchMatch && categoryMatch && stockMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filter.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.sellingPrice || (a.variants && a.variants[0]?.sellingPrice) || 0;
          bValue = b.sellingPrice || (b.variants && b.variants[0]?.sellingPrice) || 0;
          break;
        case 'stock':
          aValue = a.variants ? a.variants.reduce((sum, v) => sum + (v.quantity || 0), 0) : a.quantity || 0;
          bValue = b.variants ? b.variants.reduce((sum, v) => sum + (v.quantity || 0), 0) : b.quantity || 0;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filter.sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    return filtered;
  };

  const filteredProducts = filterAndSortProducts();
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getStockDisplay = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  };

  const getStockColor = (variants, quantity = 0) => {
    const totalStock = variants && variants.length > 0 ? getStockDisplay(variants) : quantity;
    if (totalStock === 0) return "text-red-600 bg-red-50 border-red-200";
    if (totalStock < 10) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      ['Product ID', 'Name', 'Category', 'Brand', 'Stock', 'Price'].join(','),
      ...filteredProducts.map(prod => [
        prod.productId,
        `"${prod.name}"`,
        prod.category,
        prod.brand || '',
        prod.variants ? getStockDisplay(prod.variants) : prod.quantity || 0,
        prod.sellingPrice || (prod.variants && prod.variants[0]?.sellingPrice) || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">

        {/* Enhanced Header with Statistics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaBox className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Product Inventory</h1>
                  <p className="text-blue-100 text-sm">Manage your product catalog and stock levels</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                >
                  <MdRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  <FaDownload className="w-4 h-4" /> Export
                </button>
                <Link
                  to="/addProduct"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaPlus className="w-4 h-4" /> Add Product
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBox className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdInventory2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total - stats.outOfStock - stats.lowStock}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MdTrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MdTrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MdFilterList className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
              {(filter.search || filter.category || filter.stockFilter !== 'all') && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {[filter.search, filter.category, filter.stockFilter !== 'all' ? filter.stockFilter : ''].filter(Boolean).length} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <MdViewList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <MdViewModule className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search Products</label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or brand..."
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <div className="relative">
                <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name} className="capitalize">{cat.name}</option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* Stock Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stock Status</label>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  name="stockFilter"
                  value={filter.stockFilter}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="inStock">In Stock (10+)</option>
                  <option value="lowStock">Low Stock (1-9)</option>
                  <option value="outOfStock">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <div className="relative">
                <MdSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="sortBy"
                  value={filter.sortBy}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Sort Order Toggle */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Order:</span>
            <button
              onClick={() => handleFilterChange({ target: { name: 'sortOrder', value: filter.sortOrder === 'asc' ? 'desc' : 'asc' } })}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
            >
              {filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              {filter.sortOrder === 'asc' ? <MdTrendingUp className="w-4 h-4" /> : <MdTrendingDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            // Table View
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaBarcode className="w-4 h-4" /> Product ID</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaImage className="w-4 h-4" /> Image</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaCalendarAlt className="w-4 h-4" /> Expiry Date</div>
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaBox className="w-4 h-4" /> Product Details</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><MdCategory className="w-4 h-4" /> Category</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaDollarSign className="w-4 h-4" /> Pricing</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><MdInventory2 className="w-4 h-4" /> Stock</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-lg border">
                          {prod.productId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative group">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                              <FaImage className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {prod.expiryDate ? new Date(prod.expiryDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">{prod.name}</p>
                          {prod.brand && <p className="text-xs text-gray-500 flex items-center gap-1"><FaTag className="w-3 h-3" /> {prod.brand}</p>}
                          {prod.subcategory && <p className="text-xs text-gray-400 capitalize">{prod.subcategory}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {prod.variants && prod.variants.length > 0 ? (
                            <div className="space-y-1">
                              {prod.variants.slice(0, 2).map((v, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-green-50 border border-green-200 rounded-lg px-2 py-1"
                                >
                                  <span className="font-medium text-green-800">₹{v.sellingPrice || 0}</span>
                                  <span className="text-green-600 ml-1">({v.variantName || "Unnamed"})</span>
                                </div>
                              ))}
                              {prod.variants.length > 2 && (
                                <p className="text-xs text-gray-500">+{prod.variants.length - 2} more variants</p>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm">
                              <p className="font-semibold text-green-600">₹{prod.sellingPrice || 0}</p>
                              <p className="text-xs text-gray-500">Cost: ₹{prod.purchasePrice || 0}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockColor(prod.variants, prod.quantity)}`}
                          >
                            {prod.variants && prod.variants.length > 0
                              ? getStockDisplay(prod.variants)
                              : prod.quantity || 0} units
                          </span>
                          {prod.variants && prod.variants.length > 1 && (
                            <div className="text-xs text-gray-500">
                              {prod.variants.length} variants
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/editProduct/${prod._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group"
                            title="Edit Product"
                          >
                            <FaRegEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            disabled={deleteLoading === prod._id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 group"
                            title="Delete Product"
                          >
                            {deleteLoading === prod._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <MdDeleteForever className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid View
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaImage className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      {prod.expiryDate && (
                  <p className="text-xs text-gray-500">
                    Expiry: {new Date(prod.expiryDate).toLocaleDateString()}
                  </p>
                )}

                      {/* Stock Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockColor(prod.variants, prod.quantity)}`}
                        >
                          {prod.variants && prod.variants.length > 0
                            ? getStockDisplay(prod.variants)
                            : prod.quantity || 0}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 capitalize backdrop-blur-sm">
                          {prod.category}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-3">
                      {/* Product ID */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          {prod.productId}
                        </span>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/editProduct/${prod._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Product"
                          >
                            <FaRegEdit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            disabled={deleteLoading === prod._id}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                            title="Delete Product"
                          >
                            {deleteLoading === prod._id ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600"></div>
                            ) : (
                              <MdDeleteForever className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Product Name */}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {prod.name}
                        </h3>
                        {prod.brand && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FaTag className="w-3 h-3" /> {prod.brand}
                          </p>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-1">
                        {prod.variants && prod.variants.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-green-600">
                                ₹{Math.min(...prod.variants.map(v => v.sellingPrice || 0))}
                              </span>
                              <span className="text-xs text-gray-500">
                                {prod.variants.length} variants
                              </span>
                            </div>
                            {prod.variants.length > 1 && (
                              <p className="text-xs text-gray-400">
                                Starting from ₹{Math.min(...prod.variants.map(v => v.sellingPrice || 0))}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600">₹{prod.sellingPrice || 0}</span>
                            <span className="text-xs text-gray-400">Cost: ₹{prod.purchasePrice || 0}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      {prod.subcategory && (
                        <p className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-1 rounded">
                          {prod.subcategory}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <FaBox className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {filter.search || filter.category || filter.stockFilter !== 'all'
                      ? 'No products match your filters'
                      : 'No products found'
                    }
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {filter.search || filter.category || filter.stockFilter !== 'all'
                      ? 'Try adjusting your search filters or clear all filters to see more results.'
                      : 'Get started by adding your first product to the inventory.'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {(filter.search || filter.category || filter.stockFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200"
                    >
                      <FaFilter className="w-4 h-4" /> Clear Filters
                    </button>
                  )}
                  {!filter.search && !filter.category && filter.stockFilter === 'all' && (
                    <Link
                      to="/addProduct"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                    >
                      <FaPlus className="w-4 h-4" /> Add Your First Product
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Info */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                  </span>
                  {filteredProducts.length !== products.length && (
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      Filtered from {products.length} total
                    </span>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                  {/* Items per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[4, 8, 12, 16, 20].map((n) => (
                        <option key={n} value={n}>{n} per page</option>
                      ))}
                    </select>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      title="First page"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      <FaChevronLeft className="w-3 h-3 -ml-1" />
                    </button>
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      title="Previous page"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${page === pageNum
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      title="Next page"
                    >
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      title="Last page"
                    >
                      <FaChevronRight className="w-3 h-3" />
                      <FaChevronRight className="w-3 h-3 -ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;