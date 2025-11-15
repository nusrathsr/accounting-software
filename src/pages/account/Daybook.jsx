// import React, { useState, useEffect } from 'react';
// import { FileText, Filter, Loader2 } from 'lucide-react';
// import api from "../../utils/api";

// export default function Daybook() {
//   const [dateFrom, setDateFrom] = useState('2025-11-01');
//   const [dateTo, setDateTo] = useState('2025-11-03');
//   const [accountName, setAccountName] = useState('All Accounts');
//   const [voucherType, setVoucherType] = useState('All Types');
//   const [showOpeningBalance, setShowOpeningBalance] = useState(true);
  
//   const [transactions, setTransactions] = useState({});
//   const [openingBalance, setOpeningBalance] = useState(0);
//   const [totals, setTotals] = useState({ debit: 0, credit: 0 });
//   const [accounts, setAccounts] = useState(['All Accounts']);
//   const [voucherTypes, setVoucherTypes] = useState(['All Types']);
//   const [loading, setLoading] = useState(false);
//   const [period, setPeriod] = useState('');

//   // Fetch account names on component mount
//   useEffect(() => {
//     fetchAccountNames();
//     fetchVoucherTypes();
//   }, []);

//   const fetchAccountNames = async () => {
//     try {
//       const response = await api.get('/daybook/accounts');
//       console.log('Accounts response:', response.data);
//       if (response.data.success) {
//         setAccounts(['All Accounts', ...response.data.data]);
//       }
//     } catch (error) {
//       console.error('Error fetching account names:', error);
//       alert('Error fetching accounts: ' + error.message);
//     }
//   };

//   const fetchVoucherTypes = async () => {
//     try {
//       const response = await api.get('/daybook/voucher-types');
//       console.log('Voucher types response:', response.data);
//       if (response.data.success) {
//         setVoucherTypes(['All Types', ...response.data.data]);
//       }
//     } catch (error) {
//       console.error('Error fetching voucher types:', error);
//       alert('Error fetching voucher types: ' + error.message);
//     }
//   };

//   const fetchDaybookData = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         dateFrom,
//         dateTo,
//         accountName,
//         voucherType
//       };

//       console.log('Fetching daybook with params:', params);
      
//       const response = await api.get('/daybook/transactions', { params });
//       console.log('Daybook response:', response.data);
      
//       if (response.data.success) {
//         setTransactions(response.data.data.transactions);
//         setOpeningBalance(response.data.data.openingBalance);
//         setTotals(response.data.data.totals);
//         setPeriod(response.data.data.period.formattedPeriod);
//       } else {
//         console.error('Error:', response.data.message);
//         alert('Error: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching daybook data:', error);
//       alert('Network error: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateReport = () => {
//     fetchDaybookData();
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   const formatCurrency = (amount) => {
//     if (amount === 0 || amount === null || amount === undefined) return '-';
//     return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <FileText className="w-8 h-8 text-blue-600" />
//             <h1 className="text-3xl font-bold text-blue-600">Daybook Transactions</h1>
//           </div>
//           <p className="text-gray-600">Review all chronological, double-entry ledger postings.</p>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-gray-600" />
//             <h2 className="text-lg font-semibold text-gray-800">Filter Options</h2>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
//               <select
//                 value={accountName}
//                 onChange={(e) => setAccountName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {accounts.map(acc => (
//                   <option key={acc} value={acc}>{acc}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
//               <select
//                 value={voucherType}
//                 onChange={(e) => setVoucherType(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {voucherTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={showOpeningBalance}
//                 onChange={(e) => setShowOpeningBalance(e.target.checked)}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">Opening Balance</span>
//             </label>
            
//             <button
//               onClick={handleGenerateReport}
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
//             >
//               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//               Generate Report
//             </button>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         {loading ? (
//           <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             <span className="ml-3 text-gray-600">Loading transactions...</span>
//           </div>
//         ) : Object.keys(transactions).length > 0 ? (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="bg-blue-600 text-white px-6 py-3">
//               <h3 className="font-semibold">
//                 {period ? `Daybook Entries (${period})` : 'Daybook Entries'}
//               </h3>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher No</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account Name</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Particulars</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Debit (₹)</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Credit (₹)</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Narration</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {Object.entries(transactions).map(([voucherNo, entries]) => (
//                     entries.map((entry, idx) => (
//                       <tr key={`${voucherNo}-${idx}`} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm text-blue-600 font-medium">{entry.voucher_no}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700">{formatDate(entry.date)}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700">{entry.type}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-medium">{entry.account_name}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700">{entry.particulars}</td>
//                         <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(entry.debit)}</td>
//                         <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(entry.credit)}</td>
//                         <td className="px-4 py-3 text-sm text-gray-700">{entry.narration}</td>
//                       </tr>
//                     ))
//                   ))}
                  
//                   {/* Opening Balance Row */}
//                   {showOpeningBalance && openingBalance !== 0 && (
//                     <tr className="bg-cyan-50">
//                       <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-gray-900">
//                         Opening Balance ({formatDate(new Date(new Date(dateFrom).setDate(new Date(dateFrom).getDate() - 1)))})
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700">Balance Carried Forward</td>
//                       <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(openingBalance)}</td>
//                       <td className="px-4 py-3 text-sm text-right">-</td>
//                       <td className="px-4 py-3 text-sm text-gray-700"></td>
//                     </tr>
//                   )}

//                   {/* Total Row */}
//                   <tr className="bg-gray-100 font-semibold">
//                     <td colSpan="5" className="px-4 py-3 text-sm text-right text-gray-900">Total for Period</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(totals.debit)}</td>
//                     <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(totals.credit)}</td>
//                     <td className="px-4 py-3"></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-600">No transactions found. Click "Generate Report" to load data.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Filter, 
  Loader2, 
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Printer,
  FileDown,
  FileSpreadsheet,
  Book
} from 'lucide-react';
import api from "../../utils/api";

export default function Daybook() {
  const [dateFrom, setDateFrom] = useState('2025-11-01');
  const [dateTo, setDateTo] = useState('2025-11-03');
  const [accountName, setAccountName] = useState('All Accounts');
  const [voucherType, setVoucherType] = useState('All Types');
  const [showOpeningBalance, setShowOpeningBalance] = useState(true);
  
  const [transactions, setTransactions] = useState({});
  const [openingBalance, setOpeningBalance] = useState(0);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [accounts, setAccounts] = useState(['All Accounts']);
  const [voucherTypes, setVoucherTypes] = useState(['All Types']);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('');

  // Fetch account names on component mount
  useEffect(() => {
    fetchAccountNames();
    fetchVoucherTypes();
  }, []);

  const fetchAccountNames = async () => {
    try {
      const response = await api.get('/daybook/accounts');
      console.log('Accounts response:', response.data);
      if (response.data.success) {
        setAccounts(['All Accounts', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching account names:', error);
    }
  };

  const fetchVoucherTypes = async () => {
    try {
      const response = await api.get('/daybook/voucher-types');
      console.log('Voucher types response:', response.data);
      if (response.data.success) {
        setVoucherTypes(['All Types', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching voucher types:', error);
    }
  };

  const fetchDaybookData = async () => {
    setLoading(true);
    try {
      const params = {
        dateFrom,
        dateTo,
        accountName,
        voucherType
      };

      console.log('Fetching daybook with params:', params);
      
      const response = await api.get('/daybook/transactions', { params });
      console.log('Daybook response:', response.data);
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setOpeningBalance(response.data.data.openingBalance);
        setTotals(response.data.data.totals);
        setPeriod(response.data.data.period.formattedPeriod);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching daybook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchDaybookData();
  };

  const handleReset = () => {
    setDateFrom('2025-11-01');
    setDateTo('2025-11-03');
    setAccountName('All Accounts');
    setVoucherType('All Types');
    setShowOpeningBalance(true);
    setTransactions({});
    setTotals({ debit: 0, credit: 0 });
    setOpeningBalance(0);
    setPeriod('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    const headers = ["Voucher No", "Date", "Type", "Account Name", "Debit", "Credit", "Narration"];
    const csvData = [];
    
    Object.entries(transactions).forEach(([voucherNo, entries]) => {
      entries.forEach(entry => {
        csvData.push([
          entry.voucher_no,
          formatDate(entry.date),
          entry.type,
          entry.account_name,
        //   entry.particulars,
          entry.debit || 0,
          entry.credit || 0,
          entry.narration || ''
        ]);
      });
    });

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daybook_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (amount === 0 || amount === null || amount === undefined) return '-';
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const transactionCount = Object.values(transactions).flat().length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading daybook transactions...</p>
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Daybook Transactions</h1>
                  <p className="text-blue-100 text-sm mt-1">Review all chronological, double-entry ledger postings</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Debit</p>
            <p className="text-3xl font-bold text-gray-900">₹{totals.debit.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <ArrowDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Credit</p>
            <p className="text-3xl font-bold text-gray-900">₹{totals.credit.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Opening Balance</p>
            <p className="text-3xl font-bold text-gray-900">₹{openingBalance.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Book className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Entries</p>
            <p className="text-3xl font-bold text-gray-900">{transactionCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Options</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* From Date */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">Date From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">Date To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Account Name */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">Account Name</label>
              <select
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
              >
                {accounts.map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

            {/* Voucher Type */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">Voucher Type</label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
              >
                {voucherTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkbox and Buttons */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOpeningBalance}
                onChange={(e) => setShowOpeningBalance(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              Show Opening Balance
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {period ? `Daybook Entries (${period})` : 'Daybook Entries'} ({transactionCount})
                </h2>
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
                  onClick={handleExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden md:inline">Excel</span>
                </button>
              </div>
            </div>
          </div>

          {Object.keys(transactions).length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No transactions found</p>
              <p className="text-sm text-gray-500">
                Click "Generate Report" to load daybook entries
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Voucher No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account Name
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Particulars
                    </th> */}
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Debit (₹)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Credit (₹)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Narration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(transactions).map(([voucherNo, entries]) => (
                    entries.map((entry, idx) => (
                      <tr key={`${voucherNo}-${idx}`} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">{entry.voucher_no}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{formatDate(entry.date)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{entry.account_name}</span>
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{entry.particulars}</span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`text-sm font-semibold ${
                            entry.debit > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {entry.debit > 0 ? `₹${formatCurrency(entry.debit)}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`text-sm font-semibold ${
                            entry.credit > 0 ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            {entry.credit > 0 ? `₹${formatCurrency(entry.credit)}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{entry.narration || '-'}</span>
                        </td>
                      </tr>
                    ))
                  ))}
                  
                  {/* Opening Balance Row */}
                  {showOpeningBalance && openingBalance !== 0 && (
                    <tr className="bg-cyan-50 border-y-2 border-cyan-200">
                      <td colSpan="4" className="px-6 py-4">
                        <span className="text-sm font-bold text-cyan-800">
                          Opening Balance ({formatDate(new Date(new Date(dateFrom).setDate(new Date(dateFrom).getDate() - 1)))})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-cyan-700">Balance Carried Forward</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-cyan-800">₹{formatCurrency(openingBalance)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-cyan-700">-</span>
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  )}

                  {/* Total Row */}
                  <tr className="bg-gray-50 border-t-2 border-gray-300">
                    <td colSpan="5" className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900 uppercase">Grand Total:</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-green-600">
                        ₹{formatCurrency(totals.debit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-red-600">
                        ₹{formatCurrency(totals.credit)}
                      </span>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Balance Status Footer */}
        {Object.keys(transactions).length > 0 && (
          <div className={`rounded-2xl shadow-lg p-6 text-white text-center ${
            totals.debit === totals.credit 
              ? 'bg-gradient-to-r from-green-600 to-green-700' 
              : 'bg-gradient-to-r from-orange-600 to-orange-700'
          }`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{totals.debit === totals.credit ? '✓' : '⚠'}</span>
              <div>
                <span className="font-bold text-lg">
                  {totals.debit === totals.credit 
                    ? 'Daybook is Balanced!' 
                    : 'Daybook has Difference!'}
                </span>
                <p className="text-sm opacity-90 mt-1">
                  {totals.debit === totals.credit 
                    ? 'Total Debits = Total Credits' 
                    : `Difference: ₹${Math.abs(totals.debit - totals.credit).toLocaleString('en-IN')}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}