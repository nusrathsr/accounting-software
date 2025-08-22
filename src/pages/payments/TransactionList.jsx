// import React, { useState, useEffect } from "react";
// import {
//   List,
//   Filter,
//   Search,
//   ArrowLeft,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   User,
//   Building2,
//   Calendar,
//   DollarSign,
//   Trash2,
//   Eye,
//   MoreVertical,
//   ChevronLeft,
//   ChevronRight,
//   FileText
// } from "lucide-react";

// export default function TransactionList() {
//   const [transactions, setTransactions] = useState([]);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterType, setFilterType] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState(null);
  
//   const transactionsPerPage = 8;
//   const baseURL = "http://localhost:4000/api";

//   // Show notification
//   const showNotification = (type, title, message, duration = 3000) => {
//     setNotification({ type, title, message });
//     setTimeout(() => setNotification(null), duration);
//   };

//   // Fetch all transactions
//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${baseURL}/payments`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       setTransactions(data);
//       setFilteredTransactions(data);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//       showNotification("error", "Error", "Failed to fetch transactions. Please check server connection.");
//       setTransactions([]);
//       setFilteredTransactions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = transactions;

//     // Filter by type
//     if (filterType) {
//       filtered = filtered.filter(t => t.type === filterType);
//     }

//     // Search by customer/vendor name or notes
//     if (searchTerm) {
//       filtered = filtered.filter(t =>
//         (t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (t.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     setFilteredTransactions(filtered);
//     setCurrentPage(1);
//   }, [filterType, searchTerm, transactions]);

//   // Delete transaction
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this transaction?")) {
//       return;
//     }

//     try {
//       const response = await fetch(`${baseURL}/payments/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       showNotification("success", "Transaction Deleted!", "Transaction has been successfully removed.");
//       fetchTransactions(); // Refresh the list
//     } catch (err) {
//       console.error("Error deleting transaction:", err);
//       showNotification("error", "Error", "Failed to delete transaction. Please try again!");
//     }
//   };

//   // Pagination logic
//   const indexOfLast = currentPage * transactionsPerPage;
//   const indexOfFirst = indexOfLast - transactionsPerPage;
//   const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

//   // Get balance (same logic as your existing component)
//   const getBalance = (t) => {
//     if (t.purchaseId) return (t.purchaseId.totalAmount || 0) - (t.purchaseId.paidAmount || 0);
//     if (t.salesId) return (t.salesId.totalAmount || 0) - (t.salesId.paidAmount || 0);
//     return t.customer?.balance ?? 0;
//   };

//   // Calculate totals
//   const totalPayments = filteredTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
//   const totalReceipts = filteredTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.amount, 0);
//   const netAmount = totalReceipts - totalPayments;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Notification */}
//         {notification && (
//           <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${
//             notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
//             notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
//             'bg-yellow-50 border-yellow-200 text-yellow-800'
//           }`}>
//             <div className="flex items-start gap-3">
//               {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
//               {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
//               {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-sm">{notification.title}</h4>
//                 <p className="text-sm mt-1">{notification.message}</p>
//               </div>
//               <button 
//                 onClick={() => setNotification(null)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <XCircle className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                   <List className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">Transaction List</h1>
//                   <p className="text-blue-100 text-sm">View all payments and receipts</p>
//                 </div>
//               </div>
//               <div className="text-white text-right">
//                 <div className="text-2xl font-bold">{filteredTransactions.length}</div>
//                 <div className="text-sm text-blue-100">Total Records</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-red-100 rounded-xl p-3">
//                 <ArrowUpCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">₹{totalPayments.toLocaleString()}</div>
//                 <div className="text-sm text-gray-600">Total Payments</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-green-100 rounded-xl p-3">
//                 <ArrowDownCircle className="w-6 h-6 text-green-600" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">₹{totalReceipts.toLocaleString()}</div>
//                 <div className="text-sm text-gray-600">Total Receipts</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center gap-4">
//               <div className={`rounded-xl p-3 ${netAmount >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
//                 <DollarSign className={`w-6 h-6 ${netAmount >= 0 ? 'text-blue-600' : 'text-yellow-600'}`} />
//               </div>
//               <div>
//                 <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   ₹{Math.abs(netAmount).toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-600">Net {netAmount >= 0 ? 'Inflow' : 'Outflow'}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by customer name or notes..."
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-3">
//               <select
//                 className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">All Types</option>
//                 <option value="payment">Payments</option>
//                 <option value="receipt">Receipts</option>
//               </select>
              
//               <button
//                 onClick={() => {
//                   setFilterType("");
//                   setSearchTerm("");
//                 }}
//                 className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2"
//               >
//                 <XCircle className="w-4 h-4" />
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Transaction List */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
//             <p className="text-sm text-gray-600 mt-1">Showing {currentTransactions.length} of {filteredTransactions.length} transactions</p>
//           </div>

