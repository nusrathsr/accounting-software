import React, { useState, useEffect } from 'react';

export default function ViewPurchase() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    setPurchases(storedPurchases);
  }, []);

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mb-4">View Purchases</h1>
      {purchases.length > 0 ? (
        <div className="w-full">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Supplier</th>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index} draggable='false'>
                  <td className="border border-gray-300 px-4 py-2">{purchase.supplierName}</td>
                  <td className="border border-gray-300 px-4 py-2">{purchase.product}</td>
                  <td className="border border-gray-300 px-4 py-2">{purchase.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">${purchase.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{purchase.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No purchase data available.</p>
      )}
    </div>
  );
}
