import React, { useState, useEffect } from "react";
import {
  CreditCard,
  User,
  Calendar,
  DollarSign,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  Building2,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus
} from "lucide-react";

export default function AddTransaction() {
  const [type, setType] = useState("payment"); // payment or receipt
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("cash");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [customers, setCustomers] = useState([]);
  const baseURL = "http://localhost:4000/api";

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch all customers/vendors
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${baseURL}/customer`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        showNotification("error", "Error", "Failed to fetch customers/vendors. Please check server connection.");
      }
    };

    fetchCustomers();
  }, []);

  const customerOptions = customers.filter((c) =>
    ["retail customer", "wholesale customer"].includes(c.type.toLowerCase())
  );
  const vendorOptions = customers.filter((c) =>
    ["seller", "supplier"].includes(c.type.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showNotification("error", "Invalid Amount", "Please enter a valid amount greater than 0.");
      return;
    }

    const payload = {
      type,
      amount: parseFloat(amount),
      mode,
      date,
      notes,
      customer: type === "receipt" ? customerId : vendorId,
    };

    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      showNotification("success", "Transaction Added!", `Amount ₹${amount} ${type} successfully recorded.`);

      // Reset form
      setAmount("");
      setMode("cash");
      setDate("");
      setNotes("");
      setCustomerId("");
      setVendorId("");
    } catch (err) {
      console.error("Error adding transaction:", err);
      showNotification("error", "Error", "Failed to add transaction. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
              {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Add Transaction</h1>
                  <p className="text-blue-100 text-sm">Record payments and receipts</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">₹</div>
                <div className="text-sm text-blue-100">New Entry</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
                <p className="text-sm text-gray-600 mt-1">Fill in the transaction information</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setType("payment");
                          setCustomerId("");
                          setVendorId("");
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          type === "payment"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <ArrowUpCircle className="w-5 h-5" />
                          <span className="font-medium">Payment</span>
                        </div>
                        <p className="text-xs mt-1">Money going out</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setType("receipt");
                          setCustomerId("");
                          setVendorId("");
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          type === "receipt"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <ArrowDownCircle className="w-5 h-5" />
                          <span className="font-medium">Receipt</span>
                        </div>
                        <p className="text-xs mt-1">Money coming in</p>
                      </button>
                    </div>
                  </div>

                  {/* Customer/Vendor Selection */}
                  {type === "receipt" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Select Customer
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                      >
                        <option value="">Choose a customer...</option>
                        {customerOptions.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {type === "payment" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Select Vendor
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        value={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                        required
                      >
                        <option value="">Choose a vendor...</option>
                        {vendorOptions.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name} ({v.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode("cash")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          mode === "cash"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Wallet className="w-5 h-5" />
                          <span className="font-medium">Cash</span>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setMode("bank")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          mode === "bank"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          <span className="font-medium">Bank</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Transaction Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes or description..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                        type === "payment"
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add {type === "payment" ? "Payment" : "Receipt"}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    type === "payment" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {type === "payment" ? "Payment" : "Receipt"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg text-gray-900">
                    ₹{amount || "0.00"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <span className="capitalize text-sm font-medium">{mode}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">
                    {date ? new Date(date).toLocaleDateString('en-IN') : "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}