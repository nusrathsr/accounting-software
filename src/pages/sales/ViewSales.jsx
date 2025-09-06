import React, { useState, useEffect } from "react";
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
  Download,
  Filter,
  AlertCircle,
  Edit3
} from "lucide-react";
import api from "../../utils/api";

export default function ViewSalesInvoices() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editData, setEditData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const itemsPerPage = 8;

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch sales from backend
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      showNotification("error", "Error", "Failed to fetch sales invoices. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filter sales based on search
  const filteredSales = sales.filter((sale) => {
    const s = search.toLowerCase();
    const matchesSearch =
      sale.invoiceNumber.toLowerCase().includes(s) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(s)) ||
      (sale.products || []).some((item) =>
        (item.name || "").toLowerCase().includes(s)
      );

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "paid"
          ? sale.paymentStatus === true
          : sale.paymentStatus === false;

    const saleDate = new Date(sale.saleDate || sale.date);

    const matchesDate =
      (!dateFrom || saleDate >= new Date(dateFrom)) &&
      (!dateTo || saleDate <= new Date(dateTo));

    return matchesSearch && matchesStatus && matchesDate;
  });


  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  // Delete a sale
  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setLoading(true);
      await api.delete(`/sales/${id}`);
      showNotification("success", "Deleted!", "Invoice deleted successfully.");
      fetchSales(); // Refresh list
    } catch (err) {
      console.error("Error deleting sale:", err);
      showNotification("error", "Error", "Failed to delete invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const openEditModal = (sale) => {
    setEditData(sale);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    if (!editData) return;
    try {
      setLoading(true);
      await api.put(`/sales/${editData._id}`, editData);
      showNotification("success", "Updated!", "Invoice updated successfully.");
      setEditData(null);
      fetchSales();
    } catch (err) {
      showNotification("error", "Error", "Failed to update invoice. Please try again.");
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

  if (loading && sales.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
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
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Invoices</h1>
                  <p className="text-blue-100 text-sm">View and manage all sales invoices</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{sales.length}</div>
                <div className="text-sm text-blue-100">Total Invoices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {sales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-xl p-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{sales.length}</div>
                  <div className="text-sm text-gray-600">Total Invoices</div>
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
                    {sales.filter(s => s.paymentStatus).length}
                  </div>
                  <div className="text-sm text-gray-600">Paid Invoices</div>
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
                    ₹{sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice, customer, or product..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              {/* Payment Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Showing {currentSales.length} of {filteredSales.length} invoices</span>
              </div>

            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentSales.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">
                {search ? "Try adjusting your search criteria" : "No sales invoices available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Invoice Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Items
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
                    {currentSales.map((sale, i) => {
                      const idx = startIndex + i;
                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Invoice Details */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {sale.invoiceNumber}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(sale.saleDate || sale.date)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {sale.customerName || "Walk-in Customer"}
                                </div>
                                {sale.number && (
                                  <div className="text-sm text-gray-500">{sale.number}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Items */}
                          {/* <td className="px-6 py-4">
                            <div className="max-w-xs space-y-2">
                              {(sale.products || []).map((item, j) => (
                                <div key={j} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-2">
                                  <div className="font-medium">{item.name || "Unnamed Product"}</div>
                                  <div className="flex flex-wrap gap-2 mt-1"> */}
                          {/* Main product */}
                          {/* <span className="bg-blue-50 text-blue-700 rounded px-2 py-1">
                                      Qty: {item.quantity || 0} × ₹{parseFloat(item.unitPrice || 0).toFixed(2)}
                                    </span> */}

                          {/* Variants in same row */}
                          {/* {(item.variants || []).map((variant, k) => (
                                      <span key={k} className="bg-gray-100 text-gray-700 rounded px-2 py-1">
                                        {variant.name} — Qty: {variant.quantity || 0} × ₹{parseFloat(variant.unitPrice || 0).toFixed(2)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td> */}
                          <td className="px-6 py-4 w-[550px]">   {/* wider column */}
                            <div className="max-w-3xl space-y-2"> {/* more width before wrapping */}
                              {(sale.products || []).map((item, j) => (
                                <div
                                  key={j}
                                  className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                                >
                                  {/* Product name */}
                                  <div className="font-medium truncate whitespace-normal break-words">
                                    {item.name || "Unnamed Product"}
                                  </div>

                                  {/* Quantity + Variants */}
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="bg-blue-50 text-blue-700 rounded px-2 py-1">
                                      Qty: {item.quantity || 0} × ₹{parseFloat(item.unitPrice || 0).toFixed(2)}
                                    </span>

                                    {(item.variants || []).map((variant, k) => (
                                      <span
                                        key={k}
                                        className="bg-gray-100 text-gray-700 rounded px-2 py-1"
                                      >
                                        {variant.name} — Qty: {variant.quantity || 0} × ₹
                                        {parseFloat(variant.unitPrice || 0).toFixed(2)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>


                          {/* Amounts */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">
                                Subtotal: ₹{parseFloat(sale.subtotal || 0).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                GST: ₹{parseFloat(sale.tax || 0).toFixed(2)}
                              </div>
                              <div className="text-sm font-bold text-gray-900 bg-blue-50 px-2 py-1 rounded">
                                Total: ₹{parseFloat(sale.totalAmount || 0).toFixed(2)}
                              </div>
                            </div>
                          </td>

                          {/* Payment */}
                          {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-1">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 capitalize">
                                  {sale.paymentMode || "—"}
                                </span>
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sale.paymentStatus
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {sale.paymentStatus ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Paid
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Unpaid
                                  </>
                                )}
                              </div>
                            </div>
                          </td> */}
                          {/* Payment */}
                          {/* Payment */}
<td className="px-6 py-4 whitespace-nowrap text-center">
  <div className="space-y-2">
    {sale.payments && sale.payments.length > 0 ? (
  <div className="text-sm text-gray-700 space-y-1">
    {sale.payments.length > 1 && (
      <div className="font-semibold text-gray-800">Split</div>
    )}
    {sale.payments.map((p, idx) => (
      <div key={idx} className="flex items-center justify-center gap-1 text-xs">
        <span className="capitalize">{p.mode}:</span>
        <span>₹{parseFloat(p.amount || 0).toFixed(2)}</span>
      </div>
    ))}
  </div>
) : (
  <div className="flex items-center justify-center gap-1">
    <CreditCard className="w-4 h-4 text-gray-400" />
    <span className="text-sm text-gray-600 capitalize">
      {sale.paymentMode || "—"}
    </span>
  </div>
)}

  </div>
</td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(sale)}
                                disabled={loading}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Edit Sale"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => deleteSale(sale._id)}
                                disabled={loading}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Invoice"
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSales.length)} of {filteredSales.length} results
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
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === i + 1
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
              {editData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Edit Sale</h2>

                    {/* Customer Name */}
                    <label className="block text-sm font-medium mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={editData.customerName || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, customerName: e.target.value })
                      }
                      className="w-full border rounded-lg p-2 mb-4"
                      placeholder="Customer Name"
                    />

                    {/* Phone Number */}
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editData.number || ""}
                      onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                      className="w-full border rounded-lg p-2 mb-4"
                      placeholder="Phone Number"
                    />

                    {/* Payment Mode */}
                    <label className="block text-sm font-medium mb-1">Payment Mode</label>
                    <select
                      value={editData.paymentMode || "cash"}
                      onChange={(e) =>
                        setEditData({ ...editData, paymentMode: e.target.value })
                      }
                      className="w-full border rounded-lg p-2 mb-4"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                    </select>

                    {/* Payment Status */}
                    <label className="block text-sm font-medium mb-1">Payment Status</label>
                    <select
                      value={editData.paymentStatus ? "paid" : "unpaid"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          paymentStatus: e.target.value === "paid",
                        })
                      }
                      className="w-full border rounded-lg p-2 mb-6"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>

                    {/* Products Section */}
                    <h3 className="text-lg font-semibold mb-2">Products</h3>
                    {editData.products && editData.products.length > 0 ? (
                      editData.products.map((prod, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center border p-2 rounded-lg mb-2"
                        >
                          <input
                            type="text"
                            value={prod.item || ""}
                            onChange={(e) => {
                              const updatedProducts = [...editData.products];
                              updatedProducts[idx].item = e.target.value;
                              setEditData({ ...editData, products: updatedProducts });
                            }}
                            className="col-span-4 border rounded-lg p-2"
                            placeholder="Item"
                          />
                          <input
                            type="number"
                            value={prod.qty || 1}
                            onChange={(e) => {
                              const updatedProducts = [...editData.products];
                              updatedProducts[idx].qty = parseInt(e.target.value) || 1;
                              setEditData({ ...editData, products: updatedProducts });
                            }}
                            className="col-span-2 border rounded-lg p-2"
                            placeholder="Qty"
                          />
                          <input
                            type="number"
                            value={prod.price || 0}
                            onChange={(e) => {
                              const updatedProducts = [...editData.products];
                              updatedProducts[idx].price = parseFloat(e.target.value) || 0;
                              setEditData({ ...editData, products: updatedProducts });
                            }}
                            className="col-span-3 border rounded-lg p-2"
                            placeholder="Price"
                          />
                          <span className="col-span-2 font-semibold">
                            ₹{(prod.qty || 0) * (prod.price || 0)}
                          </span>
                          <button
                            onClick={() => {
                              const updatedProducts = editData.products.filter(
                                (_, i) => i !== idx
                              );
                              setEditData({ ...editData, products: updatedProducts });
                            }}
                            className="col-span-1 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No products added yet.</p>
                    )}

                    {/* Add Product Button */}
                    <button
                      onClick={() => {
                        const updatedProducts = [
                          ...editData.products,
                          { item: "", qty: 1, price: 0 },
                        ];
                        setEditData({ ...editData, products: updatedProducts });
                      }}
                      className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                      + Add Product
                    </button>

                    {/* Save/Cancel */}
                    <div className="flex justify-end space-x-2 mt-6">
                      <button
                        onClick={() => setEditData(null)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
