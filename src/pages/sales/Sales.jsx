import React from 'react';
import AddSales from './AddSales';
import ViewSales from './ViewSales';

export default function Sales() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {/* Layout: Add Sales form on the left, Sales table on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Sales Form */}
        <div className="bg-white p-4 shadow rounded">
          <AddSales />
        </div>

        {/* Sales List */}
        <div className="bg-white p-4 shadow rounded">
          <ViewSales />
        </div>
      </div>
    </div>
  );
}
