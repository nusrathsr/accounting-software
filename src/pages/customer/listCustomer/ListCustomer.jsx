import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ListCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ search: '', type: '' });

  useEffect(() => {
    const mockCustomers = [
      {
        id: '1',
        name: 'Anna Retail',
        phone: '9999888877',
        type: 'retail',
        city: 'Kozhikode',
      },
      {
        id: '2',
        name: 'Wholesaler Co',
        phone: '9999111122',
        type: 'wholesale',
        city: 'Kannur',
      },
      {
        id: '3',
        name: 'Vendor Mart',
        phone: '8888555544',
        type: 'vendor',
        city: 'Ernakulam',
      },
    ];
    setCustomers(mockCustomers);
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Customer List</h2>
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
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="distributor">Distributor</option>
              <option value="seller">Seller</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-grey-200">
            <thead className=" text-left text-lg font-semibold text-white-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">City</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="text-sm text-black-800 border-t">
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border capitalize">{cust.type}</td>
                  <td className="px-4 py-2 border">{cust.city}</td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/editCUstomer`}
                      // to={`/editCUstomer${cust.id}`}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline">Delete</button>
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