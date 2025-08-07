import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditCustomer = () => {
  const { id } = useParams(); // get customer ID from URL
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // simulate fetching existing customer from backend
    const mockData = {
      name: 'Anwar H',
      phone: '9876543210',
      email: 'anwar@example.com',
      type: 'wholesale',
      gstNumber: 'GSTIN123456789',
      address: 'Main road, market street',
      city: 'Calicut',
      state: 'Kerala',
      pincode: '673001',
    };
    setCustomer(mockData);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Customer:', customer);
    // send updated data to backend here
  };

  if (!customer) return <div className="p-4 text-center">Loading customer data...</div>;

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-transparent p-6 shadow rounded max-w-5xl mx-auto ">
        <h2 className="text-2xl font-bold mb-6 text-white-700">Edit Customer (Step {step}/2)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={customer.name}
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
                  value={customer.phone}
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
                  value={customer.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                />
              </div>

              <div>
                <label className="block font-medium">Customer Type *</label>
                <select
                  name="type"
                  value={customer.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded bg-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="retail">Retail Customer</option>
                  <option value="wholesale">Wholesale Customer</option>
                  <option value="distributor">Distributor</option>
                  <option value="seller">Seller</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              {['wholesale', 'distributor', 'vendor'].includes(customer.type) && (
                <div>
                  <label className="block font-medium">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={customer.gstNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-transparent"
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block font-medium">Address</label>
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border rounded bg-transparent"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={customer.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    value={customer.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-medium">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={customer.pincode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>
              </div>
            </>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Back
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Update Customer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
