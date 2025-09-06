import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { GlobalContext } from "../../context/GlobalContext";
import {
  FaList,
  FaFilter,
  FaUndo,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaPlusCircle
} from "react-icons/fa";

const ListAdjustment = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // Fetch adjustments
  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/stockAdjustment");
      setAdjustments(data);
    } catch (err) {
      console.error("Error fetching stock adjustments:", err);
      Swal.fire("Error!", "Failed to fetch stock adjustments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  // Delete adjustment
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This adjustment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/stockAdjustment/${id}`);
      setAdjustments(adjustments.filter((adj) => adj._id !== id));
      Swal.fire("Deleted!", "The adjustment has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting adjustment:", error);
      Swal.fire("Error!", "Failed to delete adjustment.", "error");
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setPage(1);
  };

  // Apply filters
  const filteredAdjustments = adjustments.filter((adj) => {
    const matchesSearch =
      adj.adjustmentId.toLowerCase().includes(search.toLowerCase()) ||
      adj.product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
      adj.variant?.variantName?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "" || adj.adjustmentType === typeFilter;

    return matchesSearch && matchesType;
  });

  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedAdjustments = filteredAdjustments.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredAdjustments.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock adjustments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <FaList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Stock Adjustments</h1>
                <p className="text-indigo-100 text-sm">Manage and track stock corrections</p>
              </div>
            </div>

            <Link
              to="/addAdjustment"
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition flex items-center gap-2"
            >
              <FaPlusCircle />
              New Adjustment
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <FaFilter className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
            >
              <FaUndo />
              Reset
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <FaSearch className="text-blue-600" /> Search
              </label>
              <input
                type="text"
                placeholder="Adjustment ID, Product, Variant"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Adjustment Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Increase">Increase</option>
                <option value="Decrease">Decrease</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physical Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted By</th>
                  <th className="px-6 py-4 text-left text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAdjustments.length > 0 ? (
                  paginatedAdjustments.map((adj) => (
                    <tr key={adj._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{adj.adjustmentId}</td>
                      <td className="px-6 py-4">{formatDate(adj.date)}</td>
                      <td className="px-6 py-4">{adj.product?.productName || "-"}</td>
                      <td className="px-6 py-4">{adj.variant?.variantName || "-"}</td>
                      <td className="px-6 py-4">{adj.systemQty}</td>
                      <td className="px-6 py-4">{adj.physicalQty}</td>
                      <td className="px-6 py-4">{adj.difference}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            adj.adjustmentType === "Increase"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {adj.adjustmentType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {adj.reason === "Others" ? adj.otherReason : adj.reason}
                      </td>
                      <td className="px-6 py-4">{adj.adjustedBy}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/editAdjustment/${adj._id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(adj._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-12 text-gray-500">
                      No stock adjustments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAdjustments.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredAdjustments.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAdjustments.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-2 border rounded-lg bg-white text-sm disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-2 border rounded-lg bg-white text-sm disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAdjustment;
