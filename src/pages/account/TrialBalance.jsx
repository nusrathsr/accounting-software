// // import React, { useEffect, useState } from "react";
// // import { Printer, FileDown, FileSpreadsheet, Filter } from "lucide-react";
// // import api from "../../utils/api";

// // const TrialBalance = () => {
// //   const [trialBalance, setTrialBalance] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [fromDate, setFromDate] = useState("2025-04-01");
// //   const [toDate, setToDate] = useState("2025-11-03");
// //   const [branch, setBranch] = useState("Main Branch");
// //   const [viewType, setViewType] = useState("Ledger-wise");
// //   const [showZeroBalance, setShowZeroBalance] = useState(false);
// //   const [includeOpening, setIncludeOpening] = useState(true);

// //   const [totals, setTotals] = useState({
// //     totalDebit: 0,
// //     totalCredit: 0,
// //     difference: 0,
// //     activeAccounts: 0
// //   });

// //   useEffect(() => {
// //     const fetchTrialBalance = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await api.get("/trial-balance");
// //         console.log("Trial Balance API Response:", response.data);

// //         const data = response.data.trialBalance || [];
// //         setTrialBalance(data);

// //         const totalDebit = data.reduce((sum, item) => sum + (item.debit || 0), 0);
// //         const totalCredit = data.reduce((sum, item) => sum + (item.credit || 0), 0);
// //         const difference = totalDebit - totalCredit;
// //         const activeAccounts = data.length;

// //         setTotals({ totalDebit, totalCredit, difference, activeAccounts });
// //       } catch (err) {
// //         console.error("Error fetching trial balance:", err);
// //         setError("Failed to fetch trial balance. Please try again.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTrialBalance();
// //   }, []);

// //   const handleGenerate = () => {
// //     // Trigger API call with new parameters
// //     console.log("Generating report with:", { fromDate, toDate, branch, viewType });
// //   };

// //   const handleReset = () => {
// //     setFromDate("2025-04-01");
// //     setToDate("2025-11-03");
// //     setBranch("Main Branch");
// //     setViewType("Ledger-wise");
// //     setShowZeroBalance(false);
// //     setIncludeOpening(true);
// //   };

// //   const handlePrint = () => {
// //     window.print();
// //   };

// //   const handlePDF = () => {
// //     console.log("Export to PDF");
// //   };

// //   const handleExcel = () => {
// //     console.log("Export to Excel");
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading trial balance...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gray-50">
// //         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
// //           <p className="text-red-600">{error}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl shadow-lg p-8 text-white">
// //           <h1 className="text-4xl font-bold text-center mb-2">TRIAL BALANCE</h1>
// //           <p className="text-center text-xl opacity-90">
// //             ABC Supermarket & General Store
// //           </p>
// //           <p className="text-center opacity-75 mt-1">
// //             Financial Period: 01 April 2025 to 03 November 2025
// //           </p>
// //         </div>

// //         {/* Report Parameters */}
// //         <div className="bg-white shadow-lg p-6 border-x border-gray-200">
// //           <div className="flex items-center mb-4">
// //             <Filter className="w-5 h-5 text-blue-600 mr-2" />
// //             <h2 className="text-lg font-semibold text-gray-800">Report Parameters</h2>
// //           </div>
          
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
// //               <input
// //                 type="date"
// //                 value={fromDate}
// //                 onChange={(e) => setFromDate(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
// //               <input
// //                 type="date"
// //                 value={toDate}
// //                 onChange={(e) => setToDate(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Company / Branch</label>
// //               <select
// //                 value={branch}
// //                 onChange={(e) => setBranch(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option>Main Branch</option>
// //                 <option>Branch 1</option>
// //                 <option>Branch 2</option>
// //               </select>
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
// //               <select
// //                 value={viewType}
// //                 onChange={(e) => setViewType(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option>Ledger-wise</option>
// //                 <option>Group-wise</option>
// //                 <option>Detailed View</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="flex gap-6">
// //               <label className="flex items-center text-sm text-gray-700">
// //                 <input
// //                   type="checkbox"
// //                   checked={showZeroBalance}
// //                   onChange={(e) => setShowZeroBalance(e.target.checked)}
// //                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
// //                 />
// //                 Show Zero Balance Accounts
// //               </label>
              
// //               <label className="flex items-center text-sm text-gray-700">
// //                 <input
// //                   type="checkbox"
// //                   checked={includeOpening}
// //                   onChange={(e) => setIncludeOpening(e.target.checked)}
// //                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
// //                 />
// //                 Include Opening Balance
// //               </label>
// //             </div>

// //             <div className="flex gap-3">
// //               <button
// //                 onClick={handleReset}
// //                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
// //               >
// //                 <span>Reset</span>
// //               </button>
// //               <button
// //                 onClick={handleGenerate}
// //                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
// //               >
// //                 <span>Generate</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Summary Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-x border-gray-200">
// //           <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow">
// //             <div className="text-sm text-gray-600 mb-1">TOTAL DEBIT</div>
// //             <div className="text-2xl font-bold text-gray-800">₹ {totals.totalDebit.toLocaleString()}</div>
// //             <div className="mt-2">
// //               <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">Debit Side</span>
// //             </div>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 shadow">
// //             <div className="text-sm text-gray-600 mb-1">TOTAL CREDIT</div>
// //             <div className="text-2xl font-bold text-gray-800">₹ {totals.totalCredit.toLocaleString()}</div>
// //             <div className="mt-2">
// //               <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full">Credit Side</span>
// //             </div>
// //           </div>

