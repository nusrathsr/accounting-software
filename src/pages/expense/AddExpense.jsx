import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';

const AddExpense = () => {
  const {baseURL}=useContext(GlobalContext)
  const [expense, setExpense] = useState({
    expenseId: '',
    date: '',
    category: '',
    amount: '',
    paymentMethod: '',
    paidTo: '',
    description: '',
    attachment: null
  });

  // Auto-generate Expense ID on mount
  useEffect(() => {
    const id = 'EXP-' + Date.now().toString().slice(-6);
    setExpense((prev) => ({ ...prev, expenseId: id, date: new Date().toISOString().slice(0,10) }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setExpense((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in expense) {
        if (expense[key] !== null) {
          formData.append(key, expense[key]);
        }
      }

      const res = await axios.post(`${baseURL}/expense`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Expense added successfully!');
      setExpense((prev) => ({ ...prev, category:'', amount:'', paymentMethod:'', paidTo:'', description:'', attachment:null }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div className="p-4 sm:px-8 lg:px-12">
      <div className="bg-transparent p-6 shadow rounded max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white-700">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Expense ID</label>
              <input
                type="text"
                name="expenseId"
                value={expense.expenseId}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium">Date *</label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Category *</label>
              <select
                name="category"
                value={expense.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                <option value="Electricity">Electricity</option>
                <option value="Salary">Salary</option>
                <option value="Rent">Rent</option>
                <option value="Misc">Misc</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Amount *</label>
              <input
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Payment Method *</label>
              <select
                name="paymentMethod"
                value={expense.paymentMethod}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Paid To</label>
              <input
                type="text"
                name="paidTo"
                value={expense.paidTo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Attachment (Bill / Receipt)</label>
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
