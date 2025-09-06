import React, { useState, useEffect, useContext } from "react";
import {
  List,
  Filter,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
  User,
  Building2,
  Calendar,
  DollarSign,
  Trash2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock
} from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import api from '../../utils/api'; 
export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { baseURL } = useContext(GlobalContext)
  const transactionsPerPage = 8;

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch all transactions
 const fetchTransactions = async () => {
    try {
      setLoading(true);
      const [paymentsData, purchasesData] = await Promise.all([
        api.get("/payments").then(res => res.data).catch(() => []),
        api.get("/purchases").then(res => res.data).catch(() => [])
      ]);

      const purchaseTransactions = purchasesData.map(purchase => ({
        _id: purchase._id,
        type: 'receipt',
        date: purchase.purchaseDate || purchase.createdAt,
        amount: purchase.totalAmount ?? 0,
        mode: purchase.paymentMode || 'cash',
        paymentStatus: purchase.paymentStatus ?? false,
        customer: {
          name: purchase.supplierName || 'Supplier',
          phone: purchase.number,
          type: 'supplier'
        },
        notes: `Purchase No: ${purchase.purchaseOrderNumber}`,
        purchaseId: {
          totalAmount: purchase.totalAmount ?? 0,
          paidAmount: purchase.paidAmount ?? 0
        }
      }));

      const allTransactions = [...paymentsData, ...purchaseTransactions];
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      showNotification("error", "Error", "Failed to fetch transactions. Please check server connection.");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = transactions;

    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        (t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered = filtered.filter(t => {
      const txDate = t.date ? new Date(t.date) : null;
      return (
        (!startDate || (txDate && txDate >= new Date(startDate))) &&
        (!endDate || (txDate && txDate <= new Date(endDate)))
      );
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [filterType, searchTerm, startDate, endDate, transactions]);

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const transaction = transactions.find(t => t._id === id);
      const endpoint = transaction.purchaseId ? `purchases/${id}` : `payments/${id}`;

     await api.delete(endpoint);

      showNotification("success", "Transaction Deleted!", "Transaction has been successfully removed.");
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      showNotification("error", "Error", "Failed to delete transaction. Please try again!");
    }
  };

  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const getBalance = (t) => {
    if (t.purchaseId) return ((t.purchaseId.totalAmount ?? 0) - (t.purchaseId.paidAmount ?? 0));
    return 0;
  };

  const totalPayments = filteredTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const totalReceipts = filteredTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const netAmount = totalReceipts - totalPayments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
              {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <List className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Transaction List</h1>
                  <p className="text-blue-100 text-sm">View all payments and receipts</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{filteredTransactions.length}</div>
                <div className="text-sm text-blue-100">Total Records</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-xl p-3">
                <ArrowUpCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{totalPayments.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Payments</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-xl p-3">
                <ArrowDownCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{totalReceipts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Receipts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${netAmount >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                <DollarSign className={`w-6 h-6 ${netAmount >= 0 ? 'text-blue-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(netAmount).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Net {netAmount >= 0 ? 'Inflow' : 'Outflow'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by customer name, invoice number, or notes..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="payment">Payments</option>
                <option value="receipt">Receipts</option>
              </select>

              <button
                onClick={() => {
                  setFilterType("");
                  setSearchTerm("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">Showing {currentTransactions.length} of {filteredTransactions.length} transactions</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading transactions...</p>
            </div>
          ) : currentTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your filters or add some transactions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Party</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Mode</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Payment Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Balance</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Notes</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.date ? new Date(transaction.date).toLocaleDateString('en-IN') : '-'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${transaction.type === 'payment'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                          {transaction.type === 'payment' ? (
                            <ArrowUpCircle className="w-4 h-4" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4" />
                          )}
                          {transaction.type === 'payment' ? 'Payment' : 'Receipt'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'payment' ? (
                            <Building2 className="w-4 h-4 text-gray-400" />
                          ) : (
                            <User className="w-4 h-4 text-gray-400" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.customer?.name || '-'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.customer?.phone || '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{(transaction.amount ?? 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.mode || '-'}</td>

                      <td className="px-6 py-4 text-sm">
                        {transaction.paymentStatus ? (
                          <span className="text-green-600 font-medium">Paid</span>
                        ) : (
                          <span className="text-red-600 font-medium">Pending</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ₹{(getBalance(transaction) ?? 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.notes || '-'}</td>

                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-all duration-150">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-red-600 hover:text-red-800 transition-all duration-150"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
