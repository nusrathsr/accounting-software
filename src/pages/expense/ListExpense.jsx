import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalContext } from '../../context/GlobalContext';

const ListExpenses = () => {
  const { baseURL } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/expense`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilter({ startDate: '', endDate: '' });
    setPage(1);
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
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (type === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
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

  // Pagination
  const itemsPerPage = 8;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedExpense = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
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
        return '💵';
      case 'card':
      case 'credit card':
      case 'debit card':
        return '💳';
      case 'upi':
        return '📱';
      case 'bank transfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            {/* Title and Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Expense Tracker
                </h1>
                <p className="text-gray-600 mt-1">Manage and track your expenses efficiently</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-medium opacity-90">Total Records</div>
                  <div className="text-xl font-bold">{filteredExpenses.length}</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-medium opacity-90">Total Amount</div>
                  <div className="text-xl font-bold">₹{totalMonthlyExpense.toFixed(0)}</div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-red-600 hover:to-pink-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white shadow-sm"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white shadow-sm"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quick Filter</label>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value === 'lastMonth') quickFilter('lastMonth');
                    if (e.target.value === 'thisMonth') quickFilter('thisMonth');
                  }}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white shadow-sm min-w-[140px]"
                >
                  <option value="">Select Period</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>
              </div>
            </div>
            
            {(filter.startDate || filter.endDate) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Paid To</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredExpenses.length > 0 ? (
                      paginatedExpense.map((exp, index) => (
                        <tr 
                          key={exp._id} 
                          className={`transition-colors duration-150 hover:bg-blue-50 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {exp.expenseId}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(exp.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(exp.category)}`}>
                              {exp.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-semibold text-green-600">
                              ₹{Number(exp.amount).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {exp.paidTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getPaymentMethodIcon(exp.paymentMethod)}</span>
                              <span className="text-sm text-gray-600 font-medium">{exp.paymentMethod}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No expenses found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add some expenses</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Always show when there are expenses */}
              {filteredExpenses.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-t border-gray-200">
                  {/* Mobile Pagination */}
                  <div className="flex justify-center items-center gap-4 sm:hidden mb-4">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Page {page} of {Math.max(totalPages, 1)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages || totalPages <= 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                    >
                      Next
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                        Showing <span className="font-semibold text-blue-600">{Math.min(startIndex + 1, filteredExpenses.length)}</span> to{' '}
                        <span className="font-semibold text-blue-600">{Math.min(startIndex + itemsPerPage, filteredExpenses.length)}</span> of{' '}
                        <span className="font-semibold text-blue-600">{filteredExpenses.length}</span> results
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 shadow-sm transition-all duration-200"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(Math.max(totalPages, 1))].map((_, i) => {
                          const pageNum = i + 1;
                          if (totalPages <= 1) {
                            return (
                              <button
                                key={pageNum}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm"
                              >
                                1
                              </button>
                            );
                          }
                          if (pageNum === page) {
                            return (
                              <button
                                key={pageNum}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm"
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded-lg shadow-sm transition-all duration-200"
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          if (pageNum === page - 2 || pageNum === page + 2) {
                            return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages || totalPages <= 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 shadow-sm transition-all duration-200"
                      >
                        Next
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Items per page selector */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Items per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          const newItemsPerPage = parseInt(e.target.value);
                          // You would need to add setItemsPerPage to state if you want this to be dynamic
                          // For now, it shows the current value
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListExpenses;