import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

export default function ViewPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/purchase');
      setPurchases(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load purchases.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/purchase/${id}`);
      setPurchases(purchases.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  const openEditModal = (purchase) => {
    setEditData({
      ...purchase,
      purchaseDate: purchase.purchaseDate
        ? new Date(purchase.purchaseDate).toISOString().slice(0, 10)
        : '',
      quantity: purchase.quantity ?? 0,
      unitPrice: purchase.unitPrice ?? 0,
      tax: purchase.tax ?? 0,
      totalAmount: purchase.totalAmount ?? 0,
    });
  };

  const closeEditModal = () => setEditData(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => {
      let qty = prev.quantity ?? 0;
      let price = prev.unitPrice ?? 0;
      let tax = prev.tax ?? 0;
      let newVal = value;

      if (['quantity','unitPrice','tax'].includes(name)) {
        newVal = parseFloat(value) || 0;
        if (name === 'quantity') qty = newVal;
        if (name === 'unitPrice') price = newVal;
        if (name === 'tax') tax = newVal;
      }

      return {
        ...prev,
        [name]: newVal,
        totalAmount: +(qty * price + (qty * price * tax)/100).toFixed(2)
      };
    });
  };

  const handleSave = async () => {
  if (!editData) return;
  try {
    const updatedPurchase = {
      purchaseOrderNumber: editData.purchaseOrderNumber,
      sellerName: editData.sellerName,
      product: editData.product,
      size: editData.size || '',
      quantity: editData.quantity,
      unitPrice: editData.unitPrice,
      tax: editData.tax,
      totalAmount: editData.totalAmount,
      purchaseDate: editData.purchaseDate,
    };

    const res = await axios.put(`http://localhost:4000/api/purchase/${editData._id}`, updatedPurchase);

    setPurchases(purchases.map(p => p._id === editData._id ? res.data.purchase : p));
    closeEditModal();
    alert('Purchase updated!');
  } catch (err) {
    console.error(err.response?.data || err);
    alert('Update failed.');
  }
};


  const filtered = purchases.filter(p =>
    Object.values(p).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentPurchases = filtered.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <div className="w-full max-w-full px-6 py-4 mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Purchase Records</h1>

      <input
        type="text"
        placeholder="Search..."
        className="mb-4 w-full max-w-md px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        value={searchQuery}
        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
      />

      {currentPurchases.length > 0 ? (
        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="border px-2 py-1">PO Number</th>
                <th className="border px-2 py-1">Seller Name</th>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Tax</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPurchases.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 font-semibold">{p.purchaseOrderNumber}</td>
                  <td className="border px-2 py-1">{p.sellerName}</td>
                  <td className="border px-2 py-1">{p.product}</td>
                  <td className="border px-2 py-1">{p.quantity}</td>
                  <td className="border px-2 py-1">₹{p.unitPrice}</td>
                  <td className="border px-2 py-1">{p.tax}%</td>
                  <td className="border px-2 py-1">₹{p.totalAmount}</td>
                  <td className="border px-2 py-1">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  <td className="border px-2 py-1 flex space-x-2">
                    <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800"><FiEdit size={18}/></button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-center text-gray-600">No purchases found.</p>}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4 flex justify-center space-x-1">
          <button onClick={() => setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          {[...Array(totalPages)].map((_,i)=>(
            <button key={i} onClick={()=>setCurrentPage(i+1)} className={`px-3 py-1 border rounded ${currentPage===i+1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>{i+1}</button>
          ))}
          <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </nav>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeEditModal}></div>
          <div className="relative bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] p-6 z-50 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Edit Purchase</h2>
            <form onSubmit={e=>{e.preventDefault(); handleSave();}} className="space-y-4">
              {[ 
                {label:'PO Number',name:'purchaseOrderNumber',type:'text',readOnly:true},
                {label:'Seller Name',name:'sellerName',type:'text'},
                {label:'Product',name:'product',type:'text'},
                {label:'Quantity',name:'quantity',type:'number'},
                {label:'Purchased Price',name:'unitPrice',type:'number'},
                {label:'Tax (%)',name:'tax',type:'number'},
                {label:'Total Amount',name:'totalAmount',type:'number',readOnly:true},
                {label:'Purchase Date',name:'purchaseDate',type:'date'},
              ].map(f=>(
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={editData[f.name]??''}
                    onChange={handleChange}
                    readOnly={f.readOnly}
                    min={['quantity','unitPrice','tax'].includes(f.name)?0:undefined}
                    className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white py-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
