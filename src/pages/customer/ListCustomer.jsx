// import React, { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { GlobalContext } from '../../context/GlobalContext';
// import { MdDeleteForever } from "react-icons/md";
// import { FaRegEdit } from "react-icons/fa";

// const ListCustomer = () => {
//   const { baseURL } = useContext(GlobalContext)
//   const [page, SetPage] = useState(1);
//   const [customers, setCustomers] = useState([]);
//   const [filter, setFilter] = useState({ search: '', type: '' });

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/customer`);
//         setCustomers(res.data);
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({ ...prev, [name]: value }));
//   };

  

//   const filteredCustomers = customers.filter((cust) => {
//     const matchesSearch = cust.name.toLowerCase().includes(filter.search.toLowerCase());
//     const matchesType = filter.type ? cust.type === filter.type : true;
//     return matchesSearch && matchesType;
//   });

// //pagination
// const itemsPerPage =3;
// const startIndex =(page-1) * itemsPerPage
// const paginatedCustomer = filteredCustomers.slice(startIndex,startIndex+itemsPerPage)
// const totalPages =Math.ceil(filteredCustomers.length/itemsPerPage)

//   return (
//     <div className="p-4 sm:px-8 lg:px-12">
//       <div className="bg-white p-6 shadow rounded max-w-6xl mx-auto">
//         {/* Filters */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//           <h2 className="text-2xl font-bold text-white-700">Customers</h2>
//           <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
//             <input
//               type="text"
//               name="search"
//               value={filter.search}
//               onChange={handleFilterChange}
//               placeholder="Search by name"
//               className="px-4 py-2 border border-gray-300 rounded"
//             />
//             <select
//               name="type"
//               value={filter.type}
//               onChange={handleFilterChange}
//               className="px-6 py-2 border border-gray-300 rounded"
//             >
//               <option value="">All Types</option>
//               <option value="Retail Customer">Retail Customer</option>
//               <option value="Wholesale Customer">Wholesale Customer</option>
//               <option value="Distributor">supplier</option>
//               <option value="seller">Seller</option>
            
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 text-sm">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th className="border border-gray-300 px-2 py-1">Name</th>
//                 <th className="border border-gray-300 px-2 py-1">Email</th>

//                 <th className="border border-gray-300 px-2 py-1">Phone</th>
//                 <th className="border border-gray-300 px-2 py-1">Type</th>
//                 <th className="border border-gray-300 px-2 py-1">City</th>
//                 <th className="border border-gray-300 px-2 py-1">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedCustomer.map((cust) => (
//                 <tr key={cust._id} className="text-sm text-white-700 border-t">
//                   <td className="px-4 py-2 border">{cust.name}</td>
//                   <td className="px-4 py-2 border">{cust.email}</td>
//                   <td className="px-4 py-2 border">{cust.phone}</td>
//                   <td className="px-4 py-2 border">{cust.type}</td>
//                   <td className="px-4 py-2 border">{cust.city}</td>
//                   <td className="px-4 py-2 border flex ">
              
//                     <Link
//                       to={`/editCustomer/${cust._id}`}
//                       className="text-blue-600 hover:underline mr-8"
//                     >
//                       <FaRegEdit  size={18}/>
//                     </Link>
//                     <button
//                       className="text-red-600 hover:underline"
//                       onClick={() => handleDelete(cust._id)}
//                     >
//                     <MdDeleteForever size={19} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {filteredCustomers.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-4 text-gray-500">
//                     No customers found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//          {/* pagination button */}
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

// export default ListCustomer;


import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ListCustomer = () => {
  const { baseURL } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ search: '', type: '' });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${baseURL}/customer`);
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, [baseURL]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${baseURL}/customer/${id}`);
      setCustomers(prev => prev.filter(cust => cust._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type ? cust.type === filter.type : true;
    return matchesSearch && matchesType;
  });

  // Pagination
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCustomer = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Retail Customer">Retail Customer</option>
              <option value="Wholesale Customer">Wholesale Customer</option>
              <option value="Distributor">Distributor</option>
              <option value="Seller">Seller</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Type</th>
                <th className="border px-3 py-2">City</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomer.map(cust => (
                <tr key={cust._id} className="bg-white hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.email}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border">{cust.type}</td>
                  <td className="px-4 py-2 border">{cust.city}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link to={`/editCustomer/${cust._id}`} className="text-blue-500 hover:text-blue-700">
                      <FaRegEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(cust._id)} className="text-red-500 hover:text-red-700">
                      <MdDeleteForever size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500">No customers found.</td>
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

export default ListCustomer;
