import React, { useEffect, useState } from "react";
import axios from "axios";

const StockReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReport = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/reports/stock");
      setReport(res.data.report);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch stock report:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">Loading...</p>
    );

  // 🔹 Filter by search
  const filteredReport = report.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReport.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReport.length / rowsPerPage);

  // 🔹 Totals
  const totalStockValue = filteredReport.reduce(
    (acc, item) => acc + item.stockValue,
    0
  );
  const totalClosingStock = filteredReport.reduce(
    (acc, item) => acc + item.closingStock,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 Stock Report</h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-gray-500 font-medium mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredReport.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-gray-500 font-medium mb-2">Total Closing Stock</h3>
          <p className="text-2xl font-bold text-green-600">{totalClosingStock}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-gray-500 font-medium mb-2">Total Stock Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            ₹{totalStockValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-gray-500 font-medium mb-2">Total Categories</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {new Set(filteredReport.map((item) => item.category)).size}
          </p>
        </div>
      </div>

      {/* Search + Rows Per Page */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name, SKU, category, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={50}>50 rows</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-gray-600 text-left">
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Opening Stock</th>
              <th className="px-4 py-3">Purchases</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Closing Stock</th>
              <th className="px-4 py-3">Cost/Unit (₹)</th>
              <th className="px-4 py-3">Selling Price (₹)</th>
              <th className="px-4 py-3">Stock Value (₹)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((item, idx) => (
              <tr
                key={item.productId}
                className={
                  idx % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }
              >
                <td className="px-4 py-2">{item.sku}</td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  {item.name}
                </td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.subcategory}</td>
                <td className="px-4 py-2">{item.brand}</td>
                <td className="px-4 py-2">{item.openingStock}</td>
                <td className="px-4 py-2">{item.purchases}</td>
                <td className="px-4 py-2">{item.sales}</td>
                <td className="px-4 py-2 font-semibold">
                  {item.closingStock}
                </td>
                <td className="px-4 py-2">₹{item.costPerUnit}</td>
                <td className="px-4 py-2">₹{item.sellingPrice}</td>
                <td className="px-4 py-2 font-bold text-purple-600">
                  ₹{item.stockValue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockReport;

