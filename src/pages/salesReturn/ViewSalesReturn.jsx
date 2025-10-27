import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  FileText,
  IndianRupee,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  X as CloseIcon
} from "lucide-react";
import api from "../../utils/api";

export default function ViewSalesReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    refundStatus: "all",
    dateFrom: "",
    dateTo: ""
  });

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales-returns");
      setReturns(response.data.salesReturns || response.data);
    } catch (err) {
      console.error("Error fetching returns:", err);
      showNotification("error", "Error", "Failed to fetch sales returns");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sales return? Stock will be adjusted.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/sales-returns/${id}`);
      showNotification("success", "Deleted!", "Sales return deleted successfully");
      fetchReturns();
    } catch (err) {
      console.error("Error deleting return:", err);
      showNotification("error", "Error", "Failed to delete sales return");
    } finally {
      setLoading(false);
    }
  };

  const viewReturnDetails = async (returnId) => {
    try {
      const response = await api.get(`/sales-returns/${returnId}`);
      setSelectedReturn(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching return details:", err);
      showNotification("error", "Error", "Failed to fetch return details");
    }
  };

  const downloadInvoice = (returnData) => {
    const htmlContent = generateReturnHTML(returnData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `SalesReturn-${returnData.returnId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification("success", "Success!", "Return document downloaded successfully");
  };

  const printReturn = (returnData) => {
    const htmlContent = generateReturnHTML(returnData);
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      showNotification("error", "Error", "Pop-up blocked. Please allow pop-ups");
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 100);
    };
  };

  const generateReturnHTML = (returnData) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Return ${returnData.returnId}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f8fafc;
              padding: 20px;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #dc2626, #b91c1c);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .content { padding: 30px; }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
            }
            .info-section h3 {
              color: #1f2937;
              font-size: 16px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .info-section p {
              margin-bottom: 8px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background: linear-gradient(135deg, #374151, #1f2937);
              color: white;
              padding: 12px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #f3f4f6;
              font-size: 14px;
            }
            tr:nth-child(even) { background: #f9fafb; }
            .totals-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .totals-row.final {
              border-top: 2px solid #dc2626;
              padding-top: 15px;
              margin-top: 15px;
              font-size: 20px;
              font-weight: bold;
              color: #dc2626;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-partial { background: #dbeafe; color: #1e40af; }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>🔄 SALES RETURN</h1>
              <p>Return Document</p>
            </div>
            
            <div class="content">
              <div class="info-grid">
                <div class="info-section">
                  <h3>Return Details</h3>
                  <p><strong>Return ID:</strong> ${returnData.returnId}</p>
                  <p><strong>Return Date:</strong> ${new Date(returnData.returnDate).toLocaleDateString('en-IN')}</p>
                  <p><strong>Reference Invoice:</strong> ${returnData.invoiceNumber}</p>
                </div>
                <div class="info-section">
                  <h3>Customer Details</h3>
                  <p><strong>Name:</strong> ${returnData.customerName}</p>
                  ${returnData.customerPhone ? `<p><strong>Phone:</strong> ${returnData.customerPhone}</p>` : ''}
                  <p><strong>Refund Status:</strong> 
                    <span class="status-badge status-${returnData.refundStatus}">${returnData.refundStatus}</span>
                  </p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold Qty</th>
                    <th>Return Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${returnData.returnItems.map(item => `
                    <tr>
                      <td>
                        <strong>${item.productName}</strong>
                        ${item.sizeOrWeight ? `<br><small>${item.sizeOrWeight}</small>` : ''}
                      </td>
                      <td>${item.soldQuantity}</td>
                      <td><strong>${item.returnQuantity}</strong></td>
                      <td>₹${item.unitPrice.toFixed(2)}</td>
                      <td><strong>₹${item.returnAmount.toFixed(2)}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totals-section">
                <div class="totals-row">
                  <span>Subtotal:</span>
                  <span>₹${returnData.subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>Total Discount:</span>
                  <span>₹${returnData.totalDiscount.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>Total Tax:</span>
                  <span>₹${returnData.totalTax.toFixed(2)}</span>
                </div>
                <div class="totals-row final">
                  <span>Total Return Amount:</span>
                  <span>₹${returnData.totalReturnAmount.toFixed(2)}</span>
                </div>
              </div>

              ${returnData.narration ? `
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <strong>Reason:</strong> ${returnData.narration}
                </div>
              ` : ''}

              ${returnData.notes ? `
                <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
                  <strong>Notes:</strong> ${returnData.notes}
                </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Filter returns
  const filteredReturns = returns.filter(ret => {
    const matchesSearch = 
      ret.returnId.toLowerCase().includes(filters.search.toLowerCase()) ||
      ret.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      ret.customerName.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = 
      filters.refundStatus === "all" || ret.refundStatus === filters.refundStatus;

    const returnDate = new Date(ret.returnDate);
    const matchesDate =
      (!filters.dateFrom || returnDate >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || returnDate <= new Date(filters.dateTo));

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentReturns = filteredReturns.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      partial: { bg: "bg-blue-100", text: "text-blue-800", icon: AlertCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && returns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading returns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
            <div className="flex-1">
              <h4 className={`font-semibold text-sm ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }`}>{notification.title}</h4>
              <p className={`text-sm mt-1 ${
                notification.type === 'success' ? 'text-green-700' :
                notification.type === 'error' ? 'text-red-700' :
                'text-yellow-700'
              }`}>{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal for viewing details */}
      {showModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Return Details - {selectedReturn.returnId}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Return Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return ID:</span>
                      <span className="font-medium">{selectedReturn.returnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return Date:</span>
                      <span className="font-medium">{new Date(selectedReturn.returnDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference Invoice:</span>
                      <span className="font-medium">{selectedReturn.invoiceNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer & Refund</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{selectedReturn.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund Mode:</span>
                      <span className="font-medium capitalize">{selectedReturn.refundMode.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedReturn.refundStatus)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Returned Items</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Sold</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Returned</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedReturn.returnItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{item.productName}</div>
                            {item.sizeOrWeight && <div className="text-xs text-gray-500">{item.sizeOrWeight}</div>}
                          </td>
                          <td className="px-4 py-3 text-center">{item.soldQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-red-600">{item.returnQuantity}</span>
                          </td>
                          <td className="px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-semibold">₹{item.returnAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium">₹{selectedReturn.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Total Discount:</span>
                    <span className="font-medium text-red-600">₹{selectedReturn.totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Total Tax:</span>
                    <span className="font-medium text-green-600">₹{selectedReturn.totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total Return:</span>
                    <span className="text-red-700">₹{selectedReturn.totalReturnAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {(selectedReturn.narration || selectedReturn.notes) && (
                <div className="space-y-3">
                  {selectedReturn.narration && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Reason for Return:</h4>
                      <p className="text-sm text-gray-700">{selectedReturn.narration}</p>
                    </div>
                  )}
                  {selectedReturn.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Additional Notes:</h4>
                      <p className="text-sm text-gray-700">{selectedReturn.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => downloadInvoice(selectedReturn)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => printReturn(selectedReturn)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Returns</h1>
                  <p className="text-red-100 text-sm">View and manage customer returns</p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{returns.length}</div>
                <div className="text-sm text-red-100">Total Returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {returns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-xl p-3">
                  <RotateCcw className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{returns.length}</div>
                  <div className="text-sm text-gray-600">Total Returns</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-xl p-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {returns.filter(r => r.refundStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Refunds</div>
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
                    {returns.filter(r => r.refundStatus === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
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
                    ₹{returns.reduce((sum, r) => sum + (r.totalReturnAmount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search returns..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <select
              value={filters.refundStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, refundStatus: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
              placeholder="From Date"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
              placeholder="To Date"
            />
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentReturns.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No returns found</h3>
              <p className="text-gray-500">No sales returns available yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Return ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Ref Invoice</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentReturns.map((ret) => (
                      <tr key={ret._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-red-100 rounded-lg p-2">
                              <RotateCcw className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-semibold text-gray-900">{ret.returnId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(ret.returnDate).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{ret.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {ret.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-red-700">₹{ret.totalReturnAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(ret.refundStatus)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => viewReturnDetails(ret._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadInvoice(ret)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => printReturn(ret)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                              title="Print"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ret._id)}
                              disabled={loading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReturns.length)} of {filteredReturns.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              page === i + 1
                                ? "bg-red-600 text-white shadow-md"
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
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
      </div>
    </div>
  );
}