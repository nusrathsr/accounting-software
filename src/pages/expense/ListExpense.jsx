import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalContext } from '../../context/GlobalContext';
import { 
  MdDeleteForever, 
  MdSearch,
  MdFilterList,
  MdDownload,
  MdDateRange,
  MdAttachMoney
} from "react-icons/md";
import { 
  FaRegEdit, 
  FaPlus, 
  FaChevronLeft, 
  FaChevronRight,
  FaCalendarAlt,
  FaReceipt,
  FaCreditCard,
  FaWallet,
  FaMobile,
  FaUniversity
} from "react-icons/fa";

const ListExpenses = () => {
  const { baseURL } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchExpenses();
  }, [baseURL]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseURL}/expense`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilter({ startDate: '', endDate: '' });
    setPage(1);
  };

  // Delete expense from backend
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (!result.isConfirmed) return;  

    try {
      setDeleteLoading(id);
      await axios.delete(`${baseURL}/expense/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      Swal.fire('Deleted!', 'The expense has been deleted.', 'success');
    } catch (err) {
      console.error(err);
     Swal.fire('Error!', 'Failed to delete expense.', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (!filter.startDate && !filter.endDate) return true;
    const expDate = new Date(exp.date).setHours(0, 0, 0, 0);
    const start = filter.startDate ? new Date(filter.startDate).setHours(0, 0, 0, 0) : null;
    const end = filter.endDate ? new Date(filter.endDate).setHours(0, 0, 0, 0) : null;
    if (start && end) return expDate >= start && expDate <= end;
    if (start) return expDate >= start;
    if (end) return expDate <= end;
    return true;
  });

  const totalMonthlyExpense = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const quickFilter = (type) => {
  const today = new Date();
  let start, end;

  if (type === 'lastMonth') {
    // First and last day of the previous month
    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    end = new Date(today.getFullYear(), today.getMonth(), 0);
  } else if (type === 'thisMonth') {
    // From start of this month to today
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = today;
  } else if (type === 'lastWeek') {
    // Last week = previous 7 days
    end = new Date(today); 
    start = new Date(today);
    start.setDate(today.getDate() - 7);
  } else if (type === 'lastYear') {
    // Whole last year
    start = new Date(today.getFullYear() - 1, 0, 1);
    end = new Date(today.getFullYear() - 1, 11, 31);
  }

  setFilter({
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  });
  setPage(1);
};


  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title with better formatting
    doc.setFontSize(20);
    doc.setTextColor(44, 82, 130);
    doc.text('Expense Report', 14, 25);
    
    // Add date range info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    if (filter.startDate || filter.endDate) {
      const dateRange = `Period: ${filter.startDate || 'Beginning'} to ${filter.endDate || 'Present'}`;
      doc.text(dateRange, 14, 35);
    }
    
    // Add total
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.text(`Total Expense: ₹${totalMonthlyExpense.toFixed(2)}`, 14, filter.startDate || filter.endDate ? 45 : 35);

    const tableColumn = ["ID", "Date", "Category", "Amount", "Paid To", "Payment Method"];
    const tableRows = filteredExpenses.map(exp => [
      exp.expenseId,
      new Date(exp.date).toLocaleDateString(),
      exp.category,
      `₹${exp.amount}`,
      exp.paidTo,
      exp.paymentMethod
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: filter.startDate || filter.endDate ? 55 : 45,
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    doc.autoPrint();
    doc.output('dataurlnewwindow');
  };

  // Fixed pagination calculations
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-green-100 text-green-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Others': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return <FaWallet className="w-4 h-4 text-green-600" />;
      case 'card':
      case 'credit card':
      case 'debit card':
        return <FaCreditCard className="w-4 h-4 text-blue-600" />;
      case 'upi':
        return <FaMobile className="w-4 h-4 text-purple-600" />;
      case 'bank transfer':
        return <FaUniversity className="w-4 h-4 text-indigo-600" />;
      default:
        return <MdAttachMoney className="w-4 h-4 text-gray-600" />;
    }
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
                  <FaReceipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Expense Management</h1>
                  <p className="text-blue-100 text-sm">Track and manage your business expenses</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="text-blue-100 text-xs font-medium">Total Records</div>
                  <div className="text-white text-xl font-bold">{filteredExpenses.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="text-blue-100 text-xs font-medium">Total Amount</div>
                  <div className="text-white text-xl font-bold">INR {totalMonthlyExpense.toLocaleString('en-IN')}</div>
                </div>
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <MdDownload className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdFilterList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Date Range</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="startDate"
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="endDate"
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Quick Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quick Filter</label>
              <div className="relative">
                <MdDateRange className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value === 'lastMonth') quickFilter('lastMonth');
                    if (e.target.value === 'thisMonth') quickFilter('thisMonth');
                    if(e.target.value === 'lastWeek') quickFilter('lastWeek');
                    if (e.target.value === 'lastWeek') quickFilter('lastWeek');
                    if(e.target.value === 'lastYear') quickFilter('lastYear');
                    
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="">Select Period</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisMonth">Last Week</option>
                  <option value="lastMonth">Last Year</option>
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
              Showing {paginatedExpenses.length} of {filteredExpenses.length} expenses
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading expenses...</span>
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
                        <FaReceipt className="w-4 h-4" />
                        Expense ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MdAttachMoney className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Paid To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedExpenses.length > 0 ? (
                    paginatedExpenses.map((exp, index) => (
                      <tr key={exp._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {exp.expenseId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(exp.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(exp.category)}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-green-600">
                            INR {Number(exp.amount).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{exp.paidTo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(exp.paymentMethod)}
                            <span className="text-sm text-gray-600 font-medium">{exp.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(exp._id)}
                              disabled={deleteLoading === exp._id}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                              title="Delete Expense"
                            >
                              {deleteLoading === exp._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <MdDeleteForever className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaReceipt className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                            <p className="text-gray-500 mb-4">
                              {filter.startDate || filter.endDate 
                                ? "Try adjusting your date filters" 
                                : "Get started by adding your first expense"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredExpenses.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} results
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
                    disabled={page === totalPages}
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

export default ListExpenses;

