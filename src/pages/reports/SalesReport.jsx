import React, { useContext, useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
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
  FaChartLine
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10; // 👈 adjust as needed
  const { baseURL } = useContext(GlobalContext);

  // Fetch report function
  const fetchReport = async (startDate = "", endDate = "") => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axios.get(`${baseURL}/reports/sales`, { params });
      setReport(data);
      setCurrentPage(1); // reset to first page whenever new data comes
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

  // Prepare chart data
  const dailyData = report?.sales.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.totalAmount;
    return acc;
  }, {}) || {};

  const dailyChartData = Object.entries(dailyData).map(([date, total]) => ({
    date,
    total,
  }));

  const monthlyData = report?.sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + sale.totalAmount;
    return acc;
  }, {}) || {};

  const monthlyChartData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  }));

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


  const generatePDF = (salesData, filter) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(44, 82, 130);
  doc.text("Sales Report", 14, 25);

  // Date range (if filter applied)
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  if (filter.startDate || filter.endDate) {
    const dateRange = `Period: ${filter.startDate || "Beginning"} to ${
      filter.endDate || "Present"
    }`;
    doc.text(dateRange, 14, 35);
  }

  // Total Sales
  const totalSales = salesData.reduce((acc, s) => acc + s.totalAmount, 0);
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 127);
  doc.text(
    `Total Sales: INR${totalSales.toFixed(2)}`,
    14,
    filter.startDate || filter.endDate ? 45 : 35
  );

  // Table columns
  const tableColumn = [
    "Invoice No",
    "Customer",
    "Date",
    "Payment Mode",
    "Status",
    "Subtotal",
    "Tax",
    "Total",
  ];

  // Table rows
  const tableRows = salesData.map((sale) => [
    sale.invoiceNumber,
    sale.customerName || "--",
    new Date(sale.date).toLocaleDateString(),
    sale.paymentMode,
    sale.paymentStatus ? "Paid" : "Unpaid",
    `INR${sale.subtotal}`,
    `INR${sale.tax}`,
    `INR${sale.totalAmount}`,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: filter.startDate || filter.endDate ? 55 : 45,
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: 50 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ✅ Download PDF directly
  doc.save("SalesReport.pdf");
};

const handleExportPDF = () => {
  if (!report || !report.sales || report.sales.length === 0) {
    alert("No sales data to export.");
    return;
  }
  generatePDF(report.sales, dates);
};


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
                <FaChartLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Report</h1>
                <p className="text-blue-100 text-sm">Track and analyze your sales performance</p>
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
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                    <FaRupeeSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">INR{report.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-3">
                    <FaTags className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Tax</h3>
                    <p className="text-2xl font-bold text-yellow-600">INR{report.totalTax.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-blue-600">{report.sales.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                    <FaRupeeSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium text-sm">Average Sale</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      INR{report.sales.length ? (report.totalRevenue / report.sales.length).toFixed(0) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales Trend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FaChartBar className="w-5 h-5 text-blue-600" />
                      Daily Sales Trend
                    </h2>
                  
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dailyChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#16a34a" 
                          strokeWidth={3}
                          dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#15803d' }}
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
                          formatter={(value) => [`INR${value.toLocaleString()}`, 'Revenue']}
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

              {/* Monthly Sales */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <MdDashboard className="w-5 h-5 text-blue-600" />
                      Monthly Sales
                    </h2>
                   
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <Bar 
                          dataKey="total" 
                          fill="url(#colorGradient)"
                          radius={[8, 8, 0, 0]}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`INR${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                    <button  onClick={handleExportPDF} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentRows.map((s) => (
                            <tr key={s._id} className="hover:bg-blue-50 transition-all duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.invoiceNumber}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {s.customerName}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(s.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-right text-green-600">
                                INR{s.totalAmount.toLocaleString()}
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
                    <li>Filter sales by date range for specific periods</li>
                    <li>View daily and monthly sales trends with interactive charts</li>
                    <li>Track total revenue, tax, and average sale amounts</li>
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

export default SalesReport;