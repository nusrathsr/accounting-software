import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function ViewSalesInvoices() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(savedSales);
  }, []);

  const filteredSales = sales.filter((sale) => {
    const s = search.toLowerCase();
    return (
      sale.invoiceNumber.toLowerCase().includes(s) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(s)) ||
      sale.items.some((item) =>
        (item.productName || "").toLowerCase().includes(s)
      )
    );
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const deleteSale = (index) => {
    const newSales = [...sales];
    newSales.splice(index, 1);
    setSales(newSales);
    localStorage.setItem("sales", JSON.stringify(newSales));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">View Sales Invoices</h1>

      <input
        type="text"
        placeholder="Search by invoice, customer, or product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-md border p-2 mb-4"
      />

      {currentSales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Invoice #</th>
              <th className="border border-gray-300 px-2 py-1">Customer</th>
              <th className="border border-gray-300 px-2 py-1">Date</th>
              <th className="border border-gray-300 px-2 py-1">Items</th>
              <th className="border border-gray-300 px-2 py-1 text-right">
                Subtotal
              </th>
              <th className="border border-gray-300 px-2 py-1 text-right">
                Tax Amount (₹)
              </th>
              <th className="border border-gray-300 px-2 py-1 text-right">
                Total
              </th>
              <th className="border border-gray-300 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map((sale, i) => {
              const idx = startIndex + i;
              return (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1">
                    {sale.invoiceNumber}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {sale.customerName || "—"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {sale.saleDate}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 max-w-xs">
                    <ul className="list-disc pl-5 max-h-24 overflow-y-auto">
                      {sale.items.map((item, j) => (
                        <li key={j}>
                          {item.productName || "Unnamed Product"} — Qty:{" "}
                          {item.quantity || 0}, Price: ₹
                          {parseFloat(item.unitPrice || 0).toFixed(2)}
                          {item.tax ? `, Tax: ${item.tax}%` : ""}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    ₹{parseFloat(sale.subtotal || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                     ₹{parseFloat(sale.taxTotal || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                    ₹{parseFloat(sale.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(`Delete invoice ${sale.invoiceNumber}?`)
                        ) {
                          deleteSale(idx);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      aria-label={`Delete invoice ${sale.invoiceNumber}`}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
