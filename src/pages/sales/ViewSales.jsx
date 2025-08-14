import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

export default function ViewSalesInvoices() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch sales from backend
  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
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
      await axios.delete(`http://localhost:4000/api/sales/${id}`);
      fetchSales(); // Refresh list
    } catch (err) {
      console.error("Error deleting sale:", err);
      alert("Failed to delete sale.");
    }
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
              <th className="border border-gray-300 px-2 py-1 text-right">Subtotal</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Tax Amount (₹)</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Total</th>
              <th className="border border-gray-300 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map((sale, i) => {
              const idx = startIndex + i;
              return (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1">{sale.invoiceNumber}</td>
                  <td className="border border-gray-300 px-2 py-1">{sale.customerName || "—"}</td>
                  <td className="border border-gray-300 px-2 py-1">{sale.date?.slice(0, 10)}</td>
                  <td className="border border-gray-300 px-2 py-1 max-w-xs">
                    <ul className="list-disc pl-5 max-h-24 overflow-y-auto">
                      {(sale.products || []).map((item, j) => (
                        <li key={j}>
                          {item.name || "Unnamed Product"} — Qty: {item.quantity || 0}, Price: ₹{parseFloat(item.unitPrice || 0).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">₹{parseFloat(sale.subtotal || 0).toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">₹{parseFloat(sale.tax || 0).toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-semibold">₹{parseFloat(sale.totalAmount || 0).toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <button
                      onClick={() => deleteSale(sale._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : ""}`}
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
