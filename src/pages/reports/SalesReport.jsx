import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  FaReceipt
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const SalesReport = () => {
  const [report, setReport] = useState({
    totalRevenue: 125000,
    totalTax: 22500,
    sales: [
      {
        _id: "1",
        invoiceNumber: "INV-001",
        customerName: "John Doe",
        date: "2024-01-15",
        totalAmount: 15000
      },
      {
        _id: "2", 
        invoiceNumber: "INV-002",
        customerName: "Jane Smith",
        date: "2024-01-16",
        totalAmount: 22500
      },
      {
        _id: "3",
        invoiceNumber: "INV-003",
        customerName: "Bob Johnson",
        date: "2024-01-17", 
        totalAmount: 18000
      },
      {
        _id: "4",
        invoiceNumber: "INV-004",
        customerName: "Alice Brown",
        date: "2024-01-18",
        totalAmount: 31000
      },
      {
        _id: "5",
        invoiceNumber: "INV-005", 
        customerName: "Charlie Wilson",
        date: "2024-01-19",
        totalAmount: 12500
      },
      {
        _id: "6",
        invoiceNumber: "INV-006",
        customerName: "Diana Davis",
        date: "2024-01-20",
        totalAmount: 26000
      }
    ]
  });
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  // Fetch report function (simulated)
  const fetchReport = async (startDate = "", endDate = "") => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, you would filter the data based on dates
      // For demo, we'll just reset pagination
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sales by default on mount
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, []);

  // Fetch report automatically when dates change
  useEffect(() => {
    fetchReport(dates.startDate, dates.endDate);
  }, [dates]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = report?.sales.slice(indexOfFirstRow, indexOfLastRow) || [];
  const totalPages = report ? Math.ceil(report.sales.length / rowsPerPage) : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Create chart data for monthly sales
  const createChartData = () => {
    if (!report?.sales) return [];
    
    const monthlyData = {};
    report.sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      monthlyData[month] = (monthlyData[month] || 0) + sale.totalAmount;
    });
    
    return Object.entries(monthlyData).map(([month, total]) => ({
      name: month,
      total: total
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading sales report...</p>
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
                <FaChartBar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Report</h1>
                <p className="text-blue-100 text-sm">Track and analyze your business sales performance</p>
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
                    value={dates.startDate}
                    onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
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
                    value={dates.endDate}
                    onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => fetchReport(dates.startDate, dates.endDate)}
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
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                    <FaRupeeSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">₹{report.totalRevenue?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-3">
                    <FaReceipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Tax</h3>
                    <p className="text-2xl font-bold text-yellow-600">₹{report.totalTax?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                    <FaListUl className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Sales</h3>
                    <p className="text-2xl font-bold text-blue-600">{report.sales?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MdDashboard className="w-5 h-5 text-blue-600" />
                    Monthly Sales Overview
                  </h2>
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
                    <FaFileExport className="w-4 h-4" />
                    Export Chart
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={createChartData()} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
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
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="url(#colorGradient)"
                        radius={[8, 8, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaTable className="w-5 h-5 text-blue-600" />
                    Sales Details
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentRows.map((sale) => (
                            <tr key={sale._id} className="hover:bg-blue-50 transition-all duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.invoiceNumber}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{sale.customerName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(sale.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-right text-green-600">
                                ₹{sale.totalAmount?.toLocaleString()}
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
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, report.sales.length)} of {report.sales.length} results
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
                  <p className="font-medium mb-1">Sales Report Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Filter sales data by specific date ranges</li>
                    <li>View monthly sales trends with interactive charts</li>
                    <li>Export sales data for external analysis and reporting</li>
                    <li>Paginated table view for easy navigation through records</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesReport;