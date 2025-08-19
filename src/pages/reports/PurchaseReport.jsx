import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const PurchaseReport = () => {
  const { baseURL } = useContext(GlobalContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 👈 adjust rows per page

  const fetchReport = async (start = "", end = "") => {
    try {
      setLoading(true);
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const { data } = await axios.get(`${baseURL}/reports/purchase`, {
        params,
      });
      setReport(data);
      setCurrentPage(1); // reset page on new fetch
    } catch (error) {
      console.log("Error fetching report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchReport(startDate, endDate);
  }, [startDate, endDate]);

  // Prepare chart data
  const dailyData =
    report?.purchases.map((p) => ({
      date: new Date(p.purchaseDate).toLocaleDateString(),
      total: p.totalAmount,
    })) || [];

  const supplierData =
    report?.purchases.reduce((acc, p) => {
      const supplier = p.sellerName || "Unknown";
      acc[supplier] = (acc[supplier] || 0) + p.totalAmount;
      return acc;
    }, {}) || {};

  const supplierChart = Object.entries(supplierData).map(([name, total]) => ({
    name,
    total,
  }));

  // Pagination logic
  const totalPages = report ? Math.ceil(report.purchases.length / itemsPerPage) : 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPurchases = report ? report.purchases.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Purchase Report
      </h2>

      {/* Date Inputs */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {loading && <p className="text-gray-500 italic">Loading...</p>}

      {report && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h3 className="text-sm font-medium text-gray-600">Total Purchase</h3>
              <p className="text-xl font-bold text-blue-600">
                ₹{report.totalPurchase.toLocaleString()}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h3 className="text-sm font-medium text-gray-600">Total Tax</h3>
              <p className="text-xl font-bold text-green-600">
                ₹{report.totalTax.toLocaleString()}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h3 className="text-sm font-medium text-gray-600">Grand Total</h3>
              <p className="text-xl font-bold text-purple-600">
                ₹{report.grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <p className="text-xl font-bold text-orange-600">
                {report.totalOrders}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">📈 Daily Purchase Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyData}>
                  <Line type="monotone" dataKey="total" stroke="#2563eb" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">🏢 Purchases by Supplier</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={supplierChart}>
                  <Bar dataKey="total" fill="#16a34a" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">📋 Purchase Details</h3>
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">PO #</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Supplier</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Qty</th>
                  <th className="px-4 py-2 border">Unit Price</th>
                  <th className="px-4 py-2 border">Tax %</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentPurchases.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{p.purchaseOrderNumber}</td>
                    <td className="px-4 py-2 border">
                      {new Date(p.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">{p.sellerName}</td>
                    <td className="px-4 py-2 border">{p.product}</td>
                    <td className="px-4 py-2 border">{p.quantity}</td>
                    <td className="px-4 py-2 border">₹{p.unitPrice}</td>
                    <td className="px-4 py-2 border">{p.tax}%</td>
                    <td className="px-4 py-2 border">
                      ₹{p.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReport;