//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="text-gray-600 mt-2">Loading transactions...</p>
//             </div>
//           ) : currentTransactions.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//                 <List className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
//               <p className="text-gray-600">Try adjusting your filters or add some transactions.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Party</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Mode</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Balance</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Notes</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {currentTransactions.map((transaction, index) => (
//                     <tr key={transaction._id} className="hover:bg-gray-50 transition-colors duration-150">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm font-medium text-gray-900">
//                             {new Date(transaction.date).toLocaleDateString('en-IN')}
//                           </span>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
//                           transaction.type === 'payment' 
//                             ? 'bg-red-100 text-red-700' 
//                             : 'bg-green-100 text-green-700'
//                         }`}>
//                           {transaction.type === 'payment' ? (
//                             <ArrowUpCircle className="w-4 h-4" />
//                           ) : (
//                             <ArrowDownCircle className="w-4 h-4" />
//                           )}
//                           {transaction.type === 'payment' ? 'Payment' : 'Receipt'}
//                         </span>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {transaction.type === 'payment' ? (
//                             <Building2 className="w-4 h-4 text-gray-400" />
//                           ) : (
//                             <User className="w-4 h-4 text-gray-400" />
//                           )}
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {transaction.customer?.name || '-'}
//                             </div>
//                             {transaction.customer?.type && (
//                               <div className="text-xs text-gray-500">{transaction.customer.type}</div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className={`text-sm font-semibold ${
//                           transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
//                         }`}>
//                           {transaction.type === 'payment' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
//                           {transaction.mode === 'cash' ? (
//                             <Wallet className="w-4 h-4 text-gray-600" />
//                           ) : (
//                             <CreditCard className="w-4 h-4 text-gray-600" />
//                           )}
//                           <span className="capitalize font-medium text-gray-700">{transaction.mode}</span>
//                         </span>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-medium text-gray-900">
//                           ₹{getBalance(transaction).toLocaleString()}
//                         </span>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="max-w-32">
//                           {transaction.notes ? (
//                             <div className="flex items-center gap-2">
//                               <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                               <span className="text-sm text-gray-600 truncate" title={transaction.notes}>
//                                 {transaction.notes}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">-</span>
//                           )}
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleDelete(transaction._id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                           title="Delete transaction"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} transactions
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
                  
//                   <div className="flex gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
                      
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                             currentPage === pageNum
//                               ? 'bg-blue-600 text-white'
//                               : 'text-gray-600 hover:bg-white'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>
                  
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
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

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const transactionsPerPage = 8;
  const baseURL = "http://localhost:4000/api";

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Fetch both payments and sales to show all transactions
      const [paymentsResponse, salesResponse] = await Promise.all([
        fetch(`${baseURL}/payments`).catch(() => ({ ok: false })),
        fetch(`${baseURL}/sales`).catch(() => ({ ok: false }))
      ]);
      
      let allTransactions = [];
      
      // Add existing payments if API exists
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        allTransactions = [...paymentsData];
      }
      
      // Add sales invoices as transactions
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        const salesTransactions = salesData.map(sale => ({
          _id: sale._id,
          type: 'receipt',
          date: sale.saleDate || sale.createdAt,
          amount: sale.totalAmount || 0,
          mode: sale.paymentMode || 'cash',
          paymentStatus: sale.paymentStatus, // This is the key field from your sales invoice
          customer: {
            name: sale.customerName || 'Walk-in Customer',
            phone: sale.number,
            type: 'customer'
          },
          notes: `Invoice: ${sale.invoiceNumber}`,
          invoiceNumber: sale.invoiceNumber,
          // Keep original sale data for reference
          salesId: {
            totalAmount: sale.totalAmount,
            paidAmount: sale.paymentStatus ? sale.totalAmount : 0
          }
        }));
        allTransactions = [...allTransactions, ...salesTransactions];
      }
      
      // Sort by date (newest first)
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

    // Filter by type
    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Search by customer/vendor name or notes
    if (searchTerm) {
      filtered = filtered.filter(t =>
        (t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.notes?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [filterType, searchTerm, transactions]);

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      // Check if it's a sales invoice or payment
      const transaction = transactions.find(t => t._id === id);
      const endpoint = transaction.invoiceNumber ? `sales/${id}` : `payments/${id}`;
      
      const response = await fetch(`${baseURL}/${endpoint}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      showNotification("success", "Transaction Deleted!", "Transaction has been successfully removed.");
      fetchTransactions(); // Refresh the list
    } catch (err) {
      console.error("Error deleting transaction:", err);
      showNotification("error", "Error", "Failed to delete transaction. Please try again!");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Get balance (same logic as your existing component)
  const getBalance = (t) => {
    if (t.purchaseId) return (t.purchaseId.totalAmount || 0) - (t.purchaseId.paidAmount || 0);
    if (t.salesId) return (t.salesId.totalAmount || 0) - (t.salesId.paidAmount || 0);
    return t.customer?.balance ?? 0;
  };

  // Calculate totals
  const totalPayments = filteredTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
  const totalReceipts = filteredTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalReceipts - totalPayments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
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
                  {currentTransactions.map((transaction, index) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          transaction.type === 'payment' 
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
                            {transaction.customer?.phone && (
                              <div className="text-xs text-gray-500">{transaction.customer.phone}</div>
                            )}
                            {transaction.invoiceNumber && (
                              <div className="text-xs text-blue-600">{transaction.invoiceNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`text-sm font-semibold ${
                          transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'payment' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
                          {transaction.mode === 'cash' ? (
                            <Wallet className="w-4 h-4 text-gray-600" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="capitalize font-medium text-gray-700">{transaction.mode}</span>
                        </span>
                      </td>
                      
                      {/* Payment Status Column - This shows the status from your sales invoice */}
                      <td className="px-6 py-4">
                        {transaction.hasOwnProperty('paymentStatus') ? (
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.paymentStatus
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.paymentStatus ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Paid
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4" />
                                Unpaid
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{getBalance(transaction).toLocaleString()}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-32">
                          {transaction.notes ? (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate" title={transaction.notes}>
                                {transaction.notes}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}