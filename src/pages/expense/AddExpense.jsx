// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { GlobalContext } from '../../context/GlobalContext';

// const AddExpense = () => {
//   const {baseURL}=useContext(GlobalContext)
//   const [expense, setExpense] = useState({
//     expenseId: '',
//     date: '',
//     category: '',
//     amount: '',
//     paymentMethod: '',
//     paidTo: '',
//     description: '',
//     attachment: null
//   });

//   // Auto-generate Expense ID on mount
//   useEffect(() => {
//     const id = 'EXP-' + Date.now().toString().slice(-6);
//     setExpense((prev) => ({ ...prev, expenseId: id, date: new Date().toISOString().slice(0,10) }));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setExpense((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setExpense((prev) => ({ ...prev, attachment: e.target.files[0] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       for (let key in expense) {
//         if (expense[key] !== null) {
//           formData.append(key, expense[key]);
//         }
//       }

//       const res = await axios.post(`${baseURL}/expense`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       alert('Expense added successfully!');
//       setExpense((prev) => ({ ...prev, category:'', amount:'', paymentMethod:'', paidTo:'', description:'', attachment:null }));
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Failed to add expense');
//     }
//   };

//   return (
//     <div className="p-4 sm:px-8 lg:px-12">
//       <div className="bg-white p-6 shadow rounded max-w-4xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-white-700">Add Expense</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Expense ID</label>
//               <input
//                 type="text"
//                 name="expenseId"
//                 value={expense.expenseId}
//                 readOnly
//                 className="w-full p-2 border rounded bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block font-medium">Date *</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={expense.date}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Category *</label>
//               <select
//                 name="category"
//                 value={expense.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select Category</option>
//                 <option value="Electricity">Electricity</option>
//                 <option value="Salary">Salary</option>
//                 <option value="Rent">Rent</option>
//                 <option value="Misc">Misc</option>
//                 <option value="Others">Others</option>
//               </select>
//             </div>

//             <div>
//               <label className="block font-medium">Amount *</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={expense.amount}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Payment Method *</label>
//               <select
//                 name="paymentMethod"
//                 value={expense.paymentMethod}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select Payment Method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Bank">Bank</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Card">Card</option>
//               </select>
//             </div>

//             <div>
//               <label className="block font-medium">Paid To</label>
//               <input
//                 type="text"
//                 name="paidTo"
//                 value={expense.paidTo}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium">Description</label>
//             <textarea
//               name="description"
//               value={expense.description}
//               onChange={handleChange}
//               rows="2"
//               className="w-full p-2 border rounded"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block font-medium">Attachment (Bill / Receipt)</label>
//             <input
//               type="file"
//               name="attachment"
//               onChange={handleFileChange}
//               className="w-full p-2 border rounded"
//               accept=".jpg,.jpeg,.png,.pdf"
//             />
//           </div>

//           <div className="pt-4 text-right">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Add Expense
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddExpense;






import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaReceipt, 
  FaCalendarAlt, 
  FaTags, 
  FaDollarSign, 
  FaCreditCard, 
  FaUser,
  FaFileAlt,
  FaPaperclip,
  FaSave,
  FaArrowLeft,
  FaPlus,
  FaMoneyBillWave,
  FaHashtag
} from 'react-icons/fa';
import { MdAttachMoney, MdDescription } from 'react-icons/md';

const AddExpense = () => {
  const { baseURL } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    expenseId: '',
    date: '',
    category: '',
    amount: '',
    paymentMethod: '',
    paidTo: '',
    description: '',
    attachment: null
  });

  // Auto-generate Expense ID on mount
  useEffect(() => {
    const id = 'EXP-' + Date.now().toString().slice(-6);
    setExpense((prev) => ({ 
      ...prev, 
      expenseId: id, 
      date: new Date().toISOString().slice(0, 10) 
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setExpense((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      for (let key in expense) {
        if (expense[key] !== null) {
          formData.append(key, expense[key]);
        }
      }

      const res = await axios.post(`${baseURL}/expense`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Expense added successfully!');
      
      // Reset form but keep expense ID and date
      const newId = 'EXP-' + Date.now().toString().slice(-6);
      setExpense({
        expenseId: newId,
        date: new Date().toISOString().slice(0, 10),
        category: '',
        amount: '',
        paymentMethod: '',
        paidTo: '',
        description: '',
        attachment: null
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/listExpense'); // Adjust route as needed
  };

  const categories = [
    { value: 'Electricity', label: 'Electricity', icon: '⚡' },
    { value: 'Salary', label: 'Salary', icon: '💰' },
    { value: 'Rent', label: 'Rent', icon: '🏢' },
    { value: 'Misc', label: 'Miscellaneous', icon: '📋' },
    { value: 'Others', label: 'Others', icon: '📦' },
  ];

  const paymentMethods = [
    { value: 'Cash', label: 'Cash', icon: '💵' },
    { value: 'Bank', label: 'Bank Transfer', icon: '🏦' },
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'Card', label: 'Credit/Debit Card', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaReceipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Expense</h1>
                <p className="text-blue-100 text-sm">Record a new business expense</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaHashtag className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expense ID
                  </label>
                  <div className="relative">
                    <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="expenseId"
                      value={expense.expenseId}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="date"
                      value={expense.date}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Details Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaMoneyBillWave className="w-5 h-5 text-blue-600" />
                Expense Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="category"
                      value={expense.category}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select expense category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* <MdAttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
                    <input
                      type="number"
                      name="amount"
                      value={expense.amount}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="paymentMethod"
                      value={expense.paymentMethod}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.icon} {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paid To
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="paidTo"
                      value={expense.paidTo}
                      onChange={handleChange}
                      placeholder="Enter recipient name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaFileAlt className="w-5 h-5 text-blue-600" />
                Additional Information
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <MdDescription className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="description"
                      value={expense.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter expense description or notes..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment (Receipt/Bill)
                  </label>
                  <div className="relative">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaPaperclip className="w-8 h-8 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG or PDF (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          name="attachment"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                      </label>
                    </div>
                    {expense.attachment && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaPaperclip className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-800 font-medium">
                            {expense.attachment.name}
                          </span>
                          <span className="text-xs text-blue-600">
                            ({(expense.attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
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
                      Add Expense
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Tips for recording expenses:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Fields marked with <span className="text-red-500">*</span> are required</li>
                <li>Always attach receipts or bills for better record keeping</li>
                <li>Use clear descriptions to make tracking easier</li>
                <li>Double-check the amount and category before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
