// import React, { useEffect, useState } from "react";
// import {
//   FileText,
//   User,
//   Calendar,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   IndianRupee,
//   CreditCard,
//   CheckCircle,
//   XCircle,
//   ArrowLeft,
//   Filter,
//   AlertCircle,
//   Clock,
//   Building2,
//   Receipt
// } from "lucide-react";

// const PurchaseDue = () => {
//   const [dues, setDues] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const itemsPerPage = 8;
//   const baseURL = "http://localhost:4000/api/purchases";

//   // Show notification
//   const showNotification = (type, title, message, duration = 3000) => {
//     setNotification({ type, title, message });
//     setTimeout(() => setNotification(null), duration);
//   };

//   // Fetch dues from backend
//   const fetchDues = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${baseURL}/dues`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       setDues(data);
//     } catch (err) {
//       console.error("Error fetching dues:", err);
//       showNotification("error", "Error", "Failed to fetch purchase dues. Please check server connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDues();
//   }, []);

//   // Filter dues based on search
//   const filteredDues = dues.filter((due) => {
//     const s = search.toLowerCase();
//     return (
//       (due.vendor || "").toLowerCase().includes(s) ||
//       (due.invoiceNo || "").toLowerCase().includes(s)
//     );
//   });

//   const totalPages = Math.ceil(filteredDues.length / itemsPerPage);
//   const startIndex = (page - 1) * itemsPerPage;
//   const currentDues = filteredDues.slice(startIndex, startIndex + itemsPerPage);
//   const totalDues = dues.reduce((sum, d) => sum + (d.balanceDue || 0), 0);
//   const totalAmount = dues.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
//   const paidAmount = dues.reduce((sum, d) => sum + (d.paidAmount || 0), 0);

//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch {
//       return "—";
//     }
//   };

//   if (loading && dues.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading purchase dues...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
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

//         {/* Total Dues Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
              
//               <div className="text-center">
//                 <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                   <Clock className="w-8 h-8 text-red-600" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Pending Dues</h3>
//                 <div className="text-4xl font-bold text-red-600 mb-6">
//                   ₹{totalDues.toLocaleString()}
//                 </div>
                
//                 <div className="grid grid-cols-1 gap-4 mb-6">
//                   <div className="bg-gray-50 rounded-xl p-4">
//                     <div className="text-sm text-gray-600">Total Amount</div>
//                     <div className="text-lg font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</div>
//                   </div>
//                   <div className="bg-green-50 rounded-xl p-4">
//                     <div className="text-sm text-green-600">Paid Amount</div>
//                     <div className="text-lg font-semibold text-green-800">₹{paidAmount.toLocaleString()}</div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
//                 >
//                   Close
//                 </button>
//               </div>
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
//                   <Clock className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">Purchase Dues</h1>
//                   <p className="text-blue-100 text-sm">Track and manage pending purchase payments</p>
//                 </div>
//               </div>
//               <div className="text-white text-right">
//                 <div className="text-2xl font-bold">{dues.length}</div>
//                 <div className="text-sm text-blue-100">Pending Dues</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by vendor or invoice number..."
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//               </div>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setShowModal(true)}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold flex items-center gap-2"
//                 >
//                   <IndianRupee className="w-4 h-4" />
//                   View Total Dues
//                 </button>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Filter className="w-4 h-4" />
//                   <span>Showing {currentDues.length} of {filteredDues.length} dues</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dues Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           {currentDues.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <Clock className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending dues found</h3>
//               <p className="text-gray-500">
//                 {search ? "Try adjusting your search criteria" : "All purchase payments are up to date!"}
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Purchase Details
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Vendor
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Total Amount
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Paid Amount
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Balance Due
//                       </th>
//                       <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentDues.map((due, i) => {
//                       const idx = startIndex + i;
//                       const duePercentage = ((due.balanceDue || 0) / (due.totalAmount || 1)) * 100;
                      
