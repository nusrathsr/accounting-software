// import React, { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { GlobalContext } from '../../context/GlobalContext';
// import { MdDeleteForever } from "react-icons/md";
// import { FaRegEdit } from "react-icons/fa";

// const ListProduct = () => {
//   const { baseURL } = useContext(GlobalContext)
//   const [products, setProducts] = useState([]);
//   const [page, SetPage] = useState(1);
//   const [filter, setFilter] = useState({
//     search: "",
//     category: "",
//     brand: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const categories = ['clothing', 'grocery', 'electronics'];

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/products`);
//       const data = response.data;
//       setProducts(data)
//       console.log(response);
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   // Delete product from backend
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await axios.delete(`${baseURL}/products/${id}`);
//       setProducts((prev) => prev.filter((prod) => prod._id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete product");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [page]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   const filterProducts = products.filter((prod) => {
//     const searchMatch =
//       prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
//       prod.sku.toLowerCase().includes(filter.search.toLowerCase());

//     const categoryMatch = filter.category ? prod.category === filter.category : true;

//     return searchMatch && categoryMatch;
//   });


//   // pagination
//    const itemsPerPage =4;
//    const startIndex =(page-1)* itemsPerPage;
//    const paginatedProducts =filterProducts.slice(startIndex,startIndex+itemsPerPage);
//    const totalPages =Math.ceil(filterProducts.length/itemsPerPage)
// console.log(paginatedProducts);

//   return (
//     <div className="p-4 sm:px-8 lg:px-12">
//       <div className="bg-white p-6 shadow rounded max-w-8xl mx-auto">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//           <h2 className="text-2xl font-bold text-white-700">Products</h2>
//           <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
//             <input
//               type="text"
//               placeholder="search by name or sku...."
//               name="search"
//               value={filter.search}
//               onChange={handleFilterChange}
//               className="px-4 py-2 border border-gray-300 rounded"
//             />

//             <select
//               name="category"
//               value={filter.category}
//               onChange={handleFilterChange}
//               className="px-6 py-2 border border-gray-300 rounded"
//             >
//               <option value="">All Categories</option>
//               {categories.map((cat, i) => (
//                 <option key={i} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {loading && <p className="text-gray-500">Loading products...</p>}
//         {error && <p className="text-red-500">{error}</p>}

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border border-gray-200">
//             <thead>
//               <tr className="bg-black-100 text-left text-lg font-bold text-white-100">
//                 <th className="px-4 py-2 border">productID</th>
//                 <th className="px-4 py-2 border">product</th>
//                 <th className="px-4 py-2 border">Name</th>
//                 <th className="px-4 py-2 border">SKU</th>
//                 <th className="px-4 py-2 border">Category</th>
//                 <th className="px-4 py-2 border">Subcategory</th>
//                 <th className="px-4 py-2 border">Brand</th>
//                 <th className="px-4 py-2 border">purchase Price</th>
//                 <th className="px-4 py-2 border">selling Price</th>
//                 <th className="px-4 py-2 border">Stock</th>
//                 <th className="px-4 py-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedProducts.map((prod) => (
//                 <tr key={prod._id} className="text-sm text-white-700 border-t">
//                   <td className="px-4 py-2 border">{prod.productId}</td>
//                   <td className="px-4 py-2 border"><img src={prod.image} style={{ width: "30px" }} alt="" /></td>
//                   <td className="px-4 py-2 border">{prod.name}</td>
//                   <td className="px-4 py-2 border">{prod.sku}</td>
//                   <td className="px-4 py-2 border capitalize">{prod.category}</td>
//                   <td className="px-4 py-2 border">{prod.subcategory}</td>
//                   <td className="px-4 py-2 border">{prod.brand}</td>

//                   <td className="px-4 py-2 border">₹{prod.purchasePrice}</td>


//                   <td className="px-4 py-2 border">₹{prod.sellingPrice}</td>
//                   <td className="px-4 py-2 border">
//                     {prod.sizes.map(s => `${s.size}(${s.quantity})`).join(',')}
//                   </td>
//                   <td className="px-4 py-2 border flex">
//                     <Link
//                       to={`/editProduct/${prod._id}`}
//                       className="text-blue-600 hover:underline mr-2"
//                     >
//                       <FaRegEdit size={18} />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(prod._id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       <MdDeleteForever size={19} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {filterProducts.length === 0 && !loading && (
//                 <tr>
//                   <td colSpan="9" className="text-center py-4 text-gray-500">
//                     No products available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         {/* pagination button */}
//         <div className="flex items-center justify-center gap-4 my-8">
//           <button 
//             className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"

//             disabled={page === 1}
//             onClick={() => SetPage(page - 1)}
//           >prev</button>
//           <span className="text-gray-700 font-medium">
//             {page} of  {totalPages}
//           </span>
//           <button
//               className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"

//             disabled={page === totalPages}
//             onClick={() => SetPage(page + 1)}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListProduct;



import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ListProduct = () => {
  const { baseURL } = useContext(GlobalContext)
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ search: "", category: "" });
  const [loading, setLoading] = useState(false);

  const categories = ['clothing', 'grocery', 'electronics'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/products`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filteredProducts = products.filter(prod => {
    const searchMatch =
      prod.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      prod.sku.toLowerCase().includes(filter.search.toLowerCase());
    const categoryMatch = filter.category ? prod.category === filter.category : true;
    return searchMatch && categoryMatch;
  });

  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading products...</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-center">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Product ID</th>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Subcategory</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">Purchase Price</th>
                <th className="px-4 py-2 border">Selling Price</th>
                <th className="px-4 py-2 border">Stock</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(prod => (
                <tr key={prod._id} className="bg-white hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border">{prod.productId}</td>
                  <td className="px-4 py-2 border">
                    <img src={prod.image} alt="" className="w-10   object-cover mx-auto rounded" />
                  </td>
                  <td className="px-4 py-2 border">{prod.name}</td>
                  <td className="px-4 py-2 border">{prod.sku}</td>
                  <td className="px-4 py-2 border capitalize">{prod.category}</td>
                  <td className="px-4 py-2 border">{prod.subcategory}</td>
                  <td className="px-4 py-2 border">{prod.brand}</td>
                  <td className="px-4 py-2 border">₹{prod.purchasePrice}</td>
                  <td className="px-4 py-2 border">₹{prod.sellingPrice}</td>
                  <td className="px-4 py-2 border">
                    {prod.sizes.map(s => `${s.size}(${s.quantity})`).join(', ')}
                  </td>
                  <td className="px-9 py-9 border flex justify-center gap-2">
                    <Link to={`/editProduct/${prod._id}`} className="text-blue-500 hover:text-blue-700">
                      <FaRegEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:text-red-700">
                      <MdDeleteForever size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="11" className="py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">{page} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
