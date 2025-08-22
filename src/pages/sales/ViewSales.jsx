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
  AlertCircle
} from "lucide-react";

export default function ViewSalesInvoices() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
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
      const response = await fetch("http://localhost:4000/api/sales");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSales(data);
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
    return (
      sale.invoiceNumber.toLowerCase().includes(s) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(s)) ||
      (sale.products || []).some((item) =>
        (item.name || "").toLowerCase().includes(s)
      )
    );
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  // Delete a sale
  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/sales/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      showNotification("success", "Deleted!", "Invoice deleted successfully.");
      fetchSales(); // Refresh list
    } catch (err) {
      console.error("Error deleting sale:", err);
      showNotification("error", "Error", "Failed to delete invoice. Please try again.");
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
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                  {(sale.products || []).length} item(s)
                                </span>
                              </div>
                              <div className="space-y-1 max-h-20 overflow-y-auto">
                                {(sale.products || []).slice(0, 2).map((item, j) => (
                                  <div key={j} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                                    <div className="font-medium">{item.name || "Unnamed Product"}</div>
                                    <div>Qty: {item.quantity || 0} × ₹{parseFloat(item.unitPrice || 0).toFixed(2)}</div>
                                  </div>
                                ))}
                                {(sale.products || []).length > 2 && (
                                  <div className="text-xs text-blue-600 font-medium">
                                    +{(sale.products || []).length - 2} more items
                                  </div>
                                )}
                              </div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-1">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 capitalize">
                                  {sale.paymentMode || "—"}
                                </span>
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                sale.paymentStatus 
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
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
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
      </div>
    </div>
  );
}