// import React, { useState, useContext } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import axios from "axios";
// import Swal from "sweetalert2";


// const AddAdjustment = () => {
//   const { product, baseURL } = useContext(GlobalContext); // products already fetched in context
//   const today = new Date().toISOString().split("T")[0];

//   const generateAdjustmentId = () => {
//     const randomNo = Math.floor(Math.random() * 1000)
//     return `ADJ-${randomNo.toString().padStart(4, "0")}`
//   }
//   const [formData, setFormData] = useState({
//     adjustmentId: generateAdjustmentId(),
//     date: today,
//     product: "",
//     variant: "",
//     batchNo: "",
//     expiry: "",
//     systemQty: "",
//     physicalQty: "",
//     difference: 0,
//     adjustmentType: "",
//     reason: "",
//     otherReason: "",
//     remarks: "",
//     adjustedBy: "",
//     approvedBy: "",
//   });

//   // handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let updatedForm = { ...formData, [name]: value };

//     // Auto calculate difference & adjustmentType
//     if (name === "physicalQty") {
//       const diff = value - formData.systemQty;
//       updatedForm.difference = diff;
//       updatedForm.adjustmentType = diff > 0 ? "Increase" : diff < 0 ? "Decrease" : "";
//     }

//     setFormData(updatedForm);
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!formData.product || !formData.variant) {
//         Swal.fire("Error", "Please select product and variant!", "error");
//         return;
//       }
//       const response = await axios.post(`${baseURL}/stockAdjustment`, formData)
//       Swal.fire("Success", "Stock adjustment saved successfully!", "success");

//       console.log("Adjustment Saved:", response);

//       setFormData({
//         adjustmentId: generateAdjustmentId(),
//         date: today,
//         product: "",
//         variant: "",
//         batchNo: "",
//         expiry: "",
//         systemQty: "",
//         physicalQty: "",
//         difference: 0,
//         adjustmentType: "",
//         reason: "",
//         otherReason: "",
//         remarks: "",
//         adjustedBy: "",
//         approvedBy: "",
//       });

//     } catch (error) {
//       console.log(error);
//       Swal.fire("Error", "Failed to save adjustment!", "error");

//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">Stock Adjustment</h2>
//       <div>
//     <form onSubmit={handleSubmit} className="p-8">

//       {/* adjustmentID */}
//       <div className="mb-4">
//         <label className="block font-medium">Adjustment ID</label>
//         <input
//           type="text"
//           name="adjustmentId"
//           value={formData.adjustmentId}
//           readOnly
//           className="w-full border rounded px-3 py-2 bg-gray-100"
//         />
//       </div>




//       {/* date */}
//       <div className="mb-4">
//         <label className="block font-medium">Date</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>



//       {/* Product */}
//       <div className="mb-4">
//         <label className="block font-medium">Product</label>
//         <select
//           name="product"
//           value={formData.product}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="">-- Select Product --</option>
//           {product?.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Variant */}

//       {
//         formData.product && (
//           <div className="mb-4">
//             <label className="block font-medium">Product Variant</label>
//             <select name="variant"
//               value={formData.variant}
//               onChange={(e) => {
//                 const selectedProduct = product.find((p) => p._id === formData.product)
//                 const selectedVariant = selectedProduct?.variants.find((v) => v._id === e.target.value)
//                 setFormData({
//                   ...formData,
//                   variant: e.target.value,
//                   systemQty: selectedVariant?.quantity || 0,


//                 })
//               }}
//               className="w-full border rounded px-3 py-2">
//               <option value="">-- Select Variant --</option>
//               {
//                 product.find((p) => p._id === formData.product)?.variants?.map((v) => (
//                   <option key={v._id} value={v._id}>{v.variantName} (Stock: {v.quantity})</option>
//                 ))
//               }
//             </select>
//           </div>
//         )
//       }


//       {/* Batch / Expiry */}
//       {/* <div className="mb-4 grid grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Batch No.</label>
//           <input
//             type="text"
//             name="batchNo"
//             value={formData.batchNo}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Expiry Date</label>
//           <input
//             type="date"
//             name="expiry"
//             value={formData.expiry}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//       </div> */}

//       {/* System vs Physical Qty */}
//       <div className="mb-4 grid grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">System Quantity</label>
//           <input
//             type="number"
//             name="systemQty"
//             value={formData.systemQty}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Physical Quantity</label>
//           <input
//             type="number"
//             name="physicalQty"
//             value={formData.physicalQty}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* Auto Difference */}
//       <div className="mb-4">
//         <label className="block font-medium">Difference</label>
//         <input
//           type="number"
//           name="difference"
//           value={formData.difference}
//           readOnly
//           className="w-full border rounded px-3 py-2 bg-gray-100"
//         />
//       </div>

//       {/* Adjustment Type */}
//       <div className="mb-4">
//         <label className="block font-medium">Adjustment Type</label>
//         <input
//           type="text"
//           name="adjustmentType"
//           value={formData.adjustmentType}
//           readOnly
//           className="w-full border rounded px-3 py-2 bg-gray-100"
//         />
//       </div>

//       {/* Reason */}
//       <div className="mb-4">
//         <label className="block font-medium">Reason</label>
//         <select
//           name="reason"
//           value={formData.reason}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="">-- Select Reason --</option>
//           <option value="Expiry">Expiry</option>
//           <option value="Damage">Damage</option>
//           <option value="Missing">Missing</option>
//           <option value="Others">Others</option>
//         </select>
//       </div>

//       {/* Other Reason */}
//       {formData.reason === "Others" && (
//         <div className="mb-4">
//           <label className="block font-medium">Specify Reason</label>
//           <input
//             type="text"
//             name="otherReason"
//             value={formData.otherReason}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//       )}

//       {/* Remarks */}
//       <div className="mb-4">
//         <label className="block font-medium">Remarks</label>
//         <textarea
//           name="remarks"
//           value={formData.remarks}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//           rows={2}
//         ></textarea>
//       </div>

//       {/* Adjusted By / Approved By */}
//       <div className="mb-4 grid grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Adjusted By</label>
//           <input
//             type="text"
//             name="adjustedBy"
//             value={formData.adjustedBy}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Approved By</label>
//           <input
//             type="text"
//             name="approvedBy"
//             value={formData.approvedBy}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//       >
//         Save Adjustment
//       </button>
//       </form>
//       </div>
//     </div>
    
   
//   );
// };

// export default AddAdjustment;

import React, { useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBox,
  FaIdCard,
  FaCalendarAlt,
  FaLayerGroup,
  FaHashtag,
  FaBalanceScale,
  FaExclamationCircle,
  FaCommentAlt,
  FaUser,
  FaArrowLeft,
  FaPlus,
  FaSave
} from "react-icons/fa";

const AddAdjustment = () => {
  const { product, baseURL } = useContext(GlobalContext); // products already fetched in context
  const today = new Date().toISOString().split("T")[0];

  const generateAdjustmentId = () => {
    const randomNo = Math.floor(Math.random() * 1000)
    return `ADJ-${randomNo.toString().padStart(4, "0")}`
  }

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adjustmentId: generateAdjustmentId(),
    date: today,
    product: "",
    variant: "",
    batchNo: "",
    expiry: "",
    systemQty: "",
    physicalQty: "",
    difference: 0,
    adjustmentType: "",
    reason: "",
    otherReason: "",
    remarks: "",
    adjustedBy: "",
    approvedBy: "",
  });

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...formData, [name]: value };

    // Auto calculate difference & adjustmentType
    if (name === "physicalQty") {
      const diff = value - formData.systemQty;
      updatedForm.difference = diff;
      updatedForm.adjustmentType = diff > 0 ? "Increase" : diff < 0 ? "Decrease" : "";
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.product || !formData.variant) {
        Swal.fire("Error", "Please select product and variant!", "error");
        setLoading(false);
        return;
      }
      const response = await axios.post(`${baseURL}/stockAdjustment`, formData)
      Swal.fire({
        title: "Success!",
        text: "Stock adjustment saved successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      console.log("Adjustment Saved:", response);

      setFormData({
        adjustmentId: generateAdjustmentId(),
        date: today,
        product: "",
        variant: "",
        batchNo: "",
        expiry: "",
        systemQty: "",
        physicalQty: "",
        difference: 0,
        adjustmentType: "",
        reason: "",
        otherReason: "",
        remarks: "",
        adjustedBy: "",
        approvedBy: "",
      });

    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save adjustment!",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Stock Adjustment</h1>
                <p className="text-blue-100 text-sm">Create a new stock adjustment record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Basic Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <FaIdCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adjustment ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaIdCard className="inline w-4 h-4 mr-2 text-blue-600" />
                    Adjustment ID
                  </label>
                  <input
                    type="text"
                    name="adjustmentId"
                    value={formData.adjustmentId}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 font-medium text-gray-700"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCalendarAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <FaBox className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaBox className="inline w-4 h-4 mr-2 text-blue-600" />
                    Product *
                  </label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">-- Select Product --</option>
                    {product?.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant */}
                {formData.product && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <FaLayerGroup className="inline w-4 h-4 mr-2 text-blue-600" />
                      Product Variant *
                    </label>
                    <select
                      name="variant"
                      value={formData.variant}
                      onChange={(e) => {
                        const selectedProduct = product.find((p) => p._id === formData.product)
                        const selectedVariant = selectedProduct?.variants.find((v) => v._id === e.target.value)
                        setFormData({
                          ...formData,
                          variant: e.target.value,
                          systemQty: selectedVariant?.quantity || 0,
                        })
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="">-- Select Variant --</option>
                      {product.find((p) => p._id === formData.product)?.variants?.map((v) => (
                        <option key={v._id} value={v._id}>{v.variantName} (Stock: {v.quantity})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <FaBalanceScale className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Quantity Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Quantity */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaHashtag className="inline w-4 h-4 mr-2 text-blue-600" />
                    System Quantity
                  </label>
                  <input
                    type="number"
                    name="systemQty"
                    value={formData.systemQty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Physical Quantity */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaHashtag className="inline w-4 h-4 mr-2 text-blue-600" />
                    Physical Quantity *
                  </label>
                  <input
                    type="number"
                    name="physicalQty"
                    value={formData.physicalQty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter physical quantity"
                  />
                </div>

                {/* Difference */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaBalanceScale className="inline w-4 h-4 mr-2 text-blue-600" />
                    Difference
                  </label>
                  <input
                    type="number"
                    name="difference"
                    value={formData.difference}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 font-medium text-gray-700"
                  />
                </div>

                {/* Adjustment Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
                  <input
                    type="text"
                    name="adjustmentType"
                    value={formData.adjustmentType}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Reason Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-2">
                  <FaExclamationCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Reason Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reason */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaExclamationCircle className="inline w-4 h-4 mr-2 text-blue-600" />
                    Reason
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="Expiry">Expiry</option>
                    <option value="Damage">Damage</option>
                    <option value="Missing">Missing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Other Reason */}
                {formData.reason === "Others" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Specify Reason</label>
                    <input
                      type="text"
                      name="otherReason"
                      value={formData.otherReason}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter specific reason"
                    />
                  </div>
                )}

                {/* Remarks */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaCommentAlt className="inline w-4 h-4 mr-2 text-blue-600" />
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    rows={2}
                    placeholder="Enter any additional remarks"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Authorization Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-2">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Authorization Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adjusted By */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaUser className="inline w-4 h-4 mr-2 text-blue-600" />
                    Adjusted By
                  </label>
                  <input
                    type="text"
                    name="adjustedBy"
                    value={formData.adjustedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter adjuster name"
                  />
                </div>

                {/* Approved By */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaUser className="inline w-4 h-4 mr-2 text-blue-600" />
                    Approved By
                  </label>
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter approver name"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving Adjustment...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Adjustment
                  </>
                )}
              </button>
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
              <p className="font-medium mb-1">Stock Adjustment Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Adjustment ID is auto-generated and cannot be modified</li>
                <li>Product and variant selection are required fields</li>
                <li>Physical quantity will auto-calculate the difference and adjustment type</li>
                <li>System quantity is automatically populated from selected variant</li>
                <li>Provide clear reason and remarks for audit trail purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdjustment;
