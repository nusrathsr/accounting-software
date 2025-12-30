// import React, { useState, useEffect } from 'react';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   DollarSign, 
//   Calendar,
//   Filter,
//   Printer,
//   FileSpreadsheet,
//   FileText,
//   RefreshCw,
//   Award
// } from 'lucide-react';
// import api from "../../utils/api";

// export default function ProfitLoss() {
//   const [fromDate, setFromDate] = useState('2025-01-01');
//   const [toDate, setToDate] = useState('2025-11-12');
//   const [branch, setBranch] = useState('All Branches');
//   const [costCenter, setCostCenter] = useState('All');
//   const [period, setPeriod] = useState('This Year');
//   const [reportType, setReportType] = useState('Detailed');
//   const [currency, setCurrency] = useState('INR (₹)');
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [data, setData] = useState({
//     totalRevenue: 675000,
//     totalExpenses: 598000,
//     grossProfit: 245000,
//     netProfit: 77000,
//     revenueGrowth: 14.4,
//     expenseGrowth: 9.2,
//     grossProfitGrowth: 22.5,
//     netProfitGrowth: 71.1,
//     operatingRevenue: 675000,
//     operatingExpenses: 398000,
//     grossMargin: 36.3,
//     netMargin: 11.4,
//     revenues: [
//       { name: 'Sales Revenue', current: 500000, previous: 450000, variance: 11.1 },
//       { name: 'Service Income', current: 150000, previous: 120000, variance: 25.0 },
//       { name: 'Other Income', current: 25000, previous: 20000, variance: 25.0 }
//     ],
//     expenses: [
//       { name: 'Cost of Goods Sold', current: 300000, previous: 270000, variance: 11.1 },
//       { name: 'Operating Expenses', current: 150000, previous: 140000, variance: 7.1 },
//       { name: 'Administrative Expenses', current: 98000, previous: 88000, variance: 11.4 },
//       { name: 'Depreciation', current: 50000, previous: 50000, variance: 0 }
//     ]
//   });

//   const fetchProfitLoss = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         fromDate,
//         toDate,
//         branch,
//         costCenter,
//         period,
//         reportType,
//         currency
//       };

//       console.log('Fetching P&L with params:', params);
      
//       const response = await api.get('/profit-loss', { params });
//       console.log('P&L response:', response.data);
      
//       if (response.data.success) {
//         setData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching profit & loss:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateReport = () => {
//     fetchProfitLoss();
//   };

//   const handleRefresh = () => {
//     fetchProfitLoss();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleExcel = () => {
//     console.log('Export to Excel');
//   };

//   const handlePDF = () => {
//     console.log('Export to PDF');
//   };

//   const formatCurrency = (amount) => {
//     return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   const formatVariance = (variance) => {
//     return variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
//   };

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
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">Profit & Loss Statement</h1>
//                   <p className="text-blue-100 text-sm mt-1">Comprehensive income statement analysis</p>
//                 </div>
//               </div>
//               <div className="hidden md:flex gap-2">
//                 <button
//                   onClick={handlePrint}
//                   className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <Printer className="w-4 h-4" />
//                   Print
//                 </button>
//                 <button
//                   onClick={handleExcel}
//                   className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   Excel
//                 </button>
//                 <button
//                   onClick={handlePDF}
//                   className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <FileText className="w-4 h-4" />
//                   PDF
//                 </button>
//                 <button
//                   onClick={handleRefresh}
//                   className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Quick Filters (Always Visible) */}
//           <div className="bg-white px-8 py-4 border-b border-gray-100">
//             <div className="flex items-center gap-4 flex-wrap">
//               <select
//                 value={branch}
//                 onChange={(e) => setBranch(e.target.value)}
//                 className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//               >
//                 <option>All Branches</option>
//                 <option>Main Branch</option>
//                 <option>Branch 1</option>
//                 <option>Branch 2</option>
//               </select>

//               <select
//                 value={costCenter}
//                 onChange={(e) => setCostCenter(e.target.value)}
//                 className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//               >
//                 <option>All</option>
//                 <option>Sales</option>
//                 <option>Marketing</option>
//                 <option>Operations</option>
//               </select>

//               <select
//                 value={currency}
//                 onChange={(e) => setCurrency(e.target.value)}
//                 className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//               >
//                 <option>INR (₹)</option>
//                 <option>USD ($)</option>
//                 <option>EUR (€)</option>
//               </select>

//               <button
//                 onClick={handleGenerateReport}
//                 className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 Generate Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Collapsible Filters */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center justify-between w-full"
//           >
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-gray-600" />
//               <h2 className="text-lg font-semibold text-gray-900">Report Filters & Parameters</h2>
//             </div>
//             <span className="text-gray-400">{showFilters ? '▲' : '▼'}</span>
//           </button>

//           {showFilters && (
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">From Date</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">To Date</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">Period</label>
//                 <select
//                   value={period}
//                   onChange={(e) => setPeriod(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                 >
//                   <option>This Year</option>
//                   <option>This Quarter</option>
//                   <option>This Month</option>
//                   <option>Last Year</option>
//                   <option>Custom</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">Branch</label>
//                 <select
//                   value={branch}
//                   onChange={(e) => setBranch(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                 >
//                   <option>All Branches</option>
//                   <option>Main Branch</option>
//                   <option>Branch 1</option>
//                   <option>Branch 2</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">Cost Center</label>
//                 <select
//                   value={costCenter}
//                   onChange={(e) => setCostCenter(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                 >
//                   <option>All</option>
//                   <option>Sales</option>
//                   <option>Marketing</option>
//                   <option>Operations</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-2">Report Type</label>
//                 <select
//                   value={reportType}
//                   onChange={(e) => setReportType(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
//                 >
//                   <option>Detailed</option>
//                   <option>Summary</option>
//                   <option>Comparative</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Total Revenue */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-blue-100 rounded-xl">
//                 <TrendingUp className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">TOTAL REVENUE</p>
//             <p className="text-3xl font-bold text-gray-900">₹{(data.totalRevenue / 100000).toFixed(2)}L</p>
//             <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
//               <TrendingUp className="w-4 h-4" />
//               {data.revenueGrowth}% vs Last Period
//             </p>
//             <p className="text-gray-500 text-xs mt-2">Operating Revenue: ₹{formatCurrency(data.operatingRevenue)}</p>
//           </div>

//           {/* Total Expenses */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-red-100 rounded-xl">
//                 <TrendingDown className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">TOTAL EXPENSES</p>
//             <p className="text-3xl font-bold text-gray-900">₹{(data.totalExpenses / 100000).toFixed(2)}L</p>
//             <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
//               <TrendingUp className="w-4 h-4" />
//               {data.expenseGrowth}% vs Last Period
//             </p>
//             <p className="text-gray-500 text-xs mt-2">Operating Expenses: ₹{formatCurrency(data.operatingExpenses)}</p>
//           </div>

//           {/* Gross Profit */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-green-100 rounded-xl">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">GROSS PROFIT</p>
//             <p className="text-3xl font-bold text-gray-900">₹{(data.grossProfit / 100000).toFixed(2)}L</p>
//             <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
//               <TrendingUp className="w-4 h-4" />
//               {data.grossProfitGrowth}% vs Last Period
//             </p>
//             <p className="text-gray-500 text-xs mt-2">Gross Margin: {data.grossMargin}%</p>
//           </div>

//           {/* Net Profit */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-yellow-100 rounded-xl">
//                 <Award className="w-6 h-6 text-yellow-600" />
//               </div>
//             </div>
//             <p className="text-gray-600 text-sm font-medium mb-1">NET PROFIT</p>
//             <p className="text-3xl font-bold text-gray-900">₹{(data.netProfit / 1000).toFixed(0)}K</p>
//             <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
//               <TrendingUp className="w-4 h-4" />
//               {data.netProfitGrowth}% vs Last Period
//             </p>
//             <p className="text-gray-500 text-xs mt-2">Net Margin: {data.netMargin}%</p>
//           </div>
//         </div>

//         {/* P&L Statement Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900 text-center">
//               Profit & Loss Statement (Income Statement)
//             </h2>
//             <p className="text-sm text-gray-600 text-center mt-1">
//               For the Period: 01 January 2025 to 12 November 2025
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b-2 border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                     PARTICULARS
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
//                     CURRENT PERIOD (₹)
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
//                     PREVIOUS PERIOD (₹)
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
//                     VARIANCE (%)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {/* Operating Revenue Section */}
//                 <tr className="bg-blue-50">
//                   <td colSpan="4" className="px-6 py-3">
//                     <div className="flex items-center gap-2">
//                       <TrendingUp className="w-4 h-4 text-blue-600" />
//                       <span className="font-bold text-blue-900 uppercase text-sm">OPERATING REVENUE</span>
//                     </div>
//                   </td>
//                 </tr>
//                 {data.revenues.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-3 pl-12 text-sm text-gray-900">{item.name}</td>
//                     <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
//                       {formatCurrency(item.current)}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-right text-gray-700">
//                       {formatCurrency(item.previous)}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-right">
//                       <span className={`font-semibold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         {formatVariance(item.variance)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 <tr className="bg-gray-100 font-bold">
//                   <td className="px-6 py-3 text-sm text-gray-900">Total Revenue</td>
//                   <td className="px-6 py-3 text-sm text-right text-blue-600">
//                     ₹{formatCurrency(data.totalRevenue)}
//                   </td>
//                   <td className="px-6 py-3 text-sm text-right text-gray-700">
//                     ₹{formatCurrency(data.totalRevenue / 1.144)}
//                   </td>
//                   <td className="px-6 py-3 text-sm text-right text-green-600">
//                     +{data.revenueGrowth}%
//                   </td>
//                 </tr>

//                 {/* Operating Expenses Section */}
//                 <tr className="bg-red-50">
//                   <td colSpan="4" className="px-6 py-3">
//                     <div className="flex items-center gap-2">
//                       <TrendingDown className="w-4 h-4 text-red-600" />
//                       <span className="font-bold text-red-900 uppercase text-sm">OPERATING EXPENSES</span>
//                     </div>
//                   </td>
//                 </tr>
//                 {data.expenses.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-3 pl-12 text-sm text-gray-900">{item.name}</td>
//                     <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
//                       {formatCurrency(item.current)}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-right text-gray-700">
//                       {formatCurrency(item.previous)}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-right">
//                       <span className={`font-semibold ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
//                         {formatVariance(item.variance)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 <tr className="bg-gray-100 font-bold">
//                   <td className="px-6 py-3 text-sm text-gray-900">Total Expenses</td>
//                   <td className="px-6 py-3 text-sm text-right text-red-600">
//                     ₹{formatCurrency(data.totalExpenses)}
//                   </td>
//                   <td className="px-6 py-3 text-sm text-right text-gray-700">
//                     ₹{formatCurrency(data.totalExpenses / 1.092)}
//                   </td>
//                   <td className="px-6 py-3 text-sm text-right text-red-600">
//                     +{data.expenseGrowth}%
//                   </td>
//                 </tr>

//                 {/* Gross Profit */}
//                 <tr className="bg-green-50 border-t-2 border-gray-300">
//                   <td className="px-6 py-4 text-base font-bold text-green-900">GROSS PROFIT</td>
//                   <td className="px-6 py-4 text-base font-bold text-right text-green-600">
//                     ₹{formatCurrency(data.grossProfit)}
//                   </td>
//                   <td className="px-6 py-4 text-base font-bold text-right text-gray-700">
//                     ₹{formatCurrency(data.grossProfit / 1.225)}
//                   </td>
//                   <td className="px-6 py-4 text-base font-bold text-right text-green-600">
//                     +{data.grossProfitGrowth}%
//                   </td>
//                 </tr>

//                 {/* Net Profit */}
//                 <tr className="bg-yellow-50 border-t-2 border-gray-300">
//                   <td className="px-6 py-4 text-lg font-bold text-yellow-900">NET PROFIT</td>
//                   <td className="px-6 py-4 text-lg font-bold text-right text-yellow-600">
//                     ₹{formatCurrency(data.netProfit)}
//                   </td>
//                   <td className="px-6 py-4 text-lg font-bold text-right text-gray-700">
//                     ₹{formatCurrency(data.netProfit / 1.711)}
//                   </td>
//                   <td className="px-6 py-4 text-lg font-bold text-right text-green-600">
//                     +{data.netProfitGrowth}%
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Profit Status Footer */}
//         <div className={`rounded-2xl shadow-lg p-6 text-white text-center ${
//           data.netProfit > 0 
//             ? 'bg-gradient-to-r from-green-600 to-green-700' 
//             : 'bg-gradient-to-r from-red-600 to-red-700'
//         }`}>
//           <div className="flex items-center justify-center gap-3">
//             <Award className="w-8 h-8" />
//             <div>
//               <span className="font-bold text-xl">
//                 {data.netProfit > 0 ? 'Company is Profitable!' : 'Company in Loss'}
//               </span>
//               <p className="text-sm opacity-90 mt-1">
//                 Net Profit Margin: {data.netMargin}% | Growth: +{data.netProfitGrowth}% vs Last Period
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  Printer,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Award,
  Loader2
} from 'lucide-react';
import api from "../../utils/api";

export default function ProfitLoss() {
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-11-15');
  const [branch, setBranch] = useState('All Branches');
  const [costCenter, setCostCenter] = useState('All');
  const [period, setPeriod] = useState('This Year');
  const [reportType, setReportType] = useState('Detailed');
  const [currency, setCurrency] = useState('INR (₹)');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    revenueGrowth: 0,
    expenseGrowth: 0,
    grossProfitGrowth: 0,
    netProfitGrowth: 0,
    operatingRevenue: 0,
    operatingExpenses: 0,
    grossMargin: 0,
    netMargin: 0,
    revenues: [],
    expenses: [],
    period: ''
  });

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  const fetchProfitLoss = async () => {
    setLoading(true);
    try {
      const params = {
        fromDate,
        toDate,
        branch,
        costCenter,
        period,
        reportType,
        currency
      };

      console.log('Fetching P&L with params:', params);
      
      const response = await api.get('/profit-loss', { params });
      console.log('P&L response:', response.data);
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profit & loss:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchProfitLoss();
  };

  const handleRefresh = () => {
    fetchProfitLoss();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    const headers = ["Particulars", "Current Period", "Previous Period", "Variance"];
    const csvData = [];
    
    // Add revenues
    csvData.push(["OPERATING REVENUE", "", "", ""]);
    data.revenues.forEach(item => {
      csvData.push([item.name, item.current, item.previous, `${item.variance}%`]);
    });
    csvData.push(["Total Revenue", data.totalRevenue, "", ""]);
    csvData.push(["", "", "", ""]);
    
    // Add expenses
    csvData.push(["OPERATING EXPENSES", "", "", ""]);
    data.expenses.forEach(item => {
      csvData.push([item.name, item.current, item.previous, `${item.variance}%`]);
    });
    csvData.push(["Total Expenses", data.totalExpenses, "", ""]);
    csvData.push(["", "", "", ""]);
    
    // Add profits
    csvData.push(["GROSS PROFIT", data.grossProfit, "", ""]);
    csvData.push(["NET PROFIT", data.netProfit, "", ""]);

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit_loss_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePDF = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVariance = (variance) => {
    return variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading Profit & Loss statement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Profit & Loss Statement</h1>
                  <p className="text-blue-100 text-sm mt-1">Comprehensive income statement analysis</p>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={handlePDF}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-white px-8 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
              >
                <option>All Branches</option>
                <option>Main Branch</option>
              </select>

              <select
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
              >
                <option>All</option>
              </select>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
              </select>

              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 disabled:bg-blue-400"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Report Filters & Parameters</h2>
            </div>
            <span className="text-gray-400">{showFilters ? '▲' : '▼'}</span>
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
                >
                  <option>This Year</option>
                  <option>This Quarter</option>
                  <option>This Month</option>
                  <option>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
                >
                  <option>Detailed</option>
                  <option>Summary</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">TOTAL REVENUE</p>
            <p className="text-3xl font-bold text-gray-900">₹{(data.totalRevenue / 100000).toFixed(2)}L</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(data.revenueGrowth)}% vs Last Period
            </p>
            <p className="text-gray-500 text-xs mt-2">Operating Revenue: ₹{formatCurrency(data.operatingRevenue)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">TOTAL EXPENSES</p>
            <p className="text-3xl font-bold text-gray-900">₹{(data.totalExpenses / 100000).toFixed(2)}L</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${data.expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              <TrendingUp className="w-4 h-4" />
              {Math.abs(data.expenseGrowth)}% vs Last Period
            </p>
            <p className="text-gray-500 text-xs mt-2">Operating Expenses: ₹{formatCurrency(data.operatingExpenses)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">GROSS PROFIT</p>
            <p className="text-3xl font-bold text-gray-900">₹{(data.grossProfit / 100000).toFixed(2)}L</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${data.grossProfitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.grossProfitGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(data.grossProfitGrowth)}% vs Last Period
            </p>
            <p className="text-gray-500 text-xs mt-2">Gross Margin: {data.grossMargin}%</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">NET PROFIT</p>
            <p className="text-3xl font-bold text-gray-900">₹{(data.netProfit / 1000).toFixed(0)}K</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${data.netProfitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.netProfitGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(data.netProfitGrowth)}% vs Last Period
            </p>
            <p className="text-gray-500 text-xs mt-2">Net Margin: {data.netMargin}%</p>
          </div>
        </div>

        {/* P&L Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 text-center">
              Profit & Loss Statement (Income Statement)
            </h2>
            <p className="text-sm text-gray-600 text-center mt-1">
              {data.period || 'For the selected period'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">PARTICULARS</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">CURRENT PERIOD (₹)</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">PREVIOUS PERIOD (₹)</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">VARIANCE (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Revenue Section */}
                <tr className="bg-blue-50">
                  <td colSpan="4" className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-900 uppercase text-sm">OPERATING REVENUE</span>
                    </div>
                  </td>
                </tr>
                {data.revenues.length > 0 ? (
                  data.revenues.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 pl-12 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(item.current)}</td>
                      <td className="px-6 py-3 text-sm text-right text-gray-700">{formatCurrency(item.previous)}</td>
                      <td className="px-6 py-3 text-sm text-right">
                        <span className={`font-semibold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatVariance(item.variance)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No revenue accounts found</td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-3 text-sm text-gray-900">Total Revenue</td>
                  <td className="px-6 py-3 text-sm text-right text-blue-600">₹{formatCurrency(data.totalRevenue)}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">₹{formatCurrency(data.totalRevenue * 0.88)}</td>
                  <td className="px-6 py-3 text-sm text-right text-green-600">+{data.revenueGrowth}%</td>
                </tr>

                {/* Expenses Section */}
                <tr className="bg-red-50">
                  <td colSpan="4" className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-red-900 uppercase text-sm">OPERATING EXPENSES</span>
                    </div>
                  </td>
                </tr>
                {data.expenses.length > 0 ? (
                  data.expenses.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 pl-12 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(item.current)}</td>
                      <td className="px-6 py-3 text-sm text-right text-gray-700">{formatCurrency(item.previous)}</td>
                      <td className="px-6 py-3 text-sm text-right">
                        <span className={`font-semibold ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatVariance(item.variance)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No expense accounts found</td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-3 text-sm text-gray-900">Total Expenses</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600">₹{formatCurrency(data.totalExpenses)}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">₹{formatCurrency(data.totalExpenses * 0.93)}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600">+{data.expenseGrowth}%</td>
                </tr>

                {/* Gross Profit */}
                <tr className="bg-green-50 border-t-2 border-gray-300">
                  <td className="px-6 py-4 text-base font-bold text-green-900">GROSS PROFIT</td>
                  <td className="px-6 py-4 text-base font-bold text-right text-green-600">₹{formatCurrency(data.grossProfit)}</td>
                  <td className="px-6 py-4 text-base font-bold text-right text-gray-700">₹{formatCurrency(data.grossProfit / 1.136)}</td>
                  <td className="px-6 py-4 text-base font-bold text-right text-green-600">+{data.grossProfitGrowth}%</td>
                </tr>

                {/* Net Profit */}
                <tr className="bg-yellow-50 border-t-2 border-gray-300">
                  <td className="px-6 py-4 text-lg font-bold text-yellow-900">NET PROFIT</td>
                  <td className="px-6 py-4 text-lg font-bold text-right text-yellow-600">₹{formatCurrency(data.netProfit)}</td>
                  <td className="px-6 py-4 text-lg font-bold text-right text-gray-700">₹{formatCurrency(data.netProfit / 1.136)}</td>
                  <td className="px-6 py-4 text-lg font-bold text-right text-green-600">+{data.netProfitGrowth}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit Status Footer */}
        <div className={`rounded-2xl shadow-lg p-6 text-white text-center ${
          data.netProfit > 0 
            ? 'bg-gradient-to-r from-green-600 to-green-700' 
            : 'bg-gradient-to-r from-red-600 to-red-700'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <span className="font-bold text-xl">
                {data.netProfit > 0 ? 'Company is Profitable!' : 'Company in Loss'}
              </span>
              <p className="text-sm opacity-90 mt-1">
                Net Profit Margin: {data.netMargin}% | Growth: {data.netProfitGrowth >= 0 ? '+' : ''}{data.netProfitGrowth}% vs Last Period
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}