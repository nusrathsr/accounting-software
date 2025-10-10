import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const TaxBands = () => {
  const [taxBands, setTaxBands] = useState([]);
  const [addTaxBand, setAddTaxBand] = useState(false);
  const [formData, setFormData] = useState({
    taxBand: "",
    taxPercentage: "",
    note: "",
  });


  useEffect(() => {
    const fetchingTaxBands = async () => {
      try {
        const { data } = await api.get("/taxBand")
        setTaxBands(data)
      } catch (error) {
        console.error("Error fetching taxBand:", error);

      }

    }
    fetchingTaxBands()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/taxBand", formData);
      console.log(data);
      setTaxBands((prev)=>([...prev,data]))
      setFormData({
        taxBand: "",
        taxPercentage: "",
        note: "",
      });
      setAddTaxBand(false);
    } catch (error) {
      console.log(error);
    }
  };


  // ✅ Delete Tax Band
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Tax Band?")) return;
    try {
      await api.delete(`/taxBand/${id}`);
      setTaxBands((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting Tax Band:", error);
    }
  };


  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tax Bands</h1>
        <button
          onClick={() => setAddTaxBand(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Tax Band
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Tax Band</th>
              <th className="px-4 py-3 border-b">Tax %</th>
              <th className="px-4 py-3 border-b">Note</th>
              <th className="px-4 py-3 border-b">Action</th>            </tr>
          </thead>
          <tbody>
            {taxBands.length > 0 ? (
              taxBands.map((t, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 border-b transition-colors"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{t.taxBand}</td>
                  <td className="px-4 py-3">{t.taxPercentage}</td>
                  <td className="px-4 py-3">{t.note}</td>
                  <td className="px-4 py-3"> <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button></td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No tax bands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {addTaxBand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Tax Band
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Band
                </label>
                <input
                  required
                  type="text"
                  onChange={handleChange}
                  name="taxBand"
                  value={formData.taxBand}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Percentage (%)
                </label>
                <input
                  required
                  type="number"
                  onChange={handleChange}
                  name="taxPercentage"
                  value={formData.taxPercentage}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="note"
                  value={formData.note}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddTaxBand(false)}
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

export default TaxBands;
