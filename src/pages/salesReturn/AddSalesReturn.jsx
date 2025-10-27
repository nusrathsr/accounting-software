import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  Calendar,
  User,
  FileText,
  CreditCard,
  Save,
  X,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Package,
  IndianRupee,
  ShoppingCart
} from "lucide-react";
import api from "../../utils/api";

export default function AddSalesReturn() {
  const [formData, setFormData] = useState({
    returnId: "",
    returnDate: new Date().toISOString().slice(0, 10),
    referenceSaleId: "",
    invoiceNumber: "",
    customerName: "",
    customerPhone: "",
    returnItems: [],
    refundMode: "cash",
    refundStatus: "pending",
    refundAmount: 0,
    narration: "",
    notes: ""
  });

  const [salesInvoices, setSalesInvoices] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchInvoice, setSearchInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all sales invoices for dropdown
  useEffect(() => {
    fetchSalesInvoices();
  }, []);

  const fetchSalesInvoices = async () => {
    try {
      const response = await api.get("/sales");
      setSalesInvoices(response.data);
    } catch (err) {
      console.error("Error fetching sales invoices:", err);
      showNotification("error", "Error", "Failed to fetch sales invoices");
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ✅ FIXED: Extract ID properly, handling both object and string formats
  const extractId = (value) => {
    if (!value) return null;
    
    // If it's an object with _id
    if (typeof value === 'object' && value._id) {
      return value._id.toString();
    }
    
    // If it's already a string
    if (typeof value === 'string') {
      return value;
    }
    
    // If it's an ObjectId object
    if (value.$oid) {
      return value.$oid;
    }
    
    return null;
  };

  // When user selects a sale invoice
  const handleSaleSelection = async (saleId) => {
    if (!saleId) {
      setSelectedSale(null);
      setFormData(prev => ({
        ...prev,
        referenceSaleId: "",
        invoiceNumber: "",
        customerName: "",
        customerPhone: "",
        returnItems: []
      }));
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/sales-returns/sale/${saleId}`);
      const sale = response.data;

      console.log("📦 Received sale data:", sale);

      setSelectedSale(sale);
      
      // ✅ FIXED: Improved product mapping with proper ID extraction
      const returnItems = sale.products.map((product, index) => {
        // Extract productId - the backend should have already set this
        let productId = extractId(product.productId);
        
        // Extract variantId
        let variantId = extractId(product.variantId);
        
        console.log(`Product ${index}:`, {
          name: product.name,
          productId: productId,
          variantId: variantId,
          originalProductId: product.productId,
          originalVariantId: product.variantId
        });

        // ⚠️ Warning if productId is still missing
        if (!productId) {
          console.warn(`⚠️ WARNING: Missing productId for product: ${product.name}`);
        }

        return {
          productId: productId,
          variantId: variantId,
          productName: product.name || "Unnamed Product",
          sizeOrWeight: product.sizeOrWeight || "",
          soldQuantity: product.quantity,
          availableForReturn: product.availableForReturn || product.quantity,
          alreadyReturned: product.alreadyReturned || 0,
          returnQuantity: 0,
          unitPrice: parseFloat(product.unitPrice) || 0,
          taxRate: parseFloat(product.tax) || 0,
          discount: 0,
          returnAmount: 0
        };
      });

      // Log final items to verify
      console.log("✅ Final return items:", returnItems);

      setFormData(prev => ({
        ...prev,
        referenceSaleId: saleId,
        invoiceNumber: sale.invoiceNumber,
        customerName: sale.customerName || "Walk-in Customer",
        customerPhone: sale.number || "",
        returnItems
      }));

    } catch (err) {
      console.error("Error fetching sale details:", err);
      showNotification("error", "Error", "Failed to fetch sale details");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnQuantityChange = (index, value) => {
    const quantity = parseFloat(value) || 0;
    const updatedItems = [...formData.returnItems];
    const item = updatedItems[index];

    // Validate quantity
    if (quantity > item.availableForReturn) {
      showNotification("warning", "Warning", 
        `Cannot return more than ${item.availableForReturn} units for ${item.productName}`);
      return;
    }

    item.returnQuantity = quantity;
    
    // Calculate return amount
    const itemSubtotal = quantity * item.unitPrice;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const afterDiscount = itemSubtotal - discountAmount;
    const taxAmount = (afterDiscount * item.taxRate) / 100;
    item.returnAmount = afterDiscount + taxAmount;

  // Update refundAmount automatically
  const totalRefund = updatedItems.reduce((sum, i) => sum + (i.returnAmount || 0), 0).toFixed(2);
    setFormData(prev => ({
    ...prev,
    returnItems: updatedItems,
    refundAmount: totalRefund
  }));
  };

  const handleDiscountChange = (index, value) => {
    const discount = parseFloat(value) || 0;
    const updatedItems = [...formData.returnItems];
    const item = updatedItems[index];
    
    item.discount = discount;
    
    // Recalculate amount
    const itemSubtotal = item.returnQuantity * item.unitPrice;
    const discountAmount = (itemSubtotal * discount) / 100;
    const afterDiscount = itemSubtotal - discountAmount;
    const taxAmount = (afterDiscount * item.taxRate) / 100;
    item.returnAmount = afterDiscount + taxAmount;

    const totalRefund = updatedItems.reduce((sum, i) => sum + (i.returnAmount || 0), 0).toFixed(2);

  setFormData(prev => ({
    ...prev,
    returnItems: updatedItems,
    refundAmount: totalRefund
  }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    formData.returnItems.forEach(item => {
      if (item.returnQuantity > 0) {
        const itemSubtotal = item.returnQuantity * item.unitPrice;
        const discountAmount = (itemSubtotal * item.discount) / 100;
        const afterDiscount = itemSubtotal - discountAmount;
        const taxAmount = (afterDiscount * item.taxRate) / 100;
        
        subtotal += itemSubtotal;
        totalDiscount += discountAmount;
        totalTax += taxAmount;
      }
    });

    const total = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, totalTax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.referenceSaleId) {
      showNotification("warning", "Warning", "Please select a sale invoice");
      return;
    }

    const validItems = formData.returnItems.filter(item => item.returnQuantity > 0);

    if (validItems.length === 0) {
      showNotification("warning", "Warning", "Please enter return quantity for at least one item");
      return;
    }

    // ✅ ADDITIONAL VALIDATION: Check for missing productIds
    const missingProductIds = validItems.filter(item => !item.productId);
    if (missingProductIds.length > 0) {
      console.error("❌ Items with missing productId:", missingProductIds);
      showNotification("error", "Error", 
        `Some products are missing required information. Please refresh and try again.`);
      return;
    }

    try {
      setLoading(true);

      // Prepare data for submission
      const submitData = {
        referenceSaleId: formData.referenceSaleId,
        returnDate: formData.returnDate,
        returnItems: validItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId || null,
          productName: item.productName,
          sizeOrWeight: item.sizeOrWeight,
          soldQuantity: item.soldQuantity,
          returnQuantity: item.returnQuantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          discount: item.discount,
          returnAmount: item.returnAmount
        })),
        refundMode: formData.refundMode,
        refundStatus: formData.refundStatus,
        refundAmount: formData.refundAmount || calculateTotals().total,
        narration: formData.narration,
        notes: formData.notes
      };

      console.log("📤 Submitting sales return:", submitData);

      const response = await api.post("/sales-returns", submitData);
      
      showNotification("success", "Success", "Sales return created successfully!");
      
      // Reset form after success
      setTimeout(() => {
        window.location.href = "/sales-return/view";
      }, 1500);

    } catch (err) {
      console.error("Error creating sales return:", err);
      const errorMessage = err.response?.data?.message || "Failed to create sales return";
      showNotification("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();
  const filteredInvoices = salesInvoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
    (invoice.customerName && invoice.customerName.toLowerCase().includes(searchInvoice.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-2 flex items-start gap-3 animate-slide-in max-w-md ${
          notification.type === 'success' ? 'bg-green-50 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 border-red-500' :
          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
          'bg-blue-50 border-blue-500'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
          {notification.type === 'error' && <X className="w-6 h-6 text-red-600 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />}
          {notification.type === 'info' && <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />}
          
          <div className="flex-1">
            <h4 className={`font-bold text-sm ${
              notification.type === 'success' ? 'text-green-900' :
              notification.type === 'error' ? 'text-red-900' :
              notification.type === 'warning' ? 'text-yellow-900' :
              'text-blue-900'
            }`}>
              {notification.title}
            </h4>
            <p className={`text-sm mt-1 ${
              notification.type === 'success' ? 'text-green-700' :
              notification.type === 'error' ? 'text-red-700' :
              notification.type === 'warning' ? 'text-yellow-700' :
              'text-blue-700'
            }`}>
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => setNotification(null)}
            className={`flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-600 hover:text-green-800' :
              notification.type === 'error' ? 'text-red-600 hover:text-red-800' :
              notification.type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' :
              'text-blue-600 hover:text-blue-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-3">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                Create Sales Return
              </h1>
              <p className="text-gray-600 mt-2">Process customer returns and refunds</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search & Select Sale Invoice */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Select Sale Invoice</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by invoice number or customer name..."
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={formData.referenceSaleId}
                onChange={(e) => handleSaleSelection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">-- Select Sale Invoice --</option>
                {filteredInvoices.map(invoice => (
                  <option key={invoice._id} value={invoice._id}>
                    {invoice.invoiceNumber} - {invoice.customerName || 'Walk-in'} - ₹{invoice.totalAmount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sale Details */}
            {selectedSale && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Invoice Number</p>
                      <p className="font-semibold text-gray-900">{formData.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-lg p-2">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">{formData.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 rounded-lg p-2">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Return Date</p>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                        className="font-semibold text-gray-900 border-0 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Return Items Table */}
          {selectedSale && formData.returnItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-2">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Return Items</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Sold Qty</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Returned</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Available</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Return Qty</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Discount %</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Tax %</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.returnItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2">
                              <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.productName}</p>
                              {item.sizeOrWeight && (
                                <p className="text-sm text-gray-500">{item.sizeOrWeight}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.soldQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.alreadyReturned}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.availableForReturn}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min="0"
                            max={item.availableForReturn}
                            value={item.returnQuantity}
                            onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-gray-900">₹{item.unitPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => handleDiscountChange(index, e.target.value)}
                            className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-gray-700">{item.taxRate}%</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-bold text-blue-700">
                            ₹{item.returnAmount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex justify-between w-full max-w-md text-base">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-md text-base">
                    <span className="text-gray-700">Total Discount:</span>
                    <span className="font-semibold text-red-600">₹{totals.totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-md text-base">
                    <span className="text-gray-700">Total Tax:</span>
                    <span className="font-semibold text-green-600">₹{totals.totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-md text-xl font-bold border-t pt-3">
                    <span className="text-gray-900">Total Return Amount:</span>
                    <span className="text-blue-700">₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Notes */}
          {selectedSale && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Refund Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Refund Mode</label>
                  <select
                    value={formData.refundMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, refundMode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                    <option value="credit_note">Credit Note</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Refund Status</label>
                  <select
                    value={formData.refundStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, refundStatus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-purple-600" />
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.refundAmount}
                    readOnly
                    onChange={(e) => setFormData(prev => ({ ...prev, refundAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                    placeholder={totals.total.toFixed(2)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 hidden">
                  <label className="block text-sm font-medium text-gray-700">Narration</label>
                  <textarea
                    value={formData.narration}
                    onChange={(e) => setFormData(prev => ({ ...prev, narration: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Enter reason for return..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Additional notes or remarks..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedSale && (
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Sales Return
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}