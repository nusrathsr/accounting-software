// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { GlobalContext } from '../../context/GlobalContext';

// const ListExpenses = () => {
//   const { baseURL } = useContext(GlobalContext);
//   const [page, SetPage] = useState(1);
//   const [expenses, setExpenses] = useState([]);
//   const [filter, setFilter] = useState({ startDate: '', endDate: '' });

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/expense`);
//       setExpenses(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredExpenses = expenses.filter((exp) => {
//     if (!filter.startDate && !filter.endDate) return true;
//     const expDate = new Date(exp.date).setHours(0, 0, 0, 0);
//     const start = filter.startDate ? new Date(filter.startDate).setHours(0, 0, 0, 0) : null;
//     const end = filter.endDate ? new Date(filter.endDate).setHours(0, 0, 0, 0) : null;
//     if (start && end) return expDate >= start && expDate <= end;
//     if (start) return expDate >= start;
//     if (end) return expDate <= end;
//     return true;
//   });

//   const totalMonthlyExpense = filteredExpenses.reduce(
//     (sum, exp) => sum + Number(exp.amount),
//     0
//   );

//   const quickFilter = (type) => {
//     const today = new Date();
//     let start, end;
//     if (type === 'lastMonth') {
//       start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//       end = new Date(today.getFullYear(), today.getMonth(), 0);
//     } else if (type === 'thisMonth') {
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = today;
//     }
//     setFilter({
//       startDate: start.toISOString().slice(0, 10),
//       endDate: end.toISOString().slice(0, 10),
//     });
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text('Expenses Report', 14, 20);

//     const tableColumn = ["ID", "Date", "Category", "Amount", "Paid To", "Payment Method"];
//     const tableRows = filteredExpenses.map(exp => [
//       exp.expenseId,
//       new Date(exp.date).toLocaleDateString(),
//       exp.category,
//       exp.amount,
//       exp.paidTo,
//       exp.paymentMethod
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 30
//     });

//     doc.autoPrint();
//     doc.output('dataurlnewwindow');
//   };


//   //pagination
//   const itemsPerPage = 3;
//   const startIndex =(page - 1) * itemsPerPage
//   const paginatedExpense =filteredExpenses.slice(startIndex,startIndex+itemsPerPage)
//   const totalPages =Math.ceil(filteredExpenses.length/itemsPerPage)

//   return (
//     <div className="p-4 sm:px-6 lg:px-8">
//       <h2 className="text-2xl font-bold mb-5 text-white-700"> Expense</h2>
//       <div className="bg-white text-gray-800 p-4 shadow rounded max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="flex flex-wrap justify-between items-center gap-2">
//           {/* Left side: Filters */}
//           <div className="flex flex-wrap gap-2 items-center">
//             <input
//               type="date"
//               name="startDate"
//               value={filter.startDate}
//               onChange={handleFilterChange}
//               className="px-2 py-1 text-sm md:text-base border rounded"
//             />
//             <input
//               type="date"
//               name="endDate"
//               value={filter.endDate}
//               onChange={handleFilterChange}
//               className="px-2 py-1 text-sm md:text-base border rounded"
//             />
//             <select
//               name="quickFilter"
//               value=""
//               onChange={(e) => {
//                 if (e.target.value === 'lastMonth') quickFilter('lastMonth');
//                 if (e.target.value === 'thisMonth') quickFilter('thisMonth');
//               }}
//               className="px-6 py-2 border border-gray-300 rounded"
//             >
//               <option value="">Filter by</option>
//               <option value="lastMonth">Last Month</option>
//               <option value="thisMonth">This Month</option>
//             </select>
//           </div>

//           {/* Right side: Export Button */}
//           <button
//             onClick={generatePDF}
//             className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm md:text-base"
//           >
//             EXPORT
//           </button>
//         </div>


//         {/* Total */}
//         <div className="mb-4 text-right text-sm md:text-base font-semibold">
//           Total Expense: ₹{totalMonthlyExpense.toFixed(2)}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 text-sm">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th className="border border-gray-300 px-2 py-1">ID</th>
//                 <th className="border border-gray-300 px-2 py-1">Date</th>
//                 <th className="border border-gray-300 px-2 py-1">Category</th>
//                 <th className="border border-gray-300 px-2 py-1">Amount</th>
//                 <th className="border border-gray-300 px-2 py-1">Paid To</th>
//                 <th className="border border-gray-300 px-2 py-1">Payment Method</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredExpenses.length > 0 ? (
//                 paginatedExpense.map(exp => (
//                   <tr key={exp._id} className="border-t">
//                     <td className="px-3 py-2 border">{exp.expenseId}</td>
//                     <td className="px-3 py-2 border">{new Date(exp.date).toLocaleDateString()}</td>
//                     <td className="px-3 py-2 border">{exp.category}</td>
//                     <td className="px-3 py-2 border">{exp.amount}</td>
//                     <td className="px-3 py-2 border">{exp.paidTo}</td>
//                     <td className="px-3 py-2 border">{exp.paymentMethod}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4 text-gray-500">
//                     No expenses found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//            {/* pagination button */}
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

// export default ListExpenses;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalContext } from '../../context/GlobalContext';

const ListExpenses = () => {
  const { baseURL } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
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
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(1);
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
    setPage(1);
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

  // Pagination
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedExpense = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Expenses</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              name="quickFilter"
              value=""
              onChange={(e) => {
                if (e.target.value === 'lastMonth') quickFilter('lastMonth');
                if (e.target.value === 'thisMonth') quickFilter('thisMonth');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Quick Filter</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisMonth">This Month</option>
            </select>
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm md:text-base"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Total Expense */}
        <div className="mb-4 text-right text-gray-700 font-semibold">
          Total Expense: ₹{totalMonthlyExpense.toFixed(2)}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center text-gray-700">
            <thead className="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Paid To</th>
                <th className="border px-3 py-2">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                paginatedExpense.map(exp => (
                  <tr key={exp._id} className="bg-white hover:bg-gray-100 transition">
                    <td className="px-3 py-2 border">{exp.expenseId}</td>
                    <td className="px-3 py-2 border">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2 border">{exp.category}</td>
                    <td className="px-3 py-2 border">₹{exp.amount}</td>
                    <td className="px-3 py-2 border">{exp.paidTo}</td>
                    <td className="px-3 py-2 border">{exp.paymentMethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500">No expenses found.</td>
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

export default ListExpenses;
