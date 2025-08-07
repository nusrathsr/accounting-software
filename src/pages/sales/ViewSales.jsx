import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ViewSales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    setSales(storedSales);
  }, []);

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const updatedSales = sales.filter((_, i) => i !== index);
      setSales(updatedSales);
      localStorage.setItem('sales', JSON.stringify(updatedSales));
    }
  };

  const handleEdit = (index) => {
    alert(`Edit functionality for sale #${index + 1} not implemented yet.`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Sales Records</h1>
      {sales.length > 0 ? (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-4 py-3 border">Invoice #</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Product</th>
                <th className="px-4 py-3 border">Qty</th>
                <th className="px-4 py-3 border">Unit Price</th>
                <th className="px-4 py-3 border">Discount</th>
                <th className="px-4 py-3 border">Tax</th>
                <th className="px-4 py-3 border">Total</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2 border">{sale.invoiceNumber}</td>
                  <td className="px-4 py-2 border">{sale.customerName}</td>
                  <td className="px-4 py-2 border">{sale.product}</td>
                  <td className="px-4 py-2 border">{sale.quantity}</td>
                  <td className="px-4 py-2 border">${sale.unitPrice}</td>
                  <td className="px-4 py-2 border">{sale.discount}%</td>
                  <td className="px-4 py-2 border">{sale.tax}%</td>
                  <td className="px-4 py-2 border">${sale.totalAmount}</td>
                  <td className="px-4 py-2 border">{sale.saleDate}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800 mx-1"
                      title="Edit Sale"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 mx-1"
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
    </div>
  );
}
