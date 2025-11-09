// import React, { useEffect, useState } from "react";
// import api from "../../utils/api";

// const AllLedger = () => {
//   const [ledgers, setLedgers] = useState([]);

//   const [formData, setFormData] = useState({
//     accountName: "",
//     accountType: "",
//     openingBalance: "",
//     balanceType: "Debit",
//     group: "",
//     description: "",
//   });

//   // Fetch Ledger List
//   const fetchAllLedger = async () => {
//     try {
//       const res = await api.get("/allLedger");   // ✅ ADDED await
//       console.log(res);

//       setLedgers(res.data.data);
//     } catch (error) {
//       console.log("error fetching ledger", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllLedger();
//   }, []);

//   // Handle Form Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Submit Form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.accountName || !formData.accountType) {
//       alert("Account Name and Account Type are required.");
//       return;
//     }

//     try {
//       await api.post("/allLedger", formData);   // ✅ ADDED await

//       alert("Ledger saved successfully ✅");

//       setFormData({
//         accountName: "",
//         accountType: "",
//         openingBalance: "",
//         balanceType: "Debit",
//         group: "",
//         description: "",
//       }); // ✅ Reset Form

//       fetchAllLedger(); // ✅ Refresh Table

//     } catch (error) {
//       console.log("Error saving ledger", error);
//     }
//   };

//   return (
//     <div>
//       {/* Ledger Input Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">

//         <div>
//           <label className="block font-medium">Account Name *</label>
//           <input
//             type="text"
//             name="accountName"
//             value={formData.accountName}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             placeholder="Cash Account"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Account Type *</label>
//           <select
//             name="accountType"
//             value={formData.accountType}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           >
//             <option value="">Select Type</option>
//             <option value="Asset">Asset</option>
//             <option value="Liability">Liability</option>
//             <option value="Income">Income</option>
//             <option value="Expense">Expense</option>
//             <option value="Equity">Equity</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Opening Balance</label>
//           <input
//             type="number"
//             name="openingBalance"
//             value={formData.openingBalance}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             placeholder="50000"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Balance Type</label>
//           <select
//             name="balanceType"
//             value={formData.balanceType}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           >
//             <option value="Debit">Debit</option>
//             <option value="Credit">Credit</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Group / Category</label>
//           <select
//             name="group"
//             value={formData.group}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">Select Group</option>
//             <option value="Current Asset">Current Asset</option>
//             <option value="Fixed Asset">Fixed Asset</option>
//             <option value="Supplier">Supplier</option>
//             <option value="Customer">Customer</option>
//             <option value="Indirect Expense">Indirect Expense</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Description / Notes</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             placeholder="Main office cash account"
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Save Ledger
//         </button>
//       </form>

//       {/* Ledger Table */}
//       <div className="mt-5">
//         <h3 className="mb-3">Ledger List</h3>

//         <div className="table-responsive">
//           <table className="table table-bordered table-striped">
//             <thead className="table-dark">
//               <tr>
//                 <th>Ledger ID</th>
//                 <th>Account Name</th>
//                 <th>Type</th>
//                 <th>Opening Balance</th>
//                 <th>Balance Type</th>
//                 <th>Group/Category</th>
//                 <th>Description</th>

//               </tr>
//             </thead>

//             <tbody>
//               {ledgers.length > 0 ? (
//                 ledgers.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.ledgerId}</td>
//                     <td>{item.accountName}</td>
//                     <td>{item.accountType}</td>
//                     <td>₹{item.openingBalance?.toLocaleString()}</td>
//                     <td>{item.balanceType}</td>
//                     <td>{item.group}</td>
//                     <td>{item.description}</td>

//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center text-muted">
//                     No Ledgers Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllLedger;





import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  FaBook,
  FaMoneyBillWave,
  FaLayerGroup,
  FaStickyNote,
  FaSave,
  FaList,
  FaPlus
} from 'react-icons/fa';
import { MdAccountBalance, MdCategory, MdDeleteForever } from 'react-icons/md';
import Swal from "sweetalert2";

const AllLedger = () => {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form,setForm] = useState(false)

  const [formData, setFormData] = useState({
    accountName: "",
    accountType: "",
    openingBalance: "",
    balanceType: "Debit",
    group: "",
    description: "",
  });

  // Fetch Ledger List
  const fetchAllLedger = async () => {
    try {
      const res = await api.get("/allLedger");
      console.log(res);
      setLedgers(res.data.data);
    } catch (error) {
      console.log("error fetching ledger", error);
    }
  };

  useEffect(() => {
    fetchAllLedger();
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.accountName || !formData.accountType) {
      alert("Account Name and Account Type are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/allLedger", formData);
     Swal.fire({
        icon: 'success',
        title: 'saved!',
        text: 'The ledger saved successfully',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' }
      });

      setFormData({
        accountName: "",
        accountType: "",
        openingBalance: "",
        balanceType: "Debit",
        group: "",
        description: "",
      });
        

      fetchAllLedger();
      setForm(false)
    } catch (error) {
      console.log("Error saving ledger", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This ledger will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-6 py-2',
        cancelButton: 'rounded-xl px-6 py-2'
      }
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/allLedger/${id}`)
      const updatedLedger = ledgers.filter((ledger) => ledger._id !== id)
      setLedgers(updatedLedger)


      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The ledger has been removed.',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' }
      });
    } catch (error) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Could not delete this ledger.',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaBook className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Ledger Management</h1>
                <p className="text-blue-100 text-sm">Create and manage your ledger accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        {form && <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Account Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MdAccountBalance className="w-5 h-5 text-blue-600" />
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      required
                      placeholder="Cash Account"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Asset">Asset</option>
                      <option value="Liability">Liability</option>
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                      <option value="Equity">Equity</option>
                    </select>
                  </div>
                </div>

                {/* Opening Balance */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Opening Balance
                  </label>
                  <div className="relative">
                    <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="openingBalance"
                      value={formData.openingBalance}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Balance Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Balance Type
                  </label>
                  <div className="relative">
                    <MdAccountBalance className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="balanceType"
                      value={formData.balanceType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="Debit">Debit</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                </div>

                {/* Group / Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Group / Category
                  </label>
                  <div className="relative">
                    <FaLayerGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select Group</option>
                      <option value="Current Asset">Current Asset</option>
                      <option value="Fixed Asset">Fixed Asset</option>
                      <option value="Supplier">Supplier</option>
                      <option value="Customer">Customer</option>
                      <option value="Indirect Expense">Indirect Expense</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description / Notes
                  </label>
                  <div className="relative">
                    <FaStickyNote className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Main office cash account"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Save Ledger
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>}

        {/* Ledger Table */}
        {!form && <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-b border-gray-200 flex flex-wrap gap-210">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaList className="w-5 h-5 text-blue-600" />
                Ledger List
              </h2>
            </div>
            <div>
              <button onClick={()=>setForm(true)} className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              > <FaPlus className="w-4 h-4" /> Add New Ledger</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ledger ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Group/Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {ledgers.length > 0 ? (
                  ledgers.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.ledgerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.accountName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.accountType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{item.openingBalance?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.balanceType === 'Debit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {item.balanceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.group}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 group"
                          title="Delete Product">
                          <MdDeleteForever className="w-4 h-4 group-hover:scale-110 transition-transform" />

                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaBook className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No Ledgers Found</p>
                        <p className="text-xs text-gray-400 mt-1">Create your first ledger to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
}
      </div>
    </div>
  );
};

export default AllLedger;