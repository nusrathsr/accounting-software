// import React, { useContext, useState } from 'react';
// import axios from 'axios';
// import {GlobalContext} from '../../context/GlobalContext'
// import { useNavigate } from 'react-router-dom';

// const AddCustomer = () => {
//   const {baseURL} =useContext(GlobalContext)
//   const navigate =useNavigate()
//   const [customer, setCustomer] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     type: '',
//     gstNumber: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomer((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(`${baseURL}/customer`, customer); // <-- Backend API endpoint
//       console.log('Customer Added:', res.data);

//       alert('Customer added successfully!');
//       navigate('/listCustomer')
//       // Reset form
//       setCustomer({
//         name: '',
//         phone: '',
//         email: '',
//         type: '',
//         gstNumber: '',
//         address: '',
//         city: '',
//         state: '',
//         pincode: '',
//       });
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert(error.response?.data?.message || 'Failed to add customer');
//     }
//   };

//   return (
//     <div className="p-4  sm:px-8 lg:px-12">
//       <div className="bg-white p-6 shadow rounded max-w-5xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-white-700">Add Customer</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name + Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={customer.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Phone Number *</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={customer.phone}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//           </div>

//           {/* Email + Type */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={customer.email}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Customer Type *</label>
//               <select
//                 name="type"
//                 value={customer.type}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded bg-transparent"
//               >
//                 <option value="">Select Type</option>
//                 <option value="Retail Customer">Retail Customer</option>
//                 <option value="Wholesale Customer">Wholesale Customer</option>
//                 <option value="Supplier">supplier</option>
//                 <option value="seller">Seller</option>
                
//               </select>
//             </div>
//           </div>

//           {/* GST for certain types */}
//           {['wholesale', 'distributor', 'vendor'].includes(customer.type) && (
//             <div>
//               <label className="block font-medium">GST Number</label>
//               <input
//                 type="text"
//                 name="gstNumber"
//                 value={customer.gstNumber}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-transparent"
//                 required
//               />
//             </div>
//           )}

//           {/* Address */}
//           <div>
//             <label className="block font-medium">Address</label>
//             <textarea
//               name="address"
//               value={customer.address}
//               onChange={handleChange}
//               rows="2"
//               className="w-full p-2 border rounded bg-transparent"
//             ></textarea>
//           </div>

//           {/* City + State */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={customer.city}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">State</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={customer.state}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//           </div>

//           {/* Pincode */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium">Pincode</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={customer.pincode}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-transparent"
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="pt-4 text-right">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Add Customer
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;






import React, { useContext, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaCity, 
  FaGlobe, 
  FaFileInvoice,
  FaSave,
  FaArrowLeft,
  FaUserPlus
} from 'react-icons/fa';
import { MdLocationCity } from 'react-icons/md';

const AddCustomer = () => {
  const { baseURL } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    type: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/customer`, customer);
      console.log('Customer Added:', res.data);

      // Success notification (you might want to use a toast library)
      alert('Customer added successfully!');
      navigate('/listCustomer');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert(error.response?.data?.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/listCustomer');
  };

  const customerTypes = [
    { value: 'Retail Customer', label: 'Retail Customer', color: 'blue' },
    { value: 'Wholesale Customer', label: 'Wholesale Customer', color: 'green' },
    { value: 'Supplier', label: 'Supplier', color: 'purple' },
    { value: 'Seller', label: 'Seller', color: 'orange' },
  ];

  const showGSTField = ['Wholesale Customer', 'Supplier', 'Seller'].includes(customer.type);

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
                <FaUserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Customer</h1>
                <p className="text-blue-100 text-sm">Create a new customer profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <FaUser className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="type"
                      value={customer.type}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Select customer type</option>
                      {customerTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* GST Number - Conditional */}
              {showGSTField && (
                <div className="mt-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      GST Number
                    </label>
                    <div className="relative">
                      <FaFileInvoice className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="gstNumber"
                        value={customer.gstNumber}
                        onChange={handleChange}
                        placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Information Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                Address Information
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter complete address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="relative">
                      <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="city"
                        value={customer.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="state"
                        value={customer.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <div className="relative">
                      <MdLocationCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="pincode"
                        value={customer.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
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
                      Add Customer
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
              <p className="font-medium mb-1">Tips for adding customers:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Fields marked with <span className="text-red-500">*</span> are required</li>
                <li>GST number is automatically required for wholesale customers, suppliers, and sellers</li>
                <li>Phone number should include country code for international customers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;