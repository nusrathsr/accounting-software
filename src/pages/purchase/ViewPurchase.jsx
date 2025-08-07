import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ViewPurchase() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    setPurchases(storedPurchases);
  }, []);

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      const updatedPurchases = purchases.filter((_, i) => i !== index);
      setPurchases(updatedPurchases);
      localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
    }
  };

  const handleEdit = (index) => {
    alert(`Edit functionality for purchase #${index + 1} not implemented yet.`);
  };

  return (
    <div className="px-6 pt-2 pb-4">
      <h1 className="text-xl font-semibold mb-2">Purchase Records</h1>
      {purchases.length > 0 ? (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-4 py-3 border">PO Number</th>
                <th className="px-4 py-3 border">Supplier</th>
                <th className="px-4 py-3 border">Product</th>
                <th className="px-4 py-3 border">Qty</th>
                <th className="px-4 py-3 border">Unit Price</th>
                <th className="px-4 py-3 border">Discount (%)</th>
                <th className="px-4 py-3 border">Tax (%)</th>
                <th className="px-4 py-3 border">Total</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2 border">{purchase.purchaseOrderNumber}</td>
                  <td className="px-4 py-2 border">{purchase.supplierName}</td>
                  <td className="px-4 py-2 border">{purchase.product}</td>
                  <td className="px-4 py-2 border">{purchase.quantity}</td>
                  <td className="px-4 py-2 border">${purchase.unitPrice}</td>
                  <td className="px-4 py-2 border">{purchase.discount}%</td>
                  <td className="px-4 py-2 border">{purchase.tax}%</td>
                  <td className="px-4 py-2 border">${purchase.totalAmount}</td>
                  <td className="px-4 py-2 border">{purchase.purchaseDate}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800 mx-1"
                      title="Edit Purchase"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 mx-1"
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
        <p className="text-gray-600">No purchase records found.</p>
      )}
    </div>
  );
}
