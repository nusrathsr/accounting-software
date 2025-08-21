import React, { useEffect, useState } from "react";
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
  FaTags
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState([
    {
      _id: "1",
      expenseId: "EXP-001",
      date: "2024-01-15",
      category: "Office Supplies",
      paidTo: "Staples Inc",
      paymentMethod: "Credit Card",
      amount: 2500,
      description: "Office stationery and supplies"
    },
    {
      _id: "2", 
      expenseId: "EXP-002",
      date: "2024-01-16",
      category: "Travel",
      paidTo: "Uber",
      paymentMethod: "Cash",
      amount: 850,
      description: "Business travel"
    },
    {
      _id: "3",
      expenseId: "EXP-003", 
      date: "2024-01-17",
      category: "Meals",
      paidTo: "Restaurant ABC",
      paymentMethod: "Credit Card",
      amount: 1200,
      description: "Client meeting lunch"
    },
    {
      _id: "4",
      expenseId: "EXP-004",
      date: "2024-01-18", 
      category: "Office Supplies",
      paidTo: "Amazon",
      paymentMethod: "Debit Card",
      amount: 3200,
      description: "Computer accessories"
    },
    {
      _id: "5",
      expenseId: "EXP-005",
      date: "2024-01-19",
      category: "Marketing",
      paidTo: "Google Ads",
      paymentMethod: "Online Transfer", 
      amount: 5000,
      description: "Digital advertising campaign"
    },
    {
      _id: "6",
      expenseId: "EXP-006", 
      date: "2024-01-20",
      category: "Travel",
      paidTo: "Air India",
      paymentMethod: "Credit Card",
      amount: 8500,
      description: "Business flight tickets"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(21250);
  const [categoryTotals, setCategoryTotals] = useState({
    "Office Supplies": 5700,
    "Travel": 9350, 
    "Meals": 1200,
    "Marketing": 5000
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReport = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter expenses by date if dates are provided
      let filteredExpenses = expenses;
      if (startDate && endDate) {
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
        });
      }
      
      // Recalculate totals
      const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalAmount(total);
      
      // Recalculate category totals
      const catTotals = {};
      filteredExpenses.forEach(exp => {
        catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
      });
      setCategoryTotals(catTotals);
      
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch expense report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const categoryChartData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: key,
    total: value,
  }));

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirstItem, indexOfLastItem);

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
          <p className="text-gray-600 font-medium">Loading expense report...</p>
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
                <h1 className="text-2xl md:text-3xl font-bold text-white">Expense Report</h1>
                <p className="text-blue-100 text-sm">Track and analyze your business expenses</p>
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
                  onClick={fetchReport}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                >
                  <FaSearch className="w-4 h-4" />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3">
                <FaRupeeSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 font-medium text-sm">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                <FaListUl className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 font-medium text-sm">Total Records</h3>
                <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                <FaTags className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 font-medium text-sm">Categories</h3>
                <p className="text-2xl font-bold text-green-600">{Object.keys(categoryTotals).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category-wise Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MdDashboard className="w-5 h-5 text-blue-600" />
                Expenses by Category
              </h2>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium">
                <FaFileExport className="w-4 h-4" />
                Export Chart
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
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
                  <Bar 
                    dataKey="total" 
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
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

        {/* Expense Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaTable className="w-5 h-5 text-blue-600" />
                Expense Details
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expense ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Paid To</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentExpenses.map((exp, index) => (
                        <tr key={exp._id} className="hover:bg-blue-50 transition-all duration-200">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{exp.expenseId}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(exp.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {exp.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{exp.paidTo}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{exp.paymentMethod}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-right text-red-600">₹{exp.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{exp.description}</td>
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, expenses.length)} of {expenses.length} results
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
              <p className="font-medium mb-1">Expense Report Features:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Filter expenses by date range for specific periods</li>
                <li>View category-wise breakdown with interactive charts</li>
                <li>Export data for external analysis and reporting</li>
                <li>Paginated table view for easy navigation through records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReport;