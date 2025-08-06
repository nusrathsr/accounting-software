import React from 'react';
import AddPurchase from './AddPurchase';
import ViewPurchase from './ViewPurchase';

export default function Purchase() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase</h1>

      {/* Layout: Add Purchase form on the left, Purchase table on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Purchase Form */}
        <div className="bg-white p-4 shadow rounded">
          <AddPurchase />
        </div>

        {/* Purchase List */}
        <div className="bg-white p-4 shadow rounded">
          <ViewPurchase />
        </div>
      </div>
    </div>
  );
}
