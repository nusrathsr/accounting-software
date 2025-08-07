import React, { useState } from 'react';

export default function AddPurchase() {
  const [formData, setFormData] = useState({
    purchaseOrderNumber:'',
    supplierName: '',
    product: '',
    quantity: '',
    unitPrice: '',
    discount:'',
    tax:'',
    totalAmount:'',
    purchaseDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing purchases from localStorage
    const existingPurchases = JSON.parse(localStorage.getItem('purchases')) || [];

    // Add new purchase
    const updatedPurchases = [...existingPurchases, formData];

    // Save back to localStorage
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));

    alert('Purchase data submitted!');
    setFormData({ purchaseOrderNumber:'', supplierName: '', product: '', quantity: '', unitPrice: '', discount:'', tax:'', totalAmount:'', purchaseDate: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Purchase</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg"
      >
        {/* Purchase Order Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Order Number
          </label>
          <input
            type="number"
            name="purchaseOrderNumber"
            value={formData.purchaseOrderNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* Supplier Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supplier Name
          </label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Product */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Product
          </label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
