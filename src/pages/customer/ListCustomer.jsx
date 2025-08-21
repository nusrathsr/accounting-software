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
import { MdDeleteForever, MdSearch, MdFilterList } from "react-icons/md";
import { FaRegEdit, FaUsers, FaPlus } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineUser } from "react-icons/hi";

const ListCustomer = () => {
  const { baseURL } = useContext(GlobalContext)
  const [page, SetPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ search: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/customer`);
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [baseURL]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    SetPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${baseURL}/customer/${customerId}`);
        setCustomers(customers.filter(cust => cust._id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch = cust.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                         cust.email.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type ? cust.type === filter.type : true;
    return matchesSearch && matchesType;
  });

  // Pagination
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCustomer = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Retail Customer':
        return <HiOutlineUser className="w-4 h-4 text-blue-500" />;
      case 'Wholesale Customer':
        return <HiOutlineOfficeBuilding className="w-4 h-4 text-green-500" />;
      case 'Distributor':
        return <FaUsers className="w-4 h-4 text-purple-500" />;
      case 'Seller':
        return <HiOutlineOfficeBuilding className="w-4 h-4 text-orange-500" />;
      default:
        return <HiOutlineUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Retail Customer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Wholesale Customer':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Distributor':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Seller':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Customer Management</h1>
                  <p className="text-blue-100 text-sm">Manage your customer relationships</p>
                </div>
              </div>
              <Link
                to="/addCustomer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPlus className="w-4 h-4" />
                Add Customer
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <MdFilterList className="w-5 h-5" />
              Filters:
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              <select
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white min-w-48"
              >
                <option value="">All Customer Types</option>
                <option value="Retail Customer">Retail Customer</option>
                <option value="Wholesale Customer">Wholesale Customer</option>
                <option value="Distributor">Distributor</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Location</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCustomer.map((cust, index) => (
                      <tr key={cust._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {cust.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{cust.name}</div>
                              <div className="text-sm text-gray-500">{cust.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{cust.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(cust.type)}`}>
                            {getTypeIcon(cust.type)}
                            {cust.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{cust.city}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/editCustomer/${cust._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit Customer"
                            >
                              <FaRegEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(cust._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Delete Customer"
                            >
                              <MdDeleteForever className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCustomers.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Link
                    to="/addCustomer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Your First Customer
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {filteredCustomers.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> of{' '}
                    <span className="font-semibold">{filteredCustomers.length}</span> customers
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={page === 1}
                      onClick={() => SetPage(page - 1)}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {totalPages <= 7 ? (
                      // Show all pages if 7 or fewer
                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => SetPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                page === pageNum
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      // Show condensed pagination for more than 7 pages
                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => SetPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  page === pageNum
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (pageNum === page - 2 || pageNum === page + 2) {
                            return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>;
                          }
                          return null;
                        })}
                      </div>
                    )}
                    
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={page === totalPages}
                      onClick={() => SetPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCustomer;