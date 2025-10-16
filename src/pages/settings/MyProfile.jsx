// import React, { useContext } from "react";
// import { GlobalContext } from "../../context/GlobalContext";

// const MyProfile = () => {
//   const { business } = useContext(GlobalContext);

//   if (!business || Object.keys(business).length === 0) {
//     return <p className="text-center text-gray-500 mt-10">No business details found.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
//       <h2 className="text-2xl font-bold mb-6 text-center">My Business Profile</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <p className="text-gray-700"><strong>Business Name:</strong> {business.businessName}</p>
//           <p className="text-gray-700"><strong>Owner Name:</strong> {business.ownerName}</p>
//           <p className="text-gray-700"><strong>Email:</strong> {business.email}</p>
//           <p className="text-gray-700"><strong>Phone:</strong> {business.phone}</p>
//           <p className="text-gray-700"><strong>GST Number:</strong> {business.gstNumber}</p>
//           <p className="text-gray-700"><strong>Business Type:</strong> {business.businessType}</p>
//         </div>

//         <div>
//           <p className="text-gray-700"><strong>Address:</strong> {business.address}</p>
//           <p className="text-gray-700"><strong>City:</strong> {business.city}</p>
//           <p className="text-gray-700"><strong>State:</strong> {business.state}</p>
//           <p className="text-gray-700"><strong>Country:</strong> {business.country}</p>
//           <p className="text-gray-700"><strong>PIN Code:</strong> {business.pincode}</p>
//           <p className="text-gray-700">
//             <strong>Created At:</strong> {new Date(business.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       {business.logo && (
//         <div className="mt-8 flex justify-center">
//           <img
//             src={business.logo}
//             alt="Business Logo"
//             className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyProfile;




import React, { useContext } from "react";
 import { GlobalContext } from "../../context/GlobalContext";
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Globe, 
  FileText,
  User,
  Calendar,
  Edit,
  Landmark,
  CreditCard,
  Settings,
  Briefcase
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { business } = useContext(GlobalContext);
  const navigator =useNavigate()
 

  if (!business || Object.keys(business).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No business details found.</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900 break-words">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">My Business Profile</h1>
                  <p className="text-blue-100 text-sm">View and manage your business information</p>
                </div>
              </div>
              <button onClick={()=>navigator("/updateProfile")} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Logo Card */}
        {business.logo && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={business.logo}
                  alt="Business Logo"
                  className="w-32 h-32 object-cover rounded-2xl border-4 border-blue-100 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{business.businessName}</h2>
              <p className="text-gray-500 text-sm">{business.businessType}</p>
            </div>
          </div>
        )}

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <InfoCard icon={Building} label="Business Name" value={business.businessName} />
              <InfoCard icon={Briefcase} label="Business Type" value={business.businessType} />
              <InfoCard icon={Building} label="Industry Type" value={business.industryType} />
              <InfoCard icon={User} label="Owner Name" value={business.ownerName} />
              <InfoCard icon={Mail} label="Email" value={business.email} />
              <InfoCard icon={Phone} label="Phone" value={business.phone} />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <InfoCard icon={MapPin} label="Address" value={business.address} />
              <InfoCard icon={Home} label="City" value={business.city} />
              <InfoCard icon={Globe} label="State" value={business.state} />
              <InfoCard icon={Globe} label="Country" value={business.country} />
              <InfoCard icon={MapPin} label="PIN Code" value={business.pincode} />
            </div>
          </div>

          {/* Tax & Compliance */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tax & Compliance
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <InfoCard icon={FileText} label="GST Number" value={business.gstNumber} />
              <InfoCard icon={FileText} label="PAN" value={business.pan} />
              <InfoCard icon={Calendar} label="Registered On" value={new Date(business.createdAt).toLocaleDateString()} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Bank Details
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <InfoCard icon={Landmark} label="Bank Name" value={business.bankName} />
              <InfoCard icon={User} label="Account Holder" value={business.accountHolder} />
              <InfoCard icon={CreditCard} label="Account Number" value={business.accountNumber} />
              <InfoCard icon={Landmark} label="IFSC Code" value={business.ifsc} />
              <InfoCard icon={Phone} label="UPI ID" value={business.upi} />
            </div>
          </div>

          {/* Business Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Business Settings
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoCard icon={Globe} label="Currency" value={business.currency} />
              <InfoCard icon={FileText} label="Invoice Prefix" value={business.invoicePrefix} />
              <InfoCard icon={Calendar} label="Member Since" value={new Date(business.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default MyProfile;
