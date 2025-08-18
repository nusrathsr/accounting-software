import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../../context/GlobalContext';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {baseURL}=useContext(GlobalContext)

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${baseURL}/customer/${id}`);
        setCustomer(res.data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/customer/${id}`, customer);
      alert('Customer updated successfully!');
      navigate('/listCustomer'); // redirect back to customer list
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  if (!customer) return <div className="p-4 text-center">Loading customer data...</div>;

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-transparent p-6 shadow rounded max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white-700">Edit Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                value={customer.name || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customer.phone || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={customer.email || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium">Customer Type *</label>
              <select
                name="type"
                value={customer.type || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-transparent"
              >
                <option value="">Select Type</option>
                <option value="Retail Customer">Retail Customer</option>
                <option value="Wholesale Customer">Wholesale Customer</option>
                <option value="Supplier">Supplier</option>
                <option value="seller">Seller</option>
                
              </select>
            </div>

            {['Wholesale Customer', 'Distributor', 'Vendor'].includes(customer.type) && (
              <div>
                <label className="block font-medium">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={customer.gstNumber || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block font-medium">Address</label>
              <textarea
                name="address"
                value={customer.address || ''}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border rounded bg-transparent"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">City</label>
              <input
                type="text"
                name="city"
                value={customer.city || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium">State</label>
              <input
                type="text"
                name="state"
                value={customer.state || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block font-medium">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={customer.pincode || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-transparent"
              />
            </div>
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