// //           <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 shadow">
// //             <div className="text-sm text-gray-600 mb-1">DIFFERENCE</div>
// //             <div className="text-2xl font-bold text-gray-800">₹ {totals.difference.toLocaleString()}</div>
// //             <div className="mt-2">
// //               <span className="inline-block bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">Balanced</span>
// //             </div>
// //           </div>

// //           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4 shadow">
// //             <div className="text-sm text-gray-600 mb-1">LEDGER ACCOUNTS</div>
// //             <div className="text-2xl font-bold text-gray-800">{totals.activeAccounts}</div>
// //             <div className="mt-2">
// //               <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Active Accounts</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table Section */}
// //         <div className="bg-white shadow-lg p-6 border-x border-gray-200">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="flex items-center gap-2">
// //               <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
// //                 <span className="text-blue-600 font-bold">📊</span>
// //               </div>
// //               <h3 className="text-lg font-semibold text-gray-800">Trial Balance Statement</h3>
// //               <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
// //                 Ledger-wise View
// //               </span>
// //             </div>

// //             <div className="flex gap-2">
// //               <button
// //                 onClick={handlePrint}
// //                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
// //               >
// //                 <Printer className="w-4 h-4" />
// //                 Print
// //               </button>
// //               <button
// //                 onClick={handlePDF}
// //                 className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
// //               >
// //                 <FileDown className="w-4 h-4" />
// //                 PDF
// //               </button>
// //               <button
// //                 onClick={handleExcel}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
// //               >
// //                 <FileSpreadsheet className="w-4 h-4" />
// //                 Excel
// //               </button>
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr className="bg-gray-100 border-b-2 border-gray-300">
// //                   <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">#</th>
// //                   <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">LEDGER NAME</th>
// //                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">DEBIT TOTAL (₹)</th>
// //                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">CREDIT TOTAL (₹)</th>
// //                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">NET BALANCE (₹)</th>
// //                   <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">NATURE</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {trialBalance.map((entry, index) => (
// //                   <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
// //                     <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
// //                     <td className="px-4 py-3 text-sm text-gray-800 font-medium">{entry.account_name}</td>
// //                     <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.debit || 0).toLocaleString()}</td>
// //                     <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.credit || 0).toLocaleString()}</td>
// //                     <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">{(entry.balance || 0).toLocaleString()}</td>
// //                     <td className="px-4 py-3 text-center">
// //                       <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
// //                         entry.nature === "Dr" 
// //                           ? "bg-red-100 text-red-700" 
// //                           : "bg-green-100 text-green-700"
// //                       }`}>
// //                         {entry.nature || "—"}
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //               <tfoot>
// //                 <tr className="bg-gray-200 border-t-2 border-gray-400">
// //                   <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-800">GRAND TOTAL:</td>
// //                   <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{totals.totalDebit.toLocaleString()}</td>
// //                   <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{totals.totalCredit.toLocaleString()}</td>
// //                   <td className="px-4 py-3 text-sm text-gray-600 text-right">—</td>
// //                   <td className="px-4 py-3 text-center">
// //                     <span className="inline-block px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs font-medium">✓</span>
// //                   </td>
// //                 </tr>
// //               </tfoot>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Footer Message */}
// //         <div className="bg-green-600 rounded-b-2xl shadow-lg p-4 text-white text-center">
// //           <div className="flex items-center justify-center gap-2">
// //             <span className="text-2xl">✓</span>
// //             <span className="font-medium">Trial Balance is Balanced! Total Debits = Total Credits</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TrialBalance;

// import React, { useEffect, useState } from "react";
// import { Printer, FileDown, FileSpreadsheet, Filter } from "lucide-react";
// import api from "../../utils/api";


// const TrialBalance = () => {
//   const [trialBalance, setTrialBalance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState("2025-04-01");
//   const [toDate, setToDate] = useState("2025-11-03");
//   const [branch, setBranch] = useState("Main Branch");
//   const [viewType, setViewType] = useState("Ledger-wise");
//   const [showZeroBalance, setShowZeroBalance] = useState(false);
//   const [includeOpening, setIncludeOpening] = useState(true);

//   const [totals, setTotals] = useState({
//     totalDebit: 0,
//     totalCredit: 0,
//     difference: 0,
//     activeAccounts: 0
//   });

//   const fetchTrialBalance = async (params = {}) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Build query parameters
//       const queryParams = new URLSearchParams({
//         fromDate: params.fromDate || fromDate,
//         toDate: params.toDate || toDate,
//         branch: params.branch || branch,
//         viewType: params.viewType || viewType,
//         showZeroBalance: params.showZeroBalance !== undefined ? params.showZeroBalance : showZeroBalance,
//         includeOpening: params.includeOpening !== undefined ? params.includeOpening : includeOpening
//       });

//       const response = await api.get(`/trial-balance?${queryParams.toString()}`);
//       console.log("Trial Balance API Response:", response.data);

//       const data = response.data.trialBalance || [];
//       setTrialBalance(data);

//       const totalDebit = data.reduce((sum, item) => sum + (item.debit || 0), 0);
//       const totalCredit = data.reduce((sum, item) => sum + (item.credit || 0), 0);
//       const difference = totalDebit - totalCredit;
//       const activeAccounts = data.length;

//       setTotals({ totalDebit, totalCredit, difference, activeAccounts });
//     } catch (err) {
//       console.error("Error fetching trial balance:", err);
//       setError("Failed to fetch trial balance. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrialBalance();
//   }, []);

//   const handleGenerate = () => {
//     // Trigger API call with new parameters
//     console.log("Generating report with:", { fromDate, toDate, branch, viewType, showZeroBalance, includeOpening });
//     fetchTrialBalance({
//       fromDate,
//       toDate,
//       branch,
//       viewType,
//       showZeroBalance,
//       includeOpening
//     });
//   };

//   const handleReset = () => {
//     setFromDate("2025-04-01");
//     setToDate("2025-11-03");
//     setBranch("Main Branch");
//     setViewType("Ledger-wise");
//     setShowZeroBalance(false);
//     setIncludeOpening(true);
    
//     // Fetch with reset parameters
//     fetchTrialBalance({
//       fromDate: "2025-04-01",
//       toDate: "2025-11-03",
//       branch: "Main Branch",
//       viewType: "Ledger-wise",
//       showZeroBalance: false,
//       includeOpening: true
//     });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handlePDF = () => {
//     console.log("Export to PDF");
//   };

//   const handleExcel = () => {
//     console.log("Export to Excel");
//   };

//   // Group data by account group for group-wise view
//   const getGroupedData = () => {
//     if (viewType !== "Group-wise") return null;

//     const grouped = {};
//     trialBalance.forEach(entry => {
//       const group = entry.group || entry.account_group || "Ungrouped";
//       if (!grouped[group]) {
//         grouped[group] = {
//           items: [],
//           totalDebit: 0,
//           totalCredit: 0,
//           totalBalance: 0
//         };
//       }
//       grouped[group].items.push(entry);
//       grouped[group].totalDebit += entry.debit || 0;
//       grouped[group].totalCredit += entry.credit || 0;
//       grouped[group].totalBalance += entry.balance || 0;
//     });

//     return grouped;
//   };

//   const renderLedgerWiseView = () => (
//     <tbody>
//       {trialBalance.map((entry, index) => (
//         <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//           <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
//           <td className="px-4 py-3 text-sm text-gray-800 font-medium">{entry.account_name}</td>
//           <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.debit || 0).toLocaleString()}</td>
//           <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.credit || 0).toLocaleString()}</td>
//           <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">{(entry.balance || 0).toLocaleString()}</td>
//           <td className="px-4 py-3 text-center">
//             <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//               entry.nature === "Dr" 
//                 ? "bg-red-100 text-red-700" 
//                 : "bg-green-100 text-green-700"
//             }`}>
//               {entry.nature || "—"}
//             </span>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   );

//   const renderGroupWiseView = () => {
//     const groupedData = getGroupedData();
//     if (!groupedData) return null;

//     let rowIndex = 0;
//     return (
//       <tbody>
//         {Object.entries(groupedData).map(([groupName, groupData], groupIndex) => (
//           <React.Fragment key={groupIndex}>
//             {/* Group Header */}
//             <tr className="bg-blue-50 border-y-2 border-blue-200">
//               <td colSpan="2" className="px-4 py-3 text-sm font-bold text-blue-800">
//                 {groupName}
//               </td>
//               <td className="px-4 py-3 text-sm font-semibold text-blue-800 text-right">
//                 {groupData.totalDebit.toLocaleString()}
//               </td>
//               <td className="px-4 py-3 text-sm font-semibold text-blue-800 text-right">
//                 {groupData.totalCredit.toLocaleString()}
//               </td>
//               <td className="px-4 py-3 text-sm font-semibold text-blue-800 text-right">
//                 {groupData.totalBalance.toLocaleString()}
//               </td>
//               <td className="px-4 py-3 text-center">
//                 <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
//                   GROUP
//                 </span>
//               </td>
//             </tr>
            
//             {/* Group Items */}
//             {groupData.items.map((entry, itemIndex) => {
//               rowIndex++;
//               return (
//                 <tr key={`${groupIndex}-${itemIndex}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3 text-sm text-gray-600">{rowIndex}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800 font-medium pl-8">{entry.account_name}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.debit || 0).toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800 text-right">{(entry.credit || 0).toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">{(entry.balance || 0).toLocaleString()}</td>
//                   <td className="px-4 py-3 text-center">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                       entry.nature === "Dr" 
//                         ? "bg-red-100 text-red-700" 
//                         : "bg-green-100 text-green-700"
//                     }`}>
//                       {entry.nature || "—"}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </tbody>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading trial balance...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <p className="text-red-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl shadow-lg p-8 text-white">
//           <h1 className="text-4xl font-bold text-center mb-2">TRIAL BALANCE</h1>
//           {/* <p className="text-center text-xl opacity-90">
//             ABC Supermarket & General Store
//           </p>
//           <p className="text-center opacity-75 mt-1">
//             Financial Period: {new Date(fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} to {new Date(toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
//           </p> */}
//         </div>

//         {/* Report Parameters */}
//         <div className="bg-white shadow-lg p-6 border-x border-gray-200">
//           <div className="flex items-center mb-4">
//             <Filter className="w-5 h-5 text-blue-600 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-800">Report Parameters</h2>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Company / Branch</label>
//               <select
//                 value={branch}
//                 onChange={(e) => setBranch(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option>Main Branch</option>
//                 <option>Branch 1</option>
//                 <option>Branch 2</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
//               <select
//                 value={viewType}
//                 onChange={(e) => setViewType(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option>Ledger-wise</option>
//                 <option>Group-wise</option>
//                 <option>Detailed View</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex gap-6">
//               <label className="flex items-center text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={showZeroBalance}
//                   onChange={(e) => setShowZeroBalance(e.target.checked)}
//                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 Show Zero Balance Accounts
//               </label>
              
//               <label className="flex items-center text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={includeOpening}
//                   onChange={(e) => setIncludeOpening(e.target.checked)}
//                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 Include Opening Balance
//               </label>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleReset}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
//               >
//                 <span>Reset</span>
//               </button>
//               <button
//                 onClick={handleGenerate}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 <span>Generate</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-x border-gray-200">
//           <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow">
//             <div className="text-sm text-gray-600 mb-1">TOTAL DEBIT</div>
//             <div className="text-2xl font-bold text-gray-800">₹ {totals.totalDebit.toLocaleString()}</div>
//             <div className="mt-2">
//               <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">Debit Side</span>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 shadow">
//             <div className="text-sm text-gray-600 mb-1">TOTAL CREDIT</div>
//             <div className="text-2xl font-bold text-gray-800">₹ {totals.totalCredit.toLocaleString()}</div>
//             <div className="mt-2">
//               <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full">Credit Side</span>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 shadow">
//             <div className="text-sm text-gray-600 mb-1">DIFFERENCE</div>
//             <div className="text-2xl font-bold text-gray-800">₹ {totals.difference.toLocaleString()}</div>
//             <div className="mt-2">
//               <span className="inline-block bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
//                 {totals.difference === 0 ? "Balanced" : "Unbalanced"}
//               </span>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4 shadow">
//             <div className="text-sm text-gray-600 mb-1">LEDGER ACCOUNTS</div>
//             <div className="text-2xl font-bold text-gray-800">{totals.activeAccounts}</div>
//             <div className="mt-2">
//               <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Active Accounts</span>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white shadow-lg p-6 border-x border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
//                 <span className="text-blue-600 font-bold">📊</span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Trial Balance Statement</h3>
//               <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
//                 {viewType}
//               </span>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={handlePrint}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </button>
//               <button
//                 onClick={handlePDF}
//                 className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
//               >
//                 <FileDown className="w-4 h-4" />
//                 PDF
//               </button>
//               <button
//                 onClick={handleExcel}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 <FileSpreadsheet className="w-4 h-4" />
//                 Excel
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 border-b-2 border-gray-300">
//                   <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">#</th>
//                   <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
//                     {viewType === "Group-wise" ? "GROUP / LEDGER NAME" : "LEDGER NAME"}
//                   </th>
//                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">DEBIT TOTAL (₹)</th>
//                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">CREDIT TOTAL (₹)</th>
//                   <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">NET BALANCE (₹)</th>
//                   <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">NATURE</th>
//                 </tr>
//               </thead>
              
//               {viewType === "Group-wise" ? renderGroupWiseView() : renderLedgerWiseView()}
              
//               <tfoot>
//                 <tr className="bg-gray-200 border-t-2 border-gray-400">
//                   <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-800">GRAND TOTAL:</td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{totals.totalDebit.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{totals.totalCredit.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600 text-right">—</td>
//                   <td className="px-4 py-3 text-center">
//                     <span className="inline-block px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs font-medium">✓</span>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>

//         {/* Footer Message */}
//         <div className={`${totals.difference === 0 ? 'bg-green-600' : 'bg-red-600'} rounded-b-2xl shadow-lg p-4 text-white text-center`}>
//           <div className="flex items-center justify-center gap-2">
//             <span className="text-2xl">{totals.difference === 0 ? '✓' : '⚠'}</span>
//             <span className="font-medium">
//               {totals.difference === 0 
//                 ? 'Trial Balance is Balanced! Total Debits = Total Credits'
//                 : `Trial Balance is Unbalanced! Difference: ₹${Math.abs(totals.difference).toLocaleString()}`
//               }
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrialBalance;

// import React, { useEffect, useState } from "react";
// import { 
//   Book,
//   Search,
//   Filter,
//   FileDown,
//   Calendar,
//   DollarSign,
//   ArrowUp,
//   ArrowDown,
//   Printer,
//   FileText,
//   FileSpreadsheet
// } from "lucide-react";
// import api from "../../utils/api";

// const TrialBalance = () => {
//   const [trialBalance, setTrialBalance] = useState([]);
//   const [filteredTrialBalance, setFilteredTrialBalance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState("2025-04-01");
//   const [toDate, setToDate] = useState("2025-11-03");
//   const [branch, setBranch] = useState("Main Branch");
//   const [viewType, setViewType] = useState("Ledger-wise");
//   const [showZeroBalance, setShowZeroBalance] = useState(false);
//   const [includeOpening, setIncludeOpening] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [totals, setTotals] = useState({
//     totalDebit: 0,
//     totalCredit: 0,
//     difference: 0,
//     activeAccounts: 0
//   });

//   const fetchTrialBalance = async (params = {}) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const queryParams = new URLSearchParams({
//         fromDate: params.fromDate || fromDate,
//         toDate: params.toDate || toDate,
//         branch: params.branch || branch,
//         viewType: params.viewType || viewType,
//         showZeroBalance: params.showZeroBalance !== undefined ? params.showZeroBalance : showZeroBalance,
//         includeOpening: params.includeOpening !== undefined ? params.includeOpening : includeOpening
//       });

//       const response = await api.get(`/trial-balance?${queryParams.toString()}`);
//       console.log("Trial Balance API Response:", response.data);

//       const data = response.data.trialBalance || [];
//       setTrialBalance(data);
//       setFilteredTrialBalance(data);

//       calculateTotals(data);
//     } catch (err) {
//       console.error("Error fetching trial balance:", err);
//       setError("Failed to fetch trial balance. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotals = (data) => {
//     const totalDebit = data.reduce((sum, item) => sum + (item.debit || 0), 0);
//     const totalCredit = data.reduce((sum, item) => sum + (item.credit || 0), 0);
//     const difference = totalDebit - totalCredit;
//     const activeAccounts = data.length;

//     setTotals({ totalDebit, totalCredit, difference, activeAccounts });
//   };

//   useEffect(() => {
//     fetchTrialBalance();
//   }, []);

//   useEffect(() => {
//     filterTrialBalance();
//   }, [searchTerm, trialBalance]);

//   const filterTrialBalance = () => {
//     let filtered = [...trialBalance];

//     if (searchTerm) {
//       filtered = filtered.filter(entry => 
//         entry.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         entry.group?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredTrialBalance(filtered);
//     calculateTotals(filtered);
//   };

//   const handleGenerate = () => {
//     console.log("Generating report with:", { fromDate, toDate, branch, viewType, showZeroBalance, includeOpening });
//     fetchTrialBalance({
//       fromDate,
//       toDate,
//       branch,
//       viewType,
//       showZeroBalance,
//       includeOpening
//     });
//   };

//   const handleReset = () => {
//     setFromDate("2025-04-01");
//     setToDate("2025-11-03");
//     setBranch("Main Branch");
//     setViewType("Ledger-wise");
//     setShowZeroBalance(false);
//     setIncludeOpening(true);
//     setSearchTerm("");
    
//     fetchTrialBalance({
//       fromDate: "2025-04-01",
//       toDate: "2025-11-03",
//       branch: "Main Branch",
//       viewType: "Ledger-wise",
//       showZeroBalance: false,
//       includeOpening: true
//     });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handlePDF = () => {
//     console.log("Export to PDF");
//   };

//   const handleExcel = () => {
//     const headers = ["#", "Account Name", "Debit", "Credit", "Balance", "Nature"];
//     const csvData = filteredTrialBalance.map((entry, index) => [
//       index + 1,
//       entry.account_name,
//       entry.debit || 0,
//       entry.credit || 0,
//       entry.balance || 0,
//       entry.nature || ""
//     ]);

//     const csv = [
//       headers.join(","),
//       ...csvData.map(row => row.join(","))
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `trial_balance_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   const getGroupedData = () => {
//     if (viewType !== "Group-wise") return null;

//     const grouped = {};
//     filteredTrialBalance.forEach(entry => {
//       const group = entry.group || entry.account_group || "Ungrouped";
//       if (!grouped[group]) {
//         grouped[group] = {
//           items: [],
//           totalDebit: 0,
//           totalCredit: 0,
//           totalBalance: 0
//         };
//       }
//       grouped[group].items.push(entry);
//       grouped[group].totalDebit += entry.debit || 0;
//       grouped[group].totalCredit += entry.credit || 0;
//       grouped[group].totalBalance += entry.balance || 0;
//     });

//     return grouped;
//   };

//   const renderLedgerWiseView = () => (
//     <tbody className="divide-y divide-gray-100">
//       {filteredTrialBalance.map((entry, index) => (
//         <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
//           <td className="px-6 py-4 whitespace-nowrap">
//             <span className="text-sm text-gray-600">{index + 1}</span>
//           </td>
//           <td className="px-6 py-4">
//             <span className="text-sm font-medium text-gray-900">{entry.account_name}</span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-right">
//             <span className={`text-sm font-semibold ${
//               entry.debit > 0 ? 'text-green-600' : 'text-gray-400'
//             }`}>
//               {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
//             </span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-right">
//             <span className={`text-sm font-semibold ${
//               entry.credit > 0 ? 'text-red-600' : 'text-gray-400'
//             }`}>
//               {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
//             </span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-right">
//             <span className="text-sm font-semibold text-gray-900">
//               ₹{Math.abs(entry.balance || 0).toLocaleString('en-IN')}
//             </span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-center">
//             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//               entry.nature === "Dr" 
//                 ? "bg-green-100 text-green-700" 
//                 : "bg-red-100 text-red-700"
//             }`}>
//               {entry.nature || "—"}
//             </span>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   );

//   const renderGroupWiseView = () => {
//     const groupedData = getGroupedData();
//     if (!groupedData) return null;

//     let rowIndex = 0;
//     return (
//       <tbody className="divide-y divide-gray-100">
//         {Object.entries(groupedData).map(([groupName, groupData], groupIndex) => (
//           <React.Fragment key={groupIndex}>
//             <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y-2 border-blue-200">
//               <td colSpan="2" className="px-6 py-4">
//                 <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">
//                   📁 {groupName}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-right">
//                 <span className="text-sm font-bold text-blue-800">
//                   ₹{groupData.totalDebit.toLocaleString('en-IN')}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-right">
//                 <span className="text-sm font-bold text-blue-800">
//                   ₹{groupData.totalCredit.toLocaleString('en-IN')}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-right">
//                 <span className="text-sm font-bold text-blue-800">
//                   ₹{Math.abs(groupData.totalBalance).toLocaleString('en-IN')}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-center">
//                 <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
//                   GROUP
//                 </span>
//               </td>
//             </tr>
            
//             {groupData.items.map((entry, itemIndex) => {
//               rowIndex++;
//               return (
//                 <tr key={`${groupIndex}-${itemIndex}`} className="hover:bg-gray-50 transition-colors duration-150">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm text-gray-600">{rowIndex}</span>
//                   </td>
//                   <td className="px-6 py-4 pl-12">
//                     <span className="text-sm font-medium text-gray-900">{entry.account_name}</span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <span className={`text-sm font-semibold ${
//                       entry.debit > 0 ? 'text-green-600' : 'text-gray-400'
//                     }`}>
//                       {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <span className={`text-sm font-semibold ${
//                       entry.credit > 0 ? 'text-red-600' : 'text-gray-400'
//                     }`}>
//                       {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right">
//                     <span className="text-sm font-semibold text-gray-900">
//                       ₹{Math.abs(entry.balance || 0).toLocaleString('en-IN')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                       entry.nature === "Dr" 
//                         ? "bg-green-100 text-green-700" 
//                         : "bg-red-100 text-red-700"
//                     }`}>
//                       {entry.nature || "—"}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </tbody>
//     );
//   };
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-lg p-20">
//             <div className="flex flex-col items-center justify-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
//               <p className="text-gray-600 font-medium">Loading trial balance...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-8">
//             <div className="flex items-center gap-3 text-red-700">
//               <Book className="w-6 h-6" />
//               <p className="font-semibold text-lg">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                   <DollarSign className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">Trial Balance</h1>
//                 </div>
//               </div>
//               <button
//                 onClick={handleExcel}
//                 className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
//               >
//                 <FileDown className="w-4 h-4" />
//                 Export CSV
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
//                 <ArrowUp className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">Total Debit</p>
//             <p className="text-3xl font-bold text-gray-900">₹{totals.totalDebit.toLocaleString('en-IN')}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
//                 <ArrowDown className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">Total Credit</p>
//             <p className="text-3xl font-bold text-gray-900">₹{totals.totalCredit.toLocaleString('en-IN')}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className={`p-3 rounded-xl ${
//                 totals.difference === 0 
//                   ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
//                   : 'bg-gradient-to-br from-orange-500 to-orange-600'
//               }`}>
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">Difference</p>
//             <p className={`text-3xl font-bold ${
//               totals.difference === 0 ? 'text-blue-600' : 'text-orange-600'
//             }`}>
//               ₹{Math.abs(totals.difference).toLocaleString('en-IN')}
//             </p>
//             <p className="text-xs text-gray-500 mt-2">
//               {totals.difference === 0 ? '✓ Balanced' : '⚠ Unbalanced'}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
//                 <Book className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">Active Accounts</p>
//             <p className="text-3xl font-bold text-gray-900">{totals.activeAccounts}</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-4 h-4 text-gray-600" />
//             <h2 className="text-lg font-semibold text-gray-900">Report Parameters</h2>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             {/* From Date */}
//             <div className="relative">
//               <label className="block text-xs font-medium text-gray-700 mb-2">From Date</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             </div>

//             {/* To Date */}
//             <div className="relative">
//               <label className="block text-xs font-medium text-gray-700 mb-2">To Date</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             </div>

//             {/* Branch */}
//             {/* <div className="relative">
//               <label className="block text-xs font-medium text-gray-700 mb-2">Company / Branch</label>
//               <select
//                 value={branch}
//                 onChange={(e) => setBranch(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//               >
//                 <option>Main Branch</option>
//                 <option>Branch 1</option>
//                 <option>Branch 2</option>
//               </select>
//             </div> */}

//             {/* View Type */}
//             <div className="relative">
//               <label className="block text-xs font-medium text-gray-700 mb-2">View Type</label>
//               <select
//                 value={viewType}
//                 onChange={(e) => setViewType(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//               >
//                 <option>Ledger-wise</option>
//                 <option>Group-wise</option>
//                 <option>Detailed View</option>
//               </select>
//             </div>
//           </div>

//           {/* Search and Checkboxes */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search accounts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//               />
//             </div>

//             <div className="flex items-center gap-6">
//               <label className="flex items-center text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={showZeroBalance}
//                   onChange={(e) => setShowZeroBalance(e.target.checked)}
//                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 Show Zero Balance
//               </label>
              
//               <label className="flex items-center text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={includeOpening}
//                   onChange={(e) => setIncludeOpening(e.target.checked)}
//                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 Include Opening
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={handleReset}
//               className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
//             >
//               Reset
//             </button>
//             <button
//               onClick={handleGenerate}
//               className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium"
//             >
//               Generate Report
//             </button>
//           </div>
//         </div>

//         {/* Trial Balance Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Trial Balance Statement ({filteredTrialBalance.length})
//                 </h2>
//                 <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                   {viewType}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handlePrint}
//                   className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200"
//                 >
//                   <Printer className="w-4 h-4" />
//                   Print
//                 </button>
//                 <button
//                   onClick={handlePDF}
//                   className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all duration-200"
//                 >
//                   <FileText className="w-4 h-4" />
//                   PDF
//                 </button>
//                 <button
//                   onClick={handleExcel}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   <span className="hidden md:inline">Excel</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {filteredTrialBalance.length === 0 ? (
//             <div className="p-20 text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
//                 <DollarSign className="w-10 h-10 text-gray-400" />
//               </div>
//               <p className="text-lg font-semibold text-gray-700 mb-2">No accounts found</p>
//               <p className="text-sm text-gray-500">
//                 {searchTerm 
//                   ? "Try adjusting your search"
//                   : "Trial balance entries will appear here once transactions are recorded"}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       #
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       {viewType === "Group-wise" ? "GROUP / ACCOUNT NAME" : "ACCOUNT NAME"}
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Debit
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Credit
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Balance
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Nature
//                     </th>
//                   </tr>
//                 </thead>
                
//                 {viewType === "Group-wise" ? renderGroupWiseView() : renderLedgerWiseView()}
                
//                 <tfoot className="bg-gray-50 border-t-2 border-gray-300">
//                   <tr>
//                     <td colSpan="2" className="px-6 py-4 text-right">
//                       <span className="text-sm font-bold text-gray-900 uppercase">Grand Total:</span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className="text-sm font-bold text-green-600">
//                         ₹{totals.totalDebit.toLocaleString('en-IN')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className="text-sm font-bold text-red-600">
//                         ₹{totals.totalCredit.toLocaleString('en-IN')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className="text-sm font-bold text-gray-900">
//                         —
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         totals.difference === 0 
//                           ? 'bg-green-100 text-green-700' 
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {totals.difference === 0 ? '✓ Balanced' : '⚠ Unbalanced'}
//                       </span>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Balance Status Footer */}
//         <div className={`rounded-2xl shadow-lg p-6 text-white text-center ${
//           totals.difference === 0 
//             ? 'bg-gradient-to-r from-green-600 to-green-700' 
//             : 'bg-gradient-to-r from-red-600 to-red-700'
//         }`}>
//           <div className="flex items-center justify-center gap-3">
//             <span className="text-2xl">{totals.difference === 0 ? '✓' : '⚠'}</span>
//             <div>
//               <span className="font-bold text-lg">
//                 {totals.difference === 0 
//                   ? 'Trial Balance is Balanced!' 
//                   : 'Trial Balance is Unbalanced!'}
//               </span>
//               <p className="text-sm opacity-90 mt-1">
//                 {totals.difference === 0 
//                   ? 'Total Debits = Total Credits' 
//                   : `Difference: ₹${Math.abs(totals.difference).toLocaleString('en-IN')}`}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrialBalance;

import React, { useEffect, useState } from "react";
import { 
  Book,
  Search,
  Filter,
  FileDown,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Printer,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import api from "../../utils/api";

const TrialBalance = () => {
  const [trialBalance, setTrialBalance] = useState([]);
  const [filteredTrialBalance, setFilteredTrialBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-11-03");
  const [branch, setBranch] = useState("Main Branch");
  const [viewType, setViewType] = useState("Ledger-wise");
  const [showZeroBalance, setShowZeroBalance] = useState(false);
  const [includeOpening, setIncludeOpening] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [totals, setTotals] = useState({
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
    activeAccounts: 0
  });

  const fetchTrialBalance = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        fromDate: params.fromDate || fromDate,
        toDate: params.toDate || toDate,
        branch: params.branch || branch,
        viewType: params.viewType || viewType,
        showZeroBalance: params.showZeroBalance !== undefined ? params.showZeroBalance : showZeroBalance,
        includeOpening: params.includeOpening !== undefined ? params.includeOpening : includeOpening
      });

      const response = await api.get(`/trial-balance?${queryParams.toString()}`);
      console.log("Trial Balance API Response:", response.data);

      const data = response.data.trialBalance || [];
      setTrialBalance(data);
      setFilteredTrialBalance(data);

      calculateTotals(data);
    } catch (err) {
      console.error("Error fetching trial balance:", err);
      setError("Failed to fetch trial balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    const totalDebit = data.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = data.reduce((sum, item) => sum + (item.credit || 0), 0);
    const difference = totalDebit - totalCredit;
    const activeAccounts = data.length;

    setTotals({ totalDebit, totalCredit, difference, activeAccounts });
  };

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  useEffect(() => {
    filterTrialBalance();
  }, [searchTerm, trialBalance]);

  const filterTrialBalance = () => {
    let filtered = [...trialBalance];

    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.group?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTrialBalance(filtered);
    calculateTotals(filtered);
  };

  const handleGenerate = () => {
    console.log("Generating report with:", { fromDate, toDate, branch, viewType, showZeroBalance, includeOpening });
    fetchTrialBalance({
      fromDate,
      toDate,
      branch,
      viewType,
      showZeroBalance,
      includeOpening
    });
  };

  const handleReset = () => {
    setFromDate("2025-04-01");
    setToDate("2025-11-03");
    setBranch("Main Branch");
    setViewType("Ledger-wise");
    setShowZeroBalance(false);
    setIncludeOpening(true);
    setSearchTerm("");
    
    fetchTrialBalance({
      fromDate: "2025-04-01",
      toDate: "2025-11-03",
      branch: "Main Branch",
      viewType: "Ledger-wise",
      showZeroBalance: false,
      includeOpening: true
    });
  };

  const handleShowZeroBalanceChange = (checked) => {
    setShowZeroBalance(checked);
    fetchTrialBalance({
      fromDate,
      toDate,
      branch,
      viewType,
      showZeroBalance: checked,
      includeOpening
    });
  };

  const handleIncludeOpeningChange = (checked) => {
    setIncludeOpening(checked);
    fetchTrialBalance({
      fromDate,
      toDate,
      branch,
      viewType,
      showZeroBalance,
      includeOpening: checked
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePDF = () => {
    console.log("Export to PDF");
  };

  const handleExcel = () => {
    const headers = ["#", "Account Name", "Debit", "Credit", "Balance", "Nature"];
    const csvData = filteredTrialBalance.map((entry, index) => [
      index + 1,
      entry.account_name,
      entry.debit || 0,
      entry.credit || 0,
      entry.balance || 0,
      entry.nature || ""
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial_balance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getGroupedData = () => {
    if (viewType !== "Group-wise") return null;

    const grouped = {};
    filteredTrialBalance.forEach(entry => {
      const group = entry.group || entry.account_group || "Ungrouped";
      if (!grouped[group]) {
        grouped[group] = {
          items: [],
          totalDebit: 0,
          totalCredit: 0,
          totalBalance: 0
        };
      }
      grouped[group].items.push(entry);
      grouped[group].totalDebit += entry.debit || 0;
      grouped[group].totalCredit += entry.credit || 0;
      grouped[group].totalBalance += entry.balance || 0;
    });

    return grouped;
  };

  const renderLedgerWiseView = () => (
    <tbody className="divide-y divide-gray-100">
      {filteredTrialBalance.map((entry, index) => (
        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-600">{index + 1}</span>
          </td>
          <td className="px-6 py-4">
            <span className="text-sm font-medium text-gray-900">{entry.account_name}</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right">
            <span className={`text-sm font-semibold ${
              entry.debit > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right">
            <span className={`text-sm font-semibold ${
              entry.credit > 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right">
            <span className="text-sm font-semibold text-gray-900">
              ₹{Math.abs(entry.balance || 0).toLocaleString('en-IN')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              entry.nature === "Dr" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {entry.nature || "—"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderGroupWiseView = () => {
    const groupedData = getGroupedData();
    if (!groupedData) return null;

    let rowIndex = 0;
    return (
      <tbody className="divide-y divide-gray-100">
        {Object.entries(groupedData).map(([groupName, groupData], groupIndex) => (
          <React.Fragment key={groupIndex}>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y-2 border-blue-200">
              <td colSpan="2" className="px-6 py-4">
                <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                  📁 {groupName}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-blue-800">
                  ₹{groupData.totalDebit.toLocaleString('en-IN')}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-blue-800">
                  ₹{groupData.totalCredit.toLocaleString('en-IN')}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-blue-800">
                  ₹{Math.abs(groupData.totalBalance).toLocaleString('en-IN')}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                  GROUP
                </span>
              </td>
            </tr>
            
            {groupData.items.map((entry, itemIndex) => {
              rowIndex++;
              return (
                <tr key={`${groupIndex}-${itemIndex}`} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{rowIndex}</span>
                  </td>
                  <td className="px-6 py-4 pl-12">
                    <span className="text-sm font-medium text-gray-900">{entry.account_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-semibold ${
                      entry.debit > 0 ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-semibold ${
                      entry.credit > 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{Math.abs(entry.balance || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      entry.nature === "Dr" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {entry.nature || "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading trial balance...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 text-red-700">
              <Book className="w-6 h-6" />
              <p className="font-semibold text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Trial Balance</h1>
                </div>
              </div>
              <button
                onClick={handleExcel}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <FileDown className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Debit</p>
            <p className="text-3xl font-bold text-gray-900">₹{totals.totalDebit.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <ArrowDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Credit</p>
            <p className="text-3xl font-bold text-gray-900">₹{totals.totalCredit.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                totals.difference === 0 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-orange-500 to-orange-600'
              }`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Difference</p>
            <p className={`text-3xl font-bold ${
              totals.difference === 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              ₹{Math.abs(totals.difference).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {totals.difference === 0 ? '✓ Balanced' : '⚠ Unbalanced'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Book className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Active Accounts</p>
            <p className="text-3xl font-bold text-gray-900">{totals.activeAccounts}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Report Parameters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">View Type</label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
              >
                <option>Ledger-wise</option>
                <option>Group-wise</option>
                <option>Detailed View</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showZeroBalance}
                  onChange={(e) => handleShowZeroBalanceChange(e.target.checked)}
                  className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                Show Zero Balance
              </label>
              
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOpening}
                  onChange={(e) => handleIncludeOpeningChange(e.target.checked)}
                  className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                Include Opening
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Trial Balance Statement ({filteredTrialBalance.length})
                </h2>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {viewType}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handlePDF}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handleExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden md:inline">Excel</span>
                </button>
              </div>
            </div>
          </div>

          {filteredTrialBalance.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <DollarSign className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No accounts found</p>
              <p className="text-sm text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search"
                  : "Trial balance entries will appear here once transactions are recorded"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {viewType === "Group-wise" ? "GROUP / ACCOUNT NAME" : "ACCOUNT NAME"}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Debit</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Credit</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nature</th>
                  </tr>
                </thead>
                
                {viewType === "Group-wise" ? renderGroupWiseView() : renderLedgerWiseView()}
                
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900 uppercase">Grand Total:</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-green-600">₹{totals.totalDebit.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-red-600">₹{totals.totalCredit.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">—</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        totals.difference === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {totals.difference === 0 ? '✓ Balanced' : '⚠ Unbalanced'}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className={`rounded-2xl shadow-lg p-6 text-white text-center ${
          totals.difference === 0 
            ? 'bg-gradient-to-r from-green-600 to-green-700' 
            : 'bg-gradient-to-r from-red-600 to-red-700'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{totals.difference === 0 ? '✓' : '⚠'}</span>
            <div>
              <span className="font-bold text-lg">
                {totals.difference === 0 
                  ? 'Trial Balance is Balanced!' 
                  : 'Trial Balance is Unbalanced!'}
              </span>
              <p className="text-sm opacity-90 mt-1">
                {totals.difference === 0 
                  ? 'Total Debits = Total Credits' 
                  : `Difference: ₹${Math.abs(totals.difference).toLocaleString('en-IN')}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;