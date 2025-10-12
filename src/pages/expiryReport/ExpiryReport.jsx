// import React, { useContext, useState, useMemo } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import {
//   FaCalendarAlt,
//   FaExclamationTriangle,
//   FaBoxOpen,
//   FaFilter,
//   FaClock,
// } from "react-icons/fa";

// const ExpiryReport = () => {
//   const { product } = useContext(GlobalContext);
//   const [filterDays, setFilterDays] = useState("");

//   // check if product is expired
//   const isExpired = (expiryDate) => {
//     if (!expiryDate) return false;
//     return new Date(expiryDate) < new Date();
//   };

//   // check if product will expire within X days (but not already expired)
//   const isExpiringSoon = (expiryDate, days = 30) => {
//     if (!expiryDate) return false;

//     const today = new Date();
//     const targetDate = new Date(expiryDate);

//     return (
//       targetDate >= today &&
//       targetDate <= new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
//     );
//   };

//   // apply filter
//   // const filteredProducts = product.filter((p) => {
//   //   const expiryDate = p.expiryDate;

//   //   if (!filterDays) return true; // no filter → show all

//   //   return isExpiringSoon(expiryDate, filterDays);
//   // });


//   // apply filter - only products with expiry date
// const filteredProducts = product.filter((p) => {
//   const expiryDate = p.expiryDate;

//   if (!expiryDate) return false; // skip products without expiry

//   if (!filterDays) {
//     // no filter → show only expired or expiring soon
//     return isExpired(expiryDate) || isExpiringSoon(expiryDate, 30);
//   }

//   return isExpired(expiryDate) || isExpiringSoon(expiryDate, filterDays);
// });









//   // format date as dd-mm-yy
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "2-digit",
//     });
//   };

//   const expiredCount = useMemo(() => {
//     if (!product) return 0;
//     return product.filter(p => isExpired(p.expiryDate)).length;
//   }, [product]);

//   const expiringSoonCount = useMemo(() => {
//     if (!product) return 0;
//     return product.filter(p => isExpiringSoon(p.expiryDate, 30) && !isExpired(p.expiryDate)).length;
//   }, [product]);

//   const totalCritical = expiredCount + expiringSoonCount;

//   const daysLeft = (expiryDate) => {
//   if (!expiryDate) return null;
//   const today = new Date();
//   const target = new Date(expiryDate);
//   const diffTime = target - today;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays > 0 ? diffDays : 0; // if already expired, return 0
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                   <FaCalendarAlt className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">📅 Expiry Report</h1>
//                   <p className="text-indigo-100 text-sm">Monitor product expiration dates</p>
//                 </div>
//               </div>
//               {totalCritical > 0 && (
//                 <div className="flex items-center gap-3">
//                   <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
//                     {totalCritical}
//                   </span>
//                   <div className="text-white">
//                     <p className="font-semibold animate-pulse">{totalCritical} Critical Items 🚨</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Expired Products</p>
//                 <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
//                 <p className="text-xs text-gray-500 mt-1">Products past expiry date</p>
//               </div>
//               <div className="bg-red-500 rounded-lg p-3">
//                 <FaExclamationTriangle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
//                 <p className="text-2xl font-bold text-orange-600">{expiringSoonCount}</p>
//                 <p className="text-xs text-gray-500 mt-1">Products expiring within 30 days</p>
//               </div>
//               <div className="bg-orange-500 rounded-lg p-3">
//                 <FaClock className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 p-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-500 rounded-lg p-2">
//               <FaFilter className="w-4 h-4 text-white" />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Filter by expiry period</label>
//               <select
//                 className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filterDays}
//                 onChange={(e) => setFilterDays(Number(e.target.value))}
//               >
//                 <option value="">All Products</option>
//                 <option value={7}>Expiring within 7 days</option>
//                 <option value={15}>Expiring within 15 days</option>
//                 <option value={30}>Expiring within 30 days</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredProducts.length > 0 ? (
//                   filteredProducts.map((p) => {
//                     const expired = isExpired(p.expiryDate);
//                     const expiringSoon = isExpiringSoon(p.expiryDate, filterDays || 30);
                    
//                     return (
//                       <tr
//                         key={p._id}
//                         className={`hover:bg-gray-50 transition-colors duration-200 ${
//                           expired ? "bg-red-50" : expiringSoon ? "bg-orange-50" : "bg-white"
//                         }`}
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
//                               {p.name?.charAt(0)?.toUpperCase() || '?'}
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-900">{p.name}</div>
//                             </div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="text-sm">
//                             <div className="text-gray-900 font-medium">{p.brand}</div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="text-sm">
//                             <div className="text-gray-900 font-medium">{p.category}</div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="text-sm">
//                             <div className="text-gray-900 font-medium">{formatDate(p.expiryDate)}</div>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4">
//                           {expired ? (
//                             <div className="text-sm font-bold text-red-600 flex items-center gap-2">
//                               <FaExclamationTriangle /> Expired 🚨
//                             </div>
//                           ) : expiringSoon ? (
//                             <div className="text-sm font-bold text-orange-600 flex items-center gap-2">
//                               <FaClock />  Expiring Soon ⚠️ ({daysLeft(p.expiryDate)} days left)
//                             </div>
//                           ) : (
//                             <div className="text-sm font-bold text-green-600 flex items-center gap-2">
//                               <FaBoxOpen /> Safe ✅
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td className="px-6 py-12 text-center" colSpan="5">
//                       <div className="text-gray-400">
//                         <FaBoxOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                         <p className="text-lg font-medium mb-2">No products found</p>
//                         <p className="text-sm">Add products to monitor expiry dates</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Help Text */}
//         <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
//           <div className="flex items-start gap-3">
//             <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <span className="text-white text-xs font-bold">!</span>
//             </div>
//             <div className="text-sm text-orange-800">
//               <p className="font-medium mb-1">Expiry Report Information:</p>
//               <ul className="list-disc list-inside space-y-1 text-orange-700">
//                 <li>Products with red background have already expired and should be removed</li>
//                 <li>Products with orange background are expiring soon and need attention</li>
//                 <li>Use the filter dropdown to view products expiring within specific timeframes</li>
//                 <li>Monitor this page regularly to prevent selling expired products</li>
//                 <li>Consider implementing first-in-first-out (FIFO) inventory management</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpiryReport;

















import React, { useContext, useState, useMemo } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBoxOpen,
  FaFilter,
  FaClock,
} from "react-icons/fa";

const ExpiryReport = () => {
  const { product } = useContext(GlobalContext);
  const [filterDays, setFilterDays] = useState("");

  // check if product is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // check if product will expire within X days (but not already expired)
  const isExpiringSoon = (expiryDate, days = 30) => {
    if (!expiryDate) return false;

    const today = new Date();
    const targetDate = new Date(expiryDate);

    return (
      targetDate >= today &&
      targetDate <= new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    );
  };

  // ✅ apply filter correctly
  const filteredProducts = product.filter((p) => {
    const expiryDate = p.expiryDate;
    if (!expiryDate) return false; // skip products without expiry

    if (!filterDays) {
      // no filter → show expired OR expiring within 30 days
      return isExpired(expiryDate) || isExpiringSoon(expiryDate, 30);
    }

    // with filter: only show products expiring within filterDays
    return isExpiringSoon(expiryDate, filterDays);
  });

  // format date as dd-mm-yy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const expiredCount = useMemo(() => {
    if (!product) return 0;
    return product.filter((p) => isExpired(p.expiryDate)).length;
  }, [product]);

  const expiringSoonCount = useMemo(() => {
    if (!product) return 0;
    return product.filter(
      (p) => isExpiringSoon(p.expiryDate, 30) && !isExpired(p.expiryDate)
    ).length;
  }, [product]);

  const totalCritical = expiredCount + expiringSoonCount;

  // helper: calculate days left
  const daysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const target = new Date(expiryDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaCalendarAlt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    📅 Expiry Report
                  </h1>
                  <p className="text-indigo-100 text-sm">
                    Monitor product expiration dates
                  </p>
                </div>
              </div>
              {totalCritical > 0 && (
                <div className="flex items-center gap-3">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {totalCritical}
                  </span>
                  <div className="text-white">
                    <p className="font-semibold animate-pulse">
                      {totalCritical} Critical Items 🚨
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Expired Products
                </p>
                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Products past expiry date
                </p>
              </div>
              <div className="bg-red-500 rounded-lg p-3">
                <FaExclamationTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Expiring Soon
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {expiringSoonCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Products expiring within 30 days
                </p>
              </div>
              <div className="bg-orange-500 rounded-lg p-3">
                <FaClock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 rounded-lg p-2">
              <FaFilter className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by expiry period
              </label>
              <select
                className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterDays}
                onChange={(e) => setFilterDays(Number(e.target.value))}
              >
                <option value="">All Products</option>
                <option value={7}>Expiring within 7 days</option>
                <option value={15}>Expiring within 15 days</option>
                <option value={30}>Expiring within 30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const expired = isExpired(p.expiryDate);
                    const expiringSoon = isExpiringSoon(
                      p.expiryDate,
                      filterDays || 30
                    );

                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          expired
                            ? "bg-red-50"
                            : expiringSoon
                            ? "bg-orange-50"
                            : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                              {p.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {p.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {p.brand}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {p.category}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {formatDate(p.expiryDate)}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {expired ? (
                            <div className="text-sm font-bold text-red-600 flex items-center gap-2">
                              <FaExclamationTriangle /> Expired 🚨
                            </div>
                          ) : expiringSoon ? (
                            <div className="text-sm font-bold text-orange-600 flex items-center gap-2">
                              <FaClock /> Expiring Soon ⚠️ (
                              {daysLeft(p.expiryDate)} days left)
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-green-600 flex items-center gap-2">
                              <FaBoxOpen /> Safe ✅
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan="5">
                      <div className="text-gray-400">
                        <FaBoxOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No products found
                        </p>
                        <p className="text-sm">
                          Add products to monitor expiry dates
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">Expiry Report Information:</p>
              <ul className="list-disc list-inside space-y-1 text-orange-700">
                <li>
                  Products with red background have already expired and should
                  be removed
                </li>
                <li>
                  Products with orange background are expiring soon and need
                  attention
                </li>
                <li>
                  Use the filter dropdown to view products expiring within
                  specific timeframes
                </li>
                <li>
                  Monitor this page regularly to prevent selling expired
                  products
                </li>
                <li>
                  Consider implementing first-in-first-out (FIFO) inventory
                  management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryReport;











