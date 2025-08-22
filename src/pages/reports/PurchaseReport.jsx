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
import {
  FaChartBar,
  FaCalendarAlt,
  FaFilter,
  FaTable,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaFileExport,
  FaSearch,
  FaRupeeSign,
  FaListUl,
  FaTags,
  FaShoppingCart
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading purchase report...</p>
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
              <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Purchase Report</h1>
                <p className="text-blue-100 text-sm">Track and analyze your purchase orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaFilter className="w-5 h-5 text-blue-600" />
              Filter Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => fetchReport(startDate, endDate)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                >
                  <FaSearch className="w-4 h-4" />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {report && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                    <FaRupeeSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Purchase</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{report.totalPurchase.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                    <FaTags className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Tax</h3>
                    <p className="text-2xl font-bold text-green-600">₹{report.totalTax.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                    <FaRupeeSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Grand Total</h3>
                    <p className="text-2xl font-bold text-purple-600">₹{report.grandTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3">
                    <FaListUl className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Orders</h3>
                    <p className="text-2xl font-bold text-orange-600">{report.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Purchase Trend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FaChartBar className="w-5 h-5 text-blue-600" />
                      Daily Purchase Trend
                    </h2>
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
                      <FaFileExport className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dailyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#1d4ed8' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Purchases by Supplier */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <MdDashboard className="w-5 h-5 text-blue-600" />
                      Purchases by Supplier
                    </h2>
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
                      <FaFileExport className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={supplierChart} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <Bar 
                          dataKey="total" 
                          fill="url(#colorGradient)"
                          radius={[8, 8, 0, 0]}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16a34a" />
                            <stop offset="100%" stopColor="#15803d" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaTable className="w-5 h-5 text-blue-600" />
                    Purchase Details
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
                      <FaFileExport className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-gray-50 rounded-xl p-1">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PO #</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Qty</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tax %</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentPurchases.map((p) => (
                            <tr key={p._id} className="hover:bg-blue-50 transition-all duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.purchaseOrderNumber}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(p.purchaseDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {p.sellerName}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{p.product}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{p.quantity}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">₹{p.unitPrice}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{p.tax}%</td>
                              <td className="px-6 py-4 text-sm font-semibold text-right text-blue-600">
                                ₹{p.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, report.purchases.length)} of {report.purchases.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Purchase Report Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Filter purchases by date range for specific periods</li>
                    <li>View supplier-wise breakdown with interactive charts</li>
                    <li>Track daily purchase trends and patterns</li>
                    <li>Export data for external analysis and reporting</li>
                    <li>Paginated table view for easy navigation through records</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseReport;