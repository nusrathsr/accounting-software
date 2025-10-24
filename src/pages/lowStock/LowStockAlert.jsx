// import React, { useContext, useMemo } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

// const LowStockAlert = () => {
//   const { product } = useContext(GlobalContext);

//   const lowStockCount = useMemo(() => {
//     if (!product) return 0;
//     return product.reduce((count, product) => {
//       const lowVariants = product.variants.filter((v) => v.quantity < 10)
//       return count + lowVariants.length
//     }, 0)
//   }, [product])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
//                   <FaExclamationTriangle className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-white">⚠️ Low Stock Alerts</h1>
//                   <p className="text-indigo-100 text-sm">Monitor critical inventory levels</p>
//                 </div>
//               </div>
//               {lowStockCount > 0 && (
//                 <div className="flex items-center gap-3">
//                   <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
//                     {lowStockCount}
//                   </span>
//                   <div className="text-white">
//                     <p className="font-semibold animate-pulse">{lowStockCount} Items in Low Stock 🚨</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Card */}
//         <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Critical Stock Items</p>
//                 <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
//                 <p className="text-xs text-gray-500 mt-1">Items with quantity below 10</p>
//               </div>
//               <div className="bg-red-500 rounded-lg p-3">
//                 <FaExclamationTriangle className="w-6 h-6 text-white" />
//               </div>
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
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Details</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Qty</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {product && product.length > 0 ? (
//                   product.map((product) =>
//                     product.variants.map((variant) => {
//                       const currentQty = variant.quantity;
//                       const isLowStock = currentQty < 10; // hardcoded threshold

//                       return (
//                         <tr
//                           key={variant.variantId}
//                           className={`hover:bg-gray-50 transition-colors duration-200 ${
//                             isLowStock ? "bg-red-50" : "bg-white"
//                           }`}
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-4">
//                               <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
//                                 {product.name?.charAt(0)?.toUpperCase() || '?'}
//                               </div>
//                               <div>
//                                 <div className="font-semibold text-gray-900">{product.name}</div>
//                                 <div className="text-sm text-gray-500">Brand: {product.brand}</div>
//                                 <div className="text-xs text-gray-400">Category: {product.category}</div>
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4">
//                             <div className="text-sm">
//                               <div className="text-gray-900 font-medium">{variant.variantName || '--'}</div>
//                               <div className="text-gray-500">{variant.sizeOrWeight || '--'}</div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4">
//                             <div className="text-sm">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-gray-900 font-medium">{currentQty}</span>
//                                 <span className="text-gray-500">pcs</span>
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4">
//                             <div className={`text-sm font-bold ${
//                               isLowStock ? "text-red-600" : "text-green-600"
//                             }`}>
//                               {isLowStock ? "Low Stock 🚨 (Reorder Now)" : "in stock ✅"}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )
//                 ) : (
//                   <tr>
//                     <td className="px-6 py-12 text-center" colSpan="4">
//                       <div className="text-gray-400">
//                         <FaBoxOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                         <p className="text-lg font-medium mb-2">No products found</p>
//                         <p className="text-sm">Add products to monitor stock levels</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Help Text */}
//         <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
//           <div className="flex items-start gap-3">
//             <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//               <span className="text-white text-xs font-bold">!</span>
//             </div>
//             <div className="text-sm text-red-800">
//               <p className="font-medium mb-1">Low Stock Alert Information:</p>
//               <ul className="list-disc list-inside space-y-1 text-red-700">
//                 <li>Items with quantity below 10 units are considered low stock</li>
//                 <li>Red background indicates critical stock levels requiring immediate attention</li>
//                 <li>Monitor this page regularly to avoid stockouts</li>
//                 <li>Consider setting up automated reorder points for frequently sold items</li>
//                 <li>The alert badge shows total number of variants with low stock</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LowStockAlert;



import React, { useContext, useMemo } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

const LowStockAlert = () => {
  const { product } = useContext(GlobalContext);

  const lowStockCount = useMemo(() => {
    if (!product) return 0;
    return product.reduce((count, product) => {
      const lowVariants = product.variants.filter((v) => v.quantity < 10);
      return count + lowVariants.length;
    }, 0);
  }, [product]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaExclamationTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    ⚠️ Low Stock Alerts
                  </h1>
                  <p className="text-indigo-100 text-sm">
                    Monitor critical inventory levels
                  </p>
                </div>
              </div>
              {lowStockCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {lowStockCount}
                  </span>
                  <div className="text-white">
                    <p className="font-semibold animate-pulse">
                      {lowStockCount} Items in Low Stock 🚨
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Stock Items
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {lowStockCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Items with quantity below 10
                </p>
              </div>
              <div className="bg-red-500 rounded-lg p-3">
                <FaExclamationTriangle className="w-6 h-6 text-white" />
              </div>
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
                    Variant Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Qty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {product && product.length > 0 ? (
                  product.map((product) =>
                    product.variants.map((variant) => {
                      const currentQty = variant.quantity;
                      const isLowStock = currentQty < 10;

                      let statusMessage = "In Stock ✅";
                      let statusColor = "text-green-600";

                      if (currentQty < 5) {
                        statusMessage = "⚠️ Stock is VERY Low – Reorder Urgently!";
                        statusColor = "text-red-800";
                      } else if (isLowStock) {
                        statusMessage = "Low Stock 🚨 (Reorder Soon)";
                        statusColor = "text-red-600";
                      }

                      return (
                        <tr
                          key={variant.variantId}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            isLowStock ? "bg-red-50" : "bg-white"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                                {product.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Brand: {product.brand}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Category: {product.category}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="text-gray-900 font-medium">
                                {variant.variantName || "--"}
                              </div>
                              <div className="text-gray-500">
                                {variant.sizeOrWeight || "--"}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-medium">
                                  {currentQty}
                                </span>
                                <span className="text-gray-500">pcs</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className={`text-sm font-bold ${statusColor}`}>
                              {statusMessage}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan="4">
                      <div className="text-gray-400">
                        <FaBoxOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No products found
                        </p>
                        <p className="text-sm">
                          Add products to monitor stock levels
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
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Low Stock Alert Information:</p>
              <ul className="list-disc list-inside space-y-1 text-red-700">
                <li>Items with quantity below 10 units are considered low stock</li>
                <li>
                  Items with quantity below 5 units are **critical** – reorder
                  immediately
                </li>
                <li>
                  Red background indicates critical stock levels requiring
                  immediate attention
                </li>
                <li>Monitor this page regularly to avoid stockouts</li>
                <li>
                  Consider setting up automated reorder points for frequently
                  sold items
                </li>
                <li>
                  The alert badge shows total number of variants with low stock
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
