// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaBoxOpen,
//   FaCalendarAlt,
//   FaFilter,
//   FaTable,
//   FaArrowLeft,
//   FaChevronLeft,
//   FaChevronRight,
//   FaFileExport,
//   FaSearch,
//   FaRupeeSign,
//   FaListUl,
//   FaTags,
//   FaWarehouse
// } from "react-icons/fa";
// import { MdInventory } from "react-icons/md";
// import { GlobalContext } from "../../context/GlobalContext";

// const StockReport = () => {
//   const {baseURL}=useContext(GlobalContext)
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchReport = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${baseURL}/reports/stock`);
//       setReport(res.data.report);
//     } catch (error) {
//       console.error("Failed to fetch stock report:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReport();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading stock report...</p>
//         </div>
//       </div>
//     );
//   }

//   // 🔹 Filter by search
//   const filteredReport = report.filter(
//     (item) =>
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.sku.toLowerCase().includes(search.toLowerCase()) ||
//       item.category.toLowerCase().includes(search.toLowerCase()) ||
//       item.brand.toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔹 Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredReport.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = Math.ceil(filteredReport.length / rowsPerPage);

//   // 🔹 Totals
//   const totalStockValue = filteredReport.reduce(
//     (acc, item) => acc + item.stockValue,
//     0
//   );
//   const totalClosingStock = filteredReport.reduce(
//     (acc, item) => acc + item.closingStock,
//     0
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
//             <div className="flex items-center gap-4">
//               <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
//                 <FaArrowLeft className="w-5 h-5" />
//               </button>
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                 <FaBoxOpen className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-white">Stock Report</h1>
//                 <p className="text-blue-100 text-sm">Monitor and analyze your inventory levels</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <FaFilter className="w-5 h-5 text-blue-600" />
//               Filter Stock Report
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Search Products
//                 </label>
//                 <div className="relative">
//                   <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Search by name, SKU, category, brand..."
//                     value={search}
//                     onChange={(e) => {
//                       setSearch(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Rows Per Page
//                 </label>
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                 >
//                   <option value={5}>5 rows</option>
//                   <option value={10}>10 rows</option>
//                   <option value={20}>20 rows</option>
//                   <option value={50}>50 rows</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
//                 <FaListUl className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-gray-600 font-medium text-sm">Total Products</h3>
//                 <p className="text-2xl font-bold text-blue-600">{filteredReport.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
//                 <FaWarehouse className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-gray-600 font-medium text-sm">Total Closing Stock</h3>
//                 <p className="text-2xl font-bold text-green-600">{totalClosingStock.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
//                 <FaRupeeSign className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-gray-600 font-medium text-sm">Total Stock Value</h3>
//                 <p className="text-2xl font-bold text-purple-600">₹{totalStockValue.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-3">
//                 <FaTags className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-gray-600 font-medium text-sm">Total Categories</h3>
//                 <p className="text-2xl font-bold text-yellow-600">
//                   {new Set(filteredReport.map((item) => item.category)).size}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stock Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                 <FaTable className="w-5 h-5 text-blue-600" />
//                 Stock Details
//               </h2>
//               <div className="flex gap-2">
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
//                   <FaFileExport className="w-4 h-4" />
//                   Export
//                 </button>
//               </div>
//             </div>

//             {/* Table Container */}
//             <div className="bg-gray-50 rounded-xl p-1">
//               <div className="bg-white rounded-lg overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full">
//                     <thead>
//                       <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
//                         <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
//                         <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
//                         <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
//                         <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subcategory</th>
//                         <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Brand</th>
//                         <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Opening Stock</th>
//                         <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Purchases</th>
//                         <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sales</th>
//                         <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Closing Stock</th>
//                         <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Cost/Unit</th>
//                         <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Selling Price</th>
//                         <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Stock Value</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {currentRows.map((item, idx) => (
//                         <tr key={item.productId} className="hover:bg-blue-50 transition-all duration-200">
//                           <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.sku}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
//                             {item.name}
//                           </td>
//                           <td className="px-6 py-4">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                               {item.category}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-600">{item.subcategory}</td>
//                           <td className="px-6 py-4 text-sm text-gray-600">{item.brand}</td>
//                           <td className="px-6 py-4 text-sm text-center text-gray-600">{item.openingStock}</td>
//                           <td className="px-6 py-4 text-sm text-center text-green-600 font-medium">{item.purchases}</td>
//                           <td className="px-6 py-4 text-sm text-center text-red-600 font-medium">{item.sales}</td>
//                           <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">
//                             {item.closingStock}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-right text-gray-600">₹{item.costPerUnit}</td>
//                           <td className="px-6 py-4 text-sm text-right text-gray-600">₹{item.sellingPrice}</td>
//                           <td className="px-6 py-4 text-sm font-bold text-right text-purple-600">
//                             ₹{item.stockValue.toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
//               <div className="text-sm text-gray-600">
//                 Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredReport.length)} of {filteredReport.length} results
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <FaChevronLeft className="w-4 h-4" />
//                   Previous
//                 </button>
                
//                 <div className="flex gap-1">
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => handlePageChange(i + 1)}
//                       className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                         currentPage === i + 1
//                           ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
//                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                 </div>
                
//                 <button
//                   className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                   <FaChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Help Text */}
//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
//           <div className="flex items-start gap-3">
//             <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <span className="text-white text-xs font-bold">i</span>
//             </div>
//             <div className="text-sm text-blue-800">
//               <p className="font-medium mb-1">Stock Report Features:</p>
//               <ul className="list-disc list-inside space-y-1 text-blue-700">
//                 <li>Search and filter products by name, SKU, category, or brand</li>
//                 <li>View comprehensive stock movement including opening, purchases, sales, and closing stock</li>
//                 <li>Monitor total stock value and category-wise distribution</li>
//                 <li>Export data for external analysis and inventory planning</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockReport;



import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { GlobalContext } from "../../context/GlobalContext";

const StockReport = () => {
  const { baseURL } = useContext(GlobalContext);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/reports/stock`);

      // 🔹 Directly use variant-level data
      const variantData = res.data.report.map((v) => ({
        productId: v.product?.productId || "-",
        sku: v.variantId || v._id,
        name: v.variantName || "-",
        brand: v.product?.brand || "-",
        category: v.product?.category || "-",
        subcategory: v.product?.subcategory || "-",
        openingStock: v.openingStock || 0,
        purchases: v.purchases || 0,
        sales: v.sales || 0,
        closingStock: v.quantity || 0,
        costPerUnit: v.purchasePrice || 0,
        sellingPrice: v.sellingPrice || 0,
        stockValue: (v.quantity || 0) * (v.purchasePrice || 0),
      }));

      setReport(variantData);
    } catch (error) {
      console.error("Failed to fetch stock report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-gray-600 font-medium">Loading stock report...</p>
      </div>
    );
  }

  // 🔹 Safe filtering
  const filteredReport = report.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const sku = item.sku?.toLowerCase() || "";
    const category = item.category?.toLowerCase() || "";
    const brand = item.brand?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      sku.includes(search.toLowerCase()) ||
      category.includes(search.toLowerCase()) ||
      brand.includes(search.toLowerCase())
    );
  });

  // 🔹 Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReport.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReport.length / rowsPerPage);

  // 🔹 Totals
  const totalStockValue = filteredReport.reduce(
    (acc, item) => acc + (item.stockValue || 0),
    0
  );
  const totalClosingStock = filteredReport.reduce(
    (acc, item) => acc + (item.closingStock || 0),
    0
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Search */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-blue-600" />
            <h2 className="text-lg font-semibold">Filter Stock Report</h2>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, category, brand..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-lg px-3 py-2"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm">Total Variants</h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredReport.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm">Total Closing Stock</h3>
            <p className="text-2xl font-bold text-green-600">
              {totalClosingStock.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm">Total Stock Value</h3>
            <p className="text-2xl font-bold text-purple-600">
              ₹{totalStockValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Variant Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-center">Opening</th>
                <th className="px-4 py-3 text-center">Purchases</th>
                <th className="px-4 py-3 text-center">Sales</th>
                <th className="px-4 py-3 text-center">Closing</th>
                <th className="px-4 py-3 text-right">Cost/Unit</th>
                <th className="px-4 py-3 text-right">Selling Price</th>
                <th className="px-4 py-3 text-right">Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.brand}</td>
                  <td className="px-4 py-2 text-center">{item.openingStock}</td>
                  <td className="px-4 py-2 text-center text-green-600">
                    {item.purchases}
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">
                    {item.sales}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold">
                    {item.closingStock}
                  </td>
                  <td className="px-4 py-2 text-right">₹{item.costPerUnit}</td>
                  <td className="px-4 py-2 text-right">
                    ₹{item.sellingPrice}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-purple-600">
                    ₹{item.stockValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstRow + 1}–
            {Math.min(indexOfLastRow, filteredReport.length)} of{" "}
            {filteredReport.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReport;

