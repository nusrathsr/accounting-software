import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const transactionsPerPage = 5;
  const baseURL = "http://localhost:4000/api";

  // Fetch all payments/receipts
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${baseURL}/payments`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete a transaction
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${baseURL}/payments/${id}`);
        Swal.fire("Deleted!", "Transaction has been deleted.", "success");
        fetchTransactions();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete transaction.", "error");
      }
    }
  };

  // Filter transactions by type
  const filteredTransactions = filterType
    ? transactions.filter((t) => t.type === filterType)
    : transactions;

  // Pagination logic
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // ✅ Calculate balance: prioritize invoice balance, fallback to customer/vendor balance
  const getBalance = (t) => {
    if (t.purchaseId) return (t.purchaseId.totalAmount || 0) - (t.purchaseId.paidAmount || 0);
    if (t.salesId) return (t.salesId.totalAmount || 0) - (t.salesId.paidAmount || 0);
    return t.customer?.balance ?? 0;
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Payments & Receipts</h2>

      {/* Filter */}
      <div className="mb-4 flex gap-4 items-center">
        <label>Filter by Type:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All</option>
          <option value="payment">Payment</option>
          <option value="receipt">Receipt</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">Customer/Vendor</th>
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Mode</th>
            <th className="border px-3 py-2">Balance</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                <td className="border px-3 py-2 capitalize">{t.type}</td>
                <td className="border px-3 py-2">{t.customer?.name || t.vendor?.name || "-"}</td>
                <td className="border px-3 py-2">₹{t.amount.toLocaleString()}</td>
                <td className="border px-3 py-2 capitalize">{t.mode}</td>
                <td className="border px-3 py-2">₹{getBalance(t).toLocaleString()}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-3 py-2 text-center" colSpan="8">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;


