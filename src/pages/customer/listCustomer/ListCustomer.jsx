import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../../context/GlobalContext';
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ListCustomer = () => {
  const { baseURL } = useContext(GlobalContext)
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ search: '', type: '' });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${baseURL}/customer`);
        setCustomers(res.data); // Assuming backend returns array of customers
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch = cust.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type ? cust.type === filter.type : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-transparent p-6 shadow rounded max-w-6xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white-700">Customer List</h2>
          <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search by name"
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              <option value="">All Types</option>
              <option value="Retail Customer">Retail Customer</option>
              <option value="Wholesale Customer">Wholesale Customer</option>
              <option value="Distributor">Distributor</option>
              <option value="seller">Seller</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-grey-200">
            <thead className="text-left text-lg font-semibold text-white-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>

                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">City</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust._id} className="text-sm text-white-700 border-t">
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.email}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border">{cust.type}</td>
                  <td className="px-4 py-2 border">{cust.city}</td>
                  <td className="px-4 py-2 border flex ">
                    <Link
                      to={`/editCustomer/${cust._id}`}
                      className="text-blue-600 hover:underline mr-8"
                    >
                      <FaRegEdit  size={18}/>
                    </Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(cust._id)}
                    >
                    <MdDeleteForever size={19} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No customers found.
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

export default ListCustomer;
