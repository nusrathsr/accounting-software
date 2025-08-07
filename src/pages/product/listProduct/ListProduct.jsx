import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './listProduct.css'

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    brand: "",
  });
  const categories = ['clothing', 'grocery', 'electronics'];



  // Simulated fetch — later replace with API call
  useEffect(() => {
    const mockProducts = [
      {
        id: '1',
        sku: "FOR-FAS-269",
        name: 'Formal Shirt',
        category: 'clothing',
        subcategory: 'Shirts',
        brand: 'Raymond',
        stockStatus: "Out of stock",
        sellingPrice: 1399,
        sizes: [
          { size: 'M', quantity: 10 },
          { size: 'L', quantity: 8 },],
      },
      {
        id: '2',
        sku: "LAP-ELE-269",
        name: 'Laptop',
        category: 'electronics',
        subcategory: 'Laptops',
        brand: 'Dell',
        stockStatus: "Low Stock",
        sellingPrice: 65000,
        sizes: [   { size: ' 15.6 inch', quantity: 8 }],
      },
      {
        id: '3',
        sku: "FOR-GRO-269",
        name: 'milk',
        category: 'grocery',
        subcategory: 'dairy product',
        brand: 'milma',
        stockStatus: "In stock",
        sellingPrice: 36,
        sizes: [
          { size: '500 ml', quantity: 8 },
        
        ],
      }
    ];
    setProducts(mockProducts);
  }, []);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }))
  }

  const filterProducts = products.filter((prod) => {
    const searchMatch = prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      prod.sku.toLowerCase().includes(filter.search.toLowerCase());

    const categoryMatch = filter.category ? prod.category === filter.category : true;

    return searchMatch && categoryMatch

  })

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-transparent p-6 shadow rounded max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center  mb-6 gap-4">
          <h2 className="text-2xl font-bold   text-white">Product List</h2>
          <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
            <input type="text" placeholder='search by name or sku....'
              name='search'
              value={filter.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded"
            />

            <select name="category" value={filter.category} onChange={handleFilterChange} id=""
              className="px-6 py-2 border border-gray-300 rounded"
            >
              {
                categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))
              }
              <option value="">All Categories</option>

            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-black-100 text-left text-lg font-bold text-white-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Subcategory</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Stock</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterProducts.map((prod) => (
                <tr
                  key={prod.id}
                  className={`text-sm text-gray-800 border-t 
                  ${prod.stockStatus === 'Out of stock' ? 'bg-orange-200' :
                      prod.stockStatus === 'Low Stock' ? 'bg-red-200' :
                        prod.stockStatus === 'In stock' ? 'bg-green-200' :
                          'bg-transparent'
                    }`}
                >
                  <td className="px-4 py-2 border">{prod.name}</td>
                  <td className="px-4 py-2 border">{prod.sku}</td>
                  <td className="px-4 py-2 border capitalize">{prod.category}</td>
                  <td className="px-4 py-2 border">{prod.subcategory}</td>
                  <td className="px-4 py-2 border">{prod.brand}</td>
                  <td className="px-4 py-2 border">{prod.stockStatus}</td>
                  <td className="px-4 py-2 border">₹{prod.sellingPrice}</td>
                  <td className="px-4 py-2 border">
                    {prod.sizes.length > 0
                      ? prod.sizes.map((s) => `${s.size}: ${s.quantity}`).join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/editProduct`}
                      // to={`/editProduct/${prod.id}`}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filterProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
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
