import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../../context/GlobalContext';
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ListProduct = () => {
  const { baseURL } = useContext(GlobalContext)
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    brand: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['clothing', 'grocery', 'electronics'];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseURL}/products`); // Change to your backend endpoint
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete product from backend
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${baseURL}/products/${id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterProducts = products.filter((prod) => {
    const searchMatch =
      prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      prod.sku.toLowerCase().includes(filter.search.toLowerCase());

    const categoryMatch = filter.category ? prod.category === filter.category : true;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-white p-6 shadow rounded max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white-700">Product List</h2>
          <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="search by name or sku...."
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded"
            />

            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-black-100 text-left text-lg font-bold text-white-100">
                <th className="px-4 py-2 border">productID</th>
                <th className="px-4 py-2 border">product</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Subcategory</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">purchase Price</th>
                <th className="px-4 py-2 border">selling Price</th>
                <th className="px-4 py-2 border">Stock</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterProducts.map((prod) => (
                <tr key={prod._id} className="text-sm text-white-700 border-t">
                  <td className="px-4 py-2 border">{prod.productId}</td>
                  <td className="px-4 py-2 border"><img src={prod.image} style={{ width: "30px" }} alt="" /></td>
                  <td className="px-4 py-2 border">{prod.name}</td>
                  <td className="px-4 py-2 border">{prod.sku}</td>
                  <td className="px-4 py-2 border capitalize">{prod.category}</td>
                  <td className="px-4 py-2 border">{prod.subcategory}</td>
                  <td className="px-4 py-2 border">{prod.brand}</td>

                  <td className="px-4 py-2 border">₹{prod.purchasePrice}</td>


                  <td className="px-4 py-2 border">₹{prod.sellingPrice}</td>
                  <td className="px-4 py-2 border">
                    {prod.sizes.map(s => `${s.size} (${s.quantity})`).join(', ')}
                  </td>
                  <td className="px-4 py-2 border flex">
                    <Link
                      to={`/editProduct/${prod._id}`}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      <FaRegEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="text-red-600 hover:underline"
                    >
                      <MdDeleteForever size={19} />
                    </button>
                  </td>
                </tr>
              ))}
              {filterProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
