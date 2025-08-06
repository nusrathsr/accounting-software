import React, { useState, useEffect } from 'react';

export default function ViewSales() {
  // Sample data (replace with API/localStorage later)
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Try loading from localStorage (if data saved from AddSales)
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    setSales(storedSales);
  }, []);

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mb-4">View Sales</h1>
      {sales.length > 0 ? (
        <div className="w-full">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index} draggable={false}>
                  <td className="border border-gray-300 px-4 py-2">{sale.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2">{sale.product}</td>
                  <td className="border border-gray-300 px-4 py-2">{sale.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">${sale.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No sales data available.</p>
      )}
    </div>
  );
}
