import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalContext } from '../../context/GlobalContext';

const ListExpenses = () => {
  const { baseURL } = useContext(GlobalContext);
  const [page, SetPage] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${baseURL}/expense`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (!filter.startDate && !filter.endDate) return true;
    const expDate = new Date(exp.date).setHours(0, 0, 0, 0);
    const start = filter.startDate ? new Date(filter.startDate).setHours(0, 0, 0, 0) : null;
    const end = filter.endDate ? new Date(filter.endDate).setHours(0, 0, 0, 0) : null;
    if (start && end) return expDate >= start && expDate <= end;
    if (start) return expDate >= start;
    if (end) return expDate <= end;
    return true;
  });

  const totalMonthlyExpense = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const quickFilter = (type) => {
    const today = new Date();
    let start, end;
    if (type === 'lastMonth') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (type === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
    }
    setFilter({
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Expenses Report', 14, 20);

    const tableColumn = ["ID", "Date", "Category", "Amount", "Paid To", "Payment Method"];
    const tableRows = filteredExpenses.map(exp => [
      exp.expenseId,
      new Date(exp.date).toLocaleDateString(),
      exp.category,
      exp.amount,
      exp.paidTo,
      exp.paymentMethod
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30
    });

    doc.autoPrint();
    doc.output('dataurlnewwindow');
  };


  //pagination
  const itemsPerPage = 3;
  const startIndex =(page - 1) * itemsPerPage
  const paginatedExpense =filteredExpenses.slice(startIndex,startIndex+itemsPerPage)
  const totalPages =Math.ceil(filteredExpenses.length/itemsPerPage)

  return (
    <div className="p-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-5 text-white-700"> Expense</h2>
      <div className="bg-white text-gray-800 p-4 shadow rounded max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Left side: Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="px-2 py-1 text-sm md:text-base border rounded"
            />
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="px-2 py-1 text-sm md:text-base border rounded"
            />
            <select
              name="quickFilter"
              value=""
              onChange={(e) => {
                if (e.target.value === 'lastMonth') quickFilter('lastMonth');
                if (e.target.value === 'thisMonth') quickFilter('thisMonth');
              }}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              <option value="">Filter by</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>

          {/* Right side: Export Button */}
          <button
            onClick={generatePDF}
            className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm md:text-base"
          >
            EXPORT
          </button>
        </div>


        {/* Total */}
        <div className="mb-4 text-right text-sm md:text-base font-semibold">
          Total Expense: ₹{totalMonthlyExpense.toFixed(2)}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-300 px-2 py-1">ID</th>
                <th className="border border-gray-300 px-2 py-1">Date</th>
                <th className="border border-gray-300 px-2 py-1">Category</th>
                <th className="border border-gray-300 px-2 py-1">Amount</th>
                <th className="border border-gray-300 px-2 py-1">Paid To</th>
                <th className="border border-gray-300 px-2 py-1">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                paginatedExpense.map(exp => (
                  <tr key={exp._id} className="border-t">
                    <td className="px-3 py-2 border">{exp.expenseId}</td>
                    <td className="px-3 py-2 border">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2 border">{exp.category}</td>
                    <td className="px-3 py-2 border">{exp.amount}</td>
                    <td className="px-3 py-2 border">{exp.paidTo}</td>
                    <td className="px-3 py-2 border">{exp.paymentMethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
           {/* pagination button */}
        <div className="flex items-center justify-center gap-4 my-8">
          <button 
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"

            disabled={page === 1}
            onClick={() => SetPage(page - 1)}
          >prev</button>
          <span className="text-gray-700 font-medium">
            {page} of  {totalPages}
          </span>
          <button
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"

            disabled={page === totalPages}
            onClick={() => SetPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListExpenses;


