import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddTransaction() {
  const [type, setType] = useState("payment"); // payment or receipt
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("cash");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [vendorId, setVendorId] = useState("");

  const [customers, setCustomers] = useState([]);
  const baseURL = "http://localhost:4000/api";

  // Fetch all customers/vendors
  useEffect(() => {
    axios
      .get(`${baseURL}/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  const customerOptions = customers.filter((c) =>
    ["retail customer", "wholesale customer"].includes(c.type.toLowerCase())
  );
  const vendorOptions = customers.filter((c) =>
    ["seller", "supplier"].includes(c.type.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type,
      amount,
      mode,
      date,
      notes,
      customer: type === "receipt" ? customerId : vendorId,
    };

    try {
      await axios.post(`${baseURL}/payments`, payload);
      Swal.fire({
        icon: "success",
        title: "Transaction Added!",
        text: `Amount ₹${amount} ${type} successfully recorded.`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setAmount("");
      setMode("cash");
      setDate("");
      setNotes("");
      setCustomerId("");
      setVendorId("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add transaction. Please try again!",
      });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCustomerId("");
              setVendorId("");
            }}
          >
            <option value="payment">Payment</option>
            <option value="receipt">Receipt</option>
          </select>
        </div>

        {/* Customer */}
        {type === "receipt" && (
          <div>
            <label className="block mb-1 font-medium">Select Customer</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customerOptions.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Vendor */}
        {type === "payment" && (
          <div>
            <label className="block mb-1 font-medium">Select Vendor</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            >
              <option value="">Select Vendor</option>
              {vendorOptions.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block mb-1 font-medium">Mode</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

