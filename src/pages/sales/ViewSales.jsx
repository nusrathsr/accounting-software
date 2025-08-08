import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    setSales(storedSales);
  }, []);

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const updatedSales = sales.filter((_, i) => i !== index);
      setSales(updatedSales);
      localStorage.setItem('sales', JSON.stringify(updatedSales));
      if ((updatedSales.length / itemsPerPage) < currentPage) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Search filter
  const filteredSales = sales.filter((sale) =>
    Object.values(sale).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  // Open edit modal
  const openEditModal = (index) => {
    setEditIndex(index);
    setEditData({ ...sales[index] });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditIndex(null);
    setEditData(null);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edits
  const handleSave = () => {
    if (!editData) return;

    const updatedSales = [...sales];
    updatedSales[editIndex] = editData;

    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    closeEditModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Sales Records</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search sales..."
        className="mb-4 w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      {currentSales.length > 0 ? (
        <div className="overflow-x-auto rounded shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Invoice #</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Product</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Discount</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Tax</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Total</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSales.map((sale, index) => (
                <tr key={startIndex + index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{sale.invoiceNumber}</td>
                  <td className="px-4 py-2">{sale.customerName}</td>
                  <td className="px-4 py-2">{sale.product}</td>
                  <td className="px-4 py-2 text-right">{sale.quantity}</td>
                  <td className="px-4 py-2 text-right">${sale.unitPrice}</td>
                  <td className="px-4 py-2 text-right">{sale.discount}%</td>
                  <td className="px-4 py-2 text-right">{sale.tax}%</td>
                  <td className="px-4 py-2 text-right">${sale.totalAmount}</td>
                  <td className="px-4 py-2">{sale.saleDate}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(startIndex + index)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Sale"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(startIndex + index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Sale"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No sales records found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4 flex justify-center space-x-1">
          <button
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}

      {/* Edit Modal */}
      {editData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 m-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Sale</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice #</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={editData.invoiceNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={editData.customerName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <input
                  type="text"
                  name="product"
                  value={editData.product}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={editData.unitPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editData.discount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
                <input
                  type="number"
                  name="tax"
                  value={editData.tax}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={editData.totalAmount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                <input
                  type="date"
                  name="saleDate"
                  value={editData.saleDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
