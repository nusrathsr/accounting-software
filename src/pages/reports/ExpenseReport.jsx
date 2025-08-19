import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 👈 change how many rows per page

  const fetchReport = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4000/api/reports/expense", {
        params: { startDate, endDate },
      });
      setExpenses(data.expenses);
      setTotalAmount(data.totalAmount);
      setCategoryTotals(data.categoryTotals);
      setCurrentPage(1); // reset page when new data comes
    } catch (error) {
      console.error("Failed to fetch expense report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Expense Report</h2>

      {/* Date Filters */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-600 font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-600 font-medium">Total Records</h3>
          <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-600 font-medium">Categories</h3>
          <p className="text-2xl font-bold text-green-600">{Object.keys(categoryTotals).length}</p>
        </div>
      </div>

      {/* Category-wise Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-4">🏷️ Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Bar dataKey="total" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Table */}
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h3 className="font-semibold mb-4">📋 Expense Details</h3>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Expense ID</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Paid To</th>
              <th className="p-2 border">Payment Method</th>
              <th className="p-2 border">Amount (₹)</th>
              <th className="p-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map((exp) => (
              <tr key={exp._id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{exp.expenseId}</td>
                <td className="p-2 border">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="p-2 border">{exp.category}</td>
                <td className="p-2 border">{exp.paidTo}</td>
                <td className="p-2 border">{exp.paymentMethod}</td>
                <td className="p-2 border font-semibold">₹{exp.amount.toLocaleString()}</td>
                <td className="p-2 border">{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
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
  );
};

export default ExpenseReport;