//                       return (
//                         <tr key={due._id || idx} className="hover:bg-gray-50 transition-colors duration-150">
//                           {/* Purchase Details */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="bg-lue-100 rounded-lg p-2 mr-3">
//                                 <Receipt className="w-5 h-5 text-red-600" />
//                               </div>
//                               <div>
//                                 <div className="text-sm font-semibold text-gray-900">
//                                   {due.invoiceNo || "—"}
//                                 </div>
//                                 <div className="text-sm text-gray-500 flex items-center gap-1">
//                                   <Calendar className="w-3 h-3" />
//                                   {formatDate(due.date)}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Vendor */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <Building2 className="w-4 h-4 text-gray-400 mr-2" />
//                               <div>
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {due.vendor || "Unknown Vendor"}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Total Amount */}
//                           <td className="px-6 py-4 whitespace-nowrap text-right">
//                             <div className="text-sm font-medium text-gray-900">
//                               ₹{(due.totalAmount || 0).toLocaleString()}
//                             </div>
//                           </td>

//                           {/* Paid Amount */}
//                           <td className="px-6 py-4 whitespace-nowrap text-right">
//                             <div className="text-sm font-medium text-green-600">
//                               ₹{(due.paidAmount || 0).toLocaleString()}
//                             </div>
//                           </td>

//                           {/* Balance Due */}
//                           <td className="px-6 py-4 whitespace-nowrap text-right">
//                             <div className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
//                               ₹{(due.balanceDue || 0).toLocaleString()}
//                             </div>
//                           </td>

