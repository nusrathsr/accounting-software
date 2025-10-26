
// import React, { useContext, useState } from "react";
// import api from "../../utils/api";
// import { GlobalContext } from "../../context/GlobalContext";

// const BusinessRegister = () => {
//     const {setIsRegistered}=useContext(GlobalContext)
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     businessName: "",
//     businessType: "",
//     industryType: "",
//     startDate: "",
//     logo: null,
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     city: "",
//     state: "",
//     gstin: "",
//     pan: "",
//     bankName: "",
//     accountHolder: "",
//     accountNumber: "",
//     ifsc: "",
//     upi: "",
//     ownerName: "",
//     ownerEmail: "",
//     ownerMobile: "",
//     password: "",
//     financialYearStart: "",
//     currency: "",
//     invoicePrefix: "",
//     enableInventory: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : files ? files[0] : value,
//     });
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });

//     const { data } = await api.post(
//       "/business",
//       formDataToSend,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
   
//     alert("✅ " + data.message);
//     console.log("Response:", data);
//    localStorage.setItem("businessId", data.business._id);
//    setIsRegistered(true)
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to register business");
//   }
// };


//   const inputClass =
//     "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

//   return (
//     <div className="max-w-5xl w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
//       <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
//         Business Setup (Step {step} of 6)
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Step 1: Basic Info */}
//         {step === 1 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">1. Basic Business Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="businessName"
//                 placeholder="Business Name"
//                 value={formData.businessName}
//                 onChange={handleChange}
//                 className={inputClass}
//                 required
//               />
//               <select
//                 name="businessType"
//                 value={formData.businessType}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">Select Business Type</option>
//                 <option value="proprietorship">Proprietorship</option>
//                 <option value="partnership">Partnership</option>
//                 <option value="pvt_ltd">Private Limited</option>
//               </select>

//               <select
//                 name="industryType"
//                 value={formData.industryType}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">Select Industry Type</option>
//                 <option value="retail">Retail</option>
//                 <option value="manufacturing">Manufacturing</option>
//                 <option value="service">Service</option>
//               </select>

//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className={inputClass}
//               />

//               <input
//                 type="file"
//                 name="logo"
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 2: Contact */}
//         {step === 2 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">2. Contact & Address</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="number"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <textarea
//                 name="address"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className={`${inputClass} col-span-2`}
//               />
//               <input
//                 type="text"
//                 name="pincode"
//                 placeholder="Pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">Select State</option>
//                 <option value="Kerala">Kerala</option>
//                 <option value="Karnataka">Karnataka</option>
//                 <option value="Tamil Nadu">Tamil Nadu</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Tax */}
//         {step === 3 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">3. Tax & Compliance</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="gstin"
//                 placeholder="GSTIN (optional)"
//                 value={formData.gstin}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="text"
//                 name="pan"
//                 placeholder="PAN / Tax ID"
//                 value={formData.pan}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 4: Bank */}
//         {step === 4 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">4. Bank / Payment Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="bankName"
//                 placeholder="Bank Name"
//                 value={formData.bankName}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="text"
//                 name="accountHolder"
//                 placeholder="Account Holder Name"
//                 value={formData.accountHolder}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="number"
//                 name="accountNumber"
//                 placeholder="Account Number"
//                 value={formData.accountNumber}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="text"
//                 name="ifsc"
//                 placeholder="IFSC Code"
//                 value={formData.ifsc}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="text"
//                 name="upi"
//                 placeholder="UPI ID (optional)"
//                 value={formData.upi}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 5: Owner */}
//         {step === 5 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">5. Owner / Admin Account</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="ownerName"
//                 placeholder="Owner Full Name"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="email"
//                 name="ownerEmail"
//                 placeholder="Email (Login)"
//                 value={formData.ownerEmail}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="number"
//                 name="ownerMobile"
//                 placeholder="Mobile (Login)"
//                 value={formData.ownerMobile}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 6: Accounting */}
//         {step === 6 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">6. Accounting Settings</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="date"
//                 name="financialYearStart"
//                 value={formData.financialYearStart}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <select
//                 name="currency"
//                 value={formData.currency}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">Select Currency</option>
//                 <option value="INR">INR</option>
//                 <option value="USD">USD</option>
//                 <option value="EUR">EUR</option>
//               </select>
//               <input
//                 type="text"
//                 name="invoicePrefix"
//                 placeholder="Invoice Prefix"
//                 value={formData.invoicePrefix}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               <label className="flex items-center gap-2 col-span-2">
//                 <input
//                   type="checkbox"
//                   name="enableInventory"
//                   checked={formData.enableInventory}
//                   onChange={handleChange}
//                 />
//                 Enable Inventory Tracking
//               </label>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-6">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={prevStep}
//               className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//             >
//               Previous
//             </button>
//           )}
//           {step < 6 && (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Next
//             </button>
//           )}
//           {step === 6 && (
//             <button
//               type="submit"
//               className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BusinessRegister;




