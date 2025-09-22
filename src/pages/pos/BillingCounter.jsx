// import React, { useContext, useState } from "react";
// import { GlobalContext } from "../../context/GlobalContext";
// import { useNavigate } from "react-router-dom";

// const BillingCounter = () => {
//   const { customers, product } = useContext(GlobalContext);
//   const [formData, setFormData] = useState({
//     variantCode: "",
//     productName: "",
//     quantity: 1,
//     unitPrice: 0,
//     discount: 0,
//     tax: 0,
//     customer: "",
//   });
//   const [cart, setCart] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [customerSuggestions, setCustomerSuggestions] = useState([]);
//   const navigate = useNavigate();

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "productName" && value.length > 0) {
//       const matches = [];
//       for (let p of product) {
//         for (let variant of p.variants) {
//           if (
//             variant.variantName.toLowerCase().includes(value.toLowerCase())
//           ) {
//             matches.push({
//               variantId: variant.variantId,
//               variantName: variant.variantName,
//               unitPrice: variant.sellingPrice,
//               taxPercentage: variant.taxPercentage,
//             });
//           }
//         }
//       }
//       setSuggestions(matches);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Select variant
//   const selectVariant = (variant) => {
//     setFormData({
//       ...formData,
//       variantCode: variant.variantId,
//       productName: variant.variantName,
//       unitPrice: variant.unitPrice,
//       tax: variant.taxPercentage,
//       quantity: 1,
//       discount: 0,
//     });
//     setSuggestions([]);
//   };

//   // Add item to cart
//   const handleAddToCart = () => {
//     if (!formData.variantCode || !formData.productName) return;

//     const taxAmount =
//       formData.tax
//         ? (formData.unitPrice * formData.quantity * formData.tax) / 100
//         : 0;
//     const discountAmount =
//       (formData.unitPrice * formData.quantity * formData.discount) / 100;
//     const lineTotal =
//       formData.unitPrice * formData.quantity + taxAmount - discountAmount;

//     const newItem = {
//       slNo: cart.length + 1,
//       variantCode: formData.variantCode,
//       productName: formData.productName,
//       quantity: Number(formData.quantity),
//       unitPrice: Number(formData.unitPrice),
//       discount: discountAmount,
//       taxPercentage: formData.tax,
//       tax: taxAmount,
//       lineTotal,
//     };

//     setCart([...cart, newItem]);

//     setFormData({
//       variantCode: "",
//       productName: "",
//       quantity: 1,
//       unitPrice: 0,
//       discount: 0,
//       tax: 0,
//       customer: formData.customer,
//     });
//     setSuggestions([]);
//   };

//   const removeItem = (slNo) => {
//     setCart(cart.filter((item) => item.slNo !== slNo));
//   };

//   const subTotal = cart.reduce(
//     (acc, item) => acc + item.unitPrice * item.quantity,
//     0
//   );
//   const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
//   const totalTax = cart.reduce((acc, item) => acc + item.tax, 0);
//   const grandTotal = subTotal + totalTax - totalDiscount;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">POS Billing Counter</h2>

//       {/* Form */}
//       <div className="space-y-4">
//         {/* Product Search */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700">
//             Barcode / Variant Name
//           </label>
//           <input
//             type="text"
//             name="productName"
//             value={formData.productName}
//             onChange={handleInputChange}
//             placeholder="Scan barcode or type variant name"
//             autoComplete="off"
//             className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
//           />
//           {suggestions.length > 0 && (
//             <ul className="absolute mt-1 border rounded-lg bg-white shadow-md w-full max-h-40 overflow-y-auto z-50">
//               {suggestions.map((v, i) => (
//                 <li
//                   key={i}
//                   className="p-2 cursor-pointer hover:bg-blue-100"
//                   onClick={() => selectVariant(v)}
//                 >
//                   {v.variantName} - ₹{v.unitPrice}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Row 1 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Quantity
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleInputChange}
//               min="1"
//               className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Unit Price
//             </label>
//             <input
//               type="number"
//               value={formData.unitPrice}
//               readOnly
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
//             />
//           </div>
//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Tax %
//             </label>
//             <input
//               type="number"
//               value={formData.tax || 0}
//               readOnly
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Discount (%)
//             </label>
//             <input
//               type="number"
//               name="discount"
//               value={formData.discount}
//               onChange={handleInputChange}
//               min="0"
//               className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
//             />
//           </div>
//         </div>

