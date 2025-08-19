import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // 👈 adjust as needed
  const { baseURL } = useContext(GlobalContext);

  // Fetch report function
  const fetchReport = async (startDate = "", endDate = "") => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axios.get(`${baseURL}/reports/sales`, { params });
      setReport(data);
      setCurrentPage(1); // reset to first page whenever new data comes
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    }
  };

  // Fetch all sales by default on mount
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, []);

  // Fetch report automatically when dates change
  useEffect(() => {
    fetchReport(dates.startDate, dates.endDate);
  }, [dates]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = report?.sales.slice(indexOfFirstRow, indexOfLastRow) || [];
  const totalPages = report ? Math.ceil(report.sales.length / rowsPerPage) : 1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Sales Report</h2>

      {/* Date Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
        />
      </div>

      {/* Report Section */}
      {report && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-green-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">₹{report.totalRevenue}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Tax</h3>
              <p className="text-2xl font-bold text-yellow-600">₹{report.totalTax}</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-3">📋 Sales Details</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="p-3 border-b">Invoice</th>
                  <th className="p-3 border-b">Customer</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{s.invoiceNumber}</td>
                    <td className="p-3 border-b">{s.customerName}</td>
                    <td className="p-3 border-b">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b font-semibold">₹{s.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;