// import React, { useContext, useState } from "react";
// import { 
//   Building, 
//   Phone, 
//   Mail, 
//   MapPin, 
//   Home, 
//   Globe, 
//   FileText,
//   Save,
//   ArrowLeft,
//   ArrowRight,
//   Landmark,
//   User,
//   Calculator
// } from 'lucide-react';
// import api from "../../utils/api";
// import { GlobalContext } from "../../context/GlobalContext";

// const BusinessRegister = () => {
//   const {setIsRegistered}=useContext(GlobalContext)
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     businessName: "",
//     businessType: "",
//     industryType: "",
//     startDate: "",
//     logo: null,
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     city: "",
//     state: "",
//     gstin: "",
//     pan: "",
//     bankName: "",
//     accountHolder: "",
//     accountNumber: "",
//     ifsc: "",
//     upi: "",
//     ownerName: "",
//     ownerEmail: "",
//     ownerMobile: "",
//     password: "",
//     financialYearStart: "",
//     currency: "",
//     invoicePrefix: "",
//     enableInventory: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : files ? files[0] : value,
//     });
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });

//     const { data } = await api.post(
//       "/business",
//       formDataToSend,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
   
//     alert("✅ " + data.message);
//     console.log("Response:", data);
//    localStorage.setItem("businessId", data.business._id);
//    setIsRegistered(true)
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to register business");
//   }
// };



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                 <Building className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-white">Business Setup</h1>
//                 <p className="text-blue-100 text-sm">Step {step} of 6</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <form onSubmit={handleSubmit} className="p-8 space-y-8">
//             {/* Step 1: Basic Info */}
//             {step === 1 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <Building className="w-5 h-5 text-blue-600" />
//                   Basic Business Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Business Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="businessName"
//                         value={formData.businessName}
//                         onChange={handleChange}
//                         required
//                         placeholder="Enter business name"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Business Type
//                     </label>
//                     <div className="relative">
//                       <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <select
//                         name="businessType"
//                         value={formData.businessType}
//                         onChange={handleChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//                       >
//                         <option value="">Select Business Type</option>
//                         <option value="proprietorship">Proprietorship</option>
//                         <option value="partnership">Partnership</option>
//                         <option value="pvt_ltd">Private Limited</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Industry Type
//                     </label>
//                     <div className="relative">
//                       <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <select
//                         name="industryType"
//                         value={formData.industryType}
//                         onChange={handleChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//                       >
//                         <option value="">Select Industry Type</option>
//                         <option value="retail">Retail</option>
//                         <option value="manufacturing">Manufacturing</option>
//                         <option value="service">Service</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={formData.startDate}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                     />
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Business Logo
//                     </label>
//                     <input
//                       type="file"
//                       name="logo"
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Contact */}
//             {step === 2 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   Contact & Address Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Enter email address"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="number"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="Enter phone number"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Street Address
//                     </label>
//                     <div className="relative">
//                       <Building className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//                       <textarea
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         rows="3"
//                         placeholder="Enter complete address"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Pincode
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={formData.pincode}
//                         onChange={handleChange}
//                         placeholder="Enter pincode"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <div className="relative">
//                       <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         placeholder="Enter city"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <div className="relative">
//                       <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <select
//                         name="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//                       >
//                         <option value="">Select State</option>
//                         <option value="Kerala">Kerala</option>
//                         <option value="Karnataka">Karnataka</option>
//                         <option value="Tamil Nadu">Tamil Nadu</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Tax */}
//             {step === 3 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                   Tax & Compliance Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       GSTIN (Optional)
//                     </label>
//                     <div className="relative">
//                       <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="gstin"
//                         value={formData.gstin}
//                         onChange={handleChange}
//                         placeholder="Enter GSTIN"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       PAN / Tax ID
//                     </label>
//                     <div className="relative">
//                       <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="pan"
//                         value={formData.pan}
//                         onChange={handleChange}
//                         placeholder="Enter PAN / Tax ID"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 4: Bank */}
//             {step === 4 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <Landmark className="w-5 h-5 text-blue-600" />
//                   Bank / Payment Details
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Bank Name
//                     </label>
//                     <div className="relative">
//                       <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="bankName"
//                         value={formData.bankName}
//                         onChange={handleChange}
//                         placeholder="Enter bank name"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Account Holder Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="accountHolder"
//                         value={formData.accountHolder}
//                         onChange={handleChange}
//                         placeholder="Enter account holder name"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Account Number
//                     </label>
//                     <div className="relative">
//                       <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="number"
//                         name="accountNumber"
//                         value={formData.accountNumber}
//                         onChange={handleChange}
//                         placeholder="Enter account number"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       IFSC Code
//                     </label>
//                     <div className="relative">
//                       <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="ifsc"
//                         value={formData.ifsc}
//                         onChange={handleChange}
//                         placeholder="Enter IFSC code"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       UPI ID (Optional)
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="upi"
//                         value={formData.upi}
//                         onChange={handleChange}
//                         placeholder="Enter UPI ID"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 5: Owner */}
//             {step === 5 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <User className="w-5 h-5 text-blue-600" />
//                   Owner / Admin Account
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Owner Full Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="ownerName"
//                         value={formData.ownerName}
//                         onChange={handleChange}
//                         placeholder="Enter owner full name"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Email (Login)
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="email"
//                         name="ownerEmail"
//                         value={formData.ownerEmail}
//                         onChange={handleChange}
//                         placeholder="Enter email"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Mobile (Login)
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="number"
//                         name="ownerMobile"
//                         value={formData.ownerMobile}
//                         onChange={handleChange}
//                         placeholder="Enter mobile number"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Enter password"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 6: Accounting */}
//             {step === 6 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <Calculator className="w-5 h-5 text-blue-600" />
//                   Accounting Settings
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Financial Year Start
//                     </label>
//                     <input
//                       type="date"
//                       name="financialYearStart"
//                       value={formData.financialYearStart}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Currency
//                     </label>
//                     <div className="relative">
//                       <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <select
//                         name="currency"
//                         value={formData.currency}
//                         onChange={handleChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
//                       >
//                         <option value="">Select Currency</option>
//                         <option value="INR">INR</option>
//                         <option value="USD">USD</option>
//                         <option value="EUR">EUR</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Invoice Prefix
//                     </label>
//                     <div className="relative">
//                       <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="invoicePrefix"
//                         value={formData.invoicePrefix}
//                         onChange={handleChange}
//                         placeholder="Enter invoice prefix"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2 flex items-end">
//                     <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 w-full">
//                       <input
//                         type="checkbox"
//                         name="enableInventory"
//                         checked={formData.enableInventory}
//                         onChange={handleChange}
//                         className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="text-sm font-medium text-gray-700">Enable Inventory Tracking</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="border-t border-gray-100 pt-8">
//               <div className="flex flex-col sm:flex-row gap-4 justify-between">
//                 {step > 1 && (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md flex items-center gap-2 justify-center"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     Previous
//                   </button>
//                 )}
//                 {step < 6 && (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
//                   >
//                     Next
//                     <ArrowRight className="w-4 h-4" />
//                   </button>
//                 )}
//                 {step === 6 && (
//                   <button
//                     type="submit"
//                     className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
//                   >
//                     <Save className="w-4 h-4" />
//                     Submit
//                   </button>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Help Text */}
//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
//           <div className="flex items-start gap-3">
//             <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <span className="text-white text-xs font-bold">i</span>
//             </div>
//             <div className="text-sm text-blue-800">
//               <p className="font-medium mb-1">Tips for business registration:</p>
//               <ul className="list-disc list-inside space-y-1 text-blue-700">
//                 <li>Fill out all required fields marked with <span className="text-red-500">*</span></li>
//                 <li>Ensure all tax and compliance information is accurate</li>
//                 <li>Bank details are required for payment processing</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusinessRegister;

