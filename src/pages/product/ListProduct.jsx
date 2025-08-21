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
  MdShoppingCart
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
  FaRulerCombined
} from "react-icons/fa";

const ListProduct = () => {
  const { baseURL } = useContext(GlobalContext)
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Added items per page state
  
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    brand: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const categories = ['clothing', 'grocery', 'electronics'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/products`);
      const data = response.data;
      setProducts(data);
      console.log(response);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product from backend
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This product will be permanently deleted.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (!result.isConfirmed) return;

  try {
    setDeleteLoading(id);
    await axios.delete(`${baseURL}/products/${id}`);
    setProducts((prev) => prev.filter((prod) => prod._id !== id));

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'The product has been removed.',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: 'Could not delete this product. Try again later.',
    });
  } finally {
    setDeleteLoading(null);
  }
};


  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    SetPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilter({
      search: "",
      category: "",
      brand: "",
    });
    SetPage(1);
  };

  const filterProducts = products.filter((prod) => {
    const searchMatch =
      prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(filter.search.toLowerCase()) ||
      prod.productId?.toLowerCase().includes(filter.search.toLowerCase());

    const categoryMatch = filter.category ? prod.category === filter.category : true;


    return searchMatch && categoryMatch;
  });

  // pagination
  // const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filterProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  const getStockDisplay = (sizes) => {
    if (!sizes || sizes.length === 0) return "No stock";
    const totalStock = sizes.reduce((sum, size) => sum + (parseInt(size.quantity) || 0), 0);
    return totalStock;
  };

  const getStockColor = (sizes) => {
    const totalStock = getStockDisplay(sizes);
    if (totalStock === "No stock" || totalStock === 0) return "text-red-600 bg-red-50";
    if (totalStock < 10) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaBox className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Product Inventory</h1>
                  <p className="text-blue-100 text-sm">Manage your product catalog and stock levels</p>
                </div>
              </div>
              <Link
                to="/addProduct"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaPlus className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdFilterList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search Products</label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or Product ID..."
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
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
                  {categories.map((cat, i) => (
                    <option key={i} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filterProducts.length} products
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <p className="text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaBarcode className="w-4 h-4" />
                        Product ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaImage className="w-4 h-4" />
                        Image
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaBox className="w-4 h-4" />
                        Product Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdCategory className="w-4 h-4" />
                        Category
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaTag className="w-4 h-4" />
                        Brand
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="w-4 h-4" />
                        Price
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdInventory2 className="w-4 h-4" />
                        Stock
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((prod, index) => (
                    <tr key={prod._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {prod.productId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prod.image ? (
                          <img 
                            src={prod.image} 
                            alt={prod.name}
                            className="w-12  object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaImage className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{prod.name}</p>
                          {prod.sku && (
                            <p className="text-sm text-gray-500">SKU: {prod.sku}</p>
                          )}
                          {prod.subcategory && (
                            <p className="text-xs text-gray-400 capitalize">{prod.subcategory}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {prod.brand || <span className="text-gray-400">No brand</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="font-semibold text-green-600">₹{prod.sellingPrice}</p>
                          {prod.purchasePrice && (
                            <p className="text-gray-500 text-xs">Cost: ₹{prod.purchasePrice}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(prod.sizes)}`}>
                          {getStockDisplay(prod.sizes)}
                        </span>
                        {prod.sizes && prod.sizes.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {prod.sizes.slice(0, 2).map((size, idx) => (
                              <span key={idx} className="mr-2">
                                {size.size}({size.quantity})
                              </span>
                            ))}
                            {prod.sizes.length > 2 && <span>+{prod.sizes.length - 2} more</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/editProduct/${prod._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Product"
                          >
                            <FaRegEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            disabled={deleteLoading === prod._id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                            title="Delete Product"
                          >
                            {deleteLoading === prod._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <MdDeleteForever className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filterProducts.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaBox className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">
                              {filter.search || filter.category 
                                ? "Try adjusting your search filters" 
                                : "Get started by adding your first product"}
                            </p>
                            {!filter.search && !filter.category && (
                              <Link
                                to="/addProduct"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
                              >
                                <FaPlus className="w-4 h-4" />
                                Add Your First Product
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

       
                 {/* Pagination - Fixed */}
                 {!loading && filterProducts.length > 0 && (
                   <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="text-sm text-gray-700">
                           Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filterProducts.length)} of {filterProducts.length} results
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-600">Items per page:</span>
                           <select
                             value={itemsPerPage}
                             onChange={(e) => {
                               setItemsPerPage(parseInt(e.target.value));
                               setPage(1); // Reset to first page
                             }}
                             className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           >
                             <option value={5}>5</option>
                             <option value={10}>10</option>
                             <option value={20}>20</option>
                             <option value={50}>50</option>
                           </select>
                         </div>
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
                               // If 5 or fewer pages, show all
                               pageNum = i + 1;
                             } else {
                               // If more than 5 pages, show smart pagination
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
                                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                   page === pageNum
                                     ? 'bg-blue-600 text-white'
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
      </div>
    </div>
  );
};

export default ListProduct;







