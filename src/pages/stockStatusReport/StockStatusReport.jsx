import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import {
  FaBoxOpen,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaWarehouse
} from "react-icons/fa";

const StockStatusReport = () => {
  const { product } = useContext(GlobalContext); // products from context
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setBrandFilter("");
    setPage(1);
  };

  // Flatten products with variants for filtering and display
  const flattenedProducts = product && product.length > 0 ? 
    product.flatMap(prod => 
      prod.variants && prod.variants.length > 0 
        ? prod.variants.map(variant => ({
            ...variant,
            productName: prod.name,
            brand: prod.brand,
            category: prod.category,
            productId: prod.productId
          }))
        : [{
            productName: prod.name,
            brand: prod.brand,
            category: prod.category,
            productId: prod.productId,
            variantName: 'No variants',
            sizeOrWeight: '--',
            quantity: 0,
            purchasePrice: 0,
            sellingPrice: 0,
            variantId: `${prod.productId}-default`
          }]
    ) : [];

  // Apply filters
  const filteredProducts = flattenedProducts.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      (item.variantName && item.variantName.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "" || item.category === categoryFilter;

    const matchesBrand =
      brandFilter === "" || item.brand === brandFilter;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get unique categories and brands for filters
  const uniqueCategories = [...new Set(product?.map(p => p.category) || [])];
  const uniqueBrands = [...new Set(product?.map(p => p.brand) || [])];

  // Calculate stats
  const totalProducts = product?.length || 0;
  const totalVariants = flattenedProducts.length;
  const totalStockValue = flattenedProducts.reduce((sum, item) => 
    sum + (item.quantity * item.purchasePrice), 0);
  const lowStockItems = flattenedProducts.filter(item => item.quantity < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaBoxOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">📦 Stock Status Report</h1>
                  <p className="text-indigo-100 text-sm">Monitor your inventory levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-3">
                <FaBoxOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Variants</p>
                <p className="text-2xl font-bold text-purple-600">{totalVariants}</p>
              </div>
              <div className="bg-purple-500 rounded-lg p-3">
                <FaWarehouse className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold text-green-600">₹{totalStockValue.toLocaleString()}</p>
              </div>
              <div className="bg-green-500 rounded-lg p-3">
                <FaBoxOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
              </div>
              <div className="bg-red-500 rounded-lg p-3">
                <FaBoxOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaFilter className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
              >
                <FaUndo className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaSearch className="inline w-4 h-4 mr-2 text-blue-600" />
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Product name, brand, or variant"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product / Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Value</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Value</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  paginatedProducts.map((item, index) => (
                    <tr key={`${item.productId}-${item.variantId || index}`} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                            {item.productName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{item.productName}</div>
                            <div className="text-sm text-gray-500">Brand: {item.brand}</div>
                            <div className="text-xs text-gray-400">Category: {item.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{item.variantName || '--'}</div>
                          <div className="text-gray-500">{item.sizeOrWeight || '--'}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">{item.quantity || 0}</span>
                            <span className="text-gray-500">pcs</span>
                          </div>
                          <div className={`text-xs ${item.quantity < 10 ? 'text-red-500' : item.quantity < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {item.quantity < 10 ? 'Low Stock' : item.quantity < 50 ? 'Medium Stock' : 'Good Stock'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">Purchase: ₹{item.purchasePrice || 0}</div>
                          <div className="text-gray-500">Selling: ₹{item.sellingPrice || 0}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-green-600">
                          ₹{((item.quantity || 0) * (item.purchasePrice || 0)).toLocaleString()}
                        </div>
                      </td>
                       <td className="px-6 py-4">
                        <div className="text-lg font-bold text-green-600">
                          ₹{((item.quantity || 0) * (item.sellingPrice || 0)).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan="5">
                      <div className="text-gray-400">
                        <FaBoxOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No products found</p>
                        <p className="text-sm">Try adjusting your search criteria or add new products</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <FaChevronLeft className="w-3 h-3" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {totalPages > 0 && [...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                      }

                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === pageNum
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-indigo-800">
              <p className="font-medium mb-1">Stock Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-indigo-700">
                <li>Use the search bar to quickly find products by name, brand, or variant</li>
                <li>Filter by category or brand to narrow down results</li>
                <li>Red indicators show low stock items (less than 10 units)</li>
                <li>Stock value is calculated using purchase price × quantity</li>
                <li>Monitor the stats cards for overall inventory health</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockStatusReport;