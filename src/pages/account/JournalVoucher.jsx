
// import React, { useEffect, useState } from "react";
// import api from "../../utils/api";
// import { MdDeleteForever } from "react-icons/md";
// import axios from "axios";

// const JournalVoucher = () => {
//   const [form, setForm] = useState(false);
//   const [journalVouchers, setJournalVouchers] = useState([]);
//   const [ledgers, setLedgers] = useState([]);
//   const [formData, setFormData] = useState({
//     voucherNo: "",
//     date: new Date().toISOString().split("T")[0],
//     voucherType: "",
//     debitAccount: "",
//     debitAmount: 0,
//     creditAccount: "",
//     creditAmount: 0,
//     description: "",
//   });

//   const generateVoucherNo = () => {
//     const randomNum = Math.floor(100 + Math.random() * 900);
//     return `JV-${randomNum}`;
//   };

//   useEffect(() => {
//     const fetchLedger = async () => {
//       try {
//         const res = await api.get("/allLedger");
//         setLedgers(res.data.data);

    
//         setFormData((prev) => ({ ...prev, voucherNo: generateVoucherNo() }));
//       } catch (error) {
//         console.log("Error fetching ledgers", error);
//       }
//     };

//     fetchLedger();
//   }, []);


//   const fetchAllJournalVoucher =async()=>{
//     try {
//        const response=await api.get("/journalVoucher")
//         console.log(response);
//         setJournalVouchers(response.data.data)
//     } catch (error) {
//       console.log("error fetching journalVoucher",error);
      
//     }
//   }

//   useEffect(()=>{
//     fetchAllJournalVoucher()
//   },[])

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/journalVoucher", formData);
//       console.log(res);
//       alert("Voucher created successfully");

//       setFormData({
//         voucherNo: generateVoucherNo(),
//         date: new Date().toISOString().split("T")[0],
//         voucherType: "",
//         debitAccount: "",
//         debitAmount: 0,
//         creditAccount: "",
//         creditAmount: 0,
//         description: "",
//       });
//       setForm(false);
//     } catch (error) {
//       console.log("Error submitting journal voucher", error);
//     }
//   };

//   const handleDelete =async(id)=>{
//      try {
//       const res =await api.delete(`/journalVoucher/${id}`)
//        setJournalVoucher((prev)=>prev.filter((j)=>j._id !== id))
//      } catch (error) {
//       console.log(error);
      
//      }
//   }

//   return (
//     <div className="p-6">
//       {form ? (
//         <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
//             Create Journal Voucher
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Row 1 */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-gray-600 mb-1">Voucher No</label>
//                 <input
//                   type="text"
//                   name="voucherNo"
//                   value={formData.voucherNo}
//                   readOnly
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   readOnly
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 mb-1">Voucher Type</label>
//                 <select
//                   name="voucherType"
//                   onChange={handleChange}
//                   value={formData.voucherType}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                 >
//                   <option value="">Select Type</option>
//                   <option value="Sales Return">Sales Return</option>
//                   <option value="Purchase Return">Purchase Return</option>
//                   <option value="Payment">Payment</option>
//                   <option value="Receipt">Receipt</option>
//                   <option value="Journal">Journal</option>
//                   <option value="Contra">Contra</option>
//                 </select>
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-gray-600 mb-1">Debit Account</label>
//                 <select
//                   name="debitAccount"
//                   onChange={handleChange}
//                   value={formData.debitAccount}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                 >
//                   <option value="">Select Debit</option>
//                   {ledgers.map(
//                     (l, i) =>
//                       l.balanceType === "Debit" && (
//                         <option key={i} value={l.accountName}>
//                           {l.accountName}
//                         </option>
//                       )
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-600 mb-1">Debit Amount</label>
//                 <input
//                   type="number"
//                   name="debitAmount"
//                   value={formData.debitAmount}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 mb-1">Credit Account</label>
//                 <select
//                   name="creditAccount"
//                   onChange={handleChange}
//                   value={formData.creditAccount}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                 >
//                   <option value="">Select Credit</option>
//                   {ledgers.map(
//                     (l, i) =>
//                       l.balanceType === "Credit" && (
//                         <option key={i} value={l.accountName}>
//                           {l.accountName}
//                         </option>
//                       )
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-600 mb-1">Credit Amount</label>
//                 <input
//                   type="number"
//                   name="creditAmount"
//                   value={formData.creditAmount}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                 />
//               </div>
//             </div>

//             {/* Row 3 */}
//             <div>
//               <label className="block text-gray-600 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
//               ></textarea>
//             </div>

//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={() => setForm(false)}
//                 className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-700">Journal Voucher</h3>
//             <button
//               onClick={() => setForm(true)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Add New
//             </button>
//           </div>

//           <table className="w-full border border-gray-200 text-sm text-gray-700">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border p-2">Voucher No</th>
//                 <th className="border p-2">Date</th>
//                 <th className="border p-2">Type</th>
//                 <th className="border p-2">Debit Account</th>
//                 <th className="border p-2">Credit Account</th>
//                 <th className="border p-2">Amount</th>
//                 <th className="border p-2">Description</th>
//                 <th className="border p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {journalVouchers.length > 0 ? (
//                 journalVouchers.map((v, i) => (
//                   <tr key={i} className="text-center">
//                     <td className="border p-2">{v.voucherNo}</td>
//                     <td className="border p-2">{v.date}</td>
//                     <td className="border p-2">{v.voucherType}</td>
//                     <td className="border p-2">{v.debitAccount}</td>
//                     <td className="border p-2">{v.creditAccount}</td>
//                     <td className="border p-2">{v.debitAmount}</td>
//                     <td className="border p-2">{v.description}</td>
//                     <td className="border p-2">
//                       <button onClick={handleDelete(v._id)}><MdDeleteForever className="w-4 h-4" /></button>
//                     </td >
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-4 text-gray-500">
//                     No Journal Voucher Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JournalVoucher;


import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Calendar, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Filter, 
  AlertCircle, 
  Edit3, 
  CheckCircle, 
  XCircle,
  BookOpen,
  Plus
} from "lucide-react";
import api from "../../utils/api";


const JournalVoucher = () => {
  const [form, setForm] = useState(false);
  const [journalVouchers, setJournalVouchers] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    voucherNo: "",
    date: new Date().toISOString().split("T")[0],
    voucherType: "",
    debitAccount: "",
    debitAmount: 0,
    creditAccount: "",
    creditAmount: 0,
    description: "",
  });

  const itemsPerPage = 8;

  const generateVoucherNo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `JV-${randomNum}`;
  };

  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await api.get("/allLedger");
        setLedgers(res.data.data);
        setFormData((prev) => ({ ...prev, voucherNo: generateVoucherNo() }));
      } catch (error) {
        console.log("Error fetching ledgers", error);
      }
    };
    fetchLedger();
  }, []);

  const fetchAllJournalVoucher = async () => {
    try {
      setLoading(true);
      const response = await api.get("/journalVoucher");
      setJournalVouchers(response.data.data);
    } catch (error) {
      console.log("error fetching journalVoucher", error);
      showNotification("error", "Error", "Failed to fetch journal vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJournalVoucher();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/journalVoucher", formData);
      showNotification("success", "Success!", "Voucher created successfully");
      setFormData({
        voucherNo: generateVoucherNo(),
        date: new Date().toISOString().split("T")[0],
        voucherType: "",
        debitAccount: "",
        debitAmount: 0,
        creditAccount: "",
        creditAmount: 0,
        description: "",
      });
      setForm(false);
      fetchAllJournalVoucher();
    } catch (error) {
      console.log("Error submitting journal voucher", error);
      showNotification("error", "Error", "Failed to create voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this voucher?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/journalVoucher/${id}`);
      setJournalVouchers((prev) => prev.filter((j) => j._id !== id));
      showNotification("success", "Deleted!", "Voucher deleted successfully");
    } catch (error) {
      console.log(error);
      showNotification("error", "Error", "Failed to delete voucher");
    } finally {
      setLoading(false);
    }
  };

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

  // Filter vouchers
  const filteredVouchers = journalVouchers.filter((voucher) => {
    const s = search.toLowerCase();
    const matchesSearch =
      voucher.voucherNo.toLowerCase().includes(s) ||
      (voucher.debitAccount && voucher.debitAccount.toLowerCase().includes(s)) ||
      (voucher.creditAccount && voucher.creditAccount.toLowerCase().includes(s)) ||
      (voucher.description && voucher.description.toLowerCase().includes(s));

    const matchesType =
      typeFilter === "all" || voucher.voucherType === typeFilter;

    const voucherDate = voucher.date ? new Date(voucher.date) : null;
    const matchesDate =
      (!startDate || (voucherDate && voucherDate >= new Date(startDate))) &&
      (!endDate || (voucherDate && voucherDate <= new Date(endDate)));

    return matchesSearch && matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentVouchers = filteredVouchers.slice(startIndex, startIndex + itemsPerPage);

  if (form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setForm(false)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Create Journal Voucher</h1>
                    <p className="text-blue-100 text-sm">Fill in the details below</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No</label>
                  <input
                    type="text"
                    name="voucherNo"
                    value={formData.voucherNo}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Type</label>
                  <select
                    name="voucherType"
                    onChange={handleChange}
                    value={formData.voucherType}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Sales Return">Sales Return</option>
                    <option value="Purchase Return">Purchase Return</option>
                    <option value="Payment">Payment</option>
                    <option value="Receipt">Receipt</option>
                    <option value="Journal">Journal</option>
                    <option value="Contra">Contra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debit Account</label>
                  <select
                    name="debitAccount"
                    onChange={handleChange}
                    value={formData.debitAccount}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Debit</option>
                    {ledgers.map(
                      (l, i) =>
                        l.balanceType === "Debit" && (
                          <option key={i} value={l.accountName}>
                            {l.accountName}
                          </option>
                        )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debit Amount (₹)</label>
                  <input
                    type="number"
                    name="debitAmount"
                    value={formData.debitAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Account</label>
                  <select
                    name="creditAccount"
                    onChange={handleChange}
                    value={formData.creditAccount}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Credit</option>
                    {ledgers.map(
                      (l, i) =>
                        l.balanceType === "Credit" && (
                          <option key={i} value={l.accountName}>
                            {l.accountName}
                          </option>
                        )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Amount (₹)</label>
                  <input
                    type="number"
                    name="creditAmount"
                    value={formData.creditAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setForm(false)}
                  className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
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
              <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
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
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Journal Vouchers</h1>
                  <p className="text-blue-100 text-sm">View and manage all journal entries</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{journalVouchers.length}</div>
                <div className="text-sm text-blue-100">Total Records</div>
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
                  placeholder="Search by voucher number, account, or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Sales Return">Sales Return</option>
                <option value="Purchase Return">Purchase Return</option>
                <option value="Payment">Payment</option>
                <option value="Receipt">Receipt</option>
                <option value="Journal">Journal</option>
                <option value="Contra">Contra</option>
              </select>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setForm(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Voucher Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentVouchers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No vouchers found</h3>
              <p className="text-gray-500">
                {search ? "Try adjusting your search criteria" : "No journal vouchers available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Voucher Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Debit Account
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Credit Account
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVouchers.map((voucher, i) => (
                      <tr key={voucher._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-2 mr-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {voucher.voucherNo}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(voucher.date)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {voucher.voucherType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{voucher.debitAccount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{voucher.creditAccount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{parseFloat(voucher.debitAmount || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {voucher.description || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDelete(voucher._id)}
                              disabled={loading}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Voucher"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVouchers.length)} of {filteredVouchers.length} results
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
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              page === i + 1
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {i + 1}
                          </button>
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
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Cards */}
        {journalVouchers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{journalVouchers.length}</div>
                  <div className="text-sm text-gray-600">Total Vouchers</div>
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
                    {journalVouchers.reduce((sum, v) => sum + parseFloat(v.debitAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Debit Amount</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-xl p-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{journalVouchers.reduce((sum, v) => sum + parseFloat(v.creditAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Credit Amount</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalVoucher;
