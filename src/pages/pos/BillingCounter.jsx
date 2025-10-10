
import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import api from '../../utils/api';
import {
  FaShoppingCart,
  FaPlus,
  FaTrash,
  FaUser,
  FaBarcode,
  FaCalculator,
  FaCreditCard,
  FaPrint,
  FaArrowLeft,
  FaPercent,
  FaBoxes,
  FaRupeeSign
} from 'react-icons/fa';

const BillingCounter = () => {
  const { customers, product } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    variantId: "",
    variantName: "",
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

    if (name === "variantName" && value.length > 0) {
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
      variantId: variant.variantId,
      variantName: variant.variantName,
      unitPrice: variant.unitPrice,
      tax: variant.taxPercentage,
      quantity: 1,
      discount: 0,
    });
    setSuggestions([]);
  };

  // Add item to cart
  const handleAddToCart = () => {
    if (!formData.variantId || !formData.variantName) return;

    // Find the selected variant from product list
    let selectedVariant = null;
    for (let p of product) {
      selectedVariant = p.variants.find(v => v.variantId === formData.variantId);
      if (selectedVariant) break;
    }

    if (!selectedVariant) {
      Swal.fire({
        icon: "error",
        title: "Variant Not Found",
        text: "Variant not found!",
      });
      return;
    }

    // Check if quantity is available
    if (selectedVariant.quantity === 0) {
      Swal.fire({
        icon: "warning",
        title: "Out of Stock",
        text: "Product is out of stock!",
      });
      return;
    }

    // Optional: Check if requested quantity exceeds stock
    if (formData.quantity > selectedVariant.quantity) {
      Swal.fire({
        icon: "warning",
        title: "Insufficient Stock",
        text: `Only ${selectedVariant.quantity} items available in stock!`,
      });
      return;
    }

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
      variantId: formData.variantId,
      variantName: formData.variantName,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      discount: discountAmount,
      taxPercentage: formData.tax,
      tax: taxAmount,
      lineTotal,
    };

    setCart([...cart, newItem]);

    // Reset form
    setFormData({
      variantId: "",
      variantName: "",
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

  const printBill = (saleCart, customerName, grandTotal) => {
    let billContent = `
    <h2 style="text-align:center">Your Shop Name</h2>
    <p style="text-align:center">Customer: ${customerName || "Walk-in"}</p>
    <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:4px;">Sl</th>
          <th style="border:1px solid #000; padding:4px;">Item</th>
          <th style="border:1px solid #000; padding:4px;">Qty</th>
          <th style="border:1px solid #000; padding:4px;">Price</th>
          <th style="border:1px solid #000; padding:4px;">Discount</th>
          <th style="border:1px solid #000; padding:4px;">Tax</th>
          <th style="border:1px solid #000; padding:4px;">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

    saleCart.forEach((item, index) => {
      billContent += `
      <tr>
        <td style="border:1px solid #000; padding:4px;">${index + 1}</td>
        <td style="border:1px solid #000; padding:4px;">${item.variantName}</td>
        <td style="border:1px solid #000; padding:4px;">${item.quantity}</td>
        <td style="border:1px solid #000; padding:4px;">₹${item.unitPrice.toFixed(2)}</td>
        <td style="border:1px solid #000; padding:4px;">₹${item.discount.toFixed(2)}</td>
        <td style="border:1px solid #000; padding:4px;">₹${item.tax.toFixed(2)}</td>
        <td style="border:1px solid #000; padding:4px;">₹${item.lineTotal.toFixed(2)}</td>
      </tr>
    `;
    });

    billContent += `
      </tbody>
    </table>
    <h3 style="text-align:right; margin-top:10px;">Grand Total: ₹${grandTotal.toFixed(2)}</h3>
    <p style="text-align:center; margin-top:20px;">Thank you for your purchase!</p>
  `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
    <html>
      <head>
        <title>Bill</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: center; }
          h2, h3, p { margin: 5px 0; }
        </style>
      </head>
      <body>
        ${billContent}
      </body>
    </html>
  `);
    newWindow.document.close();
    newWindow.print();
  };

  const handlePlaceSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const saleData = {
        customerName: formData.customer || "Walk-in",
        items: cart.map((item) => ({
          variantId: item.variantId,
          variantName: item.variantName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          lineTotal: item.lineTotal,
        })),
        totalAmount: grandTotal,
        paymentMethod: paymentInfo,
      };

      const res = await api.post("/sale", saleData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sale placed successfully!",
      });

      console.log(res.data.sale);

      // Directly print the bill
      printBill(cart, formData.customer, grandTotal);

      // Clear cart and reset form
      setCart([]);
      setFormData({
        variantId: "",
        variantName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        customer: "",
      });
      setPaymentInfo({
        paymentMode: "single",
        singlePaymentMethod: "cash",
        paymentStatus: false,
        splitPayments: [{ method: "cash", amount: undefined, paid: false }],
      });
    } catch (error) {
      console.error("Error placing sale:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to place sale. Please try again.",
      });

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <FaShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">POS Billing Counter</h1>
                <p className="text-blue-100 text-sm">Process sales and manage transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Selection Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaBoxes className="w-5 h-5 text-blue-600" />
              Product Selection
            </h2>

            <div className="space-y-6">
              {/* Product Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode / Variant Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="variantName"
                    value={formData.variantName}
                    onChange={handleInputChange}
                    placeholder="Scan barcode or type variant name"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 border rounded-xl bg-white shadow-lg w-full max-h-40 overflow-y-auto z-50">
                    {suggestions.map((v, i) => (
                      <li
                        key={i}
                        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-b last:border-b-0"
                        onClick={() => selectVariant(v)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{v.variantName}</span>
                          <span className="text-blue-600 font-semibold">₹{v.unitPrice}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Product Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBoxes className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Price
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      value={formData.unitPrice}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tax %
                  </label>
                  <div className="relative">
                    <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      value={formData.tax || 0}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                    placeholder="Type customer name or phone (optional)"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                {customerSuggestions.length > 0 && (
                  <ul className="absolute mt-1 border rounded-xl bg-white shadow-lg w-full max-h-40 overflow-y-auto z-50">
                    {customerSuggestions.map((c) => (
                      <li
                        key={c._id}
                        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-b last:border-b-0"
                        onClick={() => {
                          setFormData({ ...formData, customer: c.name });
                          setCustomerSuggestions([]);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{c.name}</span>
                          <span className="text-gray-500 text-sm">{c.phone || "-"}</span>
                        </div>
                      </li>
                    ))}
                    <li
                      className="p-3 cursor-pointer hover:bg-green-50 font-semibold text-green-600 border-t"
                      onClick={() => navigate("/addCustomer")}
                    >
                      <div className="flex items-center gap-2">
                        <FaPlus className="w-3 h-3" />
                        Add New Customer
                      </div>
                    </li>
                  </ul>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaShoppingCart className="w-5 h-5 text-blue-600" />
              Shopping Cart ({cart.length} items)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Sl No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Product</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b">Unit Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b">Discount</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b">Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FaShoppingCart className="w-8 h-8 text-gray-300" />
                          <span>Your cart is empty. Add some products!</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cart.map((item, index) => (
                      <tr key={item.slNo} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-4 py-4 border-b text-gray-700">{item.slNo}</td>
                        <td className="px-4 py-4 border-b">
                          <div className="font-medium text-gray-800">{item.variantName}</div>
                        </td>
                        <td className="px-4 py-4 border-b text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 border-b text-right font-medium">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-4 border-b text-right text-red-600">₹{item.discount.toFixed(2)}</td>
                        <td className="px-4 py-4 border-b text-right text-green-600">₹{item.tax ? item.tax.toFixed(2) : '0.00'}</td>
                        <td className="px-4 py-4 border-b text-right font-semibold text-blue-600">₹{item.lineTotal.toFixed(2)}</td>
                        <td className="px-4 py-4 border-b text-center">
                          <button
                            onClick={() => removeItem(item.slNo)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            {cart.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-end">
                  <div className="w-80 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Total Discount:</span>
                      <span className="font-medium">-₹{totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Total Tax:</span>
                      <span className="font-medium">+₹{totalTax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-blue-700">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaCreditCard className="w-5 h-5 text-blue-600" />
                Payment Information
              </h2>

              {/* Payment Mode */}
              <div className="mb-6">
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="single"
                      checked={paymentInfo.paymentMode === "single"}
                      onChange={handlePaymentChange}
                      className="w-5 h-5 text-blue-600"
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
                      className="w-5 h-5 text-blue-600"
                    />
                    Split Payment
                  </label>
                </div>
              </div>

              {/* Single Payment */}
              {paymentInfo.paymentMode === "single" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                      name="singlePaymentMethod"
                      value={paymentInfo.singlePaymentMethod}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="wallet">Wallet</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="paymentStatus"
                        checked={paymentInfo.paymentStatus}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      Mark as Paid
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {paymentInfo.splitPayments.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-6 border border-gray-200 rounded-xl bg-gray-50"
                    >
                      {/* Payment Method */}
                      <div className="flex-1 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select
                          value={p.method}
                          onChange={(e) => handleSplitPaymentChange(i, "method", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="upi">UPI</option>
                          <option value="wallet">Wallet</option>
                          <option value="credit">Credit</option>
                        </select>
                      </div>

                      {/* Amount */}
                      <div className="flex-1 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="relative">
                          <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={p.amount}
                            onChange={(e) => handleSplitPaymentChange(i, "amount", e.target.value)}
                            placeholder="Enter amount"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>

                      {/* Paid Checkbox */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={p.paid}
                          onChange={(e) => handleSplitPaymentChange(i, "paid", e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Paid</span>
                      </div>

                      {/* Remove Button */}
                      <div>
                        <button
                          onClick={() => removeSplitPayment(i)}
                          disabled={paymentInfo.splitPayments.length <= 1}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Payment Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addSplitPayment}
                      className="px-6 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Payment
                    </button>
                  </div>

                  {/* Total & Remaining */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700">
                        Total Split: <span className="text-blue-600 font-semibold">₹{getTotalSplitAmount().toFixed(2)}</span>
                      </span>
                      <span className="font-medium text-gray-700">
                        Remaining: <span className="text-red-600 font-semibold">₹{getRemainingAmount().toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-100 pt-6 mt-8">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCart([]);
                      setFormData({
                        variantId: "",
                        variantName: "",
                        quantity: 1,
                        unitPrice: 0,
                        discount: 0,
                        tax: 0,
                        customer: "",
                      });
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
                  >
                    Clear Cart
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceSale}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <FaPrint className="w-4 h-4" />
                    Place Sale & Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>

  )
}

export default BillingCounter;





