import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseDue = () => {
  const [dues, setDues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const baseURL = "http://localhost:4000/api/purchases";

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await axios.get(`${baseURL}/dues`);
        setDues(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDues();
  }, []);

  const totalDues = dues.reduce((sum, d) => sum + (d.balanceDue || 0), 0);

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full overflow-x-auto relative">
      {/* Modal above the table */}
      {showModal && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-6 border rounded shadow bg-white w-64 z-10">
          <h3 className="text-lg font-bold mb-2">Total Pending Dues</h3>
          <p className="text-2xl font-semibold mb-4">₹{totalDues.toLocaleString()}</p>
          <button
            onClick={() => setShowModal(false)}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pending Purchase Dues</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Total Dues
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Vendor</th>
            <th className="border px-3 py-2">Invoice No</th>
            <th className="border px-3 py-2">Total Amount</th>
            <th className="border px-3 py-2">Paid Amount</th>
            <th className="border px-3 py-2">Balance Due</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d) => (
            <tr key={d._id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{new Date(d.date).toLocaleDateString()}</td>
              <td className="border px-3 py-2">{d.vendor}</td>
              <td className="border px-3 py-2">{d.invoiceNo}</td>
              <td className="border px-3 py-2">₹{(d.totalAmount || 0).toLocaleString()}</td>
              <td className="border px-3 py-2">₹{(d.paidAmount || 0).toLocaleString()}</td>
              <td className="border px-3 py-2">₹{(d.balanceDue || 0).toLocaleString()}</td>
            </tr>
          ))}
          {dues.length === 0 && (
            <tr>
              <td className="border px-3 py-2 text-center" colSpan="6">
                No pending dues
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseDue;
