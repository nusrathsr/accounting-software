// import React, { useContext, useState } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import api from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// const UpdateProfile = () => {
//   const { business, setBusiness } = useContext(GlobalContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     businessName: business?.businessName || "",
//     businessType: business?.businessType || "",
//     industryType: business?.industryType || "",
//     startDate: business?.startDate ? business.startDate.split("T")[0] : "",
//     logo: null,
//     email: business?.email || "",
//     phone: business?.phone || "",
//     address: business?.address || "",
//     pincode: business?.pincode || "",
//     city: business?.city || "",
//     state: business?.state || "",
//     gstin: business?.gstin || "",
//     pan: business?.pan || "",
//     bankName: business?.bankName || "",
//     accountHolder: business?.accountHolder || "",
//     accountNumber: business?.accountNumber || "",
//     ifsc: business?.ifsc || "",
//     upi: business?.upi || "",
//     ownerName: business?.ownerName || "",
//     ownerEmail: business?.ownerEmail || "",
//     ownerMobile: business?.ownerMobile || "",
//     password: business?.password || "",
//     financialYearStart: business?.financialYearStart ? business.financialYearStart.split("T")[0] : "",
//     currency: business?.currency || "",
//     invoicePrefix: business?.invoicePrefix || "",
//     enableInventory: business?.enableInventory || false,
//   });

//   const [loading, setLoading] = useState(false);

//   // text change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // file upload
//   const handleFileChange = (e) => {
//     setFormData({ ...formData, logo: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const businessId = localStorage.getItem("businessId");
//       const fd = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) fd.append(key, value);
//       });

//       const { data } = await api.put(`/business/${businessId}`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setBusiness(data);
//       alert("Business profile updated successfully!");
//       navigate("/myProfile");
//     } catch (error) {
//       console.error("Error updating business:", error);
//       alert(error.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
//       <h2 className="text-2xl font-bold mb-8 text-center">Update Business Profile</h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* ---------- Business Info ---------- */}
//         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h3>
//         <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" className="border rounded-md p-2" />
//         <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} placeholder="Business Type" className="border rounded-md p-2" />
//         <input type="text" name="industryType" value={formData.industryType} onChange={handleChange} placeholder="Industry Type" className="border rounded-md p-2" />
//         <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border rounded-md p-2" />
//         <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Business Email" className="border rounded-md p-2" />
//         <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border rounded-md p-2" />
//         <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border rounded-md p-2" />
//         <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border rounded-md p-2" />
//         <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border rounded-md p-2" />
//         <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="border rounded-md p-2" />

//         {/* ---------- Tax Info ---------- */}
//         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Tax Details</h3>
//         <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="GSTIN" className="border rounded-md p-2" />
//         <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="PAN" className="border rounded-md p-2" />

//         {/* ---------- Bank Info ---------- */}
//         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Bank Details</h3>
//         <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" className="border rounded-md p-2" />
//         <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} placeholder="Account Holder" className="border rounded-md p-2" />
//         <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" className="border rounded-md p-2" />
//         <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} placeholder="IFSC Code" className="border rounded-md p-2" />
//         <input type="text" name="upi" value={formData.upi} onChange={handleChange} placeholder="UPI ID" className="border rounded-md p-2" />

//         {/* ---------- Owner Info ---------- */}
//         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Owner Details</h3>
//         <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" className="border rounded-md p-2" />
//         <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} placeholder="Owner Email" className="border rounded-md p-2" />
//         <input type="text" name="ownerMobile" value={formData.ownerMobile} onChange={handleChange} placeholder="Owner Mobile" className="border rounded-md p-2" />
//         <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border rounded-md p-2" />

//         {/* ---------- Settings ---------- */}
//         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Business Settings</h3>
//         <input type="date" name="financialYearStart" value={formData.financialYearStart} onChange={handleChange} className="border rounded-md p-2" />
//         <input type="text" name="currency" value={formData.currency} onChange={handleChange} placeholder="Currency (e.g. INR, USD)" className="border rounded-md p-2" />
//         <input type="text" name="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} placeholder="Invoice Prefix (e.g. INV-)" className="border rounded-md p-2" />

//         <div className="flex items-center gap-2 md:col-span-2">
//           <input
//             type="checkbox"
//             name="enableInventory"
//             checked={formData.enableInventory}
//             onChange={handleChange}
//           />
//           <label>Enable Inventory Management</label>
//         </div>

//         {/* ---------- Logo ---------- */}
//         <div className="md:col-span-2">
//           <label className="block text-gray-700">Business Logo</label>
//           <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="w-full border rounded-md p-2" />
//         </div>

//         {/* ---------- Submit ---------- */}
//         <div className="md:col-span-2 text-center mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;



import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
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
  Landmark,
  User,
  Calculator,
  Upload,
  Settings
} from 'lucide-react';

const UpdateProfile = () => {
  const { business, setBusiness } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: business?.businessName || "",
    businessType: business?.businessType || "",
    industryType: business?.industryType || "",
    startDate: business?.startDate ? business.startDate.split("T")[0] : "",
    logo: null,
    email: business?.email || "",
    phone: business?.phone || "",
    address: business?.address || "",
    pincode: business?.pincode || "",
    city: business?.city || "",
    state: business?.state || "",
    gstin: business?.gstin || "",
    pan: business?.pan || "",
    bankName: business?.bankName || "",
    accountHolder: business?.accountHolder || "",
    accountNumber: business?.accountNumber || "",
    ifsc: business?.ifsc || "",
    upi: business?.upi || "",
    ownerName: business?.ownerName || "",
    ownerEmail: business?.ownerEmail || "",
    ownerMobile: business?.ownerMobile || "",
    password: business?.password || "",
    financialYearStart: business?.financialYearStart ? business.financialYearStart.split("T")[0] : "",
    currency: business?.currency || "",
    invoicePrefix: business?.invoicePrefix || "",
    enableInventory: business?.enableInventory || false,
  });

  const [loading, setLoading] = useState(false);

  // text change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const businessId = localStorage.getItem("businessId");
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) fd.append(key, value);
      });

      const { data } = await api.put(`/business/${businessId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBusiness(data);
      alert("Business profile updated successfully!");
      navigate("/myProfile");
    } catch (error) {
      console.error("Error updating business:", error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    console.log("Cancel clicked");
  };

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
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Update Business Profile</h1>
                <p className="text-blue-100 text-sm">Modify your business information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Business Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter business name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="Enter business type"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Industry Type
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      placeholder="Enter industry type"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
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
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="phone"
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
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
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
              </div>
            </div>

            {/* Tax & Compliance Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Tax & Compliance Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    GSTIN
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

            {/* Bank Details Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                Bank Details
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
                      type="text"
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
                    UPI ID
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

            {/* Owner Details Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Owner Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Owner Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Owner Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      placeholder="Enter owner email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Owner Mobile
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="ownerMobile"
                      value={formData.ownerMobile}
                      onChange={handleChange}
                      placeholder="Enter owner mobile"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
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

            {/* Business Settings Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Business Settings
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
                    Currency
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      placeholder="e.g. INR, USD"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
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
                      placeholder="e.g. INV-"
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
                    <span className="text-sm font-medium text-gray-700">Enable Inventory Management</span>
                  </label>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Logo
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
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
                      <Save className="w-4 h-4" />
                      Update Profile
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
              <p className="font-medium mb-1">Update your business profile:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>All changes will be saved to your business profile</li>
                <li>Ensure tax and compliance information is accurate</li>
                <li>Update logo by uploading a new image file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;