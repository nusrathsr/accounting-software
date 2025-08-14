import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

export default function ViewPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null);
  const itemsPerPage = 5;

  // Fetch purchases from backend
  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/purchase');
      setPurchases(response.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      alert('Failed to load purchases.');
    }
  };

  // Delete purchase
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/purchase/${id}`);
      setPurchases(purchases.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting purchase:', err);
      alert('Failed to delete purchase.');
    }
  };

  // Search and pagination
  const filteredPurchases = purchases.filter((purchase) =>
    Object.values(purchase).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  // Edit modal handlers
  const openEditModal = (purchase) => setEditData({ ...purchase });
  const closeEditModal = () => setEditData(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      await axios.put(`http://localhost:4000/api/purchase/${editData._id}`, editData);
      const updated = purchases.map((p) => (p._id === editData._id ? editData : p));
      setPurchases(updated);
      closeEditModal();
    } catch (err) {
      console.error('Error updating purchase:', err);
      alert('Failed to update purchase.');
    }
  };

  return (
    <div className="w-full max-w-full px-6 py-4 mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Purchase Records</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search purchases..."
        className="mb-4 w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      {currentPurchases.length > 0 ? (
        <div className="overflow-x-auto rounded shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">PO Number</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Seller Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Product</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Purchased Price</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Tax (%)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Total</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{purchase.purchaseOrderNumber}</td>
                  <td className="px-4 py-2">{purchase.sellerName}</td>
                  <td className="px-4 py-2">{purchase.product}</td>
                  <td className="px-4 py-2 text-right">{purchase.quantity}</td>
                  <td className="px-4 py-2 text-right">₹{purchase.unitPrice}</td>
                  <td className="px-4 py-2 text-right">{purchase.tax}%</td>
                  <td className="px-4 py-2 text-right">₹{purchase.totalAmount}</td>
                  <td className="px-4 py-2">{purchase.purchaseDate}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(purchase)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Purchase"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(purchase._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Purchase"
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
        <p className="text-gray-600 text-center">No purchase records found.</p>
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
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Purchase</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              {/* Reuse inputs as before */}
              {[
                { label: 'PO Number', name: 'purchaseOrderNumber', type: 'text' },
                { label: 'Seller Name', name: 'sellerName', type: 'text' },
                { label: 'Product', name: 'product', type: 'text' },
                { label: 'Quantity', name: 'quantity', type: 'number' },
                { label: 'Purchased Price', name: 'unitPrice', type: 'number' },
                { label: 'Tax (%)', name: 'tax', type: 'number' },
                { label: 'Total Amount', name: 'totalAmount', type: 'number' },
                { label: 'Purchase Date', name: 'purchaseDate', type: 'date' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={editData[field.name]}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ))}

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