import React, { useContext, useState } from "react";
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Globe, 
  FileText,
  Save,
  ArrowLeft,
  ArrowRight,
  Landmark,
  User,
  Calculator
} from 'lucide-react';
import api from "../../utils/api";
import { GlobalContext } from "../../context/GlobalContext";

const BusinessRegister = () => {
  const {setIsRegistered}=useContext(GlobalContext)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    industryType: "",
    startDate: "",
    logo: null,
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    gstin: "",
    pan: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    password: "",
    financialYearStart: "",
    currency: "",
    invoicePrefix: "",
    enableInventory: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });

//     const { data } = await api.post(
//       "/business",
//       formDataToSend,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
   
//     alert("✅ " + data.message);
//     console.log("Response:", data);
//    localStorage.setItem("businessId", data.business._id);
//    setIsRegistered(true)
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to register business");
//   }
// };



const handleSubmit = async (e) => {
  e.preventDefault();

  // List all required fields
  const requiredFields = [
    "businessName",
    "businessType",
    "industryType",
    "email",
    "phone",
    "ownerName",
    "password",
  ];

  // Check if any required field is empty
  const emptyField = requiredFields.find(field => !formData[field] || formData[field].toString().trim() === "");

  if (emptyField) {
    alert(`Please fill the required field: ${emptyField}`);
    return; // Stop form submission
  }

  // If all required fields are filled, continue submitting
  try {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    const { data } = await api.post("/business", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(data.message);
    localStorage.setItem("businessId", data.business._id);
    setIsRegistered(true);
  } catch (err) {
    console.error(err);
    alert("Failed to register business");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Business Setup</h1>
                <p className="text-blue-100 text-sm">Step {step} of 6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Basic Business Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        placeholder="Enter business name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Type<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        required
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      >
                        <option value="">Select Business Type</option>
                        <option value="proprietorship">Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="pvt_ltd">Private Limited</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Industry Type<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        required
                        name="industryType"
                        value={formData.industryType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      >
                        <option value="">Select Industry Type</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="service">Service</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Logo
                    </label>
                    <input
                      type="file"
                      name="logo"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Contact & Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter complete address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
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
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      >
                        <option value="">Select State</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tax */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Tax & Compliance Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      GSTIN (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        placeholder="Enter GSTIN"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      PAN / Tax ID
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        placeholder="Enter PAN / Tax ID"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bank */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-blue-600" />
                  Bank / Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Enter bank name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        placeholder="Enter account holder name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Enter account number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleChange}
                        placeholder="Enter IFSC code"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      UPI ID (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="upi"
                        value={formData.upi}
                        onChange={handleChange}
                        placeholder="Enter UPI ID"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Owner */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Owner / Admin Account
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter owner full name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email (Login)<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                      required
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile (Login)<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                      required
                        type="number"
                        name="ownerMobile"
                        value={formData.ownerMobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <input
                    required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Accounting */}
            {step === 6 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Accounting Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Financial Year Start
                    </label>
                    <input
                      type="date"
                      name="financialYearStart"
                      value={formData.financialYearStart}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Currency<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                      required
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      >
                        <option value="">Select Currency</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Invoice Prefix
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="invoicePrefix"
                        value={formData.invoicePrefix}
                        onChange={handleChange}
                        placeholder="Enter invoice prefix"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 w-full">
                      <input
                        type="checkbox"
                        name="enableInventory"
                        checked={formData.enableInventory}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Inventory Tracking</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md flex items-center gap-2 justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
                {step < 6 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {step === 6 && (
                  <button
                    type="submit"
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                  >
                    <Save className="w-4 h-4" />
                    Submit
                  </button>
                )}
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
              <p className="font-medium mb-1">Tips for business registration:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Fill out all required fields marked with <span className="text-red-500">*</span></li>
                <li>Ensure all tax and compliance information is accurate</li>
                <li>Bank details are required for payment processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;