import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const FinancialYear = () => {
  const [isAddFinancialYear, setAddFinancialYear] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [financialYears, setFinancialYears] = useState([]);


  // Helper to format date as dd-mm-yyyy
  const formatDateDDMMYYYY = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // ✅ Auto-fill current financial year (April–March)
  useEffect(() => {
    const today = new Date();
    const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const start = `${year}-04-01`;
    const end = `${year + 1}-03-31`;
    setFormData({
      startDate: start,
      endDate: end,
      name: `FY ${year}-${year + 1}`,
    });
  }, [isAddFinancialYear]);

  // ✅ Fetch financial years from backend on mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const { data } = await api.get("/financialYear");
        setFinancialYears(data);
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    };
    fetchFinancialYears();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit new financial year
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/financialYear", formData);
      setFinancialYears((prev) => [...prev, data]); // Add newly created FY
      setAddFinancialYear(false);
    } catch (error) {
      console.error("Error adding financial year:", error);
    }
  };

  // ✅ Delete financial year
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this financial year?")) return;
    try {
      await api.delete(`/financialYear/${id}`);
      setFinancialYears((prev) => prev.filter((fy) => fy._id !== id));
    } catch (error) {
      console.error("Error deleting financial year:", error);
    }
  };

  // ✅ Filter by search term
  const filteredData = financialYears.filter((fy) =>
    fy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Year</h1>
        <button
          onClick={() => setAddFinancialYear(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Financial Year
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by financial year name..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((fy, index) => (
                <tr key={fy._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{formatDateDDMMYYYY(fy.startDate)}</td>
                  <td className="px-4 py-2">{formatDateDDMMYYYY(fy.endDate)}</td>

                  <td className="px-4 py-2 font-medium">{fy.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(fy._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Financial Year Modal */}
      {isAddFinancialYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add Financial Year
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setAddFinancialYear(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialYear;