//                           {/* Status */}
//                           <td className="px-6 py-4 whitespace-nowrap text-center">
//                             <div className="space-y-2">
//                               <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                                 duePercentage === 0 
//                                   ? 'bg-green-100 text-green-800' 
//                                   : duePercentage < 50
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {duePercentage === 0 ? (
//                                   <>
//                                     <CheckCircle className="w-3 h-3" />
//                                     Paid
//                                   </>
//                                 ) : duePercentage < 50 ? (
//                                   <>
//                                     <Clock className="w-3 h-3" />
//                                     Partial
//                                   </>
//                                 ) : (
//                                   <>
//                                     <XCircle className="w-3 h-3" />
//                                     Pending
//                                   </>
//                                 )}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {duePercentage.toFixed(0)}% due
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-700">
//                       Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDues.length)} of {filteredDues.length} results
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                         className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                         Previous
//                       </button>
                      
//                       <div className="flex space-x-1">
//                         {[...Array(totalPages)].map((_, i) => (
//                           <button
//                             key={i}
//                             onClick={() => setPage(i + 1)}
//                             className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                               page === i + 1
//                                 ? "bg-red-600 text-white shadow-md"
//                                 : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200"
//                             }`}
//                           >
//                             {i + 1}
//                           </button>
//                         ))}
//                       </div>

//                       <button
//                         disabled={page === totalPages}
//                         onClick={() => setPage(page + 1)}
//                         className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
//                       >
//                         Next
//                         <ChevronRight className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Summary Cards */}
//         {dues.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center">
//                 <div className="bg-red-100 rounded-xl p-3">
//                   <Clock className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div className="ml-4">
//                   <div className="text-2xl font-bold text-gray-900">{dues.length}</div>
//                   <div className="text-sm text-gray-600">Pending Dues</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 rounded-xl p-3">
//                   <IndianRupee className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div className="ml-4">
//                   <div className="text-2xl font-bold text-gray-900">
//                     ₹{totalAmount.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-600">Total Amount</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center">
//                 <div className="bg-green-100 rounded-xl p-3">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//                 <div className="ml-4">
//                   <div className="text-2xl font-bold text-gray-900">
//                     ₹{paidAmount.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-600">Paid Amount</div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center">
//                 <div className="bg-red-100 rounded-xl p-3">
//                   <XCircle className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div className="ml-4">
//                   <div className="text-2xl font-bold text-red-600">
//                     ₹{totalDues.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-600">Balance Due</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PurchaseDue;

import React, { useEffect, useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  IndianRupee,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter,
  AlertCircle,
  Clock,
  Building2,
  Receipt
} from "lucide-react";

const PurchaseDue = () => {
  const [dues, setDues] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;
  const baseURL = "http://localhost:4000/api/purchases";

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch dues from backend
  const fetchDues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/dues`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDues(data);
    } catch (err) {
      console.error("Error fetching dues:", err);
      showNotification("error", "Error", "Failed to fetch purchase dues. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDues();
  }, []);

  // Filter dues based on search
  const filteredDues = dues.filter((due) => {
    const s = search.toLowerCase();
    return (
      (due.vendor || "").toLowerCase().includes(s) ||
      (due.invoiceNo || "").toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredDues.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentDues = filteredDues.slice(startIndex, startIndex + itemsPerPage);
  const totalDues = dues.reduce((sum, d) => sum + (d.balanceDue || 0), 0);
  const totalAmount = dues.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const paidAmount = dues.reduce((sum, d) => sum + (d.paidAmount || 0), 0);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "—";
    }
  };

  // Enhanced pagination helper functions
  const getVisiblePageNumbers = () => {
    const delta = 2; // Pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((v, i, arr) => arr.indexOf(v) === i);
  };

  if (loading && dues.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading purchase dues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
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

        {/* Total Dues Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Pending Dues</h3>
                <div className="text-4xl font-bold text-red-600 mb-6">
                  ₹{totalDues.toLocaleString()}
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-lg font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-green-600">Paid Amount</div>
                    <div className="text-lg font-semibold text-green-800">₹{paidAmount.toLocaleString()}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
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
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Purchase Dues</h1>
                  <p className="text-blue-100 text-sm">Track and manage pending purchase payments</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{dues.length}</div>
                <div className="text-sm text-blue-100">Pending Dues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by vendor or invoice number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4" />
                  View Total Dues
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>Showing {currentDues.length} of {filteredDues.length} dues</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dues Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentDues.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending dues found</h3>
              <p className="text-gray-500">
                {search ? "Try adjusting your search criteria" : "All purchase payments are up to date!"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Purchase Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Paid Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Balance Due
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDues.map((due, i) => {
                      const idx = startIndex + i;
                      const duePercentage = ((due.balanceDue || 0) / (due.totalAmount || 1)) * 100;
                      
                      return (
                        <tr key={due._id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Purchase Details */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                                <Receipt className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {due.invoiceNo || "—"}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(due.date)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vendor */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {due.vendor || "Unknown Vendor"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(due.totalAmount || 0).toLocaleString()}
                            </div>
                          </td>

                          {/* Paid Amount */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-green-600">
                              ₹{(due.paidAmount || 0).toLocaleString()}
                            </div>
                          </td>

                          {/* Balance Due */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                              ₹{(due.balanceDue || 0).toLocaleString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="space-y-2">
                              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                duePercentage === 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : duePercentage < 50
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {duePercentage === 0 ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Paid
                                  </>
                                ) : duePercentage < 50 ? (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    Partial
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Pending
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {duePercentage.toFixed(0)}% due
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredDues.length)}</span> of{' '}
                      <span className="font-medium">{filteredDues.length}</span> results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {getVisiblePageNumbers().map((pageNum, i) => (
                          pageNum === '...' ? (
                            <span key={i} className="px-3 py-2 text-sm text-gray-400">...</span>
                          ) : (
                            <button
                              key={i}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                page === pageNum
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        ))}
                      </div>

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Jump to Page */}
                  {totalPages > 10 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-600">Jump to page:</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={page}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value);
                          if (newPage >= 1 && newPage <= totalPages) {
                            setPage(newPage);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">of {totalPages}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Cards */}
        {dues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-xl p-3">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{dues.length}</div>
                  <div className="text-sm text-gray-600">Pending Dues</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-xl p-3">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-xl p-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{paidAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Paid Amount</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-xl p-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-red-600">
                    ₹{totalDues.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Balance Due</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseDue;