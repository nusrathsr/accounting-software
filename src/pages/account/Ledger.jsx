// import React, { useEffect, useState } from "react";
// import api from "../../utils/api";

// const Ledger = () => {
//   const [ledgers, setLedgers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLedgers = async () => {
//       try {
//         const response = await api.get("/ledger"); // endpoint from your ledgerRoutes
//         console.log("Ledger API Response:", response.data);

//         // Ensure it's an array before setting state
//         if (Array.isArray(response.data)) {
//           setLedgers(response.data);
//         } else {
//           setLedgers([]);
//           console.error("Ledger API did not return an array:", response.data);
//         }
//       } catch (err) {
//         setError("Error fetching ledger entries");
//         console.error("Ledger fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLedgers();
//   }, []);

//   if (loading) return <p>Loading ledger...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Account Ledger</h2>
//       {ledgers.length === 0 ? (
//         <p>No ledger entries found</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Voucher No</th>
//               <th>Date</th>
//               <th>Account Name</th>
//               <th>Debit</th>
//               <th>Credit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ledgers.map((entry) => (
//               <tr key={entry._id}>
//                 <td>{entry.voucher_no}</td>
//                 <td>{new Date(entry.date).toLocaleDateString()}</td>
//                 <td>{entry.account_name}</td>
//                 <td>{entry.debit}</td>
//                 <td>{entry.credit}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Ledger;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { 
  FaBook,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { MdAccountBalance } from "react-icons/md";

const Ledger = () => {
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, debit, credit
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Summary calculations
  const [summary, setSummary] = useState({
    totalDebit: 0,
    totalCredit: 0,
    balance: 0
  });

  useEffect(() => {
    fetchLedgers();
  }, []);

  useEffect(() => {
    filterLedgers();
  }, [searchTerm, filterType, dateFilter, ledgers]);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ledger");
      console.log("Ledger API Response:", response.data);

      if (Array.isArray(response.data)) {
        setLedgers(response.data);
        calculateSummary(response.data);
      } else {
        setLedgers([]);
        console.error("Ledger API did not return an array:", response.data);
      }
    } catch (err) {
      setError("Error fetching ledger entries");
      console.error("Ledger fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalDebit = data.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = data.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    const balance = totalDebit - totalCredit;

    setSummary({
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      balance: balance.toFixed(2)
    });
  };

  const filterLedgers = () => {
    let filtered = [...ledgers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.voucher_no?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter (debit/credit)
    if (filterType === "debit") {
      filtered = filtered.filter(entry => parseFloat(entry.debit) > 0);
    } else if (filterType === "credit") {
      filtered = filtered.filter(entry => parseFloat(entry.credit) > 0);
    }

    // Date filter
    if (dateFilter.start) {
      filtered = filtered.filter(entry => 
        new Date(entry.date) >= new Date(dateFilter.start)
      );
    }
    if (dateFilter.end) {
      filtered = filtered.filter(entry => 
        new Date(entry.date) <= new Date(dateFilter.end)
      );
    }

    setFilteredLedgers(filtered);
    calculateSummary(filtered);
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ["Voucher No", "Date", "Account Name", "Debit", "Credit"];
    const csvData = filteredLedgers.map(entry => [
      entry.voucher_no,
      new Date(entry.date).toLocaleDateString(),
      entry.account_name,
      entry.debit,
      entry.credit
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setDateFilter({ start: "", end: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading ledger entries...</p>
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
              <FaBook className="w-6 h-6" />
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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaBook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Account Ledger</h1>
                  <p className="text-blue-100 text-sm">View and manage all ledger entries</p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <FaFileExport className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <FaArrowUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Debit</p>
            <p className="text-3xl font-bold text-gray-900">₹{parseFloat(summary.totalDebit).toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <FaArrowDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Credit</p>
            <p className="text-3xl font-bold text-gray-900">₹{parseFloat(summary.totalCredit).toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                parseFloat(summary.balance) >= 0 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-orange-500 to-orange-600'
              }`}>
                <MdAccountBalance className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Balance</p>
            <p className={`text-3xl font-bold ${
              parseFloat(summary.balance) >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              ₹{Math.abs(parseFloat(summary.balance)).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="w-4 h-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search account or voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
              >
                <option value="all">All Entries</option>
                <option value="debit">Debit Only</option>
                <option value="credit">Credit Only</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Ledger Entries ({filteredLedgers.length})
              </h2>
              <button
                onClick={handleExport}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
              >
                <FaFileExport className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {filteredLedgers.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <FaBook className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No ledger entries found</p>
              <p className="text-sm text-gray-500">
                {searchTerm || filterType !== "all" || dateFilter.start || dateFilter.end
                  ? "Try adjusting your filters"
                  : "Ledger entries will appear here once transactions are recorded"}
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
                      Account Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Credit
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Narration
                    </th>
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLedgers.map((entry) => (
                    <tr 
                      key={entry._id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          {entry.voucher_no}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.account_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${
                          parseFloat(entry.debit) > 0 ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {parseFloat(entry.debit) > 0 
                            ? `₹${parseFloat(entry.debit).toLocaleString('en-IN')}` 
                            : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${
                          parseFloat(entry.credit) > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {parseFloat(entry.credit) > 0 
                            ? `₹${parseFloat(entry.credit).toLocaleString('en-IN')}` 
                            : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.narration || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900 uppercase">Total:</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-green-600">
                        ₹{parseFloat(summary.totalDebit).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-red-600">
                        ₹{parseFloat(summary.totalCredit).toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ledger;