// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PurchaseDue = () => {
//   const [dues, setDues] = useState([]);
//   const baseURL = "http://localhost:4000/api/purchases";

//   useEffect(() => {
//     const fetchDues = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/dues`);
//         setDues(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchDues();
//   }, []);

//   return (
//     <div className="p-6 bg-white shadow rounded-lg w-full overflow-x-auto">
//       <h2 className="text-xl font-bold mb-4">Pending Purchase Dues</h2>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-3 py-2">Date</th>
//             <th className="border px-3 py-2">Vendor</th>
//             <th className="border px-3 py-2">Invoice No</th>
//             <th className="border px-3 py-2">Total Amount</th>
//             <th className="border px-3 py-2">Paid Amount</th>
//             <th className="border px-3 py-2">Balance Due</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dues.map(d => (
//             <tr key={d._id} className="hover:bg-gray-50">
//               <td className="border px-3 py-2">{new Date(d.date).toLocaleDateString()}</td>
//               <td className="border px-3 py-2">{d.vendor}</td>
//               <td className="border px-3 py-2">{d.invoiceNo}</td>
//               <td className="border px-3 py-2">₹{d.totalAmount}</td>
//               <td className="border px-3 py-2">₹{d.paidAmount}</td>
//               <td className="border px-3 py-2">₹{d.balanceDue}</td>
//             </tr>
//           ))}
//           {dues.length === 0 && (
//             <tr>
//               <td className="border px-3 py-2 text-center" colSpan="6">
//                 No pending dues
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PurchaseDue;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PurchaseDue = () => {
  const [dues, setDues] = useState([]);
  const baseURL = "http://localhost:4000/api/purchases";

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await axios.get(`${baseURL}/dues`);
        setDues(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDues();
  }, []);

  // Calculate total dues
  const totalDues = dues.reduce((sum, d) => sum + (d.balanceDue || 0), 0);

  // Show total dues in alert
  const handleViewTotal = () => {
    Swal.fire({
      icon: "info",
      title: "Total Pending Dues",
      text: `₹${totalDues.toLocaleString()}`,
    });
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pending Purchase Dues</h2>
        <button
          onClick={handleViewTotal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Total Dues
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Vendor</th>
            <th className="border px-3 py-2">Invoice No</th>
            <th className="border px-3 py-2">Total Amount</th>
            <th className="border px-3 py-2">Paid Amount</th>
            <th className="border px-3 py-2">Balance Due</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d) => (
            <tr key={d._id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{new Date(d.date).toLocaleDateString()}</td>
              <td className="border px-3 py-2">{d.vendor}</td>
              <td className="border px-3 py-2">{d.invoiceNo}</td>
              <td className="border px-3 py-2">₹{d.totalAmount}</td>
              <td className="border px-3 py-2">₹{d.paidAmount}</td>
              <td className="border px-3 py-2">₹{d.balanceDue}</td>
            </tr>
          ))}
          {dues.length === 0 && (
            <tr>
              <td className="border px-3 py-2 text-center" colSpan="6">
                No pending dues
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseDue;
