import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../utils/api";

const ProductUnits = () => {
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ unit: "", notes: "" });

  const API_URL = "http://localhost:4000/api/units";

  // 🧩 Fetch all units from backend
  const fetchUnits = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  // ➕ Add new unit
  const handleAddUnit = async () => {
    if (!newUnit.unit.trim()) return alert("Unit name is required!");
    try {
      
      await api.post("/units", newUnit);
      fetchUnits();
      setNewUnit({ unit: "", notes: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding unit:", error);
      alert(error.response?.data?.message || "Error adding unit");
    }
  };

  // 🚫 Disable or enable a unit
  const handleDisable = async (id) => {
    try {
      await api.put(`units/${id}/disable`);
      fetchUnits();
    } catch (error) {
      console.error("Error disabling unit:", error);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Product Units</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Unit
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Unit</th>
              <th className="px-4 py-2 border">Notes</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, index) => (
              <tr key={unit._id} className="text-center border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{unit.unit}</td>
                <td className="px-4 py-2">{unit.notes}</td>
                <td className="px-4 py-2">
                  {unit.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDisable(unit._id)}
                    className="text-red-600 hover:underline"
                  >
                    {unit.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Add New Unit</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Unit</label>
              <input
                type="text"
                value={newUnit.unit}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, unit: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product Unit"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                value={newUnit.notes}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, notes: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleAddUnit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUnits;
