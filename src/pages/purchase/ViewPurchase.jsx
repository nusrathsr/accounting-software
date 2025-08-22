import React, { useState, useEffect } from 'react';
import {
  FileText,
  User,
  Calendar,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  IndianRupee,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter,
  AlertCircle,
  Edit3,
  ShoppingCart
} from "lucide-react";

export default function ViewPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editData, setEditData] = useState(null);
  const itemsPerPage = 8;

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch purchases from backend
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/purchases');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const purchasesWithPaid = data.map(p => ({
        ...p,
        paidAmount: p.paidAmount ?? 0
      }));
      setPurchases(purchasesWithPaid);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      showNotification("error", "Error", "Failed to fetch purchase records. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch purchases from backend


  useEffect(() => {
    fetchPurchases();
  }, []);

  // Filter purchases based on search
  const filteredPurchases = purchases.filter((purchase) => {
    const s = search.toLowerCase();
    return (
      purchase.purchaseOrderNumber.toLowerCase().includes(s) ||
      (purchase.sellerName && purchase.sellerName.toLowerCase().includes(s)) ||
      (purchase.product && purchase.product.toLowerCase().includes(s))
    );
  });

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  // Delete a purchase
  const deletePurchase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase record?")) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/purchases/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      showNotification("success", "Deleted!", "Purchase record deleted successfully.");
      fetchPurchases(); // Refresh list
    } catch (err) {
      console.error("Error deleting purchase:", err);
      showNotification("error", "Error", "Failed to delete purchase record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit functions
  const openEditModal = (purchase) => {
    setEditData({
      ...purchase,
      purchaseDate: purchase.purchaseDate
        ? new Date(purchase.purchaseDate).toISOString().slice(0, 10)
        : '',
      quantity: purchase.quantity ?? 0,
      unitPrice: purchase.unitPrice ?? 0,
      tax: purchase.tax ?? 0,
      totalAmount: purchase.totalAmount ?? 0,
      paidAmount: purchase.paidAmount ?? 0,
    });
  };

  const closeEditModal = () => setEditData(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => {
      let qty = prev.quantity ?? 0;
      let price = prev.unitPrice ?? 0;
      let tax = prev.tax ?? 0;
      let newVal = value;

      if (['quantity','unitPrice','tax','paidAmount'].includes(name)) {
        newVal = parseFloat(value) || 0;
        if (name === 'quantity') qty = newVal;
        if (name === 'unitPrice') price = newVal;
        if (name === 'tax') tax = newVal;
      }

      return {
        ...prev,
        [name]: newVal,
        totalAmount: +(qty * price + (qty * price * tax)/100).toFixed(2)
      };
    });
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      setLoading(true);
      const updatedPurchase = {
        purchaseOrderNumber: editData.purchaseOrderNumber,
        sellerName: editData.sellerName,
        product: editData.product,
        size: editData.size || '',
        quantity: editData.quantity,
        unitPrice: editData.unitPrice,
        tax: editData.tax,
        totalAmount: editData.totalAmount,
        paidAmount: editData.paidAmount,
        purchaseDate: editData.purchaseDate,
      };

      const response = await fetch(`http://localhost:4000/api/purchases/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPurchase),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      
      setPurchases(purchases.map(p => p._id === editData._id ? result.purchase : p));
      closeEditModal();
      showNotification("success", "Updated!", "Purchase record updated successfully.");
    } catch (err) {
      console.error("Error updating purchase:", err);
      showNotification("error", "Error", "Failed to update purchase record.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "—";
    }
  };

  if (loading && purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading purchase records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Purchase Records</h1>
                  <p className="text-blue-100 text-sm">View and manage all purchase orders</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{purchases.length}</div>
                <div className="text-sm text-blue-100">Total Records</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by PO number, seller, or product..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Showing {currentPurchases.length} of {filteredPurchases.length} records</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentPurchases.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchase records found</h3>
              <p className="text-gray-500">
                {search ? "Try adjusting your search criteria" : "No purchase records available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Purchase Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Product Info
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amounts
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPurchases.map((purchase, i) => {
                      const idx = startIndex + i;
                      const isPaid = purchase.paidAmount >= purchase.totalAmount;
                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Purchase Details */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {purchase.purchaseOrderNumber}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(purchase.purchaseDate)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Seller */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {purchase.sellerName || "Unknown Seller"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Product Info */}
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                  {purchase.product || "Unknown Product"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                                <div>Qty: {purchase.quantity || 0} × ₹{parseFloat(purchase.unitPrice || 0).toFixed(2)}</div>
                                {purchase.size && <div>Size: {purchase.size}</div>}
                              </div>
                            </div>
                          </td>

                          {/* Amounts */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">
                                Subtotal: ₹{(parseFloat(purchase.quantity || 0) * parseFloat(purchase.unitPrice || 0)).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Tax ({purchase.tax || 0}%): ₹{(parseFloat(purchase.quantity || 0) * parseFloat(purchase.unitPrice || 0) * parseFloat(purchase.tax || 0) / 100).toFixed(2)}
                              </div>
                              <div className="text-sm font-bold text-gray-900 bg-blue-50 px-2 py-1 rounded">
                                Total: ₹{parseFloat(purchase.totalAmount || 0).toFixed(2)}
                              </div>
                            </div>
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                Paid: ₹{parseFloat(purchase.paidAmount || 0).toFixed(2)}
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isPaid 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isPaid ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Paid
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Pending
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(purchase)}
                                disabled={loading}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Edit Purchase"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePurchase(purchase._id)}
                                disabled={loading}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Purchase"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPurchases.length)} of {filteredPurchases.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              page === i + 1
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Cards */}
        {purchases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-xl p-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{purchases.length}</div>
                  <div className="text-sm text-gray-600">Total Purchase Orders</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-xl p-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {purchases.filter(p => p.paidAmount >= p.totalAmount).length}
                  </div>
                  <div className="text-sm text-gray-600">Fully Paid</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-xl p-3">
                  <IndianRupee className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{purchases.reduce((sum, purchase) => sum + parseFloat(purchase.totalAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Purchase Value</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeEditModal}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-50">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Edit Purchase Record</h2>
                <p className="text-blue-100 text-sm">Update purchase information</p>
              </div>
              
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {label:'PO Number',name:'purchaseOrderNumber',type:'text',readOnly:true, col:'full'},
                      {label:'Seller Name',name:'sellerName',type:'text'},
                      {label:'Product',name:'product',type:'text'},
                      {label:'Size',name:'size',type:'text'},
                      {label:'Quantity',name:'quantity',type:'number'},
                      {label:'Unit Price (₹)',name:'unitPrice',type:'number'},
                      {label:'Tax (%)',name:'tax',type:'number'},
                      {label:'Total Amount (₹)',name:'totalAmount',type:'number',readOnly:true},
                      {label:'Paid Amount (₹)',name:'paidAmount',type:'number'},
                      {label:'Purchase Date',name:'purchaseDate',type:'date'},
                    ].map(f => (
                      <div key={f.name} className={f.col === 'full' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <input
                          type={f.type}
                          name={f.name}
                          value={editData[f.name] ?? ''}
                          onChange={handleChange}
                          readOnly={f.readOnly}
                          min={['quantity','unitPrice','tax','paidAmount'].includes(f.name) ? 0 : undefined}
                          step={['unitPrice','paidAmount'].includes(f.name) ? '0.01' : undefined}
                          className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            f.readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-blue-300'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}