//         {/* Customer */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700">
//             Customer
//           </label>
//           <input
//             type="text"
//             name="customer"
//             value={formData.customer || ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               setFormData({ ...formData, customer: value });

//               const filtered = customers.filter(
//                 (c) =>
//                   (c.type === "Wholesale Customer" ||
//                     c.type === "Retail Customer") &&
//                   (c.name.toLowerCase().includes(value.toLowerCase()) ||
//                     c.phone?.includes(value))
//               );
//               setCustomerSuggestions(filtered);
//             }}
//             placeholder="Type customer name or phone"
//             autoComplete="off"
//             className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
//           />
//           {customerSuggestions.length > 0 && (
//             <ul className="absolute mt-1 border rounded-lg bg-white shadow-md w-full max-h-40 overflow-y-auto z-50">
//               {customerSuggestions.map((c) => (
//                 <li
//                   key={c._id}
//                   className="p-2 cursor-pointer hover:bg-blue-100"
//                   onClick={() => {
//                     setFormData({ ...formData, customer: c.name });
//                     setCustomerSuggestions([]);
//                   }}
//                 >
//                   {c.name} - {c.phone || "-"}
//                 </li>
//               ))}
//               <li
//                 className="p-2 cursor-pointer hover:bg-green-100 font-bold"
//                 onClick={() => navigate("/addCustomer")}
//               >
//                 + Add New Customer
//               </li>
//             </ul>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={handleAddToCart}
//           className="w-full md:w-auto px-4 py-2 mt-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
//         >
//           Add to Cart
//         </button>
//       </div>

//       {/* Cart Table */}
//       <div className="mt-8 overflow-x-auto">
//         <table className="min-w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-3 py-2 border">Sl No</th>
//               <th className="px-3 py-2 border">Variant</th>
//               <th className="px-3 py-2 border">Qty</th>
//               <th className="px-3 py-2 border">Unit Price</th>
//               <th className="px-3 py-2 border">Total Price</th>
//               <th className="px-3 py-2 border">Tax %</th>
//               <th className="px-3 py-2 border">Discount</th>
//               <th className="px-3 py-2 border">Tax</th>
//               <th className="px-3 py-2 border">Line Total</th>
//               <th className="px-3 py-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cart.map((item) => (
//               <tr key={item.slNo} className="text-center">
//                 <td className="px-3 py-2 border">{item.slNo}</td>
//                 <td className="px-3 py-2 border">{item.productName}</td>
//                 <td className="px-3 py-2 border">{item.quantity}</td>
//                 <td className="px-3 py-2 border">₹{item.unitPrice}</td>
//                 <td className="px-3 py-2 border">
//                   ₹{item.quantity * item.unitPrice}
//                 </td>
//                 <td className="px-3 py-2 border">
//                   {item.taxPercentage ? item.taxPercentage : 0}%
//                 </td>
//                 <td className="px-3 py-2 border">
//                   ₹{item.discount.toFixed(2)}
//                 </td>
//                 <td className="px-3 py-2 border">
//                   ₹{item.tax ? item.tax.toFixed(2) : 0}
//                 </td>
//                 <td className="px-3 py-2 border">
//                   ₹{item.lineTotal.toFixed(2)}
//                 </td>
//                 <td className="px-3 py-2 border">
//                   <button
//                     onClick={() => removeItem(item.slNo)}
//                     className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

// {/* Totals */}
//       <div className="mt-6 space-y-1 text-right">
//         <h5 className="text-gray-700">Subtotal: ₹{subTotal.toFixed(2)}</h5>
//         <h5 className="text-gray-700">
//           Total Discount: ₹{totalDiscount.toFixed(2)}
//         </h5>
//         <h5 className="text-gray-700">Total Tax: ₹{totalTax.toFixed(2)}</h5>
//         <h4 className="font-bold text-lg">
//           Grand Total: ₹{grandTotal.toFixed(2)}
//         </h4>
//       </div>

//       {/* Payment Information Section  */}


//     </div>
//   );
// };

// export default BillingCounter;




import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const BillingCounter = () => {
  const [showBillPreview, setShowBillPreview] = useState(false);

  const { customers, product } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    variantCode: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0,
    customer: "",
  });
  const [cart, setCart] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const navigate = useNavigate();

  // Payment Info State
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMode: "single",
    singlePaymentMethod: "cash",
    paymentStatus: false,
    splitPayments: [{ method: "cash", amount: undefined, paid: false }],
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "productName" && value.length > 0) {
      const matches = [];
      for (let p of product) {
        for (let variant of p.variants) {
          if (
            variant.variantName.toLowerCase().includes(value.toLowerCase())
          ) {
            matches.push({
              variantId: variant.variantId,
              variantName: variant.variantName,
              unitPrice: variant.sellingPrice,
              taxPercentage: variant.taxPercentage,
            });
          }
        }
      }
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // Select variant
  const selectVariant = (variant) => {
    setFormData({
      ...formData,
      variantCode: variant.variantId,
      productName: variant.variantName,
      unitPrice: variant.unitPrice,
      tax: variant.taxPercentage,
      quantity: 1,
      discount: 0,
    });
    setSuggestions([]);
  };

  // Add item to cart
  const handleAddToCart = () => {
    if (!formData.variantCode || !formData.productName) return;

    const taxAmount =
      formData.tax
        ? (formData.unitPrice * formData.quantity * formData.tax) / 100
        : 0;
    const discountAmount =
      (formData.unitPrice * formData.quantity * formData.discount) / 100;
    const lineTotal =
      formData.unitPrice * formData.quantity + taxAmount - discountAmount;

    const newItem = {
      slNo: cart.length + 1,
      variantCode: formData.variantCode,
      productName: formData.productName,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      discount: discountAmount,
      taxPercentage: formData.tax,
      tax: taxAmount,
      lineTotal,
    };

    setCart([...cart, newItem]);

    setFormData({
      variantCode: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      customer: formData.customer,
    });
    setSuggestions([]);
  };

  const removeItem = (slNo) => {
    setCart(cart.filter((item) => item.slNo !== slNo));
  };

  const subTotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
  const totalTax = cart.reduce((acc, item) => acc + item.tax, 0);
  const grandTotal = subTotal + totalTax - totalDiscount;

  // Payment handlers
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: checked });
  };

  const handleSplitPaymentChange = (index, field, value) => {
    const updated = [...paymentInfo.splitPayments];
    updated[index][field] = field === "paid" ? value : Number(value);
    setPaymentInfo({ ...paymentInfo, splitPayments: updated });
  };

  const addSplitPayment = () => {
    setPaymentInfo({
      ...paymentInfo,
      splitPayments: [...paymentInfo.splitPayments, { method: "cash", amount: 0, paid: false }],
    });
  };

  const removeSplitPayment = (index) => {
    const updated = paymentInfo.splitPayments.filter((_, i) => i !== index);
    setPaymentInfo({ ...paymentInfo, splitPayments: updated });
  };

  const getTotalSplitAmount = () =>
    paymentInfo.splitPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const getRemainingAmount = () => grandTotal - getTotalSplitAmount();

  const isSplitPaymentComplete = () => getTotalSplitAmount() === grandTotal;



  const printBill = () => {
    setShowBillPreview(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("billPreview").innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
    <html>
      <head>
        <title>Bill</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    newWindow.document.close();
    newWindow.print();
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">POS Billing Counter</h2>

      {/* Form */}
      <div className="space-y-4">
        {/* Product Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Barcode / Variant Name
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Scan barcode or type variant name"
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
          />
          {suggestions.length > 0 && (
            <ul className="absolute mt-1 border rounded-lg bg-white shadow-md w-full max-h-40 overflow-y-auto z-50">
              {suggestions.map((v, i) => (
                <li
                  key={i}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => selectVariant(v)}
                >
                  {v.variantName} - ₹{v.unitPrice}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <input
              type="number"
              value={formData.unitPrice}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tax %
            </label>
            <input
              type="number"
              value={formData.tax || 0}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              min="0"
              className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>
        </div>

        {/* Customer */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Customer
          </label>
          <input
            type="text"
            name="customer"
            value={formData.customer || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ ...formData, customer: value });

              const filtered = customers.filter(
                (c) =>
                  (c.type === "Wholesale Customer" ||
                    c.type === "Retail Customer") &&
                  (c.name.toLowerCase().includes(value.toLowerCase()) ||
                    c.phone?.includes(value))
              );
              setCustomerSuggestions(filtered);
            }}
            placeholder="Type customer name or phone"
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
          />
          {customerSuggestions.length > 0 && (
            <ul className="absolute mt-1 border rounded-lg bg-white shadow-md w-full max-h-40 overflow-y-auto z-50">
              {customerSuggestions.map((c) => (
                <li
                  key={c._id}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setFormData({ ...formData, customer: c.name });
                    setCustomerSuggestions([]);
                  }}
                >
                  {c.name} - {c.phone || "-"}
                </li>
              ))}
              <li
                className="p-2 cursor-pointer hover:bg-green-100 font-bold"
                onClick={() => navigate("/addCustomer")}
              >
                + Add New Customer
              </li>
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full md:w-auto px-4 py-2 mt-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>

      {/* Cart Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Sl No</th>
              <th className="px-3 py-2 border">Variant</th>
              <th className="px-3 py-2 border">Qty</th>
              <th className="px-3 py-2 border">Unit Price</th>
              <th className="px-3 py-2 border">Total Price</th>
              <th className="px-3 py-2 border">Tax %</th>
              <th className="px-3 py-2 border">Discount</th>
              <th className="px-3 py-2 border">Tax</th>
              <th className="px-3 py-2 border">Line Total</th>
              <th className="px-3 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.slNo} className="text-center">
                <td className="px-3 py-2 border">{item.slNo}</td>
                <td className="px-3 py-2 border">{item.productName}</td>
                <td className="px-3 py-2 border">{item.quantity}</td>
                <td className="px-3 py-2 border">₹{item.unitPrice}</td>
                <td className="px-3 py-2 border">
                  ₹{item.quantity * item.unitPrice}
                </td>
                <td className="px-3 py-2 border">
                  {item.taxPercentage ? item.taxPercentage : 0}%
                </td>
                <td className="px-3 py-2 border">
                  ₹{item.discount.toFixed(2)}
                </td>
                <td className="px-3 py-2 border">
                  ₹{item.tax ? item.tax.toFixed(2) : 0}
                </td>
                <td className="px-3 py-2 border">
                  ₹{item.lineTotal.toFixed(2)}
                </td>
                <td className="px-3 py-2 border">
                  <button
                    onClick={() => removeItem(item.slNo)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-1 text-right">
        <h5 className="text-gray-700">Subtotal: ₹{subTotal.toFixed(2)}</h5>
        <h5 className="text-gray-700">
          Total Discount: ₹{totalDiscount.toFixed(2)}
        </h5>
        <h5 className="text-gray-700">Total Tax: ₹{totalTax.toFixed(2)}</h5>
        <h4 className="font-bold text-lg">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </h4>
      </div>
      {/* Payment Information Section */}
      <div className="mt-10 p-6 border rounded-xl bg-white shadow-md space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Payment Information</h3>

        {/* Payment Mode */}
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="paymentMode"
              value="single"
              checked={paymentInfo.paymentMode === "single"}
              onChange={handlePaymentChange}
              className="w-5 h-5 text-purple-600"
            />
            Single Payment
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="paymentMode"
              value="split"
              checked={paymentInfo.paymentMode === "split"}
              onChange={handlePaymentChange}
              className="w-5 h-5 text-purple-600"
            />
            Split Payment
          </label>
        </div>

        {/* Single Payment */}
        {paymentInfo.paymentMode === "single" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                name="singlePaymentMethod"
                value={paymentInfo.singlePaymentMethod}
                onChange={handlePaymentChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="wallet">Wallet</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="paymentStatus"
                  checked={paymentInfo.paymentStatus}
                  onChange={handleCheckboxChange}
                  className="w-6 h-6 text-purple-600"
                />
                Mark as Paid
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {paymentInfo.splitPayments.map((p, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-xl shadow-sm bg-gray-50"
              >
                {/* Payment Method */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={p.method}
                    onChange={(e) => handleSplitPaymentChange(i, "method", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Wallet</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={p.amount}
                    onChange={(e) => handleSplitPaymentChange(i, "amount", e.target.value)}
                    placeholder="Amount"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Paid Checkbox */}
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <input
                    type="checkbox"
                    checked={p.paid}
                    onChange={(e) => handleSplitPaymentChange(i, "paid", e.target.checked)}
                    className="w-6 h-6 text-purple-600"
                  />
                  <span className="text-gray-700 font-medium">Paid</span>
                </div>

                {/* Remove Button */}
                <div className="mt-2 md:mt-0">
                  <button
                    onClick={() => removeSplitPayment(i)}
                    disabled={paymentInfo.splitPayments.length <= 1}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add Payment Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addSplitPayment}
                className="px-5 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 font-medium transition"
              >
                + Add Payment
              </button>
            </div>

            {/* Total & Remaining */}
            <div className="mt-2 text-gray-700 font-medium">
              Total Split: <span className="text-purple-600">₹{getTotalSplitAmount().toFixed(2)}</span>, Remaining: <span className="text-red-600">₹{getRemainingAmount().toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Print Bill Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={printBill}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 transition"
          >
            Print Bill
          </button>
        </div>
      </div>
      {showBillPreview && (
  <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 p-4">
    {/* Blurred background */}
    <div
      className="absolute inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm"
      onClick={() => setShowBillPreview(false)}
    ></div>

    {/* Popup content */}
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 font-mono text-sm z-50">
      {/* Close Button */}
      <button
        onClick={() => setShowBillPreview(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
      >
        ×
      </button>

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">My Shop</h1>
        <p className="text-xs text-gray-600">123, Market Street, City</p>
        <p className="text-xs text-gray-600">Phone: 9876543210</p>
      </div>
      <hr className="border-dashed border-gray-400 mb-4" />

      {/* Bill Content */}
      <div id="billPreview" className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dashed border-gray-400">
              <th className="text-left px-2 py-1">Item</th>
              <th className="text-center px-2 py-1">Qty</th>
              <th className="text-right px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((p, i) => (
              <tr key={i} className="border-b border-dashed border-gray-300">
                <td className="px-2 py-1">{p.productName}</td>
                <td className="text-center px-2 py-1">{p.quantity}</td>
                <td className="text-right px-2 py-1">
                  ₹{(Number(p.unitPrice) * Number(p.quantity) - Number(p.discount) + Number(p.tax)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-3 border-t border-dashed border-gray-400 pt-2 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subTotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total Discount</span><span>₹{totalDiscount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total GST</span><span>₹{totalTax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold border-t border-dashed border-gray-400 pt-1">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-3 text-xs text-gray-500">
          Thank you for shopping with us!
        </div>
      </div>

      {/* Print & Close Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
        >
          Print
        </button>
        <button
          onClick={() => setShowBillPreview(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



    </div >
  );
};

export default BillingCounter;
